import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { ReviewStatus } from '../../prisma/generated/client';

interface AuthRequest extends Request {
  user?: { id: string; role: string; name?: string; email?: string };
}

async function syncProductReviewStats(productId: string) {
  const approved = await prisma.review.findMany({
    where: { productId, status: ReviewStatus.APPROVED },
    select: { rating: true },
  });
  const reviewCount = approved.length;
  const rating =
    reviewCount > 0
      ? approved.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : 0;

  await prisma.product.update({
    where: { id: productId },
    data: { rating, reviewCount },
  });
}

function formatReview(review: {
  id: string;
  rating: number;
  comment: string;
  reviewerName: string;
  reviewerEmail: string | null;
  status: ReviewStatus;
  createdAt: Date;
  user?: { name: string | null; email: string } | null;
  product?: { id: string; name: string } | null;
}) {
  return {
    id: review.id,
    rating: review.rating,
    comment: review.comment,
    reviewerName: review.reviewerName || review.user?.name || 'Customer',
    reviewerEmail: review.reviewerEmail || review.user?.email || null,
    status: review.status,
    createdAt: review.createdAt,
    productId: review.product?.id,
    productName: review.product?.name,
  };
}

/** Public: approved reviews for a product */
export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({
        error: 'Product not found in database. Refresh the product page to sync the catalog.',
      });
    }

    const reviews = await prisma.review.findMany({
      where: { productId, status: ReviewStatus.APPROVED },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    });

    res.json({
      reviews: reviews.map((r) => formatReview({ ...r, product: { id: productId, name: product.name } })),
      reviewCount: product.reviewCount,
      rating: product.rating,
    });
  } catch {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

/** Storefront: submit a review (guest or logged-in customer) */
export const createProductReview = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;
    const { rating, comment, reviewerName, reviewerEmail } = req.body;

    const ratingNum = parseInt(String(rating), 10);
    if (!ratingNum || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    if (!comment?.trim()) {
      return res.status(400).json({ error: 'Review comment is required' });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({
        error: 'Product not found in database. Refresh the product page and try again.',
      });
    }

    let name = reviewerName?.trim();
    let email = reviewerEmail?.trim() || null;
    let userId: string | null = null;

    if (req.user?.role === 'CUSTOMER') {
      const user = await prisma.user.findUnique({ where: { id: req.user.id } });
      if (!user) return res.status(401).json({ error: 'Invalid session' });
      userId = user.id;
      name = name || user.name || user.email.split('@')[0];
      email = email || user.email;
    } else {
      if (!name) return res.status(400).json({ error: 'Your name is required' });
      if (!email) return res.status(400).json({ error: 'Your email is required' });
    }

    const review = await prisma.review.create({
      data: {
        productId,
        rating: ratingNum,
        comment: comment.trim(),
        reviewerName: name,
        reviewerEmail: email,
        userId,
        status: ReviewStatus.PENDING,
      },
    });

    res.status(201).json({
      message: 'Thank you! Your review was submitted and is pending approval.',
      review: formatReview({ ...review, product: { id: productId, name: product.name } }),
    });
  } catch {
    res.status(500).json({ error: 'Failed to submit review' });
  }
};

/** Admin: list all reviews */
export const getAdminReviews = async (req: Request, res: Response) => {
  try {
    const { status, productId, search } = req.query;
    const where: {
      status?: ReviewStatus;
      productId?: string;
      OR?: { reviewerName?: object; comment?: object; product?: object };
    } = {};

    if (status && Object.values(ReviewStatus).includes(status as ReviewStatus)) {
      where.status = status as ReviewStatus;
    }
    if (productId) where.productId = String(productId);
    if (search) {
      const q = String(search);
      where.OR = [
        { reviewerName: { contains: q, mode: 'insensitive' } },
        { comment: { contains: q, mode: 'insensitive' } },
        { product: { name: { contains: q, mode: 'insensitive' } } },
      ];
    }

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 500,
      include: {
        user: { select: { name: true, email: true } },
        product: { select: { id: true, name: true } },
      },
    });

    res.json(reviews.map((r) => formatReview(r)));
  } catch {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

/** Admin: approve / reject */
export const updateReviewStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!Object.values(ReviewStatus).includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const existing = await prisma.review.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Review not found' });

    const review = await prisma.review.update({
      where: { id },
      data: { status },
      include: { product: { select: { id: true, name: true } }, user: { select: { name: true, email: true } } },
    });

    await syncProductReviewStats(review.productId);

    res.json(formatReview(review));
  } catch {
    res.status(500).json({ error: 'Failed to update review' });
  }
};

/** Admin: delete review */
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.review.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Review not found' });

    await prisma.review.delete({ where: { id } });
    await syncProductReviewStats(existing.productId);

    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete review' });
  }
};

/** Admin: create review (e.g. seed social proof) */
export const createAdminReview = async (req: Request, res: Response) => {
  try {
    const { productId, rating, comment, reviewerName, reviewerEmail, status } = req.body;

    const ratingNum = parseInt(String(rating), 10);
    if (!productId) return res.status(400).json({ error: 'Product is required' });
    if (!ratingNum || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    if (!comment?.trim()) return res.status(400).json({ error: 'Comment is required' });
    if (!reviewerName?.trim()) return res.status(400).json({ error: 'Reviewer name is required' });

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const reviewStatus =
      status && Object.values(ReviewStatus).includes(status)
        ? status
        : ReviewStatus.APPROVED;

    const review = await prisma.review.create({
      data: {
        productId,
        rating: ratingNum,
        comment: comment.trim(),
        reviewerName: reviewerName.trim(),
        reviewerEmail: reviewerEmail?.trim() || null,
        status: reviewStatus,
      },
      include: { product: { select: { id: true, name: true } } },
    });

    if (reviewStatus === ReviewStatus.APPROVED) {
      await syncProductReviewStats(productId);
    }

    res.status(201).json(formatReview(review));
  } catch {
    res.status(500).json({ error: 'Failed to create review' });
  }
};
