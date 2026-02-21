import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EquipmentInterface } from '../../common/equipment-interface';
import { ProjectsEquipmentInterface } from '../../common/projects-equipment-interface';


import { EquipmentService } from '../../services/equipment-service';
import { ProjectsEquipmentsService } from '../../services/projects-equipments-service';

@Component({
  selector: 'app-projects-add-equipment',
  standalone: false,
  templateUrl: './projects-add-equipment.html',
  styleUrl: './projects-add-equipment.css',
})
export class ProjectsAddEquipment implements OnInit {

  projectId: number = 0;

  
  equipment: EquipmentInterface[] = [];
  filtered: EquipmentInterface[] = [];
  paged: EquipmentInterface[] = [];

  loadingCatalog: boolean = false;

  search: string = '';
  categories: string[] = [];
  selectedCategory: string = 'all';

  currentPage: number = 1;
  pageSize: number = 12;
  totalPages: number = 1;

  qtyAdd: { [id: number]: number } = {};


  assigned: ProjectsEquipmentInterface[] = [];
  paginatedAssigned: ProjectsEquipmentInterface[] = [];

  loadingAssigned: boolean = false;

  currentPageAssigned: number = 1;
  pageSizeAssigned: number = 8;
  totalPagesAssigned: number = 1;

  qtyEdit: { [id: number]: number } = {};
  qtyOriginal: { [id: number]: number } = {};
  editingRowId: number | null = null;

  confirmRowId: number | null = null;

  errorMsg: string = '';
  successMsg: string = '';

  constructor(
    private route: ActivatedRoute,
    private equipmentService: EquipmentService,
    private projectEquipmentService: ProjectsEquipmentsService
  ) {}

  ngOnInit(): void {
    const idStr = this.route.snapshot.paramMap.get('id');
    this.projectId = Number(idStr);

    this.loadAssigned();
    this.loadCatalog();
  }

  loadCatalog(): void {
    this.loadingCatalog = true;
    this.errorMsg = '';
    this.successMsg = '';

    this.equipmentService.index().subscribe({
      next: (value) => {
        this.equipment = value;
        this.extractCategories();
        this.initAddQuantities();
        this.applyFilters();
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Error cargando equipos.';
        this.loadingCatalog = false;
      },
      complete: () => {
        this.loadingCatalog = false;
      },
    });
  }

  extractCategories(): void {
    this.categories = this.equipment.reduce((acc: string[], elem: any) => {
      return (acc = [...acc, elem.category_name]);
    }, []);
    this.categories = [...new Set(this.categories)].sort();
  }

  initAddQuantities(): void {
    this.qtyAdd = {};
    this.equipment.forEach((e) => {
      this.qtyAdd[e.id] = 1;
    });
  }

  applyFilters(): void {
    const text = this.search.trim().toLowerCase();
    let tmp: EquipmentInterface[] = [...this.equipment];

    if (this.selectedCategory !== 'all') {
      tmp = tmp.filter((e) => e.category_name === this.selectedCategory);
    }

    if (text.length > 0) {
      tmp = tmp.filter((e) => (e.name || '').toLowerCase().includes(text));
    }

    this.filtered = tmp;
    this.currentPage = 1;
    this.updatePaged();
  }

  updatePaged(): void {
    this.totalPages = Math.ceil(this.filtered.length / this.pageSize);
    if (this.totalPages < 1) this.totalPages = 1;

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

  addEquipment(e: EquipmentInterface): void {
    this.errorMsg = '';
    this.successMsg = '';

    let quantity: number = 1;
    const valueFromInput = this.qtyAdd[e.id];

    if (valueFromInput !== undefined && valueFromInput !== null) {
      quantity = Number(valueFromInput);
    }

    if (isNaN(quantity) || quantity <= 0) {
      this.errorMsg = 'La cantidad debe ser mayor que 0.';
      return;
    }

   
    if (quantity % 1 !== 0) {
      this.errorMsg = 'La cantidad debe ser un número entero.';
      return;
    }

    const body = {
      project_id: this.projectId,
      equipment_id: e.id,
      quantity: quantity,
    };

    this.projectEquipmentService.create(body).subscribe({
      next: () => {
        this.successMsg = `Equipo añadido: ${e.name} (x${quantity}).`;
        this.qtyAdd[e.id] = 1;
        this.loadAssigned();
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Error añadiendo equipo al proyecto.';
      },
    });
  }

  
  loadAssigned(): void {
    this.loadingAssigned = true;

    this.projectEquipmentService.index(this.projectId).subscribe({
      next: (value) => {
        this.assigned = value;
        this.updatePagedAssigned();
        this.initEditQuantities();
      },
      error: (err) => {
        console.error(err);
        this.loadingAssigned = false;
      },
      complete: () => {
        this.loadingAssigned = false;
      },
    });
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

  initEditQuantities(): void {
    this.qtyEdit = {};
    this.qtyOriginal = {};

    this.assigned.forEach((pe) => {
      this.qtyEdit[pe.id] = pe.quantity;
      this.qtyOriginal[pe.id] = pe.quantity;
    });

    this.editingRowId = null;
  }

  startEdit(pe: ProjectsEquipmentInterface): void {
    this.editingRowId = pe.id;
  }

  cancelEdit(pe: ProjectsEquipmentInterface): void {
    this.qtyEdit[pe.id] = this.qtyOriginal[pe.id];
    this.editingRowId = null;
  }

  saveQuantity(pe: ProjectsEquipmentInterface): void {
    this.errorMsg = '';
    this.successMsg = '';

    const newQuantity = Number(this.qtyEdit[pe.id]);

    if (isNaN(newQuantity) || newQuantity <= 0) {
      this.errorMsg = 'La cantidad debe ser mayor que 0.';
      return;
    }

    if (newQuantity % 1 !== 0) {
      this.errorMsg = 'La cantidad debe ser un número entero.';
      return;
    }

    if (newQuantity === this.qtyOriginal[pe.id]) {
      this.editingRowId = null;
      return;
    }

    const body = { quantity: newQuantity };

    this.projectEquipmentService.update(pe.id, body).subscribe({
      next: () => {
        this.successMsg = `Cantidad actualizada de ${pe.equipment_name}.`;
        this.qtyOriginal[pe.id] = newQuantity;
        this.editingRowId = null;
        this.loadAssigned();
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Error actualizando cantidad.';
      },
    });
  }

  openConfirm(pe: ProjectsEquipmentInterface): void {
    this.confirmRowId = pe.id;
  }

  cancelConfirm(): void {
    this.confirmRowId = null;
  }

  deleteAssigned(pe: ProjectsEquipmentInterface): void {
    this.errorMsg = '';
    this.successMsg = '';

    this.projectEquipmentService.delete(pe.id).subscribe({
      next: () => {
        this.successMsg = `Equipo eliminado: ${pe.equipment_name}.`;
        this.confirmRowId = null;
        this.loadAssigned();
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Error eliminando equipo del proyecto.';
      },
    });
  }
}