import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UsersInterface } from '../../common/users-interface';
import { ProjectsUsersInterface } from '../../common/projects-users-interface';

import { UsersService } from '../../services/users-service';
import { ProjectsUsersService } from '../../services/projects-users-service';

@Component({
  selector: 'app-projects-add-users',
  standalone: false,
  templateUrl: './projects-add-users.html',
  styleUrl: './projects-add-users.css',
})
export class ProjectsAddUsers implements OnInit {

  projectId: number = 0;

  // catálogo users
  users: UsersInterface[] = [];
  availableUsers: UsersInterface[] = [];
  filtered: UsersInterface[] = [];
  paged: UsersInterface[] = [];

  loadingUsers: boolean = false;

  search: string = '';
  orderMode: string = 'default'; 

  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;

  // paginated projecmaterials
  currentPageAssigned: number = 1;
  pageSizeAssigned: number = 8;
  totalPagesAssigned: number = 1;

  assigned: ProjectsUsersInterface[] = [];
  paginatedAssigned: ProjectsUsersInterface[] = [];
  loadingAssigned: boolean = false;

  confirmRowId: number | null = null;

  errorMsg: string = '';
  successMsg: string = '';

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private projectsUsersService: ProjectsUsersService
  ) {}

  ngOnInit(): void {
    const idStr = this.route.snapshot.paramMap.get('id');
    this.projectId = Number(idStr);

    this.loadUsers();
    this.loadAssigned();
  }

  loadUsers(): void {
    this.loadingUsers = true;

    this.usersService.index().subscribe({
      next: (value: UsersInterface[]) => {
        this.users = value;
        this.rebuildAvailableAndFilter();
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Error cargando usuarios.';
        this.loadingUsers = false;
      },
      complete: () => {
        this.loadingUsers = false;
      },
    });
  }

  loadAssigned(): void {
    this.loadingAssigned = true;

    this.projectsUsersService.index(this.projectId).subscribe({
      next: (value: ProjectsUsersInterface[]) => {
        this.assigned = value;
        this.updatePagedAssigned();
        this.rebuildAvailableAndFilter();
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Error cargando usuarios asignados.';
        this.loadingAssigned = false;
      },
      complete: () => {
        this.loadingAssigned = false;
      },
    });
  }

  rebuildAvailableAndFilter(): void {
    
    const assignedIds: number[] = this.assigned.map((a) => a.user_id);

    
    this.availableUsers = this.users.filter((u) => {
      const isUserRole = u.role === 'user';
      const alreadyAssigned = assignedIds.includes(u.id);
      return isUserRole && !alreadyAssigned;
    });

    this.applyFilters();
  }

  applyFilters(): void {
    const text = this.search.trim().toLowerCase();

    let tmp: UsersInterface[] = [...this.availableUsers];

    if (text.length > 0) {
      tmp = tmp.filter((u) => {
        const fullName = (u.first_name + ' ' + u.last_name).toLowerCase();
        return fullName.includes(text);
      });
    }

    tmp.sort((a, b) => this.sorter(a, b));

    this.filtered = tmp;
    this.currentPage = 1;
    this.updatePaged();
  }

  sorter(a: UsersInterface, b: UsersInterface): number {
    if (this.orderMode === 'default') return 0;

    const an = (a.first_name + ' ' + a.last_name).toLowerCase();
    const bn = (b.first_name + ' ' + b.last_name).toLowerCase();

    if (an > bn) return this.orderMode === 'name_asc' ? 1 : -1;
    if (an < bn) return this.orderMode === 'name_asc' ? -1 : 1;
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


  updatePagedAssigned(): void {
    this.totalPagesAssigned = Math.ceil(this.assigned.length / this.pageSizeAssigned);
    if (this.totalPagesAssigned < 1) this.totalPagesAssigned = 1;

    if (this.currentPageAssigned > this.totalPagesAssigned) this.currentPageAssigned = this.totalPagesAssigned;
    if (this.currentPageAssigned < 1) this.currentPageAssigned = 1;

    const start = (this.currentPageAssigned - 1) * this.pageSizeAssigned;
    const end = start + this.pageSizeAssigned;

    this.paginatedAssigned = this.assigned.slice(start, end);
  }

  prevPageAssigned(): void {
    if (this.currentPageAssigned > 1) {
      this.currentPageAssigned = this.currentPageAssigned - 1;
      this.updatePagedAssigned();
    }
  }

  nextPageAssigned(): void {
    if (this.currentPageAssigned < this.totalPagesAssigned) {
      this.currentPageAssigned = this.currentPageAssigned + 1;
      this.updatePagedAssigned();
    }
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.updatePaged();
  }

  addUser(user: UsersInterface): void {
    this.errorMsg = '';
    this.successMsg = '';

    const body = {
      project_id: this.projectId,
      user_id: user.id,
    };

    this.projectsUsersService.create(body).subscribe({
      next: () => {
        this.successMsg = 'Usuario asignado al proyecto.';
        this.loadAssigned(); // esto refresca asignados y recalcula disponibles
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Error asignando usuario.';
      },
    });
  }

  openConfirm(row: ProjectsUsersInterface): void {
    this.confirmRowId = row.id;
  }

  cancelConfirm(): void {
    this.confirmRowId = null;
  }

  deleteAssigned(row: ProjectsUsersInterface): void {
    this.errorMsg = '';
    this.successMsg = '';

    this.projectsUsersService.delete(row.id).subscribe({
      next: () => {
        this.successMsg = 'Usuario quitado del proyecto.';
        this.confirmRowId = null;
        this.loadAssigned();
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Error quitando usuario.';
      },
    });
  }
}