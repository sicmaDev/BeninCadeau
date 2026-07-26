"use client";

import { createContext, useContext, useReducer, useState, useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import { useRouter as useNextRouter, usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";

// ── Product Interface ──────────────────────────────────────────────────────────

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  stock: number;
  deliveryDays: string;
  isPersonalizable: boolean;
  isPopular: boolean;
  isActive: boolean;
  tags: string[];
}

// ── Router ────────────────────────────────────────────────────────────────────

export type PageName =
  | "home"
  | "catalogue"
  | "product"
  | "cart"
  | "checkout"
  | "confirmation"
  | "account"
  | "about"
  | "contact"
  | "track-order";

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
  | { type: "SET_CART"; items: CartItem[] }
  | { type: "APPLY_PROMO"; code: string; discount: number };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find((i) => i.product.id === action.product.id);
      let newItems;
      if (existing) {
        newItems = state.items.map((i) =>
          i.product.id === action.product.id
            ? { ...i, quantity: i.quantity + action.quantity, personalMessage: action.personalMessage || i.personalMessage }
            : i
        );
      } else {
        newItems = [...state.items, { product: action.product, quantity: action.quantity, personalMessage: action.personalMessage }];
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("bc_cart", JSON.stringify(newItems));
      }
      return { ...state, items: newItems };
    }
    case "REMOVE": {
      const newItems = state.items.filter((i) => i.product.id !== action.productId);
      if (typeof window !== "undefined") {
        localStorage.setItem("bc_cart", JSON.stringify(newItems));
      }
      return { ...state, items: newItems };
    }
    case "UPDATE_QTY": {
      let newItems;
      if (action.quantity <= 0) {
        newItems = state.items.filter((i) => i.product.id !== action.productId);
      } else {
        newItems = state.items.map((i) =>
          i.product.id === action.productId ? { ...i, quantity: action.quantity } : i
        );
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("bc_cart", JSON.stringify(newItems));
      }
      return { ...state, items: newItems };
    }
    case "CLEAR": {
      if (typeof window !== "undefined") {
        localStorage.removeItem("bc_cart");
        localStorage.removeItem("bc_promo");
      }
      return { items: [], promoCode: "", promoDiscount: 0 };
    }
    case "SET_CART": {
      return { ...state, items: action.items };
    }
    case "APPLY_PROMO": {
      if (typeof window !== "undefined") {
        localStorage.setItem("bc_promo", JSON.stringify({ code: action.code, discount: action.discount }));
      }
      return { ...state, promoCode: action.code, promoDiscount: action.discount };
    }
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

