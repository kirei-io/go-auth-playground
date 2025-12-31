import { Injectable } from "@angular/core";
import { IAuthStrategy } from "./interface";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AuthCookieStrategy implements IAuthStrategy {
    login(body: unknown): Observable<unknown> {
        throw new Error("Method not implemented.");
    }
    logout(): void {
        throw new Error("Method not implemented.");
    }
    getHeaders(): Record<string, string> {
        throw new Error("Method not implemented.");
    }
    isAuth() {
        return true
    }
}
