import { HttpClient } from "@angular/common/http";
import { DestroyRef, inject, Injectable } from "@angular/core";
import { TLoginRequest, TLoginResponse } from "../types/login";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Observable, tap } from "rxjs";
import { TSignupRequest, TSignupResponse } from "../types/signup";
import { ActivatedRoute, Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class AuthSerivce {
    private http = inject(HttpClient)
    private destroyRef = inject(DestroyRef)
    private baseURL = 'http://localhost:8080'
    private readonly accessTokenKey = 'access_token'
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    public login(body: TLoginRequest): Observable<TLoginResponse> {
        this.removeAccessToken()
        const url = new URL('/api/v1/auth/login', this.baseURL).toString()
        return this.http.post<TLoginResponse>(url, body).pipe(
            tap(({ data }) => {
                this.saveAccessToken(data.token);
                this.navigateAfterLogin()
            }),
            takeUntilDestroyed(this.destroyRef)
        )
    }

    public signup(body: TSignupRequest): Observable<TSignupResponse> {
        this.removeAccessToken()
        const url = new URL('/api/v1/auth/signup', this.baseURL).toString()
        return this.http.post<TSignupResponse>(url, body).pipe(
            takeUntilDestroyed(this.destroyRef)
        )
    }

    public saveAccessToken(accessToken: string): void {
        localStorage.setItem(this.accessTokenKey, accessToken)
    }

    public getAccessToken(): string | null {
        return localStorage.getItem(this.accessTokenKey)
    }

    public removeAccessToken(): void {
        localStorage.removeItem(this.accessTokenKey)
    }

    public isAuth(): boolean {
        return this.getAccessToken() !== null
    }

    public navigateAfterLogin() {
        this.router.navigate(['/profile'])
    }
}
