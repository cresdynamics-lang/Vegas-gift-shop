import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { DEFAULT_SETTINGS, mergeSettings, type StoredSettings } from '../lib/defaultSettings';

function storedFromRow(row: {
  general: unknown;
  payments: unknown;
  shipping: unknown;
  branding: unknown;
  notifications: unknown;
  googleReviews: unknown;
}): StoredSettings {
  return {
    general: row.general as StoredSettings['general'],
    payments: row.payments as StoredSettings['payments'],
    shipping: row.shipping as StoredSettings['shipping'],
    branding: row.branding as StoredSettings['branding'],
    notifications: row.notifications as StoredSettings['notifications'],
    googleReviews: row.googleReviews as StoredSettings['googleReviews'],
  };
}

function storedPartialFromRow(row: {
  general: unknown;
  branding: unknown;
  shipping: unknown;
  googleReviews: unknown;
}): StoredSettings {
  return {
    general: row.general as StoredSettings['general'],
    branding: row.branding as StoredSettings['branding'],
    shipping: row.shipping as StoredSettings['shipping'],
    googleReviews: row.googleReviews as StoredSettings['googleReviews'],
  };
}

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
          googleReviews: DEFAULT_SETTINGS.googleReviews,
        },
      });
    }

    res.json(mergeSettings(storedFromRow(row)));
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to load settings' });
  }
};

export const getPublicSettings = async (_req: Request, res: Response) => {
  try {
    const row = await prisma.storeSettings.findUnique({ where: { id: 'default' } });
    const settings = mergeSettings(row ? storedPartialFromRow(row) : null);

    res.json({
      general: settings.general,
      branding: settings.branding,
      shipping: {
        freeShippingThreshold: settings.shipping.freeShippingThreshold,
        zones: settings.shipping.zones.filter((z) => z.enabled),
      },
      googleReviews: settings.googleReviews,
    });
  } catch {
    res.json({
      general: DEFAULT_SETTINGS.general,
      branding: DEFAULT_SETTINGS.branding,
      shipping: {
        freeShippingThreshold: DEFAULT_SETTINGS.shipping.freeShippingThreshold,
        zones: DEFAULT_SETTINGS.shipping.zones.filter((z) => z.enabled),
      },
      googleReviews: DEFAULT_SETTINGS.googleReviews,
    });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const { general, payments, shipping, branding, notifications, googleReviews } = req.body;
    const current = await prisma.storeSettings.findUnique({ where: { id: 'default' } });
    const merged = mergeSettings(current ? storedFromRow(current) : null);

    const updated = {
      general: general ? { ...merged.general, ...general } : merged.general,
      payments: payments ? { ...merged.payments, ...payments } : merged.payments,
      shipping: shipping ? { ...merged.shipping, ...shipping } : merged.shipping,
      branding: branding ? { ...merged.branding, ...branding } : merged.branding,
      notifications: notifications ? { ...merged.notifications, ...notifications } : merged.notifications,
      googleReviews: googleReviews ? { ...merged.googleReviews, ...googleReviews } : merged.googleReviews,
    };

    const row = await prisma.storeSettings.upsert({
      where: { id: 'default' },
      update: updated,
      create: { id: 'default', ...updated },
    });

    res.json(mergeSettings(storedFromRow(row)));
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to save settings' });
  }
};
