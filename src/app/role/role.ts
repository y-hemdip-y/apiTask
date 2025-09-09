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
 roleName: string = '';
  description: string = '';
  roles: any[] = [];
  searchTerm: string = '';
  filteredRoles: any[] = [];
  editingRoleId: string = '';
  isOverlayOpen: boolean = false; // overlay form visibility
  isLoading: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.getRoles();
  }

  // Open overlay form for creating or editing role
  openRoleForm(role?: any) {
    if (role) {
      // Edit existing role
      this.editingRoleId = role.id;
      this.roleName = role.role_name;
      this.description = role.description;
    } else {
      // Create new role
      this.editingRoleId = '';
      this.roleName = '';
      this.description = '';
    }
    this.isOverlayOpen = true;
  }

  // Close overlay form
  closeRoleForm() {
    this.isOverlayOpen = false;
    this.roleName = '';
    this.description = '';
    this.editingRoleId = '';
  }

  // Submit role (create or update)
  submitRole() {
    if (!this.roleName.trim()) {
      alert('Role name is required');
      return;
    }

    this.isLoading = true;

    const observable = this.editingRoleId
      ? this.userService.updateRole(this.editingRoleId, this.roleName, this.description)
      : this.userService.createRole(this.roleName, this.description);

    observable.subscribe({
      next: () => {
        this.getRoles();
        alert(this.editingRoleId ? 'Role updated successfully' : 'Role created successfully');
        this.closeRoleForm();
      },
      error: (err) => {
        console.error('Error saving role:', err);
        alert(err?.error?.message || 'Something went wrong while saving the role');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  getRoles() {
    this.isLoading = true;
    this.userService.getRoles().subscribe({
      next: (res: any) => {
        this.roles = res.data?.list || res;
         this.filteredRoles = [...this.roles];
        console.log('Roles fetched:', this.roles);
      },
      error: (err) => {
        console.error('Error fetching roles:', err);
        alert(err?.error?.message || 'Failed to fetch roles');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
 
  }


  getFilteredRoles(){ 
 const search = this.searchTerm.toLowerCase();
 this.filteredRoles = this.roles.filter(roles=>
  roles.role_name?.toLowerCase().includes(search)||
  roles.description?.toLowerCase().includes(search)
 );

}

  // Delete a role
  deleteRole(roleId: string) {
    if (!confirm('Are you sure you want to delete this role?')) return;

    this.isLoading = true;
    this.userService.deleteRole(roleId).subscribe({
      next: () => {
        this.getRoles();
        alert('Role deleted successfully');
      },
      error: (err) => {
        console.error('Error deleting role:', err);
        alert(err?.error?.message || 'Failed to delete role');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
  
}
