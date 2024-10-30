import { EnumLocalStorage } from './type';

class LocalStorageService {
  // =================================================================
  // get item from local storage
  static getItem = ({ key, isObject = true }: { key: EnumLocalStorage; isObject?: boolean }) => {
    const value = localStorage.getItem(key);

    if (isObject && value && value !== 'undefined') {
      return JSON.parse(value);
    }

    return value;
  };

  // =================================================================
  // set item from local storage
  static setItem = ({ key, value, isObject = true }: { key: EnumLocalStorage; value: string | unknown; isObject?: boolean }) => {
    if (isObject && value && value !== 'undefined') {
      return localStorage.setItem(key, JSON.stringify(value));
    }

    return localStorage.setItem(key, value as string);
  };

  // =================================================================
  // remove item from local storage
  static removeItem({ key }: { key: EnumLocalStorage }): void {
    return localStorage.removeItem(key);
  }

  // =================================================================
  // remove all from local storage
  static removeAll({ skipList = [] }: { skipList?: (keyof typeof EnumLocalStorage)[] }): void {
    if (skipList.length) {
      Object.keys(EnumLocalStorage).forEach((key) => {
        if (!skipList.includes(key as keyof typeof EnumLocalStorage)) {
          localStorage.removeItem(key);
        }
      });

      return;
    }

    return localStorage.clear();
  }
}

export default LocalStorageService;
