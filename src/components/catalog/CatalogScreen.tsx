import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  ChevronDown,
  X,
  Search,
  Check,
  RotateCcw,
  Tag,
  Star,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from '../product/ProductCard';
import { translations } from '../../utils/i18n';

export const CatalogScreen: React.FC = () => {
  const {
    products,
    categories,
    language,
    selectedCategory,
    setSelectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
    searchQuery,
    setSearchQuery,
    filterState,
    setFilterState,
    resetFilters,
  } = useShop();

  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const t = translations[language];

  // Active Category object
  const activeCategoryObj = useMemo(() => {
    return categories.find((c) => c.id === selectedCategory);
  }, [categories, selectedCategory]);

  // Extract all available brands
  const allBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    products.forEach((p) => {
      if (p.brand) brandsSet.add(p.brand);
    });
    return Array.from(brandsSet).sort();
  }, [products]);

  // Filter & Sort Pipeline
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Must be published unless admin
      if (product.status !== 'published') return false;

      // Category filter
      if (selectedCategory && product.categoryId !== selectedCategory) {
        return false;
      }

      // Subcategory filter
      if (selectedSubcategory && product.subcategory !== selectedSubcategory) {
        return false;
      }

      // Search Query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const inTitle = product.title.toLowerCase().includes(query);
        const inBrand = product.brand.toLowerCase().includes(query);
        const inDesc = product.description.toLowerCase().includes(query);
        const inSubcat = product.subcategory.toLowerCase().includes(query);
        if (!inTitle && !inBrand && !inDesc && !inSubcat) {
          return false;
        }
      }

      // Price Filter
      if (filterState.minPrice && product.price < filterState.minPrice) {
        return false;
      }
      if (filterState.maxPrice && product.price > filterState.maxPrice) {
        return false;
      }

      // Brand Filter
      if (filterState.brands.length > 0 && !filterState.brands.includes(product.brand)) {
        return false;
      }

      // In stock only
      if (filterState.inStockOnly && product.stock <= 0) {
        return false;
      }

      // On sale only
      if (filterState.onSaleOnly && (!product.discountPercent || product.discountPercent <= 0)) {
        return false;
      }

      // Rating
      if (filterState.minRating && product.rating < filterState.minRating) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filterState.sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'new':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'popular':
        default:
          return b.reviewCount - a.reviewCount;
      }
    });
  }, [products, selectedCategory, selectedSubcategory, searchQuery, filterState]);

  const activeFiltersCount =
    (filterState.minPrice ? 1 : 0) +
    (filterState.maxPrice ? 1 : 0) +
    filterState.brands.length +
    (filterState.inStockOnly ? 1 : 0) +
    (filterState.onSaleOnly ? 1 : 0) +
    (filterState.minRating ? 1 : 0);

  return (
    <div className="pb-24">
      {/* 1. Category Switcher Bar (Horizontal scroll) */}
      <div className="sticky top-[108px] z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-2.5 px-4 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              setSelectedCategory(null);
              setSelectedSubcategory(null);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === null
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {t.allCategories}
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setSelectedSubcategory(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {language === 'kz' ? cat.nameKz : cat.nameRu}
            </button>
          ))}
        </div>

        {/* Subcategories if category selected */}
        {activeCategoryObj && activeCategoryObj.subcategories.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
            <button
              onClick={() => setSelectedSubcategory(null)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-lg whitespace-nowrap ${
                selectedSubcategory === null
                  ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Все в разделе
            </button>
            {activeCategoryObj.subcategories.map((subcat) => (
              <button
                key={subcat}
                onClick={() => setSelectedSubcategory(subcat)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-lg whitespace-nowrap transition-colors ${
                  selectedSubcategory === subcat
                    ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {subcat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Controls Bar: Result Count, Sort, Filter Toggle */}
      <div className="px-4 py-3 flex items-center justify-between gap-2 text-xs">
        <div className="text-slate-600 dark:text-slate-400 font-medium">
          {searchQuery && (
            <span>
              Поиск: «<strong className="text-slate-900 dark:text-white">{searchQuery}</strong>» ·{' '}
            </span>
          )}
          Найдено:{' '}
          <span className="font-bold text-slate-900 dark:text-white tabular-nums">
            {filteredProducts.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Sort Selector */}
          <select
            value={filterState.sortBy}
            onChange={(e) =>
              setFilterState((prev) => ({
                ...prev,
                sortBy: e.target.value as any,
              }))
            }
            className="bg-slate-100 dark:bg-slate-800 border-none text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="popular">По популярности</option>
            <option value="price_asc">Сначала дешевле</option>
            <option value="price_desc">Сначала дороже</option>
            <option value="rating">По рейтингу</option>
            <option value="new">Новинки</option>
          </select>

          {/* Filter Sheet Trigger */}
          <button
            onClick={() => setIsFilterSheetOpen(true)}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl font-semibold transition-all ${
              activeFiltersCount > 0
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Фильтры</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-white text-sky-700 text-[10px] font-bold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 3. Products Grid */}
      <div className="px-4">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
              <Search className="w-8 h-8 stroke-1" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Ничего не найдено
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4">
              Попробуйте изменить поисковый запрос или сбросить установленные фильтры.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                resetFilters();
                setSelectedCategory(null);
                setSelectedSubcategory(null);
              }}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-sm inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Сбросить все параметры</span>
            </button>
          </div>
        )}
      </div>

      {/* 4. Filter Bottom Sheet / Modal */}
      {isFilterSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
          <div className="w-full max-w-md max-h-[85vh] bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-8 duration-200">
            {/* Grab handle */}
            <div className="w-10 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-2.5 sm:hidden" />

            {/* Header */}
            <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-sky-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Фильтры товаров
                </h3>
              </div>
              <button
                onClick={() => setIsFilterSheetOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Filters Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-sm">
              {/* Price Range */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Цена в тенге (₸)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 mb-0.5 block">От ₸</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={filterState.minPrice || ''}
                      onChange={(e) =>
                        setFilterState((prev) => ({
                          ...prev,
                          minPrice: e.target.value ? Number(e.target.value) : undefined,
                        }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold tabular-nums focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 mb-0.5 block">До ₸</span>
                    <input
                      type="number"
                      placeholder="1 000 000"
                      value={filterState.maxPrice || ''}
                      onChange={(e) =>
                        setFilterState((prev) => ({
                          ...prev,
                          maxPrice: e.target.value ? Number(e.target.value) : undefined,
                        }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold tabular-nums focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Toggles */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <span className="font-medium text-slate-700 dark:text-slate-300 text-xs">
                    Только в наличии
                  </span>
                  <input
                    type="checkbox"
                    checked={filterState.inStockOnly}
                    onChange={(e) =>
                      setFilterState((prev) => ({
                        ...prev,
                        inStockOnly: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-sky-600 rounded-sm focus:ring-sky-500"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <span className="font-medium text-slate-700 dark:text-slate-300 text-xs">
                    Только со скидкой %
                  </span>
                  <input
                    type="checkbox"
                    checked={filterState.onSaleOnly}
                    onChange={(e) =>
                      setFilterState((prev) => ({
                        ...prev,
                        onSaleOnly: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-sky-600 rounded-sm focus:ring-sky-500"
                  />
                </label>
              </div>

              {/* Brands selection */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Бренды ({filterState.brands.length} выбрано)
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto no-scrollbar p-1">
                  {allBrands.map((brand) => {
                    const isSelected = filterState.brands.includes(brand);
                    return (
                      <button
                        key={brand}
                        type="button"
                        onClick={() => {
                          setFilterState((prev) => ({
                            ...prev,
                            brands: isSelected
                              ? prev.brands.filter((b) => b !== brand)
                              : [...prev.brands, brand],
                          }));
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          isSelected
                            ? 'bg-sky-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {brand}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer with Reset & Apply */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center gap-3">
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Сбросить
              </button>
              <button
                type="button"
                onClick={() => setIsFilterSheetOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md shadow-sky-600/20 transition-all active:scale-98"
              >
                Показать товары ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
