import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  search: string = '';
  statusFilter: string = 'all';

  orderMode: string = 'created_at_desc';

  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;

  showCreate: boolean = false;
  newProjectName: string = '';
  newProjectBudget: string = '';
  newProjectClientId: string = '';

  confirmRowId: number | null = null;
  confirmType: string = '';

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
      error: () => {},
    });
  }

  loadProjects(): void {
    this.projectsService.index().subscribe({
      next: (res: ProjectInterface[]) => {
        this.projects = res;
        this.applyFilters();
      },
      error: () => {},
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
    if (this.orderMode === 'name_asc' || this.orderMode === 'name_desc') {
      const an = a.name ? a.name.toLowerCase() : '';
      const bn = b.name ? b.name.toLowerCase() : '';

      if (an > bn) return this.orderMode === 'name_asc' ? 1 : -1;
      if (an < bn) return this.orderMode === 'name_asc' ? -1 : 1;
      return 0;
    }

    const at = a.created_at ? new Date(a.created_at).getTime() : 0;
    const bt = b.created_at ? new Date(b.created_at).getTime() : 0;

    if (at > bt) return this.orderMode === 'created_at_asc' ? 1 : -1;
    if (at < bt) return this.orderMode === 'created_at_asc' ? -1 : 1;
    return 0;
  }

  toggleOrderByName(): void {
    if (this.orderMode === 'name_asc') this.orderMode = 'name_desc';
    else this.orderMode = 'name_asc';
    this.applyFilters();
  }

  toggleOrderByCreatedAt(): void {
    if (this.orderMode === 'created_at_asc') this.orderMode = 'created_at_desc';
    else this.orderMode = 'created_at_asc';
    this.applyFilters();
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
  resetFilters(): void {
    this.orderMode = 'default';
    this.statusFilter = 'all';
    this.currentPage = 1;
    this.applyFilters();
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

  createProject(): void {
    const name = this.newProjectName.trim();
    const clientIdStr = this.newProjectClientId.trim();

    if (name.length === 0) return;
    if (clientIdStr.length === 0) return;

    const clientId = Number(clientIdStr);
    if (isNaN(clientId)) return;

    let budgetValue: number | null = null;
    if (this.newProjectBudget.trim().length > 0) {
      const b = Number(this.newProjectBudget);
      if (!isNaN(b)) budgetValue = b;
    }

    const payload: any = {
      name: name,
      id_client: clientId,
      status: 'development',
    };

    if (budgetValue !== null) payload.budget = budgetValue;

    this.projectsService.create(payload).subscribe({
      next: () => {
        this.showCreate = false;
        this.resetCreate();
        this.loadProjects();
      },
      error: () => {},
    });
  }

  askToggleStatus(p: ProjectInterface): void {
    this.confirmRowId = p.id;
    this.confirmType = 'toggleStatus';
  }

  cancelConfirm(): void {
    this.confirmRowId = null;
    this.confirmType = '';
  }

  doToggleStatus(p: ProjectInterface): void {
    const newStatus = p.status === 'cancelled' ? 'pending' : 'cancelled';

    this.projectsService.update(p.id, { status: newStatus }).subscribe({
      next: () => {
        this.cancelConfirm();
        this.loadProjects();
      },
      error: () => {},
    });
  }

  canEdit(p: ProjectInterface): boolean {
    return p.status !== 'completed' && p.status !== 'cancelled';
  }

  canAdd(p: ProjectInterface): boolean {
    return p.status === 'development';
  }
}
