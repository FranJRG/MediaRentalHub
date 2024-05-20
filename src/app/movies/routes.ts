import { Routes } from "@angular/router";
import { MoviesCatComponent } from "./movies-cat/movies-cat.component";
import { InfoComponent } from "./info/info.movie.component";
import { MovieFormComponent } from "./movie-form/movie-form.component";
import { adminGuard } from "../shared/guards/admin.guard";
import { jwtGuard } from "../shared/guards/jwt.guard";
import { ManageMoviesComponent } from "./manage-movies/manage-movies.component";


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
        canMatch: [adminGuard]
    },
    {
        path:'editMovie/:id',
        component:MovieFormComponent,
        canMatch: [adminGuard]
    },
    {
        path:'manageMovies',
        component:ManageMoviesComponent,
        canMatch: [adminGuard]
    }
]