import { Routes } from '@angular/router';
import { HomePage } from '../pages/home/home';
import { authGuard } from '../shared/guards/auth';

export const routes: Routes = [
    {
        path: '',
        component: HomePage,
    },
    {
        path: 'profile',
        loadComponent: () => import('../pages/profile/profile').then((m) => m.ProfilePage),
        canActivate: [authGuard]
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
