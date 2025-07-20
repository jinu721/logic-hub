import passport from 'passport';
import {Strategy as GoogleStrategy,Profile as GoogleProfile, VerifyCallback} from 'passport-google-oauth20';
import {Strategy as GithubStrategy,Profile as GithubProfile} from 'passport-github2';
import User from '../models/user.model';
import { generateUsername } from '../utils/generate.username';
import { env } from './env';



passport.use(
    new GoogleStrategy({
        clientID:env.GOOGLE_CLIENT_ID as string,
        clientSecret:env.GOOGLE_CLIENT_SECRET as string,
        callbackURL:env.GOOGLE_CALLBACK_URL as string
    }, async (accessToken:string,refreshToken:string | undefined,profile:GoogleProfile,done:VerifyCallback)=>{
        try{

            const email = profile?.emails?.[0]?.value;
            if (!email) return done(new Error("Google did not provide an email."));

            let user = await User.findOne({email});

            if(user){
                if(!user.googleId){
                    user.googleId = profile.id;
                    await user.save();
                }
            }else{
                user = await User.create({
                    username:await generateUsername(profile.displayName as string || profile.username as string),
                    email,
                    loginType:"google",
                    googleId:profile.id,
                    isVerified:true,
                })
            }
            done(null,user);
        }catch(err){
            console.log(err);
            done(err);
        }
    })
)

passport.use(
    new GithubStrategy({
        clientID: env.GITHUB_CLIENT_ID as string,
        clientSecret: env.GITHUB_CLIENT_SECRET as string,
        callbackURL: env.GITHUB_CALLBACK_URL as string,
        scope:['user:email']
    }, async (accessToken: string, refreshToken: string | undefined, profile: GithubProfile, done: VerifyCallback) => {
        try {

            let email = profile.emails?.[0]?.value;
            if (!email) {
                return done(new Error("GitHub did not provide an email."));
            }


            let user = await User.findOne({ email });

            if(user){
                if(!user.githubId){
                    user.githubId = profile.id;
                    await user.save();
                }
            }else{
                user = await User.create({
                    username: await generateUsername(profile.displayName as string || profile.username as string),
                    email,
                    loginType: "github",
                    githubId: profile.id,
                    isVerified: true
                });
            }
            done(null, user);
        } catch (err) {
            console.error("Error storing GitHub user:", err);
            done(err);
        }
    })
);
