import { HttpStatus } from "@constants";
import { sendSuccess, asyncHandler, AppError } from "@utils/application";
import {
  IInventoryController,
  IInventoryService,
} from "@modules/inventory";
import {
  CreateInventoryDto,
  UpdateInventoryDto,
  GetAllInventoryDto,
  GetInventoryDto,
  DeleteInventoryDto
} from "@modules/inventory/dtos";
import { InventoryDocument } from "@shared/types";

export class InventoryController implements IInventoryController {
  constructor(private svc: IInventoryService) { }

  create = asyncHandler(async (req, res) => {
    const dto = CreateInventoryDto.from(req.body);
    const valid = dto.validate();
    if (!valid.valid) throw new AppError(HttpStatus.BAD_REQUEST, valid.errors.join(","));

    let imageFile = "";
    if (req.file) {
      const mime = req.file.mimetype;
      const base64 = req.file.buffer.toString("base64");
      imageFile = `data:${mime};base64,${base64}`;
    }

    const payload = {
      ...dto,
      image: imageFile,
      rarity: dto.rarity as "common" | "uncommon" | "rare" | "epic" | "legendary",
    };

    const data = await this.svc.create(payload);
    sendSuccess(res, HttpStatus.OK, { data }, "Created");
  });

  getAll = asyncHandler(async (req, res) => {
    const dto = GetAllInventoryDto.from(req.query);
    const valid = dto.validate();
    if (!valid.valid) throw new AppError(HttpStatus.BAD_REQUEST, valid.errors.join(","));

    const search = dto.search || "";
    const page = dto.page ? Number(dto.page) : 1;
    const limit = dto.limit ? Number(dto.limit) : 10;

    const searchQuery = search || "";
    const data = await this.svc.getAll(searchQuery, page, limit);
    sendSuccess(res, HttpStatus.OK, { data }, "Fetched");
  });

  getById = asyncHandler(async (req, res) => {
    const dto = GetInventoryDto.from(req.params);
    const valid = dto.validate();
    if (!valid.valid) throw new AppError(HttpStatus.BAD_REQUEST, valid.errors.join(","));

    const data = await this.svc.getById(dto.id);
    if (!data) throw new AppError(HttpStatus.NOT_FOUND, "Not Found");
    sendSuccess(res, HttpStatus.OK, { data }, "Fetched");
  });

  update = asyncHandler(async (req, res) => {
    const dto = UpdateInventoryDto.from(req.body);
    const valid = dto.validate();
    if (!valid.valid) throw new AppError(HttpStatus.BAD_REQUEST, valid.errors.join(","));

    const idDto = GetInventoryDto.from(req.params);
    const validId = idDto.validate();
    if (!validId.valid) throw new AppError(HttpStatus.BAD_REQUEST, validId.errors.join(","));

    const updateData: Partial<InventoryDocument> = {};
    Object.keys(dto).forEach(key => {
      if (key !== 'rarity') {
        (updateData as unknown as Record<string, unknown>)[key] = (dto as unknown as Record<string, unknown>)[key];
      }
    });
    if (dto.rarity) {
      updateData.rarity = dto.rarity as "common" | "uncommon" | "rare" | "epic" | "legendary";
    }
    const data = await this.svc.update(idDto.id, updateData);
    if (!data) throw new AppError(HttpStatus.NOT_FOUND, "Not Found");
    sendSuccess(res, HttpStatus.OK, { data }, "Updated");
  });

  delete = asyncHandler(async (req, res) => {
    const dto = DeleteInventoryDto.from(req.params);
    const valid = dto.validate();
    if (!valid.valid) throw new AppError(HttpStatus.BAD_REQUEST, valid.errors.join(","));

    const deleted = await this.svc.delete(dto.id);
    if (!deleted) throw new AppError(HttpStatus.NOT_FOUND, "Not Found");
    sendSuccess(res, HttpStatus.OK, {}, "Deleted");
  });
}