// ── Auth ───────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface AuthContextValue {
  user: User | null;
  login: (email: string, passwordHash: string) => Promise<boolean>;
  register: (name: string, email: string, passwordHash: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const nextRouter = useNextRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [routerState, setRouterState] = useState<RouterState>({ page: "home", params: {} });
  const [cart, dispatch] = useReducer(cartReducer, { items: [], promoCode: "", promoDiscount: 0 });
  const [user, setUser] = useState<User | null>(null);

  // Synchroniser le panier depuis localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("bc_cart");
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          if (Array.isArray(parsed)) {
            const validItems = parsed.filter((item) => item && item.product && typeof item.product.price === "number");
            dispatch({ type: "SET_CART", items: validItems });
          }
        } catch (e) {
          console.error("Error loading cart from localStorage", e);
        }
      }
      const savedPromo = localStorage.getItem("bc_promo");
      if (savedPromo) {
        try {
          const parsed = JSON.parse(savedPromo);
          dispatch({ type: "APPLY_PROMO", code: parsed.code, discount: parsed.discount });
        } catch (e) {
          console.error("Error loading promo code from localStorage", e);
        }
      }
    }
  }, []);

  // Charger la session utilisateur au démarrage
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Not logged in");
      })
      .then((data) => {
        if (data.user) {
          setUser({
            id: data.user.id.toString(),
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone || "",
            address: data.user.address || "",
          });
        }
      })
      .catch(() => setUser(null));
  }, []);

  // Déduire l'état du routeur local à partir du pathname de Next.js
  useEffect(() => {
    let page: PageName = "home";
    let params: Record<string, string> = {};

    if (pathname === "/") {
      page = "home";
    } else if (pathname.startsWith("/catalogue")) {
      page = "catalogue";
      searchParams.forEach((value, key) => {
        params[key] = value;
      });
    } else if (pathname.startsWith("/produit/")) {
      page = "product";
      params.slug = pathname.split("/").pop() || "";
    } else if (pathname === "/panier") {
      page = "cart";
    } else if (pathname === "/commander") {
      page = "checkout";
    } else if (pathname.startsWith("/confirmation/")) {
      page = "confirmation";
      params.orderNumber = pathname.split("/").pop() || "";
    } else if (pathname === "/compte") {
      page = "account";
    } else if (pathname === "/a-propos") {
      page = "about";
    } else if (pathname === "/contact") {
      page = "contact";
    } else if (pathname === "/suivi-commande") {
      page = "track-order";
    }

    setRouterState({ page, params });
  }, [pathname, searchParams]);

  const navigate = useCallback((page: PageName, params: Record<string, string> = {}) => {
    let path = "/";
    if (page === "catalogue") {
      const query = new URLSearchParams(params).toString();
      path = `/catalogue${query ? "?" + query : ""}`;
    } else if (page === "product") {
      path = `/produit/${params.slug || params.id}`;
    } else if (page === "cart") {
      path = "/panier";
    } else if (page === "checkout") {
      path = "/commander";
    } else if (page === "confirmation") {
      path = `/confirmation/${params.orderNumber}`;
    } else if (page === "account") {
      const query = new URLSearchParams(params).toString();
      path = `/compte${query ? "?" + query : ""}`;
    } else if (page === "about") {
      path = "/a-propos";
    } else if (page === "contact") {
      path = "/contact";
    } else if (page === "track-order") {
      path = "/suivi-commande";
    }

    nextRouter.push(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [nextRouter]);

  const addToCart = useCallback((product: Product, quantity: number, personalMessage: string) => {
    dispatch({ type: "ADD", product, quantity, personalMessage });
    toast.success(`${product.name} ajouté au panier !`, {
      description: `Quantité : ${quantity}`,
      action: {
        label: "Voir le panier",
        onClick: () => navigate("cart"),
      },
    });
  }, [navigate]);

  const removeFromCart = useCallback((productId: string) => {
    const item = cart.items.find((i) => i?.product?.id === productId);
    dispatch({ type: "REMOVE", productId });
    if (item) {
      toast.info(`${item.product.name} retiré du panier.`);
    }
  }, [cart.items]);

  const updateQty = useCallback((productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QTY", productId, quantity });
  }, []);

  const clearCart = useCallback(() => dispatch({ type: "CLEAR" }), []);

  const applyPromo = useCallback((code: string, discount: number) => {
    dispatch({ type: "APPLY_PROMO", code, discount });
    if (code) {
      toast.success(`Code promo "${code}" appliqué avec succès !`);
    } else {
      toast.info("Code promo retiré.");
    }
  }, []);

  const cartCount = cart.items.reduce((s, i) => s + (i?.quantity || 0), 0);
  const subtotal = cart.items.reduce((s, i) => {
    if (!i || !i.product) return s;
    return s + (i.product.price || 0) * (i.quantity || 0);
  }, 0);

  // Authentification via les API réelles
  const login = useCallback(async (email: string, passwordHash: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: passwordHash }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser({
          id: data.user.id.toString(),
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone || "",
          address: data.user.address || "",
        });
        toast.success(`Connexion réussie ! Bienvenue ${data.user.name}.`);
        return true;
      }
      toast.error(data.error || "Email ou mot de passe incorrect.");
      return false;
    } catch (e) {
      console.error(e);
      toast.error("Erreur de connexion au serveur.");
      return false;
    }
  }, []);

  const register = useCallback(async (name: string, email: string, passwordHash: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password: passwordHash }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser({
          id: data.user.id.toString(),
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone || "",
          address: data.user.address || "",
        });
        toast.success("Votre compte a été créé avec succès !");
        return true;
      }
      toast.error(data.error || "Impossible de créer le compte.");
      return false;
    } catch (e) {
      console.error(e);
      toast.error("Erreur réseau lors de la création du compte.");
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.info("Vous avez été déconnecté.");
    } catch (e) {
      console.error(e);
    }
    setUser(null);
  }, []);

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
