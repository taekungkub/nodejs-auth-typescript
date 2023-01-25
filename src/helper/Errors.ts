export const ERRORS = {
  TYPE: {
    BAD_REQUEST: "BAD_REQUEST",
    RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND",
    SERVER_ERROR: "SERVER_ERROR",
    NOT_ALLOWED: "NOT_ALLOWED",
  },
  NOT_FOUND_USER: "We were unable to find a user for this verification. Please SignUp!",
  INCORRECT_EMAIL: "Incorrect email",
  PASSWORD_NOT_MATCH: "Password don't match.",
  PASSWORD_NOT_STRONG:
    "Password should be at least 8 characters in length and should include at least one upper case letter, one number, and one special character.",
  INCORRECT_EMAIL_OR_PASSWORD: "Incorrect email or password.",
  CANT_VERIFY_ACCOUNT: "Sorry, it looks like we can't verify your account.",
  ACCOUNT_NOT_EXIST: "The user you requested does not exist.",
  PASSWORD_RESET_LINK_INVALID:
    "Sorry, the password reset link was invalid / expired (valid for 24 hrs), possibly because it has already been used.",
  TOKEN_REQUIRED: "Token required.",
  TOKEN_INVALID: "Token invalid.",
  EMAIL_INVALID: "Email invalid format.",
  EMAIL_ALREADY_EXISTS: "Email already exists.",
  EMAIL_IS_NOT_VERIFY: "This email not verify. Please check your email for verify.",
  EMAIL_IS_VERIFY: "This email has been verify.",
  METHOD_NOT_ALLOW: "Method not allowed. Must be one of: OPTIONS",
  LINK_HAS_BEEN_DESTROYED: "This link has been destroyed.",
  ROLE_NOT_ALLOW: "This role not allow to access",
};
