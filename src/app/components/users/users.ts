import { Component, OnInit } from '@angular/core';
import { UsersInterface } from '../../common/users-interface';
import { UsersService } from '../../services/users-service';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {
  users: UsersInterface[] = [];
  filtered: UsersInterface[] = [];
  paged: UsersInterface[] = [];
  ClientList: UsersInterface[] = [];

  page: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  search: string = '';

  roleFilter: 'superAdmin' | 'admin' | 'user' | 'inactive' | 'all' = 'all';
  orderMode: 'default' | 'name' | 'created_at_asc' | 'created_at_des' =
    'default';

  loading: boolean = false;
  errorMsg: string = '';
  successMsg: string = '';

  currentUserId: number | null = null;
  currentUserRole: string = '';

  first_name: string = '';
  last_name: string = '';
  created_at: string = '';
  company: string = '';
  phone: string = '';
  email: string = '';
  birth_date: string = '';
  image: string = '';
  role: 'superAdmin' | 'admin' | 'user' | 'inactive' = 'user';
  showPasswordBox: boolean = false;
  newPassword: string = '';

  confirmRowId: number | null = null;
  confirmType: 'soft' | 'hard' | null = null;
  confirmMessage: string = '';
  confirmButtonText: string = '';
  confirmUser: UsersInterface | null = null;

  editing: boolean = false;
  editId: number | null = null;

  selectedUser: UsersInterface | null = null;

  isSuperAdmin: boolean = false;

  showForm: boolean = false;

  constructor(private UsersService: UsersService) {}

  ngOnInit(): void {
    const raw = localStorage.getItem('user');
    if (raw) {
      try {
        const user = JSON.parse(raw);
        this.isSuperAdmin = user.role === 'superAdmin';
        this.currentUserRole = user.role;
        this.currentUserId = user.id;
      } catch {
        this.isSuperAdmin = false;
        this.currentUserRole = '';
        this.currentUserId = null;
      }
    }

    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.search = '';
    this.errorMsg = '';
    //this.successMsg = '';

    this.UsersService.index().subscribe({
      next: (value) => {
        this.users = value || [];
        this.applyFilter();
      },
      error: (err) => {
        this.errorMsg = err || 'Error cargando usuarios';
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

    if (this.showForm && !this.editing) {
      this.newPassword = '';
      this.showPasswordBox = false;
    }
  }
  openSoftConfirm(user: UsersInterface): void {
    this.confirmRowId = user.id;
    this.confirmType = 'soft';
    this.confirmUser = user;

    this.confirmMessage = '¿Seguro que quieres dar de baja a este Usuario?';
    this.confirmButtonText = 'Dar de baja';
  }

  openHardConfirm(user: UsersInterface): void {
    this.confirmRowId = user.id;
    this.confirmType = 'hard';
    this.confirmUser = user;

    this.confirmMessage =
      'Vas a borrar PERMANENTEMENTE. Esta acción no se puede deshacer. ¿Continuar?';
    this.confirmButtonText = 'Borrar permanentemente';
  }

  cancelConfirm(): void {
    this.confirmRowId = null;
    this.confirmType = null;
    this.confirmUser = null;
    this.confirmMessage = '';
    this.confirmButtonText = '';
  }

  confirmAction(): void {
    if (this.confirmUser === null || this.confirmType === null) {
      this.cancelConfirm();
      return;
    }

    if (this.confirmType === 'soft') {
      this.softDeleteUser(this.confirmUser);
    } else {
      this.hardDeleteUser(this.confirmUser);
    }

    this.cancelConfirm();
  }

  toText(value: any): string {
    if (value === null || value === undefined) return '';
    return String(value);
  }
  filterByRole(list: UsersInterface[]): UsersInterface[] {
    if (this.roleFilter === 'all') return list;

    return list.filter((user) => {
      if (!user.role) return false;
      return user.role.toLowerCase() === this.roleFilter.toLowerCase();
    });
  }

  filterBySearch(list: UsersInterface[]): UsersInterface[] {
    const searchFormated = this.search.trim().toLowerCase();
    if (!searchFormated) return list;

    return list.filter((user) => {
      const fullName = (
        this.toText(user.first_name) +
        ' ' +
        this.toText(user.last_name)
      ).toLowerCase();
      const email = this.toText(user.email).toLowerCase();

      if (fullName.includes(searchFormated)) return true;
      if (email.includes(searchFormated)) return true;
      return false;
    });
  }

  sortList(list: UsersInterface[]): UsersInterface[] {
    if (this.orderMode === 'default') return list;

    const copy = [...list];

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

    if (this.orderMode === 'created_at_asc') {
      copy.sort((a, b) => {
        if (a.created_at > b.created_at) return 1;
        else if (a.created_at < b.created_at) return -1;
        else return 0;
      });
    }

    if (this.orderMode === 'created_at_des') {
      copy.sort((a, b) => {
        if (a.created_at > b.created_at) return -1;
        else if (a.created_at < b.created_at) return 1;
        else return 0;
      });
    }

    return copy;
  }

  applyFilter(): void {
    let list = [...this.users];

    list = this.filterByRole(list);
    list = this.filterBySearch(list);

    list = this.sortList(list);

    this.filtered = list;
    this.page = 1;
    this.updatePagination();
  }

  resetFilters(): void {
    this.search = '';
    this.roleFilter = 'all';
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
    this.phone = '';
    this.email = '';
    this.role = 'user';
    this.birth_date = '';
    this.image = '';
    this.newPassword = '';
    this.showPasswordBox = false;
  }

  validateForm(): boolean {
    this.errorMsg = '';
    this.successMsg = '';

    if (
      !this.first_name.trim() ||
      !this.last_name.trim() ||
      !this.email.trim() ||
      !this.phone.trim() ||
      !this.birth_date.trim()
    ) {
      this.errorMsg =
        'Rellena nombre, apellidos, email, fecha de nacimiento y teléfono.';
      return false;
    }

    if (!this.email.includes('@')) {
      this.errorMsg = 'Email no válido.';
      return false;
    }
    //console.log(this.birth_date);
    
    if (!/^\d{4}-\d{2}-\d{2}$/.test(this.birth_date)) {
      this.errorMsg = 'Fecha no válida. Formato esperado: YYYY-MM-DD';
      return false;
    }
    if (!this.editing) {
      if (!this.newPassword.trim()) {
        this.errorMsg = 'La contraseña es obligatoria al crear un usuario.';
        return false;
      }
    }

    if (this.editing && this.showPasswordBox) {
      if (!this.newPassword.trim()) {
        this.errorMsg = 'Si añades "Nueva contraseña", debes escribirla.';
        return false;
      }
    }

    if (this.newPassword.trim()) {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
      if (!regex.test(this.newPassword)) {
        this.errorMsg =
          'La contraseña debe tener mínimo 8 caracteres, mayúscula, minúscula, número y símbolo.';
        return false;
      }
    }

    if (this.role === 'superAdmin' && !this.isSuperAdmin) {
      this.errorMsg = 'No tienes permisos para asignar rol SuperAdmin.';
      return false;
    }

    return true;
  }

  submitForm(): void {
    if (!this.validateForm()) return;

    if (this.editing) {
      this.updateUser();
    } else {
      this.createUser();
    }
  }
  togglePasswordBox(): void {
    this.showPasswordBox = !this.showPasswordBox;
    if (!this.showPasswordBox) {
      this.newPassword = '';
    }
  }

  createUser(): void {
    this.loading = true;

    const body: any = {
      role: this.role,
      first_name: this.first_name.trim(),
      last_name: this.last_name.trim(),
      email: this.email.trim(),
      birth_date: this.birth_date.trim(),
      image: this.image.trim() ? this.image.trim() : null,
      phone: this.phone.trim(),
      password: this.newPassword.trim(),
    };
    if (this.showPasswordBox) {
      body.password = this.newPassword.trim();
    }

    this.UsersService.create(body).subscribe({
      next: () => {
        this.successMsg = 'Ususario creado.';
        this.showForm = false;
        this.resetForm();
        this.loadUsers();
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Error creando usuario';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  startEdit(user: UsersInterface): void {
    if (!this.canEditUser(user)) {
      this.errorMsg = 'No tienes permisos para editar este usuario.';
      return;
    }
    this.editing = true;
    this.showForm = true;
    this.editId = user.id;
    this.newPassword = '';
    this.showPasswordBox = false;

    this.first_name = user.first_name != null ? user.first_name : '';
    this.last_name = user.last_name != null ? user.last_name : '';
    this.role = user.role != null ? user.role : 'user';
    this.birth_date = user.birth_date != null ? user.birth_date : '';
    this.phone = user.phone != null ? String(user.phone) : '';
    this.email = user.email != null ? user.email : '';
    this.image = user.image != null ? user.image : '';

    this.selectedUser = null;
    this.errorMsg = '';
    this.successMsg = '';

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.editing = false;
    this.editId = null;
    this.newPassword = '';
    this.showPasswordBox = false;

    this.resetForm();
  }

  updateUser(): void {
    if (this.editId === null) return;

    this.loading = true;

    const body: any = {
      role: this.role,
      first_name: this.first_name.trim(),
      last_name: this.last_name.trim(),
      email: this.email.trim(),
      birth_date: this.birth_date.trim(),
      image: this.image.trim() ? this.image.trim() : null,
      phone: this.phone.trim(),
    };
    if (this.showPasswordBox && this.newPassword.trim()) {
      body.password = this.newPassword.trim();
    }

    this.UsersService.update(this.editId, body).subscribe({
      next: () => {
        this.successMsg = 'Usuario actualizado.';
        this.editing = false;
        this.editId = null;
        this.resetForm();
        this.showForm = false;
        this.loadUsers();
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Error actualizando usuario';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
  calculateAge(birth_date: string): string {
    if (!birth_date) return '-';

    let normalized = birth_date.trim();
    if (normalized.length === 10) {
      normalized = normalized + 'T00:00:00';
    } else {
      normalized = normalized.replace(' ', 'T');
    }
    const dob = new Date(normalized);
    if (isNaN(dob.getTime())) return '-';

    const diff = Date.now() - dob.getTime();
    const ageDate = new Date(diff);

    return String(Math.abs(ageDate.getUTCFullYear() - 1970));
  }

  showUser(user: UsersInterface): void {
    if (this.selectedUser && this.selectedUser.id === user.id) {
      this.selectedUser = null;
    } else {
      this.selectedUser = user;
      new Date(this.selectedUser.created_at.replace(' ', 'T'));
      this.selectedUser.birth_date = this.calculateAge(
        this.selectedUser.birth_date,
      );
    }
  }

  closeInfo(): void {
    this.selectedUser = null;
  }

  softDeleteUser(user: UsersInterface): void {
    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    const body: any = {
      role: 'inactive',
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      birth_date: user.birth_date,
      image: user.image ? user.image : null,
      phone: user.phone,
    };

    this.UsersService.update(user.id, body).subscribe({
      next: () => {
        this.successMsg = `Usuario ${user.first_name} ${user.last_name} dado de baja.`;
        this.selectedUser = null;
        this.loadUsers();
        console.log('next');
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Error al dar de baja al usuario';
        this.loading = false;
        console.log('Error al dar de baja al usuario');
        
      },
      complete: () => {
        this.loading = false;
        console.log('complete');
      },
    });
  }

  restoreUser(user: UsersInterface): void {
    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    const body: any = {
      role: 'user',
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      birth_date: user.birth_date,
      image: user.image ? user.image : null,
      phone: user.phone,
    };

    this.UsersService.update(user.id, body).subscribe({
      next: () => {
        this.successMsg = `Usuario ${user.first_name} ${user.last_name} dado de alta.`;
        this.selectedUser = null;
        this.loadUsers();
      },
      error: (err) => {
        this.errorMsg =
          err?.error?.message || 'Error al dar de alta al usuario';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  hardDeleteUser(user: UsersInterface): void {
    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    this.UsersService.delete(user.id).subscribe({
      next: () => {
        this.successMsg = `Usuario ${user.first_name} ${user.last_name} eliminado permanentemente.`;
        this.selectedUser = null;
        this.loadUsers();
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

  isSelf(user: UsersInterface): boolean {
    if (this.currentUserId === null) return false;
    return user.id === this.currentUserId;
  }

  isTargetSuperAdmin(user: UsersInterface): boolean {
    return user.role === 'superAdmin';
  }

  canEditUser(user: UsersInterface): boolean {
    if (this.isSelf(user)) return false;

    if (this.isTargetSuperAdmin(user) && !this.isSuperAdmin) return false;

    return true;
  }

  canSoftDeactivate(user: UsersInterface): boolean {
    if (this.isSelf(user)) return false;
    if (user.role === 'inactive') return false;

    if (this.isTargetSuperAdmin(user) && !this.isSuperAdmin) return false;

    return true;
  }

  canRestore(user: UsersInterface): boolean {
    if (this.isSelf(user)) return false;
    return user.role === 'inactive';
  }

  canHardDelete(user: UsersInterface): boolean {
    if (!this.isSuperAdmin) return false;
    if (this.isSelf(user)) return false;

    return true;
  }
}
