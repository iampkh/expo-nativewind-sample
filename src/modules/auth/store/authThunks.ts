import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  LoginCredentials,
  SignupCredentials,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  MFAVerification,
  GoogleOAuthCredentials,
  UserSession,
  AuthTokens,
  User,
  MFASetup,
} from '../types/auth.types';
import { AuthRepositoryImpl } from '../repositories/AuthRepository';
import { LoginUseCaseImpl } from '../useCases/LoginUseCase';
import { SignupUseCaseImpl } from '../useCases/SignupUseCase';
import { LogoutUseCaseImpl } from '../useCases/LogoutUseCase';
import { ForgotPasswordUseCaseImpl } from '../useCases/ForgotPasswordUseCase';
import { ResetPasswordUseCaseImpl } from '../useCases/ResetPasswordUseCase';
import { RefreshTokenUseCaseImpl } from '../useCases/RefreshTokenUseCase';
import { GoogleOAuthServiceImpl } from '../useCases/GoogleOAuthUseCase';
import { MFASetupUseCaseImpl } from '../useCases/MFASetupUseCase';
import { MFAVerificationUseCaseImpl } from '../useCases/MFAVerificationUseCase';
import {
  loginSuccess,
  mfaRequired,
  mfaVerified,
  logout,
  tokensRefreshed,
  userUpdated,
  sessionRestored,
  setError,
  setLoading,
} from './authSlice';

// Initialize dependencies
const authRepository = new AuthRepositoryImpl();
const loginUseCase = new LoginUseCaseImpl(authRepository);
const signupUseCase = new SignupUseCaseImpl(authRepository);
const logoutUseCase = new LogoutUseCaseImpl(authRepository);
const forgotPasswordUseCase = new ForgotPasswordUseCaseImpl(authRepository);
const resetPasswordUseCase = new ResetPasswordUseCaseImpl(authRepository);
const refreshTokenUseCase = new RefreshTokenUseCaseImpl(authRepository);
const googleOAuthService = new GoogleOAuthServiceImpl(authRepository);
const mfaSetupUseCase = new MFASetupUseCaseImpl(authRepository);
const mfaVerificationUseCase = new MFAVerificationUseCaseImpl(authRepository);

// Login thunk
export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      
      const response = await loginUseCase.execute(credentials);
      
      if (!response.success) {
        return rejectWithValue(response.error);
      }

      if (!response.data) {
        return rejectWithValue({ code: 'NO_DATA', message: 'No session data received' });
      }

      // Check if MFA is required
      if (response.data.user && !response.data.isAuthenticated && response.data.sessionId) {
        dispatch(mfaRequired({
          mfaToken: response.data.sessionId,
          user: response.data.user,
        }));
        return { requiresMFA: true, mfaToken: response.data.sessionId };
      }

      // Complete login
      dispatch(loginSuccess({
        user: response.data.user,
        tokens: response.data.tokens,
        sessionId: response.data.sessionId,
        loginMethod: response.data.loginMethod,
      }));

      return response.data;
    } catch (error) {
      return rejectWithValue({
        code: 'LOGIN_ERROR',
        message: error instanceof Error ? error.message : 'Login failed',
      });
    }
  }
);

// Signup thunk
export const signupThunk = createAsyncThunk(
  'auth/signup',
  async (credentials: SignupCredentials, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      
      const response = await signupUseCase.execute(credentials);
      
      if (!response.success) {
        return rejectWithValue(response.error);
      }

      if (!response.data) {
        return rejectWithValue({ code: 'NO_DATA', message: 'No session data received' });
      }

      dispatch(loginSuccess({
        user: response.data.user,
        tokens: response.data.tokens,
        sessionId: response.data.sessionId,
        loginMethod: response.data.loginMethod,
      }));

      return response.data;
    } catch (error) {
      return rejectWithValue({
        code: 'SIGNUP_ERROR',
        message: error instanceof Error ? error.message : 'Signup failed',
      });
    }
  }
);

