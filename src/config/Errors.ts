export const ERRORS = {
  TYPE: {
    BAD_REQUEST: "BAD_REQUEST",
    RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND",
    SERVER_ERROR: "SERVER_ERROR",
  },
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
};
