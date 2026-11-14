// Where the login session is saved on phones. expo-sqlite adds a global
// `localStorage` backed by the device's SQLite database.
import 'expo-sqlite/localStorage/install';

export const authStorage: Storage | undefined = localStorage;
