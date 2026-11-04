import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, EyeOff, PackageX } from 'lucide-react';
import { Product } from '../../types';
import { useShop } from '../../context/ShopContext';
import { formatTenge } from '../../utils/formatters';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, compact = false }) => {
  const {
    setSelectedProduct,
    addToCart,
    toggleFavorite,
    isFavorite,
    currentUser,
    setSelectedProductForEdit,
    setIsAddProductModalOpen,
  } = useShop();

  const [imageError, setImageError] = useState(false);
  const favorited = isFavorite(product.id);
  const isOutOfStock = product.stock <= 0;
  const isHidden = product.status === 'hidden';
  const isDraft = product.status === 'draft';

  const primaryImage =
    product.images && product.images.length > 0
      ? product.images[product.primaryImageIndex || 0] || product.images[0]
      : '';

  return (
    <div
      onClick={() => setSelectedProduct(product)}
      className="group relative bg-white dark:bg-slate-800/90 rounded-2xl p-2.5 sm:p-3 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
    >
      {/* Top Media & Badges */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700/50 mb-2.5">
        {!imageError && primaryImage ? (
          <img
            src={primaryImage}
            alt={product.title}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-3 text-slate-400 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
            <ShoppingBag className="w-8 h-8 stroke-1 text-slate-300 dark:text-slate-600 mb-1" />
            <span className="text-[10px] text-center font-medium line-clamp-1">{product.brand}</span>
          </div>
        )}

        {/* Status Badges Overlay */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10">
          {product.discountPercent ? (
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-rose-500 text-white rounded-md shadow-sm">
              -{product.discountPercent}%
            </span>
          ) : null}
          {product.isNew && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-sky-500 text-white rounded-md shadow-sm">
              New
            </span>
          )}
          {isOutOfStock && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-800/90 text-white rounded-md backdrop-blur-xs flex items-center gap-1">
              <PackageX className="w-3 h-3 text-rose-400" />
              Нет в наличии
            </span>
          )}
          {isHidden && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-500 text-white rounded-md flex items-center gap-1">
              <EyeOff className="w-3 h-3" />
              Скрыт
            </span>
          )}
          {isDraft && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-purple-600 text-white rounded-md">
              Черновик
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-transform active:scale-80 z-10 ${
            favorited
              ? 'bg-rose-500 text-white'
              : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-rose-500'
          }`}
          title="В избранное"
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-white stroke-none' : 'stroke-[2]'}`} />
        </button>

        {/* Admin Quick Edit Button */}
        {currentUser.role === 'admin' && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProductForEdit(product);
              setIsAddProductModalOpen(true);
            }}
            className="absolute bottom-2 right-2 px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold rounded-lg shadow-sm transition-transform active:scale-95 z-10"
          >
            Ред.
          </button>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Rating */}
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] truncate max-w-[65%]">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-medium text-amber-500 shrink-0">
              <Star className="w-3 h-3 fill-amber-400 stroke-none" />
              <span>{product.rating}</span>
              <span className="text-slate-400 text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors mb-2">
            {product.title}
          </h3>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-2">
          <div>
            <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">
              {formatTenge(product.price)}
            </div>
            {product.oldPrice && product.oldPrice > product.price ? (
              <div className="text-[10px] sm:text-xs text-slate-400 line-through tabular-nums -mt-0.5">
                {formatTenge(product.oldPrice)}
              </div>
            ) : (
              <div className="text-[10px] text-slate-400 -mt-0.5">
                {product.stock > 0 ? `Остаток: ${product.stock} шт` : 'Под заказ'}
              </div>
            )}
          </div>

          {/* Add to Cart Quick Button */}
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className={`p-2 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-sm ${
              isOutOfStock
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-600/20'
            }`}
            title={isOutOfStock ? 'Товар закончился' : 'Добавить в корзину'}
          >
            <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>
      </div>
    </div>
  );
};
