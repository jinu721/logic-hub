import cron from "node-cron";
import User from "../../models/user.model";

console.log("Starting cron job setup...");
// cron.schedule("0 0 * * *", async () => {
//   console.log("Running membership check...");
//   try {
//     const result = await User.updateMany(
//       { "membership.endDate": { $lte: new Date() }, "membership.isActive": true },
//       { $set: { "membership.isActive": false } }
//     );
//     console.log(`[Membership Expiry] Marked expired plans as inactive for ${result.modifiedCount} users`);
//   } catch (err) {
//     console.error("Cron error:", err);
//   }
// });
console.log("Cron job scheduled.");

