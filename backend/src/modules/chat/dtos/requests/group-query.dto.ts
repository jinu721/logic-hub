import { BaseDto } from "@shared/dtos/base.dto";

export class GroupQueryDto extends BaseDto {
  name?: string;
  isActive?: boolean;
  members?: string;
  createdBy?: string;
  type?: string;
  search?: string;
  page: number = 1;
  limit: number = 10;

  static fromQuery(query: any): GroupQueryDto {
    const dto = new GroupQueryDto();
    if (query.name) dto.name = query.name;
    if (query.search) dto.search = query.search;
    if (query.type) dto.type = query.type;
    if (query.isActive !== undefined) dto.isActive = query.isActive === "true" || query.isActive === true;
    if (query.members) dto.members = query.members;
    if (query.createdBy) dto.createdBy = query.createdBy;

    if (query.page) dto.page = parseInt(query.page.toString(), 10) || 1;
    if (query.limit) dto.limit = parseInt(query.limit.toString(), 10) || 10;

    return dto;
  }

  validate() {
    return { valid: true, errors: [] };
  }
}
