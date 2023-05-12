import { UseInterceptors } from "@nestjs/common";
import { PasswordInterceptor } from "../interceptors/users.interceptor";

export const HidePassword = UseInterceptors(PasswordInterceptor);
