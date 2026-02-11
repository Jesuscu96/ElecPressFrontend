import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api-service';
import { ProjectsUsersInterface } from '../common/projects-users-interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectsUsersService {
  private endpoint = 'project-users';
  constructor(private api: ApiService) {}

  index(id_project: number): Observable<ProjectsUsersInterface[]> { return this.api.getAll<ProjectsUsersInterface[]>(`${this.endpoint}?id_project=${id_project}`); }
  show(id: number): Observable<ProjectsUsersInterface> { return this.api.getById<ProjectsUsersInterface>(this.endpoint, id); }
  create(body: any): Observable<ProjectsUsersInterface> { return this.api.create<ProjectsUsersInterface>(this.endpoint, body); }
  update(id: number, body: any): Observable<ProjectsUsersInterface> { return this.api.update<ProjectsUsersInterface>(this.endpoint, id, body); }
  delete(id: number): Observable<any> { return this.api.delete<any>(this.endpoint, id); }
}
