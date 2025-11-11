
export const LocalStorageManager = {
  /**
   * Retrieves an item from Local Storage and parses it as JSON.
   * @param key The key of the item to retrieve.
   * @returns The parsed object, or null if the item doesn't exist or there's a parsing error.
   */
  getItem: <T,>(key: string): T | null => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error(`Error getting item with key "${key}" from Local Storage:`, error);
      return null;
    }
  },

  /**
   * Stores an item in Local Storage after converting it to a JSON string.
   * @param key The key under which to store the item.
   * @param value The value to store.
   */
  setItem: <T,>(key: string, value: T): void => {
    try {
      const serializedValue = JSON.stringify(value);
      window.localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Error setting item with key "${key}" in Local Storage:`, error);
    }
  },

  /**
   * Removes an item from Local Storage.
   * @param key The key of the item to remove.
   */
  removeItem: (key: string): void => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item with key "${key}" from Local Storage:`, error);
    }
  }
};
