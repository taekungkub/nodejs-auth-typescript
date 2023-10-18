import passport from "passport";
import passportJWT from "passport-jwt";
import { secretJWT } from "../config/globalConfig";

const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

import * as db from "../persistence/mysql/User";
import { UserTy } from "../types/UserTy";

// passport.serializeUser((user: any, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id: any, done: any) => done(null, await db.getUserById(id)));

export class PassportService {
  static passport: typeof passport;
}

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secretJWT,
};

PassportService.passport = passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload: UserTy, cb) => {
    try {
      const result = (await db.getUserById(jwtPayload.id)) as UserTy;
      if (jwtPayload.id != result.id) return cb(null, false);
      return cb(null, result);
    } catch (error) {
      return cb(null, false);
    }
  })
);
