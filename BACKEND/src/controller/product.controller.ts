import { Request, Response } from 'express';
import prisma from '../lib/prisma';

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

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true, reviews: true }
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
