import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { SlotData } from "./ContainerSlot";
import { 
  CreditCard, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Package, 
  Calendar,
  DollarSign,
  Truck
} from "lucide-react";

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSlots: SlotData[];
  totalPrice: number;
  containerInfo: {
    id: string;
    departureDate: Date;
  };
  onPurchaseComplete: (invoiceData: InvoiceData) => void;
}

export interface InvoiceData {
  id: string;
  customerInfo: CustomerInfo;
  slots: SlotData[];
  containerInfo: {
    id: string;
    departureDate: Date;
  };
  totalPrice: number;
  purchaseDate: Date;
  barcode: string;
  shippingDetails: ShippingDetails;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  company?: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

interface ShippingDetails {
  destination: string;
  estimatedArrival: Date;
  trackingNumber: string;
}

export function PurchaseModal({
  isOpen,
  onClose,
  selectedSlots,
  totalPrice,
  containerInfo,
  onPurchaseComplete
}: PurchaseModalProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState<'details' | 'payment' | 'processing'>('details');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    country: '',
    postalCode: ''
  });

  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    destination: '',
    estimatedArrival: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    trackingNumber: ''
  });

  const handleCustomerInfoChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleShippingChange = (field: keyof ShippingDetails, value: string | Date) => {
    setShippingDetails(prev => ({ ...prev, [field]: value }));
  };

  const generateBarcode = () => {
    return `MC${containerInfo.id}${Date.now().toString().slice(-6)}`;
  };

  const generateTrackingNumber = () => {
    return `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  };

  const handleProceedToPayment = () => {
    if (validateCustomerInfo()) {
      setStep('payment');
    }
  };

  const validateCustomerInfo = () => {
    return customerInfo.name && customerInfo.email && customerInfo.phone && 
           customerInfo.address && customerInfo.city && customerInfo.country;
  };

  const handlePayment = () => {
    setStep('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      const invoiceData: InvoiceData = {
        id: `INV-${Date.now()}`,
        customerInfo,
        slots: selectedSlots,
        containerInfo,
        totalPrice,
        purchaseDate: new Date(),
        barcode: generateBarcode(),
        shippingDetails: {
          ...shippingDetails,
          trackingNumber: generateTrackingNumber()
        }
      };
      
      onPurchaseComplete(invoiceData);
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            {t('completeBooking')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('orderSummary')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>{t('container')} {containerInfo.id}</span>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {containerInfo.departureDate.toLocaleDateString()}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  {selectedSlots.map(slot => (
                    <div key={slot.id} className="flex items-center justify-between text-sm">
                      <span>{t('slotId')} {slot.id} ({slot.dimensions.width}×{slot.dimensions.height}×{slot.dimensions.length}mm)</span>
                      <span>${slot.price}</span>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between font-bold text-lg">
                  <span>{t('total')}</span>
                  <span>${totalPrice}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step Content */}
          {step === 'details' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {t('customerShippingInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Info */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-base border-b pb-2">{t('customerInfo')}</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('fullName')} *</Label>
                      <Input
                        id="name"
                        value={customerInfo.name}
                        onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">{t('emailField')} *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                        placeholder="john@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('phoneField')} *</Label>
                      <Input
                        id="phone"
                        value={customerInfo.phone}
                        onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">{t('companyField')}</Label>
                      <Input
                        id="company"
                        value={customerInfo.company}
                        onChange={(e) => handleCustomerInfoChange('company', e.target.value)}
                        placeholder="Acme Corp"
                      />
                    </div>
                  </div>

                  {/* Address Info */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-base border-b pb-2">{t('addressInfo')}</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">{t('addressField')} *</Label>
                      <Input
                        id="address"
                        value={customerInfo.address}
                        onChange={(e) => handleCustomerInfoChange('address', e.target.value)}
                        placeholder="123 Main Street"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label htmlFor="city">{t('cityField')} *</Label>
                        <Input
                          id="city"
                          value={customerInfo.city}
                          onChange={(e) => handleCustomerInfoChange('city', e.target.value)}
                          placeholder="New York"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="postalCode">{t('postalCodeField')}</Label>
                        <Input
                          id="postalCode"
                          value={customerInfo.postalCode}
                          onChange={(e) => handleCustomerInfoChange('postalCode', e.target.value)}
                          placeholder="10001"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">{t('countryField')} *</Label>
                      <Input
                        id="country"
                        value={customerInfo.country}
                        onChange={(e) => handleCustomerInfoChange('country', e.target.value)}
                        placeholder="United States"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="destination">{t('shippingDestination')}</Label>
                      <Input
                        id="destination"
                        value={shippingDetails.destination}
                        onChange={(e) => handleShippingChange('destination', e.target.value)}
                        placeholder="Port of destination"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <Button 
                    onClick={handleProceedToPayment}
                    disabled={!validateCustomerInfo()}
                    variant="ocean"
                    size="lg"
                  >
                    {t('proceedToPayment')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 'payment' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  {t('paymentInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-center text-lg font-semibold">
                      {t('totalAmount')}: ${totalPrice}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">{t('cardNumber')}</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardName">{t('cardholderName')}</Label>
                      <Input
                        id="cardName"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="expiry">{t('expiryDate')}</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cvv">{t('cvv')}</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between mt-6">
                    <Button 
                      variant="outline" 
                      onClick={() => setStep('details')}
                    >
                      {t('back')}
                    </Button>
                    <Button 
                      onClick={handlePayment}
                      variant="container"
                      size="lg"
                      className="flex items-center gap-2"
                    >
                      <DollarSign className="w-4 h-4" />
                      {t('completePayment')} ${totalPrice}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 'processing' && (
            <Card>
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-ocean rounded-full flex items-center justify-center animate-pulse">
                    <CreditCard className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">{t('processingPayment')}</h3>
                  <p className="text-muted-foreground">
                    {t('processingDesc')}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}