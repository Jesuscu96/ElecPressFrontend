export interface ProjectInterface {
  id: number;
  name: string;
  created_at: string;
  budget: number;
  status: 'pending'|'development'|'completed'|'cancelled';
  id_client: number | null;
  client_name: string | null;

  
}
