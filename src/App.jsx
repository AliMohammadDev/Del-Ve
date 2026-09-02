import { useState, useEffect } from 'react';

function App() {
  // 1. استرجاع البيانات مباشرة عند البداية لتجنب مسح الـ localStorage عند الـ Refresh
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('fataer-pro');
    return saved ? JSON.parse(saved) : [];
  });

  // استرجاع أسماء الأشخاص المحفوظة مسبقاً للاقتراحات
  const [savedNames, setSavedNames] = useState(() => {
    const saved = localStorage.getItem('fataer-names');
    return saved ? JSON.parse(saved) : [];
  });

  const [name, setName] = useState('');
  const [items, setItems] = useState([{ type: '', count: 1 }]);
  const [editingId, setEditingId] = useState(null);

  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('fataer-theme') === 'dark';
  });

  // 2. الحفظ التلقائي عند تغير الطلبات
  useEffect(() => {
    localStorage.setItem('fataer-pro', JSON.stringify(orders));
  }, [orders]);

  // الحفظ التلقائي لأسماء الأشخاص الفريدة
  useEffect(() => {
    localStorage.setItem('fataer-names', JSON.stringify(savedNames));
  }, [savedNames]);

  useEffect(() => {
    localStorage.setItem('fataer-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const addNewItemRow = () => {
    setItems([...items, { type: '', count: 1 }]);
  };

  const updateItemField = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleAction = () => {
    if (!name.trim() || items.some(item => !item.type || item.count < 1)) {
      return alert("يرجى كتابة اسم الشخص وتعبئة جميع الأصناف");
    }

    const trimmedName = name.trim();

    // إضافة الاسم لقائمة الأسماء المحفوظة إذا لم يكن موجوداً من قبل
    if (!savedNames.includes(trimmedName)) {
      setSavedNames([...savedNames, trimmedName]);
    }

    if (editingId) {
      setOrders(orders.map(o => o.id === editingId ? { ...o, name: trimmedName, items: [...items] } : o));
      setEditingId(null);
    } else {
      const newOrder = { id: Date.now(), name: trimmedName, items: [...items] };
      setOrders([...orders, newOrder]);
    }

    setName('');
    setItems([{ type: '', count: 1 }]);
  };

  const startEdit = (order) => {
    setEditingId(order.id);
    setName(order.name);
    // نسخ الأصناف لتجنب الـ Reference Sharing
    setItems(order.items.map(item => ({ ...item })));
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

  const clearAllOrders = () => {
    const confirmClear = window.confirm("⚠️ هل أنت متأكد من حذف جميع الطلبات؟ سيتم مسح القائمة بالكامل!");
    if (confirmClear) {
      setOrders([]);
    }
  };

  // وظيفة تصدير وطباعة النتائج كـ PDF
  const exportToPDF = () => {
    window.print();
  };

  const copyFinalTotals = async () => {
    const totals = getTotals();

    const text = Object.entries(totals)
      .map(([type, total]) => `${type}: ${total}`)
      .join('\n');

    try {
      await navigator.clipboard.writeText(text);
      alert('تم نسخ الإحصائيات النهائية بنجاح ✅');
    } catch (error) {
      alert('تعذر نسخ الإحصائيات');
    }
  };

  // وظيفة مشاركة الإحصائيات النهائية فقط عبر واتساب
  const shareOnWhatsApp = () => {
    const totals = getTotals();

    // بناء نص الرسالة للإحصائية النهائية فقط
    let message = "مرحباً، هذه هي إحصائية الطلبات النهائية : 🌯\n\n";

    Object.entries(totals).forEach(([type, total]) => {
      message += `${type}: *${total}*\n`;
    });

    message += "\nشكراً لكم! 🚀";

    // ترميز النص ليتوافق مع رابط الـ WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

    // فتح رابط الواتساب في نافذة جديدة
    window.open(whatsappUrl, '_blank');
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
    <div className={`min-h-screen p-3 sm:p-4 md:p-8 relative overflow-x-hidden app-container flex flex-col justify-between transition-colors duration-300 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`} dir="rtl">

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
            opacity: ${darkMode ? '0.15' : '0.3'};
          }
          90% {
            opacity: ${darkMode ? '0.15' : '0.3'};
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

        /* تخصيص الطباعة وتصدير الـ PDF */
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .print-container {
            box-shadow: none !important;
            border: none !important;
            background: white !important;
            color: black !important;
          }
        }
      `}</style>

      {/* زر التبديل (مخفي وقت الطباعة) */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 no-print">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 sm:p-2.5 rounded-2xl shadow-md cursor-pointer border transition-all flex items-center justify-center text-lg sm:text-xl ${darkMode
            ? 'bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700'
            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          title="تبديل الوضع"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 no-print">
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

      <div className="max-w-3xl mx-auto w-full relative z-10 grow pt-2 sm:pt-0">
        <h1 className={`text-2xl sm:text-3xl font-black text-center mb-6 sm:mb-8 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
          نظام الطلبات الذكي 🌯
        </h1>

        {/* نموذج الإدخال (يُخفى وقت الطباعة) */}
        <div className={`p-4 sm:p-6 rounded-2xl shadow-md border-t-4 border-indigo-500 mb-6 transition-colors duration-300 no-print ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'}`}>

          {/* حقل ادخال الاسم مع دعم الـ datalist للاقتراحات */}
          <input
            list="saved-names-list"
            className={`w-full p-3 mb-4 border rounded-xl outline-none font-bold text-base sm:text-lg transition-colors ${darkMode
              ? 'bg-slate-900 border-slate-700 text-white focus:ring-2 focus:ring-indigo-500'
              : 'bg-white border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-400'
              }`}
            placeholder="اسم الشخص (مثلاً: علي)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <datalist id="saved-names-list">
            {savedNames.map((savedName, index) => (
              <option key={index} value={savedName} />
            ))}
          </datalist>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center animate-in fade-in duration-300">
                <input
                  className={`flex-1 p-3 border rounded-xl outline-none text-sm sm:text-base transition-colors ${darkMode
                    ? 'bg-slate-900 border-slate-700 text-white focus:ring-2 focus:ring-indigo-500'
                    : 'bg-white border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-400'
                    }`}
                  placeholder="نوع الفطيرة"
                  value={item.type}
                  onChange={(e) => updateItemField(index, 'type', e.target.value)}
                />
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    className={`w-full sm:w-24 p-3 border rounded-xl outline-none text-sm sm:text-base transition-colors ${darkMode
                      ? 'bg-slate-900 border-slate-700 text-white focus:ring-2 focus:ring-indigo-500'
                      : 'bg-white border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-400'
                      }`}
                    value={item.count}
                    onChange={(e) => updateItemField(index, 'count', e.target.value)}
                    min="1"
                  />
                  {items.length > 1 && (
                    <button
                      onClick={() => setItems(items.filter((_, i) => i !== index))}
                      className="text-red-400 cursor-pointer hover:text-red-600 px-3 py-2 text-lg sm:text-base"
                    >✕</button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <button
              onClick={addNewItemRow}
              className={`w-full sm:flex-1 py-3 sm:py-2 rounded-xl cursor-pointer font-bold text-sm sm:text-base transition-all ${darkMode
                ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              + إضافة صنف آخر لنفس الشخص
            </button>
            <button
              onClick={handleAction}
              className={`w-full sm:flex-2 py-3 sm:py-2 cursor-pointer rounded-xl font-bold text-white text-sm sm:text-base transition-all ${editingId ? 'bg-green-500 hover:bg-green-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {editingId ? 'تحديث الطلب الكامل ✓' : 'حفظ الطلب النهائي ✓'}
            </button>
          </div>
        </div>

        {/* قسم إجمالي الكميات (يظهر في الطباعة والـ PDF) */}
        {orders.length > 0 && (
          <div className={`p-4 sm:p-6 rounded-2xl mb-6 shadow-lg transition-colors duration-300 print-container ${darkMode ? 'bg-indigo-950 border border-indigo-900 text-white' : 'bg-indigo-900 text-white'}`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 border-b border-white/10 pb-3">
              <h2 className="text-xs sm:text-sm uppercase tracking-widest opacity-70">إجمالي الكميات للمحل:</h2>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
                {/* زر مشاركة واتساب للإحصائية فقط */}
                <button
                  onClick={shareOnWhatsApp}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs px-4 py-2 rounded-full font-bold transition-all shadow-lg flex items-center justify-center gap-1 cursor-pointer flex-1 sm:flex-none no-print"
                  title="مشاركة الإحصائية عبر واتساب"
                >
                  <span>واتساب</span>
                  <span className="text-sm">💬</span>
                </button>

                {/* زر تصدير PDF / طباعة */}
                <button
                  onClick={exportToPDF}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs px-4 py-2 rounded-full font-bold transition-all shadow-lg flex items-center justify-center gap-1 cursor-pointer flex-1 sm:flex-none"
                  title="تصدير النتائج إلى PDF"
                >
                  <span>تصدير PDF</span>
                  <span className="text-sm">📄</span>
                </button>

                <button
                  onClick={copyFinalTotals}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded-full font-bold transition-all shadow-lg flex items-center justify-center gap-1 cursor-pointer flex-1 sm:flex-none no-print"
                  title="نسخ الإحصائيات النهائية"
                >
                  <span>نسخ الإحصائيات</span>
                  <span className="text-sm">📋</span>
                </button>

                {/* زر مسح الكل */}
                <button
                  onClick={clearAllOrders}
                  className="bg-red-500 hover:bg-red-600 text-white text-xs px-4 py-2 rounded-full font-bold transition-all shadow-lg flex items-center justify-center gap-1 cursor-pointer no-print flex-1 sm:flex-none"
                >
                  <span>مسح الكل</span>
                  <span className="text-sm">🗑️</span>
                </button>
              </div>
            </div>
            <div className="flex flex-gap-2 sm:gap-4 flex-wrap">
              {Object.entries(getTotals()).map(([type, total]) => (
                <div key={type} className="bg-white/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-white/25 text-sm sm:text-base">
                  <span className="font-bold">{type}:</span> <span className="text-lg sm:text-xl font-black text-yellow-400">{total}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* جدول الطلبات */}
        <div className={`rounded-2xl shadow-sm border overflow-hidden transition-colors duration-300 print-container ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-right min-w-[300px]">
              <thead className={`border-b ${darkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-gray-50 border-gray-100'}`}>
                <tr>
                  <th className={`p-3 sm:p-4 text-sm sm:text-base ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>الاسم</th>
                  <th className={`p-3 sm:p-4 text-sm sm:text-base ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>الأصناف والكميات</th>
                  <th className={`p-3 sm:p-4 text-center text-sm sm:text-base ${darkMode ? 'text-slate-300' : 'text-gray-600'} no-print`}>إجراءات</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-slate-700' : 'divide-gray-100'}`}>
                {orders.map(order => (
                  <tr key={order.id} className={`transition-colors ${darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'}`}>
                    <td className={`p-3 sm:p-4 font-bold text-sm sm:text-base ${darkMode ? 'text-slate-100' : 'text-gray-800'}`}>{order.name}</td>
                    <td className="p-3 sm:p-4">
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {order.items.map((it, idx) => (
                          <span key={idx} className={`px-2 py-1 rounded-md text-xs sm:text-sm border ${darkMode
                            ? 'bg-indigo-950/80 text-indigo-300 border-indigo-800/50'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                            }`}>
                            {it.type} ({it.count})
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 sm:p-4 text-center space-x-reverse space-x-1 sm:space-x-2 no-print">
                      <button onClick={() => startEdit(order)} className={`px-2 py-1.5 rounded-lg text-xs sm:text-sm cursor-pointer ${darkMode ? 'text-blue-400 hover:bg-slate-700' : 'text-blue-500 hover:bg-blue-50'}`}>تعديل</button>
                      <button onClick={() => setOrders(orders.filter(o => o.id !== order.id))} className={`px-2 py-1.5 rounded-lg text-xs sm:text-sm cursor-pointer ${darkMode ? 'text-red-400 hover:bg-slate-700' : 'text-red-500 hover:bg-red-50'}`}>حذف</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <footer className={`mt-10 sm:mt-12 py-6 border-t text-center relative z-10 w-full transition-colors duration-300 no-print ${darkMode ? 'border-slate-800' : 'border-blue-100'}`}>
        <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full shadow-md border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-blue-50'
          }`}>
          <a
            href="https://alimohammaddev.github.io/my-portfolio/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 font-black tracking-tight text-base sm:text-lg italic hover:underline"
          >
            Ali Mohammad
          </a>
          <span className="text-stone-400 font-medium text-sm sm:text-base">Developed by</span>
          <span className="text-lg sm:text-xl animate-pulse">🚀</span>
        </div>
        <p className="text-stone-400 text-xs mt-3 opacity-70">
          © {new Date().getFullYear()} - جميع الحقوق محفوظة
        </p>
      </footer>
    </div>
  );
}

export default App;