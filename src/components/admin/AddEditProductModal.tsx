import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Camera,
  Star,
  Trash2,
  Plus,
  Eye,
  Check,
  Package,
  Layers,
  Sparkles,
  Image as ImageIcon,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Product, ProductColor, ProductSpecification, ProductStatus } from '../../types';
import { formatTenge } from '../../utils/formatters';

interface AddEditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

const STOCK_PHOTO_PRESETS = [
  { name: 'iPhone Titanium', url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80' },
  { name: 'Ноутбук Ultrabook', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80' },
  { name: 'Наушники Hi-Fi', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' },
  { name: 'Кроссовки Sneaker', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80' },
  { name: 'Тренч / Одежда', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80' },
  { name: 'Парфюм Люкс', url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80' },
  { name: 'Скандинавский диван', url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80' },
  { name: 'Кофемашина', url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80' },
  { name: 'Электросамокат', url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80' },
  { name: 'Шины / Авто', url: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=800&q=80' },
];

export const AddEditProductModal: React.FC<AddEditProductModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
}) => {
  const { categories, addProduct, updateProduct } = useShop();

  // Basic info
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'electronics');
  const [subcategory, setSubcategory] = useState(categories[0]?.subcategories[0] || 'Смартфоны');
  const [price, setPrice] = useState<number | ''>('');
  const [oldPrice, setOldPrice] = useState<number | ''>('');
  const [stock, setStock] = useState<number | ''>(10);
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');

  // Specs
  const [specifications, setSpecifications] = useState<ProductSpecification[]>([
    { name: 'Модель', value: '' },
    { name: 'Гарантия', value: '12 месяцев' },
  ]);

  // Variant options
  const [colors, setColors] = useState<ProductColor[]>([
    { name: 'Черный', hex: '#111827' },
    { name: 'Серый', hex: '#6b7280' },
  ]);
  const [sizes, setSizes] = useState<string[]>(['M', 'L']);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#2563eb');
  const [newSize, setNewSize] = useState('');

  // Additional details
  const [material, setMaterial] = useState('');
  const [weight, setWeight] = useState('');
  const [country, setCountry] = useState('Казахстан');

  // Images
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
  ]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);

  // Tab & live preview
  const [activeTab, setActiveTab] = useState<'info' | 'photos' | 'specs' | 'preview'>('info');

  // Initialize if editing
  useEffect(() => {
    if (productToEdit) {
      setTitle(productToEdit.title);
      setBrand(productToEdit.brand);
      setCategoryId(productToEdit.categoryId);
      setSubcategory(productToEdit.subcategory);
      setPrice(productToEdit.price);
      setOldPrice(productToEdit.oldPrice || '');
      setStock(productToEdit.stock);
      setSku(productToEdit.sku);
      setDescription(productToEdit.description);
      setSpecifications(productToEdit.specifications || []);
      setColors(productToEdit.colors || []);
      setSizes(productToEdit.sizes || []);
      setMaterial(productToEdit.material || '');
      setWeight(productToEdit.weight || '');
      setCountry(productToEdit.country || 'Казахстан');
      setImages(productToEdit.images || []);
      setPrimaryImageIndex(productToEdit.primaryImageIndex || 0);
    } else {
      // Default auto SKU
      setSku(`ALA-${Math.floor(100000 + Math.random() * 900000)}`);
    }
  }, [productToEdit]);

  // Update subcategory options when category changes
  const activeCategory = categories.find((c) => c.id === categoryId);
  useEffect(() => {
    if (activeCategory && activeCategory.subcategories.length > 0) {
      if (!activeCategory.subcategories.includes(subcategory)) {
        setSubcategory(activeCategory.subcategories[0]);
      }
    }
  }, [categoryId, activeCategory]);

  if (!isOpen) return null;

  // File upload handler (from iPhone gallery or camera)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddPresetPhoto = (url: string) => {
    setImages((prev) => [...prev, url]);
  };

  const handleRemovePhoto = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    if (primaryImageIndex >= index && primaryImageIndex > 0) {
      setPrimaryImageIndex(primaryImageIndex - 1);
    }
  };

  // Specs helpers
  const handleAddSpec = () => {
    setSpecifications((prev) => [...prev, { name: '', value: '' }]);
  };

  const handleUpdateSpec = (index: number, key: 'name' | 'value', val: string) => {
    setSpecifications((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: val };
      return updated;
    });
  };

  const handleRemoveSpec = (index: number) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== index));
  };

  // Color & Size helpers
  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    setColors((prev) => [...prev, { name: newColorName.trim(), hex: newColorHex }]);
    setNewColorName('');
  };

  const handleAddSize = () => {
    if (!newSize.trim()) return;
    setSizes((prev) => [...prev, newSize.trim()]);
    setNewSize('');
  };

  // Calculate discount percentage
  const numPrice = Number(price) || 0;
  const numOldPrice = Number(oldPrice) || 0;
  const discountPercent =
    numOldPrice > numPrice && numPrice > 0
      ? Math.round(((numOldPrice - numPrice) / numOldPrice) * 100)
      : undefined;

  // Publish / Save
  const handleSave = (status: ProductStatus) => {
    if (!title.trim() || !numPrice) {
      alert('Пожалуйста, заполните название товара и цену');
      return;
    }

    const payload = {
      title: title.trim(),
      brand: brand.trim() || 'Alashop Brand',
      categoryId,
      subcategory,
      price: numPrice,
      oldPrice: numOldPrice > 0 ? numOldPrice : undefined,
      discountPercent,
      stock: Number(stock) || 0,
      sku: sku.trim() || `ALA-${Math.floor(100000 + Math.random() * 900000)}`,
      description: description.trim() || 'Качественный товар из каталога Alashop с гарантией.',
      specifications: specifications.filter((s) => s.name.trim() && s.value.trim()),
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'],
      primaryImageIndex: primaryImageIndex < images.length ? primaryImageIndex : 0,
      status,
      colors,
      sizes,
      material: material.trim(),
      weight: weight.trim(),
      country: country.trim(),
      rating: productToEdit?.rating || 5.0,
      reviewCount: productToEdit?.reviewCount || 0,
      isNew: true,
    };

    if (productToEdit) {
      updateProduct(productToEdit.id, payload);
    } else {
      addProduct(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 overflow-hidden">
      <div className="w-full max-w-2xl max-h-[94vh] bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-200">
        {/* iOS Drag Handle */}
        <div className="w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-2.5 sm:hidden" />

        {/* Modal Header */}
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {productToEdit ? 'Редактировать товар' : 'Добавить новый товар'}
              </h2>
              <span className="text-[10px] text-slate-400">
                Кабинет владельца Alashop · Синхронизация с базой данных
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Tabs: Info, Photos, Specs, Preview */}
        <div className="flex items-center gap-1 px-5 pt-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 overflow-x-auto no-scrollbar text-xs">
          {[
            { id: 'info', label: 'Основная информация' },
            { id: 'photos', label: `Фотографии (${images.length})` },
            { id: 'specs', label: 'Характеристики и вариации' },
            { id: 'preview', label: 'Предпросмотр карточки' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 font-bold whitespace-nowrap border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* TAB 1: Main Information */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Название товара *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Например: Смартфон Apple iPhone 16 Pro 256GB"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Бренд / Производитель *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Например: Apple, Samsung, Nike"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Артикул товара (SKU)
                  </label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Категория *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nameRu}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Подкатегория
                  </label>
                  <select
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                  >
                    {activeCategory?.subcategories.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Цена (₸) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="499 990"
                      value={price}
                      onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold tabular-nums text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Старая цена (₸)
                    </label>
                    <input
                      type="number"
                      placeholder="599 990"
                      value={oldPrice}
                      onChange={(e) => setOldPrice(e.target.value ? Number(e.target.value) : '')}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold tabular-nums text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Остаток на складе *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={stock}
                      onChange={(e) => setStock(e.target.value ? Number(e.target.value) : 0)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold tabular-nums text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {discountPercent && (
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                    Расчетная скидка для витрины: -{discountPercent}%
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Описание товара
                </label>
                <textarea
                  rows={4}
                  placeholder="Подробное описание характеристик, комплектации и преимуществ..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              {/* Material, Weight, Country */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Материал
                  </label>
                  <input
                    type="text"
                    placeholder="Хлопок / Алюминий"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Вес
                  </label>
                  <input
                    type="text"
                    placeholder="199 г / 1.5 кг"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Страна
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Photo Management */}
          {activeTab === 'photos' && (
            <div className="space-y-4">
              {/* Photo Upload Triggers */}
              <div className="grid grid-cols-2 gap-3">
                {/* Gallery File Input */}
                <label className="p-4 rounded-2xl border-2 border-dashed border-sky-400 bg-sky-50/50 dark:bg-sky-950/20 hover:bg-sky-50 text-center cursor-pointer flex flex-col items-center justify-center gap-1.5 transition-all">
                  <Upload className="w-5 h-5 text-sky-600" />
                  <span className="font-bold text-slate-900 dark:text-white">Из галереи iPhone</span>
                  <span className="text-[10px] text-slate-500">Загрузить JPG, PNG, WEBP</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {/* Camera Capture Input */}
                <label className="p-4 rounded-2xl border-2 border-dashed border-amber-400 bg-amber-50/50 dark:bg-amber-950/20 hover:bg-amber-50 text-center cursor-pointer flex flex-col items-center justify-center gap-1.5 transition-all">
                  <Camera className="w-5 h-5 text-amber-600" />
                  <span className="font-bold text-slate-900 dark:text-white">Снять на камеру</span>
                  <span className="text-[10px] text-slate-500">Быстрый снимок товара</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Stock Photo Presets Picker */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Или выберите из готовой библиотеки Alashop:
                </label>
                <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                  {STOCK_PHOTO_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddPresetPhoto(preset.url)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-sky-100 dark:hover:bg-sky-950 hover:text-sky-600 shrink-0 flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Uploaded Photos Grid with Primary selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Загруженные фотографии ({images.length}) · Нажмите звездочку, чтобы сделать главной
                </label>

                {images.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {images.map((img, idx) => {
                      const isPrimary = idx === primaryImageIndex;
                      return (
                        <div
                          key={idx}
                          className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                            isPrimary
                              ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-md'
                              : 'border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <img
                            src={img}
                            alt={`Product pic ${idx}`}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />

                          {/* Primary star button */}
                          <button
                            type="button"
                            onClick={() => setPrimaryImageIndex(idx)}
                            className={`absolute top-1.5 left-1.5 p-1 rounded-lg backdrop-blur-md transition-colors ${
                              isPrimary
                                ? 'bg-amber-500 text-white shadow-sm'
                                : 'bg-black/40 text-white/70 hover:text-white'
                            }`}
                            title="Сделать главной"
                          >
                            <Star className={`w-3.5 h-3.5 ${isPrimary ? 'fill-white' : ''}`} />
                          </button>

                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(idx)}
                            className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-black/40 text-white/70 hover:text-rose-400 hover:bg-black/60 transition-colors"
                            title="Удалить фото"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          {isPrimary && (
                            <span className="absolute bottom-1.5 inset-x-1.5 py-0.5 text-[9px] font-bold bg-amber-500 text-white rounded text-center shadow-xs">
                              Главное фото
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center border border-dashed rounded-2xl text-slate-400">
                    Фотографии еще не добавлены. Загрузите фото из галереи или используйте готовые пресеты выше.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Specs and Variations */}
          {activeTab === 'specs' && (
            <div className="space-y-4">
              {/* Dynamic Specifications */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Технические характеристики
                  </label>
                  <button
                    type="button"
                    onClick={handleAddSpec}
                    className="text-xs font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Добавить строку</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {specifications.map((spec, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Параметр (напр. Экран)"
                        value={spec.name}
                        onChange={(e) => handleUpdateSpec(idx, 'name', e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                      />
                      <input
                        type="text"
                        placeholder="Значение (напр. 6.3 OLED 120 Гц)"
                        value={spec.value}
                        onChange={(e) => handleUpdateSpec(idx, 'value', e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSpec(idx)}
                        className="p-2 text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Variations */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Варианты цветов
                </label>

                <div className="flex flex-wrap gap-2 mb-2">
                  {colors.map((c, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
                    >
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.hex }} />
                      <span className="font-semibold">{c.name}</span>
                      <button
                        type="button"
                        onClick={() => setColors((prev) => prev.filter((_, idx) => idx !== i))}
                        className="ml-1 text-slate-400 hover:text-rose-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                  />
                  <input
                    type="text"
                    placeholder="Название цвета (напр. Midnight Blue)"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="px-3 py-1.5 bg-slate-800 text-white dark:bg-slate-700 rounded-xl font-bold"
                  >
                    Добавить цвет
                  </button>
                </div>
              </div>

              {/* Size Variations */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Варианты размеров / конфигураций
                </label>

                <div className="flex flex-wrap gap-2 mb-2">
                  {sizes.map((s, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
                    >
                      <span className="font-bold">{s}</span>
                      <button
                        type="button"
                        onClick={() => setSizes((prev) => prev.filter((_, idx) => idx !== i))}
                        className="ml-1 text-slate-400 hover:text-rose-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Размер или объем (напр. 256 ГБ, 42 EUR, XXL)"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                  <button
                    type="button"
                    onClick={handleAddSize}
                    className="px-3 py-1.5 bg-slate-800 text-white dark:bg-slate-700 rounded-xl font-bold"
                  >
                    Добавить
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Live Card Preview before publication */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="p-3 bg-sky-50 dark:bg-sky-950/40 rounded-2xl border border-sky-200 dark:border-sky-900/50 text-[11px] text-sky-800 dark:text-sky-300">
                Именно так карточка товара будет отображаться покупателям в каталоге Alashop:
              </div>

              <div className="max-w-xs mx-auto">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-3 border border-slate-200 dark:border-slate-700 shadow-lg">
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 mb-2.5">
                    <img
                      src={images[primaryImageIndex] || images[0]}
                      alt="Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {discountPercent ? (
                      <span className="absolute top-2 left-2 px-1.5 py-0.5 text-[10px] font-bold bg-rose-500 text-white rounded-md">
                        -{discountPercent}%
                      </span>
                    ) : null}
                  </div>

                  <div className="text-[10px] uppercase font-bold text-slate-400">
                    {brand || 'Brand'}
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 mt-0.5">
                    {title || 'Название товара'}
                  </h3>

                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                    <div>
                      <div className="text-sm font-extrabold text-slate-900 dark:text-white tabular-nums">
                        {formatTenge(numPrice || 0)}
                      </div>
                      {numOldPrice > numPrice && (
                        <div className="text-[10px] text-slate-400 line-through">
                          {formatTenge(numOldPrice)}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold">
                      В наличии ({stock || 0} шт)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Action Buttons */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleSave('draft')}
              className="px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Сохранить черновик
            </button>
            <button
              type="button"
              onClick={() => handleSave('hidden')}
              className="px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Скрыть товар
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleSave('published')}
            className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/25 flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Опубликовать товар в Alashop</span>
          </button>
        </div>
      </div>
    </div>
  );
};
