import React, { useState } from 'react';
import {
  Search,
  Bell,
  Moon,
  Sun,
  Smartphone,
  Globe,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { translations } from '../../utils/i18n';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    theme,
    setTheme,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    deviceViewMode,
    setDeviceViewMode,
    currentUser,
    orders,
    switchRole,
  } = useShop();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const t = translations[language];

  const pendingOrdersCount = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* iOS Status Bar Simulation (for iPhone view) */}
      <div className="flex items-center justify-between px-5 pt-2 pb-1 text-[13px] font-semibold text-slate-800 dark:text-slate-200">
        <span>09:41</span>
        {/* Dynamic Island Capsule */}
        <div className="flex items-center gap-2 px-3 py-1 bg-black text-white rounded-full text-[11px] shadow-sm tracking-wide">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="font-medium">Alashop</span>
          <span className="text-slate-400">· 5G</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
          <span>100%</span>
          <div className="w-5 h-2.5 border border-slate-700 dark:border-slate-300 rounded-sm p-0.5 flex items-center">
            <div className="w-full h-full bg-slate-700 dark:bg-slate-300 rounded-[1px]"></div>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2 group text-left focus:outline-none"
        >
          <img
            src="/alashop-icon.svg"
            alt="Alashop"
            className="w-9 h-9 rounded-xl shadow-md transition-transform group-active:scale-95"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-sky-600 dark:text-sky-400">
                Alashop
              </span>
              {currentUser.role === 'admin' && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-500 text-white rounded-md tracking-wider uppercase">
                  Admin
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 leading-none font-medium">
              {language === 'kz' ? 'Қазақстан маркетплейсі' : 'Маркетплейс №1'}
            </p>
          </div>
        </button>

        {/* Quick System Controls: Lang, Theme, Device Frame, Bell */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Quick Role Badge Switcher */}
          <button
            onClick={() => switchRole(currentUser.role === 'admin' ? 'buyer' : 'admin')}
            title={currentUser.role === 'admin' ? t.switchToBuyer : t.switchToAdmin}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors ${
              currentUser.role === 'admin'
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/50'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {currentUser.role === 'admin' ? 'Владелец' : 'Админ'}
            </span>
          </button>

          {/* Language Toggle RU / KZ */}
          <button
            onClick={() => setLanguage(language === 'ru' ? 'kz' : 'ru')}
            className="px-2 py-1 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1"
            title="Тілді ауыстыру / Сменить язык"
          >
            <Globe className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>{language.toUpperCase()}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title={theme === 'light' ? t.darkMode : t.lightMode}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-slate-700" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Desktop Frame Switcher (iPhone Mockup vs Full-width) */}
          <button
            onClick={() => setDeviceViewMode(deviceViewMode === 'iphone' ? 'responsive' : 'iphone')}
            className={`p-1.5 rounded-lg transition-colors hidden md:flex items-center gap-1 text-xs font-medium ${
              deviceViewMode === 'iphone'
                ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
            }`}
            title="Переключить рамку iPhone 16 Pro"
          >
            <Smartphone className="w-4 h-4" />
          </button>

          {/* Notification Bell */}
          <button
            onClick={() => setActiveTab('profile')}
            className="relative p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={t.notifications}
          >
            <Bell className="w-4 h-4" />
            {pendingOrdersCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {pendingOrdersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Global Interactive Search Bar */}
      <div className="px-4 pb-2.5">
        <div
          className={`relative flex items-center rounded-2xl bg-slate-100 dark:bg-slate-800 transition-all ${
            isSearchFocused ? 'ring-2 ring-sky-500 shadow-sm' : ''
          }`}
        >
          <Search className="w-4 h-4 ml-3.5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (activeTab !== 'catalog' && e.target.value.trim().length > 0) {
                setActiveTab('catalog');
              }
            }}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder={t.searchPlaceholder}
            className="w-full py-2 px-2.5 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="mr-2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
