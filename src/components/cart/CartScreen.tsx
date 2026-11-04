import React, { useState } from 'react';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Tag,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  X,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatTenge } from '../../utils/formatters';
import { translations } from '../../utils/i18n';
import { CheckoutModal } from '../checkout/CheckoutModal';

export const CartScreen: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    language,
    setActiveTab,
    setSelectedProduct,
  } = useShop();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const t = translations[language];

  // Pricing calculations
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountPercent) {
      discountAmount = Math.round((subtotal * appliedPromo.discountPercent) / 100);
    } else if (appliedPromo.fixedDiscount) {
      discountAmount = appliedPromo.fixedDiscount;
    }
  }

  const deliveryFee = subtotal >= 15000 || subtotal === 0 ? 0 : 1500;
  const total = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    const res = applyPromoCode(promoInput.trim());
    if (res.success) {
      setPromoMessage({ text: res.message, isError: false });
      setPromoInput('');
    } else {
      setPromoMessage({ text: res.message, isError: true });
    }
  };

  if (cart.length === 0) {
    return (
      <div className="px-4 py-16 text-center max-w-sm mx-auto">
        <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-sky-50 dark:bg-sky-950/60 flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-inner">
          <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
          {t.emptyCart}
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          В вашей корзине пока нет товаров. Выберите лучшее из электроники, одежды или товаров для дома!
        </p>
        <button
          onClick={() => setActiveTab('catalog')}
          className="w-full py-3 px-4 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-lg shadow-sky-600/25 flex items-center justify-center gap-2 transition-all active:scale-98"
        >
          <span>Перейти к покупкам</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 pb-28 pt-2 space-y-4 max-w-2xl mx-auto">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>{t.cart}</span>
          <span className="text-xs font-normal text-slate-400">
            ({cart.reduce((a, b) => a + b.quantity, 0)} шт.)
          </span>
        </h1>
        <button
          onClick={clearCart}
          className="text-xs text-rose-500 hover:text-rose-600 font-semibold"
        >
          Очистить корзину
        </button>
      </div>

      {/* Cart Items List */}
      <div className="space-y-3">
        {cart.map((item) => {
          const itemImg =
            item.product.images[item.product.primaryImageIndex || 0] || item.product.images[0];

          return (
            <div
              key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
              className="p-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-800 shadow-xs flex gap-3 items-center"
            >
              {/* Product Thumbnail */}
              <div
                onClick={() => setSelectedProduct(item.product)}
                className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 shrink-0 cursor-pointer"
              >
                <img
                  src={itemImg}
                  alt={item.product.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {item.product.brand}
                </div>
                <h3
                  onClick={() => setSelectedProduct(item.product)}
                  className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 cursor-pointer hover:text-sky-600"
                >
                  {item.product.title}
                </h3>

                {/* Selected variant specs */}
                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {item.selectedColor && <span>{item.selectedColor}</span>}
                  {item.selectedColor && item.selectedSize && <span>·</span>}
                  {item.selectedSize && <span>{item.selectedSize}</span>}
                </div>

                {/* Price */}
                <div className="text-sm font-bold text-slate-900 dark:text-white tabular-nums mt-1">
                  {formatTenge(item.product.price * item.quantity)}
                </div>
              </div>

              {/* Quantity Stepper & Delete */}
              <div className="flex flex-col items-end justify-between h-full gap-2">
                <button
                  type="button"
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-slate-400 hover:text-rose-500 p-1 rounded-full transition-colors"
                  title="Удалить"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                  <button
                    type="button"
                    onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                    className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="px-2 text-xs font-bold tabular-nums text-slate-900 dark:text-white">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                    className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold disabled:opacity-30"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Promo Code Section */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-800 space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
          <Tag className="w-3.5 h-3.5 text-sky-600" />
          <span>Промокод на скидку</span>
        </label>

        {appliedPromo ? (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="font-bold text-emerald-900 dark:text-emerald-300">
                  {appliedPromo.code}
                </span>
                <span className="text-emerald-700 dark:text-emerald-400 ml-1">
                  ({appliedPromo.description})
                </span>
              </div>
            </div>
            <button
              onClick={removePromoCode}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleApplyPromo} className="flex gap-2">
            <input
              type="text"
              placeholder="Введите промокод (например, ALASHOP10)"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 uppercase focus:outline-none focus:ring-1 focus:ring-sky-500 font-semibold"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              {t.apply}
            </button>
          </form>
        )}

        {promoMessage && (
          <p
            className={`text-[11px] font-medium ${
              promoMessage.isError ? 'text-rose-500' : 'text-emerald-600'
            }`}
          >
            {promoMessage.text}
          </p>
        )}

        <div className="text-[10px] text-slate-400 flex items-center gap-2">
          <span>Попробуйте:</span>
          <button
            type="button"
            onClick={() => setPromoInput('ALASHOP10')}
            className="underline hover:text-sky-600 font-mono"
          >
            ALASHOP10 (-10%)
          </button>
          <button
            type="button"
            onClick={() => setPromoInput('KASPI2026')}
            className="underline hover:text-sky-600 font-mono"
          >
            KASPI2026 (-5 000 ₸)
          </button>
        </div>
      </div>

      {/* Price Summary Breakdown */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>{t.subtotal}</span>
          <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
            {formatTenge(subtotal)}
          </span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-rose-500 font-medium">
            <span>{t.discount}</span>
            <span className="tabular-nums">-{formatTenge(discountAmount)}</span>
          </div>
        )}

        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>{t.delivery}</span>
          <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
            {deliveryFee === 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                Бесплатно
              </span>
            ) : (
              formatTenge(deliveryFee)
            )}
          </span>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline">
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {t.orderTotal}
          </span>
          <span className="text-xl font-extrabold text-sky-600 dark:text-sky-400 tabular-nums">
            {formatTenge(total)}
          </span>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        type="button"
        onClick={() => setIsCheckoutOpen(true)}
        className="w-full py-3.5 px-4 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-xl shadow-sky-600/30 flex items-center justify-center gap-2 transition-all active:scale-98"
      >
        <span>{t.checkout}</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* Checkout Modal presentation */}
      {isCheckoutOpen && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
        />
      )}
    </div>
  );
};
