export class OTPError extends Error {
  constructor(
    public code:
      | 'EXPIRED'
      | 'INVALID'
      | 'TOO_MANY_ATTEMPTS'
      | 'RATE_LIMIT_REACHED'
  ) {
    super(code);
  }
}
