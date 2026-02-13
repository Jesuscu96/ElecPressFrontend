import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api-service';
import { ProjectsEquipmentInterface } from '../common/projects-equipment-interface';
@Injectable({
  providedIn: 'root',
})
export class ProjectsEquipmentsService {
  private endpoint = 'project-equipment';
  constructor(private api: ApiService) {}

  index(id_project: number): Observable<ProjectsEquipmentInterface[]> {
    return this.api.getAll<ProjectsEquipmentInterface[]>(
      `${this.endpoint}?id_project=${id_project}`,
    );
  }
  show(id: number): Observable<ProjectsEquipmentInterface> {
    return this.api.getById<ProjectsEquipmentInterface>(this.endpoint, id);
  }
  create(body: any): Observable<ProjectsEquipmentInterface> {
    return this.api.create<ProjectsEquipmentInterface>(this.endpoint, body);
  }
  update(id: number, body: any): Observable<ProjectsEquipmentInterface> {
    return this.api.update<ProjectsEquipmentInterface>(this.endpoint, id, body);
  }
  delete(id: number): Observable<any> {
    return this.api.delete<any>(this.endpoint, id);
  }
}
