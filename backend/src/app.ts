import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import passport from 'passport';

import Database from './config/db.config';
import { redisConnect } from './config/redis.config';


import { Container } from "@di"
import { authRoutes } from '@modules/user/routes/auth.routes'
import { userRoutes } from '@modules/user/routes/user.routes'
import { inventoryRoutes } from '@modules/inventory/routes/inventory.routes'

import { errorHandler } from './shared/middlewares/err.middleware';
import { env } from './config/env';


export const createApp = (container: Container) => {
     const app = express();

     Database.getInstance();
     
     redisConnect();
     

     
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
     
     
     app.use('/auth', authRoutes(container));
     app.use('/users', userRoutes(container));
     app.use('/inventory', inventoryRoutes(container));
     // app.use('/membership',membershipRoutes);
     // app.use("/conversations", conversationRoutes);
     // app.use("/messages", messageRoutes);
     // app.use("/groups", groupRoutes);
     // app.use("/purchase",purchaseRoutes);
     // app.use("/reports",reportRoutes);
     // app.use("/challanges",challangeRoutes);
     // app.use("/levels",levelsRoutes);
     // app.use("/progresses",progressRoutes);
     // app.use("/market",marketRoutes);
     // app.use("/notifications",notificationRoutes);
     // app.use("/analytics",analyticsRoutes);
     // app.use("/solutions",solutionRoutes);
     
     
     app.use(errorHandler);    

     return app;
 }





