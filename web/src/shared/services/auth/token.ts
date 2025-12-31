import { InjectionToken } from "@angular/core";
import { IAuthStrategy } from "./interface";

export const AUTH_STRATEGY = new InjectionToken<IAuthStrategy>('AuthStrategy')
