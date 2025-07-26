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
  const { t } = useTranslation();
  const [selectedSlots, setSelectedSlots] = useState<number[]>([]);
  const [calculatedSlots, setCalculatedSlots] = useState<number[]>([]);

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
      setSelectedSlots([slot.id]);
      setCalculatedSlots([]);
      onSlotSelect([slot], slot.price);
    }
  };

  const handleConfirmSelection = () => {
    const slots = container.slots.filter(slot => selectedSlots.includes(slot.id));
    const totalPrice = slots.reduce((sum, slot) => sum + slot.price, 0);
    onSlotSelect(slots, totalPrice);
  };

  const occupiedSlots = container.slots.filter(slot => slot.isOccupied).length;
  const availableSlots = 20 - occupiedSlots;

  return (
    <Card className="w-full shadow-container">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Ship className="w-5 h-5 text-primary" />
            {t('container')} {container.id}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {t('departure')}: {container.departureDate.toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Package className="w-3 h-3" />
            {availableSlots}/20 {t('available')}
          </Badge>
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
            <div className="absolute -top-2 -left-2 -right-2 -bottom-2 bg-gradient-container opacity-20 rounded-xl"></div>
            <div className="relative bg-card border-2 border-maritime-container rounded-lg p-4">
              <div className="grid grid-cols-4 gap-2">
                {container.slots.map((slot) => (
                  <ContainerSlot
                    key={slot.id}
                    slot={slot}
                    onSelect={handleSlotSelect}
                    isSelected={selectedSlots.includes(slot.id)}
                    selectedSlots={mode === 'non-standard' ? calculatedSlots : selectedSlots}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Selection info */}
          {selectedSlots.length > 0 && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {t('selected')}: {selectedSlots.length} {t('slots')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('total')}: ${container.slots
                      .filter(slot => selectedSlots.includes(slot.id))
                      .reduce((sum, slot) => sum + slot.price, 0)}
                  </p>
                </div>
                <Button 
                  onClick={handleConfirmSelection}
                  className="bg-gradient-ocean hover:bg-gradient-ocean/90"
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