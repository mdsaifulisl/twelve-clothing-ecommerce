import { Prisma } from '@prisma/client';
import prisma from '../config/prisma.js';
import type { CreateProductInput, UpdateProductInput } from '../validations/product.validation.js';
import { deleteLocalFiles } from '../utils/file.util.js';

export interface IProductQuery {
  category?: string;
  subCategory?: string;
  categorySlug?: string;
  isFeatured?: string;
  search?: string;
}

export const createProductService = async (productData: CreateProductInput) => {
  const { sku, ...restData } = productData;
  const finalSku = sku || `SKU-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  try {
    const newProduct = await prisma.product.create({
      data: {
        ...restData,
        sku: finalSku,
      },
    });
    return newProduct;
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new Error(`The SKU "${finalSku}" already exists. Please provide a unique SKU.`);
    }
    throw error;
  }
};

export const getAllProductsService = async (query: IProductQuery) => {
  const { category, subCategory, search } = query;
  const where: Prisma.ProductWhereInput = {};

  if (category) where.category = category;
  if (subCategory) where.subCategory = subCategory;

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
      { subCategory: { contains: search } },
      { category: { contains: search } },
      { productType: { contains: search } },
      { color: { contains: search } },
      { material: { contains: search } },
      { fit: { contains: search } },
      { sku: { contains: search } },
    ];
  }

  try {
    return await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  } catch (error: any) {
    throw new Error(`Failed to fetch products: ${error.message}`);
  }
};

export const getProductByIdService = async (id: string) => {
  try {
    return await prisma.product.findUnique({ where: { id } });
  } catch (error: any) {
    throw new Error(`Failed to fetch product by ID: ${error.message}`);
  }
};

export const updateProductService = async (
  id: string,
  data: UpdateProductInput & { image?: string[]; existingImages?: string | string[] }
) => {
  const existingProduct = await prisma.product.findUnique({
    where: { id },
    select: { image: true },
  });

  if (!existingProduct) {
    throw new Error('Product not found');
  }

  const { image: newUploadedImages, existingImages, ...productData } = data;
  const oldImages = (existingProduct.image as string[]) || [];

  // path clean up function
  const cleanPath = (imgPath: string) => {
    if (!imgPath) return '';
    let pathStr = imgPath;
    
    // যদি URL-এ http:// বা https:// থাকে, তবে pathname অংশটুকু আলাদা করে নেওয়ার জন্য
    if (pathStr.startsWith('http://') || pathStr.startsWith('https://')) {
      try {
        const urlObj = new URL(pathStr);
        pathStr = urlObj.pathname; 
      } catch {
        // ignore
      }
    }
    
    const normalized = pathStr.replace(/^[/\\]+/, '').trim();
    return `/${normalized}`; 
  };

  let finalImages: string[] = [];
  const uploaded = Array.isArray(newUploadedImages) ? newUploadedImages : [];

  if (existingImages !== undefined && existingImages !== null) {
    let parsedExisting: string[] = [];
    
    if (Array.isArray(existingImages)) {
      parsedExisting = existingImages;
    } else if (typeof existingImages === 'string') {
      try {
        const parsed = JSON.parse(existingImages);
        parsedExisting = Array.isArray(parsed) ? parsed : [existingImages];
      } catch {
        const existingImagesString = String(existingImages);
        parsedExisting = existingImagesString.includes(',')
          ? existingImagesString.split(',').map(s => s.trim())
          : [existingImagesString];
      }
    }

    const formattedExisting = parsedExisting
      .map(cleanPath)
      .filter((p) => p && !p.includes('undefined') && !p.includes('blob'));

    finalImages = [...formattedExisting, ...uploaded];
  } else {
    
    finalImages = [...oldImages.map(cleanPath), ...uploaded];
  }

  try {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...productData,
        image: finalImages,
      },
    });

    const cleanedFinalImages = finalImages.map(cleanPath);
    
    const removedImages = oldImages.filter(
      (oldImg) => !cleanedFinalImages.includes(cleanPath(oldImg))
    );

    if (removedImages.length > 0) {
      deleteLocalFiles(removedImages);
    }

    return updatedProduct;
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new Error('The SKU you provided already exists on another product.');
    }
    throw error;
  }
};

export const deleteProductService = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
    select: { image: true },
  });

  if (!product) {
    throw new Error('Product not found');
  }

  const deletedProduct = await prisma.product.delete({
    where: { id },
  });

  const images = product.image as string[];
  if (images && images.length > 0) {
    deleteLocalFiles(images);
  }

  return deletedProduct;
};