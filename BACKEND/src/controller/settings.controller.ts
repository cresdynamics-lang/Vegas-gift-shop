import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { DEFAULT_SETTINGS, mergeSettings } from '../lib/defaultSettings';

export const getSettings = async (_req: Request, res: Response) => {
  try {
    let row = await prisma.storeSettings.findUnique({ where: { id: 'default' } });

    if (!row) {
      row = await prisma.storeSettings.create({
        data: {
          id: 'default',
          general: DEFAULT_SETTINGS.general,
          payments: DEFAULT_SETTINGS.payments,
          shipping: DEFAULT_SETTINGS.shipping,
          branding: DEFAULT_SETTINGS.branding,
          notifications: DEFAULT_SETTINGS.notifications,
        },
      });
    }

    const settings = mergeSettings({
      general: row.general as object,
      payments: row.payments as object,
      shipping: row.shipping as object,
      branding: row.branding as object,
      notifications: row.notifications as object,
    });

    res.json(settings);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to load settings' });
  }
};

export const getPublicSettings = async (_req: Request, res: Response) => {
  try {
    let row = await prisma.storeSettings.findUnique({ where: { id: 'default' } });
    const settings = mergeSettings(
      row
        ? {
            general: row.general as object,
            branding: row.branding as object,
            shipping: row.shipping as object,
          }
        : null
    );

    res.json({
      general: settings.general,
      branding: settings.branding,
      shipping: {
        freeShippingThreshold: settings.shipping.freeShippingThreshold,
        zones: settings.shipping.zones.filter((z) => z.enabled),
      },
    });
  } catch (error) {
    res.json({
      general: DEFAULT_SETTINGS.general,
      branding: DEFAULT_SETTINGS.branding,
      shipping: {
        freeShippingThreshold: DEFAULT_SETTINGS.shipping.freeShippingThreshold,
        zones: DEFAULT_SETTINGS.shipping.zones.filter((z) => z.enabled),
      },
    });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const { general, payments, shipping, branding, notifications } = req.body;
    const current = await prisma.storeSettings.findUnique({ where: { id: 'default' } });
    const merged = mergeSettings(
      current
        ? {
            general: current.general as object,
            payments: current.payments as object,
            shipping: current.shipping as object,
            branding: current.branding as object,
            notifications: current.notifications as object,
          }
        : null
    );

    const updated = {
      general: general ? { ...merged.general, ...general } : merged.general,
      payments: payments ? { ...merged.payments, ...payments } : merged.payments,
      shipping: shipping ? { ...merged.shipping, ...shipping } : merged.shipping,
      branding: branding ? { ...merged.branding, ...branding } : merged.branding,
      notifications: notifications ? { ...merged.notifications, ...notifications } : merged.notifications,
    };

    const row = await prisma.storeSettings.upsert({
      where: { id: 'default' },
      update: updated,
      create: { id: 'default', ...updated },
    });

    res.json(
      mergeSettings({
        general: row.general as object,
        payments: row.payments as object,
        shipping: row.shipping as object,
        branding: row.branding as object,
        notifications: row.notifications as object,
      })
    );
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to save settings' });
  }
};
