import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProjectInterface } from '../../common/project-interface';
import { ClientInterface } from '../../common/client-interface';

import { ProjectsUsersInterface } from '../../common/projects-users-interface';
import { ProjectsMaterialsInterface } from '../../common/projects-materials-interface';
import { ProjectsEquipmentInterface } from '../../common/projects-equipment-interface';

import { ProjectsService } from '../../services/projects-service';
import { ClientsService } from '../../services/clients-service';
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
  private pendingLoads: number = 0;

  errorMsg: string = '';
  successMsg: string = '';

  project: ProjectInterface | null = null;

  clients: ClientInterface[] = [];

  users: ProjectsUsersInterface[] = [];
  materials: ProjectsMaterialsInterface[] = [];
  equipments: ProjectsEquipmentInterface[] = [];

  
  editName: string = '';
  editBudget: string = '';
  editClientId: string = '';


  matQty: { [id: number]: string } = {};
  eqQty: { [id: number]: string } = {};

  
  confirmKey: string | null = null;
  confirmKind: string = ''; 
  confirmId: number = 0;
  confirmText: string = '';
  confirmButtonText: string = 'Confirmar';

  constructor(
    private route: ActivatedRoute,
    private projectsService: ProjectsService,
    private clientsService: ClientsService,
    private projectsUsersService: ProjectsUsersService,
    private projectsMaterialsService: ProjectsMaterialsService,
    private projectsEquipmentsService: ProjectsEquipmentsService
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
    this.errorMsg = '';
    this.successMsg = '';
    this.confirmClear();

    this.loading = true;
    this.pendingLoads = 4;

    this.loadProject();
    this.loadProjectUsers();
    this.loadProjectMaterials();
    this.loadProjectEquipments();
    this.loadClients();
  }

  private finishLoad(): void {
    this.pendingLoads = this.pendingLoads - 1;
    if (this.pendingLoads <= 0) {
      this.loading = false;
    }
  }

  loadProject(): void {
    this.projectsService.show(this.projectId).subscribe({
      next: (res: ProjectInterface) => {
        this.project = res;
        this.editName = res.name ? String(res.name) : '';
        this.editBudget =  res.budget !== null ? String(res.budget) : '';
        this.editClientId = res.id_client !== undefined && res.id_client !== null ? String(res.id_client) : '';
      },
      error: (err) => {
        this.errorMsg = err || 'Error cargando proyecto';
      },
      complete: () => {
        this.finishLoad();
      },
    });
  }

  loadClients(): void {
    this.clientsService.index().subscribe({
      next: (res: ClientInterface[]) => {
        this.clients = res;
      },
      error: () => {},
      complete: () => {},
    });
  }

  loadProjectUsers(): void {
    this.projectsUsersService.index(this.projectId).subscribe({
      next: (res: ProjectsUsersInterface[]) => {
        this.users = res;
      },
      error: (err) => {
        console.log(err);
        
      },
      complete: () => {
        this.finishLoad();
      },
    });
  }

  loadProjectMaterials(): void {
    this.projectsMaterialsService.index(this.projectId).subscribe({
      next: (res: ProjectsMaterialsInterface[]) => {
        this.materials = res;

        
        this.matQty = {};
        for (let i = 0; i < this.materials.length; i++) {
          const m: any = this.materials[i];
          const id = Number(m.id);
          this.matQty[id] = this.getMaterialQtyString(m);
        }
      },
      error: (err) => {
        console.log(err);
        
      },
      complete: () => {
        this.finishLoad();
      },
    });
  }

  loadProjectEquipments(): void {
    this.projectsEquipmentsService.index(this.projectId).subscribe({
      next: (res: ProjectsEquipmentInterface[]) => {
        this.equipments = res;

        this.eqQty = {};
        for (let i = 0; i < this.equipments.length; i++) {
          const e: any = this.equipments[i];
          const id = Number(e.id);
          this.eqQty[id] = e.quantity !== undefined && e.quantity !== null ? String(e.quantity) : '';
        }
      },
      error: (err) => {
        console.log(err);
        
      },
      complete: () => {
        this.finishLoad();
      },
    });
  }

  
  canEditProject(): boolean {
    if (!this.project) return false;
    return this.project.status !== 'completed' && this.project.status !== 'cancelled';
  }

  canAddAssignments(): boolean {
    if (!this.project) return false;
    return this.project.status === 'development';
  }

  
  saveProject(): void {
    this.errorMsg = '';
    this.successMsg = '';

    if (!this.canEditProject()) {
      this.errorMsg = 'Este proyecto no se puede editar por su estado.';
      return;
    }

    const name = this.editName.trim();
    const clientStr = this.editClientId.trim();
    const budgetStr = String(this.editBudget).trim();

    if (!name || !clientStr || !budgetStr) {
      this.errorMsg = 'Rellena Nombre, Cliente y Presupuesto.';
      return;
    }

    const clientId = Number(clientStr);
    if (isNaN(clientId)) {
      this.errorMsg = 'Cliente inválido.';
      return;
    }

    const budgetValue = Number(budgetStr);
    if (isNaN(budgetValue)) {
      this.errorMsg = 'El presupuesto debe ser un número.';
      return;
    }

    this.loading = true;
    this.pendingLoads = 1;

    const body: any = {
      name: name,
      id_client: clientId,
      budget: budgetValue,
    };

    this.projectsService.update(this.projectId, body).subscribe({
      next: () => {
        this.successMsg = 'Proyecto actualizado.';
        this.loadProject(); 
      },
      error: (err) => {
        this.errorMsg = err || 'Error actualizando proyecto';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }


  saveMaterialQty(m: ProjectsMaterialsInterface): void {
    this.errorMsg = '';
    this.successMsg = '';

    if (!this.canAddAssignments()) {
      this.errorMsg = 'Solo puedes gestionar asignaciones en estado development.';
      return;
    }

    const id = Number((m as any).id);
    const qtyStr = this.matQty[id];
    const qtyValue = Number(String(qtyStr).trim());

    if (isNaN(qtyValue) || qtyValue <= 0) {
      this.errorMsg = 'La cantidad debe ser mayor que 0.';
      return;
    }

    this.loading = true;
    this.pendingLoads = 1;

    const body: any = {
      project_id: this.projectId,
      material_id: (m as any).material_id,
      quantity: qtyValue,
    };

    this.projectsMaterialsService.update(id, body).subscribe({
      next: () => {
        this.successMsg = 'Cantidad de material actualizada.';
        this.loadProjectMaterials();
      },
      error: (err) => {
        this.errorMsg = err || 'Error actualizando cantidad de material';
        this.loading = false;
      },
      complete: () => {},
    });
  }

  saveEquipmentQty(e: ProjectsEquipmentInterface): void {
    this.errorMsg = '';
    this.successMsg = '';

    if (!this.canAddAssignments()) {
      this.errorMsg = 'Solo puedes gestionar asignaciones en estado development.';
      return;
    }

    const id = Number((e as any).id);
    const qtyStr = this.eqQty[id];
    const qtyValue = Number(String(qtyStr).trim());

    if (isNaN(qtyValue) || qtyValue <= 0) {
      this.errorMsg = 'La cantidad debe ser mayor que 0.';
      return;
    }

    this.loading = true;
    this.pendingLoads = 1;

    const body: any = {
      project_id: this.projectId,
      equipment_id: (e as any).equipment_id,
      quantity: qtyValue,
    };

    this.projectsEquipmentsService.update(id, body).subscribe({
      next: () => {
        this.successMsg = 'Cantidad de equipamiento actualizada.';
        this.loadProjectEquipments();
      },
      error: (err) => {
        this.errorMsg = err || 'Error actualizando cantidad de equipamiento';
        this.loading = false;
      },
      complete: () => {},
    });
  }


  openDeleteUser(u: ProjectsUsersInterface): void {
    this.confirmKey = 'usr-' + (u as any).id;
    this.confirmKind = 'usr';
    this.confirmId = Number((u as any).id);
    this.confirmText = '¿Quitar este usuario del proyecto?';
    this.confirmButtonText = 'Borrar';
  }

  openDeleteMaterial(m: ProjectsMaterialsInterface): void {
    this.confirmKey = 'mat-' + (m as any).id;
    this.confirmKind = 'mat';
    this.confirmId = Number((m as any).id);
    this.confirmText = '¿Quitar este material del proyecto?';
    this.confirmButtonText = 'Borrar';
  }

  openDeleteEquipment(e: ProjectsEquipmentInterface): void {
    this.confirmKey = 'eq-' + (e as any).id;
    this.confirmKind = 'eq';
    this.confirmId = Number((e as any).id);
    this.confirmText = '¿Quitar este equipamiento del proyecto?';
    this.confirmButtonText = 'Borrar';
  }

  confirmDelete(): void {
    if (!this.confirmKey || !this.confirmKind || !this.confirmId) {
      this.confirmClear();
      return;
    }

    if (!this.canAddAssignments()) {
      this.errorMsg = 'Solo puedes gestionar asignaciones en estado development.';
      this.confirmClear();
      return;
    }

    this.loading = true;
    this.pendingLoads = 1;

    if (this.confirmKind === 'usr') {
      this.projectsUsersService.delete(this.confirmId).subscribe({
        next: () => {
          this.successMsg = 'Usuario quitado del proyecto.';
          this.loadProjectUsers();
        },
        error: (err) => {
          this.errorMsg = err || 'Error quitando usuario';
          this.loading = false;
        },
        complete: () => {},
      });
    }

    if (this.confirmKind === 'mat') {
      this.projectsMaterialsService.delete(this.confirmId).subscribe({
        next: () => {
          this.successMsg = 'Material quitado del proyecto.';
          this.loadProjectMaterials();
        },
        error: (err) => {
          this.errorMsg = err || 'Error quitando material';
          this.loading = false;
        },
        complete: () => {},
      });
    }

    if (this.confirmKind === 'eq') {
      this.projectsEquipmentsService.delete(this.confirmId).subscribe({
        next: () => {
          this.successMsg = 'Equipamiento quitado del proyecto.';
          this.loadProjectEquipments();
        },
        error: (err) => {
          this.errorMsg = err || 'Error quitando equipamiento';
          this.loading = false;
        },
        complete: () => {},
      });
    }

    this.confirmClear();
  }

  confirmClear(): void {
    this.confirmKey = null;
    this.confirmKind = '';
    this.confirmId = 0;
    this.confirmText = '';
    this.confirmButtonText = 'Confirmar';
  }

  
  getMaterialQtyString(m: any): string {
    
    if (m.material_quantity !== undefined && m.material_quantity !== null) {
      return String(m.material_quantity);
    }
    if (m.quantity !== undefined && m.quantity !== null) {
      return String(m.quantity);
    }
    return '';
  }
}
