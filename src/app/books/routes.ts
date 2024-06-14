import { Routes } from "@angular/router";
import { BooksCatComponent } from "./books-cat/books-cat.component";
import { InfoComponent } from "./info/info.component";
import { BookFormComponent } from "./book-form/book-form.component";
import { adminGuard } from "../shared/guards/admin.guard";
import { ManageBooksComponent } from "./manage-books/manage-books.component";
import { validTokenGuard } from "../shared/guards/valid-token.guard";

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
        canMatch: [validTokenGuard,adminGuard]
    },
    {
        path:'editBook/:id',
        component:BookFormComponent,
        canMatch: [validTokenGuard,adminGuard]
    },
    {
        path:'manageBooks',
        component:ManageBooksComponent,
        canMatch: [validTokenGuard,adminGuard]
    }
]