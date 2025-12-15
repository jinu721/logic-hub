import { Server } from "socket.io";
import { ExtendedSocket, ChallengeData } from "../../shared/types/socket.types";
import { verifyAccessToken } from "../../shared/utils/token/verify.token";
import redisClient from "../../config/redis.config";
import { Container } from "@di";

export class UserHandler {
  constructor(private io: Server, private container: Container) { }

  public setupUserHandlers(socket: ExtendedSocket): void {
    socket.on("register_user", this.handleRegisterUser.bind(this, socket));
    socket.on("user-online", this.handleUserOnline.bind(this, socket));
    socket.on("check-user-status", this.handleCheckUserStatus.bind(this, socket));
    socket.on("challenge-started", this.handleChallengeStarted.bind(this, socket));
    socket.on("challenge-ended", this.handleChallengeEnded.bind(this, socket));
    socket.on("disconnect", this.handleDisconnect.bind(this, socket));
  }

  private async handleRegisterUser(
    socket: ExtendedSocket,
    accessToken: string
  ): Promise<void> {
    const user = verifyAccessToken(accessToken);
    try {
      await redisClient.sAdd(`sockets:${user?.userId}`, socket.id);
      socket.userId = user?.userId;
    } catch (err) {
      console.log(err);
    }
  }

  private async handleUserOnline(
    socket: ExtendedSocket,
    accessToken: string
  ): Promise<void> {
    try {
      const user = verifyAccessToken(accessToken);
      await this.container.userCommandSvc.updateUser(user?.userId as string, { isOnline: true } as any);
      await redisClient.set(`user:online:${String(user?.userId)}`, "true");
      this.io.emit("user-status", { userId: user?.userId, status: true });

      await redisClient.sAdd(`sockets:${user?.userId}`, socket.id);
      // Map socket to user for quick lookup if needed, though socket.userId covers it for disconnect
      await redisClient.set(`socket:user:${socket.id}`, String(user?.userId));
    } catch (err) {
      console.log(err);
    }
  }

  private async handleCheckUserStatus(
    socket: ExtendedSocket,
    userId: string
  ): Promise<void> {
    try {
      const status = await redisClient.get(`user:online:${userId}`);
      const isOnline = status === "true";
      socket.emit("user-status", { userId, status: isOnline });
    } catch (err) {
      console.error("Error checking user status:", err);
    }
  }

  private async handleChallengeStarted(
    socket: ExtendedSocket,
    { challengeId, accessToken }: ChallengeData
  ): Promise<void> {
    try {
      const user = verifyAccessToken(accessToken);
      console.log("User Online :- ", user?.userId);
      const roomName = `challenge-${challengeId}`;
      const redisKey = `users:${roomName}`;
      await redisClient.sAdd(redisKey, user?.userId as string);
      const startedCount = await redisClient.sCard(redisKey);
      socket.join(roomName);
      const privateRoom = `progress-${user?.userId}`;
      socket.join(privateRoom);
      console.log(`Socket ${socket.id} joined room: progress-${user?.userId}`);

      const privateRoom2 = `preview-${user?.userId}`;

      socket.join(privateRoom2);
      console.log(`Socket ${socket.id} joined room: preview-${user?.userId}`);

      this.io.to(roomName).emit("challenge-started-count", {
        challengeId,
        startedCount: startedCount,
      });
    } catch (err) {
      console.log(err);
    }
  }

  private async handleChallengeEnded(
    socket: ExtendedSocket,
    { challengeId, accessToken }: ChallengeData
  ): Promise<void> {
    try {
      const user = verifyAccessToken(accessToken);;
      const roomName = `challenge-${challengeId}`;
      const redisKey = `users:${roomName}`;

      await redisClient.sRem(redisKey, user?.userId as string);
      const startedCount = await redisClient.sCard(redisKey);

      socket.leave(roomName);
      this.io.to(roomName).emit("challenge-started-count", {
        challengeId,
        startedCount,
      });
    } catch (err) {
      console.log(err);
    }
  }

  private async handleDisconnect(socket: ExtendedSocket): Promise<void> {
    const userId = socket.userId;
    if (!userId) return;
    console.log(`User ${userId} disconnected logic started`);

    try {
      await redisClient.sRem(`sockets:${userId}`, socket.id);
      const remainingSockets = await redisClient.sCard(`sockets:${userId}`);

      if (remainingSockets <= 0) {
        console.log(`User ${userId} marked offline (no remaining sockets)`);
        await this.container.userCommandSvc.updateUser(userId, {
          isOnline: false,
          lastSeen: new Date(),
        } as any);
        await redisClient.set(`user:online:${userId}`, "false");
        this.io.emit("user-status", { userId, status: false });
      } else {
        console.log(`User ${userId} still online on ${remainingSockets} other sockets`);
      }

      // Clean up socket mapping
      await redisClient.del(`socket:user:${socket.id}`);

    } catch (err) {
      console.error("Error in disconnect handler:", err);
    }
  }
}
