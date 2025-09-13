interface StorageProvider {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
}

class StorageService {
  private provider!: StorageProvider;

  setStorageProvider(provider: StorageProvider) {
    this.provider = provider;
  }

  get(key: string): Promise<string | null> {
    return this.provider.get(key);
  }

  set(key: string, value: string): Promise<void> {
    return this.provider.set(key, value);
  }
}

export default new StorageService();