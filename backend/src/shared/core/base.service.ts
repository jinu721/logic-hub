export abstract class BaseService<Entity, DTO> {
  protected abstract toDTO(entity: Entity): DTO;
  protected abstract toDTOs(entities: Entity[]): DTO[];

  protected mapOne(entity: Entity | null | undefined): DTO {
    if (!entity) throw new Error("Cannot map null or undefined entity");
    console.log("Mapping entity to DTO:", entity);
    return this.toDTO(entity);
  }

  protected mapMany(entities: Entity[] | null | undefined): DTO[] {
    if (!entities || entities.length === 0) return [];
    console.log(`Mapping ${entities.length} entities to DTOs`);
    return this.toDTOs(entities);
  }
}
