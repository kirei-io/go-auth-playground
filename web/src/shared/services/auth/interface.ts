import { Observable } from "rxjs";

export interface IAuthStrategy {
    login(body: unknown): Observable<unknown>
    logout(): void
    getHeaders(): Record<string, string>
    isAuth(): boolean
    checkAuth(): Observable<boolean>
}
