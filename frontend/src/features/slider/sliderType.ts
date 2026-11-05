export interface BannerSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  link: string;
  createdAt: string;
  updatedAt: string;
}

export interface SliderListResponse {
  success: boolean;
  count: number;
  data: BannerSlide[];
}

export interface SliderState {
  slides: BannerSlide[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  requestId: string | null;
}

export interface SaveSliderPayload {
  id?: string;
  formData: FormData;
}
