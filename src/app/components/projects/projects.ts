import { Component, OnInit } from '@angular/core';
import { ProjectInterface } from '../../common/project-interface';
import { ClientInterface } from '../../common/client-interface';
import { ProjectsService } from '../../services/projects-service';
import { ClientsService } from '../../services/clients-service';

@Component({
  selector: 'app-projects',
  standalone: false,
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects implements OnInit {
  projects: ProjectInterface[] = [];
  filtered: ProjectInterface[] = [];
  paged: ProjectInterface[] = [];

  clients: ClientInterface[] = [];

  loading: boolean = false;
  errorMsg: string = '';
  successMsg: string = '';

  search: string = '';
  statusFilter: string = 'all';

  orderMode: string = 'created_at_desc';

  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  showCreate: boolean = false;
  newProjectName: string = '';
  newProjectBudget: string = '';
  newProjectClientId: string = '';
  
  confirmRowId: number | null = null;
  confirmType: string = '';
  confirmMessage: string = '';
  confirmButtonText: string = '';
  confirmProject: ProjectInterface | null = null;
  constructor(
    private projectsService: ProjectsService,
    private clientsService: ClientsService,
  ) {}

  ngOnInit(): void {
    this.loadClients();
    this.loadProjects();
  }

  loadClients(): void {
    this.clientsService.index().subscribe({
      next: (res: ClientInterface[]) => {
        this.clients = res;
      },
      error: (err) => {
        this.errorMsg = err || 'Error cargando clientes';
        //this.loading = false;
      },
      complete: () => {
        //this.loading = false;
      },
    });
  }

  loadProjects(): void {
    this.projectsService.index().subscribe({
      next: (res: ProjectInterface[]) => {
        this.projects = res;
        this.applyFilters();
        this.loading = true;
        this.errorMsg = "";
      },
      error: (err) => {
        this.errorMsg = err || 'Error cargando proyectos';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  applyFilters(): void {
    const text = this.search.trim().toLowerCase();

    let tmp: ProjectInterface[] = [...this.projects];

    if (this.statusFilter !== 'all') {
      tmp = tmp.filter((p) => p.status === this.statusFilter);
    }

    if (text.length > 0) {
      tmp = tmp.filter((p) => {
        const name = p.name ? p.name.toLowerCase() : '';
        const client = p.client_name ? p.client_name.toLowerCase() : '';
        return name.includes(text) || client.includes(text);
      });
    }

    tmp.sort((a, b) => this.sorter(a, b));

    this.filtered = tmp;

    this.currentPage = 1;
    this.updatePaged();
  }

  sorter(a: ProjectInterface, b: ProjectInterface): number {
    
    if (this.orderMode === 'default') {
      const at = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bt = b.created_at ? new Date(b.created_at).getTime() : 0;
      if (at > bt) return -1;
      if (at < bt) return 1;
      return 0;
    }

    
    if (this.orderMode === 'name') {
      const an = a.name ? a.name.toLowerCase() : '';
      const bn = b.name ? b.name.toLowerCase() : '';
      if (an > bn) return 1;
      if (an < bn) return -1;
      return 0;
    }

   
    if (this.orderMode === 'created_at') {
      const at = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bt = b.created_at ? new Date(b.created_at).getTime() : 0;
      if (at > bt) return 1;
      if (at < bt) return -1;
      return 0;
    }

    return 0;
  }

 

  updatePaged(): void {
    this.totalPages = Math.ceil(this.filtered.length / this.pageSize);
    if (this.totalPages < 1) this.totalPages = 1;

    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    if (this.currentPage < 1) this.currentPage = 1;

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.paged = this.filtered.slice(start, end);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage = this.currentPage - 1;
      this.updatePaged();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage = this.currentPage + 1;
      this.updatePaged();
    }
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.updatePaged();
  }
  resetFilters(): void {
    this.orderMode = 'default';
    this.statusFilter = 'all';
    this.currentPage = 1;
    this.applyFilters();
  }

  


  confirmAction(): void {
    if (this.confirmProject === null || this.confirmType === '') {
      this.cancelConfirm();
      return;
    }

    if (this.confirmType === 'toggleStatus') {
      this.shoftDeleteProject(this.confirmProject);
    }
    this.cancelConfirm();
  }

  toggleCreate(): void {
    this.showCreate = !this.showCreate;
    if (!this.showCreate) this.resetCreate();
  }

  resetCreate(): void {
    this.newProjectName = '';
    this.newProjectBudget = '';
    this.newProjectClientId = '';
  }
  validateForm(): any {
    this.errorMsg = '';
    this.successMsg = '';

    if (
      !this.newProjectName.trim() ||
      !this.newProjectBudget.trim() ||
      !this.newProjectClientId.trim()
    ) {
      this.errorMsg = 'Rellena nombre del proyecto, Presupuesto, Cliente.';
      return false;
    }
    const budgetValue = Number(this.newProjectBudget.trim());
    if (isNaN(budgetValue)) {
      this.errorMsg = 'El presupuesto debe ser un número.';
      this.loading = false;
      return false;
    }
    const clientId = Number(this.newProjectClientId.trim());
    if (isNaN(clientId)) {
      this.errorMsg = 'Cliente inválido.';
      return false;
    }

    this.createProject(budgetValue);
  }
  

  createProject(budgetValue:number): void {
    this.loading = true;

    const payload: any = {
      name: this.newProjectName.trim(),
      id_client: this.newProjectClientId.trim(),
      budget: budgetValue,
      status: 'development',
    };


    this.projectsService.create(payload).subscribe({
      next: () => {
        this.successMsg = 'Proyecto creado.';
        this.showCreate = false;
        this.resetCreate();
        this.loadProjects();
      },
      error: (err) => {
        this.errorMsg = err || 'Error creando proyecto';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  openSoftConfirm(project: ProjectInterface): void {
    this.confirmRowId = project.id;
    this.confirmType = 'toggleStatus';
    this.confirmProject = project;
    this.confirmMessage = '¿Seguro que quieres cancelar este projecto?';
    this.confirmButtonText = 'Confirmar';
  }

  cancelConfirm(): void {
    this.confirmRowId = null;
    this.confirmType = '';
    this.confirmMessage = '';
    this.confirmButtonText = '';
  }

  shoftDeleteProject(project: ProjectInterface): void {
    const newStatus = project.status === 'cancelled' ? 'pending' : 'cancelled';

    this.projectsService.update(project.id, { status: newStatus }).subscribe({
      next: () => {
        this.loading = true;
        this.successMsg = 'Proyecto ha cambiado de estado a cancelado';
        this.cancelConfirm();
        this.loadProjects();        
      },
      error: (err) => {
        this.errorMsg = err || 'Error al cambiar de estado a cancelado';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
  restoreClient(project: ProjectInterface): void {
    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    const body: any = {
      name: project.name,
      id_client: project.id_client,
      budget: project.budget,
      status: 'pending',
    };

    this.projectsService.update(project.id, body).subscribe({
      next: () => {
        this.successMsg = 'Proyecto descancelado y cambiado de estado a pediente.';
        
        this.loadClients();
      },
      error: (err) => {
        this.errorMsg = err || 'Error al descancelar y cambiar de estado a pediente el proyecto';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  canEdit(project: ProjectInterface): boolean {
    return project.status !== 'completed' && project.status !== 'cancelled';
  }

  canAdd(project: ProjectInterface): boolean {
    return project.status === 'development';
  }
}
