import { Request, Response } from 'express';
import {
  createProductService,
  getAllProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService,
  IProductQuery,
} from '../services/product.service.js';
import { CreateProductInput, UpdateProductInput } from '../validations/product.validation.js';
import { getFullImageUrl } from '../utils/getImageUrl.js';

// ইমেজ ইউআরএল ফরম্যাট করার হেল্পার ফাংশন
const formatProductImage = (req: Request, product: any) => {
  if (!product) return product;

  const imageField = product.image || product.images;

  return {
    ...(product as Record<string, any>),
    image: Array.isArray(imageField)
      ? imageField.map((img: string) => getFullImageUrl(req, img))
      : [],
  };
};

// নতুন প্রোডাক্ট তৈরি হ্যান্ডলার
// নতুন প্রোডাক্ট তৈরি হ্যান্ডলার
export const createProductHandler = async (req: Request, res: Response) => {
  try {
    
    // console.log("Create Product Body:", req.body);

    const productData: CreateProductInput = {
      ...req.body,
      image: req.body.image || [],
    };

    const product = await createProductService(productData);
    const formattedProduct = formatProductImage(req, product);

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: formattedProduct,
    });
  } catch (error: any) {
    // console.error("CREATE PRODUCT ERROR:", error);

    // product already exists
    const errorMessage = error.message || 'Failed to create product';

    return res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
};

// All Product handler
export const getProductsHandler = async (req: Request, res: Response) => {
  try {
    const query: IProductQuery = req.query;
    const products = await getAllProductsService(query);

    const formattedProducts = products.map((product: any) => formatProductImage(req, product));

    return res.status(200).json({
      success: true,
      count: formattedProducts.length,
      data: formattedProducts,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch products',
    });
  }
};

// Single Product handler
export const getProductByIdHandler = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const product = await getProductByIdService(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const formattedProduct = formatProductImage(req, product);

    return res.status(200).json({
      success: true,
      data: formattedProduct,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch product',
    });
  }
};

// Update Product handler
export const updateProductHandler = async (req: Request, res: Response) => {


  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    // ১. নতুন আপলোড হওয়া ফাইলগুলোর পাথ বের করা (compressAndSaveImages থেকে আসা req.body.image অগ্রাধিকার পাবে)
    const newImageUrls = req.body.image || undefined;

    // ২. availableSizes এবং careInstructions হ্যান্ডলিং
    let availableSizes = req.body.availableSizes;
    if (availableSizes && typeof availableSizes === 'string') {
      availableSizes = [availableSizes];
    }

    let careInstructions = req.body.careInstructions;
    if (careInstructions && typeof careInstructions === 'string') {
      careInstructions = [careInstructions];
    }

    // ৩. existingImages পার্সিং (JSON স্ট্রিং বা অ্যারে হ্যান্ডেল করা)
    let existingImages = req.body.existingImages || req.body['existingImages[]'];
    
    if (existingImages) {
      if (typeof existingImages === 'string') {
        try {
          const parsed = JSON.parse(existingImages);
          existingImages = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          existingImages = [existingImages];
        }
      } else if (!Array.isArray(existingImages)) {
        existingImages = [existingImages];
      }
    } else {
      // যদি ইউজার সত্যিই কোনো ছবি না রাখে, তবে এটি খালি অ্যারে হিসেবে কাজ করবে
      existingImages = []; 
    }

    console.log("exitingImages",  existingImages)

    const updateData: UpdateProductInput & { image?: string[]; existingImages?: string | string[] } = {
      ...req.body,
      ...(availableSizes && { availableSizes }),
      ...(careInstructions && { careInstructions }),
      ...(existingImages !== undefined && { existingImages }),
      ...(newImageUrls !== undefined && { image: newImageUrls }),
    };

    const updatedProduct = await updateProductService(id, updateData);
    const formattedProduct = formatProductImage(req, updatedProduct);

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: formattedProduct,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to update product',
    });
  }
};

// Delete Product handler
export const deleteProductHandler = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await deleteProductService(id);

    return res.status(200).json({
      success: true,
      message: 'Product and associated images deleted successfully',
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message || 'Product not found or failed to delete',
    });
  }
};


