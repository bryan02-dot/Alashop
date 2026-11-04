import React, { useState } from 'react';
import {
  User,
  Package,
  MapPin,
  CreditCard,
  Shield,
  Headphones,
  Settings,
  LogOut,
  ChevronRight,
  Globe,
  Moon,
  Sun,
  Smartphone,
  ExternalLink,
  RotateCcw,
  Clock,
  CheckCircle,
  Truck,
  Building,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatTenge, formatDate, getOrderStatusLabel } from '../../utils/formatters';
import { translations } from '../../utils/i18n';
import { ChatModal } from '../support/ChatModal';

export const ProfileScreen: React.FC = () => {
  const {
    currentUser,
    orders,
    language,
    setLanguage,
    theme,
    setTheme,
    switchRole,
    resetDatabase,
    setActiveTab,
  } = useShop();

  const [activeSection, setActiveSection] = useState<'main' | 'orders' | 'addresses' | 'payments'>('main');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showIOSInstallGuide, setShowIOSInstallGuide] = useState(false);

  const t = translations[language];

  return (
    <div className="px-4 pb-28 pt-2 space-y-4 max-w-xl mx-auto">
      {/* 1. User Header Card */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-sky-100 dark:bg-slate-700 shrink-0 border-2 border-sky-500/30">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white truncate">
              {currentUser.name}
            </h2>
            <span
              className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                currentUser.role === 'admin'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
              }`}
            >
              {currentUser.role === 'admin' ? 'Владелец магазина' : 'Покупатель'}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {currentUser.phone}
          </p>
          <p className="text-[11px] text-slate-400 truncate">
            {currentUser.email}
          </p>
        </div>
      </div>

      {/* 2. Mode Switch Banner: Enter Admin / Seller Cabinet */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/60 dark:border-amber-900/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              {currentUser.role === 'admin' ? 'Панель владельца Alashop' : 'Кабинет продавца'}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {currentUser.role === 'admin'
                ? 'Управление товарами, заказами и ценами'
                : 'Переключиться в режим администратора'}
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            if (currentUser.role === 'admin') {
              setActiveTab('admin');
            } else {
              switchRole('admin');
            }
          }}
          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm whitespace-nowrap active:scale-95 transition-transform"
        >
          {currentUser.role === 'admin' ? 'Открыть' : 'Войти'}
        </button>
      </div>

      {/* 3. Orders Quick Access Card */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Package className="w-4 h-4 text-sky-600" />
            <span>{t.myOrders} ({orders.length})</span>
          </h3>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-2.5">
            {orders.slice(0, 3).map((order) => {
              const statusInfo = getOrderStatusLabel(order.status, language);
              return (
                <div
                  key={order.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">
                      Заказ #{order.orderNumber}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${statusInfo.color}`}>
                      {statusInfo.text}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {order.items.slice(0, 3).map((it, idx) => (
                      <div
                        key={idx}
                        className="w-10 h-10 rounded-lg overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0"
                      >
                        <img
                          src={it.image}
                          alt={it.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    <div className="flex-1 text-[11px] text-slate-500 line-clamp-1">
                      {order.items.map((i) => i.title).join(', ')}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-800/60 text-[11px]">
                    <span className="text-slate-400">{formatDate(order.date)}</span>
                    <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                      {formatTenge(order.total)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">У вас еще нет оформленных заказов.</p>
        )}
      </div>

      {/* 4. Menu Actions List */}
      <div className="rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden text-xs">
        {/* Support & Seller Chat */}
        <button
          onClick={() => setIsChatOpen(true)}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 flex items-center justify-center">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-slate-900 dark:text-white block">
                {t.support}
              </span>
              <span className="text-[10px] text-slate-400">
                Чат с консультантом и поддержка по заказам
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Install on iPhone PWA Guide */}
        <button
          onClick={() => setShowIOSInstallGuide(true)}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-slate-900 dark:text-white block">
                {t.installIOS}
              </span>
              <span className="text-[10px] text-slate-400">
                Добавить иконку Alashop на экран Домой
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Language Selection */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <span className="font-semibold text-slate-900 dark:text-white">
              {t.language}
            </span>
          </div>
          <div className="flex items-center bg-slate-100 dark:bg-slate-700 p-0.5 rounded-xl">
            <button
              onClick={() => setLanguage('ru')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                language === 'ru'
                  ? 'bg-white dark:bg-slate-900 text-sky-600 shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Русский
            </button>
            <button
              onClick={() => setLanguage('kz')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                language === 'kz'
                  ? 'bg-white dark:bg-slate-900 text-sky-600 shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Қазақша
            </button>
          </div>
        </div>

        {/* Theme Selection */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center">
              {theme === 'light' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </div>
            <span className="font-semibold text-slate-900 dark:text-white">
              {theme === 'light' ? t.lightMode : t.darkMode}
            </span>
          </div>
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            {theme === 'light' ? 'Включить тёмную' : 'Включить светлую'}
          </button>
        </div>

        {/* Reset Database */}
        <button
          onClick={resetDatabase}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-slate-900 dark:text-white block">
                Сбросить демонстрационные данные
              </span>
              <span className="text-[10px] text-slate-400">
                Восстановить каталог и заказы к исходному состоянию
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* Support Chat Modal */}
      {isChatOpen && <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />}

      {/* iOS Install Guide Modal */}
      {showIOSInstallGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800 animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <img src="/alashop-icon.svg" alt="Alashop" className="w-12 h-12 rounded-2xl shadow-md" />
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Alashop на iPhone
                </h3>
                <p className="text-xs text-sky-600 font-semibold">
                  Всё необходимое в одном месте!
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2.5 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  В Safari на iPhone нажмите значок <strong>«Поделиться»</strong> (квадрат со стрелкой вверх внизу экрана).
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  Прокрутите вниз и выберите <strong>«На экран Домой»</strong> (Add to Home Screen).
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  Нажмите <strong>«Добавить»</strong>. На рабочем столе появится фирменная иконка <strong>Alashop</strong>!
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowIOSInstallGuide(false)}
              className="w-full py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs"
            >
              Понятно
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
