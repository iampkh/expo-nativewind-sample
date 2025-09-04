import React, { useState } from 'react';
import { Alert, ActivityIndicator } from 'react-native';
import { View, Text } from '@/src/shared/components/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/src/store';
import { loginThunk, signupThunk, clearError } from '@/src/modules/auth/store';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('demo@example.com'); // Pre-filled for testing
  const [password, setPassword] = useState('Test123'); // Pre-filled for testing
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleSubmit = async () => {
    if (isLogin) {
      // Login
      const result = await dispatch(loginThunk({
        email,
        password,
      }));
      
      if (loginThunk.fulfilled.match(result)) {
        Alert.alert('Success', 'Login successful!');
      }
    } else {
      // Signup
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
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
        Alert.alert('Success', 'Registration successful!');
      }
    }
  };

  const clearErrorHandler = () => {
    dispatch(clearError());
  };

  if (isAuthenticated) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 justify-center items-center p-6">
          <Text variant="primary" size="xl" className="text-center mb-4">
            🎉 Authentication Successful!
          </Text>
          <Text variant="secondary" size="base" className="text-center">
            You are now logged in to the auth service
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center p-6">
        <View className="bg-card rounded-lg p-6 shadow-sm">
          <Text variant="primary" size="xl" className="text-center mb-6">
            {isLogin ? 'Login' : 'Sign Up'}
          </Text>

          {error && (
            <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <Text className="text-red-700 text-sm">{error}</Text>
              <TouchableOpacity onPress={clearErrorHandler}>
                <Text className="text-red-500 text-xs mt-1 underline">Dismiss</Text>
              </TouchableOpacity>
            </View>
          )}

          {!isLogin && (
            <TextInput
              className="border border-border rounded-lg p-3 mb-4 bg-background text-foreground"
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          )}

          <TextInput
            className="border border-border rounded-lg p-3 mb-4 bg-background text-foreground"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <TextInput
            className="border border-border rounded-lg p-3 mb-4 bg-background text-foreground"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete={isLogin ? "current-password" : "new-password"}
          />

          {!isLogin && (
            <TextInput
              className="border border-border rounded-lg p-3 mb-4 bg-background text-foreground"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoComplete="new-password"
            />
          )}

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className={`rounded-lg p-4 mb-4 ${loading ? 'bg-gray-300' : 'bg-blue-500'}`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-medium">
                {isLogin ? 'Login' : 'Sign Up'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setIsLogin(!isLogin);
              clearErrorHandler();
            }}
            className="py-2"
          >
            <Text className="text-blue-500 text-center">
              {isLogin ? 'Need an account? Sign up' : 'Have an account? Login'}
            </Text>
          </TouchableOpacity>

          {/* Demo credentials info */}
          <View className="mt-4 pt-4 border-t border-border">
            <Text variant="secondary" size="sm" className="text-center mb-2">
              Demo Credentials:
            </Text>
            <Text variant="secondary" size="xs" className="text-center">
              Email: demo@example.com
            </Text>
            <Text variant="secondary" size="xs" className="text-center">
              Password: Test123
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}