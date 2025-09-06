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

  const handleSubmit = async () => {
    if (isLogin) {
      // Login
      const result = await dispatch(loginThunk({
        email,
        password,
      }));
      
      if (loginThunk.fulfilled.match(result)) {
        const userSession = result.payload as any;
        const user = userSession.user || userSession;
        Alert.alert(
          'Login Success! ✅', 
          `Authentication successful!\n\nUser: ${user.name || user.email}\nEmail: ${user.email}\n\nThis is a demo - login flow is working correctly.`,
          [{ text: 'OK', onPress: () => console.log('Login demo completed') }]
        );
      } else if (loginThunk.rejected.match(result)) {
        const errorPayload = result.payload as any;
        Alert.alert(
          'Login Failed ❌', 
          `Authentication failed.\n\nReason: ${errorPayload?.message || 'Invalid credentials'}\n\nTry: demo@example.com / Test123!@#`,
          [{ text: 'Try Again', onPress: () => console.log('Login failed demo') }]
        );
      }
    } else {
      // Signup
      if (password !== confirmPassword) {
        Alert.alert('Validation Error', 'Passwords do not match');
        return;
      }
      
      if (!name.trim()) {
        Alert.alert('Validation Error', 'Please enter your name');
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
        const userSession = result.payload as any;
        const user = userSession.user || userSession;
        Alert.alert(
          'Signup Success! ✅',
          `Account created successfully!\n\nUser: ${user.name || user.email}\nEmail: ${user.email}\n\nThis is a demo - signup flow is working correctly.`,
          [{ text: 'OK', onPress: () => console.log('Signup demo completed') }]
        );
      } else if (signupThunk.rejected.match(result)) {
        const errorPayload = result.payload as any;
        Alert.alert(
          'Signup Failed ❌',
          `Account creation failed.\n\nReason: ${errorPayload?.message || 'Please try again'}\n\nThis is a demo - check your input.`,
          [{ text: 'Try Again', onPress: () => console.log('Signup failed demo') }]
        );
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
            <View className="mb-8">
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-1" />
                <TouchableOpacity
                  onPress={() => router.push('/HomeScreen')}
                  className="bg-card border border-border rounded-lg px-3 py-2"
                >
                  <Text variant="secondary" size="sm">← Home</Text>
                </TouchableOpacity>
              </View>
              <View className="items-center">
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
            <View className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl mx-2 border border-blue-200 dark:border-blue-800">
              <Text variant="primary" size="sm" className="text-center mb-3 font-semibold text-blue-700 dark:text-blue-300">
                🧪 Authentication Demo
              </Text>
              <Text variant="secondary" size="xs" className="text-center mb-2">
                <Text className="font-medium">Demo Credentials (Pre-filled):</Text>
              </Text>
              <Text variant="secondary" size="xs" className="text-center font-mono bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">
                demo@example.com / Test123!@#
              </Text>
              <Text variant="secondary" size="xs" className="text-center mt-3 opacity-80">
                This demo shows authentication flow with mock data.
                Success/failure dialogs will appear after submission.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}