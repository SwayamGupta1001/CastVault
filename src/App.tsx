import { useState } from 'react';
import type { DiecastItem, UserProfile, ViewTab, CurrencyOption } from './types';
import {
  getStoredItems,
  saveStoredItem,
  deleteStoredItem,
  getStoredUserProfile,
  clearAllGarageItems
} from './utils/storage';
import { getStoredCurrency } from './utils/currency';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { Sidebar } from './components/Sidebar';
import { GarageView } from './views/GarageView';
import { BrandsView } from './views/BrandsView';
import { StatsView } from './views/StatsView';
import { AboutView } from './views/AboutView';
import { SettingsView } from './views/SettingsView';
import { AddModelModal } from './components/AddModelModal';
import { QuickPeekDrawer } from './components/QuickPeekDrawer';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { AppDownloadModal } from './components/AppDownloadModal';
import { ClearDataModal } from './components/ClearDataModal';
import { StartupLoader } from './components/StartupLoader';

export function App() {
  const [items, setItems] = useState<DiecastItem[]>(() => getStoredItems());
  const [currency, setCurrency] = useState<CurrencyOption>(() => getStoredCurrency());
  
  const baseProfile = getStoredUserProfile();
  const [profile, setProfile] = useState<UserProfile>(() => ({
    ...baseProfile,
    preferredCurrency: currency
  }));

  const [currentTab, setCurrentTab] = useState<ViewTab>('garage');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScaleFilter, setSelectedScaleFilter] = useState('');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState('');

  const [peekItem, setPeekItem] = useState<DiecastItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DiecastItem | null>(null);
  const [isPwaInfoOpen, setIsPwaInfoOpen] = useState(false);
  const [isAppDownloadOpen, setIsAppDownloadOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const handleCurrencyChange = (newCurrency: CurrencyOption) => {
    setCurrency(newCurrency);
    setProfile((prev) => ({
      ...prev,
      preferredCurrency: newCurrency
    }));
  };

  const handleSaveItem = (itemToSave: DiecastItem) => {
    const updated = saveStoredItem(itemToSave);
    setItems(updated);
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    const updated = deleteStoredItem(id);
    setItems(updated);
    if (peekItem?.id === id) {
      setPeekItem(null);
    }
  };

  const handleConfirmClearVault = () => {
    clearAllGarageItems();
    setItems([]);
  };

  const handleFilterByBrand = (brandId: string) => {
    setSelectedBrandFilter(brandId);
    setCurrentTab('garage');
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      {/* Real-time Signature Startup Loader Screen */}
      <StartupLoader />

      <Navbar
        totalItems={items.length}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentTab={currentTab}
        onTabChange={setCurrentTab}
      />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          profile={profile}
          totalItems={items.length}
          selectedScaleFilter={selectedScaleFilter}
          onSelectScaleFilter={setSelectedScaleFilter}
          onOpenAddModal={() => {
            setEditingItem(null);
            setIsAddModalOpen(true);
          }}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {currentTab === 'garage' && (
            <GarageView
              items={items}
              profile={profile}
              searchQuery={searchQuery}
              selectedScaleFilter={selectedScaleFilter}
              onSelectScaleFilter={setSelectedScaleFilter}
              onPeekDetails={(item) => setPeekItem(item)}
              onEditItem={(item) => {
                setEditingItem(item);
                setIsAddModalOpen(true);
              }}
              onDeleteItem={handleDeleteItem}
              onOpenAddModal={() => {
                setEditingItem(null);
                setIsAddModalOpen(true);
              }}
              selectedBrandFilter={selectedBrandFilter}
              onSelectBrandFilter={setSelectedBrandFilter}
            />
          )}

          {currentTab === 'brands' && (
            <BrandsView items={items} onFilterByBrand={handleFilterByBrand} />
          )}

          {currentTab === 'stats' && <StatsView items={items} profile={profile} />}

          {currentTab === 'settings' && (
            <SettingsView
              currency={currency}
              onCurrencyChange={handleCurrencyChange}
              onOpenAppDownload={() => setIsAppDownloadOpen(true)}
              onOpenClearModal={() => setIsClearModalOpen(true)}
              totalItems={items.length}
            />
          )}

          {currentTab === 'about' && <AboutView />}
        </main>
      </div>

      <BottomNav
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenAddModal={() => {
          setEditingItem(null);
          setIsAddModalOpen(true);
        }}
      />

      <QuickPeekDrawer
        item={peekItem}
        onClose={() => setPeekItem(null)}
        onEdit={(item) => {
          setPeekItem(null);
          setEditingItem(item);
          setIsAddModalOpen(true);
        }}
        onDelete={handleDeleteItem}
        currencyCode={currency}
      />

      <AddModelModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        initialItem={editingItem}
      />

      <PWAInstallBanner
        isOpen={isPwaInfoOpen}
        onClose={() => setIsPwaInfoOpen(false)}
      />

      <AppDownloadModal
        isOpen={isAppDownloadOpen}
        onClose={() => setIsAppDownloadOpen(false)}
      />

      <ClearDataModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirmClear={handleConfirmClearVault}
      />
    </div>
  );
}

export default App;
