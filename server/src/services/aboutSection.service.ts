import prisma from '../config/prisma.js';
import { deleteLocalFile } from '../utils/file.util.js';
import type { UpdateAboutSectionInput } from '../validations/aboutSection.validation.js';

const ABOUT_SECTION_ID = 'singleton';

export const DEFAULT_ABOUT_SECTION = {
  title: 'Crafting Elegance For Every Celebration',
  paragraph1: 'Founded with a passion for traditional attire, our platform has grown into a trusted destination for premium Panjabis, festive wear, and exclusive ethnic collections. We take pride in sourcing the finest fabrics—from rich silk blends to breathable pure cottons—ensuring absolute comfort without compromising on style.',
  paragraph2: "Whether it's Eid, weddings, or casual festive gatherings, our designs focus on intricate embroidery, refined cuts, and meticulous attention to detail.",
  buttonText: 'Explore Collection',
  buttonLink: '/items?category=Men',
  imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800',
};

export const getAboutSection = async () =>
  await prisma.aboutSection.findUnique({ where: { id: ABOUT_SECTION_ID } }) ?? DEFAULT_ABOUT_SECTION;

export const updateAboutSection = async (input: UpdateAboutSectionInput) => {
  const existing = await prisma.aboutSection.findUnique({ where: { id: ABOUT_SECTION_ID } });
  const imageUrl = input.image ?? existing?.imageUrl ?? DEFAULT_ABOUT_SECTION.imageUrl;

  const updated = await prisma.aboutSection.upsert({
    where: { id: ABOUT_SECTION_ID },
    create: {
      id: ABOUT_SECTION_ID,
      title: input.title,
      paragraph1: input.paragraph1,
      paragraph2: input.paragraph2,
      buttonText: input.buttonText,
      buttonLink: input.buttonLink,
      imageUrl,
    },
    update: {
      title: input.title,
      paragraph1: input.paragraph1,
      paragraph2: input.paragraph2,
      buttonText: input.buttonText,
      buttonLink: input.buttonLink,
      imageUrl,
    },
  });

  if (input.image && existing?.imageUrl.startsWith('/uploads/about/') && existing.imageUrl !== imageUrl) {
    deleteLocalFile(existing.imageUrl);
  }
  return updated;
};
