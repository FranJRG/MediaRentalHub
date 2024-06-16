import { Routes } from "@angular/router";
import { RentComponent } from "./rent/rent.component";
import { jwtGuard } from "../shared/guards/jwt.guard";


export const routes:Routes = [
    {
        path:'rent/:id',
        component:RentComponent,
        canMatch: [jwtGuard]
    }
]