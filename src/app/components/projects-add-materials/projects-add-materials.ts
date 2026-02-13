import { Component, OnInit } from '@angular/core';
import { ProjectsMaterialsInterface } from '../../common/projects-materials-interface';
import { Material } from '../material/material';

@Component({
  selector: 'app-projects-add-materials',
  standalone: false,
  templateUrl: './projects-add-materials.html',
  styleUrl: './projects-add-materials.css',
})
export class ProjectsAddMaterials  implements OnInit{
  materials: ProjectsMaterialsInterface[] = [];
  filtered: ProjectsMaterialsInterface[] = [];
  paged: ProjectsMaterialsInterface[] = [];

  loading: boolean = false;
  successMsg: string = '';
  errorMsg: string = '';
  search: string = '';
  //categoryFilter: 
  
  
  ngOnInit(): void {
    //this.loadMaterials();
  }

}
