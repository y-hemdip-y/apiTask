import { Component, OnInit } from '@angular/core';
import { UserService } from '../user-service';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-get',
  standalone : true,
  imports: [CommonModule],
  templateUrl: './get.html',
  styleUrl: './get.css'
})
export class Get implements OnInit {

  users : any[]=[];
  roles : any[]=[];
  error: string = '';

currentPage: number = 1;
pageSize: number = 10;
totalUsers: number = 0;
pagedUsers: any[] = [];

  constructor(private service : UserService){}
  
 ngOnInit(){
   this.fetchUsers();
 }

  fetchUsers(){
       forkJoin({
      users: this.service.getUsers(),
      roles: this.service.getRoles()
    }).subscribe({
      next: ({ users, roles }: any) => {
        this.roles = roles.data?.list || roles;
        this.users = (users.data?.list || users).map((user: any) => {
          const role = this.roles.find(r => r.id === user.role_id);
          return { ...user, role_name: role ? role.role_name : 'No role' };
        });
        this.totalUsers = this.users.length;
        this.setPagedUsers();
      },
      error: (err : any) => {
        console.error('Error fetching users or roles:', err);
        this.error = 'Failed to load users';
      }
    });
    
  }
setPagedUsers() {
  const start = (this.currentPage - 1) * this.pageSize;
  const end = start + this.pageSize;
  this.pagedUsers = this.users.slice(start, end);
}

nextPage() {
  if (this.currentPage * this.pageSize < this.totalUsers) {
    this.currentPage++;
    this.setPagedUsers();
  }
}

prevPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.setPagedUsers();
  }
}

}
