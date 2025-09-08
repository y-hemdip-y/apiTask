import { Component, OnInit } from '@angular/core';
import { UserService } from '../user-service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-post',
  standalone : true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './post.html',
  styleUrl: './post.css'
})
export class Post implements OnInit {

   userForm!: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
   selectedFile: File | null = null; 
     roles: any[] = [];
       uploadedPhotoUrl: string | null = null; 

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // Initialize form with validation
    this.userForm = new FormGroup({
      first_name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      last_name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      dial_code: new FormControl('+91', Validators.required),
      phone_number: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]),
      gender: new FormControl('male', Validators.required),
      user_type: new FormControl('4', Validators.required),
      role_name: new FormControl('', Validators.required),   
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });

     this.userService.getRoles().subscribe((res: any) => {
    this.roles = res.data.list || res; // assign API result to roles
    console.log("list roles"+ res.data.list);
    
  });
  }


  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }



  submitForm() {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.userForm.invalid) {
      this.errorMessage = 'Please fix the errors in the form before submitting';
      return;
    }

     const selectedRoleName = this.userForm.value.role_name; // currently holds role name from dropdown
    const selectedRole = this.roles.find(r => r.role_name === selectedRoleName);
    // const selectedRole = "hello";
    console.log("stored  "+selectedRole );
    if (!selectedRole) {
      this.errorMessage = 'Selected role is invalid';
      return;
    }

    // Replace role name with role ID in payload
    const payload = { ...this.userForm.value, role_id: selectedRole.id };
    delete payload.role_name; 


        if (this.selectedFile) {
      // Upload photo first
      this.userService.postUserPhoto(this.selectedFile).subscribe({
        next: (res: any) => {
          const photoUrl = res.data?.url || res.data || null;
          if (photoUrl) {
            payload.image = photoUrl;
          }
          // Create user after photo upload
          this.userService.createUser(payload).subscribe({
            next: (res) => {
              this.successMessage = 'User created successfully!';
              this.userForm.reset({ dial_code: '+91', gender: 'male', user_type: '4' });
              this.selectedFile = null;
            },
            error: (err) => {
              this.errorMessage = 'Failed to create user';
              console.error('Error:', err);
            }
          });
        },
        error: (err) => {
          this.errorMessage = 'Photo upload failed';
          console.error('Photo upload error:', err);
        }
      });
    } 

else{
    this.userService.createUser(payload).subscribe({
      next: (res) => {
        this.successMessage = 'User created successfully!';
        this.userForm.reset({ dial_code: '+91', gender: 'male', user_type: '4' });
      },
      error: (err) => {
        this.errorMessage = 'Failed to create user';
        console.error('Error:', err);
      }
    });
  }
  }

}
