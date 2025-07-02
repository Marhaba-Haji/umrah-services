export interface TransportService {
  id: string;
  vehicle_type: string;
  vehicle_name: string;
  vehicle_image?: string;
  capacity: number;
  luggage_capacity?: string;
  features?: string[];
  vehicle_details?: Record<string, unknown>;
  route: string;
  price: number;
  trip_duration?: string;
  trip_distance?: string;
  is_active: boolean;
  created_at: string;
}

export interface VehicleType {
  vehicle_type: string;
  vehicle_name: string;
  vehicle_image?: string;
  capacity: number;
  luggage_capacity?: string;
  features?: string[];
  vehicle_details?: Record<string, unknown>;
  routes: TransportService[];
}
