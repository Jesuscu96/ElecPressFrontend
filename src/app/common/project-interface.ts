export interface ProjectInterface {
  id: number;
  name: string;
  created_at: string;
  budget: number;
  status: 'pending'|'development'|'completed'|'canceled';
  client_id: number;
  client_name: string;

  
}
