import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight, Star, Clock, Shield } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import PaymentModal from '@/components/PaymentModal';

const Upgrade = () => {
  const [searchParams] = useSearchParams();
  const [paymentId, setPaymentId] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const paymentIdFromUrl = searchParams.get('payment_id');
    if (paymentIdFromUrl) {
      setPaymentId(paymentIdFromUrl);
      // In production, you'd verify this payment ID with your backend
      console.log('Payment ID from URL:', paymentIdFromUrl);
    }
    setIsLoading(false);
  }, [searchParams]);

  const upgradeServices = [
    {
      id: 'linkedin-coaching',
      title: "LinkedIn Growth Coaching",
      originalPrice: 1499,
      upgradePrice: 1000,
      description: "Strategic LinkedIn optimization for thought leaders and consultants",
      features: [
        "Profile optimization",
        "Content strategy development",
        "Engagement tactics",
        "Network building strategies",
        "Analytics tracking",
        "Monthly check-ins"
      ],
      badge: "Most Popular",
      color: "blue",
      popular: true
    },
    {
      id: 'ai-content-strategy',
      title: "AI Content Strategy",
      originalPrice: 2999,
      upgradePrice: 2500,
      description: "Data-driven content frameworks and AI-powered copywriting",
      features: [
        "Content strategy development",
        "AI-powered copywriting",
        "SEO optimization",
        "Brand voice development",
        "Content calendar planning",
        "Performance analytics"
      ],
      badge: "New",
      color: "purple",
      popular: false
    },
    {
      id: 'pm-consulting',
      title: "Project Management Consulting",
      originalPrice: 2499,
      upgradePrice: 2000,
      description: "Agile/Scrum implementation and cloud PM strategies",
      features: [
        "Agile methodology implementation",
        "Team performance optimization",
        "Project roadmap development",
        "Risk assessment & mitigation",
        "Stakeholder communication strategies",
        "Ongoing support & guidance"
      ],
      badge: "Trending",
      color: "orange",
      popular: false
    }
  ];

  const handleUpgrade = (service) => {
    setSelectedService(service);
    setShowPaymentModal(true);
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        border: 'border-blue-500',
        bg: 'bg-blue-500',
        text: 'text-blue-500',
        hover: 'hover:bg-blue-600',
        badge: 'bg-blue-500 text-white'
      },
      purple: {
        border: 'border-purple-500',
        bg: 'bg-purple-500',
        text: 'text-purple-500',
        hover: 'hover:bg-purple-600',
        badge: 'bg-purple-500 text-white'
      },
      orange: {
        border: 'border-orange-500',
        bg: 'bg-orange-500',
        text: 'text-orange-500',
        hover: 'hover:bg-orange-600',
        badge: 'bg-orange-500 text-white'
      }
    };
    return colors[color] || colors.blue;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your upgrade offers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="container mx-auto max-w-6xl py-20 px-4">
        <div className="text-center mb-16">
          <div className="mb-6">
            <Badge className="bg-green-500 text-white px-4 py-2 text-lg">
              <Check className="mr-2 h-4 w-4" />
              Discovery Call Booked
            </Badge>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
            Your Special Upgrade Offers
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Since you've invested in understanding your needs, enjoy exclusive pricing on our coaching services
          </p>
          <div className="mt-6 flex items-center justify-center gap-4 text-gray-400">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Valid for 7 days</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>₹499 credit applied</span>
            </div>
          </div>
        </div>

        {/* Upgrade Services */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {upgradeServices.map((service, index) => {
            const colors = getColorClasses(service.color);
            return (
              <Card 
                key={service.id}
                className={`relative transition-all duration-300 hover:scale-105 ${
                  service.popular 
                    ? 'ring-2 ring-purple-500 shadow-xl' 
                    : 'hover:shadow-lg'
                }`}
              >
                {service.badge && (
                  <Badge 
                    variant="secondary" 
                    className={`absolute -top-3 left-4 z-10 px-3 py-1 ${colors.badge}`}
                  >
                    {service.badge}
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl text-white mb-3">
                    {service.title}
                  </CardTitle>
                  <div className="mb-3">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-3xl font-bold text-white">₹{service.upgradePrice}</span>
                      <span className="text-gray-400 text-lg">/Session</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-gray-500 line-through text-sm">₹{service.originalPrice}</span>
                      <Badge className="bg-green-500 text-white text-xs">
                        Save ₹{service.originalPrice - service.upgradePrice}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="text-gray-400 text-sm">
                    {service.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full mt-6 ${colors.bg} ${colors.hover} text-white`}
                    onClick={() => handleUpgrade(service)}
                  >
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Upgrade Now
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="text-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-12 border border-blue-500/20">
          <h2 className="text-2xl font-bold mb-4 gradient-text">
            Not sure which service to choose?
          </h2>
          <p className="text-lg text-gray-400 mb-6 max-w-2xl mx-auto">
            During your discovery call, we'll discuss your specific needs and recommend the best service for your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="outline" 
              className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white px-8 py-4 text-lg rounded-xl"
              onClick={() => window.open('https://calendly.com/phani-bozzam/30min', '_blank')}
            >
              <Clock className="mr-3 h-5 w-5" />
              Schedule Discovery Call
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-gray-500 text-gray-400 hover:bg-gray-500 hover:text-white px-8 py-4 text-lg rounded-xl"
              onClick={() => window.history.back()}
            >
              Back to Website
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {selectedService && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setShowPaymentModal(false);
            toast({
              title: "Upgrade Successful!",
              description: `You've successfully upgraded to ${selectedService.title}. We'll contact you soon to schedule your session.`,
            });
          }}
          service={selectedService}
          isUpgrade={true}
        />
      )}
    </div>
  );
};

export default Upgrade; 