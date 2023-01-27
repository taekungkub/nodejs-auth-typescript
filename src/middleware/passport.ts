import { PassportService } from "../config/passportService";

export const checkAuth = PassportService.passport.authenticate("jwt", { session: false });
