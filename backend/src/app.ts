import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import passport from 'passport';

const app = express();

import Database from './config/db.config';
import { redisConnect } from './config/redis.config';

Database.getInstance();

redisConnect();

import './config/passport.config';
import './utils/application/crone.helper';
import './models/index';


import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import inventoryRoutes from './routes/inventory.routes'
import conversationRoutes from "./routes/conversation.routes";
import messageRoutes from "./routes/message.routes";
import groupRoutes from "./routes/group.routes";
import membershipRoutes from "./routes/membership.routes";
import purchaseRoutes from "./routes/purchase.routes";
import reportRoutes from "./routes/report.routes";
import challangeRoutes from "./routes/challange.routes";
import levelsRoutes from "./routes/level.routes";
import progressRoutes from "./routes/progress.routes";
import marketRoutes from "./routes/market.routes";
import notificationRoutes from "./routes/notification.routes";
import analyticsRoutes from "./routes/analytics.routes";
import solutionRoutes from "./routes/solution.routes";
import { errorHandler } from './middlewares/err.middleware';
import { env } from './config/env';



app.use(helmet());
app.use(cookieParser());
app.use(cors({
    origin:env.FRONTEND_URL,
    credentials:true
}));



app.use(express.json());
app.use(express.urlencoded());

app.use(morgan('dev'));

app.use(passport.initialize())

app.use('/auth',authRoutes);
app.use('/users',userRoutes);
app.use('/inventory',inventoryRoutes);
app.use('/membership',membershipRoutes);
app.use("/conversations", conversationRoutes);
app.use("/messages", messageRoutes);
app.use("/groups", groupRoutes);
app.use("/purchase",purchaseRoutes);
app.use("/reports",reportRoutes);
app.use("/challanges",challangeRoutes);
app.use("/levels",levelsRoutes);
app.use("/progresses",progressRoutes);
app.use("/market",marketRoutes);
app.use("/notifications",notificationRoutes);
app.use("/analytics",analyticsRoutes);
app.use("/solutions",solutionRoutes);


app.use(errorHandler);    




export default app;