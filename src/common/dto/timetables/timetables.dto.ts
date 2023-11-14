import { IsInt, Min, Max } from 'class-validator';

export class CreateTimetableBodyDTO {
  @IsInt()
  year: number;

  @IsInt()
  @Min(1)
  @Max(4)
  season: number;
}

export type CreateTimetableDTO = {
  userId: number;
  year: number;
  season: number;
};
