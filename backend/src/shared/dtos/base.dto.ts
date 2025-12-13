export interface DtoValidationResult {
  valid: boolean;
  errors?: string[];
}

export abstract class BaseDto {
  abstract validate(): DtoValidationResult | Promise<DtoValidationResult>;
  
  static from<T extends BaseDto>(this: new () => T, data: Partial<T>): T {
    const instance = new this();
    Object.assign(instance, data);
    return instance;
  }
}
