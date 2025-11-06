import { addMonths, addYears } from "date-fns";


export const calculateExpiry = (planType: string, startDate: Date): Date => {
    switch (planType) {
      case "silver":
        return addMonths(startDate, 1);
      case "gold":
        return addYears(startDate, 1);
      default:
        throw new Error(`Unsupported plan type: ${planType}`);
    }
  }