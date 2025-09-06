export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export interface UserSession {
  user: User;
  tokens: AuthTokens;
  isAuthenticated: boolean;
  loginMethod: LoginMethod;
  mfaEnabled: boolean;
  sessionId: string;
  lastActivity: string;
}

export type LoginMethod = 'email' | 'google' | 'apple' | 'facebook';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
  acceptTerms: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface OAuthProviderConfig {
  clientId: string;
  redirectUrl: string;
  scopes: string[];
}

export interface GoogleOAuthCredentials {
  idToken: string;
  accessToken?: string;
}

export interface MFASetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface MFAVerification {
  code: string;
  backupCode?: string;
}

export interface MFAToken {
  token: string;
  expiresAt: string;
  userId: string;
}

export interface AuthError {
  code: string;
  message: string;
  field?: string;
}

export interface AuthResponse<T = any> {
  success: boolean;
  data?: T;
  error?: AuthError;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface TokenValidationResult {
  isValid: boolean;
  expiresAt?: string;
  user?: User;
}

// Auth state management types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  tokens: AuthTokens | null;
  sessionId: string | null;
  mfaRequired: boolean;
  mfaToken: string | null;
  loginMethod: LoginMethod | null;
  lastActivity: string | null;
}

// Repository interfaces
export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<AuthResponse<UserSession>>;
  signup(credentials: SignupCredentials): Promise<AuthResponse<UserSession>>;
  logout(): Promise<AuthResponse<boolean>>;
  forgotPassword(request: ForgotPasswordRequest): Promise<AuthResponse<boolean>>;
  resetPassword(request: ResetPasswordRequest): Promise<AuthResponse<boolean>>;
  changePassword(request: ChangePasswordRequest): Promise<AuthResponse<boolean>>;
  refreshTokens(request: RefreshTokenRequest): Promise<AuthResponse<AuthTokens>>;
  validateToken(token: string): Promise<AuthResponse<TokenValidationResult>>;
  getCurrentUser(): Promise<AuthResponse<User>>;
  updateProfile(updates: Partial<User>): Promise<AuthResponse<User>>;
  deleteAccount(): Promise<AuthResponse<boolean>>;
  
  // OAuth methods
  loginWithGoogle(credentials: GoogleOAuthCredentials): Promise<AuthResponse<UserSession>>;
  
  // MFA methods
  setupMFA(): Promise<AuthResponse<MFASetup>>;
  verifyMFA(verification: MFAVerification): Promise<AuthResponse<boolean>>;
  disableMFA(verification: MFAVerification): Promise<AuthResponse<boolean>>;
  generateBackupCodes(): Promise<AuthResponse<string[]>>;
  
  // Session management methods
  isAuthenticated(): Promise<boolean>;
  getStoredSession(): Promise<UserSession | null>;
  getStoredTokens(): Promise<AuthTokens | null>;
  saveMFAToken(token: MFAToken): Promise<void>;
  getMFAToken(): Promise<MFAToken | null>;
  clearMFAToken(): Promise<void>;
}

// Use case interfaces
export interface AuthUseCases {
  loginUseCase: LoginUseCase;
  signupUseCase: SignupUseCase;
  logoutUseCase: LogoutUseCase;
  forgotPasswordUseCase: ForgotPasswordUseCase;
  resetPasswordUseCase: ResetPasswordUseCase;
  changePasswordUseCase: ChangePasswordUseCase;
  refreshTokenUseCase: RefreshTokenUseCase;
  googleOAuthUseCase: GoogleOAuthUseCase;
  mfaSetupUseCase: MFASetupUseCase;
  mfaVerificationUseCase: MFAVerificationUseCase;
}

export interface LoginUseCase {
  execute(credentials: LoginCredentials): Promise<AuthResponse<UserSession>>;
}

export interface SignupUseCase {
  execute(credentials: SignupCredentials): Promise<AuthResponse<UserSession>>;
}

export interface LogoutUseCase {
  execute(): Promise<AuthResponse<boolean>>;
}

export interface ForgotPasswordUseCase {
  execute(request: ForgotPasswordRequest): Promise<AuthResponse<boolean>>;
}

export interface ResetPasswordUseCase {
  execute(request: ResetPasswordRequest): Promise<AuthResponse<boolean>>;
}

export interface ChangePasswordUseCase {
  execute(request: ChangePasswordRequest): Promise<AuthResponse<boolean>>;
}

export interface RefreshTokenUseCase {
  execute(): Promise<AuthResponse<AuthTokens>>;
}

export interface GoogleOAuthUseCase {
  execute(): Promise<AuthResponse<UserSession>>;
}

export interface MFASetupUseCase {
  execute(): Promise<AuthResponse<MFASetup>>;
}

export interface MFAVerificationUseCase {
  execute(verification: MFAVerification): Promise<AuthResponse<boolean>>;
}

// Storage interfaces
export interface AuthStorage {
  saveSession(session: UserSession): Promise<void>;
  getSession(): Promise<UserSession | null>;
  clearSession(): Promise<void>;
  saveTokens(tokens: AuthTokens): Promise<void>;
  getTokens(): Promise<AuthTokens | null>;
  clearTokens(): Promise<void>;
  saveMFAToken(token: MFAToken): Promise<void>;
  getMFAToken(): Promise<MFAToken | null>;
  clearMFAToken(): Promise<void>;
}

// API client types
export interface AuthApiClient {
  post<T>(endpoint: string, data: any): Promise<T>;
  get<T>(endpoint: string): Promise<T>;
  put<T>(endpoint: string, data: any): Promise<T>;
  delete<T>(endpoint: string): Promise<T>;
}

// Validation types
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export interface ValidationRules {
  [field: string]: ValidationRule;
}

export interface ValidationResult {
  isValid: boolean;
  errors: { [field: string]: string };
}

// Event types for auth state changes
export type AuthEventType = 
  | 'login_success'
  | 'login_failed'
  | 'logout'
  | 'signup_success'
  | 'signup_failed'
  | 'token_refresh'
  | 'token_expired'
  | 'mfa_required'
  | 'mfa_verified'
  | 'session_expired';

export interface AuthEvent {
  type: AuthEventType;
  payload?: any;
  timestamp: string;
}