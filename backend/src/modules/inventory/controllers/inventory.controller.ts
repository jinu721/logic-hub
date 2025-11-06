import { HttpStatus } from "@constants";
import { sendSuccess, asyncHandler, AppError } from "@utils/application";
import {
  CreateInventoryDTO,
  IInventoryController,
  UpdateInventoryDTO,
} from "@modules/inventory";

export class InventoryController implements IInventoryController {
  constructor(private svc: any) {}

  create = asyncHandler(async (req, res) => {
    const dto: CreateInventoryDTO = {
      name: req.body.name,
      description: req.body.description,
      isActive: req.body.isActive,
      rarity: req.body.rarity,
    };
    if (!dto.name || !dto.description || !dto.isActive || !dto.rarity) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        "Name,Description,isActive,rarity required"
      );
    }

    let imageFile = "";
    if (req.file) {
      const mime = req.file.mimetype;
      const base64 = req.file.buffer.toString("base64");
      imageFile = `data:${mime};base64,${base64}`;
    }

    const payload = {
      ...dto,
      image: imageFile,
    };

    const data = await this.svc.create(payload);
    sendSuccess(res, HttpStatus.OK, { data }, "Created");
  });

  getAll = asyncHandler(async (req, res) => {
    const search = req.query.search as string;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const data = await this.svc.getAll(search, page, limit);
    sendSuccess(res, HttpStatus.OK, { data }, "Fetched");
  });

  getById = asyncHandler(async (req, res) => {
    const data = await this.svc.getById(req.params.id);
    if (!data) throw new AppError(HttpStatus.NOT_FOUND, "Not Found");
    sendSuccess(res, HttpStatus.OK, { data }, "Fetched");
  });

  update = asyncHandler(async (req, res) => {
    const dto: UpdateInventoryDTO = {
      name: req.body.name,
      description: req.body.description,
      isActive: req.body.isActive,
      rarity: req.body.rarity,
    };
    const data = await this.svc.update(req.params.id, dto);
    if (!data) throw new AppError(HttpStatus.NOT_FOUND, "Not Found");
    sendSuccess(res, HttpStatus.OK, { data }, "Updated");
  });

  delete = asyncHandler(async (req, res) => {
    const deleted = await this.svc.delete(req.params.id);
    if (!deleted) throw new AppError(HttpStatus.NOT_FOUND, "Not Found");
    sendSuccess(res, HttpStatus.OK, {}, "Deleted");
  });
}
