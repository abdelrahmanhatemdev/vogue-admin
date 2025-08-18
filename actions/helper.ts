import axios, { 
  AxiosInstance, 
  AxiosResponse, 
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosHeaders
} from "axios";

import LocaleService from "@/actions/locale";
import StorageService from "@/actions/storage";

// Type definitions
interface ApplicationErrorResponse {
  status: false;
  message?: string;
  [key: string]: any;
}

interface CustomAxiosError extends Error {
  response?: {
    data: any;
    status: number;
    statusText: string;
  };
  isApplicationError?: boolean;
}

type TokenCallback = (accessToken: string | null) => boolean | void;

// Constants
const TOKEN_KEY = "token" as const;
const LOCALIZATION_HEADER = "X-localization" as const;
const ACCEPT_LANGUAGE_HEADER = "Accept-Language" as const;
const AUTH_HEADER = "Authorization" as const;
const LOGIN_PATH = "/login" as const;
const DEFAULT_ERROR_MESSAGE = "Operation failed" as const;

class HttpHelpers {
  private apiBaseUrl?: string;
  private authenticatedAxios!: AxiosInstance;
  private unAuthenticatedAxios!: AxiosInstance;
  private readonly subscribers: TokenCallback[] = [];

  constructor() {
    // Constructor kept minimal
  }

  /**
   * Initialize HTTP helpers with base URL and setup interceptors
   * @param apiBaseUrl - The base URL for API requests
   */
  
  public setBaseUrl(apiBaseUrl: string): void {
    this.validateBaseUrl(apiBaseUrl);
    
    this.apiBaseUrl = apiBaseUrl;
    this.setupAxiosInstances();
    this.setupInterceptors();
  }

  /**
   * Get authentication token from storage
   * @returns Promise resolving to token or null
   */
  public async getToken(): Promise<string | null> {
    try {
      return await StorageService.get(TOKEN_KEY);
    } catch (error) {
      console.error("Failed to retrieve token:", error);
      return null;
    }
  }

  /**
   * Get current locale
   * @returns Promise resolving to locale string
   */
  public async getLocale(): Promise<string> {
    try {
      return await LocaleService.get();
    } catch (error) {
      console.error("Failed to retrieve locale:", error);
      return "en"; // fallback locale
    }
  }

  /**
   * Notify all subscribers when access token is fetched/removed
   * @param accessToken - The new access token or null if removed
   */
  public onAccessTokenFetched(accessToken: string | null): void {
    this.subscribers.splice(0).forEach(callback => {
      try {
        callback(accessToken);
      } catch (error) {
        console.error("Error in token callback:", error);
      }
    });
  }

  /**
   * Subscribe to token changes
   * @param callback - Function to call when token changes
   */
  public addSubscriber(callback: TokenCallback): void {
    if (typeof callback !== 'function') {
      throw new Error('Callback must be a function');
    }
    this.subscribers.push(callback);
  }

  /**
   * Handle application-level errors from backend responses
   * @param response - Axios response object
   * @returns Original response or rejected promise for application errors
   */
  public handleApplicationError<T = any>(
    response: AxiosResponse<T>
  ): AxiosResponse<T> | Promise<never> {
    const { data } = response;
    
    if (this.isApplicationError(data)) {
      return Promise.reject(this.createApplicationError(data));
    }
    
    return response;
  }

  /**
   * Get authenticated axios instance
   */
  public get authenticated(): AxiosInstance {
    if (!this.authenticatedAxios) {
      throw new Error('HttpHelpers not initialized. Call setBaseUrl() first.');
    }
    return this.authenticatedAxios;
  }

  /**
   * Get unauthenticated axios instance
   */
  public get unauthenticated(): AxiosInstance {
    if (!this.unAuthenticatedAxios) {
      throw new Error('HttpHelpers not initialized. Call setBaseUrl() first.');
    }
    return this.unAuthenticatedAxios;
  }

