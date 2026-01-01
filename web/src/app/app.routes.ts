import { ResolveFn, Routes } from '@angular/router';
import { HomePage } from '../pages/home/home';
import { authGuard } from '../shared/guards/auth';
import { AuthProxyStrategy } from '../shared/services/auth';
import { inject } from '@angular/core';

export const authResolver: ResolveFn<boolean> = () => {
    const authService = inject(AuthProxyStrategy);

    if (authService.isAuth()) {
        authService.checkAuth().subscribe();
        return true;
    }

    return authService.checkAuth();
};

export const routes: Routes = [
    {
        path: '',
        component: HomePage,
        resolve: { isAuth: authResolver },
        children: [
            {
                path: 'profile',
                loadComponent: () => import('../pages/profile/profile').then((m) => m.ProfilePage),
                canActivate: [authGuard]
            },
        ]
    },
    {
        path: 'login',
        loadComponent: () => import('../pages/login/login').then((m) => m.LoginPage)
    },
    {
        path: 'signup',
        loadComponent: () => import('../pages/signup/signup').then((m) => m.SignupPage)
    },
];
