import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  AuthState,
  User,
  AuthTokens,
  LoginMethod,
  AuthError,
} from '../types/auth.types';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  tokens: null,
  sessionId: null,
  mfaRequired: false,
  mfaToken: null,
  loginMethod: null,
  lastActivity: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
      state.error = null;
    },

    // Error handling
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },

    setAuthError: (state, action: PayloadAction<AuthError | null>) => {
      state.error = action.payload?.message || null;
      state.loading = false;
    },

    // Authentication success
    loginSuccess: (state, action: PayloadAction<{
      user: User;
      tokens: AuthTokens;
      sessionId: string;
      loginMethod: LoginMethod;
    }>) => {
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      state.sessionId = action.payload.sessionId;
      state.loginMethod = action.payload.loginMethod;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      state.mfaRequired = false;
      state.mfaToken = null;
      state.lastActivity = new Date().toISOString();
    },

    // MFA required state
    mfaRequired: (state, action: PayloadAction<{
      mfaToken: string;
      user?: Partial<User>;
    }>) => {
      state.mfaRequired = true;
      state.mfaToken = action.payload.mfaToken;
      state.loading = false;
      state.error = null;
      // Partially set user info if available
      if (action.payload.user) {
        state.user = { ...state.user, ...action.payload.user } as User;
      }
    },

    // MFA verification success
    mfaVerified: (state, action: PayloadAction<{
      tokens: AuthTokens;
      sessionId: string;
    }>) => {
      state.tokens = action.payload.tokens;
      state.sessionId = action.payload.sessionId;
      state.isAuthenticated = true;
      state.mfaRequired = false;
      state.mfaToken = null;
      state.loading = false;
      state.error = null;
      state.lastActivity = new Date().toISOString();
    },

    // Logout
    logout: (state) => {
      return { ...initialState };
    },

    // Token refresh
    tokensRefreshed: (state, action: PayloadAction<AuthTokens>) => {
      state.tokens = action.payload;
      state.lastActivity = new Date().toISOString();
    },

    // User profile update
    userUpdated: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    // Session restoration (on app startup)
    sessionRestored: (state, action: PayloadAction<{
      user: User;
      tokens: AuthTokens;
      sessionId: string;
      loginMethod: LoginMethod;
      lastActivity: string;
    }>) => {
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      state.sessionId = action.payload.sessionId;
      state.loginMethod = action.payload.loginMethod;
      state.lastActivity = action.payload.lastActivity;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Update last activity
    updateLastActivity: (state) => {
      state.lastActivity = new Date().toISOString();
    },

    // Clear MFA state
    clearMFA: (state) => {
      state.mfaRequired = false;
      state.mfaToken = null;
    },

    // Session expired
    sessionExpired: (state) => {
      return {
        ...initialState,
        error: 'Your session has expired. Please log in again.',
      };
    },
  },
});

export const {
  setLoading,
  setError,
  setAuthError,
  loginSuccess,
  mfaRequired,
  mfaVerified,
  logout,
  tokensRefreshed,
  userUpdated,
  sessionRestored,
  clearError,
  updateLastActivity,
  clearMFA,
  sessionExpired,
} = authSlice.actions;

export default authSlice.reducer;