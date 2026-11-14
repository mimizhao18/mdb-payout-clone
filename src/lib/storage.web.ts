// On web the browser already has a real localStorage, so there is nothing to
// install. (It is missing during server-side rendering, hence the check.)
export const authStorage: Storage | undefined =
  typeof localStorage === 'undefined' ? undefined : localStorage;
