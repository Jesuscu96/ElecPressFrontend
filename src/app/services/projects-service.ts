import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api-service';
import { ProjectInterface } from '../common/project-interface'; 

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private endpoint = 'projects';

  constructor(private api: ApiService) {}

  index(): Observable<ProjectInterface[]> {
    return this.api.getAll<ProjectInterface[]>(this.endpoint);
  }

  show(id: number): Observable<ProjectInterface> {
    return this.api.getById<ProjectInterface>(this.endpoint, id);
  }

  create(body: any): Observable<ProjectInterface> {
    return this.api.create<ProjectInterface>(this.endpoint, body);
  }

  update(id: number, body: any): Observable<ProjectInterface> {
    return this.api.update<ProjectInterface>(this.endpoint, id, body);
  }

  delete(id: number): Observable<any> {
    return this.api.delete<any>(this.endpoint, id);
  }
}
