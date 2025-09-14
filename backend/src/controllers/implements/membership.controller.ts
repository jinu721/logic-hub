import { Request, Response } from "express";
import { IMembershipService } from "../../services/interfaces/membership.service.interface"; 
import { IMembershipController } from "../interfaces/membership.controller.interface";
import { HttpStatus } from "../../constants/http.status"; 

export class MembershipController implements IMembershipController {
  constructor(private readonly _membershipSvc: IMembershipService) {}

  async createMembership(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._membershipSvc.createPlan(req.body);
      res.status(HttpStatus.CREATED).json({ success: true, data: result });
    } catch (error) {
      console.log(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Failed to create membership" });
    }
  }

  async getAllMemberships(req: Request, res: Response): Promise<void> {
    try {
      const search = req.query.search;
      const page = req.query.page;
      const limit = req.query.limit;
      const result = await this._membershipSvc.getAllPlans(search as string,Number(page),Number(limit));
      res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (error) {
      console.log(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Failed to get memberships" });
    }
  }

  async getTwoActiveMemberships(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._membershipSvc.getTwoActivePlans();
      res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (error) {
      console.log(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Failed to get memberships" });
    }
  }

  async getMembershipById(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._membershipSvc.getPlanById(req.params.id);
      if (!result) {
         res
          .status(HttpStatus.NOT_FOUND)
          .json({ success: false, message: "Membership not found" });
          return;
      }
      res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (error) {
      console.log(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Failed to get membership" });
    }
  }

  async updateMembership(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._membershipSvc.updatePlan(req.params.id, req.body);
      if (!result) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json({ success: false, message: "Membership not found" });
          return;
      }
      res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (err) {
      console.log(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: err instanceof Error ? err.message : "Error Updating Membership"  });
    }
  }

  async deleteMembership(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._membershipSvc.deletePlan(req.params.id);
      if (!result) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json({ success: false, message: "Membership not found" });
          return;
      }
      res
        .status(HttpStatus.OK)
        .json({ success: true, message: "Membership deleted successfully" });
    } catch (error) {
      console.log(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Failed to delete membership" });
    }
  }
}
