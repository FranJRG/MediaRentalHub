import { Routes } from "@angular/router";
import { MoviesCatComponent } from "./movies-cat/movies-cat.component";
import { InfoComponent } from "./info/info.component";
import { MovieFormComponent } from "./movie-form/movie-form.component";
import { adminGuard } from "../shared/guards/admin.guard";
import { jwtGuard } from "../shared/guards/jwt.guard";
import { ManageMoviesComponent } from "./manage-movies/manage-movies.component";
import { validTokenGuard } from "../shared/guards/valid-token.guard";


export const routes:Routes = [
    {
        path:'catalogue',
        component:MoviesCatComponent
    },
    {
        path:'infoMovie/:id',
        component:InfoComponent
    },
    {
        path:'addMovie',
        component:MovieFormComponent,
        canMatch: [validTokenGuard,adminGuard]
    },
    {
        path:'editMovie/:id',
        component:MovieFormComponent,
        canMatch: [validTokenGuard,adminGuard]
    },
    {
        path:'manageMovies',
        component:ManageMoviesComponent,
        canMatch: [validTokenGuard,adminGuard]
    }
]