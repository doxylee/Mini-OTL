import { IsInt, Min, Max } from 'class-validator';
import { TimetableLectureItemDTO, toTimetableLectureItemDTO } from '../lectures/lectures.dto';
import { TimetableWithFullLectures } from 'src/prisma/repositories/repository.dto';

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

export type TimetableWithLecturesDTO = {
  id: number;
  userId: number;
  year: number;
  season: number;
  lectures: TimetableLectureItemDTO[];
};

export function toTimetableWithLecturesDTO(timetable: TimetableWithFullLectures): TimetableWithLecturesDTO {
  return {
    id: timetable.id,
    userId: timetable.userId,
    year: timetable.year,
    season: timetable.season,
    lectures: timetable.lectures.map(toTimetableLectureItemDTO),
  };
}
