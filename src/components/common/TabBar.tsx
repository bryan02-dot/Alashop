import React from 'react';
import {
  Home,
  LayoutGrid,
  Heart,
  ShoppingBag,
  User,
  PlusCircle,
  Shield,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { translations } from '../../utils/i18n';

export const TabBar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    cart,
    favorites,
    language,
    currentUser,
    setIsAddProductModalOpen,
  } = useShop();

  const t = translations[language];
  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const favoritesCount = favorites.length;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800/80 pb-safe transition-colors">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16 px-2">
        {/* 1. Главная */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-transform active:scale-90 ${
            activeTab === 'home'
              ? 'text-sky-600 dark:text-sky-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] tracking-tight mt-1">{t.home}</span>
        </button>

        {/* 2. Каталог */}
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-transform active:scale-90 ${
            activeTab === 'catalog'
              ? 'text-sky-600 dark:text-sky-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <LayoutGrid className={`w-5 h-5 ${activeTab === 'catalog' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] tracking-tight mt-1">{t.catalog}</span>
        </button>

        {/* Admin Quick Add FAB or Tab */}
        {currentUser.role === 'admin' ? (
          <button
            onClick={() => {
              setActiveTab('admin');
              setIsAddProductModalOpen(true);
            }}
            className="flex-1 flex flex-col items-center justify-center py-1 transition-transform active:scale-90 text-amber-600 dark:text-amber-400"
            title="Добавить товар"
          >
            <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md -mt-3 ring-4 ring-white dark:ring-slate-900">
              <PlusCircle className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 mt-0.5">
              + Товар
            </span>
          </button>
        ) : (
          /* 3. Избранное (for buyer) */
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex-1 flex flex-col items-center justify-center py-1 relative transition-transform active:scale-90 ${
              activeTab === 'favorites'
                ? 'text-sky-600 dark:text-sky-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Heart className={`w-5 h-5 ${activeTab === 'favorites' ? 'fill-sky-600 dark:fill-sky-400 stroke-none' : 'stroke-[1.8]'}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-1">{t.favorites}</span>
          </button>
        )}

        {/* 4. Корзина */}
        <button
          onClick={() => setActiveTab('cart')}
          className={`flex-1 flex flex-col items-center justify-center py-1 relative transition-transform active:scale-90 ${
            activeTab === 'cart'
              ? 'text-sky-600 dark:text-sky-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <ShoppingBag className={`w-5 h-5 ${activeTab === 'cart' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 bg-sky-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
                {cartItemsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">{t.cart}</span>
        </button>

        {/* 5. Профиль / Администратор */}
        <button
          onClick={() => setActiveTab(currentUser.role === 'admin' ? 'admin' : 'profile')}
          className={`flex-1 flex flex-col items-center justify-center py-1 relative transition-transform active:scale-90 ${
            activeTab === 'profile' || activeTab === 'admin'
              ? 'text-sky-600 dark:text-sky-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          {currentUser.role === 'admin' ? (
            <div className="relative">
              <Shield className={`w-5 h-5 ${activeTab === 'admin' ? 'stroke-[2.5] text-amber-500' : 'stroke-[1.8] text-amber-600'}`} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full"></span>
            </div>
          ) : (
            <User className={`w-5 h-5 ${activeTab === 'profile' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          )}
          <span className="text-[10px] tracking-tight mt-1">
            {currentUser.role === 'admin' ? 'Управление' : t.profile}
          </span>
        </button>
      </div>
    </div>
  );
};
