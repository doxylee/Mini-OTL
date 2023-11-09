import { ClassTime } from '@prisma/client';

export type ClassTimeResponseDTO = {
  day: number;
  start: string;
  end: string;
};

export function toClassTimeResponseDTO(classTime: ClassTime): ClassTimeResponseDTO {
  return {
    day: classTime.day,
    start: classTime.startTime.toLocaleTimeString('ko-KR', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    end: classTime.endTime.toLocaleTimeString('ko-KR', { hour12: false, hour: '2-digit', minute: '2-digit' }),
  };
}
