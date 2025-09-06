import React, { useState, useEffect } from 'react';
import { Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { View, Text } from '@/src/shared/components/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/src/store';
import { loginThunk, signupThunk, clearError, restoreSessionThunk } from '@/src/modules/auth/store';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('demo@example.com'); // Pre-filled for testing
  const [password, setPassword] = useState('Test123!@#'); // Pre-filled for testing
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Restore session on app start
  useEffect(() => {
    dispatch(restoreSessionThunk());
  }, [dispatch]);

  // Navigate to main app when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace('/');
    }
  }, [isAuthenticated, user]);

  const handleSubmit = async () => {
    if (isLogin) {
      // Login
      const result = await dispatch(loginThunk({
        email,
        password,
      }));
      
      if (loginThunk.fulfilled.match(result)) {
        Alert.alert('Success', `Welcome back, ${result.payload.user.name || result.payload.user.email}!`);
      } else if (loginThunk.rejected.match(result)) {
        Alert.alert('Login Failed', result.payload?.message || 'Please check your credentials');
      }
    } else {
      // Signup
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }
      
      if (!name.trim()) {
        Alert.alert('Error', 'Please enter your name');
        return;
      }
      
      const result = await dispatch(signupThunk({
        email,
        password,
        confirmPassword,
        name,
        acceptTerms: true,
      }));
      
      if (signupThunk.fulfilled.match(result)) {
        Alert.alert('Success', `Welcome ${result.payload.user.name || result.payload.user.email}!`);
      } else if (signupThunk.rejected.match(result)) {
        Alert.alert('Registration Failed', result.payload?.message || 'Please try again');
      }
    }
  };

  const clearErrorHandler = () => {
    dispatch(clearError());
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    clearErrorHandler();
    // Clear signup-specific fields when switching to login
    if (!isLogin) {
      setName('');
      setConfirmPassword('');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center p-6">
            {/* Header */}
            <View className="items-center mb-8">
              <Text variant="primary" size="2xl" className="font-bold text-center mb-2">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </Text>
              <Text variant="secondary" size="base" className="text-center">
                {isLogin 
                  ? 'Sign in to continue to your account' 
                  : 'Sign up to get started with your account'
                }
              </Text>
            </View>

            {/* Form Card */}
            <View className="bg-card rounded-2xl p-6 shadow-sm mx-2">
              {/* Error Message */}
              {error && (
                <View className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                  <Text className="text-red-700 text-sm font-medium">{error}</Text>
                  <TouchableOpacity onPress={clearErrorHandler} className="mt-2">
                    <Text className="text-red-500 text-xs underline">Dismiss</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Name Input (Signup only) */}
              {!isLogin && (
                <View className="mb-4">
                  <Text variant="secondary" size="sm" className="mb-2 ml-1">
                    Full Name
                  </Text>
                  <TextInput
                    className="border border-border rounded-xl p-4 bg-background text-foreground text-base"
                    placeholder="Enter your full name"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    returnKeyType="next"
                  />
                </View>
              )}

              {/* Email Input */}
              <View className="mb-4">
                <Text variant="secondary" size="sm" className="mb-2 ml-1">
                  Email Address
                </Text>
                <TextInput
                  className="border border-border rounded-xl p-4 bg-background text-foreground text-base"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  returnKeyType="next"
                />
              </View>

              {/* Password Input */}
              <View className="mb-4">
                <Text variant="secondary" size="sm" className="mb-2 ml-1">
                  Password
                </Text>
                <TextInput
                  className="border border-border rounded-xl p-4 bg-background text-foreground text-base"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  returnKeyType={!isLogin ? "next" : "done"}
                />
              </View>

              {/* Confirm Password (Signup only) */}
              {!isLogin && (
                <View className="mb-6">
                  <Text variant="secondary" size="sm" className="mb-2 ml-1">
                    Confirm Password
                  </Text>
                  <TextInput
                    className="border border-border rounded-xl p-4 bg-background text-foreground text-base"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    autoComplete="new-password"
                    returnKeyType="done"
                  />
                </View>
              )}

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading}
                className={`rounded-xl p-4 mb-4 ${
                  loading 
                    ? 'bg-gray-300' 
                    : 'bg-blue-500 active:bg-blue-600'
                }`}
              >
                {loading ? (
                  <View className="flex-row items-center justify-center">
                    <ActivityIndicator color="white" size="small" />
                    <Text className="text-white font-semibold ml-2">
                      {isLogin ? 'Signing In...' : 'Creating Account...'}
                    </Text>
                  </View>
                ) : (
                  <Text className="text-white text-center font-semibold text-base">
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </Text>
                )}
              </TouchableOpacity>

              {/* Toggle Mode Button */}
              <TouchableOpacity
                onPress={toggleMode}
                className="py-3"
                disabled={loading}
              >
                <Text className="text-blue-500 text-center font-medium">
                  {isLogin 
                    ? "Don't have an account? Sign up" 
                    : 'Already have an account? Sign in'
                  }
                </Text>
              </TouchableOpacity>
            </View>

            {/* Demo Credentials Info */}
            <View className="mt-6 p-4 bg-yellow-50 rounded-xl mx-2">
              <Text variant="secondary" size="sm" className="text-center mb-2 font-medium">
                🧪 Demo Credentials (Pre-filled)
              </Text>
              <Text variant="secondary" size="xs" className="text-center">
                Email: demo@example.com
              </Text>
              <Text variant="secondary" size="xs" className="text-center">
                Password: Test123!@#
              </Text>
              <Text variant="secondary" size="xs" className="text-center mt-2 opacity-70">
                These are pre-filled for easy testing
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}