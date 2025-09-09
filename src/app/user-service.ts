import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'https://devapi.fixlastmile.com/api/api/v1/user';
  private photoUploadUrl = 'https://devapi.fixlastmile.com/api/api/v1/company/upload';
  private roleBaseUrl = 'https://devapi.fixlastmile.com/api/api/v1/permission/role';
  


  constructor(private http: HttpClient) {}

  getUsers(page: number = 1, userType: number = 4, search: string = ''): Observable<any> {
    
    return this.http.get('https://devapi.fixlastmile.com/api/api/v1/user');
  }

   // New POST method
createUser(userData: {
  first_name: string;
  last_name: string;
  email: string;
  dial_code: string;
  phone_number: string;
  gender: string;
  user_type: string;
  password: string;
  role_id: string; 
  image?: string;
}): Observable<any> {
  return this.http.post(this.baseUrl, userData);
}

    // PUT - update existing user
  updateUser(id: string, updatedData: {
   first_name?: string;
    last_name?: string;
    email?: string;
    dial_code?: string;
    phone_number?: string;
    gender?: string;
    user_type?: string;
    role_id?: string;
    password?: string;
    image?: string; // add image field here
  }): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put(url, updatedData);
  }

  // DELETE - remove user
  deleteUser(id: string): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete(url);
  }

  
  
  uploadUserPhoto(file: File, userId: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(this.photoUploadUrl, formData)
    
  }


 postUserPhoto(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.photoUploadUrl, formData);
  }


  
// ----- Role methods -----
createRole(roleName: string, description: string): Observable<any> {
  const roleBaseUrl = 'https://devapi.fixlastmile.com/api/api/v1/permission/role';
  return this.http.post(roleBaseUrl, { role_name: roleName, description: description });
}

getRoles(): Observable<any> {
  const roleBaseUrl = 'https://devapi.fixlastmile.com/api/api/v1/permission/role';
  return this.http.get(roleBaseUrl);
}

updateRole(roleId: string, roleName: string, description: string): Observable<any> {
  const roleBaseUrl = 'https://devapi.fixlastmile.com/api/api/v1/permission/role';
  return this.http.put(`${roleBaseUrl}/${roleId}`, { 
    role_name: roleName, 
    description: description 
  });
}

deleteRole(roleId: string): Observable<any> {
  const roleBaseUrl = 'https://devapi.fixlastmile.com/api/api/v1/permission/role';
  return this.http.delete(`${roleBaseUrl}/${roleId}`);
}

  
}
