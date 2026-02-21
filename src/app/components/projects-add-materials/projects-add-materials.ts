import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MaterialsInterface } from '../../common/materials-interface';
import { ProjectsMaterialsInterface } from '../../common/projects-materials-interface';

import { MaterialsService } from '../../services/materials-service';
import { ProjectsMaterialsService } from '../../services/projects-materials-service';

@Component({
  selector: 'app-projects-add-materials',
  standalone: false,
  templateUrl: './projects-add-materials.html',
  styleUrl: './projects-add-materials.css',
})
export class ProjectsAddMaterials implements OnInit {
  projectId: number = 0;

  materials: MaterialsInterface[] = [];
  filtered: MaterialsInterface[] = [];
  paged: MaterialsInterface[] = [];
  

  loadingMaterials: boolean = false;

  search: string = '';
  categories: string[] = [];
  selectedCategory: string = 'all';

  currentPage: number = 1;
  pageSize: number = 12;
  totalPages: number = 1;
  
  // paginated projecmaterials
  currentPageAssigned: number = 1;
  pageSizeAssigned: number = 8;
  totalPagesAssigned: number = 1;

  qtyAdd: { [id: number]: number } = {};

  assigned: ProjectsMaterialsInterface[] = [];
  paginatedAssigned: ProjectsMaterialsInterface[] = [] ;
  loadingAssigned: boolean = false;
  qtyEdit: { [id: number]: number } = {};
  editingRowId: number | null = null;
  qtyOriginal: { [id: number]: number } = {};
  confirmRowId: number | null = null;

  errorMsg: string = '';
  successMsg: string = '';

  constructor(
    private route: ActivatedRoute,
    private materialsService: MaterialsService,
    private projectMaterialsService: ProjectsMaterialsService,
  ) {}

  ngOnInit(): void {
    const idStr = this.route.snapshot.paramMap.get('id');
    this.projectId = Number(idStr);

    this.loadAssigned();
    this.loadMaterials();
  }

  loadMaterials(): void {
    this.loadingMaterials = true;
    this.errorMsg = '';
    this.successMsg = '';

    this.materialsService.index().subscribe({
      next: (value) => {
        this.materials = value;

        this.extractCategories();
        this.initAddQuantities();
        this.applyFilters();
      },
      error: (err) => {
        this.errorMsg = 'Error cargando materiales.';
        console.error(err);
        this.loadingMaterials = false;
      },
      complete: () => {
        this.loadingMaterials = false;
      },
    });
  }

  extractCategories(): void {
    this.categories = this.materials.reduce((acc: string[], elem: any) => {
      return (acc = [...acc, elem.category_name]);
    }, []);
    this.categories = [...new Set(this.categories)].sort();
  }

  initAddQuantities(): void {
    this.qtyAdd = {};
    this.materials.forEach((m) => {
      this.qtyAdd[m.id] = 1;
    });
  }

  applyFilters(): void {
    const text = this.search.trim().toLowerCase();

    let tmp: MaterialsInterface[] = [...this.materials];

    if (this.selectedCategory !== 'all') {
      tmp = tmp.filter((m) => m.category_name === this.selectedCategory);
    }

    if (text.length > 0) {
      tmp = tmp.filter((m) => (m.name || '').toLowerCase().includes(text));
    }

    this.filtered = tmp;
    this.currentPage = 1;
    this.updatePaged();
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

  loadAssigned(): void {
    this.loadingAssigned = true;

    this.projectMaterialsService.index(this.projectId).subscribe({
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

  initEditQuantities(): void {
    this.qtyEdit = {};
    this.assigned.forEach((pm) => {
      this.qtyEdit[pm.id] = pm.material_quantity;
      this.qtyOriginal[pm.id] = pm.material_quantity;
    });
    
  }

  addMaterial(material: MaterialsInterface): void {
    this.errorMsg = '';
    this.successMsg = '';

    let quantity: number = 1;

    const valueFromInput = this.qtyAdd[material.id];

    if (valueFromInput !== undefined && valueFromInput !== null) {
      quantity = Number(valueFromInput);
    }

    if (isNaN(quantity) || quantity <= 0) {
      this.errorMsg = 'La cantidad debe ser mayor que 0.';
      return;
    }

    const body = {
      project_id: this.projectId,
      material_id: material.id,
      quantity: quantity,
    };
    //console.log('POST project-materials body:', body);
    this.projectMaterialsService.create(body).subscribe({
      next: () => {
        this.successMsg = `Material añadido al proyecto ${material.name} cantidad ${quantity}.`;
        this.qtyAdd[material.id] = 1;
        this.loadAssigned();
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Error añadiendo material al proyecto.';
      },
    });
  }

  startEdit(pm: ProjectsMaterialsInterface): void {
    this.editingRowId = pm.id;
  }

  cancelEdit(pm: ProjectsMaterialsInterface): void {
    this.qtyEdit[pm.id] = this.qtyOriginal[pm.id];
    this.editingRowId = null;
  }
  saveQuantity(projectMaterial: ProjectsMaterialsInterface): void {
    this.errorMsg = '';
    this.successMsg = '';

    const newQuantity = Number(this.qtyEdit[projectMaterial.id]);

    if (isNaN(newQuantity) || newQuantity <= 0) {
      this.errorMsg = 'La cantidad debe ser mayor que 0.';
      return;
    }
    if (newQuantity === this.qtyOriginal[projectMaterial.id]) {
      this.editingRowId = null;
      return;
    }

    const body = {
      quantity: newQuantity,
    };

    this.projectMaterialsService.update(projectMaterial.id, body).subscribe({
      next: () => {
        this.successMsg = `Cantidad actualizada de ${projectMaterial.material_name} a ${projectMaterial.material_quantity}.`;
        this.qtyOriginal[projectMaterial.id] = newQuantity;
        this.editingRowId = null;
        this.loadAssigned();
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Error actualizando cantidad.';
      },
    });
  }

  openConfirm(projectMaterial: ProjectsMaterialsInterface): void {
    this.confirmRowId = projectMaterial.id;
  }

  cancelConfirm(): void {
    this.confirmRowId = null;
  }

  deleteAssigned(projectMaterial: ProjectsMaterialsInterface): void {
    this.errorMsg = '';
    this.successMsg = '';

    this.projectMaterialsService.delete(projectMaterial.id).subscribe({
      next: () => {
        this.successMsg = `Material eliminado del proyecto ${projectMaterial.material_name}.`;
        this.confirmRowId = null;
        this.loadAssigned();
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Error eliminando material del proyecto.';
      },
    });
  }
}
