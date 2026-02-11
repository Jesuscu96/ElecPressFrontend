import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api-service';
import { ProjectsMaterialsInterface } from '../common/projects-materials-interface';
@Injectable({
  providedIn: 'root',
})
export class ProjectsMaterialsService {
  private endpoint = 'project-materials';
  constructor(private api: ApiService) {}

  index(id_project: number): Observable<ProjectsMaterialsInterface[]> { return this.api.getAll<ProjectsMaterialsInterface[]>(`${this.endpoint}?id_project=${id_project}`); }
  show(id: number): Observable<ProjectsMaterialsInterface> { return this.api.getById<ProjectsMaterialsInterface>(this.endpoint, id); }
  create(body: any): Observable<ProjectsMaterialsInterface> { return this.api.create<ProjectsMaterialsInterface>(this.endpoint, body); }
  update(id: number, body: any): Observable<ProjectsMaterialsInterface> { return this.api.update<ProjectsMaterialsInterface>(this.endpoint, id, body); }
  delete(id: number): Observable<any> { return this.api.delete<any>(this.endpoint, id); }
}
