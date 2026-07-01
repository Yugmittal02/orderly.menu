import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllCafes, createCafe, toggleCafeStatus, deleteCafe } from '../services/api';
import { FiPlus, FiLogOut, FiToggleLeft, FiToggleRight, FiTrash2, FiCopy, FiCheck, FiCoffee, FiGrid } from 'react-icons/fi';

const SuperAdminDashboard = () => {
  const { superAdmin, logoutSuperAdmin } = useAuth();
  const [cafes, setCafes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState('');
  const [form, setForm] = useState({ name:'', ownerName:'', phone:'', email:'', address:'', city:'', tableCount:10, description:'' });

  const loadCafes = async () => {
    try {
      const { data } = await getAllCafes();
      setCafes(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { loadCafes(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await createCafe(form);
      alert(`Cafe created!\nCafe ID: ${data.cafeId}\n\nShare this Cafe ID with the cafe owner.`);
      setShowForm(false);
      setForm({ name:'', ownerName:'', phone:'', email:'', address:'', city:'', tableCount:10, description:'' });
      loadCafes();
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to create cafe');
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleCafeStatus(id);
      loadCafes();
    } catch (e) { alert('Failed to toggle status'); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteCafe(id);
      loadCafes();
    } catch (e) { alert('Failed to delete'); }
  };

  const copyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="min-h-screen" style={{background:'linear-gradient(145deg,#0B0B14,#151525,#1A1A30)'}}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4" style={{borderBottom:'1px solid rgba(124,58,237,0.12)',background:'rgba(11,11,20,0.8)',backdropFilter:'blur(12px)'}}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:'linear-gradient(135deg,#7C3AED,#6D28D9)',boxShadow:'0 4px 15px rgba(124,58,237,0.3)'}}>
            <FiGrid className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Super Admin</h1>
            <p className="text-xs text-gray-400">{superAdmin?.email}</p>
          </div>
        </div>
        <button onClick={logoutSuperAdmin} className="btn-outline text-sm py-2 px-4"><FiLogOut /> Logout</button>
      </header>

      <div className="max-w-5xl mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="glass-card p-5 text-center">
            <p className="text-3xl font-bold text-white">{cafes.length}</p>
            <p className="text-sm text-gray-400 mt-1">Total Cafes</p>
          </div>
          <div className="glass-card p-5 text-center">
            <p className="text-3xl font-bold text-green-400">{cafes.filter(c=>c.isActive).length}</p>
            <p className="text-sm text-gray-400 mt-1">Active</p>
          </div>
          <div className="glass-card p-5 text-center">
            <p className="text-3xl font-bold text-red-400">{cafes.filter(c=>!c.isActive).length}</p>
            <p className="text-sm text-gray-400 mt-1">Inactive</p>
          </div>
        </div>

        {/* Add Cafe Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">All Cafes</h2>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">
            <FiPlus /> Add Cafe
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <form onSubmit={handleCreate} className="glass-card p-6 mb-6 slide-up">
            <h3 className="text-lg font-bold text-white mb-4">Create New Cafe</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input placeholder="Cafe Name *" className="input-field" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
              <input placeholder="Owner Name *" className="input-field" required value={form.ownerName} onChange={e=>setForm({...form,ownerName:e.target.value})} />
              <input placeholder="Phone *" className="input-field" required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} />
              <input placeholder="Email" type="email" className="input-field" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
              <input placeholder="Number of Tables" type="number" min="1" max="200" className="input-field" value={form.tableCount} onChange={e=>setForm({...form,tableCount:parseInt(e.target.value)||10})} />
              <input placeholder="Address" className="input-field" value={form.address} onChange={e=>setForm({...form,address:e.target.value})} />
              <input placeholder="City" className="input-field" value={form.city} onChange={e=>setForm({...form,city:e.target.value})} />
            </div>
            <textarea placeholder="Description" className="input-field mt-4" rows="2" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
            <div className="flex gap-3 mt-4">
              <button type="submit" className="btn-primary">Create Cafe</button>
              <button type="button" onClick={()=>setShowForm(false)} className="btn-outline">Cancel</button>
            </div>
          </form>
        )}

        {/* Cafe List */}
        {loading ? (
          <div className="text-center text-gray-400 py-20">Loading cafes...</div>
        ) : cafes.length === 0 ? (
          <div className="text-center py-20">
            <FiCoffee className="text-5xl text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No cafes yet. Create your first cafe!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {cafes.map(cafe => (
              <div key={cafe._id} className="glass-card p-5 fade-in">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white">{cafe.name}</h3>
                      <span className={`status-badge ${cafe.isActive?'status-ready':'status-cancelled'}`}>
                        {cafe.isActive?'Active':'Inactive'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-400">
                      <span>👤 {cafe.ownerName}</span>
                      <span>📞 {cafe.phone}</span>
                      <span>🪑 {cafe.tableCount} tables</span>
                      {cafe.city && <span>📍 {cafe.city}</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <code className="text-xs px-3 py-1 rounded-lg font-mono" style={{background:'rgba(124,58,237,0.1)',color:'#A78BFA'}}>
                        {cafe.cafeId}
                      </code>
                      <button onClick={() => copyId(cafe.cafeId)} className="text-gray-400 hover:text-white transition-colors">
                        {copied === cafe.cafeId ? <FiCheck className="text-green-400" /> : <FiCopy />}
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleToggle(cafe._id)} className="btn-outline text-sm py-2 px-3" title={cafe.isActive?'Deactivate':'Activate'}>
                      {cafe.isActive ? <FiToggleRight className="text-green-400" /> : <FiToggleLeft />}
                    </button>
                    <button onClick={() => handleDelete(cafe._id, cafe.name)} className="btn-danger text-sm py-2 px-3">
                      <FiTrash2 />
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

export default SuperAdminDashboard;
