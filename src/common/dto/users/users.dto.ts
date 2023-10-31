import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsInt()
  departmentId: number;
}

export class LoginRequestDTO {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export type UserDTO = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  departmentId: number;
  isAdmin: boolean;
};

export function toUserDTO(user: UserDTO): UserDTO {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    departmentId: user.departmentId,
    isAdmin: user.isAdmin,
  };
}
