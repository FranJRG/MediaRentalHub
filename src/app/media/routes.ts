import { Routes } from "@angular/router";
import { RentComponent } from "./rent/rent.component";
import { jwtGuard } from "../shared/guards/jwt.guard";
import { validTokenGuard } from "../shared/guards/valid-token.guard";


export const routes:Routes = [
    {
        path:'rent/:id',
        component:RentComponent,
        canMatch: [validTokenGuard,jwtGuard]
    }
]