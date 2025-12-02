import { Request, Response } from "express";
import { billingService } from "./billing.service";

export const billingController = {
  async run(req: Request, res: Response) {
    await billingService.runBillingNow();
    res.json({ message: "Proceso de cobro ejecutado" });
  },
  async checkLowBalance(req: Request, res: Response) {
    await billingService.checkLowBalance();
    res.json({ message: "Chequeo de saldo bajo ejecutado" });
  },
};
