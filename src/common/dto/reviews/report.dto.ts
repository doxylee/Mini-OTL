import { IsString, IsNotEmpty } from 'class-validator';

export class ReportCreateBodyDTO {
  @IsString()
  @IsNotEmpty()
  content: string;
}

export type ReportCreateDTO = {
  userId: number;
  reviewId: number;
  content: string;
};

export type ReportDTO = {
  id: number;
  userId: number;
  reviewId: number;
  content: string;
};

export function toReportDTO(data: ReportDTO): ReportDTO {
  const { id, userId, reviewId, content } = data;
  return { id, userId, reviewId, content };
}
