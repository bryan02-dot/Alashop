import React, { useState } from 'react';
import {
  X,
  CreditCard,
  QrCode,
  Truck,
  Building,
  MapPin,
  CheckCircle,
  Smartphone,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatTenge } from '../../utils/formatters';
import { Order } from '../../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { cart, appliedPromo, createOrder, currentUser, setActiveTab } = useShop();

  const [step, setStep] = useState<'form' | 'success'>('form');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Form State
  const [name, setName] = useState(currentUser.name || 'Нурсултан Ахметов');
  const [phone, setPhone] = useState(currentUser.phone || '+7 (701) 888-24-24');
  const [city, setCity] = useState(currentUser.city || 'Алматы');
  const [address, setAddress] = useState(
    currentUser.savedAddresses?.[0] || 'проспект Достык, д. 180, кв. 42'
  );
  const [deliveryMethod, setDeliveryMethod] = useState<'courier' | 'pickup' | 'postomat'>('courier');
  const [paymentMethod, setPaymentMethod] = useState<'kaspi' | 'card' | 'apple_pay' | 'cash'>('kaspi');

  // Card Inputs
  const [cardNumber, setCardNumber] = useState('4400 1234 5678 9012');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('789');

  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  // Recalculate totals
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountPercent) {
      discount = Math.round((subtotal * appliedPromo.discountPercent) / 100);
    } else if (appliedPromo.fixedDiscount) {
      discount = appliedPromo.fixedDiscount;
    }
  }
  const deliveryFee = subtotal >= 15000 || deliveryMethod !== 'courier' ? 0 : 1500;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const order = createOrder({
        customerName: name,
        customerPhone: phone,
        city,
        address,
        deliveryMethod,
        paymentMethod,
      });
      setCreatedOrder(order);
      setIsProcessing(false);
      setStep('success');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 overflow-hidden">
      <div className="w-full max-w-lg max-h-[92vh] bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-200">
        {/* iOS Drag Handle */}
        <div className="w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-2.5 sm:hidden" />

        {/* Header */}
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {step === 'form' ? 'Оформление заказа' : 'Заказ успешно оформлен!'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleSubmitOrder} className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
            {/* 1. Recipient Details */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                1. Данные получателя
              </label>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Имя и фамилия</span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Номер телефона</span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>
            </div>

            {/* 2. City & Address */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                2. Доставка и город
              </label>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'courier', label: 'Курьер до двери', icon: Truck },
                  { id: 'pickup', label: 'Самовывоз', icon: Building },
                  { id: 'postomat', label: 'Постамат 24/7', icon: MapPin },
                ].map((m) => {
                  const Icon = m.icon;
                  const isSelected = deliveryMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setDeliveryMethod(m.id as any)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center text-center gap-1.5 transition-all ${
                        isSelected
                          ? 'border-sky-600 bg-sky-50/70 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 ring-1 ring-sky-500 font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-sky-600" />
                      <span className="text-[11px] leading-tight">{m.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <span className="text-[10px] text-slate-400 block mb-1">Город</span>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="Алматы">Алматы</option>
                    <option value="Астана">Астана</option>
                    <option value="Шымкент">Шымкент</option>
                    <option value="Караганда">Караганда</option>
                    <option value="Актобе">Актобе</option>
                    <option value="Атырау">Атырау</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <span className="text-[10px] text-slate-400 block mb-1">
                    {deliveryMethod === 'courier' ? 'Улица, дом, квартира' : 'Адрес отделения'}
                  </span>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                3. Способ оплаты
              </label>

              <div className="grid grid-cols-2 gap-2">
                {/* Kaspi Pay */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('kaspi')}
                  className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all text-left ${
                    paymentMethod === 'kaspi'
                      ? 'border-red-500 bg-red-50/60 dark:bg-red-950/30 ring-1 ring-red-500 text-red-950 dark:text-red-200'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-red-500 text-white font-black text-xs flex items-center justify-center shrink-0">
                    K
                  </div>
                  <div>
                    <div className="font-bold text-xs">Kaspi Pay / QR</div>
                    <div className="text-[10px] text-slate-500">Рассрочка 0-0-24</div>
                  </div>
                </button>

                {/* Apple Pay */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all text-left ${
                    paymentMethod === 'apple_pay'
                      ? 'border-black dark:border-white bg-slate-100 dark:bg-slate-800 ring-1 ring-black dark:ring-white'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold text-xs flex items-center justify-center shrink-0">
                    Pay
                  </div>
                  <div>
                    <div className="font-bold text-xs">Apple Pay</div>
                    <div className="text-[10px] text-slate-500">В 1 клик с Face ID</div>
                  </div>
                </button>

                {/* Visa / Master */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all text-left ${
                    paymentMethod === 'card'
                      ? 'border-sky-600 bg-sky-50/60 dark:bg-sky-950/30 ring-1 ring-sky-500'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs">Банковская карта</div>
                    <div className="text-[10px] text-slate-500">Visa, Mastercard</div>
                  </div>
                </button>

                {/* Cash on delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all text-left ${
                    paymentMethod === 'cash'
                      ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/30 ring-1 ring-emerald-500'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    ₸
                  </div>
                  <div>
                    <div className="font-bold text-xs">При получении</div>
                    <div className="text-[10px] text-slate-500">Наличные / терминал</div>
                  </div>
                </button>
              </div>

              {/* Card Details Entry if Card selected */}
              {paymentMethod === 'card' && (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2.5">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Номер карты</span>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="0000 0000 0000 0000"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs font-semibold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-1">Срок</span>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-1">CVV</span>
                      <input
                        type="password"
                        maxLength={3}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs font-semibold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Kaspi Pay Prompt */}
              {paymentMethod === 'kaspi' && (
                <div className="p-3.5 rounded-2xl bg-red-50/70 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-center gap-3">
                  <QrCode className="w-9 h-9 text-red-600 shrink-0" />
                  <div className="text-[11px] text-slate-700 dark:text-slate-300">
                    После подтверждения откроется официальный QR-код Kaspi Pay для быстрой оплаты со смартфона.
                  </div>
                </div>
              )}
            </div>

            {/* Total breakdown */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500">К оплате с учетом доставки:</span>
                <div className="text-lg font-black text-slate-900 dark:text-white tabular-nums">
                  {formatTenge(total)}
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Защищенный шлюз</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-xl shadow-sky-600/30 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Обработка платежа...</span>
              ) : (
                <>
                  <span>Подтвердить и оплатить {formatTenge(total)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Success Screen */
          <div className="p-6 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle className="w-10 h-10 stroke-[2]" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Заказ #{createdOrder?.orderNumber} оформлен!
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                Мы уже начали собирать ваш заказ на складе Alashop. Курьер свяжется с вами по номеру{' '}
                <strong className="text-slate-900 dark:text-white">{phone}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Сумма заказа:</span>
                <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                  {formatTenge(createdOrder?.total || total)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Способ оплаты:</span>
                <span className="font-bold text-slate-900 dark:text-white uppercase">
                  {createdOrder?.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Адрес доставки:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {city}, {address}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setActiveTab('profile');
                }}
                className="w-full py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20"
              >
                Отследить в «Мои заказы»
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setActiveTab('home');
                }}
                className="w-full py-2.5 rounded-2xl text-slate-600 dark:text-slate-400 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Вернуться на главную
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
