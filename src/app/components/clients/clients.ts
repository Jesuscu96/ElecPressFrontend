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
  paged: ClientInterface[] = [];
  ClientList: ClientInterface[] = [];

  page: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  search: string = '';
  statusFilter: 'active' | 'inactive' | 'all' = 'active';
  orderMode: 'default' | 'name' | 'company' = 'default';

  loading: boolean = false;
  errorMsg: string = '';
  successMsg: string = '';

  first_name: string = '';
  last_name: string = '';
  company: string = '';
  phone: string = '';
  email: string = '';
  created_at: string = ''; 
  status: 'active' | 'inactive' = 'active';

  confirmRowId: number | null = null;
  confirmType: 'soft' | 'hard' | null = null;
  confirmMessage: string = '';
  confirmButtonText: string = '';
  confirmClient: ClientInterface | null = null;

  editing: boolean = false;
  editId: number | null = null;

  selectedClient: ClientInterface | null = null;

  isSuperAdmin: boolean = false;

  showForm: boolean = false;

  constructor(private clientsService: ClientsService) {}
  ngOnInit(): void {
    const raw = localStorage.getItem('user');
    if (raw) {
      try {
        const u = JSON.parse(raw);
        this.isSuperAdmin = u.role === 'superAdmin';
      } catch {
        this.isSuperAdmin = false;
      }
    }

    this.loadClients();
  }
  loadClients(): void {
    this.loading = true;
    this.search = '';
    this.errorMsg = '';
    //this.successMsg = '';

    this.clientsService.index().subscribe({
      next: (data) => {
        this.clients = data || [];
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

  toggleCreate(): void {
    if (this.showForm && this.editing) this.cancelEdit();
    this.showForm = !this.showForm;
  }

  openSoftConfirm(c: ClientInterface): void {
    this.confirmRowId = c.id;
    this.confirmType = 'soft';
    this.confirmClient = c;

    this.confirmMessage = '¿Seguro que quieres dar de baja este cliente?';
    this.confirmButtonText = 'Confirmar Baja';
  }

  openHardConfirm(c: ClientInterface): void {
    this.confirmRowId = c.id;
    this.confirmType = 'hard';
    this.confirmClient = c;

    this.confirmMessage =
      'Vas a borrar PERMANENTEMENTE. Esta acción no se puede deshacer. ¿Continuar?';
    this.confirmButtonText = 'Borrar permanentemente';
  }

  cancelConfirm(): void {
    this.confirmRowId = null;
    this.confirmType = null;
    this.confirmClient = null;
    this.confirmMessage = '';
    this.confirmButtonText = '';
  }

  confirmAction(): void {
    if (this.confirmClient === null || this.confirmType === null) {
      this.cancelConfirm();
      return;
    }

    if (this.confirmType === 'soft') {
      this.softDeleteClient(this.confirmClient);
    } else {
      this.hardDeleteClient(this.confirmClient);
    }

    this.cancelConfirm();
  }

  //mi quebradero de cabeza

  toText(value: any): string {
    if (value === null || value === undefined) return '';
    return String(value);
  }
  filterByStatus(list: ClientInterface[]): ClientInterface[] {
    if (this.statusFilter === 'all') return list;

    return list.filter((c) => {
      let st = 'active';
      if (c.status !== null && c.status !== undefined) {
        st = c.status as any;
      }
      return st === this.statusFilter;
    });
  }

  filterBySearch(list: ClientInterface[]): ClientInterface[] {
    const q = this.search.trim().toLowerCase();
    if (!q) return list;

    return list.filter((c) => {
      const fullName = (
        this.toText(c.first_name) +
        ' ' +
        this.toText(c.last_name)
      ).toLowerCase();

      const company = this.toText(c.company).toLowerCase();
      const email = this.toText(c.email).toLowerCase();

      // if (fullName.includes(searchFormated))return true;
      // if (email.includes(searchFormated)) return true;
      // if (company.includes(searchFormated)) return true;
      // return false;

      return (
        fullName.indexOf(q) !== -1 ||
        company.indexOf(q) !== -1 ||
        email.indexOf(q) !== -1
      );
    });
  }

  sortList(list: ClientInterface[]): ClientInterface[] {
    if (this.orderMode === 'default') return list;

    const copy = list.slice();

    if (this.orderMode === 'name') {
      copy.sort((a, b) => {
        const an = (
          this.toText(a.first_name) +
          ' ' +
          this.toText(a.last_name)
        ).toLowerCase();
        const bn = (
          this.toText(b.first_name) +
          ' ' +
          this.toText(b.last_name)
        ).toLowerCase();

        if (an > bn) return 1;
        if (an < bn) return -1;
        return 0;
      });
    }

    if (this.orderMode === 'company') {
      copy.sort((a, b) => {
        const ac = this.toText(a.company).toLowerCase();
        const bc = this.toText(b.company).toLowerCase();

        if (ac > bc) return 1;
        if (ac < bc) return -1;
        return 0;
      });
    }

    return copy;
  }

  applyFilter(): void {
    let list = [...this.clients];

    list = this.filterByStatus(list);
    list = this.filterBySearch(list);

    list = this.sortList(list);

    this.filtered = list;
    this.page = 1;
    this.updatePagination();
  }

  resetFilters(): void {
    this.search = '';
    this.statusFilter = 'active';
    this.orderMode = 'default';
    this.page = 1;
    this.applyFilter();
  }

  updatePagination(): void {
    this.totalPages = Math.max(
      1,
      Math.ceil(this.filtered.length / this.pageSize),
    );

    if (this.page > this.totalPages) this.page = this.totalPages;
    if (this.page < 1) this.page = 1;

    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.paged = this.filtered.slice(start, end);
    

  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.updatePagination();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.updatePagination();
    }
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.page = 1;
    this.updatePagination();
  }

  resetForm(): void {
    this.first_name = '';
    this.last_name = '';
    this.company = '';
    this.phone = '';
    this.email = '';
    this.status = 'active';
  }

  validateForm(): boolean {
    this.errorMsg = '';
    this.successMsg = '';

    if (
      !this.first_name.trim() ||
      !this.last_name.trim() ||
      !this.email.trim() ||
      !this.phone.trim()
    ) {
      this.errorMsg = 'Rellena nombre, apellidos, email y teléfono.';
      return false;
    }

    if (!this.email.includes('@')) {
      this.errorMsg = 'Email no válido.';
      return false;
    }

    return true;
  }

  submitForm(): void {
    if (!this.validateForm()) return;

    if (this.editing) {
      this.updateClient();
    } else {
      this.createClient();
    }
  }

  createClient(): void {
    this.loading = true;

    const body: any = {
      first_name: this.first_name.trim(),
      last_name: this.last_name.trim(),
      email: this.email.trim(),
      phone: Number(this.phone),
      company: this.company.trim() ? this.company.trim() : null,
      status: this.status,
    };

    this.clientsService.create(body).subscribe({
      next: () => {
        this.successMsg = 'Cliente creado.';
        this.showForm = false;
        this.resetForm();
        this.loadClients();
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Error creando cliente';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  startEdit(client: ClientInterface): void {
    this.editing = true;
    this.showForm = true;
    this.editId = client.id;

    this.first_name = client.first_name != null ? client.first_name : '';
    this.last_name = client.last_name != null ? client.last_name : '';
    this.company = client.company != null ? client.company : '';
    this.phone = client.phone != null ? String(client.phone) : '';
    this.email = client.email != null ? client.email : '';
    this.status = client.status != null ? (client.status as any) : 'active';

    this.selectedClient = null;
    this.errorMsg = '';
    this.successMsg = '';

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.editing = false;
    this.editId = null;
    this.resetForm();
  }

  updateClient(): void {
    if (this.editId === null) return;

    this.loading = true;

    const body: any = {
      first_name: this.first_name.trim(),
      last_name: this.last_name.trim(),
      email: this.email.trim(),
      phone: Number(this.phone),
      company: this.company.trim() ? this.company.trim() : null,
      status: this.status,
    };

    this.clientsService.update(this.editId, body).subscribe({
      next: () => {
        this.successMsg = 'Cliente actualizado.';
        this.editing = false;
        this.editId = null;
        this.resetForm();
        this.showForm = false;
        this.loadClients();
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Error actualizando cliente';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  showClient(client: ClientInterface): void {
    if (this.selectedClient && this.selectedClient.id === client.id) {
      this.selectedClient = null;
    } else {
      this.selectedClient = client;
      new Date(this.selectedClient.created_at.replace(' ', 'T'));
    }
  }

  closeInfo(): void {
    this.selectedClient = null;
  }

  softDeleteClient(c: ClientInterface): void {
    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    const body: any = {
      first_name: c.first_name,
      last_name: c.last_name,
      company: c.company ?? null,
      phone: c.phone,
      email: c.email,
      status: 'inactive',
    };

    this.clientsService.update(c.id, body).subscribe({
      next: () => {
        this.successMsg = 'Cliente dado de baja.';
        this.selectedClient = null;
        this.loadClients();
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Error al dar de baja al cliente';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  restoreClient(c: ClientInterface): void {
    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    const body: any = {
      first_name: c.first_name,
      last_name: c.last_name,
      company: c.company ?? null,
      phone: c.phone,
      email: c.email,
      status: 'active',
    };

    this.clientsService.update(c.id, body).subscribe({
      next: () => {
        this.successMsg = 'Cliente dado de alta.';
        this.selectedClient = null;
        this.loadClients();
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Error al dar de alta al cliente';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  hardDeleteClient(c: ClientInterface): void {
    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    this.clientsService.delete(c.id).subscribe({
      next: () => {
        this.successMsg = 'Cliente eliminado permanentemente.';
        this.selectedClient = null;
        this.loadClients();
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Error borrando permanentemente';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
