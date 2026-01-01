import { inject, Injectable } from "@angular/core";
import { IAuthStrategy } from "./interface";
import { catchError, map, Observable, of, startWith, tap } from "rxjs";
import { TLoginRequest, TLoginResponse } from "../../types/login";
import { HttpClient } from "@angular/common/http";
import { UserStateService } from "../user-storage";

@Injectable({
    providedIn: 'root'
})
export class AuthCookieStrategy implements IAuthStrategy {
    private readonly httpService = inject(HttpClient);
    private readonly userState = inject(UserStateService)

    public login(body: TLoginRequest): Observable<TLoginResponse> {
        const url = 'http://localhost/api/v2/auth/login'
        return this.httpService.post<TLoginResponse>(url, body, { withCredentials: true })
    }

    public logout(): void {
        throw new Error("Method not implemented.");
    }

    public getHeaders(): Record<string, string> {
        return {}
    }

    public isAuth() {
        return this.userState.isAuth()
    }

    public checkAuth(): Observable<boolean> {
        const initialState = this.userState.isAuth()

        const remoteCheck$ = this.httpService.get<unknown>("http://localhost/api/v2/auth/self")
            .pipe(
                tap(user => this.userState.setAuthenticated(user)),
                map(() => true),
                catchError(() => {
                    this.userState.setUnauthenticated()
                    return of(false)
                })
            )

        return remoteCheck$.pipe(
            startWith(initialState)
        );
    }


}
