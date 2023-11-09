import { ClassTime } from "@prisma/client";

export type ClassTimeResponseDTO = {
  day: number;
  start: number;
  end: number;
};

export function toClassTimeResponseDTO(classTime: ClassTime): ClassTimeResponseDTO {
  return {
    day: classTime.day,
    start: classTime.startTime.getHours(),
    end: classTime.endTime.getHours(),
  };
}
