import React from 'react';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from '../product/ProductCard';
import { translations } from '../../utils/i18n';

export const FavoritesScreen: React.FC = () => {
  const { favorites, products, addToCart, clearCart, setActiveTab, language } = useShop();

  const t = translations[language];

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  const handleAddAllToCart = () => {
    favoriteProducts.forEach((product) => {
      if (product.stock > 0) {
        addToCart(product);
      }
    });
    setActiveTab('cart');
  };

  if (favoriteProducts.length === 0) {
    return (
      <div className="px-4 py-20 text-center max-w-sm mx-auto">
        <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-500 shadow-inner">
          <Heart className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
          {t.emptyFavorites}
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Нажимайте на сердечко на любых карточках товаров, чтобы сохранить их здесь и купить позже.
        </p>
        <button
          onClick={() => setActiveTab('catalog')}
          className="w-full py-3 px-4 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-lg shadow-sky-600/25 flex items-center justify-center gap-2 transition-all active:scale-98"
        >
          <span>Смотреть каталог</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 pb-28 pt-2 space-y-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>{t.favorites}</span>
          <span className="text-xs font-normal text-slate-400">
            ({favoriteProducts.length})
          </span>
        </h1>

        <button
          onClick={handleAddAllToCart}
          className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Перенести все в корзину</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {favoriteProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
