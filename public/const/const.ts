export const REGEX = {
  login: /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/,
  display_name: /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/
};
export const ERROR = {
  login: "Invalid login format: must start with a letter, followed by 2-19 alphanumeric characters or underscores.",
  email: "Invalid email: must be a valid email format.",
  identifier: "Invalid login or email format.",
  passwords: "Passwords do not match.",
  password: "Invalid password: must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be 8 to 20 characters long.",
  display_name: "Invalid display_name format: must start with a letter, followed by 2-19 alphanumeric characters or underscores.",
  avatar: "Invalid avatar."
};
