export interface ProjectsMaterialsInterface {
  id: number;
  project_id: number;
  project_name: string;
  material_id: number;
  material_name: string;
  material_image: string | null;
  material_quantity: number;
  material_id_category: number;
}
