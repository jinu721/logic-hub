import { BaseDto } from "@shared/dtos/base.dto";

export class GroupQueryDto extends BaseDto {
  name?: string;
  isActive?: boolean;
  members?: string;
  createdBy?: string;

  static fromQuery(query): GroupQueryDto {
    const dto = new GroupQueryDto();
    if (query.name) dto.name = query.name;
    if (query.isActive !== undefined) dto.isActive = query.isActive === "true" || query.isActive === true;
    if (query.members) dto.members = query.members;
    if (query.createdBy) dto.createdBy = query.createdBy;
    return dto;
  }

  validate() {
    return { valid: true, errors: [] };
  }
}
