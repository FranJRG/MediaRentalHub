import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { jwtGuard } from './shared/guards/jwt.guard';
import { ErrorComponent } from './error/error.component';
import { validTokenGuard } from './shared/guards/valid-token.guard';

export const routes: Routes = [
    {
        path:'',
        component:HomeComponent
    },
    {
        path:'home',
        component:HomeComponent
    },
    {
        path:'users',
        loadChildren : () => import('./user/routes').then(mod => mod.routes),
        canMatch: [validTokenGuard,jwtGuard]
    },
    {
        path:'movies',
        loadChildren : () => import('./movies/routes').then(mod => mod.routes)
    },
    {
        path:'books',
        loadChildren : () => import('./books/routes').then(mod => mod.routes)
    },
    {
        path:'auth',
        loadChildren : () => import('./auth/routes').then(mod => mod.routes)
    },
    {
        path:'media',
        loadChildren : () => import('./media/routes').then(mod => mod.routes)
    },
    {
        path:'**',
        component:ErrorComponent
    }
];
