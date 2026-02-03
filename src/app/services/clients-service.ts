import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api-service';
import { ClientInterface } from '../common/client-interface';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  private endpoint = 'clients';
  constructor(private api: ApiService) {}

  index(): Observable<ClientInterface[]> { return this.api.getAll<ClientInterface[]>(this.endpoint); }
  show(id: number): Observable<ClientInterface> { return this.api.getById<ClientInterface>(this.endpoint, id); }
  create(body: any): Observable<ClientInterface> { return this.api.create<ClientInterface>(this.endpoint, body); }
  update(id: number, body: any): Observable<ClientInterface> { return this.api.update<ClientInterface>(this.endpoint, id, body); }
  delete(id: number): Observable<any> { return this.api.delete<any>(this.endpoint, id); }

}
