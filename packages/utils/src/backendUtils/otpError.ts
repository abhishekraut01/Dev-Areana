// otp-error.ts
import { ApiError } from './apiError.js';

export type OTPCode = 'EXPIRED' | 'INVALID' | 'TOO_MANY_ATTEMPTS' | 'RATE_LIMIT_REACHED';

export class OTPError extends ApiError {
  public code: OTPCode;

  constructor(code: OTPCode) {
    // map domain code to HTTP semantics
    const status = code === 'INVALID' || code === 'EXPIRED' ? 401 : 429;
    super(status, code, [] /* errors */, '');
    Object.setPrototypeOf(this, new.target.prototype); // ensure instanceof works
    this.name = 'OTPError';
    this.code = code;
  }
}
