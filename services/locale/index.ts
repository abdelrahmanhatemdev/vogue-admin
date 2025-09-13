// locale-service.ts - Updated LocaleService with safety checks
interface LocaleResolver {
  get(): string | Promise<string>;
}

class LocaleService {
  private resolver?: LocaleResolver;
  private defaultLocale = 'en';

  setLocaleResolver(resolver: LocaleResolver) {
    this.resolver = resolver;
  }

  get(): string | Promise<string> {
    if (!this.resolver) {
      console.warn('LocaleResolver not set, using default locale');
      return this.defaultLocale;
    }
    return this.resolver.get();
  }

  // Helper method to check if resolver is set
  isResolverSet(): boolean {
    return !!this.resolver;
  }
}

export default new LocaleService();

// Example resolver implementations
export class BrowserLocaleResolver implements LocaleResolver {
  get(): string {
    if (typeof window !== 'undefined' && navigator.language) {
      return navigator.language.split('-')[0]; // e.g., 'en-US' -> 'en'
    }
    return 'en';
  }
}

export class NextJsLocaleResolver implements LocaleResolver {
  get(): string {
    // For Next.js apps with internationalization
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      const locale = pathname.split('/')[1];
      return ['en', 'ar', 'de'].includes(locale) ? locale : 'en';
    }
    return 'en';
  }
}

export class StorageLocaleResolver implements LocaleResolver {
  private storageKey: string;

  constructor(storageKey = 'locale') {
    this.storageKey = storageKey;
  }

  get(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.storageKey) || 'en';
    }
    return 'en';
  }
}