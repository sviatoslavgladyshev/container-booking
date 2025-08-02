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
  onTabChange: (tab: string) => void;
}

export function CargoModeSelector({
  mode,
  onModeChange,
  dimensions,
  onDimensionsChange,
  onTabChange
}: CargoModeSelectorProps) {
  const { t } = useTranslation();
  const [localDimensions, setLocalDimensions] = useState(
    dimensions || { width: 1100, height: 2500, length: 1200 }
  );

  const handleDimensionChange = (field: 'width' | 'height' | 'length', value: string) => {
    const numValue = parseInt(value) || 0;
    const newDimensions = { ...localDimensions, [field]: numValue };
    setLocalDimensions(newDimensions);
    onDimensionsChange(newDimensions);
  };

  const standardSlotSize = t('standardSlotSize'); // Use translation key for consistency

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

        {/* Standard Dimensions for Palletized */}
        {mode === 'palletized' && (
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
            <Label className="text-base font-medium">{t('standardDimensions')}</Label>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pallet-length">{t('length')}</Label>
                <Input
                  id="pallet-length"
                  type="text"
                  value="1200"
                  readOnly
                  className="bg-muted text-muted-foreground cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pallet-width">{t('width')}</Label>
                <Input
                  id="pallet-width"
                  type="text"
                  value="1100"
                  readOnly
                  className="bg-muted text-muted-foreground cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pallet-height">{t('height')}</Label>
                <Input
                  id="pallet-height"
                  type="text"
                  value="2500"
                  readOnly
                  className="bg-muted text-muted-foreground cursor-not-allowed"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
            <Button
              variant="link"
              className="p-0 h-auto text-xs"
              onClick={() => onTabChange('size')}
            >
              {t('viewSlotDetails')}
            </Button>
          </div>
        )}

        {/* Custom Dimensions for Non-Standard */}
        {mode === 'non-standard' && (
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
            <Label className="text-base font-medium">{t('customDimensions')}</Label>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="length">{t('length')}</Label>
                <Input
                  id="length"
                  type="number"
                  value={localDimensions.length}
                  onChange={(e) => handleDimensionChange('length', e.target.value)}
                  placeholder="1200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="width">{t('width')}</Label>
                <Input
                  id="width"
                  type="number"
                  value={localDimensions.width}
                  onChange={(e) => handleDimensionChange('width', e.target.value)}
                  placeholder="1100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">{t('height')}</Label>
                <Input
                  id="height"
                  type="number"
                  value={localDimensions.height}
                  onChange={(e) => handleDimensionChange('height', e.target.value)}
                  placeholder="2500"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
            <Button
              variant="link"
              className="p-0 h-auto text-xs"
              onClick={() => onTabChange('size')}
            >
              {t('viewSlotDetails')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


// 12.031X2.348X2.7