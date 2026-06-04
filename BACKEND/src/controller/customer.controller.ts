import { Response } from 'express';
import prisma from '../lib/prisma';
import { createCustomerOrder } from './order.controller';

export const getMyOrders = async (req: any, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        total: true,
        status: true,
        itemsSnapshot: true,
        shippingName: true,
        shippingAddress: true,
        shippingCity: true,
        shippingPhone: true,
        paymentMethod: true,
        customerEmail: true,
        createdAt: true,
      },
    });

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const createOrder = createCustomerOrder;
