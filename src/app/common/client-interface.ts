export interface ClientInterface {
  id: number
  first_name: string
  last_name: string
  company?: string | null
  phone: number
  email: string
  created_at: string
}
