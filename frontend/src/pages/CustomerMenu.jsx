import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPublicCafe, getPublicMenu, placeOrder, validateCoupon } from '../services/api';
import { useCart } from '../context/CartContext';
import { FiMinus, FiPlus, FiShoppingCart, FiX, FiClock, FiPhone, FiMapPin, FiSend, FiTag, FiSearch } from 'react-icons/fi';
import { themes } from '../utils/themes';

const CROSS_SELL = {
  'Burgers':['Drinks','Shakes','Beverages'],'Momos':['Drinks','Beverages'],'Pizza':['Drinks','Beverages'],
  'Sandwich':['Drinks','Beverages'],'Rolls':['Drinks','Beverages'],'Noodles':['Drinks','Beverages'],
  'Drinks':['Burgers','Momos','Snacks'],'Beverages':['Burgers','Momos','Snacks'],
};

const CAT_EMOJI = {
  'All':'🍽️','Burgers':'🍔','Momos':'🥟','Pizza':'🍕','Sandwich':'🥪','Rolls':'🌯',
  'Noodles':'🍜','Rice':'🍚','Drinks':'🥤','Beverages':'☕','Shakes':'🥛','Desserts':'🍰',
  'Snacks':'🍟','Soups':'🍲','Salads':'🥗','Ice Cream':'🍦','Fries':'🍟','Combos':'🎁',
  'Add-ons':'➕','Extras':'➕','Utilities':'🧻','Thali':'🍛','Biryani':'🍛','Chinese':'🥡',
  'South Indian':'🫓','Pasta':'🍝','Wraps':'🌮','Sides':'🧆','Bread':'🫓','Other':'🍽️',
};

const BANNERS = [
  { text:'🔥 Try Our Bestsellers!', sub:'Most loved by customers', bg:'linear-gradient(135deg,#F43F5E,#E11D48)' },
  { text:'🎉 Apply Coupon at Checkout', sub:'Save more on your order', bg:'linear-gradient(135deg,#7C3AED,#6D28D9)' },
  { text:'⚡ Fresh & Fast', sub:'Prepared with love, served quick', bg:'linear-gradient(135deg,#F59E0B,#D97706)' },
];

const getSavedCustomer = () => { try { return JSON.parse(localStorage.getItem('qr_customer')||'{}'); } catch { return {}; } };

