import { Response } from 'express';
import prisma from '../lib/prisma';

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
        createdAt: true,
      },
    });

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const createOrder = async (req: any, res: Response) => {
  try {
    const {
      items,
      total,
      shippingName,
      shippingAddress,
      shippingCity,
      shippingPhone,
      paymentMethod,
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must include at least one item' });
    }

    if (!total || total <= 0) {
      return res.status(400).json({ error: 'Invalid order total' });
    }

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        total,
        itemsSnapshot: items,
        shippingName: shippingName?.trim() || null,
        shippingAddress: shippingAddress?.trim() || null,
        shippingCity: shippingCity?.trim() || null,
        shippingPhone: shippingPhone?.trim() || null,
        paymentMethod: paymentMethod || null,
      },
      select: {
        id: true,
        total: true,
        status: true,
        itemsSnapshot: true,
        createdAt: true,
      },
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
};
