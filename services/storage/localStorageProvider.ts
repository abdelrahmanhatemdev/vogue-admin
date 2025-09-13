const LocalStorageProvider = {
  async get(key: string): Promise<string | null> {
    return localStorage.getItem(key);
  },

  async set(key: string, value: string): Promise<void> {
    localStorage.setItem(key, value);
  },
};

export default LocalStorageProvider;