import { Response } from 'express';
import prisma from '../lib/prisma';
import { buildOrderSnapshot } from '../lib/orderSnapshot';
import { sendOrderReceivedWhatsApp } from '../lib/whatsapp';
import { sendMetaPurchaseEvent } from '../lib/metaConversionsApi';
import { parseOrderSnapshot } from '../lib/orderSnapshot';
import { getCatalogProductId } from '../lib/catalogId';

type AuthRequest = {
  user?: { id: string; role: string };
  body: Record<string, unknown>;
};

async function persistOrder(
  userId: string | null,
  body: {
    items: unknown;
    total: number;
    shippingName?: string;
    shippingAddress?: string;
    shippingCity?: string;
    shippingPhone?: string;
    paymentMethod?: string;
    shippingMethod?: string;
    customerEmail?: string;
  }
) {
  const items = body.items;
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Order must include at least one item');
  }
  if (!body.total || body.total <= 0) {
    throw new Error('Invalid order total');
  }

  const snapshot = buildOrderSnapshot(items as Parameters<typeof buildOrderSnapshot>[0], {
    shippingMethod: body.shippingMethod,
    customerEmail: body.customerEmail,
  });

  return prisma.order.create({
    data: {
      userId,
      customerEmail: body.customerEmail?.trim() || null,
      total: body.total,
      status: 'PENDING',
      itemsSnapshot: snapshot,
      shippingName: body.shippingName?.trim() || null,
      shippingAddress: body.shippingAddress?.trim() || null,
      shippingCity: body.shippingCity?.trim() || null,
      shippingPhone: body.shippingPhone?.trim() || null,
      paymentMethod: body.paymentMethod || null,
    },
    select: {
      id: true,
      total: true,
      status: true,
      itemsSnapshot: true,
      createdAt: true,
    },
  });
}

async function respondWithOrder(
  res: Response,
  order: Awaited<ReturnType<typeof persistOrder>>,
  body: Parameters<typeof persistOrder>[1]
) {
  const whatsapp = await sendOrderReceivedWhatsApp({
    orderId: order.id,
    total: order.total,
    customerName: body.shippingName,
    customerPhone: body.shippingPhone,
  });

  const bodyExtra = body as {
    trackingEventId?: string;
    eventSourceUrl?: string;
  };
  const eventId =
    typeof bodyExtra.trackingEventId === 'string'
      ? bodyExtra.trackingEventId
      : `purchase-${order.id}`;

  const metaCapi = await sendMetaPurchaseEvent({
    orderId: order.id,
    total: order.total,
    itemsSnapshot: order.itemsSnapshot,
    customerEmail: body.customerEmail,
    shippingPhone: body.shippingPhone,
    eventId,
    eventSourceUrl: bodyExtra.eventSourceUrl,
  });

  const snapshot = parseOrderSnapshot(order.itemsSnapshot);
  const catalogIds = [
    ...new Set(snapshot.lineItems.map((l) => getCatalogProductId(l.productId || l.id))),
  ];

  res.status(201).json({
    ...order,
    whatsappSent: whatsapp.sent,
    metaCapiSent: metaCapi.sent,
    catalogProductIds: catalogIds,
    trackingEventId: eventId,
  });
}

/** Logged-in customer checkout */
export const createCustomerOrder = async (req: AuthRequest, res: Response) => {
  try {
    const body = req.body as Parameters<typeof persistOrder>[1];
    const order = await persistOrder(req.user!.id, body);
    await respondWithOrder(res, order, body);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to place order';
    const status = message.includes('must include') || message.includes('Invalid') ? 400 : 500;
    console.error('Create customer order error:', error);
    res.status(status).json({ error: message });
  }
};

/** Guest checkout — no account required */
export const createGuestOrder = async (req: AuthRequest, res: Response) => {
  try {
    const email = String(req.body.customerEmail || req.body.email || '').trim();
    if (!email) {
      return res.status(400).json({ error: 'Email is required for guest checkout' });
    }

    const body = {
      ...(req.body as Parameters<typeof persistOrder>[1]),
      customerEmail: email,
    };
    const order = await persistOrder(null, body);
    await respondWithOrder(res, order, body);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to place order';
    const status = message.includes('must include') || message.includes('Invalid') || message.includes('required') ? 400 : 500;
    console.error('Create guest order error:', error);
    res.status(status).json({ error: message });
  }
};
