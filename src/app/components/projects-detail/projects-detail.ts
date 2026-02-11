import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProjectInterface } from '../../common/project-interface';
import { ProjectsUsersInterface } from '../../common/projects-users-interface';
import { ProjectsMaterialsInterface } from '../../common/projects-materials-interface';
import { ProjectsEquipmentInterface } from '../../common/projects-equipment-interface';

import { ProjectsService } from '../../services/projects-service';
import { ProjectsUsersService } from '../../services/projects-users-service';
import { ProjectsMaterialsService } from '../../services/projects-materials-service';
import { ProjectsEquipmentsService } from '../../services/projects-equipments-service';

@Component({
  selector: 'app-projects-detail',
  standalone: false,
  templateUrl: './projects-detail.html',
  styleUrl: './projects-detail.css',
})
export class ProjectsDetail implements OnInit {
  projectId: number = 0;
  mode: string = 'info';

  loading: boolean = false;
  errorMsg: string = '';
  successMsg: string = '';

  project: ProjectInterface | null = null;

  users: ProjectsUsersInterface[] = [];
  materials: ProjectsMaterialsInterface[] = [];
  equipments: ProjectsEquipmentInterface[] = [];

  constructor(
    private route: ActivatedRoute,
    private projectsService: ProjectsService,
    private projectsUsersService: ProjectsUsersService,
    private projectsMaterialsService: ProjectsMaterialsService,
    private projectsEquipmentsService: ProjectsEquipmentsService,
  ) {}

  ngOnInit(): void {
    const idStr = this.route.snapshot.paramMap.get('id');
    this.projectId = Number(idStr);

    const modeStr = this.route.snapshot.queryParamMap.get('mode');
    this.mode = modeStr ? modeStr : 'info';

    if (isNaN(this.projectId) || this.projectId <= 0) {
      this.errorMsg = 'ID de proyecto inválido.';
      return;
    }

    this.loadAll();
  }

  loadAll(): void {
    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    this.loadProject();
    this.loadProjectUsers();
    this.loadProjectMaterials();
    this.loadProjectEquipments();
  }

  loadProject(): void {
    this.projectsService.show(this.projectId).subscribe({
      next: (res: ProjectInterface) => {
        this.project = res;
      },
      error: (err) => {
        this.errorMsg = err || 'Error cargando el proyecto';
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  loadProjectUsers(): void {
    this.projectsUsersService.index(this.projectId).subscribe({
      next: (res: ProjectsUsersInterface[]) => {
        this.users = res;
      },
      error: () => {},
      complete: () => {},
    });
  }

  loadProjectMaterials(): void {
    this.projectsMaterialsService.index(this.projectId).subscribe({
      next: (res: ProjectsMaterialsInterface[]) => {
        this.materials = res;
      },
      error: () => {},
      complete: () => {},
    });
  }

  loadProjectEquipments(): void {
    this.projectsEquipmentsService.index(this.projectId).subscribe({
      next: (res: ProjectsEquipmentInterface[]) => {
        this.equipments = res;
      },
      error: () => {},
      complete: () => {},
    });
  }
}