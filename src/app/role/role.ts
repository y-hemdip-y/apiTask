import { Component, OnInit } from '@angular/core';
import { UserService } from '../user-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-role',
  imports: [FormsModule, CommonModule],
  templateUrl: './role.html',
  styleUrl: './role.css'
})
export class Role implements OnInit {

   roleName : string = '';
   description : string = '';
   roles: any[] = [];
   editingRoleId: string = '';  

  constructor(private userService: UserService) {}

  ngOnInit(){
     this.getRoles();
  }

   createRole() {
    if (!this.roleName) return;

    if (this.editingRoleId) {
      // Update existing role
      this.userService.updateRole(this.editingRoleId, this.roleName, this.description)
        .subscribe(() => {
          this.roleName = '';
          this.description = '';
          this.editingRoleId = '';
          this.getRoles();
        });
    } else {
      // Create new role
      this.userService.createRole(this.roleName, this.description)
        .subscribe(() => {
          this.roleName = '';
          this.description = '';
          this.getRoles();
        });
    }
  }

  // Fetch all roles
  getRoles() {
    this.userService.getRoles().subscribe((res: any) => {
      this.roles = res.data.list || res; // adjust if API wraps roles in data
      console.log("roles fetched", this.roles);
    });
  }

  editRole(role: any) {
    this.editingRoleId = role.id; // use API id field
    this.roleName = role.role_name;
    this.description = role.description;
  }

  // Delete a role
deleteRole(roleId: string) {
  this.userService.deleteRole(roleId).subscribe(() => {
    this.getRoles(); // refresh list after deletion
  });
}

  
}
