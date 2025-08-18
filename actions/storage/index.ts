class StorageService {
  setStorageProvider(provider) {
    this.provider = provider;
  }

  get(key) {
    return this.provider.get(key);
  }

  set(key, value) {
    return this.provider.set(key, value);
  }
}

export default new StorageService();