// Logout thunk
export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      
      const response = await logoutUseCase.execute();
      
      dispatch(logout());
      
      return response.data;
    } catch (error) {
      // Even if logout fails on server, clear local state
      dispatch(logout());
      return true;
    }
  }
);

// Forgot password thunk
export const forgotPasswordThunk = createAsyncThunk(
  'auth/forgotPassword',
  async (request: ForgotPasswordRequest, { rejectWithValue }) => {
    try {
      const response = await forgotPasswordUseCase.execute(request);
      
      if (!response.success) {
        return rejectWithValue(response.error);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue({
        code: 'FORGOT_PASSWORD_ERROR',
        message: error instanceof Error ? error.message : 'Forgot password failed',
      });
    }
  }
);

// Reset password thunk
export const resetPasswordThunk = createAsyncThunk(
  'auth/resetPassword',
  async (request: ResetPasswordRequest, { rejectWithValue }) => {
    try {
      const response = await resetPasswordUseCase.execute(request);
      
      if (!response.success) {
        return rejectWithValue(response.error);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue({
        code: 'RESET_PASSWORD_ERROR',
        message: error instanceof Error ? error.message : 'Reset password failed',
      });
    }
  }
);

// Change password thunk
export const changePasswordThunk = createAsyncThunk(
  'auth/changePassword',
  async (request: ChangePasswordRequest, { rejectWithValue }) => {
    try {
      const response = await authRepository.changePassword(request);
      
      if (!response.success) {
        return rejectWithValue(response.error);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue({
        code: 'CHANGE_PASSWORD_ERROR',
        message: error instanceof Error ? error.message : 'Change password failed',
      });
    }
  }
);

// Refresh tokens thunk
export const refreshTokensThunk = createAsyncThunk(
  'auth/refreshTokens',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await refreshTokenUseCase.execute();
      
      if (!response.success) {
        // If refresh fails, logout user
        dispatch(logout());
        return rejectWithValue(response.error);
      }

      if (response.data) {
        dispatch(tokensRefreshed(response.data));
      }

      return response.data;
    } catch (error) {
      dispatch(logout());
      return rejectWithValue({
        code: 'REFRESH_ERROR',
        message: error instanceof Error ? error.message : 'Token refresh failed',
      });
    }
  }
);

// Google OAuth thunk
export const googleOAuthThunk = createAsyncThunk(
  'auth/googleOAuth',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      
      const response = await googleOAuthService.authenticateWithGoogle();
      
      if (!response.success) {
        return rejectWithValue(response.error);
      }

      if (!response.data) {
        return rejectWithValue({ code: 'NO_DATA', message: 'No session data received' });
      }

      dispatch(loginSuccess({
        user: response.data.user,
        tokens: response.data.tokens,
        sessionId: response.data.sessionId,
        loginMethod: response.data.loginMethod,
      }));

      return response.data;
    } catch (error) {
      return rejectWithValue({
        code: 'GOOGLE_OAUTH_ERROR',
        message: error instanceof Error ? error.message : 'Google sign-in failed',
      });
    }
  }
);

// MFA setup thunk
export const setupMFAThunk = createAsyncThunk(
  'auth/setupMFA',
  async (_, { rejectWithValue }) => {
    try {
      const response = await mfaSetupUseCase.execute();
      
      if (!response.success) {
        return rejectWithValue(response.error);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue({
        code: 'MFA_SETUP_ERROR',
        message: error instanceof Error ? error.message : 'MFA setup failed',
      });
    }
  }
);

// MFA verification thunk
export const verifyMFAThunk = createAsyncThunk(
  'auth/verifyMFA',
  async (verification: MFAVerification, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      
      const response = await mfaVerificationUseCase.execute(verification);
      
      if (!response.success) {
        return rejectWithValue(response.error);
      }

      // After successful MFA verification, get the session tokens
      const storedTokens = await authRepository.getStoredTokens();
      const storedSession = await authRepository.getStoredSession();
      
      if (storedTokens && storedSession) {
        dispatch(mfaVerified({
          tokens: storedTokens,
          sessionId: storedSession.sessionId,
        }));
      }

      return response.data;
    } catch (error) {
      return rejectWithValue({
        code: 'MFA_VERIFICATION_ERROR',
        message: error instanceof Error ? error.message : 'MFA verification failed',
      });
    }
  }
);

