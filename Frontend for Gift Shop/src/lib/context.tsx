import { createContext, useContext, useReducer, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { Product } from "../data/mockData";

// ── Router ────────────────────────────────────────────────────────────────────

export type PageName =
  | "home"
  | "catalogue"
  | "product"
  | "cart"
  | "checkout"
  | "confirmation"
  | "account"
  | "about";

interface RouterState {
  page: PageName;
  params: Record<string, string>;
}

interface RouterContextValue extends RouterState {
  navigate: (page: PageName, params?: Record<string, string>) => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

// ── Cart ──────────────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product;
  quantity: number;
  personalMessage: string;
}

interface CartState {
  items: CartItem[];
  promoCode: string;
  promoDiscount: number;
}

type CartAction =
  | { type: "ADD"; product: Product; quantity: number; personalMessage: string }
  | { type: "REMOVE"; productId: string }
  | { type: "UPDATE_QTY"; productId: string; quantity: number }
  | { type: "CLEAR" }
  | { type: "APPLY_PROMO"; code: string; discount: number };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find((i) => i.product.id === action.product.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.product.id === action.product.id
              ? { ...i, quantity: i.quantity + action.quantity, personalMessage: action.personalMessage || i.personalMessage }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { product: action.product, quantity: action.quantity, personalMessage: action.personalMessage }],
      };
    }
    case "REMOVE":
      return { ...state, items: state.items.filter((i) => i.product.id !== action.productId) };
    case "UPDATE_QTY":
      if (action.quantity <= 0) {
        return { ...state, items: state.items.filter((i) => i.product.id !== action.productId) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.product.id === action.productId ? { ...i, quantity: action.quantity } : i
        ),
      };
    case "CLEAR":
      return { items: [], promoCode: "", promoDiscount: 0 };
    case "APPLY_PROMO":
      return { ...state, promoCode: action.code, promoDiscount: action.discount };
    default:
      return state;
  }
}

interface CartContextValue {
  cart: CartState;
  addToCart: (product: Product, quantity: number, personalMessage: string) => void;
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyPromo: (code: string, discount: number) => void;
  cartCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

// ── Auth (mock) ───────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [routerState, setRouterState] = useState<RouterState>({ page: "home", params: {} });
  const [cart, dispatch] = useReducer(cartReducer, { items: [], promoCode: "", promoDiscount: 0 });
  const [user, setUser] = useState<User | null>(null);

  const navigate = useCallback((page: PageName, params: Record<string, string> = {}) => {
    setRouterState({ page, params });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const addToCart = useCallback((product: Product, quantity: number, personalMessage: string) => {
    dispatch({ type: "ADD", product, quantity, personalMessage });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    dispatch({ type: "REMOVE", productId });
  }, []);

  const updateQty = useCallback((productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QTY", productId, quantity });
  }, []);

  const clearCart = useCallback(() => dispatch({ type: "CLEAR" }), []);

  const applyPromo = useCallback((code: string, discount: number) => {
    dispatch({ type: "APPLY_PROMO", code, discount });
  }, []);

  const cartCount = cart.items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = cart.items.reduce((s, i) => s + i.product.price * i.quantity, 0);

  const login = useCallback((email: string, _password: string): boolean => {
    setUser({ id: "u1", name: "Kossi Adjovi", email, phone: "+229 97 12 34 56", address: "Cotonou, Akpakpa" });
    return true;
  }, []);

  const register = useCallback((name: string, email: string, _password: string): boolean => {
    setUser({ id: "u1", name, email, phone: "", address: "" });
    return true;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  return (
    <RouterContext.Provider value={{ ...routerState, navigate }}>
      <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, applyPromo, cartCount, subtotal }}>
        <AuthContext.Provider value={{ user, login, register, logout }}>
          {children}
        </AuthContext.Provider>
      </CartContext.Provider>
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useRouter outside AppProvider");
  return ctx;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart outside AppProvider");
  return ctx;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth outside AppProvider");
  return ctx;
}
