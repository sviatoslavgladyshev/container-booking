import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { InvoiceData } from "./PurchaseModal";
import { generateInvoicePDF } from "@/lib/pdfGenerator";
import { 
  FileText, 
  Download, 
  Printer, 
  Calendar, 
  Package, 
  MapPin, 
  User,
  Truck,
  QrCode
} from "lucide-react";

interface InvoiceDocumentProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceData: InvoiceData;
}

export function InvoiceDocument({ isOpen, onClose, invoiceData }: InvoiceDocumentProps) {
  const { t, i18n } = useTranslation();
  const [showBarcode, setShowBarcode] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    generateInvoicePDF(invoiceData, { language: i18n.language as 'en' | 'ru' | 'zh' });
  };

  const generateInvoiceText = () => {
    return `
${t('marineContainerServices').toUpperCase()} ${t('invoice').toUpperCase()}
${new Date().toLocaleDateString()}

${t('invoice')} ID: ${invoiceData.id}
${t('barcode')}: ${invoiceData.barcode}
Tracking: ${invoiceData.shippingDetails.trackingNumber}

${t('customerInfo').toUpperCase()}:
${t('fullName')}: ${invoiceData.customerInfo.name}
${t('emailField')}: ${invoiceData.customerInfo.email}
${t('phoneField')}: ${invoiceData.customerInfo.phone}
${invoiceData.customerInfo.company ? `${t('companyField')}: ${invoiceData.customerInfo.company}\n` : ''}
${t('addressField')}: ${invoiceData.customerInfo.address}
${t('cityField')}: ${invoiceData.customerInfo.city}
${t('countryField')}: ${invoiceData.customerInfo.country}
${invoiceData.customerInfo.postalCode ? `${t('postalCodeField')}: ${invoiceData.customerInfo.postalCode}\n` : ''}

${t('shippingDetails').toUpperCase()}:
${t('container')} ID: ${invoiceData.containerInfo.id}
${t('departure')}: ${invoiceData.containerInfo.departureDate.toLocaleDateString()}
${t('shippingDestination')}: ${invoiceData.shippingDetails.destination}
Estimated Arrival: ${invoiceData.shippingDetails.estimatedArrival.toLocaleDateString()}

${t('bookedSlots').toUpperCase()}:
${invoiceData.slots.map(slot => 
  `${t('slotId')} ${slot.id}: ${slot.dimensions.width}×${slot.dimensions.height}×${slot.dimensions.length}mm - $${slot.price}`
).join('\n')}

${t('totalAmountLabel')} $${invoiceData.totalPrice}
Purchase ${t('date')}: ${invoiceData.purchaseDate.toLocaleDateString()}

${t('thankYou')}
    `.trim();
  };

  const generateBarcodePattern = (code: string) => {
    // Simple barcode pattern generator (for display purposes)
    return code.split('').map((char, index) => (
      <div
        key={index}
        className={`w-1 bg-foreground ${
          parseInt(char, 36) % 2 === 0 ? 'h-12' : 'h-8'
        }`}
      />
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            {t('invoiceShippingDoc')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 print:space-y-4">
          {/* Action Buttons */}
          <div className="flex justify-end gap-2 print:hidden">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              {t('print')}
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              {t('download')}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowBarcode(!showBarcode)}
            >
              <QrCode className="w-4 h-4 mr-2" />
              {showBarcode ? t('hideBarcode') : t('showBarcode')}
            </Button>
          </div>

          {/* Invoice Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-primary">{t('marineContainerServices')}</h1>
                  <p className="text-muted-foreground">{t('professionalShipping')}</p>
                </div>
                <div className="text-right">
                  <Badge variant="default" className="mb-2">
                    {t('invoice')} #{invoiceData.id}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {t('date')}: {invoiceData.purchaseDate.toLocaleDateString()}
                  </p>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {t('billTo')}
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{invoiceData.customerInfo.name}</p>
                    {invoiceData.customerInfo.company && (
                      <p>{invoiceData.customerInfo.company}</p>
                    )}
                    <p>{invoiceData.customerInfo.address}</p>
                    <p>{invoiceData.customerInfo.city}, {invoiceData.customerInfo.country}</p>
                    {invoiceData.customerInfo.postalCode && (
                      <p>{invoiceData.customerInfo.postalCode}</p>
                    )}
                    <p>{invoiceData.customerInfo.email}</p>
                    <p>{invoiceData.customerInfo.phone}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    {t('shippingDetails')}
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">{t('container')}:</span> {invoiceData.containerInfo.id}</p>
                    <p><span className="font-medium">{t('departure')}:</span> {invoiceData.containerInfo.departureDate.toLocaleDateString()}</p>
                    <p><span className="font-medium">{t('shippingDestination')}:</span> {invoiceData.shippingDetails.destination}</p>
                    <p><span className="font-medium">Est. Arrival:</span> {invoiceData.shippingDetails.estimatedArrival.toLocaleDateString()}</p>
                    <p><span className="font-medium">Tracking #:</span> {invoiceData.shippingDetails.trackingNumber}</p>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Booked Slots */}
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  {t('bookedSlots')}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">{t('slotId')}</th>
                        <th className="text-left py-2">{t('dimensions')}</th>
                        <th className="text-left py-2">{t('maxWeight')}</th>
                        <th className="text-right py-2">{t('price')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceData.slots.map(slot => (
                        <tr key={slot.id} className="border-b">
                          <td className="py-2">{t('slotId')} {slot.id}</td>
                          <td className="py-2">
                            {slot.dimensions.width} × {slot.dimensions.height} × {slot.dimensions.length}
                          </td>
                          <td className="py-2">{slot.maxWeight}kg</td>
                          <td className="py-2 text-right">${slot.price}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 font-bold">
                        <td colSpan={3} className="py-3 text-right">{t('totalAmountLabel')}</td>
                        <td className="py-3 text-right text-lg">${invoiceData.totalPrice}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Barcode Section */}
              {showBarcode && (
                <>
                  <Separator className="my-4" />
                  <div className="text-center space-y-4">
                    <h3 className="font-semibold text-lg">{t('shippingBarcode')}</h3>
                    <div className="flex justify-center items-end gap-1 p-4 bg-muted/30 rounded-lg">
                      {generateBarcodePattern(invoiceData.barcode)}
                    </div>
                    <div className="text-sm font-mono tracking-wider">
                      {invoiceData.barcode}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t('presentBarcode')}
                    </p>
                  </div>
                </>
              )}

              {/* Footer */}
              <Separator className="my-6" />
              <div className="text-center text-sm text-muted-foreground">
                <p>{t('thankYou')}</p>
                <p>{t('support')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}