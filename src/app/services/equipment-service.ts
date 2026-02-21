import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api-service';
import { EquipmentInterface } from '../common/equipment-interface';

@Injectable({
  providedIn: 'root',
})
export class EquipmentService {
   private endpoint = 'equipment';
    constructor(private api: ApiService) {}
  
    index(): Observable<EquipmentInterface[]> {
      return this.api.getAll<EquipmentInterface[]>(this.endpoint);
    }
    show(id: number): Observable<EquipmentInterface> {
      return this.api.getById<EquipmentInterface>(this.endpoint, id);
    }
    create(body: any): Observable<EquipmentInterface> {
      return this.api.create<EquipmentInterface>(this.endpoint, body);
    }
    update(id: number, body: any): Observable<EquipmentInterface> {
      return this.api.update<EquipmentInterface>(this.endpoint, id, body);
    }
    delete(id: number): Observable<any> {
      return this.api.delete<any>(this.endpoint, id);
    }
}
