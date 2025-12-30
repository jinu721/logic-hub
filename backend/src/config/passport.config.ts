import passport from 'passport';
import { Strategy as GoogleStrategy, Profile as GoogleProfile, VerifyCallback } from 'passport-google-oauth20';
import { Strategy as GithubStrategy, Profile as GithubProfile } from 'passport-github2';
import { Request } from 'express';
import { env } from './env';
import { Container } from '@di';
import { LoginType } from '@shared/types';
import { AppError } from '@utils/application';
import { HttpStatus } from '@constants';
import logger from '@utils/application/logger';


export const setupPassport = (container: Container) => {

    const authService = container.authSrv;


    passport.use(
        new GoogleStrategy(
            {
                clientID: env.GOOGLE_CLIENT_ID!,
                clientSecret: env.GOOGLE_CLIENT_SECRET!,
                callbackURL: env.GOOGLE_CALLBACK_URL!,
                passReqToCallback: true
            },
            async (
                req: Request,
                _accessToken: string,
                _refreshToken: string,
                profile: GoogleProfile,
                done: VerifyCallback
            ) => {
                try {
                    const email = profile.emails?.[0]?.value;
                    if (!email) {
                        logger.error(`Google Login Failed: No email provided for profile ${profile.id}`);
                        return done(new AppError(HttpStatus.BAD_REQUEST, "Google did not provide an email."));
                    }

                    const user = await authService.socialLogin({
                        email,
                        name: profile.displayName || profile.username || "unknown",
                        profileId: profile.id,
                        loginType: LoginType.GOOGLE
                    });

                    return done(null, user as any);
                } catch (e) {
                    return done(e as Error);
                }
            }
        )
    );


    passport.use(
        new GithubStrategy(
            {
                clientID: env.GITHUB_CLIENT_ID!,
                clientSecret: env.GITHUB_CLIENT_SECRET!,
                callbackURL: env.GITHUB_CALLBACK_URL!,
                scope: ["user:email"],
                passReqToCallback: true
            },
            async (
                req: Request,
                _accessToken: string,
                _refreshToken: string,
                profile: GithubProfile,
                done: VerifyCallback
            ) => {
                try {
                    const email = profile.emails?.[0]?.value;
                    if (!email) {
                        logger.error(`GitHub Login Failed: No email provided for profile ${profile.id}`);
                        return done(new AppError(HttpStatus.BAD_REQUEST, "GitHub did not provide an email."));
                    }

                    const user = await authService.socialLogin({
                        email,
                        name: profile.displayName || profile.username || "unknown",
                        profileId: profile.id,
                        loginType: LoginType.GITHUB
                    });

                    return done(null, user as any);
                } catch (e) {
                    return done(e as Error);
                }
            }
        )
    );

}

