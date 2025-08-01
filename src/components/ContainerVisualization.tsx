// ContainerVisualization.tsx
import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { ContainerSlot, SlotData } from "./ContainerSlot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Ship, Package, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { checkCargoFitsInContainer, calculateRequiredSlots, findAvailableSlotPattern } from "@/lib/containerLogic";

interface ContainerData {
  id: string;
  departureDate: Date;
  deliveryDeadline: Date;
  route: string;
  slots: SlotData[];
  availableSlots: number;
}

interface ContainerVisualizationProps {
  container: ContainerData;
  onSlotSelect: (slots: SlotData[], totalPrice: number) => void;
  mode: 'palletized' | 'non-standard';
  nonStandardDimensions?: {
    width: number;
    height: number;
    length: number;
  };
}

export function ContainerVisualization({ 
  container, 
  onSlotSelect, 
  mode,
  nonStandardDimensions 
}: ContainerVisualizationProps) {
  const { t, i18n } = useTranslation();
  const [selectedSlots, setSelectedSlots] = useState<number[]>([]);
  const [calculatedSlots, setCalculatedSlots] = useState<number[]>([]);

  const formatDate = (date: Date, lang: string) => {
    let locale: string;
    switch (lang) {
      case 'en':
        locale = 'en-US';
        break;
      case 'ru':
        locale = 'ru-RU';
        break;
      case 'zh':
        locale = 'zh-CN';
        break;
      default:
        locale = 'en-US';
    }

    if (lang === 'ru') {
      const month = new Intl.DateTimeFormat(locale, { month: 'long' }).format(date);
      return `${month.charAt(0).toUpperCase() + month.slice(1)} ${date.getDate()}, ${date.getFullYear()}`;
    } else if (lang === 'zh') {
      return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
    } else {
      return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
    }
  };

  // Reset selections on component mount (for switch sync)
  useEffect(() => {
    setSelectedSlots([]);
    setCalculatedSlots([]);
  }, [container.id]); // Key on container ID

  // Calculate required slots for non-standard cargo
  useEffect(() => {
    if (mode === 'non-standard' && nonStandardDimensions) {
      if (!checkCargoFitsInContainer(nonStandardDimensions)) {
        setCalculatedSlots([]);
        setSelectedSlots([]);
        return;
      }
      
      const requiredSlotsCount = calculateRequiredSlots(nonStandardDimensions);
      const occupiedSlotIds = container.slots.filter(slot => slot.isOccupied).map(slot => slot.id);
      const availableSlotPattern = findAvailableSlotPattern(occupiedSlotIds, requiredSlotsCount, nonStandardDimensions);
      
      setCalculatedSlots(availableSlotPattern);
      setSelectedSlots(availableSlotPattern);
    } else {
      setCalculatedSlots([]);
    }
  }, [mode, nonStandardDimensions, container.slots]);

  const handleSlotSelect = (slot: SlotData) => {
    if (mode === 'palletized') {
      setSelectedSlots(prev => 
        prev.includes(slot.id) 
          ? prev.filter(id => id !== slot.id) 
          : [...prev, slot.id]
      );
    }
  };

  const handleConfirmSelection = () => {
    const slots = container.slots.filter(slot => selectedSlots.includes(slot.id));
    const totalPrice = slots.reduce((sum, slot) => sum + slot.price, 0);
    onSlotSelect(slots, totalPrice);
  };

  const occupiedSlots = container.slots.filter(slot => slot.isOccupied).length;
  const availableSlots = 20 - occupiedSlots;

  // Define sector colors and prices
  const getSlotStyle = (slotId: number) => {
    if (slotId <= 7) return { price: 200, className: "bg-green-100 border-green-300 hover:bg-green-500 hover:border-green-600" }; // Sector 1: $200, hover green
    if (slotId <= 14) return { price: 300, className: "bg-blue-100 border-blue-300 hover:bg-blue-500 hover:border-blue-600" }; // Sector 2: $300, hover blue
    return { price: 500, className: "bg-purple-100 border-purple-300 hover:bg-purple-500 hover:border-purple-600" }; // Sector 3: $500, hover purple
  };

  return (
    <Card className="w-full shadow-container">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Ship className="w-5 h-5 text-primary" />
            {t('container')} {container.id}
          </CardTitle>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Package className="w-3 h-3" />
            {availableSlots}/20 {t('available')}
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {t('departure')}: {formatDate(container.departureDate, i18n.language)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {t('deliveryDeadline')}: {formatDate(container.deliveryDeadline, i18n.language)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Ship className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {t('route')}: {container.route}
            </span>
          </div>
          {mode === 'non-standard' && calculatedSlots.length === 0 && nonStandardDimensions && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {t('dimensionsDontFit')}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Container visualization */}
          <div className="relative">
            <div className="absolute -top-2 -left-2 -right-2 -bottom-2 bg-gradient-to-br from-blue-400 to-blue-500 opacity-20 rounded-xl"></div>
            <div className="relative bg-card border-2 border-blue-300 rounded-lg p-4">
              <div className="grid grid-cols-10 grid-rows-2 gap-2">
                {container.slots.map((slot) => {
                  const { className } = getSlotStyle(slot.id);
                  return (
                    <ContainerSlot
                      key={slot.id}
                      slot={{ ...slot, price: getSlotStyle(slot.id).price }}
                      onSelect={handleSlotSelect}
                      isSelected={selectedSlots.includes(slot.id)}
                      selectedSlots={mode === 'non-standard' ? calculatedSlots : selectedSlots}
                      className={className}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Selection info */}
          {selectedSlots.length > 0 && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {t('selected')}: {selectedSlots.length} {t('slots')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('total')}: ${container.slots
                      .filter(slot => selectedSlots.includes(slot.id))
                      .reduce((sum, slot) => sum + getSlotStyle(slot.id).price, 0)}
                  </p>
                </div>
                <Button 
                  onClick={handleConfirmSelection}
                  className="bg-gradient-to-r from-blue-500 to-blue-500 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-600"
                  disabled={selectedSlots.length === 0}
                >
                  {t('selectThisContainer')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}