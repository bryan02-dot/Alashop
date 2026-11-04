import React, { useState } from 'react';
import {
  X,
  Heart,
  Star,
  ShoppingBag,
  Zap,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Package,
  Share2,
  ChevronRight,
  MessageSquarePlus,
  Send,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatTenge } from '../../utils/formatters';
import { ProductCard } from './ProductCard';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    toggleFavorite,
    isFavorite,
    reviews,
    addReview,
    products,
    setActiveTab,
    setIsCartDrawerOpen,
  } = useShop();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    selectedProduct?.colors?.[0]?.name
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    selectedProduct?.sizes?.[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!selectedProduct) return null;

  const favorited = isFavorite(selectedProduct.id);
  const productReviews = reviews.filter((r) => r.productId === selectedProduct.id);
  const isOutOfStock = selectedProduct.stock <= 0;

  // Similar products from same category
  const similarProducts = products
    .filter(
      (p) =>
        p.id !== selectedProduct.id &&
        p.categoryId === selectedProduct.categoryId &&
        p.status === 'published'
    )
    .slice(0, 4);

  const imagesList =
    selectedProduct.images && selectedProduct.images.length > 0
      ? selectedProduct.images
      : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'];

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewText.trim()) return;

    addReview({
      productId: selectedProduct.id,
      authorName: reviewAuthor.trim(),
      rating: reviewRating,
      text: reviewText.trim(),
      isVerifiedPurchase: true,
    });

    setReviewText('');
    setReviewAuthor('');
    setIsReviewFormOpen(false);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, quantity, selectedColor, selectedSize);
    setSelectedProduct(null);
    setActiveTab('cart');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 overflow-hidden">
      <div className="w-full max-w-xl max-h-[92vh] sm:max-h-[90vh] bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-200">
        {/* iOS Drag Handle */}
        <div className="w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-2.5 sm:hidden" />

        {/* Top Floating Actions Header */}
        <div className="px-5 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {selectedProduct.brand}
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              {selectedProduct.sku}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleShare}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Поделиться товаром"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleFavorite(selectedProduct.id)}
              className={`p-2 rounded-full transition-colors ${
                favorited
                  ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40'
                  : 'text-slate-500 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="В избранное"
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-500' : ''}`} />
            </button>
            <button
              onClick={() => setSelectedProduct(null)}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* 1. Main Photo Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-xs border border-slate-200/60 dark:border-slate-800">
              <img
                src={imagesList[activeImageIndex] || imagesList[0]}
                alt={selectedProduct.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all"
              />
              {selectedProduct.discountPercent ? (
                <span className="absolute top-3 left-3 px-2 py-1 text-xs font-bold bg-rose-500 text-white rounded-lg shadow-sm">
                  -{selectedProduct.discountPercent}%
                </span>
              ) : null}
            </div>

            {/* Thumbnail Gallery Strip */}
            {imagesList.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {imagesList.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIndex === idx
                        ? 'border-sky-600 ring-2 ring-sky-600/30'
                        : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumb ${idx}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Title, Ratings & Stock */}
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-tight mb-2">
              {selectedProduct.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
                <span>{selectedProduct.rating}</span>
                <span className="text-slate-400 font-normal">
                  ({selectedProduct.reviewCount} отзывов)
                </span>
              </div>

              <span>·</span>

              <div>
                {isOutOfStock ? (
                  <span className="text-rose-500 font-bold">Нет в наличии</span>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    В наличии ({selectedProduct.stock} шт.)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 3. Price Block */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
                {formatTenge(selectedProduct.price)}
              </span>
              {selectedProduct.oldPrice && selectedProduct.oldPrice > selectedProduct.price && (
                <span className="text-sm text-slate-400 line-through tabular-nums">
                  {formatTenge(selectedProduct.oldPrice)}
                </span>
              )}
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-sky-700 dark:text-sky-300 font-medium">
              <span className="px-1.5 py-0.5 bg-sky-100 dark:bg-sky-950/80 rounded font-bold">
                Kaspi 0-0-24
              </span>
              <span>
                от {formatTenge(Math.round(selectedProduct.price / 24))} / месяц
              </span>
            </div>
          </div>

          {/* 4. Color Swatches (if available) */}
          {selectedProduct.colors && selectedProduct.colors.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Цвет: <span className="font-semibold text-sky-600 dark:text-sky-400">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {selectedProduct.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedColor(c.name)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                      selectedColor === c.name
                        ? 'border-sky-600 bg-sky-50/60 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 ring-2 ring-sky-500/20'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 5. Size Selection (if available) */}
          {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Размер / Конфигурация:
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedSize === s
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 6. Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Описание
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {selectedProduct.description}
            </p>
          </div>

          {/* 7. Characteristics / Specifications Table */}
          {selectedProduct.specifications && selectedProduct.specifications.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                Характеристики
              </h3>
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {selectedProduct.specifications.map((spec, i) => (
                  <div key={i} className="flex p-3 justify-between gap-4 odd:bg-slate-50/50 dark:odd:bg-slate-800/40">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">{spec.name}</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-right">{spec.value}</span>
                  </div>
                ))}
                {selectedProduct.material && (
                  <div className="flex p-3 justify-between gap-4">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Материал</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedProduct.material}</span>
                  </div>
                )}
                {selectedProduct.weight && (
                  <div className="flex p-3 justify-between gap-4">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Вес</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedProduct.weight}</span>
                  </div>
                )}
                {selectedProduct.country && (
                  <div className="flex p-3 justify-between gap-4">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Страна производства</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedProduct.country}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 8. Service Guarantees */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <Truck className="w-4 h-4 text-sky-600 shrink-0" />
              <span>Быстрая доставка по Казахстану</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Гарантия возврата 14 дней</span>
            </div>
          </div>

          {/* 9. Customer Reviews & Add Review Form */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Отзывы покупателей ({productReviews.length})
              </h3>
              <button
                type="button"
                onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
                className="text-xs font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1 hover:underline"
              >
                <MessageSquarePlus className="w-3.5 h-3.5" />
                <span>Написать отзыв</span>
              </button>
            </div>

            {/* Write Review Form */}
            {isReviewFormOpen && (
              <form
                onSubmit={handleSubmitReview}
                className="p-4 rounded-2xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/50 mb-4 space-y-3"
              >
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Ваш отзыв о товаре
                </h4>

                <div>
                  <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">
                    Оценка:
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 text-amber-400 transition-transform active:scale-120"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= reviewRating ? 'fill-amber-400' : 'text-slate-300 dark:text-slate-700'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    required
                    placeholder="Ваше имя"
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <textarea
                    required
                    rows={3}
                    placeholder="Расскажите о качестве, впечатлениях и сроках доставки..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsReviewFormOpen(false)}
                    className="px-3 py-1.5 text-xs text-slate-500 font-semibold"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-bold bg-sky-600 text-white rounded-xl shadow-sm flex items-center gap-1.5"
                  >
                    <Send className="w-3 h-3" />
                    <span>Отправить</span>
                  </button>
                </div>
              </form>
            )}

            {/* Reviews List */}
            {productReviews.length > 0 ? (
              <div className="space-y-3">
                {productReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-sky-200 dark:bg-sky-900 flex items-center justify-center font-bold text-[10px] text-sky-800 dark:text-sky-300">
                          {rev.authorName.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {rev.authorName}
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className={`w-3 h-3 ${
                              idx < rev.rating ? 'fill-amber-400' : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-1">
                      {rev.text}
                    </p>
                    <span className="text-[10px] text-slate-400">{rev.date} · Проверенная покупка</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                Оставьте первый отзыв о данном товаре!
              </p>
            )}
          </div>

          {/* 10. Similar Products */}
          {similarProducts.length > 0 && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                Похожие товары
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {similarProducts.slice(0, 2).map((item) => (
                  <ProductCard key={item.id} product={item} compact />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky iOS Bottom CTA Bar */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex items-center gap-2.5">
          {/* Quantity Stepper */}
          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shrink-0">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-2.5 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
            >
              -
            </button>
            <span className="px-2 text-xs font-bold tabular-nums min-w-5 text-center text-slate-900 dark:text-white">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(selectedProduct.stock, q + 1))}
              disabled={quantity >= selectedProduct.stock}
              className="px-2.5 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold disabled:opacity-40"
            >
              +
            </button>
          </div>

          {/* Add to Cart */}
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={() => addToCart(selectedProduct, quantity, selectedColor, selectedSize)}
            className="flex-1 py-3 px-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-98 disabled:opacity-50"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>В корзину</span>
          </button>

          {/* Buy Now (1-click) */}
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleBuyNow}
            className="flex-1 py-3 px-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-sky-600/25 transition-all active:scale-98 disabled:opacity-50"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Купить сейчас</span>
          </button>
        </div>
      </div>
    </div>
  );
};
