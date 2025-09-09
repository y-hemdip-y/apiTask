import { Component, OnInit } from '@angular/core';
import { UserService } from '../user-service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-put',
  standalone : true,
  imports: [CommonModule, ReactiveFormsModule, RouterOutlet,RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './put.html',
  styleUrl: './put.css'
})
export class Put implements OnInit {
  users: any[] = [];
  roles: any[] = [];
  selectedUser: any = null;
  updateForm: FormGroup;
  message: string = '';
  searchTerm: string = '';
  filteredUsers: any[] = [];

  constructor(private service: UserService, private fb: FormBuilder) {
  this.updateForm = this.fb.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['', [
      Validators.required,
      Validators.email,                     
      Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/) 
    ]],
    dial_code: ['', Validators.required],
    phone_number: ['', [Validators.required,Validators.pattern(/^\d{10}$/)]],
    gender: ['', Validators.required],
    role_id: ['', Validators.required]        
  });
}

  ngOnInit() {
    this.fetchUsersAndRoles();
  }

  fetchUsersAndRoles() {
  forkJoin({
    users: this.service.getUsers(),
    roles: this.service.getRoles()
  }).subscribe({
    next: ({ users, roles }: any) => {
      this.roles = roles.data?.list || roles;

      // ✅ map users with role_name
      this.users = (users.data?.list || users).map((user: any) => {
        const role = this.roles.find(r => r.id === user.role_id);
        return { ...user, role_name: role ? role.role_name : 'No role' };
      });

      // Initialize filteredUsers
      this.filteredUsers = [...this.users];
    },
    error: (err) => {
      console.error('Error fetching users or roles:', err);
    }
  });
}

filterUsers() {
  const term = this.searchTerm.toLowerCase();
  this.filteredUsers = this.users.filter(user => 
    user.first_name.toLowerCase().includes(term) ||
    user.last_name.toLowerCase().includes(term) ||
    user.email.toLowerCase().includes(term) ||
    user.phone_number.includes(term) ||
    user.gender?.toLowerCase().includes(term) ||
    (user.role_name?.toLowerCase().includes(term))
  );
  console.log("_+-=-",this.filterUsers)
}



  selectUser(user: any) {
    this.selectedUser = user;
    this.updateForm.patchValue({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      dial_code: user.dial_code,
      phone_number: user.phone_number,
      gender: user.gender,
      role_id: user.role_id
    });
    this.message = '';
  }

submitUpdate() {
  if (!this.selectedUser) {
    this.message = 'Please select a user to update';
    return;
  }

  // Trigger validation messages
  this.updateForm.markAllAsTouched();

  if (this.updateForm.invalid) {
    this.message = 'Please fill all required fields correctly';
    return;
  }

  const updatedData = this.updateForm.value;
  this.service.updateUser(this.selectedUser.id, updatedData).subscribe({
    next: () => {
      this.message = 'User updated successfully';
      this.fetchUsersAndRoles(); // refresh the list

      // ✅ Close modal and reset form
      this.selectedUser = null;
      this.updateForm.reset();
    },
    error: (err: any) => {
      console.error('Error updating user:', err);
      this.message = 'Failed to update user';
    }
  });
}

  deleteUser(user: any) {
    if (confirm(`Are you sure you want to delete ${user.first_name} ${user.last_name}?`)) {
      this.service.deleteUser(user.id).subscribe({
        next: () => {
          this.message = 'User deleted successfully';
          if (this.selectedUser?.id === user.id) this.selectedUser = null;
          this.fetchUsersAndRoles();
        },
        error: () => this.message = 'Failed to delete user'
      });
    }
  }

  uploadPhoto(event: any, user: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    this.service.uploadUserPhoto(file, user.id).subscribe({
      next: (res: any) => {
        const fileUrl = res?.data;
        if (!fileUrl) {
          this.message = 'Upload succeeded, but no file URL returned';
          return;
        }
        this.service.updateUser(user.id, { image: fileUrl }).subscribe({
          next: () => {
            this.message = 'Photo uploaded & linked successfully';
            this.fetchUsersAndRoles();
          },
          error: (err: any) => {
            console.error('Error linking photo to user:', err);
            this.message = 'Photo uploaded, but failed to link to user';
          }
        });
      },
      error: (err: any) => {
        console.error('Error uploading file:', err);
        this.message = 'Failed to send file to upload API';
      }
    });
  }
}
