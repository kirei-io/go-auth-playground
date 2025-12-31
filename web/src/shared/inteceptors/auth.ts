import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthSerivce } from "../services/auth";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
    const authToken = inject(AuthSerivce).getAccessToken()
    if (authToken != null) {
        const newReq = req.clone({
            headers: req.headers.append('Authorization', `Bearer ${authToken}`),
        });
        return next(newReq);
    }

    return next(req)
}
