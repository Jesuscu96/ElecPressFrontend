import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api-service';
import { MaterialsCategoriesInterface } from '../common/materials-categories-interface';

@Injectable({
  providedIn: 'root',
})
export class MaterialCategoriesService {
  private endpoint = 'material-categories';
  constructor(private api: ApiService) {}

  index(): Observable<MaterialsCategoriesInterface[]> {
    return this.api.getAll<MaterialsCategoriesInterface[]>(this.endpoint);
  }
  show(id: number): Observable<MaterialsCategoriesInterface> {
    return this.api.getById<MaterialsCategoriesInterface>(this.endpoint, id);
  }
  create(body: any): Observable<MaterialsCategoriesInterface> {
    return this.api.create<MaterialsCategoriesInterface>(this.endpoint, body);
  }
  update(id: number, body: any): Observable<MaterialsCategoriesInterface> {
    return this.api.update<MaterialsCategoriesInterface>(this.endpoint, id, body);
  }
  delete(id: number): Observable<any> {
    return this.api.delete<any>(this.endpoint, id);
  }
}
