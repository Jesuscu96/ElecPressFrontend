import { Component, OnInit } from '@angular/core';
import { ClientsService } from '../../services/clients-service';
import { ClientInterface } from '../../common/client-interface';
@Component({
  selector: 'app-clients',
  standalone: false,
  templateUrl: './clients.html',
  styleUrl: './clients.css',
})
export class Clients implements OnInit {
  clients: ClientInterface[] = [];
  filtered: ClientInterface[] = [];
  search: string = '';
  loading = false;
  errorMsg = '';

  constructor(private clientsService: ClientsService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.loading = true;
    this.errorMsg = '';

    this.clientsService.index().subscribe({
      next: (data) => {
        this.clients = data;
        this.applyFilter();
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Error cargando clientes';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  applyFilter(): void {
    const q = this.search.trim().toLowerCase();

    if (!q) {
      this.filtered = [...this.clients];
      return;
    }

    this.filtered = this.clients.filter((c) => {
      const fullName =
        `${c.first_name ?? ''} ${c.last_name ?? ''}`.toLowerCase();
      const company = (c.company ?? '').toLowerCase();
      const email = (c.email ?? '').toLowerCase();
      return fullName.includes(q) || company.includes(q) || email.includes(q);
    });
  }

  
  createClient(): void {
    console.log('crear');
  }
  editClient(c: ClientInterface): void {
    console.log('editar', c);
  }
  deleteClient(c: ClientInterface): void {
    console.log('borrar', c);
  }
  showClient(c: ClientInterface): void {
    console.log('ver', c);
  }
}
