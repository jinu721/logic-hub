import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import passport from 'passport';

import Database from './config/db.config';
import { redisConnect } from './config/redis.config';


import { Container } from "@di";
import { authRoutes, userRoutes } from '@modules/user';
import { inventoryRoutes } from '@modules/inventory';
import { levelsRoutes } from '@modules/level';
import { marketRoutes } from '@modules/market';
import { reportRoutes } from '@modules/report';
import { conversationRoutes, messageRoutes, groupRoutes } from '@modules/chat';
import { notificationRoutes } from '@modules/notification';
import { challengeRoutes, submissionRoutes, solutionRoutes } from '@modules/challenge';
import { purchaseRoutes } from '@modules/purchase';
import { membershipRoutes } from '@modules/membership';
import { analyticsRoutes } from '@modules/analytics';

import { errorHandler } from './shared/middlewares/err.middleware';
import { env } from './config/env';
import { setupPassport } from './config/passport.config';


export const createApp = (container: Container) => {
    const app = express();

    Database.getInstance();

    redisConnect();



    app.use(helmet());
    app.use(cookieParser());
    app.use(cors({
        origin: env.FRONTEND_URL,
        credentials: true
    }));



    app.use(express.json());
    app.use(express.urlencoded());

    app.use(morgan('dev'));

    app.use(passport.initialize())
    setupPassport(container);


    app.use('/auth', authRoutes(container));
    app.use('/users', userRoutes(container));
    app.use('/inventory', inventoryRoutes(container));
    app.use('/levels', levelsRoutes(container));
    app.use('/market', marketRoutes(container));
    app.use('/reports', reportRoutes(container));
    app.use('/conversations', conversationRoutes(container));
    app.use('/messages', messageRoutes(container));
    app.use('/groups', groupRoutes(container));
    app.use('/notifications', notificationRoutes(container));
    app.use('/challenges', challengeRoutes(container));
    app.use('/submissions', submissionRoutes(container));
    app.use('/solutions', solutionRoutes(container));
    app.use('/purchases', purchaseRoutes(container));
    app.use('/memberships', membershipRoutes(container));
    app.use('/analytics', analyticsRoutes(container));


    app.use(errorHandler);

    return app;
}





