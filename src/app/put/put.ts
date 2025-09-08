import { Component, OnInit } from '@angular/core';
import { UserService } from '../user-service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-put',
  standalone : true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './put.html',
  styleUrl: './put.css'
})

export class Put implements OnInit {
  users: any[] = [];
  selectedUser: any = null;
  updateForm: FormGroup;
  message: string = '';

  constructor(private service: UserService, private fb: FormBuilder) {
    // Reuse same form structure and validations as POST
    this.updateForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dial_code: ['', Validators.required],
      phone_number: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      gender: ['', Validators.required],
      user_type: ['', Validators.required],
      role_id: ['', Validators.required],
      password: ['', Validators.required] 
    });
  }

  ngOnInit() {
    // Reuse GET service method to fetch users
    this.fetchUsers();
  }

  fetchUsers() {
    this.service.getUsers().subscribe({
      next: (res: any) => {
        this.users = res.data.list || res;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }

    });
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
      user_type: user.user_type,
      role_id: user.role_id,
      password: user.password
    });
    this.message = '';
  }

  submitUpdate() {
    if (!this.selectedUser) {
      this.message = 'Please select a user to update';
      return;
    }

    if (this.updateForm.invalid) {
      this.message = 'Please fill all required fields correctly';
      return;
    }

    const updatedData = this.updateForm.value;
    this.service.updateUser(this.selectedUser.id, updatedData).subscribe({
      next: () => {
        this.message = 'User updated successfully';
        this.fetchUsers(); // refresh the list
      },
      error: (err : any) => {
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
          this.fetchUsers();
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
      console.log('Upload response:', res);

      const fileUrl = res?.data;

      if (!fileUrl) {
        this.message = 'Upload succeeded, but no file URL returned';
        return;
      }

      // ✅ Update the user record with image URL
      this.service.updateUser(user.id, { image: fileUrl }).subscribe({
        next: () => {
          this.message = 'Photo uploaded & linked successfully';
          this.fetchUsers();
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
