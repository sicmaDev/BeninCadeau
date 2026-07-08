import { Toaster } from "sonner";
import { AppProvider, useRouter } from "../lib/context";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import HomePage from "../pages/HomePage";
import CataloguePage from "../pages/CataloguePage";
import ProductPage from "../pages/ProductPage";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import ConfirmationPage from "../pages/ConfirmationPage";
import AccountPage from "../pages/AccountPage";
import AboutPage from "../pages/AboutPage";

function RouterOutlet() {
  const { page } = useRouter();

  switch (page) {
    case "home":        return <HomePage />;
    case "catalogue":   return <CataloguePage />;
    case "product":     return <ProductPage />;
    case "cart":        return <CartPage />;
    case "checkout":    return <CheckoutPage />;
    case "confirmation":return <ConfirmationPage />;
    case "account":     return <AccountPage />;
    case "about":       return <AboutPage />;
    default:            return <HomePage />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-background font-body">
        <Navbar />
        <main className="flex-1">
          <RouterOutlet />
        </main>
        <Footer />
        <WhatsAppButton />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: "DM Sans, sans-serif",
              borderRadius: "12px",
            },
          }}
        />
      </div>
    </AppProvider>
  );
}
