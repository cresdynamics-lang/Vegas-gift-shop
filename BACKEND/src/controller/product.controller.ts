import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { upsertStorefrontProduct } from '../lib/productSync';
import { paramId } from '../lib/requestParams';
import { ReviewStatus } from '../../prisma/generated/client';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, search, limit } = req.query;
    let where: any = {};
    
    if (category) {
      where.category = {
        name: {
          equals: String(category),
          mode: 'insensitive'
        }
      };
    }
    
    if (search) {
      where.name = {
        contains: String(search),
        mode: 'insensitive'
      };
    }
    
    const products = await prisma.product.findMany({
      where,
      take: limit ? parseInt(String(limit)) : undefined,
      include: { category: true }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const syncStorefrontProduct = async (req: Request, res: Response) => {
  try {
    const id = paramId(req, 'id');
    const body = req.body;

    if (!body?.name || body.price == null || !body.image || !body.category) {
      return res.status(400).json({ error: 'Missing required product fields' });
    }
    if (body.id && body.id !== id) {
      return res.status(400).json({ error: 'Product ID mismatch' });
    }

    const product = await upsertStorefrontProduct({ ...body, id });
    res.json(product);
  } catch (error) {
    console.error('syncStorefrontProduct:', error);
    res.status(500).json({ error: 'Failed to sync product' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = paramId(req, 'id');
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: {
          where: { status: ReviewStatus.APPROVED },
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { name: true, email: true } } },
        },
      },
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, icon } = req.body;
    const category = await prisma.category.create({
      data: { name, icon }
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const id = paramId(req, 'id');
    const { name, icon } = req.body;
    const category = await prisma.category.update({
      where: { id },
      data: { name, icon }
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const id = paramId(req, 'id');
    await prisma.category.delete({ where: { id } });
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name, description, shortDescription, price, oldPrice, image, images,
      categoryId, isSale, isNew, stock, packageSections, attributes, features, enableCustomization,
    } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        description,
        shortDescription: shortDescription || null,
        price: parseFloat(price),
        oldPrice: oldPrice ? parseFloat(oldPrice) : null,
        image,
        images: images ?? undefined,
        categoryId,
        isSale: Boolean(isSale),
        isNew: Boolean(isNew),
        stock: parseInt(stock) || 0,
        packageSections: packageSections ?? undefined,
        attributes: attributes ?? undefined,
        features: Array.isArray(features) ? features : [],
        enableCustomization: enableCustomization !== false,
      }
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = paramId(req, 'id');
    const {
      name, description, shortDescription, price, oldPrice, image, images,
      categoryId, isSale, isNew, stock, packageSections, attributes, features, enableCustomization,
    } = req.body;
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        shortDescription: shortDescription ?? undefined,
        price: parseFloat(price),
        oldPrice: oldPrice ? parseFloat(oldPrice) : null,
        image,
        images: images ?? undefined,
        categoryId,
        isSale: Boolean(isSale),
        isNew: Boolean(isNew),
        stock: parseInt(stock) || 0,
        packageSections: packageSections ?? undefined,
        attributes: attributes ?? undefined,
        features: Array.isArray(features) ? features : undefined,
        enableCustomization: enableCustomization !== false,
      }
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = paramId(req, 'id');
    await prisma.product.delete({
      where: { id }
    });
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
