import { IsString, IsNotEmpty } from 'class-validator';

export class LoginRequestDTO {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

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
