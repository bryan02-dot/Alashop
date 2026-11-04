import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  CartItem,
  Order,
  Review,
  Banner,
  PromoCode,
  UserProfile,
  UserRole,
  ProductStatus,
  OrderStatus,
  PushNotification,
} from '../types';
import {
  initialCategories,
  initialProducts,
  initialBanners,
  initialPromoCodes,
  initialReviews,
  initialUserProfile,
} from '../data/initialData';

export interface FilterState {
  minPrice?: number;
  maxPrice?: number;
  brands: string[];
  inStockOnly: boolean;
  onSaleOnly: boolean;
  minRating?: number;
  sortBy: 'popular' | 'price_asc' | 'price_desc' | 'rating' | 'new';
}

interface ShopContextType {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  favorites: string[];
  orders: Order[];
  reviews: Review[];
  banners: Banner[];
  promoCodes: PromoCode[];
  currentUser: UserProfile;
  language: 'ru' | 'kz';
  theme: 'light' | 'dark';
  activeTab: 'home' | 'catalog' | 'favorites' | 'cart' | 'profile' | 'admin';
  searchQuery: string;
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  selectedProduct: Product | null;
  selectedProductForEdit: Product | null;
  isAddProductModalOpen: boolean;
  isAuthModalOpen: boolean;
  isCartDrawerOpen: boolean;
  activePushBanner: PushNotification | null;
  deviceViewMode: 'iphone' | 'responsive';
  appliedPromo: PromoCode | null;
  filterState: FilterState;

  // Actions
  setLanguage: (lang: 'ru' | 'kz') => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setActiveTab: (tab: 'home' | 'catalog' | 'favorites' | 'cart' | 'profile' | 'admin') => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (catId: string | null) => void;
  setSelectedSubcategory: (subcat: string | null) => void;
  setSelectedProduct: (product: Product | null) => void;
  setSelectedProductForEdit: (product: Product | null) => void;
  setIsAddProductModalOpen: (open: boolean) => void;
  setIsAuthModalOpen: (open: boolean) => void;
  setIsCartDrawerOpen: (open: boolean) => void;
  setDeviceViewMode: (mode: 'iphone' | 'responsive') => void;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;

  // Product Actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductStatus: (id: string, status: ProductStatus) => void;

  // Cart & Favorites
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;

