import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  service?: any;
  isUpgrade?: boolean;
}

// Helper to parse price string like '₹2,499' to 2499
function parsePrice(priceStr: string) {
  if (!priceStr) return 0;
  const match = priceStr.replace(/[^\d]/g, '');
  return parseInt(match, 10) || 0;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess, service, isUpgrade = false }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');

  // Determine if this is a discovery call (Project Management Consulting)
  const isDiscoveryCall = false;

  // Safely determine amount
  let amount = 499;
  if (isUpgrade && service) {
    amount = service.upgradePrice;
  } else if (isDiscoveryCall) {
    amount = 499;
  } else if (service && service.price) {
    amount = parsePrice(service.price);
  }
  const calendlyUrl = 'https://calendly.com/phani-bozzam/30min';

  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [isOpen]);

  const handlePayment = async () => {
    setIsLoading(true);
    setPaymentStatus('pending');

    try {
      // Create order on your backend
      const orderResponse = await fetch(
        import.meta.env.PROD
          ? '/.netlify/functions/create-order'
          : 'http://localhost:5000/api/create-order',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: amount * 100, // Razorpay expects amount in paise
            currency: 'INR',
            receipt: isUpgrade ? `upgrade_${service?.id}_${Date.now()}` : `discovery_call_${Date.now()}`,
            notes: {
              service: isUpgrade ? service?.title : 'Discovery Call',
              description: isUpgrade ? `${service?.title} upgrade` : '30-minute discovery call consultation'
            }
          })
        }
      );

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await orderResponse.json();

      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY', // Replace with your Razorpay key
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'The PM Lens',
        description: isUpgrade ? `${service?.title} - Upgrade` : 'Discovery Call - 30 Minute Consultation',
        image: '/The PM Lens Logo - Dark.png',
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch(
              import.meta.env.PROD
                ? '/.netlify/functions/verify-payment'
                : 'http://localhost:5000/api/verify-payment',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                })
              }
            );

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed');
            }

            setPaymentStatus('success');
            toast({
              title: "Payment Successful!",
              description: "Thank you for your payment. We will contact you soon.",
            });

            setTimeout(() => {
              onSuccess();
              onClose();
            }, 2000);

          } catch (error) {
            setPaymentStatus('failed');
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support if the amount was deducted.",
              variant: "destructive"
            });
          }
        },
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: ''
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: function() {
            setIsLoading(false);
            setPaymentStatus('pending');
          }
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();

    } catch (error) {
      setPaymentStatus('failed');
      toast({
        title: "Payment Failed",
        description: "Unable to process payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setPaymentStatus('pending');
    handlePayment();
  };

  // Fallback UI if service is not set
  if (!service) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Loading service details...
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {isUpgrade ? `Upgrade to ${service?.title}` : isDiscoveryCall ? 'Book Discovery Call' : `Pay for ${service?.title}`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Service Details */}
          <Card className="border-blue-200 bg-blue-50/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-blue-600">
                {isUpgrade ? service?.title : isDiscoveryCall ? 'Discovery Call Package' : service?.title}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {isUpgrade ? service?.description : isDiscoveryCall ? '30-minute consultation to understand your needs' : service?.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {isUpgrade && service ? (
                service.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </div>
                ))
              ) : isDiscoveryCall ? (
                <>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Project assessment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Strategy discussion</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Service recommendations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Next steps planning</span>
                  </div>
                </>
              ) : null}
            </CardContent>
          </Card>

          {/* Customer Info (for discovery calls only) */}
          {isDiscoveryCall && !isUpgrade && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>
          )}

          {/* Price */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-200">₹{amount}</div>
            <p className="text-sm text-gray-500">
              {isUpgrade ? 'Upgrade payment (₹499 credit applied)' : isDiscoveryCall ? 'One-time payment' : 'Service payment'}
            </p>
            {isUpgrade && service && (
              <div className="mt-2 text-xs text-gray-400">
                <span className="line-through">₹{service.originalPrice}</span>
                <span className="ml-2 text-green-600 font-medium">Save ₹{service.originalPrice - service.upgradePrice}</span>
              </div>
            )}
          </div>

          {/* Payment Status */}
          {paymentStatus === 'success' && (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium text-green-800">Payment Successful!</p>
                <p className="text-sm text-green-600">Thank you for your payment.</p>
              </div>
            </div>
          )}

          {paymentStatus === 'failed' && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="font-medium text-red-800">Payment Failed</p>
                <p className="text-sm text-red-600">Please try again or contact support</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {paymentStatus === 'pending' && (
              <Button
                onClick={handlePayment}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Calendar className="mr-2 h-4 w-4" />
                    {isUpgrade ? 'Pay & Upgrade' : 'Pay Now'}
                  </>
                )}
              </Button>
            )}

            {paymentStatus === 'failed' && (
              <Button
                onClick={handleRetry}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
              >
                Try Again
              </Button>
            )}

            <Button
              variant="outline"
              onClick={onClose}
              className="w-full"
            >
              Cancel
            </Button>
          </div>

          {/* Security Notice */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              🔒 Secure payment powered by Razorpay
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal; 