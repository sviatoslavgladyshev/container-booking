import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Package, Ruler, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CargoModeSelectorProps {
  mode: 'palletized' | 'non-standard';
  onModeChange: (mode: 'palletized' | 'non-standard') => void;
  dimensions?: {
    width: number;
    height: number;
    length: number;
  };
  onDimensionsChange: (dimensions: { width: number; height: number; length: number }) => void;
  weight: number;
  onWeightChange: (weight: number) => void;
}

export function CargoModeSelector({
  mode,
  onModeChange,
  dimensions,
  onDimensionsChange,
  weight,
  onWeightChange
}: CargoModeSelectorProps) {
  const { t } = useTranslation();
  const [localDimensions, setLocalDimensions] = useState(
    dimensions || { width: 1200, height: 1100, length: 2600 }
  );

  const handleDimensionChange = (field: 'width' | 'height' | 'length', value: string) => {
    const numValue = parseInt(value) || 0;
    const newDimensions = { ...localDimensions, [field]: numValue };
    setLocalDimensions(newDimensions);
    onDimensionsChange(newDimensions);
  };

  const isWeightValid = weight <= 1300;
  const standardSlotSize = "1200mm × 1100mm × 2600mm";

  return (
    <Card className="shadow-maritime">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          {t('cargoConfiguration')}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Mode Selection */}
        <div className="space-y-3">
          <Label className="text-base font-medium">{t('cargoType')}</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={mode === 'palletized' ? 'default' : 'outline'}
                  className={cn(
                    "h-auto p-4 flex flex-col items-start gap-2",
                    mode === 'palletized' && "bg-gradient-ocean"
                  )}
                  onClick={() => onModeChange('palletized')}
                >
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    <span className="font-medium">{t('palletizedCargo')}</span>
                    <HelpCircle className="w-3 h-3 opacity-50" />
                  </div>
                  <p className="text-xs text-left opacity-75">
                    {t('standardSlot')}: {standardSlotSize}
                  </p>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p dangerouslySetInnerHTML={{ __html: t('palletizedCargoDesc').replace(/\n/g, '<br/>') }} />
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={mode === 'non-standard' ? 'default' : 'outline'}
                  className={cn(
                    "h-auto p-4 flex flex-col items-start gap-2",
                    mode === 'non-standard' && "bg-gradient-ocean"
                  )}
                  onClick={() => onModeChange('non-standard')}
                >
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4" />
                    <span className="font-medium">{t('nonStandardCargo')}</span>
                    <HelpCircle className="w-3 h-3 opacity-50" />
                  </div>
                  <p className="text-xs text-left opacity-75">
                    {t('customDimensions')}, multiple {t('slots')}
                  </p>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p dangerouslySetInnerHTML={{ __html: t('nonStandardCargoDesc').replace(/\n/g, '<br/>') }} />
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Weight Input */}
        <div className="space-y-2">
          <Label htmlFor="weight" className="flex items-center gap-2">
            {t('weight')}
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="w-3 h-3 opacity-50" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('weightLimit')}</p>
              </TooltipContent>
            </Tooltip>
          </Label>
          <div className="relative">
            <Input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => onWeightChange(parseInt(e.target.value) || 0)}
              max={1300}
              className={cn(
                "pr-16",
                !isWeightValid && "border-destructive focus:border-destructive"
              )}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              kg
            </span>
          </div>
          {!isWeightValid && (
            <p className="text-sm text-destructive">
              {t('weightExceeds')}
            </p>
          )}
        </div>

        {/* Custom Dimensions for Non-Standard */}
        {mode === 'non-standard' && (
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
            <Label className="text-base font-medium">{t('customDimensions')}</Label>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width">{t('width')}</Label>
                <Input
                  id="width"
                  type="number"
                  value={localDimensions.width}
                  onChange={(e) => handleDimensionChange('width', e.target.value)}
                  placeholder="1200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">{t('height')}</Label>
                <Input
                  id="height"
                  type="number"
                  value={localDimensions.height}
                  onChange={(e) => handleDimensionChange('height', e.target.value)}
                  placeholder="1100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="length">{t('length')}</Label>
                <Input
                  id="length"
                  type="number"
                  value={localDimensions.length}
                  onChange={(e) => handleDimensionChange('length', e.target.value)}
                  placeholder="2600"
                />
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {t('standardSlot')}: {standardSlotSize}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}