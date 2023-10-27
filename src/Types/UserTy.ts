import { JwtPayload } from "jsonwebtoken";

export interface UserTy {
  id: string;
  user_email: string;
  user_password: string;
  user_confirm_password: string;
  user_displayname?: string;
  user_tel?: string;
  user_password_hash: string;
  reset_password_token: string;
  is_verify: boolean;
  role_id: string;
  role_title: string;
}

export interface UserJwtTy extends JwtPayload, UserTy {}
