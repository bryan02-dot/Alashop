export type UserRole = 'buyer' | 'admin';

export type ProductStatus = 'published' | 'draft' | 'hidden';

export interface ProductSpecification {
  name: string;
  value: string;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  title: string;
  titleKz?: string;
  brand: string;
  categoryId: string;
  subcategory: string;
  price: number;
  oldPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  sku: string;
  description: string;
  descriptionKz?: string;
  specifications: ProductSpecification[];
  images: string[];
  primaryImageIndex: number;
  status: ProductStatus;
  sizes?: string[];
  colors?: ProductColor[];
  material?: string;
  weight?: string;
  country?: string;
  isNew?: boolean;
  isBestseller?: boolean;
  isFeatured?: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  nameRu: string;
  nameKz: string;
  iconName: string;
  subcategories: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export type OrderStatus = 'created' | 'processing' | 'in_transit' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  city: string;
  address: string;
  deliveryMethod: 'courier' | 'pickup' | 'postomat';
  paymentMethod: 'kaspi' | 'card' | 'apple_pay' | 'cash';
  paymentStatus: 'paid' | 'pending';
}

export interface Review {
  id: string;
  productId: string;
  authorName: string;
  authorAvatar?: string;
  rating: number;
  date: string;
  text: string;
  photos?: string[];
  likes: number;
  isVerifiedPurchase: boolean;
}

export interface Banner {
  id: string;
  title: string;
  titleKz?: string;
  subtitle: string;
  subtitleKz?: string;
  image: string;
  categoryId?: string;
  badge?: string;
}

export interface PromoCode {
  code: string;
  discountPercent?: number;
  fixedDiscount?: number;
  minOrder?: number;
  description: string;
}

export interface PushNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type?: 'order' | 'promo' | 'system';
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  role: UserRole;
  city: string;
  savedAddresses: string[];
  savedCards: { id: string; last4: string; brand: string }[];
}
