
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password: string): boolean => password.length >= 6;

export const validatePasswordMatch = (password: string, confirmPassword: string): boolean =>
  password === confirmPassword;