  // Checkout & Orders
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  createOrder: (orderInput: {
    customerName: string;
    customerPhone: string;
    city: string;
    address: string;
    deliveryMethod: 'courier' | 'pickup' | 'postomat';
    paymentMethod: 'kaspi' | 'card' | 'apple_pay' | 'cash';
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Reviews & Categories
  addReview: (review: Omit<Review, 'id' | 'date' | 'likes'>) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;

  // Auth & Roles
  switchRole: (role: UserRole) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  dismissPushBanner: () => void;
  resetDatabase: () => void;
}

const defaultFilterState: FilterState = {
  brands: [],
  inStockOnly: false,
  onSaleOnly: false,
  sortBy: 'popular',
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const STORAGE_KEY_PRODUCTS = 'alashop_products_v1';
const STORAGE_KEY_CATEGORIES = 'alashop_categories_v1';
const STORAGE_KEY_CART = 'alashop_cart_v1';
const STORAGE_KEY_FAVORITES = 'alashop_favorites_v1';
const STORAGE_KEY_ORDERS = 'alashop_orders_v1';
const STORAGE_KEY_REVIEWS = 'alashop_reviews_v1';
const STORAGE_KEY_USER = 'alashop_user_v1';
const STORAGE_KEY_THEME = 'alashop_theme_v1';
const STORAGE_KEY_LANG = 'alashop_lang_v1';

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  // Categories
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CATEGORIES);
      return saved ? JSON.parse(saved) : initialCategories;
    } catch {
      return initialCategories;
    }
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FAVORITES);
      return saved ? JSON.parse(saved) : ['prod-iphone-16-pro', 'prod-nike-air-max'];
    } catch {
      return ['prod-iphone-16-pro', 'prod-nike-air-max'];
    }
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (saved) return JSON.parse(saved);
      // Sample initial order
      return [
        {
          id: 'ord-101',
          orderNumber: 'ALA-9428',
          date: new Date(Date.now() - 3600000 * 24).toISOString(),
          items: [
            {
              productId: 'prod-sony-wh1000xm5',
              title: 'Беспроводные наушники Sony WH-1000XM5 Silver',
              price: 189990,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
              selectedColor: 'Silver White',
            },
          ],
          subtotal: 189990,
          discount: 10000,
          deliveryFee: 0,
          total: 179990,
          status: 'in_transit',
          customerName: 'Нурсултан Ахметов',
          customerPhone: '+7 (701) 888-24-24',
          city: 'Алматы',
          address: 'проспект Достык, д. 180, кв. 42',
          deliveryMethod: 'courier',
          paymentMethod: 'kaspi',
          paymentStatus: 'paid',
        },
      ];
    } catch {
      return [];
    }
  });

  // Reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REVIEWS);
      return saved ? JSON.parse(saved) : initialReviews;
    } catch {
      return initialReviews;
    }
  });

  // User Profile
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      return saved ? JSON.parse(saved) : initialUserProfile;
    } catch {
      return initialUserProfile;
    }
  });

  // Banners & Promos
  const [banners] = useState<Banner[]>(initialBanners);
  const [promoCodes] = useState<PromoCode[]>(initialPromoCodes);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);

  // App UI State
  const [language, setLanguageState] = useState<'ru' | 'kz'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LANG);
      return (saved as 'ru' | 'kz') || 'ru';
    } catch {
      return 'ru';
    }
  });

  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME);
      return (saved as 'light' | 'dark') || 'light';
    } catch {
      return 'light';
    }
  });

  const [activeTab, setActiveTab] = useState<'home' | 'catalog' | 'favorites' | 'cart' | 'profile' | 'admin'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProductForEdit, setSelectedProductForEdit] = useState<Product | null>(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [activePushBanner, setActivePushBanner] = useState<PushNotification | null>(null);
  const [deviceViewMode, setDeviceViewMode] = useState<'iphone' | 'responsive'>('iphone');
  const [filterState, setFilterState] = useState<FilterState>(defaultFilterState);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.warn('Storage quota exceeded for products', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.warn(e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
    } catch (e) {
      console.warn(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(favorites));
    } catch (e) {
      console.warn(e);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.warn(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(reviews));
    } catch (e) {
      console.warn(e);
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
    } catch (e) {
      console.warn(e);
    }
  }, [currentUser]);

  // Sync theme to document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  }, [theme]);

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
  };

  const setLanguage = (lang: 'ru' | 'kz') => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY_LANG, lang);
  };

  const showPush = (title: string, message: string, type: 'order' | 'promo' | 'system' = 'system') => {
    const notif: PushNotification = {
      id: 'notif-' + Date.now(),
      title,
      message,
      time: 'сейчас',
      read: false,
      type,
    };
    setActivePushBanner(notif);
    // Auto dismiss after 4.5 seconds
    setTimeout(() => {
      setActivePushBanner((current) => (current?.id === notif.id ? null : current));
    }, 4500);
  };

  const dismissPushBanner = () => {
    setActivePushBanner(null);
  };

  const resetFilters = () => {
    setFilterState(defaultFilterState);
  };

  // Product Actions
  const addProduct = (productInput: Omit<Product, 'id' | 'createdAt'>): Product => {
    const newProduct: Product = {
      ...productInput,
      id: 'prod-' + Date.now(),
      createdAt: new Date().toISOString(),
      sku: productInput.sku || `ALA-${Math.floor(100000 + Math.random() * 900000)}`,
      rating: productInput.rating || 5.0,
      reviewCount: productInput.reviewCount || 0,
    };

    setProducts((prev) => [newProduct, ...prev]);
    showPush(
      'Alashop Маркетплейс',
      `Товар «${newProduct.title}» опубликован и доступен для покупателей!`,
      'system'
    );
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updates };
          return updated;
        }
        return p;
      })
    );

    // Also update selected product if currently viewing
    setSelectedProduct((prev) => (prev?.id === id ? { ...prev, ...updates } : prev));
    showPush('Alashop Управление', 'Изменения товара успешно сохранены!', 'system');
  };

  const deleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.product.id !== id));
    setFavorites((prev) => prev.filter((favId) => favId !== id));
    if (selectedProduct?.id === id) {
      setSelectedProduct(null);
    }
    showPush('Alashop Управление', `Товар ${target ? `«${target.title}»` : ''} удален из магазина.`, 'system');
  };

  const toggleProductStatus = (id: string, status: ProductStatus) => {
    updateProduct(id, { status });
  };

  // Cart & Favorites
  const addToCart = (product: Product, quantity = 1, color?: string, size?: string) => {
    if (product.stock <= 0) {
      showPush('Нет в наличии', `К сожалению, товар ${product.title} закончился на складе`, 'system');
      return;
    }

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === color &&
          item.selectedSize === size
      );

      if (existingIndex > -1) {
        const currentQty = prev[existingIndex].quantity;
        const newQty = Math.min(product.stock, currentQty + quantity);
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        return updated;
      } else {
        return [
          ...prev,
          {
            product,
            quantity: Math.min(product.stock, quantity),
            selectedColor: color || product.colors?.[0]?.name,
            selectedSize: size || product.sizes?.[0],
          },
        ];
      }
    });

    showPush('Добавлено в корзину', `${product.title} (x${quantity})`, 'promo');
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const clamped = Math.min(item.product.stock, quantity);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  // Promo Code
  const applyPromoCode = (code: string) => {
    const promo = promoCodes.find((p) => p.code.toUpperCase() === code.trim().toUpperCase());
    if (!promo) {
      return { success: false, message: 'Промокод не найден' };
    }

    const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    if (promo.minOrder && subtotal < promo.minOrder) {
      return {
        success: false,
        message: `Минимальная сумма для промокода: ${promo.minOrder.toLocaleString('ru-RU')} ₸`,
      };
    }

    setAppliedPromo(promo);
    return { success: true, message: `Промокод ${promo.code} успешно применен!` };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  // Checkout & Stock Auto Decrement
  const createOrder = (orderInput: {
    customerName: string;
    customerPhone: string;
    city: string;
    address: string;
    deliveryMethod: 'courier' | 'pickup' | 'postomat';
    paymentMethod: 'kaspi' | 'card' | 'apple_pay' | 'cash';
  }): Order => {
    const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    let discount = 0;
    if (appliedPromo) {
      if (appliedPromo.discountPercent) {
        discount = Math.round((subtotal * appliedPromo.discountPercent) / 100);
      } else if (appliedPromo.fixedDiscount) {
        discount = appliedPromo.fixedDiscount;
      }
    }

    const deliveryFee = subtotal >= 15000 || orderInput.deliveryMethod !== 'courier' ? 0 : 1500;
    const total = Math.max(0, subtotal - discount + deliveryFee);
    const orderNumber = `ALA-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber,
      date: new Date().toISOString(),
      items: cart.map((item) => ({
        productId: item.product.id,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images[item.product.primaryImageIndex || 0] || '',
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
      })),
      subtotal,
      discount,
      deliveryFee,
      total,
      status: 'created',
      customerName: orderInput.customerName,
      customerPhone: orderInput.customerPhone,
      city: orderInput.city,
      address: orderInput.address,
      deliveryMethod: orderInput.deliveryMethod,
      paymentMethod: orderInput.paymentMethod,
      paymentStatus: orderInput.paymentMethod === 'cash' ? 'pending' : 'paid',
    };

    // Auto decrement stock in products database!
    setProducts((prev) =>
      prev.map((prod) => {
        const cartItem = cart.find((ci) => ci.product.id === prod.id);
        if (cartItem) {
          const newStock = Math.max(0, prod.stock - cartItem.quantity);
          return {
            ...prod,
            stock: newStock,
          };
        }
        return prod;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setAppliedPromo(null);

    showPush(
      `Заказ #${orderNumber} принят!`,
      `Сумма: ${total.toLocaleString('ru-RU')} ₸. Спасибо за покупку в Alashop!`,
      'order'
    );

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return { ...o, status };
        }
        return o;
      })
    );

    const targetOrder = orders.find((o) => o.id === orderId);
    const orderNum = targetOrder?.orderNumber || orderId;

    const statusTexts: Record<OrderStatus, string> = {
      created: 'Оформлен',
      processing: 'Собирается на складе Alashop',
      in_transit: 'Передан курьеру и уже едет к вам!',
      delivered: 'Успешно вручен покупателю',
      cancelled: 'Отменен',
    };

    showPush(
      `Заказ #${orderNum}`,
      `Статус изменен: ${statusTexts[status]}`,
      'order'
    );
  };

  // Review
  const addReview = (reviewInput: Omit<Review, 'id' | 'date' | 'likes'>) => {
    const newReview: Review = {
      ...reviewInput,
      id: 'rev-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      likes: 0,
    };

    setReviews((prev) => [newReview, ...prev]);

    // Recalculate product rating
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === reviewInput.productId) {
          const productReviews = reviews.filter((r) => r.productId === prod.id);
          const allRatings = [...productReviews.map((r) => r.rating), reviewInput.rating];
          const newAvg = Number(
            (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1)
          );
          return {
            ...prod,
            rating: newAvg,
            reviewCount: prod.reviewCount + 1,
          };
        }
        return prod;
      })
    );

    showPush('Отзыв опубликован', 'Спасибо за ваш отзыв о товаре!', 'system');
  };

  const addCategory = (categoryInput: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...categoryInput,
      id: 'cat-' + Date.now(),
    };
    setCategories((prev) => [...prev, newCat]);
    showPush('Категория создана', `Добавлена категория «${categoryInput.nameRu}»`, 'system');
  };

  const switchRole = (role: UserRole) => {
    setCurrentUser((prev) => ({ ...prev, role }));
    if (role === 'admin') {
      setActiveTab('admin');
      showPush('Режим Администратора', 'Вы вошли как Владелец Alashop', 'system');
    } else {
      setActiveTab('home');
      showPush('Режим Покупателя', 'Вы переключились на витрину Alashop', 'system');
    }
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({ ...prev, ...updates }));
    showPush('Профиль обновлен', 'Данные успешно сохранены', 'system');
  };

  const resetDatabase = () => {
    localStorage.removeItem(STORAGE_KEY_PRODUCTS);
    localStorage.removeItem(STORAGE_KEY_CATEGORIES);
    localStorage.removeItem(STORAGE_KEY_CART);
    localStorage.removeItem(STORAGE_KEY_FAVORITES);
    localStorage.removeItem(STORAGE_KEY_ORDERS);
    localStorage.removeItem(STORAGE_KEY_REVIEWS);
    setProducts(initialProducts);
    setCategories(initialCategories);
    setCart([]);
    setFavorites(['prod-iphone-16-pro', 'prod-nike-air-max']);
    setReviews(initialReviews);
    showPush('База данных', 'Восстановлены исходные демонстрационные товары', 'system');
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        categories,
        cart,
        favorites,
        orders,
        reviews,
        banners,
        promoCodes,
        currentUser,
        language,
        theme,
        activeTab,
        searchQuery,
        selectedCategory,
        selectedSubcategory,
        selectedProduct,
        selectedProductForEdit,
        isAddProductModalOpen,
        isAuthModalOpen,
        isCartDrawerOpen,
        activePushBanner,
        deviceViewMode,
        appliedPromo,
        filterState,
        setLanguage,
        setTheme,
        setActiveTab,
        setSearchQuery,
        setSelectedCategory,
        setSelectedSubcategory,
        setSelectedProduct,
        setSelectedProductForEdit,
        setIsAddProductModalOpen,
        setIsAuthModalOpen,
        setIsCartDrawerOpen,
        setDeviceViewMode,
        setFilterState,
        resetFilters,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductStatus,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleFavorite,
        isFavorite,
        applyPromoCode,
        removePromoCode,
        createOrder,
        updateOrderStatus,
        addReview,
        addCategory,
        switchRole,
        updateUserProfile,
        dismissPushBanner,
        resetDatabase,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