const CustomerMenu = () => {
  const { cafeId, tableNo } = useParams();
  const navigate = useNavigate();
  const { cart, subtotal, discount, total, coupon, initCart, addToCart, updateQuantity, clearCart, getItemCount, applyCoupon, removeCoupon } = useCart();
  const [cafe, setCafe] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [vegOnly, setVegOnly] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const [customerName, setCustomerName] = useState(getSavedCustomer().name || '');
  const [customerPhone, setCustomerPhone] = useState(getSavedCustomer().phone || '');
  const [lastOrder, setLastOrder] = useState(null);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [placing, setPlacing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [bannerIdx, setBannerIdx] = useState(0);
  const initDone = useRef(false);

  const activeTheme = cafe ? (themes[cafe.theme] || themes['classic-dark']) : themes['classic-dark'];

  useEffect(() => {
    if (!initDone.current) { initCart(cafeId); initDone.current = true; }
    // Load last order for reorder feature
    try { const lo = JSON.parse(localStorage.getItem(`qr_lastorder_${cafeId}`)||'null'); setLastOrder(lo); } catch{}
    const loadData = async () => {
      try {
        const [cafeRes, menuRes] = await Promise.all([getPublicCafe(cafeId), getPublicMenu(cafeId)]);
        setCafe(cafeRes.data);
        setMenu(menuRes.data.filter(i => i.isAvailable !== false));
      } catch (e) { setError('Cafe not found or inactive'); }
      setLoading(false);
    };
    loadData();
    // Auto-refresh menu every 30s to pick up new items without losing cart
    const interval = setInterval(async () => {
      try {
        const menuRes = await getPublicMenu(cafeId);
        setMenu(menuRes.data.filter(i => i.isAvailable !== false));
      } catch(e){}
    }, 30000);
    return () => clearInterval(interval);
  }, [cafeId]);

  // Banner rotation
  useEffect(() => { const t = setInterval(() => setBannerIdx(i => (i+1)%BANNERS.length), 4000); return () => clearInterval(t); }, []);

  const categories = ['All', ...new Set(menu.map(i => i.category))];
  const filteredMenu = menu.filter(item => {
    if (activeCategory !== 'All' && item.category !== activeCategory) return false;
    if (vegOnly && !item.isVeg) return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getCartQty = (id) => { const item = cart.find(i => i.menuItemId === id); return item ? item.quantity : 0; };
  const handleAddToCart = (item) => { addToCart({ menuItemId: item._id, name: item.name, price: item.price, image: item.image, category: item.category }); };

  const getCrossSellItems = () => {
    if (cart.length === 0) return [];
    const cartCats = [...new Set(cart.map(c => c.category).filter(Boolean))];
    const suggestCats = new Set();
    cartCats.forEach(cat => { (CROSS_SELL[cat] || []).forEach(s => suggestCats.add(s)); });
    cartCats.forEach(c => suggestCats.delete(c));
    return menu.filter(item => suggestCats.has(item.category) && !cart.find(c => c.menuItemId === item._id)).slice(0, 4);
  };

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true); setCouponError('');
    try {
      const { data } = await validateCoupon({ code: couponInput.trim(), cafeId, orderTotal: subtotal });
      applyCoupon(data); setCouponError('');
    } catch (e) { setCouponError(e.response?.data?.message || 'Invalid coupon'); removeCoupon(); }
    setCouponLoading(false);
  };

  const handlePlaceOrder = async () => {
    if (!customerName.trim()) { alert('Please enter your name'); return; }
    if (cart.length === 0) { alert('Cart is empty'); return; }
    setPlacing(true);
    try {
      const orderItems = cart.map(i => ({ menuItem: i.menuItemId, name: i.name, price: i.price, quantity: i.quantity, image: i.image }));
      const { data } = await placeOrder({
        cafeId, tableNumber: parseInt(tableNo), customerName: customerName.trim(), customerPhone,
        items: orderItems, specialInstructions, couponCode: coupon?.code || ''
      });
      // Save customer info & last order for next visit
      localStorage.setItem('qr_customer', JSON.stringify({ name: customerName.trim(), phone: customerPhone }));
      localStorage.setItem(`qr_lastorder_${cafeId}`, JSON.stringify(orderItems.slice(0, 5)));
      clearCart(); setShowCart(false); setShowOrder(false);
      navigate(`/order/track/${data.order.orderNumber}`);
    } catch (e) { alert(e.response?.data?.message || 'Order failed'); }
    setPlacing(false);
  };

  const handleReorder = () => {
    if (!lastOrder) return;
    lastOrder.forEach(item => { addToCart({ menuItemId: item.menuItem, name: item.name, price: item.price, image: item.image, category: '' }); });
    setLastOrder(null);
  };

  if (loading) return (
    <div className="min-h-screen" style={{background:'#0B0B14'}}>
      <div className="p-4 space-y-3">
        <div className="skeleton h-36 w-full rounded-2xl" />
        <div className="skeleton h-10 w-full rounded-xl" />
        <div className="flex gap-2">{[1,2,3,4].map(i=><div key={i} className="skeleton h-8 w-20 rounded-full"/>)}</div>
        {[1,2,3].map(i=><div key={i} className="skeleton h-28 rounded-2xl"/>)}
      </div>
    </div>
  );
  if (error) return <div className="min-h-screen flex items-center justify-center" style={{background:'#0B0B14'}}><div className="text-center"><p className="text-5xl mb-3">😔</p><p className="text-red-400 text-lg">{error}</p></div></div>;

  const crossSellItems = getCrossSellItems();
  const banner = BANNERS[bannerIdx];

  return (
    <div className="min-h-screen pb-24" style={{background: activeTheme.background}}>
      {/* YOUTUBE-STYLE HERO BANNER */}
      <div className="relative overflow-hidden" style={{height:'180px'}}>
        <div className="absolute inset-0" style={{background:`linear-gradient(135deg, ${activeTheme.primary}, ${activeTheme.primaryDark}, ${activeTheme.primary})`}} />
        <div className="absolute inset-0" style={{background:'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}} />
        <div className="absolute inset-0" style={{background:'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.6) 100%)'}} />
        {/* Floating orbs */}
        <div className="absolute w-32 h-32 rounded-full opacity-20" style={{background:activeTheme.primary,filter:'blur(40px)',top:'-20px',right:'-10px',animation:'float 6s ease-in-out infinite'}} />
        <div className="absolute w-24 h-24 rounded-full opacity-15" style={{background:'#fff',filter:'blur(30px)',bottom:'10px',left:'10%',animation:'float 8s ease-in-out infinite reverse'}} />
        {/* Cafe Name - YouTube Banner Style */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="text-3xl font-extrabold text-white tracking-wide" style={{textShadow:'0 4px 20px rgba(0,0,0,0.4)',letterSpacing:'1px'}}>{cafe?.name}</div>
          <div className="flex items-center gap-2 mt-2 text-white/70 text-xs">
            <span className="flex items-center gap-1"><FiMapPin size={10}/>{cafe?.address||cafe?.city||'Restaurant'}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><FiClock size={10}/>{cafe?.openTime}-{cafe?.closeTime}</span>
            {cafe?.phone && <><span>•</span><span className="flex items-center gap-1"><FiPhone size={10}/>{cafe.phone}</span></>}
          </div>
        </div>
        {/* Table Badge - floating */}
        <div className="absolute bottom-3 left-4">
          <span className="px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md" style={{background:'rgba(255,255,255,0.15)',color:'#fff',border:'1px solid rgba(255,255,255,0.2)'}}>🪑 Table {tableNo}</span>
        </div>
      </div>

      {/* ADD-ONS / UTILITIES STRIP */}
      {menu.filter(i=>['Add-ons','Extras','Utilities','Add Ons'].includes(i.category)).length > 0 && (
        <div className="px-4 mt-3">
          <p className="text-[10px] uppercase tracking-wider mb-2 font-medium" style={{color:activeTheme.textSecondary}}>⚡ Quick Add-ons</p>
          <div className="flex gap-2 overflow-x-auto pb-1" style={{scrollbarWidth:'none'}}>
            {menu.filter(i=>['Add-ons','Extras','Utilities','Add Ons'].includes(i.category)).map(item => {
              const qty = getCartQty(item._id);
              return (
                <div key={item._id} className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl" style={{background:activeTheme.glassBg,border:`1px solid ${activeTheme.primary}15`}}>
                  <span className="text-sm">{item.name.includes('Tissue')?'🧻':item.name.includes('Sauce')||item.name.includes('sauce')?'🫙':item.name.includes('Spoon')||item.name.includes('Fork')?'🍴':item.name.includes('Water')?'💧':'➕'}</span>
                  <div>
                    <p className="text-[10px] font-medium" style={{color:activeTheme.textPrimary}}>{item.name}</p>
                    <p className="text-[9px]" style={{color:activeTheme.primary}}>₹{item.price}</p>
                  </div>
                  {qty===0 ? (
                    <button onClick={()=>handleAddToCart(item)} className="text-[9px] px-2 py-0.5 rounded-md font-bold ml-1" style={{background:activeTheme.primary,color:'#fff'}}>+</button>
                  ) : (
                    <span className="text-[10px] font-bold ml-1" style={{color:'#10B981'}}>✓{qty}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Rotating Promo Banner */}
      <div className="px-4 mt-3">
        <div className="rounded-xl p-3 transition-all duration-500 flex items-center gap-3" style={{background:banner.bg}}>
          <div className="flex-1">
            <p className="text-white font-bold text-sm">{banner.text}</p>
            <p className="text-white/70 text-xs">{banner.sub}</p>
          </div>
          <div className="flex gap-1">{BANNERS.map((_,i)=><div key={i} className="w-1.5 h-1.5 rounded-full" style={{background:i===bannerIdx?'#fff':'rgba(255,255,255,0.3)'}}/>)}</div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="px-4 mt-4">
        <div className="relative mb-3">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2" style={{color:activeTheme.textSecondary}} size={14}/>
          <input type="text" placeholder="Search menu..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} className="w-full py-2.5 pl-9 pr-3 rounded-xl text-sm outline-none" style={{background:activeTheme.glassBg, border:`1px solid ${activeTheme.primary}20`, color:activeTheme.textPrimary}} />
        </div>
        {/* Reorder Banner */}
        {lastOrder && lastOrder.length > 0 && (
          <div className="mb-3 rounded-xl p-3 flex items-center gap-3" style={{background:'rgba(245,158,11,0.08)',border:'1px solid rgba(245,158,11,0.2)'}}>
            <span className="text-2xl">🔄</span>
            <div className="flex-1">
              <p className="text-sm font-bold" style={{color:'#F59E0B'}}>Reorder your usual?</p>
              <p className="text-[10px]" style={{color:activeTheme.textSecondary}}>{lastOrder.map(i=>i.name).join(', ')}</p>
            </div>
            <button onClick={handleReorder} className="text-xs px-3 py-1.5 rounded-lg font-bold" style={{background:'#F59E0B',color:'#000'}}>Add All</button>
          </div>
        )}
        {/* Category Cards with Emojis */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2" style={{scrollbarWidth:'none'}}>
          <button onClick={()=>setVegOnly(!vegOnly)} className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex-shrink-0" style={vegOnly?{color:'#10B981',background:'rgba(16,185,129,0.12)',border:'1px solid #10B981'}:{color:activeTheme.textSecondary,background:'rgba(255,255,255,0.04)',border:'1px solid transparent'}}>
            <span className="text-lg">🟢</span><span>Veg</span>
          </button>
          {categories.map(cat=>(
            <button key={cat} onClick={()=>setActiveCategory(cat)} className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex-shrink-0"
              style={activeCategory===cat?{background:activeTheme.primary,color:'#fff',boxShadow:`0 2px 10px ${activeTheme.primaryLight}`}:{background:'rgba(255,255,255,0.04)',color:activeTheme.textSecondary}}>
              <span className="text-lg">{CAT_EMOJI[cat]||'🍽️'}</span><span>{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 mt-3 space-y-3">
        {filteredMenu.length===0 ? (
          <div className="text-center py-12"><div className="text-4xl mb-3 opacity-40">🍽️</div><p style={{color:activeTheme.textSecondary}}>No items found</p></div>
        ) : filteredMenu.map(item => {
          const qty = getCartQty(item._id);
          return (
            <div key={item._id} className="rounded-2xl p-4 flex gap-3 transition-all" style={{background:activeTheme.glassBg, border:`1px solid ${activeTheme.primary}10`}}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-4 h-4 rounded-sm flex items-center justify-center text-[8px] border ${item.isVeg?'border-green-500 text-green-500':'border-red-500 text-red-500'}`}>{item.isVeg?'●':'▲'}</span>
                  <span className="font-medium text-sm truncate" style={{color:activeTheme.textPrimary}}>{item.name}</span>
                </div>
                {item.description && <p className="text-xs mb-2 line-clamp-2" style={{color:activeTheme.textSecondary}}>{item.description}</p>}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm" style={{color:activeTheme.primary}}>₹{item.price}</span>
                  {item.preparationTime>0 && <span className="text-[10px] flex items-center gap-0.5" style={{color:activeTheme.textSecondary}}><FiClock size={9}/>{item.preparationTime}m</span>}
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                {item.image ? <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover"/> : <div className="w-20 h-20 rounded-xl flex items-center justify-center text-2xl" style={{background:activeTheme.primaryLight}}>🍽️</div>}
                {qty===0 ? (
                  <button onClick={()=>handleAddToCart(item)} className="text-xs py-1.5 px-5 rounded-xl font-bold" style={{background:activeTheme.primary,color:'#fff',boxShadow:`0 2px 8px ${activeTheme.primaryLight}`}}>ADD</button>
                ) : (
                  <div className="flex items-center gap-2 rounded-xl px-1 py-0.5" style={{background:`${activeTheme.primary}15`}}>
                    <button onClick={()=>updateQuantity(item._id,-1)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{color:'#F43F5E'}}><FiMinus size={14}/></button>
                    <span className="font-bold text-sm w-4 text-center" style={{color:activeTheme.textPrimary}}>{qty}</span>
                    <button onClick={()=>updateQuantity(item._id,1)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{color:'#10B981'}}><FiPlus size={14}/></button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Cart */}
      {getItemCount()>0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 z-50">
          <button onClick={()=>setShowCart(true)} className="w-full py-4 px-6 rounded-2xl flex items-center justify-between" style={{background:`linear-gradient(135deg,${activeTheme.primary},${activeTheme.primaryDark})`,boxShadow:`0 -4px 30px ${activeTheme.primaryLight}`}}>
            <div className="flex items-center gap-3">
              <div className="relative"><FiShoppingCart className="text-white text-xl"/><span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#F43F5E] text-white text-[10px] flex items-center justify-center font-bold">{getItemCount()}</span></div>
              <span className="text-white font-medium">{getItemCount()} items</span>
            </div>
            <span className="text-white font-bold text-lg">₹{total} →</span>
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex items-end" onClick={()=>setShowCart(false)}>
          <div className="absolute inset-0 bg-black/60"/>
          <div className="relative w-full max-h-[90vh] rounded-t-3xl overflow-y-auto slide-up" style={{background:activeTheme.cardBg}} onClick={e=>e.stopPropagation()}>
            <div className="sticky top-0 flex items-center justify-between p-4 border-b z-10" style={{background:activeTheme.cardBg,borderColor:`${activeTheme.primary}20`}}>
              <h2 className="text-lg font-bold" style={{color:activeTheme.textPrimary}}>Your Order</h2>
              <button onClick={()=>setShowCart(false)} style={{color:activeTheme.textSecondary}}><FiX size={22}/></button>
            </div>
            <div className="p-4 space-y-2">
              {cart.map(item=>(
                <div key={item.menuItemId} className="flex items-center gap-3 p-3 rounded-xl" style={{background:activeTheme.glassBg}}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{color:activeTheme.textPrimary}}>{item.name}</p>
                    <p className="text-sm font-bold" style={{color:activeTheme.primary}}>₹{item.price*item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={()=>updateQuantity(item.menuItemId,-1)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{background:'rgba(244,63,94,0.12)',color:'#F43F5E'}}><FiMinus size={14}/></button>
                    <span className="font-bold text-sm w-4 text-center" style={{color:activeTheme.textPrimary}}>{item.quantity}</span>
                    <button onClick={()=>updateQuantity(item.menuItemId,1)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{background:'rgba(16,185,129,0.12)',color:'#10B981'}}><FiPlus size={14}/></button>
                  </div>
                </div>
              ))}
            </div>
            {/* Cross-sell */}
            {crossSellItems.length>0 && (
              <div className="px-4 pb-3">
                <p className="text-xs font-medium mb-2" style={{color:activeTheme.textSecondary}}>✨ You might also like</p>
                <div className="flex gap-2 overflow-x-auto" style={{scrollbarWidth:'none'}}>
                  {crossSellItems.map(item=>(
                    <div key={item._id} className="flex-shrink-0 w-28 rounded-xl p-2 text-center" style={{background:activeTheme.glassBg,border:`1px solid ${activeTheme.primary}10`}}>
                      {item.image?<img src={item.image} alt="" className="w-full h-14 rounded-lg object-cover mb-1"/>:<div className="w-full h-14 rounded-lg mb-1 flex items-center justify-center" style={{background:activeTheme.primaryLight}}>🍽️</div>}
                      <p className="text-[10px] truncate" style={{color:activeTheme.textPrimary}}>{item.name}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] font-bold" style={{color:activeTheme.primary}}>₹{item.price}</span>
                        <button onClick={()=>handleAddToCart(item)} className="text-[9px] px-2 py-0.5 rounded-md font-bold" style={{background:activeTheme.primary,color:'#fff'}}>+ADD</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Coupon */}
            <div className="px-4 pb-3">
              <div className="rounded-xl p-3" style={{background:activeTheme.glassBg,border:`1px solid ${activeTheme.primary}10`}}>
                <p className="text-xs font-medium mb-2 flex items-center gap-1" style={{color:activeTheme.textSecondary}}><FiTag size={12}/>Have a coupon?</p>
                {coupon ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{background:`${activeTheme.primary}20`,color:activeTheme.primary}}>{coupon.code}</span>
                      <span className="text-xs" style={{color:'#10B981'}}>-₹{discount} off!</span>
                    </div>
                    <button onClick={()=>{removeCoupon();setCouponInput('');setCouponError('');}} className="text-xs" style={{color:'#F43F5E'}}>Remove</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input placeholder="Enter code" value={couponInput} onChange={e=>setCouponInput(e.target.value.toUpperCase())} className="flex-1 py-1.5 px-3 rounded-lg text-xs outline-none" style={{background:'rgba(255,255,255,0.03)',border:`1px solid ${activeTheme.primary}20`,color:activeTheme.textPrimary}}/>
                    <button onClick={handleApplyCoupon} disabled={couponLoading} className="text-xs px-3 py-1.5 rounded-lg font-bold" style={{background:activeTheme.primary,color:'#fff'}}>{couponLoading?'...':'Apply'}</button>
                  </div>
                )}
                {couponError && <p className="text-[10px] mt-1" style={{color:'#F43F5E'}}>{couponError}</p>}
              </div>
            </div>
            {/* Totals */}
            <div className="p-4 border-t" style={{borderColor:`${activeTheme.primary}15`}}>
              <div className="space-y-1 mb-3">
                <div className="flex justify-between text-sm" style={{color:activeTheme.textSecondary}}><span>Subtotal</span><span>₹{subtotal}</span></div>
                {discount>0 && <div className="flex justify-between text-sm" style={{color:'#10B981'}}><span>Discount ({coupon?.code})</span><span>-₹{discount}</span></div>}
                <div className="flex justify-between font-bold text-lg pt-1" style={{color:activeTheme.textPrimary,borderTop:`1px solid ${activeTheme.primary}10`}}><span>Total</span><span>₹{total}</span></div>
              </div>
              {!showOrder ? (
                <button onClick={()=>setShowOrder(true)} className="w-full text-lg py-3 rounded-xl font-bold flex items-center justify-center gap-2" style={{background:`linear-gradient(135deg,${activeTheme.primary},${activeTheme.primaryDark})`,color:'#fff'}}><FiSend/> Place Order</button>
              ) : (
                <div className="space-y-3 slide-up">
                  <input placeholder="Your Name *" className="w-full py-2.5 px-3 rounded-xl text-sm outline-none" style={{background:'rgba(255,255,255,0.03)',border:`1px solid ${activeTheme.primary}20`,color:activeTheme.textPrimary}} required value={customerName} onChange={e=>setCustomerName(e.target.value)}/>
                  <input placeholder="Phone (optional)" className="w-full py-2.5 px-3 rounded-xl text-sm outline-none" style={{background:'rgba(255,255,255,0.03)',border:`1px solid ${activeTheme.primary}20`,color:activeTheme.textPrimary}} value={customerPhone} onChange={e=>setCustomerPhone(e.target.value)}/>
                  <textarea placeholder="Special instructions..." className="w-full py-2.5 px-3 rounded-xl text-sm outline-none resize-none" style={{background:'rgba(255,255,255,0.03)',border:`1px solid ${activeTheme.primary}20`,color:activeTheme.textPrimary}} rows="2" value={specialInstructions} onChange={e=>setSpecialInstructions(e.target.value)}/>
                  <button onClick={handlePlaceOrder} disabled={placing||!customerName.trim()} className="w-full text-lg py-3 rounded-xl font-bold" style={{background:`linear-gradient(135deg,${activeTheme.primary},${activeTheme.primaryDark})`,color:'#fff',opacity:placing?0.6:1}}>
                    {placing?'⏳ Placing...':'✅ Confirm • ₹'+total}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerMenu;
