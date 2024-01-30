class TokenError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, TokenError.prototype);
  }
}
export default TokenError;
