export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateSignup(body: any): string | null {
  const { email, password, name } = body;
  if (!email || !isValidEmail(email)) return "Valid email is required";
  if (!password || password.length < 6)
    return "Password must be at least 6 characters";
  if (!name) return "Name is required";
  return null;
}

export function validateLogin(body: any): string | null {
  const { email, password } = body;
  if (!email || !isValidEmail(email)) return "Valid email is required";
  if (!password) return "Password is required";
  return null;
}
