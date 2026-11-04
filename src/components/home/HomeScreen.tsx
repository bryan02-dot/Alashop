import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Flame,
  Clock,
  ArrowRight,
  TrendingUp,
  Tag,
  ThumbsUp,
  Zap,
  CheckCircle,
  X,
  Smartphone,
  Tv,
  Shirt,
  Home,
  Dumbbell,
  Car,
  Baby,
  Apple,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from '../product/ProductCard';
import { translations } from '../../utils/i18n';

export const HomeScreen: React.FC = () => {
  const {
    banners,
    products,
    categories,
    language,
    setSelectedCategory,
    setActiveTab,
    setSelectedProduct,
  } = useShop();

  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [showWelcomeCard, setShowWelcomeCard] = useState(() => {
    return !localStorage.getItem('alashop_welcome_dismissed');
  });

  const t = translations[language];

  // Auto rotate banners
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const dismissWelcome = () => {
    setShowWelcomeCard(false);
    localStorage.setItem('alashop_welcome_dismissed', 'true');
  };

  // Filter products by lists
  const publishedProducts = products.filter((p) => p.status === 'published');
  const discountProducts = publishedProducts.filter((p) => p.discountPercent && p.discountPercent > 0);
  const bestsellers = publishedProducts.filter((p) => p.isBestseller);
  const newArrivals = publishedProducts.filter((p) => p.isNew);
  const recommended = publishedProducts.filter((p) => p.isFeatured || p.rating >= 4.9);
  const recentlyViewed = publishedProducts.slice(0, 4);

  // Icon mapping for categories
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smartphone':
        return <Smartphone className="w-5 h-5 text-sky-600 dark:text-sky-400" />;
      case 'Tv':
        return <Tv className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case 'Shirt':
        return <Shirt className="w-5 h-5 text-violet-600 dark:text-violet-400" />;
      case 'Home':
        return <Home className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'Dumbbell':
        return <Dumbbell className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'Car':
        return <Car className="w-5 h-5 text-rose-600 dark:text-rose-400" />;
      case 'Baby':
        return <Baby className="w-5 h-5 text-pink-600 dark:text-pink-400" />;
      default:
        return <Apple className="w-5 h-5 text-teal-600 dark:text-teal-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* 1. Welcome / Onboarding Splash Banner */}
      {showWelcomeCard && (
        <div className="relative mx-4 mt-3 p-4 rounded-3xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 text-white shadow-xl overflow-hidden">
          <button
            onClick={dismissWelcome}
            className="absolute top-3 right-3 p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-white p-1 shadow-md shrink-0">
              <img src="/alashop-icon.svg" alt="Alashop" className="w-full h-full" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight">Добро пожаловать в Alashop!</h2>
              <p className="text-xs text-sky-100 font-medium">{t.slogan}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/15 text-[11px]">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-sky-200 shrink-0" />
              <span>Kaspi Pay 0-0-24</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-sky-200 shrink-0" />
              <span>Доставка от 2 ч</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-sky-200 shrink-0" />
              <span>100% Оригинал</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Commercial Promotion Banners Carousel */}
      <div className="relative px-4">
        <div className="relative w-full aspect-[21/9] sm:aspect-[16/7] rounded-3xl overflow-hidden shadow-lg bg-slate-900">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              onClick={() => {
                if (banner.categoryId) {
                  setSelectedCategory(banner.categoryId);
                  setActiveTab('catalog');
                }
              }}
              className={`absolute inset-0 transition-opacity duration-700 cursor-pointer ${
                index === currentBannerIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={banner.image}
                alt={banner.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-transparent flex flex-col justify-end p-4 sm:p-6 text-white">
                {banner.badge && (
                  <span className="self-start px-2 py-0.5 mb-1.5 text-[10px] font-bold bg-sky-500 rounded-md uppercase tracking-wider shadow-sm">
                    {banner.badge}
                  </span>
                )}
                <h3 className="text-sm sm:text-xl font-bold tracking-tight text-white leading-tight">
                  {language === 'kz' && banner.titleKz ? banner.titleKz : banner.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-200 line-clamp-1 mt-0.5">
                  {language === 'kz' && banner.subtitleKz ? banner.subtitleKz : banner.subtitle}
                </p>
              </div>
            </div>
          ))}

          {/* Carousel Dot Indicators */}
          <div className="absolute bottom-2.5 right-4 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentBannerIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentBannerIndex ? 'w-4 bg-sky-400' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 3. Popular Categories Grid */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>{t.categories}</span>
          </h2>
          <button
            onClick={() => setActiveTab('catalog')}
            className="text-xs font-semibold text-sky-600 dark:text-sky-400 flex items-center gap-1 hover:underline"
          >
            <span>{t.all}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
          {categories.slice(0, 8).map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setActiveTab('catalog');
              }}
              className="group flex flex-col items-center text-center p-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-800 shadow-xs hover:border-sky-400 hover:shadow-sm transition-all active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center mb-1.5 group-hover:bg-sky-50 dark:group-hover:bg-sky-950/50 transition-colors">
                {getCategoryIcon(cat.iconName)}
              </div>
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 line-clamp-1 leading-tight">
                {language === 'kz' ? cat.nameKz : cat.nameRu}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 4. Flash Deals & Discounts with Countdown */}
      {discountProducts.length > 0 && (
        <section className="px-4">
          <div className="p-4 rounded-3xl bg-gradient-to-br from-rose-500/10 via-sky-500/10 to-amber-500/10 border border-rose-200/60 dark:border-rose-900/40">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-rose-500 text-white shadow-sm">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100">
                    {t.discounts}
                  </h2>
                  <div className="flex items-center gap-1.5 text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
                    <Clock className="w-3 h-3" />
                    <span>До конца акции: 14 ч 32 мин</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('catalog')}
                className="text-xs font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1"
              >
                Все акции
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Horizontal scroll on mobile */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-2 px-2">
              {discountProducts.slice(0, 5).map((product) => (
                <div key={product.id} className="min-w-[170px] max-w-[190px] shrink-0">
                  <ProductCard product={product} compact />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Хиты продаж (Bestsellers) */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-sky-600" />
            <span>{t.bestsellers}</span>
          </h2>
          <button
            onClick={() => setActiveTab('catalog')}
            className="text-xs font-semibold text-sky-600 dark:text-sky-400"
          >
            {t.all}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {bestsellers.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Новинки (New Arrivals) */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>{t.newArrivals}</span>
          </h2>
          <button
            onClick={() => setActiveTab('catalog')}
            className="text-xs font-semibold text-sky-600 dark:text-sky-400"
          >
            {t.all}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {newArrivals.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. Рекомендуемые товары (Recommended) */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ThumbsUp className="w-4 h-4 text-violet-600" />
            <span>{t.recommended}</span>
          </h2>
          <button
            onClick={() => setActiveTab('catalog')}
            className="text-xs font-semibold text-sky-600 dark:text-sky-400"
          >
            {t.all}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {recommended.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 8. Недавно просмотренные (Recently Viewed) */}
      {recentlyViewed.length > 0 && (
        <section className="px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>{t.recentlyViewed}</span>
            </h2>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {recentlyViewed.map((prod) => (
              <div
                key={prod.id}
                onClick={() => setSelectedProduct(prod)}
                className="min-w-[130px] max-w-[140px] shrink-0 bg-white dark:bg-slate-800 p-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-left cursor-pointer hover:shadow-sm"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 mb-1.5">
                  <img
                    src={prod.images[prod.primaryImageIndex || 0] || prod.images[0]}
                    alt={prod.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate">
                  {prod.brand}
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">
                  {prod.price.toLocaleString('ru-RU')} ₸
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