// Disable MFA thunk
export const disableMFAThunk = createAsyncThunk(
  'auth/disableMFA',
  async (verification: MFAVerification, { rejectWithValue }) => {
    try {
      const response = await mfaVerificationUseCase.disableMFA(verification);
      
      if (!response.success) {
        return rejectWithValue(response.error);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue({
        code: 'DISABLE_MFA_ERROR',
        message: error instanceof Error ? error.message : 'Disable MFA failed',
      });
    }
  }
);

// Update profile thunk
export const updateProfileThunk = createAsyncThunk(
  'auth/updateProfile',
  async (updates: Partial<User>, { dispatch, rejectWithValue }) => {
    try {
      const response = await authRepository.updateProfile(updates);
      
      if (!response.success) {
        return rejectWithValue(response.error);
      }

      if (response.data) {
        dispatch(userUpdated(response.data));
      }

      return response.data;
    } catch (error) {
      return rejectWithValue({
        code: 'UPDATE_PROFILE_ERROR',
        message: error instanceof Error ? error.message : 'Profile update failed',
      });
    }
  }
);

// Get current user thunk
export const getCurrentUserThunk = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await authRepository.getCurrentUser();
      
      if (!response.success) {
        return rejectWithValue(response.error);
      }

      if (response.data) {
        dispatch(userUpdated(response.data));
      }

      return response.data;
    } catch (error) {
      return rejectWithValue({
        code: 'GET_USER_ERROR',
        message: error instanceof Error ? error.message : 'Failed to get user info',
      });
    }
  }
);

// Restore session thunk (for app startup)
export const restoreSessionThunk = createAsyncThunk(
  'auth/restoreSession',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const storedSession = await authRepository.getStoredSession();
      
      if (!storedSession) {
        return null;
      }

      // Validate stored tokens
      const tokensValid = await authRepository.validateToken(storedSession.tokens.accessToken);
      
      if (!tokensValid.success || !tokensValid.data?.isValid) {
        // Try to refresh tokens
        const refreshResult = await refreshTokenUseCase.execute();
        
        if (!refreshResult.success) {
          // Clear invalid session
          await authRepository.logout();
          return null;
        }

        // Update stored session with new tokens
        if (refreshResult.data) {
          storedSession.tokens = refreshResult.data;
        }
      }

      dispatch(sessionRestored({
        user: storedSession.user,
        tokens: storedSession.tokens,
        sessionId: storedSession.sessionId,
        loginMethod: storedSession.loginMethod,
        lastActivity: storedSession.lastActivity,
      }));

      return storedSession;
    } catch (error) {
      // Clear any corrupted session data
      await authRepository.logout();
      return rejectWithValue({
        code: 'SESSION_RESTORE_ERROR',
        message: error instanceof Error ? error.message : 'Failed to restore session',
      });
    }
  }
);

// Delete account thunk
export const deleteAccountThunk = createAsyncThunk(
  'auth/deleteAccount',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await authRepository.deleteAccount();
      
      if (!response.success) {
        return rejectWithValue(response.error);
      }

      // Clear local session after successful account deletion
      dispatch(logout());

      return response.data;
    } catch (error) {
      return rejectWithValue({
        code: 'DELETE_ACCOUNT_ERROR',
        message: error instanceof Error ? error.message : 'Account deletion failed',
      });
    }
  }
);