export type SemesterDTO = {
  year: number;
  season: number;
};

export function toSemesterDTO(semester: SemesterDTO): SemesterDTO {
  return { year: semester.year, season: semester.season };
}
