"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Starting cron job setup...");
// cron.schedule("0 0 * * *", async () => {
//   console.log("Running membership check...");
//   try {
//     const result = await UserModel.updateMany(
//       { "membership.endDate": { $lte: new Date() }, "membership.isActive": true },
//       { $set: { "membership.isActive": false } }
//     );
//     console.log(`[Membership Expiry] Marked expired plans as inactive for ${result.modifiedCount} users`);
//   } catch (err) {
//     console.error("Cron error:", err);
//   }
// });
console.log("Cron job scheduled.");
