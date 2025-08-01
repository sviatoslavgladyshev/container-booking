import { useTranslation } from 'react-i18next';
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export interface SlotData {
  id: number;
  price: number;
  isOccupied: boolean;
  dimensions: {
    width: number;
    height: number;
    length: number;
  };
  occupiedBy?: string;
}

interface ContainerSlotProps {
  slot: SlotData;
  onSelect: (slot: SlotData) => void;
  isSelected?: boolean;
  selectedSlots?: number[];
  className?: string; // Added to fix ts(2322)
}

export function ContainerSlot({ 
  slot, 
  onSelect, 
  isSelected = false,
  selectedSlots = [],
  className
}: ContainerSlotProps) {
  const { t } = useTranslation();
  const isPartOfSelection = selectedSlots.includes(slot.id);
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          onClick={() => !slot.isOccupied && onSelect(slot)}
          className={cn(
            "relative aspect-square border-2 rounded-lg transition-all duration-300 cursor-pointer group",
            "flex flex-col items-center justify-center p-2 text-xs font-medium",
            "hover:scale-105 hover:shadow-slot",
            slot.isOccupied 
              ? "bg-muted border-muted-foreground/30 cursor-not-allowed opacity-60" 
              : className, // Apply sector-specific styling
            (isSelected || isPartOfSelection) && "border-primary bg-primary/10 shadow-slot"
          )}
        >
          <div className="text-center">
            <div className={cn(
              "font-bold text-lg",
              !slot.isOccupied && "group-hover:text-white"
            )}>
              {slot.isOccupied ? "USED" : `$${slot.price}`}
            </div>
            <div className={cn(
              "text-muted-foreground text-xs",
              !slot.isOccupied && "group-hover:text-white"
            )}>
              Slot {slot.id}
            </div>
          </div>
          
          {(isSelected || isPartOfSelection) && (
            <div className="absolute inset-0 bg-primary/20 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-xs">✓</span>
              </div>
            </div>
          )}
        </div>
      </TooltipTrigger>
      
      <TooltipContent>
        <div className="space-y-1">
          <p className="font-semibold">Slot {slot.id}</p>
          <p>Price: ${slot.price}</p>
          {slot.isOccupied && <p className="text-destructive">Occupied by: {slot.occupiedBy}</p>}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}