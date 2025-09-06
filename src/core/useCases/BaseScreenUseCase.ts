import { AbstractBaseUseCase } from './BaseUseCase';
import { ScreenUseCase, UseCaseContext } from './types';

export abstract class AbstractScreenUseCase extends AbstractBaseUseCase implements ScreenUseCase {
  private initialized = false;
  private focused = false;

  constructor(context: UseCaseContext) {
    super(context);
  }

  // Screen lifecycle methods
  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      await this.onInitialize();
      this.initialized = true;
    } catch (error) {
      console.error(`Error initializing ${this.constructor.name}:`, error);
      throw error;
    }
  }

  async cleanup(): Promise<void> {
    if (!this.initialized) return;

    try {
      await this.onCleanup();
      this.initialized = false;
      this.focused = false;
    } catch (error) {
      console.error(`Error cleaning up ${this.constructor.name}:`, error);
    }
  }

  async onFocus(): Promise<void> {
    if (this.focused) return;

    try {
      this.focused = true;
      await this.onScreenFocus();
    } catch (error) {
      console.error(`Error on focus ${this.constructor.name}:`, error);
    }
  }

  async onBlur(): Promise<void> {
    if (!this.focused) return;

    try {
      this.focused = false;
      await this.onScreenBlur();
    } catch (error) {
      console.error(`Error on blur ${this.constructor.name}:`, error);
    }
  }

  // Abstract methods for screen-specific implementations
  protected abstract onInitialize(): Promise<void> | void;
  protected abstract onCleanup(): Promise<void> | void;
  
  // Optional lifecycle hooks
  protected onScreenFocus(): Promise<void> | void {
    // Default implementation - can be overridden
  }

  protected onScreenBlur(): Promise<void> | void {
    // Default implementation - can be overridden
  }

  // Getters for screen state
  get isInitialized(): boolean {
    return this.initialized;
  }

  get isFocused(): boolean {
    return this.focused;
  }
}