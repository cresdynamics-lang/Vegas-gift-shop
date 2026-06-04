import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { OrderStatus } from '../../prisma/generated/client';
import { paramId } from '../lib/requestParams';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.count();
    const categories = await prisma.category.count();
    const orders = await prisma.order.count();
    
    const revenueResult = await prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { not: 'CANCELLED' } }
    });
    const revenue = revenueResult._sum.total || 0;

    res.json({ products, categories, orders, revenue });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const id = paramId(req, 'id');
    const { status } = req.body as { status?: OrderStatus };

    if (!status || !Object.values(OrderStatus).includes(status)) {
      return res.status(400).json({ error: 'Invalid order status' });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    res.json(order);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
};

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { orders: true } }
      }
    });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};
