import { inject, Injectable } from "@angular/core";
import { AuthLocalStorageStrategy } from "./localstorage-strategy";
import { AuthCookieStrategy } from "./cookie-strategy";
import { IAuthStrategy } from "./interface";
import { AuthConfigService, STRATEGY_TYPE } from "./config";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AuthProxyStrategy implements IAuthStrategy {
    private localStorageStrategy = inject(AuthLocalStorageStrategy)
    private cookieStrategy = inject(AuthCookieStrategy)
    private authConfigService = inject(AuthConfigService)

    private get active(): IAuthStrategy {
        switch (this.authConfigService.authStrategy()) {
            case STRATEGY_TYPE.LOCALSTORAGE:
                return this.localStorageStrategy
            case STRATEGY_TYPE.COOKIE:
                return this.cookieStrategy
            default:
                throw new Error(`Not impl strategy type ${this.authConfigService.authStrategy()}`)
        }
    }

    public login(body: unknown): Observable<unknown> {
        return this.active.login(body);
    }
    public logout(): void {
        return this.active.logout();
    }
    public getHeaders(): Record<string, string> {
        return this.active.getHeaders()
    }

    public isAuth() {
        return this.active.isAuth()
    }

    public checkAuth(): Observable<boolean> {
        return this.active.checkAuth();
    }
}
