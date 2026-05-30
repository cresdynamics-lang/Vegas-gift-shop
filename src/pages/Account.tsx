import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Package,
  Lock,
  LogOut,
  Loader2,
  Mail,
  ShoppingBag,
} from 'lucide-react';
import { API_URL } from '../config';
import { useCustomerStore } from '../store/useCustomerStore';

type Tab = 'profile' | 'orders' | 'password';

interface OrderItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
  total: number;
  status: string;
  itemsSnapshot: OrderItem[];
  shippingName?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingPhone?: string;
  paymentMethod?: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export default function Account() {
  const navigate = useNavigate();
  const { user, token, isAuthenticated, login, logout, updateUser } = useCustomerStore();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Auth form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Profile form
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfileEmail(user.email || '');
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && token && activeTab === 'orders') {
      fetchOrders();
    }
  }, [isAuthenticated, token, activeTab]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setOrders(data);
    } catch {
      setError('Could not load orders. Make sure the backend is running.');
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = authMode === 'login'
        ? { email, password }
        : { name, email, password };

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Authentication failed');

      if (data.user.role !== 'CUSTOMER') {
        throw new Error('Staff accounts should use the admin portal.');
      }

      login(data.user, data.token);
      setMessage(authMode === 'login' ? 'Welcome back!' : 'Account created successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async () => {
    setError('');
    setMessage('');
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: profileName, email: profileEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');
      updateUser(data);
      setMessage('Profile updated successfully.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const savePassword = async () => {
    setError('');
    setMessage('');
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to change password');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setMessage('Password changed successfully.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setActiveTab('profile');
    navigate('/account');
  };

  const inputClass =
    'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600';

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] bg-gray-50 py-16">
        <div className="max-w-md mx-auto px-4">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center mx-auto mb-4">
              <User className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
            <p className="text-sm text-gray-500 mt-2">
              Sign in to track orders, manage your profile, and checkout faster.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => { setAuthMode('login'); setError(''); }}
                className={`flex-1 py-4 text-sm font-bold transition-colors ${authMode === 'login' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-400'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setAuthMode('register'); setError(''); }}
                className={`flex-1 py-4 text-sm font-bold transition-colors ${authMode === 'register' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-400'}`}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleAuth} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
              )}

              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                    placeholder="Your name"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`${inputClass} pl-10`}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputClass} pl-10`}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-3.5 rounded-xl font-bold text-sm hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : authMode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Continue shopping?{' '}
            <Link to="/shop" className="text-red-600 font-bold hover:underline">Browse gifts</Link>
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile' as Tab, label: 'Profile', icon: User },
    { id: 'orders' as Tab, label: 'Orders', icon: Package },
    { id: 'password' as Tab, label: 'Password', icon: Lock },
  ];

  return (
    <div className="min-h-[70vh] bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
            <p className="text-sm text-gray-500 mt-1">Welcome back, {user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-red-600 transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>

        {(message || error) && (
          <div className={`mb-6 px-4 py-3 rounded-xl text-sm ${error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {error || message}
          </div>
        )}

        <div className="grid md:grid-cols-[220px_1fr] gap-6">
          <nav className="bg-white rounded-2xl border border-gray-100 p-2 h-fit">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => { setActiveTab(id); setMessage(''); setError(''); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                  activeTab === id ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
            <Link
              to="/shop"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 mt-1"
            >
              <ShoppingBag size={18} />
              Continue Shopping
            </Link>
          </nav>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Profile Details</h2>
                  <p className="text-sm text-gray-500 mt-1">Update your name and email address.</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Full Name</label>
                    <input value={profileName} onChange={(e) => setProfileName(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Email</label>
                    <input type="email" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} className={inputClass} />
                  </div>
                </div>
                <button
                  onClick={saveProfile}
                  disabled={isLoading}
                  className="bg-black text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Order History</h2>
                  <p className="text-sm text-gray-500 mt-1">View and track your past purchases.</p>
                </div>

                {ordersLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-red-600" size={32} />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="mx-auto text-gray-300 mb-4" size={48} />
                    <p className="text-gray-500 font-medium">No orders yet</p>
                    <Link to="/shop" className="inline-block mt-4 text-red-600 font-bold text-sm hover:underline">
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const items = (order.itemsSnapshot as OrderItem[]) || [];
                      return (
                        <div key={order.id} className="border border-gray-100 rounded-xl p-5">
                          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                            <div>
                              <p className="text-xs text-gray-400 uppercase tracking-widest">Order</p>
                              <p className="font-bold text-sm text-gray-900">#{order.id.slice(0, 8).toUpperCase()}</p>
                            </div>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                              {order.status}
                            </span>
                            <div className="text-right">
                              <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                              <p className="font-bold text-red-600">KShs {order.total.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {items.map((item, i) => (
                              <div key={i} className="flex items-center gap-3 text-sm">
                                {item.image && (
                                  <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-50" />
                                )}
                                <span className="flex-1 text-gray-700 truncate">{item.name}</span>
                                <span className="text-gray-400">×{item.quantity}</span>
                                <span className="font-medium">KShs {(item.price * item.quantity).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'password' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Change Password</h2>
                  <p className="text-sm text-gray-500 mt-1">Keep your account secure with a strong password.</p>
                </div>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Current Password</label>
                    <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">New Password</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass} minLength={8} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Confirm New Password</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} />
                  </div>
                </div>
                <button
                  onClick={savePassword}
                  disabled={isLoading}
                  className="bg-black text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
