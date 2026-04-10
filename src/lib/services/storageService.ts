import { get, set, del } from 'idb-keyval';

export async function storageGet<T>(key: string): Promise<T | undefined> {
  return await get<T>(key);
}

export async function storageSet<T>(key: string, value: T): Promise<void> {
  await set(key, value);
}

export async function storageDel(key: string): Promise<void> {
  await del(key);
}
