import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from '../../services/projects-service';
import { ClientsService } from '../../services/clients-service';
import { ProjectInterface } from '../../common/project-interface';
import { ClientInterface } from '../../common/client-interface';

@Component({
  selector: 'app-projects-edit',
  standalone: false,
  templateUrl: './projects-edit.html',
  styleUrl: './projects-edit.css',
})
export class ProjectsEdit implements OnInit {
  projectId: number = 0;
  errorMsg: string = '';
  successMsg: string = '';
  loading: boolean = false;
  project!: ProjectInterface;
  clients: ClientInterface[] = [];

  name: string = '';
  budget: number = 0;
  id_client: number | null = null;
  status!: 'pending' | 'development' | 'completed' | 'cancelled';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService,
    private clientsService: ClientsService,
  ) {}

  ngOnInit(): void {
    const projectIdStr = this.route.snapshot.paramMap.get('id');
    this.projectId = Number(projectIdStr);
    if (isNaN(this.projectId)) {
      this.errorMsg = 'Id de projecto invalido.';
      return;
    }

    this.loadClients();
    this.loadProject();
  }

  loadClients(): void {
    this.clientsService.index().subscribe({
      next: (value) => {
        this.clients = value;
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {},
    });
  }
  loadProject(): void {
    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    this.projectsService.show(this.projectId).subscribe({
      next: (value) => {
        if (value.status === 'completed' || value.status === 'cancelled') {
          this.router.navigate(['/dashboard/projects']);
          return;
        }

        this.project = value;
        this.name = value.name;
        this.budget = Number(value.budget);
        this.id_client = value.id_client;
        this.status = value.status;
      },
      error: (err) => {
        this.errorMsg = 'Error cargando el proyecto';
        console.error(err);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  validateAndSave(): void {
    this.errorMsg = '';
    this.successMsg = '';

    if (!this.name.trim() || !this.id_client || !this.budget || !this.status) {
      this.errorMsg = 'Rellena Nombre, Cliente y Presupuesto.';
      return;
    }
    this.saveProject(
      this.name.trim(),
      this.id_client,
      this.budget,
      this.status,
    );
  }

  saveProject(
    namevalue: string,
    id_clientValue: number,
    budgetValue: number,
    statusValue: 'pending' | 'development' | 'completed' | 'cancelled',
  ): void {
    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    const body: any = {
      name: namevalue,
      id_client: id_clientValue,
      budget: budgetValue,
      status: statusValue,
    };

    this.projectsService.update(this.projectId, body).subscribe({
      next: () => {
        this.successMsg = 'Proyecto actualizado.';
        this.loadProject();
      },
      error: (err) => {
        this.errorMsg = 'Error actualizando el proyecto';
        this.loading = false;
        console.error(err);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
