// Simple password hashing utility
// In a production environment, use a proper library like bcrypt

export const hashPassword = (password: string): string => {
  // This is a simple hash function for demo purposes
  // In production, use bcrypt or similar
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `hash_${Math.abs(hash)}_${password.length}`;
};

export const verifyPassword = (password: string, hash: string): boolean => {
  const computedHash = hashPassword(password);
  return computedHash === hash;
};

export const generateSessionToken = (): string => {
  return 'session_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

export const isPasswordStrong = (password: string): boolean => {
  // Basic password strength validation
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  
  return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers;
};
