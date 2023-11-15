export type DepartmentDTO = {
  id: number;
  nameKo: string;
  nameEn: string;
  deptCode: string;
};

export function toDepartmentDTO(department: DepartmentDTO): DepartmentDTO {
  return {
    id: department.id,
    nameKo: department.nameKo,
    nameEn: department.nameEn,
    deptCode: department.deptCode,
  };
}
