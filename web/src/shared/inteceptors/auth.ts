import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AUTH_STRATEGY } from "../services/auth";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
    const authService = inject(AUTH_STRATEGY);

    const modifiedReq = req.clone({
        setHeaders: authService.getHeaders(),
        withCredentials: true
    })

    return next(modifiedReq)
}
