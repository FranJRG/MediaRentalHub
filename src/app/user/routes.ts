import { Routes } from "@angular/router";
import { UsersComponent } from "./users/users.component";
import { adminGuard } from "../shared/guards/admin.guard";
import { RentalsFormComponent } from "./rentals-form/rentals-form.component";
import { jwtGuard } from "../shared/guards/jwt.guard";
import { ModifyUserComponent } from "./modify-user/modify-user.component";
import { validTokenGuard } from "../shared/guards/valid-token.guard";

export const routes:Routes = [
    {
        path:'list', 
        component:UsersComponent,
        canMatch: [validTokenGuard,adminGuard]
    },
    {
        path:'rentals',
        component:RentalsFormComponent,
        canMatch: [validTokenGuard,jwtGuard]
    },
    {
        path:'editUsers/:id',
        component:ModifyUserComponent,
        canMatch:[validTokenGuard,adminGuard]
    },
    {
        path:'editUser/:id',
        component:ModifyUserComponent,
        canMatch:[validTokenGuard,jwtGuard]
    }
]