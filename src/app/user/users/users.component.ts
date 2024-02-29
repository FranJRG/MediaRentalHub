import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit{

  users!:User[];

  constructor(private userService:UserService){}


  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next:(data) => this.users = data
    })
  }

  disactivatedUser(id?:number){
    this.userService.deleteUser(id).subscribe({
      next : () => {
        this.users = this.users.filter((user) => user.user_id != id);
      }
    })
  }

}