  // Private methods

  private validateBaseUrl(url: string): void {
    if (!url || typeof url !== 'string') {
      throw new Error('Base URL must be a non-empty string');
    }
    
    try {
      new URL(url);
    } catch {
      throw new Error('Invalid base URL format');
    }
  }

  private setupAxiosInstances(): void {
    const config = { baseURL: this.apiBaseUrl };
    this.authenticatedAxios = axios.create(config);
    this.unAuthenticatedAxios = axios.create(config);
  }

  private setupInterceptors(): void {
    this.setupAuthenticatedInterceptors();
    this.setupUnauthenticatedInterceptors();
  }

  private isApplicationError(data: any): data is ApplicationErrorResponse {
    return data && 
           typeof data === 'object' && 
           'status' in data && 
           data.status === false;
  }

  private createApplicationError(data: ApplicationErrorResponse): CustomAxiosError {
    const error = new Error(data.message || DEFAULT_ERROR_MESSAGE) as CustomAxiosError;
    error.response = {
      data,
      status: 200,
      statusText: 'OK'
    };
    error.isApplicationError = true;
    return error;
  }

  private async createRequestInterceptor(
    config: InternalAxiosRequestConfig, 
    includeAuth: boolean = false
  ): Promise<InternalAxiosRequestConfig> {
    await this.addLocaleHeader(config, includeAuth);
    
    if (includeAuth) {
      await this.addAuthHeader(config);
    }

    return config;
  }

  private async addLocaleHeader(
    config: InternalAxiosRequestConfig, 
    isAuthenticated: boolean
  ): Promise<void> {
    const locale = await this.getLocale();
    const headerName = isAuthenticated ? LOCALIZATION_HEADER : ACCEPT_LANGUAGE_HEADER;
    
    this.ensureHeaders(config);
    config.headers.set(headerName, locale);
  }

  private async addAuthHeader(config: InternalAxiosRequestConfig): Promise<void> {
    const token = await this.getToken();
    
    if (token) {
      this.ensureHeaders(config);
      config.headers.set(AUTH_HEADER, `Bearer ${token}`);
    }
  }

  private ensureHeaders(config: InternalAxiosRequestConfig): void {
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }
  }

  private async handleAuthError(error: AxiosError): Promise<never> {
    if (this.isUnauthorized(error)) {
      await this.handleUnauthorizedError();
    }
    
    return Promise.reject(error);
  }

  private isUnauthorized(error: AxiosError): boolean {
    return error.response?.status === 401;
  }

  private async handleUnauthorizedError(): Promise<void> {
    try {
      this.clearTokens();
      this.notifyTokenRemoval();
      this.redirectToLogin();
    } catch (error) {
      console.error("Error handling unauthorized request:", error);
    }
  }

  private clearTokens(): void {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  }

  private notifyTokenRemoval(): void {
    this.onAccessTokenFetched(null);
  }

  private redirectToLogin(): void {
    if (typeof window !== 'undefined' && window.location) {
      window.location.pathname = LOGIN_PATH;
    }
  }

  private setupAuthenticatedInterceptors(): void {
    this.authenticatedAxios.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => this.createRequestInterceptor(config, true),
      (error: AxiosError) => Promise.reject(error)
    );

    this.authenticatedAxios.interceptors.response.use(
      <T = any>(response: AxiosResponse<T>) => this.handleApplicationError(response),
      (error: AxiosError) => this.handleAuthError(error)
    );
  }

  private setupUnauthenticatedInterceptors(): void {
    this.unAuthenticatedAxios.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => this.createRequestInterceptor(config, false),
      (error: AxiosError) => Promise.reject(error)
    );

    this.unAuthenticatedAxios.interceptors.response.use(
      <T = any>(response: AxiosResponse<T>) => this.handleApplicationError(response),
      (error: AxiosError) => Promise.reject(error)
    );
  }
}

// Export singleton instance
export default new HttpHelpers();