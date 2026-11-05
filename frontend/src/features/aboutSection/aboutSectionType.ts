export interface AboutSection {
  title: string;
  paragraph1: string;
  paragraph2: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  updatedAt?: string;
}

export interface UpdateAboutSectionRequest {
  title: string;
  paragraph1: string;
  paragraph2: string;
  buttonText: string;
  buttonLink: string;
  image?: File;
}

export interface AboutSectionResponse {
  success: boolean;
  data: AboutSection;
}

export interface AboutSectionState {
  content: AboutSection;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  requestId: string | null;
}

export const DEFAULT_ABOUT_SECTION: AboutSection = {
  title: 'Crafting Elegance For Every Celebration',
  paragraph1: 'Founded with a passion for traditional attire, our platform has grown into a trusted destination for premium Panjabis, festive wear, and exclusive ethnic collections. We take pride in sourcing the finest fabrics—from rich silk blends to breathable pure cottons—ensuring absolute comfort without compromising on style.',
  paragraph2: "Whether it's Eid, weddings, or casual festive gatherings, our designs focus on intricate embroidery, refined cuts, and meticulous attention to detail.",
  buttonText: 'Explore Collection',
  buttonLink: '/items?category=Men',
  imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800',
};
