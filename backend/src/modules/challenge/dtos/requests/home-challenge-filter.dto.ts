import { BaseDto } from "@shared/dtos/base.dto";

export class UserHomeFiltersDto extends BaseDto {
  type?: "code" | "cipher";
  isPremium?: boolean;
  level?: "novice" | "adept" | "master";
  tags?: string[];
  searchQuery?: string;

  validate() {
    const errors: string[] = [];
    if (this.type && !["code", "mcq", "quiz"].includes(this.type))
      errors.push("Invalid type");

    if (this.level && !["beginner", "adept", "master"].includes(this.level))
      errors.push("Invalid level");

    return { valid: errors.length === 0, errors };
  }
}
