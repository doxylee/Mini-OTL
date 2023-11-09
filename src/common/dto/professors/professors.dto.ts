export type SimpleProfessorResponseDTO = {
  id: number;
  name: string;
};

export function toSimpleProfessorResponseDTO(professor: SimpleProfessorResponseDTO): SimpleProfessorResponseDTO {
  return {
    id: professor.id,
    name: professor.name,
  };
}