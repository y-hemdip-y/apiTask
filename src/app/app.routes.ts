import { Routes } from '@angular/router';
import { Get } from './get/get';
import { Post } from './post/post';
import { Put } from './put/put';
import { Role } from './role/role';

export const routes: Routes = [
    {path : 'get', component : Get},
    { path : 'post', component : Post},
    { path : 'put', component : Put},
    {path : 'role', component: Role}
];
