export interface StoreLocation {
  id: string;
  division: string;
  name: string;
  address: string;
  phone: string;
  offDay: string;
  openingTime: string;
  closingTime: string;
  mapLink: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStoreLocationRequest {
  division: string;
  name: string;
  address: string;
  phone: string;
  offDay: string;
  openingTime: string;
  closingTime: string;
  mapLink: string;
}

export interface StoreLocationListResponse {
  success: boolean;
  count: number;
  data: StoreLocation[];
}

export interface StoreLocationState {
  locations: StoreLocation[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  requestId: string | null;
}
