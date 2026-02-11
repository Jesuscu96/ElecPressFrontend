import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
export class ProjectsEdit implements OnInit{
  projectId: number = 0;
  errorMsg: string = "";
  successMsg: string = "";
  loading: boolean = false;
  project!: ProjectInterface ;
  clients: ClientInterface[] = [];

  name: string = '';
  budget: number = 0;
  id_client: number = 0;



  constructor(private route: ActivatedRoute, private projectsService: ProjectsService, private clientsService: ClientsService) {}

  ngOnInit(): void {
    const projectIdStr = this.route.snapshot.paramMap.get('id');
    this.projectId = Number(projectIdStr);
    if(isNaN(this.projectId)) {
      this.errorMsg = "Id de projecto invalido.";
      return;
    }

    this.loadClients();
    this.loadProjects();
  }

  loadClients(): void {
    this.clientsService.index().subscribe({
      next: value => {
        this.clients = value;
      },
      error: err => {
        console.error(err);
      },
      complete: () => {}
    })
  }
  loadProjects(): void {
    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    this.projectsService.show(this.projectId).subscribe({
      next: value => {
        this.project = value;
        this.name = value.name;
        this.budget = value.budget;

        
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

}
