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

  loadingProjects: boolean = false;
  loadingUsers: boolean = false;
  loadingMaterials: boolean = false;
  loadingEquipment: boolean = false;
  errorMsg: string = '';
  successMsg: string = '';

  project: ProjectInterface | null = null;

  users: ProjectsUsersInterface[] = [];
  usersPaginated: ProjectsUsersInterface[] = [];
  materials: ProjectsMaterialsInterface[] = [];
  materialsPaginated: ProjectsMaterialsInterface[] = [];
  equipments: ProjectsEquipmentInterface[] = [];
  equipmentsPaginated: ProjectsEquipmentInterface[] = [];


  currentPageMaterials: number = 1;
  pageSizeMaterials: number = 8;
  totalPagesMaterials: number = 1;


  currentPageUsers: number = 1;
  pageSizeUsers: number = 8;
  totalPagesUsers: number = 1;


  currentPageEquipment: number = 1;
  pageSizeEquipment: number = 8;
  totalPagesEquipment: number = 1;


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
    this.loadingProjects = true;
    this.projectsService.show(this.projectId).subscribe({
      next: (value: ProjectInterface) => {
        this.project = value;
      },
      error: (err) => {
        this.errorMsg = 'Error cargando el proyecto';
        console.error(err);
        this.loadingProjects = false;
        
      },
      complete: () => {
        this.loadingProjects = false;
      },
    });
  }

  loadProjectUsers(): void {
    this.loadingUsers = true;
    this.projectsUsersService.index(this.projectId).subscribe({
      next: (value) => {
        this.users = value;
        this.updatePagedUsers();
      },
      error: (err) => {
        console.error(err);
        this.loadingUsers = false;
        
      },
      complete: () => {
        this.loadingUsers = false;
      },
    });
  }

  updatePagedUsers(): void {
    this.totalPagesUsers = Math.ceil(this.users.length / this.pageSizeUsers);
    if (this.totalPagesUsers < 1) this.totalPagesUsers = 1;

    if (this.currentPageUsers > this.totalPagesUsers) this.currentPageUsers = this.totalPagesUsers;
    if (this.currentPageUsers < 1) this.currentPageUsers = 1;

    const start = (this.currentPageUsers - 1) * this.pageSizeUsers;
    const end = start + this.pageSizeUsers;

    this.usersPaginated = this.users.slice(start, end);
  }

  prevPageUsers(): void {
    if (this.currentPageUsers > 1) {
      this.currentPageUsers = this.currentPageUsers - 1;
      this.updatePagedUsers();
    }
  }

  nextPageUsers(): void {
    if (this.currentPageUsers < this.totalPagesUsers) {
      this.currentPageUsers = this.currentPageUsers + 1;
      this.updatePagedUsers();
    }
  }

  loadProjectMaterials(): void {
    this.loadingMaterials = true;
    this.projectsMaterialsService.index(this.projectId).subscribe({
      next: (value) => {
        this.materials = value;
        this.updatePagedMaterials();
      },
      error: (err) => {
        console.error(err);
        this.loadingMaterials = false;
        
      },
      complete: () => {
        this.loadingMaterials = false;
      },
    });
  }


  updatePagedMaterials(): void {
    this.totalPagesMaterials = Math.ceil(this.materials.length / this.pageSizeMaterials);
    if (this.totalPagesMaterials < 1) this.totalPagesMaterials = 1;

    if (this.currentPageMaterials > this.totalPagesMaterials) this.currentPageMaterials = this.totalPagesMaterials;
    if (this.currentPageMaterials < 1) this.currentPageMaterials = 1;

    const start = (this.currentPageMaterials - 1) * this.pageSizeMaterials;
    const end = start + this.pageSizeMaterials;

    this.materialsPaginated = this.materials.slice(start, end);
  }

  prevPageMaterials(): void {
    if (this.currentPageMaterials > 1) {
      this.currentPageMaterials = this.currentPageMaterials - 1;
      this.updatePagedMaterials();
    }
  }

  nextPageMaterials(): void {
    if (this.currentPageMaterials < this.totalPagesMaterials) {
      this.currentPageMaterials = this.currentPageMaterials + 1;
      this.updatePagedMaterials();
    }
  }

  loadProjectEquipments(): void {
    this.loadingEquipment = true;
    this.projectsEquipmentsService.index(this.projectId).subscribe({
      next: (value) => {
        this.equipments = value;
        this.updatePagedEquipments();
      },
      error: (err) => {
        console.error(err);
        this.loadingEquipment = false;     
      },
      complete: () => {
        this.loadingEquipment = false;
      },
    });
  }


  updatePagedEquipments(): void {
    this.totalPagesEquipment = Math.ceil(this.equipments.length / this.pageSizeEquipment);
    if (this.totalPagesEquipment < 1) this.totalPagesEquipment = 1;

    if (this.currentPageEquipment > this.totalPagesEquipment) this.currentPageEquipment = this.totalPagesEquipment;
    if (this.currentPageEquipment < 1) this.currentPageEquipment = 1;

    const start = (this.currentPageEquipment - 1) * this.pageSizeEquipment;
    const end = start + this.pageSizeEquipment;

    this.equipmentsPaginated = this.equipments.slice(start, end);
  }

  prevPageEquipments(): void {
    if (this.currentPageEquipment > 1) {
      this.currentPageEquipment = this.currentPageEquipment - 1;
      this.updatePagedEquipments();
    }
  }

  nextPageEquipments(): void {
    if (this.currentPageEquipment < this.totalPagesEquipment) {
      this.currentPageEquipment = this.currentPageEquipment + 1;
      this.updatePagedEquipments();
    }
  }


}