import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";

//Rutas de navegación para estos componentes
export const routes:Routes = [
    {
        path:'login',
        component: LoginComponent
    },
    {
        path:'register',
        component:RegisterComponent
    }
]