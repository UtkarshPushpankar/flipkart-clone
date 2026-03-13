export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  _count?: { products: number };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  brand: string;
  categoryId: string;
  price: number;
  mrp: number;
  stock: number;
  rating: number;
  reviewCount: number;
  images: string[];
  specifications: Record<string, string>;
  isFeatured: boolean;
  createdAt: string;
  category?: { name: string; slug: string };
}

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product: Product;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface Address {
  id?: string;
  fullName: string;
  phone: string;
  pincode: string;
  street: string;
  city: string;
  state: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  userId: string;
  addressId: string;
  status: 'PLACED' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  address: Address;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ProductFacetBrand {
  name: string;
  count: number;
}

export interface ProductFacetsResponse {
  brands: ProductFacetBrand[];
  priceRange: {
    min: number;
    max: number;
  };
}

export interface ProductQueryParams {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort?: string;
  page?: number;
  limit?: number;
}
