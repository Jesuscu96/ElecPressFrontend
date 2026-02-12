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
  loadingUsers: boolean = false;
  loadingMaterials: boolean = false;
  loadingEquipment: boolean = false;
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

    this.loadProject();
    this.loadProjectUsers();
    this.loadProjectMaterials();
    this.loadProjectEquipments();
  }

  

  loadProject(): void {
    this.loading = true;
    this.projectsService.show(this.projectId).subscribe({
      next: (value: ProjectInterface) => {
        this.project = value;
      },
      error: (err) => {
        this.errorMsg = 'Error cargando el proyecto';
        console.error(err);
        this.loading= false;
        
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  loadProjectUsers(): void {
    this.projectsUsersService.index(this.projectId).subscribe({
      next: (value) => {
        this.users = value;
      },
      error: (err) => {
        console.error(err);
        
      },
      complete: () => {},
    });
  }

  loadProjectMaterials(): void {
    this.projectsMaterialsService.index(this.projectId).subscribe({
      next: (value) => {
        this.materials = value;
      },
      error: (err) => {
        console.error(err);
        
      },
      complete: () => {},
    });
  }

  loadProjectEquipments(): void {
    this.projectsEquipmentsService.index(this.projectId).subscribe({
      next: (value) => {
        this.equipments = value;
      },
      error: (err) => {
        console.error(err);        
      },
      complete: () => {},
    });
  }
}