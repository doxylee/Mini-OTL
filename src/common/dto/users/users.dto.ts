import { IsString, IsNotEmpty, IsInt } from 'class-validator';
import { DepartmentDTO, toDepartmentDTO } from '../departments/departments.dto';
import { UserWithDept } from 'src/prisma/repositories/repository.dto';

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

export type UserProfileDTO = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  department: DepartmentDTO;
  isAdmin: boolean;
};

export function toUserProfileDTO(user: UserWithDept): UserProfileDTO {
  return {
    ...toUserDTO(user),
    department: toDepartmentDTO(user.department),
  };
}
