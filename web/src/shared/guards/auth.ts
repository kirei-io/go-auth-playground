import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from "@angular/router";
import { AUTH_STRATEGY } from "../services/auth/token";

export const authGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
) => {
    const authSerivce = inject(AUTH_STRATEGY)
    return authSerivce.isAuth()
}
