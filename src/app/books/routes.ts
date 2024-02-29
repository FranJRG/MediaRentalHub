import { Routes } from "@angular/router";
import { BooksCatComponent } from "./books-cat/books-cat.component";
import { InfoComponent } from "./info/info.component";
import { BookFormComponent } from "./book-form/book-form.component";
import { adminGuard } from "../shared/guards/admin.guard";

export const routes:Routes = [
    {
        path:'catalogue',
        component:BooksCatComponent
    },
    {
        path:'infoBook/:id',
        component:InfoComponent
    },
    {
        path:'addBook',
        component:BookFormComponent,
        canMatch: [adminGuard]
    },
    {
        path:'editBook/:id',
        component:BookFormComponent,
        canMatch: [adminGuard]
    }
]