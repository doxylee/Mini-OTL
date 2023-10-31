export type JWTPayload = {
  id: number;
  isAdmin: boolean;
};

export function toJWTPayload(user: JWTPayload): JWTPayload {
  return {
    id: user.id,
    isAdmin: user.isAdmin,
  };
}
