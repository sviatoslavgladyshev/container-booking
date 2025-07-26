import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { ContainerVisualization } from "./ContainerVisualization";
import { CargoModeSelector } from "./CargoModeSelector";
import { PurchaseModal, InvoiceData } from "./PurchaseModal";
import { InvoiceDocument } from "./InvoiceDocument";
import { LanguageSelector } from "./LanguageSelector";
import { MonthSelector } from "./MonthSelector";
import { SlotData } from "./ContainerSlot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Ship, 
  Calendar, 
  Package, 
  DollarSign, 
  ArrowRight,
  CheckCircle,
  Building,
  Ruler,
  HelpCircle,
  ShoppingCart
} from "lucide-react";
import heroImage from "@/assets/hero-container.jpg";

interface ContainerData {
  id: string;
  departureDate: Date;
  slots: SlotData[];
  availableSlots: number;
}

export function ContainerDashboard() {
  const { t } = useTranslation();
  const [containers, setContainers] = useState<ContainerData[]>([]);
  const [selectedContainer, setSelectedContainer] = useState<ContainerData | null>(null);
  const [cargoMode, setCargoMode] = useState<'palletized' | 'non-standard'>('palletized');
  const [weight, setWeight] = useState(1000);
  const [nonStandardDimensions, setNonStandardDimensions] = useState({
    width: 1200,
    height: 1100,
    length: 2600
  });
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState<SlotData[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Generate container data based on selected month
  useEffect(() => {
    const generateContainers = () => {
      const containers: ContainerData[] = [];
      
      // Generate 2 containers for selected month
      for (let i = 0; i < 2; i++) {
        const departureDate = new Date(selectedYear, selectedMonth, 5 + (i * 15)); // 5th and 20th of month
        
        const slots: SlotData[] = Array.from({ length: 20 }, (_, index) => ({
          id: index + 1,
          price: Math.floor(Math.random() * 300) + 200, // $200-500
          isOccupied: Math.random() < 0.3, // 30% occupied
          dimensions: {
            width: 1200,
            height: 1100,
            length: 2600
          },
          weight: Math.random() < 0.7 ? Math.floor(Math.random() * 800) + 500 : undefined,
          maxWeight: 1300,
          occupiedBy: Math.random() < 0.3 ? "Previous Customer" : undefined
        }));

        containers.push({
          id: `CNT-${String(i + 1).padStart(3, '0')}`,
          departureDate,
          slots,
          availableSlots: slots.filter(slot => !slot.isOccupied).length
        });
      }
      
      setContainers(containers);
      setSelectedContainer(containers[0]);
    };

    generateContainers();
  }, [selectedMonth, selectedYear]);

  const handleSlotSelection = (slots: SlotData[], price: number) => {
    setSelectedSlots(slots);
    setTotalPrice(price);
    setShowPurchaseModal(true);
  };

  const handlePurchaseComplete = (invoice: InvoiceData) => {
    setInvoiceData(invoice);
    setShowPurchaseModal(false);
    setShowInvoice(true);
    
    // Update container slots as occupied
    if (selectedContainer) {
      const updatedSlots = selectedContainer.slots.map(slot => 
        selectedSlots.some(s => s.id === slot.id) 
          ? { ...slot, isOccupied: true, occupiedBy: invoice.customerInfo.name }
          : slot
      );
      
      const updatedContainer = { 
        ...selectedContainer, 
        slots: updatedSlots,
        availableSlots: updatedSlots.filter(slot => !slot.isOccupied).length
      };
      
      setContainers(prev => 
        prev.map(c => c.id === selectedContainer.id ? updatedContainer : c)
      );
      setSelectedContainer(updatedContainer);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative h-64 bg-cover bg-center bg-gradient-ocean"
        style={{
          backgroundImage: `linear-gradient(rgba(33, 117, 155, 0.8), rgba(33, 117, 155, 0.8)), url(${heroImage})`
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-primary-foreground">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {t('title')}
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              {t('subtitle')}
            </p>
          </div>
        </div>
        
        {/* Language Selector */}
        <div className="absolute top-4 right-4">
          <LanguageSelector />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px] mx-auto">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              {t('buyPlace')}
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              {t('company')}
            </TabsTrigger>
            <TabsTrigger value="size" className="flex items-center gap-2">
              <Ruler className="w-4 h-4" />
              {t('slotSize')}
            </TabsTrigger>
            <TabsTrigger value="how-it-works" className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              {t('howItWorks')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Ship className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">{containers.length}</p>
                      <p className="text-sm text-muted-foreground">{t('containersThisMonth')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Package className="w-8 h-8 text-maritime-container" />
                    <div>
                      <p className="text-2xl font-bold">
                        {containers.reduce((sum, c) => sum + c.availableSlots, 0)}
                      </p>
                      <p className="text-sm text-muted-foreground">{t('availableSlots')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-8 h-8 text-maritime-port" />
                    <div>
                      <p className="text-2xl font-bold">$200-500</p>
                      <p className="text-sm text-muted-foreground">{t('priceRange')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-8 h-8 text-maritime-steel" />
                    <div>
                      <p className="text-2xl font-bold">1300kg</p>
                      <p className="text-sm text-muted-foreground">{t('maxWeightSlot')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cargo Configuration */}
            <CargoModeSelector
              mode={cargoMode}
              onModeChange={setCargoMode}
              dimensions={nonStandardDimensions}
              onDimensionsChange={setNonStandardDimensions}
              weight={weight}
              onWeightChange={setWeight}
            />

            {/* Container Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{t('availableContainers')}</h2>
                <MonthSelector
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  onMonthChange={(month, year) => {
                    setSelectedMonth(month);
                    setSelectedYear(year);
                  }}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {containers.map((container) => (
                  <div key={container.id} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{t('container')} {container.id}</h3>
                      <Button
                        variant={selectedContainer?.id === container.id ? "default" : "outline"}
                        onClick={() => setSelectedContainer(container)}
                        size="sm"
                      >
                        {selectedContainer?.id === container.id ? t('selected') : t('select')}
                      </Button>
                    </div>
                    
                    {selectedContainer?.id === container.id && (
                      <ContainerVisualization
                        container={container}
                        onSlotSelect={handleSlotSelection}
                        mode={cargoMode}
                        nonStandardDimensions={cargoMode === 'non-standard' ? nonStandardDimensions : undefined}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="company" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('aboutCompany')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>{t('companyDesc')}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">{t('ourMission')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('missionDesc')}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">{t('ourExperience')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('experienceDesc')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="size" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('standardSlotSpecs')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">{t('dimensionsLabel')}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>{t('width')}:</span>
                        <span className="font-mono">1,200 mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('height')}:</span>
                        <span className="font-mono">1,100 mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('length')}:</span>
                        <span className="font-mono">2,600 mm</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>{t('maxWeight')}:</span>
                        <span className="font-mono">1,300 kg</span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-4 p-3 bg-muted/30 rounded">
                      {t('containerDimensions')}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">{t('containerLayout')}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>{t('slotsPerContainer')}:</span>
                        <span className="font-mono">20 slots</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('layout')}:</span>
                        <span className="font-mono">4 × 5 grid</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('containersPerMonth')}:</span>
                        <span className="font-mono">2 containers</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="how-it-works" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{t('selectCargoType')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('selectCargoTypeDesc')}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Ship className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{t('chooseContainer')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('chooseContainerDesc')}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{t('completeBookingTitle')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('completeBookingDesc')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      {showPurchaseModal && selectedContainer && (
        <PurchaseModal
          isOpen={showPurchaseModal}
          onClose={() => setShowPurchaseModal(false)}
          selectedSlots={selectedSlots}
          totalPrice={totalPrice}
          containerInfo={selectedContainer}
          onPurchaseComplete={handlePurchaseComplete}
        />
      )}

      {showInvoice && invoiceData && (
        <InvoiceDocument
          isOpen={showInvoice}
          onClose={() => setShowInvoice(false)}
          invoiceData={invoiceData}
        />
      )}
    </div>
  );
}