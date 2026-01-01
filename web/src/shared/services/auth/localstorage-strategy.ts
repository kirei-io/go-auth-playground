import { inject, Injectable } from "@angular/core";
import { IAuthStrategy } from "./interface";
import { Observable, of, tap } from "rxjs";
import { TLoginRequest, TLoginResponse } from "../../types/login";
import { HttpClient } from "@angular/common/http";
import { LocalStorageService } from "../localstorage";

@Injectable({
    providedIn: 'root'
})
export class AuthLocalStorageStrategy implements IAuthStrategy {
    private readonly httpService = inject(HttpClient);
    private readonly localstorageKey = 'access_token'
    private readonly localStorageService = inject(LocalStorageService)

    public login(body: TLoginRequest): Observable<TLoginResponse> {
        const url = 'http://localhost/api/v1/auth/login'
        this.removeAccessToken()

        return this.httpService.post<TLoginResponse>(url, body)
            .pipe(
                tap((res) => {
                    this.setAccessToken(res.data.token)
                })
            )
    }
    public logout(): void {
        this.removeAccessToken()
    }
    public getHeaders(): Record<string, string> {
        const token = this.getAccessToken()
        return token !== null ? { 'Authorization': `Bearer ${token}` } : {}
    }

    public isAuth() {
        return this.getAccessToken() !== null
    }

    public checkAuth(): Observable<boolean> {
        const hasToken = Boolean(this.getAccessToken())
        return of(hasToken)
    }

    private setAccessToken(token: string) {
        this.localStorageService.setItem(this.localstorageKey, token)
    }

    private removeAccessToken(): void {
        this.localStorageService.removeItem(this.localstorageKey)
    }

    private getAccessToken(): string | null {
        return this.localStorageService.getItem(this.localstorageKey)
    }

}
