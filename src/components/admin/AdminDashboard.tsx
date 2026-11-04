import React, { useState, useMemo } from 'react';
import {
  Package,
  PlusCircle,
  Search,
  SlidersHorizontal,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ShoppingBag,
  TrendingUp,
  Tag,
  CheckCircle,
  Clock,
  Truck,
  RotateCcw,
  Layers,
  ArrowUpRight,
  Shield,
  DollarSign,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Product, OrderStatus } from '../../types';
import { formatTenge, formatDate, getOrderStatusLabel } from '../../utils/formatters';
import { AddEditProductModal } from './AddEditProductModal';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    categories,
    orders,
    deleteProduct,
    toggleProductStatus,
    updateProduct,
    updateOrderStatus,
    addCategory,
    promoCodes,
    isAddProductModalOpen,
    setIsAddProductModalOpen,
    selectedProductForEdit,
    setSelectedProductForEdit,
    switchRole,
  } = useShop();

  const [adminTab, setAdminTab] = useState<'products' | 'orders' | 'categories' | 'stats'>('products');
  const [productStatusFilter, setProductStatusFilter] = useState<'all' | 'published' | 'draft' | 'hidden' | 'out_of_stock'>('all');
  const [adminSearch, setAdminSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // New Category Form state
  const [newCatNameRu, setNewCatNameRu] = useState('');
  const [newCatNameKz, setNewCatNameKz] = useState('');
  const [newCatSubcats, setNewCatSubcats] = useState('');

  // Quick stock/price inline editing
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [editingStockVal, setEditingStockVal] = useState<number>(0);

  // Metrics calculation
  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((acc, o) => acc + o.total, 0);
  }, [orders]);

  const activeProductsCount = products.filter((p) => p.status === 'published' && p.stock > 0).length;
  const outOfStockCount = products.filter((p) => p.stock <= 0).length;
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  // Filtered Products for "Мои товары"
  const filteredAdminProducts = useMemo(() => {
    return products.filter((p) => {
      // Status filter
      if (productStatusFilter === 'published' && (p.status !== 'published' || p.stock <= 0)) {
        return false;
      }
      if (productStatusFilter === 'draft' && p.status !== 'draft') {
        return false;
      }
      if (productStatusFilter === 'hidden' && p.status !== 'hidden') {
        return false;
      }
      if (productStatusFilter === 'out_of_stock' && p.stock > 0) {
        return false;
      }

      // Category filter
      if (categoryFilter !== 'all' && p.categoryId !== categoryFilter) {
        return false;
      }

      // Search query
      if (adminSearch.trim()) {
        const q = adminSearch.toLowerCase();
        const inTitle = p.title.toLowerCase().includes(q);
        const inBrand = p.brand.toLowerCase().includes(q);
        const inSku = p.sku.toLowerCase().includes(q);
        if (!inTitle && !inBrand && !inSku) return false;
      }

      return true;
    });
  }, [products, productStatusFilter, categoryFilter, adminSearch]);

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatNameRu.trim()) return;

    const subcats = newCatSubcats
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    addCategory({
      nameRu: newCatNameRu.trim(),
      nameKz: newCatNameKz.trim() || newCatNameRu.trim(),
      iconName: 'Package',
      subcategories: subcats.length > 0 ? subcats : ['Общее'],
    });

    setNewCatNameRu('');
    setNewCatNameKz('');
    setNewCatSubcats('');
  };

  const saveStockInline = (productId: string) => {
    updateProduct(productId, { stock: editingStockVal });
    setEditingStockId(null);
  };

  return (
    <div className="px-4 pb-28 pt-2 space-y-5 max-w-4xl mx-auto">
      {/* 1. Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-3xl bg-gradient-to-r from-amber-500/15 via-sky-500/10 to-transparent border border-amber-300/60 dark:border-amber-900/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-amber-500 text-white font-bold text-xs">
              <Shield className="w-3.5 h-3.5" />
            </span>
            <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              Панель владельца Alashop
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Управление витриной, остатками на складе, заказами и публикацией товаров
          </p>
        </div>

        {/* Primary CTA: "+ Добавить товар" */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => switchRole('buyer')}
            className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Витрина
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedProductForEdit(null);
              setIsAddProductModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/25 flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>+ Добавить товар</span>
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Выручка
          </span>
          <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white tabular-nums mt-0.5">
            {formatTenge(totalRevenue)}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">
            <ArrowUpRight className="w-3 h-3" />
            Всего заказов: {orders.length}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Товары в продаже
          </span>
          <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white tabular-nums mt-0.5">
            {activeProductsCount} шт.
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">
            Всего в каталоге: {products.length}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Закончились
          </span>
          <div className="text-base sm:text-lg font-black text-rose-500 tabular-nums mt-0.5">
            {outOfStockCount} шт.
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            Требуют пополнения
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Средний чек
          </span>
          <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white tabular-nums mt-0.5">
            {formatTenge(avgOrderValue)}
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">
            По всем заказам
          </span>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs overflow-x-auto no-scrollbar">
        {[
          { id: 'products', label: `Мои товары (${products.length})` },
          { id: 'orders', label: `Заказы покупателей (${orders.length})` },
          { id: 'categories', label: `Категории (${categories.length})` },
          { id: 'stats', label: 'Статистика' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setAdminTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              adminTab === tab.id
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Мои товары (Products Management) */}
      {adminTab === 'products' && (
        <div className="space-y-4">
          {/* Sub-status filters */}
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {[
                { id: 'all', label: 'Все' },
                { id: 'published', label: 'Опубликованные' },
                { id: 'draft', label: 'Черновики' },
                { id: 'hidden', label: 'Скрытые' },
                { id: 'out_of_stock', label: 'Нет в наличии' },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setProductStatusFilter(st.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    productStatusFilter === st.id
                      ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Category filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs font-semibold"
            >
              <option value="all">Все категории</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameRu}
                </option>
              ))}
            </select>
          </div>

          {/* Search bar inside admin products */}
          <div className="relative flex items-center rounded-2xl bg-slate-100 dark:bg-slate-800 px-3 py-2">
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Поиск по названию, бренду или артикулу..."
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>

          {/* Products Table / List */}
          <div className="space-y-2.5">
            {filteredAdminProducts.length > 0 ? (
              filteredAdminProducts.map((p) => {
                const img = p.images[p.primaryImageIndex || 0] || p.images[0];
                return (
                  <div
                    key={p.id}
                    className="p-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 shrink-0">
                        <img
                          src={img}
                          alt={p.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400">
                            {p.brand}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400">
                            {p.sku}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1">
                          {p.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span>{p.subcategory}</span>
                          <span>·</span>
                          <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                            {formatTenge(p.price)}
                          </span>
                          {p.discountPercent ? (
                            <span className="text-rose-500 font-bold">
                              -{p.discountPercent}%
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    {/* Stock & Status Controls */}
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
                      {/* Stock Quick Editor */}
                      <div className="flex items-center gap-1.5">
                        {editingStockId === p.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min={0}
                              value={editingStockVal}
                              onChange={(e) => setEditingStockVal(Number(e.target.value))}
                              className="w-16 px-1.5 py-1 text-xs rounded-lg border border-sky-500 font-bold tabular-nums"
                            />
                            <button
                              onClick={() => saveStockInline(p.id)}
                              className="p-1 text-emerald-600 font-bold text-xs"
                            >
                              OK
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingStockId(p.id);
                              setEditingStockVal(p.stock);
                            }}
                            className={`px-2 py-1 rounded-lg text-[11px] font-bold tabular-nums border ${
                              p.stock > 0
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 border-emerald-200'
                                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 border-rose-200'
                            }`}
                            title="Нажмите, чтобы изменить остаток"
                          >
                            {p.stock > 0 ? `${p.stock} шт.` : '0 шт.'}
                          </button>
                        )}
                      </div>

                      {/* Status Toggle Badge */}
                      <button
                        onClick={() =>
                          toggleProductStatus(
                            p.id,
                            p.status === 'published' ? 'hidden' : 'published'
                          )
                        }
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                          p.status === 'published'
                            ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                            : p.status === 'draft'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                        }`}
                        title="Изменить статус публикации"
                      >
                        {p.status === 'published'
                          ? 'Опубликован'
                          : p.status === 'draft'
                          ? 'Черновик'
                          : 'Скрыт'}
                      </button>

                      {/* Action buttons: Edit & Delete */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setSelectedProductForEdit(p);
                            setIsAddProductModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                          title="Редактировать товар"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Удалить товар «${p.title}»?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                          title="Удалить товар"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400">
                Товары не найдены. Нажмите «+ Добавить товар», чтобы создать первую позицию.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Заказы (Orders Management & Status Updates) */}
      {adminTab === 'orders' && (
        <div className="space-y-3">
          {orders.length > 0 ? (
            orders.map((order) => {
              const statusInfo = getOrderStatusLabel(order.status);
              return (
                <div
                  key={order.id}
                  className="p-4 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                          Заказ #{order.orderNumber}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${statusInfo.color}`}>
                          {statusInfo.text}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {formatDate(order.date)} · Оплата: {order.paymentMethod.toUpperCase()} (
                        {order.paymentStatus === 'paid' ? 'Оплачен' : 'При получении'})
                      </span>
                    </div>

                    {/* Status Changer Trigger */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500 font-semibold">Сменить статус:</span>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-xs"
                      >
                        <option value="created">Оформлен</option>
                        <option value="processing">В сборке</option>
                        <option value="in_transit">В пути к клиенту</option>
                        <option value="delivered">Доставлен</option>
                        <option value="cancelled">Отменен</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl">
                    <div>
                      <span className="text-slate-400">Покупатель:</span>{' '}
                      <span className="font-bold text-slate-900 dark:text-white">
                        {order.customerName} ({order.customerPhone})
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Адрес:</span>{' '}
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {order.city}, {order.address} ({order.deliveryMethod})
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-1.5">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="text-slate-700 dark:text-slate-300">
                          {it.title} × {it.quantity} шт.
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                          {formatTenge(it.price * it.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800 font-bold">
                    <span>Итоговая сумма:</span>
                    <span className="text-sm font-extrabold text-sky-600 dark:text-sky-400 tabular-nums">
                      {formatTenge(order.total)}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
              Заказов пока нет. Оформите тестовый заказ на витрине!
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Категории (Add New Category Form) */}
      {adminTab === 'categories' && (
        <div className="space-y-4">
          <form
            onSubmit={handleCreateCategory}
            className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 text-xs"
          >
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Добавить новую категорию в Alashop
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Название (Русский) *</span>
                <input
                  type="text"
                  required
                  placeholder="Например: Зоотовары"
                  value={newCatNameRu}
                  onChange={(e) => setNewCatNameRu(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Название (Қазақша)</span>
                <input
                  type="text"
                  placeholder="Например: Жануарлар тауарлары"
                  value={newCatNameKz}
                  onChange={(e) => setNewCatNameKz(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold"
                />
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block mb-1">
                Подкатегории (через запятую)
              </span>
              <input
                type="text"
                placeholder="Корма, Аксессуары, Игрушки, Уход"
                value={newCatSubcats}
                onChange={(e) => setNewCatSubcats(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs"
            >
              Создать категорию
            </button>
          </form>

          {/* Existing Categories List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map((c) => (
              <div
                key={c.id}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs"
              >
                <div className="font-bold text-slate-900 dark:text-white">{c.nameRu}</div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Подкатегории: {c.subcategories.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Статистика (Analytics) */}
      {adminTab === 'stats' && (
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4 text-xs">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Статистика продаж Alashop
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900">
              <span className="text-slate-500">Успешных заказов:</span>
              <div className="text-lg font-black text-sky-600">
                {orders.filter((o) => o.status === 'delivered').length}
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900">
              <span className="text-slate-500">Заказов в доставке:</span>
              <div className="text-lg font-black text-emerald-600">
                {orders.filter((o) => o.status === 'in_transit' || o.status === 'processing').length}
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-2">Активные промокоды Alashop:</h4>
            <div className="space-y-1.5">
              {promoCodes.map((p) => (
                <div
                  key={p.code}
                  className="flex justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                >
                  <span className="font-mono font-bold text-sky-600">{p.code}</span>
                  <span className="text-slate-500">{p.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isAddProductModalOpen && (
        <AddEditProductModal
          isOpen={isAddProductModalOpen}
          onClose={() => {
            setIsAddProductModalOpen(false);
            setSelectedProductForEdit(null);
          }}
          productToEdit={selectedProductForEdit}
        />
      )}
    </div>
  );
};
