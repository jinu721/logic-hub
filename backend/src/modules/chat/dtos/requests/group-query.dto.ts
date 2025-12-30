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

  static fromQuery(query: Record<string, unknown>): GroupQueryDto {
    const dto = new GroupQueryDto();
    if (query.name && typeof query.name === 'string') dto.name = query.name;
    if (query.search && typeof query.search === 'string') dto.search = query.search;
    if (query.type && typeof query.type === 'string') dto.type = query.type;
    if (query.isActive !== undefined) dto.isActive = query.isActive === "true" || query.isActive === true;
    if (query.members && typeof query.members === 'string') dto.members = query.members;
    if (query.createdBy && typeof query.createdBy === 'string') dto.createdBy = query.createdBy;

    if (query.page) dto.page = parseInt(query.page.toString(), 10) || 1;
    if (query.limit) dto.limit = parseInt(query.limit.toString(), 10) || 10;

    return dto;
  }

  validate() {
    return { valid: true, errors: [] };
  }
}
