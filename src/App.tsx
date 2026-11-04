import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/common/Header';
import { TabBar } from './components/common/TabBar';
import { NotificationToast } from './components/common/NotificationToast';
import { HomeScreen } from './components/home/HomeScreen';
import { CatalogScreen } from './components/catalog/CatalogScreen';
import { FavoritesScreen } from './components/favorites/FavoritesScreen';
import { CartScreen } from './components/cart/CartScreen';
import { ProfileScreen } from './components/profile/ProfileScreen';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ProductDetailModal } from './components/product/ProductDetailModal';
import { AddEditProductModal } from './components/admin/AddEditProductModal';
import { AuthModal } from './components/auth/AuthModal';

const ShopAppInner: React.FC = () => {
  const {
    activeTab,
    selectedProduct,
    isAddProductModalOpen,
    setIsAddProductModalOpen,
    selectedProductForEdit,
    setSelectedProductForEdit,
    isAuthModalOpen,
    setIsAuthModalOpen,
    deviceViewMode,
  } = useShop();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'catalog':
        return <CatalogScreen />;
      case 'favorites':
        return <FavoritesScreen />;
      case 'cart':
        return <CartScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-200 dark:bg-slate-950 flex flex-col items-center justify-start sm:py-4 transition-colors">
      {/* Toast Notification Container */}
      <NotificationToast />

      {/* Main Container: iPhone Mockup vs Responsive Mode */}
      <div
        className={`w-full transition-all duration-300 relative flex flex-col ${
          deviceViewMode === 'iphone'
            ? 'max-w-[430px] min-h-[92vh] sm:rounded-[48px] bg-slate-50 dark:bg-slate-900 shadow-2xl sm:border-[10px] sm:border-slate-800 dark:sm:border-slate-800 overflow-hidden ring-1 ring-black/10'
            : 'max-w-5xl min-h-screen bg-slate-50 dark:bg-slate-900 shadow-xl'
        }`}
      >
        {/* Dynamic Island Cutout on iPhone Frame (only on desktop mockup mode) */}
        {deviceViewMode === 'iphone' && (
          <div className="hidden sm:flex absolute top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-50 items-center justify-between px-3 pointer-events-none shadow-sm">
            <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-700/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-sky-950/80 border border-sky-800/40" />
          </div>
        )}

        {/* Global iOS Top Header */}
        <Header />

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden">
          {renderActiveTab()}
        </main>

        {/* Global iOS Bottom Tab Bar */}
        <TabBar />

        {/* iOS Home Indicator Bar at the bottom */}
        <div className="fixed sm:absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-400/60 dark:bg-slate-600/60 rounded-full z-50 pointer-events-none" />
      </div>

      {/* Modals */}
      {selectedProduct && <ProductDetailModal />}

      {isAddProductModalOpen && (
        <AddEditProductModal
          isOpen={isAddProductModalOpen}
          onClose={() => {
            setIsAddProductModalOpen(false);
            setSelectedProductForEdit(null);
          }}
          productToEdit={selectedProductForEdit}
        />
      )}

      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <ShopAppInner />
    </ShopProvider>
  );
}
