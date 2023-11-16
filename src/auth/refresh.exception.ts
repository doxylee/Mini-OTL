export class RefreshTokenInvalidException extends Error {
  constructor(msg?: string) {
    super(msg || 'Refresh token invalid');
  }
}
