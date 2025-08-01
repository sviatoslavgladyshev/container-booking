import { useState, useEffect, useMemo, useCallback } from "react";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
  ShoppingCart,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import heroImage from "@/assets/hero-container.jpg";
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';
import { useRef } from 'react';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

interface ContainerData {
  id: string;
  departureDate: Date;
  deliveryDeadline: Date;
  route: string;
  slots: SlotData[];
  availableSlots: number;
}

interface MaterialCreator {
  preload(): void;
  create(materialName: string): THREE.Material;
  materials: { [key: string]: THREE.Material };
}

function Container3D() {
  const ref = useRef<THREE.Group>(null!);

  const materials = useLoader(MTLLoader, 'public/models/12281_Container_v2_L2.mtl') as MaterialCreator;

  const obj = useLoader(OBJLoader, 'public/models/12281_Container_v2_L2.obj', (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  }) as THREE.Group;

  useEffect(() => {
    if (obj) {
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: 'hsl(210,85%,35%)',
            metalness: 0.3,
            roughness: 0.4,
            side: THREE.DoubleSide,
          });
        }
      });
    }
  }, [obj]);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.001;
    }
  });

  return (
    <>
      <hemisphereLight intensity={2.0} groundColor="white" />
      <spotLight position={[10, 20, 10]} angle={0.5} penumbra={1} intensity={3} castShadow />
      <directionalLight position={[5, 10, 5]} intensity={2} />
      <group ref={ref}>
        <primitive
          object={obj}
          scale={[0.02, 0.02, 0.02]}
          position={[0, -2, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        />
      </group>
    </>
  );
}

export function ContainerDashboard() {
  const { t } = useTranslation();
  const [containers, setContainers] = useState<ContainerData[]>([]);
  const [selectedContainerIndex, setSelectedContainerIndex] = useState(0);
  const [cargoMode, setCargoMode] = useState<'palletized' | 'non-standard'>('palletized');
  const [nonStandardDimensions, setNonStandardDimensions] = useState({
    width: 1200,
    height: 2500,
    length: 2600
  });
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState<SlotData[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [direction, setDirection] = useState(0);

  const variants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -200 : 200,
      opacity: 0,
      scale: 0.95,
    }),
  };

  const generateContainers = useCallback(() => {
    const newContainers: ContainerData[] = [];
    for (let i = 0; i < 2; i++) {
      const departureDate = new Date(selectedYear, selectedMonth, 5 + (i * 15));
      const deliveryDeadline = new Date(departureDate);
      deliveryDeadline.setDate(departureDate.getDate() - 3);
      
      const slots: SlotData[] = Array.from({ length: 20 }, (_, index) => ({
        id: index + 1,
        price: index < 7 ? 200 : index < 14 ? 300 : 500,
        isOccupied: false,
        dimensions: { width: 1100, height: 2500, length: 1200 },
        occupiedBy: undefined,
      }));

      const occupiedIndices = new Set<number>();
      while (occupiedIndices.size < 6) {
        const rand = Math.floor(Math.random() * 20);
        occupiedIndices.add(rand);
      }
      occupiedIndices.forEach(idx => {
        slots[idx].isOccupied = true;
        slots[idx].occupiedBy = "Previous Customer";
      });

      newContainers.push({
        id: `CNT-${String(i + 1).padStart(3, '0')}`,
        departureDate,
        deliveryDeadline,
        route: t('containerRoute'),
        slots,
        availableSlots: 14,
      });
    }
    return newContainers;
  }, [selectedMonth, selectedYear, t]);

  useEffect(() => {
    const newContainers = generateContainers();
    setContainers(newContainers);
    setSelectedContainerIndex(0);
  }, [generateContainers]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevContainer();
      if (e.key === 'ArrowRight') handleNextContainer();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [containers.length]);

  const handleSlotSelection = (slots: SlotData[], price: number) => {
    setSelectedSlots(slots);
    setTotalPrice(price);
    setShowPurchaseModal(true);
  };

  const handlePurchaseComplete = (invoice: InvoiceData) => {
    setInvoiceData(invoice);
    setShowPurchaseModal(false);
    setShowInvoice(true);
    
    if (containers[selectedContainerIndex]) {
      const updatedSlots = containers[selectedContainerIndex].slots.map(slot => 
        selectedSlots.some(s => s.id === slot.id) 
          ? { ...slot, isOccupied: true, occupiedBy: invoice.customerInfo.name }
          : slot
      );
      
      const updatedContainer = { 
        ...containers[selectedContainerIndex], 
        slots: updatedSlots,
        availableSlots: updatedSlots.filter(slot => !slot.isOccupied).length
      };
      
      setContainers(prev => 
        prev.map((c, index) => index === selectedContainerIndex ? updatedContainer : c)
      );
    }
    setSelectedSlots([]);
  };

  const handlePrevContainer = () => {
    if (containers.length <= 1 || selectedContainerIndex === 0) return;
    setDirection(-1);
    setSelectedContainerIndex(prev => prev - 1);
    setSelectedSlots([]);
  };

  const handleNextContainer = () => {
    if (containers.length <= 1 || selectedContainerIndex === containers.length - 1) return;
    setDirection(1);
    setSelectedContainerIndex(prev => prev + 1);
    setSelectedSlots([]);
  };

  const handleDragEnd = (_: any, info: any) => {
    const dragThreshold = 30;
    if (info.offset.x < -dragThreshold && selectedContainerIndex < containers.length - 1) {
      handleNextContainer();
    }
    if (info.offset.x > dragThreshold && selectedContainerIndex > 0) {
      handlePrevContainer();
    }
  };

  const currentContainer = useMemo(() => containers[selectedContainerIndex], [containers, selectedContainerIndex]);

  if (containers.length === 0) {
    return <div className="text-center py-8">{t('noContainersAvailable')}</div>;
  }

  const steps = [
    { text: t('selectContainer'), icon: Calendar },
    { text: t('ensureCargoArrival'), icon: CheckCircle },
    { text: <>{t('selectSlots1')}<a className="text-primary underline cursor-pointer" onClick={() => setActiveTab('size')}>{t('linkMoreDetails')}</a>{t('selectSlots2')}</>, icon: ShoppingCart },
    { text: t('paySlots'), icon: DollarSign },
    { text: t('afterPayment'), icon: ArrowRight },
    { text: t('followInstructions'), icon: HelpCircle },
    { text: t('afterArrival'), icon: Ship },
  ];

  return (
    <div className="min-h-screen bg-background">
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
        <div className="absolute top-4 right-4">
          <LanguageSelector />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-full mx-auto">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              {t('home')}
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
            <CargoModeSelector
              mode={cargoMode}
              onModeChange={setCargoMode}
              dimensions={nonStandardDimensions}
              onDimensionsChange={setNonStandardDimensions}
              onTabChange={setActiveTab}
            />
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
              <div className="space-y-6">
                <div className="relative min-h-[500px]">
                  <AnimatePresence initial={false} custom={direction}>
                    {currentContainer && (
                      <motion.div
                        key={currentContainer.id}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        onDragEnd={handleDragEnd}
                        className="absolute w-full cursor-grab active:cursor-grabbing"
                      >
                        <ContainerVisualization
                          container={currentContainer}
                          onSlotSelect={handleSlotSelection}
                          mode={cargoMode}
                          nonStandardDimensions={cargoMode === 'non-standard' ? nonStandardDimensions : undefined}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {containers.length > 1 && (
                  <div className="flex justify-center items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handlePrevContainer}
                      disabled={selectedContainerIndex === 0}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-muted-foreground">
                      {t('container')} {selectedContainerIndex + 1} / {containers.length}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleNextContainer}
                      disabled={selectedContainerIndex === containers.length - 1}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
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
                        <span>{t('length')}:</span>
                        <span className="font-mono">1200 mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('width')}:</span>
                        <span className="font-mono">1100 mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('height')}:</span>
                        <span className="font-mono">2500 mm</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4 p-3 bg-muted/30 rounded">
                      <span>{t('oneSlotOnePallet')}</span>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="w-3 h-3" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t('standardSlotSize')}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded">
                      {t('containerSize')}
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
                        <span className="font-mono">10 × 2 grid</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('containersPerMonth')}:</span>
                        <span className="font-mono">2 containers</span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg mt-6">{t('weightCapacity')}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>{t('maxWeightPerSlot')}:</span>
                        <span className="font-mono">1,250 kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('containerLoadCapacity')}:</span>
                        <span className="font-mono">25,000 kg</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <h3 className="font-semibold text-lg mb-4">{t('visualization')}</h3>
                  <div className="flex justify-center items-center h-96">
                    <Canvas camera={{ position: [0, 0, 15] }}>
                      <ambientLight intensity={1.5} />
                      <pointLight position={[10, 10, 10]} intensity={3} />
                      <Suspense fallback={null}>
                        <Container3D />
                      </Suspense>
                      <OrbitControls />
                    </Canvas>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="how-it-works" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('howItWorks')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="mb-4">
                    {t('howItWorksIntro')}
                    <a 
                      className="text-primary underline cursor-pointer" 
                      onClick={() => setActiveTab('size')}
                    >
                      {t('linkSlotSize')}
                    </a>.
                  </p>
                  <h3 className="font-semibold text-lg mb-2">Included in the Service</h3>
                  <p>{t('serviceIncludes')}</p>
                  <h3 className="font-semibold text-lg mb-2 mt-4">Not Included in the Service</h3>
                  <p>
                    {t('serviceDoesNotInclude')}
                    <a 
                      className="text-primary underline" 
                      href="#offer-agreement"
                    >
                      {t('linkOfferAgreement')}
                    </a>.
                  </p>
                  <h3 className="font-semibold text-lg mb-2 mt-4">Important Note</h3>
                  <p>{t('supplierAgreement')}</p>
                </div>
              </CardContent>
            </Card>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Step-by-Step Guide</h2>
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <step.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">Step {index + 1}</h4>
                          <p className="text-muted-foreground">{step.text}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {showPurchaseModal && currentContainer && (
        <PurchaseModal
          isOpen={showPurchaseModal}
          onClose={() => setShowPurchaseModal(false)}
          selectedSlots={selectedSlots}
          totalPrice={totalPrice}
          containerInfo={currentContainer}
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