import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { UserStateService } from "../services/user-storage";
import { Router } from "@angular/router";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const userState = inject(UserStateService);
    const router = inject(Router);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                userState.setUnauthenticated();

                if (!router.url.includes('login')) {
                    router.navigate(['/login']);
                }
            }
            return throwError(() => error);
        })
    );
};
