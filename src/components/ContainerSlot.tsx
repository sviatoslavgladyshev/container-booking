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
  weight?: number;
  maxWeight: number;
  occupiedBy?: string;
}

interface ContainerSlotProps {
  slot: SlotData;
  onSelect: (slot: SlotData) => void;
  isSelected?: boolean;
  selectedSlots?: number[];
}

export function ContainerSlot({ 
  slot, 
  onSelect, 
  isSelected = false,
  selectedSlots = []
}: ContainerSlotProps) {
  const isPartOfSelection = selectedSlots.includes(slot.id);
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          onClick={() => !slot.isOccupied && onSelect(slot)}
          className={cn(
            "relative aspect-square border-2 rounded-lg transition-all duration-300 cursor-pointer",
            "flex flex-col items-center justify-center p-2 text-xs font-medium",
            "hover:scale-105 hover:shadow-slot",
            slot.isOccupied 
              ? "bg-muted border-muted-foreground/30 cursor-not-allowed opacity-60" 
              : "bg-card border-border hover:border-primary/50",
            (isSelected || isPartOfSelection) && "border-primary bg-primary/10 shadow-slot",
            !slot.isOccupied && "hover:bg-gradient-container"
          )}
        >
          <div className="text-center">
            <div className="font-bold text-lg">
              {slot.isOccupied ? "USED" : `$${slot.price}`}
            </div>
            <div className="text-muted-foreground text-xs">
              Slot {slot.id}
            </div>
            {slot.weight && (
              <Badge variant="secondary" className="mt-1 text-xs">
                {slot.weight}kg
              </Badge>
            )}
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
          <p>Dimensions: {slot.dimensions.width} × {slot.dimensions.height} × {slot.dimensions.length} mm</p>
          <p>Max Weight: {slot.maxWeight}kg</p>
          <p>Price: ${slot.price}</p>
          {slot.isOccupied && <p className="text-destructive">Occupied by: {slot.occupiedBy}</p>}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}