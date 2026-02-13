import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api-service';
import { MaterialsInterface } from '../common/materials-interface'; 


@Injectable({
  providedIn: 'root',
})
export class MaterialsService {
  private endpoint = 'materials';
    constructor(private api: ApiService) {}
  
    index(): Observable<MaterialsInterface[]> {
      return this.api.getAll<MaterialsInterface[]>(this.endpoint);
    }
    show(id: number): Observable<MaterialsInterface> {
      return this.api.getById<MaterialsInterface>(this.endpoint, id);
    }
    create(body: any): Observable<MaterialsInterface> {
      return this.api.create<MaterialsInterface>(this.endpoint, body);
    }
    update(id: number, body: any): Observable<MaterialsInterface> {
      return this.api.update<MaterialsInterface>(this.endpoint, id, body);
    }
    delete(id: number): Observable<any> {
      return this.api.delete<any>(this.endpoint, id);
    }
  
}
