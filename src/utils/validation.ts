/**
 * Validates an email address
 * @param email The email address to validate
 * @returns boolean indicating if the email is valid
 */
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Validates a password meets minimum requirements
 * @param password The password to validate
 * @returns boolean indicating if the password is valid
 */
export const validatePassword = (password: string): boolean => {
  // At least 6 characters
  return password.length >= 6;
};

/**
 * Validates that two passwords match
 * @param password The first password
 * @param confirmPassword The password confirmation
 * @returns boolean indicating if passwords match
 */
export const validatePasswordMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};
