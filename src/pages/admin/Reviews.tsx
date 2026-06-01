import React, { useCallback, useEffect, useState } from 'react';
import { Star, Loader2, CheckCircle2, XCircle, Trash2, Plus, Search } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { API_URL } from '../../config';

type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

interface ReviewRow {
  id: string;
  rating: number;
  comment: string;
  reviewerName: string;
  reviewerEmail?: string | null;
  status: ReviewStatus;
  createdAt: string;
  productId?: string;
  productName?: string;
}

interface ProductOption {
  id: string;
  name: string;
}

export const Reviews: React.FC = () => {
  const { token } = useAuthStore();
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    productId: '',
    rating: '5',
    reviewerName: '',
    reviewerEmail: '',
    comment: '',
    status: 'APPROVED' as ReviewStatus,
  });

  const headers = () => ({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  });

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/api/admin/reviews`;
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (search.trim()) params.set('search', search.trim());
      if (params.toString()) url += `?${params}`;

      const res = await fetch(url, { headers: headers() });
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search, token]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    fetch(`${API_URL}/api/products?limit=5000`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data.map((p: ProductOption) => ({ id: p.id, name: p.name })));
        }
      })
      .catch(() => null);
  }, []);

  const updateStatus = async (id: string, status: ReviewStatus) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: headers(),
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      fetchReviews();
    } catch {
      alert('Failed to update review');
    }
  };

  const removeReview = async (id: string) => {
    if (!window.confirm('Delete this review permanently?')) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/reviews/${id}`, {
        method: 'DELETE',
        headers: headers(),
      });
      if (!res.ok) throw new Error();
      fetchReviews();
    } catch {
      alert('Failed to delete review');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/reviews`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          ...form,
          rating: parseInt(form.rating, 10),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setShowAdd(false);
      setForm({
        productId: '',
        rating: '5',
        reviewerName: '',
        reviewerEmail: '',
        comment: '',
        status: 'APPROVED',
      });
      fetchReviews();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create review');
    } finally {
      setSaving(false);
    }
  };

  const avgRating =
    reviews.filter((r) => r.status === 'APPROVED').length > 0
      ? (
          reviews
            .filter((r) => r.status === 'APPROVED')
            .reduce((s, r) => s + r.rating, 0) /
          reviews.filter((r) => r.status === 'APPROVED').length
        ).toFixed(1)
      : '-';

  const pendingCount = reviews.filter((r) => r.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Reviews</h1>
          <p className="text-gray-500 text-sm">Approve, reject, or add reviews for any product.</p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl border border-emerald-100 flex items-center gap-2 text-sm font-bold">
            <Star size={16} className="fill-emerald-600 text-emerald-600" />
            {avgRating} avg (approved)
          </div>
          {pendingCount > 0 && (
            <span className="text-sm font-bold text-amber-700 bg-amber-50 px-3 py-2 rounded-xl border border-amber-100">
              {pendingCount} pending
            </span>
          )}
          <button
            type="button"
            onClick={() => setShowAdd(!showAdd)}
            className="inline-flex items-center gap-2 bg-black text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            <Plus size={16} />
            Add review
          </button>
        </div>
      </div>

      {showAdd && (
        <form
          onSubmit={handleCreate}
          className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-sm"
        >
          <h2 className="font-bold text-gray-900">New review</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-500 mb-1">Product *</label>
              <select
                required
                value={form.productId}
                onChange={(e) => setForm((f) => ({ ...f, productId: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Select product…</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Reviewer name *</label>
              <input
                required
                value={form.reviewerName}
                onChange={(e) => setForm((f) => ({ ...f, reviewerName: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Email</label>
              <input
                type="email"
                value={form.reviewerEmail}
                onChange={(e) => setForm((f) => ({ ...f, reviewerEmail: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Rating *</label>
              <select
                value={form.rating}
                onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} stars
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: e.target.value as ReviewStatus }))
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              >
                <option value="APPROVED">Approved</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-500 mb-1">Comment *</label>
              <textarea
                required
                rows={3}
                value={form.comment}
                onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-black text-white text-sm font-bold px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save review'}
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="text-sm font-bold text-gray-600 px-4 py-2"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchReviews()}
            placeholder="Search reviews or products…"
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <button
          type="button"
          onClick={fetchReviews}
          className="text-sm font-bold bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg"
        >
          Apply
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16 text-gray-500">
            <Loader2 className="animate-spin" size={28} />
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-center text-gray-500 py-16 text-sm">No reviews found.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {reviews.map((review) => (
              <div key={review.id} className="p-5 hover:bg-gray-50/50 space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{review.reviewerName}</h4>
                    <p className="text-xs text-gray-500">
                      {review.productName || review.productId}
                      {review.reviewerEmail && ` · ${review.reviewerEmail}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex gap-0.5 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={i < review.rating ? 'fill-current' : 'text-gray-200'}
                        />
                      ))}
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        review.status === 'APPROVED'
                          ? 'bg-emerald-50 text-emerald-700'
                          : review.status === 'PENDING'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {review.status}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 italic">&ldquo;{review.comment}&rdquo;</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleString()}
                  </span>
                  <div className="flex gap-2">
                    {review.status === 'PENDING' && (
                      <>
                        <button
                          type="button"
                          onClick={() => updateStatus(review.id, 'APPROVED')}
                          className="text-xs font-bold text-emerald-600 hover:bg-emerald-50 px-2 py-1 rounded flex items-center gap-1"
                        >
                          <CheckCircle2 size={14} /> Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStatus(review.id, 'REJECTED')}
                          className="text-xs font-bold text-red-600 hover:bg-red-50 px-2 py-1 rounded flex items-center gap-1"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </>
                    )}
                    {review.status === 'APPROVED' && (
                      <button
                        type="button"
                        onClick={() => updateStatus(review.id, 'REJECTED')}
                        className="text-xs font-bold text-gray-600 hover:bg-gray-100 px-2 py-1 rounded"
                      >
                        Unpublish
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeReview(review.id)}
                      className="text-xs font-bold text-red-600 hover:bg-red-50 px-2 py-1 rounded flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
