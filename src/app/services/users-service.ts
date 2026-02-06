import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api-service';
import { UsersInterface } from '../common/users-interface';
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private endpoint = 'users';
    constructor(private api: ApiService) {}
  
    index(): Observable<UsersInterface[]> { return this.api.getAll<UsersInterface[]>(this.endpoint); }
    show(id: number): Observable<UsersInterface> { return this.api.getById<UsersInterface>(this.endpoint, id); }
    create(body: any): Observable<UsersInterface> { return this.api.create<UsersInterface>(this.endpoint, body); }
    update(id: number, body: any): Observable<UsersInterface> { return this.api.update<UsersInterface>(this.endpoint, id, body); }
    delete(id: number): Observable<any> { return this.api.delete<any>(this.endpoint, id); }
}
