import { useState, useEffect } from 'react';

function App() {
  const [orders, setOrders] = useState([]);
  const [name, setName] = useState('');

  const [items, setItems] = useState([{ type: '', count: 1 }]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('fataer-pro')) || [];
    setOrders(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('fataer-pro', JSON.stringify(orders));
  }, [orders]);

  const addNewItemRow = () => {
    setItems([...items, { type: '', count: 1 }]);
  };

  const updateItemField = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  // added a new order
  const handleAction = () => {
    if (!name || items.some(item => !item.type || item.count < 1)) {
      return alert("يرجى كتابة اسم الشخص وتعبئة جميع الأصناف");
    }

    if (editingId) {
      setOrders(orders.map(o => o.id === editingId ? { ...o, name, items: [...items] } : o));
      setEditingId(null);
    } else {
      const newOrder = { id: Date.now(), name, items: [...items] };
      setOrders([...orders, newOrder]);
    }

    setName('');
    setItems([{ type: '', count: 1 }]);
  };

  const startEdit = (order) => {
    setEditingId(order.id);
    setName(order.name);
    setItems(order.items);
  };

  const getTotals = () => {
    const totals = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        totals[item.type] = (totals[item.type] || 0) + parseInt(item.count);
      });
    });
    return totals;
  };

  // clear all
  const clearAllOrders = () => {
    const confirmClear = window.confirm("⚠️ هل أنت متأكد من حذف جميع الطلبات؟ سيتم مسح القائمة بالكامل!");
    if (confirmClear) {
      setOrders([]);
    }
  };

  const fallingEmojis = [
    { emoji: '🌯', left: '5%', delay: '0s', duration: '12s', size: '2rem' },
    { emoji: '🍕', left: '15%', delay: '2s', duration: '15s', size: '1.5rem' },
    { emoji: '🥧', left: '25%', delay: '4s', duration: '10s', size: '2.5rem' },
    { emoji: '🥐', left: '35%', delay: '1s', duration: '14s', size: '1.8rem' },
    { emoji: '🧀', left: '45%', delay: '5s', duration: '11s', size: '2.2rem' },
    { emoji: '🌯', left: '55%', delay: '3s', duration: '13s', size: '1.6rem' },
    { emoji: '🍕', left: '65%', delay: '6s', duration: '9s', size: '2.4rem' },
    { emoji: '🥧', left: '75%', delay: '2s', duration: '16s', size: '1.8rem' },
    { emoji: '🥐', left: '85%', delay: '4s', duration: '12s', size: '2.1rem' },
    { emoji: '🧀', left: '95%', delay: '0.5s', duration: '14s', size: '1.7rem' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 relative overflow-x-hidden app-container flex flex-col justify-between" dir="rtl">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;750;900&display=swap');
        
        .app-container, .app-container * {
          font-family: 'Cairo', sans-serif !important;
        }

        @keyframes fall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(110vh) rotate(360deg);
            opacity: 0;
          }
        }
        .falling-emoji {
          position: fixed;
          top: -10%;
          z-index: 0;
          pointer-events: none;
          animation: fall linear infinite;
        }
      `}</style>

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {fallingEmojis.map((item, index) => (
          <span
            key={index}
            className="falling-emoji"
            style={{
              left: item.left,
              animationDelay: item.delay,
              animationDuration: item.duration,
              fontSize: item.size,
            }}
          >
            {item.emoji}
          </span>
        ))}
      </div>

      <div className="max-w-3xl mx-auto w-full relative z-10 flex-grow">
        <h1 className="text-3xl font-black text-center text-indigo-600 mb-8">نظام الطلبات الذكي 🌯</h1>

        <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-indigo-500 mb-6">
          <input
            className="w-full p-3 mb-4 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none font-bold text-lg"
            placeholder="اسم الشخص (مثلاً: علي)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex gap-2 items-center animate-in fade-in duration-300">
                <input
                  className="flex-1 p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
                  placeholder="نوع الفطيرة"
                  value={item.type}
                  onChange={(e) => updateItemField(index, 'type', e.target.value)}
                />
                <input
                  type="number"
                  className="w-24 p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
                  value={item.count}
                  onChange={(e) => updateItemField(index, 'count', e.target.value)}
                  min="1"
                />
                {items.length > 1 && (
                  <button
                    onClick={() => setItems(items.filter((_, i) => i !== index))}
                    className="text-red-400 hover:text-red-600 px-2"
                  >✕</button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={addNewItemRow}
              className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all"
            >
              + إضافة صنف آخر لنفس الشخص
            </button>
            <button
              onClick={handleAction}
              className={`flex-2 py-2 rounded-xl font-bold text-white transition-all ${editingId ? 'bg-green-500 hover:bg-green-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {editingId ? 'تحديث الطلب الكامل ✓' : 'حفظ الطلب النهائي ✓'}
            </button>
          </div>
        </div>

        {orders.length > 0 && (
          <div className="bg-indigo-900 text-white p-6 rounded-2xl mb-6 shadow-lg">
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
              <h2 className="text-sm uppercase tracking-widest opacity-70">إجمالي الكميات للمحل:</h2>
              <button
                onClick={clearAllOrders}
                className="bg-red-500 hover:bg-red-600 text-white text-xs px-4 py-1.5 rounded-full font-bold transition-all shadow-lg flex items-center gap-1"
              >
                <span>مسح الكل</span>
                <span className="text-sm">🗑️</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-4">
              {Object.entries(getTotals()).map(([type, total]) => (
                <div key={type} className="bg-white/10 px-4 py-2 rounded-lg border border-white/20">
                  <span className="font-bold">{type}:</span> <span className="text-xl font-black text-yellow-400">{total}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-gray-600">الاسم</th>
                <th className="p-4 text-gray-600">الأصناف والكميات</th>
                <th className="p-4 text-gray-600 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-gray-800">{order.name}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {order.items.map((it, idx) => (
                        <span key={idx} className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md text-sm border border-indigo-100">
                          {it.type} ({it.count})
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-center space-x-reverse space-x-2">
                    <button onClick={() => startEdit(order)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg text-sm">تعديل</button>
                    <button onClick={() => setOrders(orders.filter(o => o.id !== order.id))} className="text-red-500 hover:bg-red-50 p-2 rounded-lg text-sm">حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="mt-12 py-6 border-t border-blue-100 text-center relative z-10 w-full">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-white rounded-full shadow-md border border-blue-50">
          <span className="text-blue-600 font-black tracking-tight text-lg italic">Ali Mohammad</span>
          <span className="text-stone-400 font-medium">Developed by</span>
          <span className="text-xl animate-pulse">🚀</span>
        </div>
        <p className="text-stone-400 text-xs mt-3 opacity-70">
          © {new Date().getFullYear()} - جميع الحقوق محفوظة
        </p>
      </footer>
    </div>
  );
}

export default App;