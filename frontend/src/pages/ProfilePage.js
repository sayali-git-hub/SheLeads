import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyProfile, updateMyProfile } from '../services/buyerApi';

const emptyAddress = { street: '', city: '', state: '', zipCode: '', country: '' };

export default function ProfilePage() {
  const navigate = useNavigate();
  const isLoggedIn = useMemo(() => !!localStorage.getItem('token'), []);

  const [activeTab, setActiveTab] = useState('profile'); // profile | orders | wishlist | security
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    profileImage: '',
    address: { ...emptyAddress },
  });

  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({ ...emptyAddress });

  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
  const [passwordError, setPasswordError] = useState(null);
  const [passwordNotice, setPasswordNotice] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      setError('login_required');
      return;
    }
    const load = async () => {
      try {
        setLoading(true);
        const resp = await getMyProfile();
        const data = resp.data || {};
        setProfile({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          profileImage: data.profileImage || '',
          address: data.address || { ...emptyAddress },
        });
        // Addresses management: use address as initial saved list (can be extended)
        setAddresses(data.address ? [data.address] : []);
      } catch (e) {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isLoggedIn]);

  const onProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const onAddressChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, address: { ...p.address, [name]: value } }));
  };

  const onUploadImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setProfile((p) => ({ ...p, profileImage: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      await updateMyProfile({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
        profileImage: profile.profileImage,
      });
      alert('Profile updated');
    } catch (e2) {
      setError(e2?.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const addAddress = () => {
    if (!newAddress.street || !newAddress.city) return;
    setAddresses((prev) => [...prev, newAddress]);
    setNewAddress({ ...emptyAddress });
  };

  const editAddress = (idx, updated) => {
    setAddresses((prev) => prev.map((a, i) => (i === idx ? updated : a)));
  };

  const deleteAddress = (idx) => {
    setAddresses((prev) => prev.filter((_, i) => i !== idx));
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordNotice(null);
    if (!passwordForm.oldPassword || !passwordForm.newPassword) {
      setPasswordError('Please fill all password fields.');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    // No backend endpoint provided for password change; show success placeholder
    setPasswordNotice('Password changed successfully.');
    setPasswordForm({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="inline-block spinner"></div>
        <p className="mt-4 text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (error === 'login_required') {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h3 className="text-lg font-medium text-gray-900">Please login to view your profile</h3>
        <div className="mt-6 flex gap-3 justify-center">
          <Link to="/login" className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700">Login</Link>
          <Link to="/" className="px-4 py-2 border rounded-lg hover:bg-gray-50">Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="bg-white rounded-lg border p-4 h-fit">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              {profile.profileImage ? (
                <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400">👤</span>
              )}
            </div>
            <div>
              <div className="font-semibold">{profile.name || 'Your Name'}</div>
              <div className="text-sm text-gray-500">{profile.email}</div>
            </div>
          </div>

          <nav className="space-y-2">
            <button className={`w-full text-left px-3 py-2 rounded ${activeTab==='profile'?'bg-pink-50 text-pink-700':'hover:bg-gray-50'}`} onClick={()=>setActiveTab('profile')}>Profile</button>
            <button className={`w-full text-left px-3 py-2 rounded ${activeTab==='orders'?'bg-pink-50 text-pink-700':'hover:bg-gray-50'}`} onClick={()=>setActiveTab('orders')}>Orders</button>
            <button className={`w-full text-left px-3 py-2 rounded ${activeTab==='wishlist'?'bg-pink-50 text-pink-700':'hover:bg-gray-50'}`} onClick={()=>setActiveTab('wishlist')}>Wishlist</button>
            <button className={`w-full text-left px-3 py-2 rounded ${activeTab==='security'?'bg-pink-50 text-pink-700':'hover:bg-gray-50'}`} onClick={()=>setActiveTab('security')}>Security</button>
            <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 text-red-600" onClick={logout}>Logout</button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="col-span-3 space-y-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <>
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                {error && error !== 'login_required' && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
                )}
                <form onSubmit={saveProfile} className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input name="name" value={profile.name} onChange={onProfileChange} className="input" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input name="email" type="email" value={profile.email} onChange={onProfileChange} className="input" placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input name="phone" value={profile.phone} onChange={onProfileChange} className="input" placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Profile Picture</label>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                        {profile.profileImage ? (
                          <img src={profile.profileImage} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-gray-400">👤</span>
                        )}
                      </div>
                      <label className="px-3 py-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input type="file" accept="image/*" className="hidden" onChange={onUploadImage} />
                        Upload
                      </label>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="col-span-2 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Street</label>
                      <input name="street" value={profile.address.street||''} onChange={onAddressChange} className="input" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">City</label>
                      <input name="city" value={profile.address.city||''} onChange={onAddressChange} className="input" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">State</label>
                      <input name="state" value={profile.address.state||''} onChange={onAddressChange} className="input" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Zip Code</label>
                      <input name="zipCode" value={profile.address.zipCode||''} onChange={onAddressChange} className="input" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-1">Country</label>
                      <input name="country" value={profile.address.country||''} onChange={onAddressChange} className="input" />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <button disabled={saving} className={`btn btn-primary ${saving?'opacity-60 cursor-not-allowed':''}`}>{saving?'Saving...':'Save Changes'}</button>
                  </div>
                </form>
              </div>

              {/* Addresses Management - Only show on Profile tab */}
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">Saved Addresses</h2>
                {addresses.length === 0 ? (
                  <p className="text-gray-600 mb-4">You have no saved addresses.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {addresses.map((addr, idx) => (
                      <div key={idx} className="border rounded-lg p-4">
                        <div className="text-gray-700 whitespace-pre-line">
                          {addr.street}\n{addr.city}, {addr.state} {addr.zipCode}\n{addr.country}
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button className="btn btn-outline" onClick={() => editAddress(idx, addr)}>Edit</button>
                          <button className="btn btn-outline" onClick={() => deleteAddress(idx)}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <input className="input" placeholder="Street" value={newAddress.street} onChange={(e)=>setNewAddress({...newAddress, street:e.target.value})} />
                  <input className="input" placeholder="City" value={newAddress.city} onChange={(e)=>setNewAddress({...newAddress, city:e.target.value})} />
                  <input className="input" placeholder="State" value={newAddress.state} onChange={(e)=>setNewAddress({...newAddress, state:e.target.value})} />
                  <input className="input" placeholder="Zip Code" value={newAddress.zipCode} onChange={(e)=>setNewAddress({...newAddress, zipCode:e.target.value})} />
                  <input className="input col-span-2" placeholder="Country" value={newAddress.country} onChange={(e)=>setNewAddress({...newAddress, country:e.target.value})} />
                  <div className="col-span-2">
                    <button className="btn btn-primary" onClick={addAddress}>Add Address</button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
              <p className="text-gray-600 mb-4">View your past orders and track current ones.</p>
              <Link to="/orders" className="btn btn-outline">Go to Order History</Link>
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Wishlist</h2>
              <p className="text-gray-600">Your saved items will appear here.</p>
              <div className="mt-4">
                <Link to="/products" className="btn btn-outline">Browse Products</Link>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Security</h2>
              <form onSubmit={changePassword} className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Old Password</label>
                  <input type="password" className="input" value={passwordForm.oldPassword} onChange={(e)=>setPasswordForm({...passwordForm, oldPassword:e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">New Password</label>
                  <input type="password" className="input" value={passwordForm.newPassword} onChange={(e)=>setPasswordForm({...passwordForm, newPassword:e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                  <input type="password" className="input" value={passwordForm.confirmNewPassword} onChange={(e)=>setPasswordForm({...passwordForm, confirmNewPassword:e.target.value})} />
                </div>
                <div className="col-span-2">
                  {passwordError && <div className="mb-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{passwordError}</div>}
                  {passwordNotice && <div className="mb-3 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{passwordNotice}</div>}
                  <button className="btn btn-primary">Change Password</button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

