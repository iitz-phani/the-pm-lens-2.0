import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Check, ArrowRight } from 'lucide-react';
import { Link } from "react-router-dom";
import PaymentModal from '@/components/PaymentModal';

const Pricing = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  const pricingTiers = [
    {
      title: "AI + UI/UX Design & Development",
      price: "Custom Quote",
      description: "End-to-end product design and development powered by AI and modern UX principles.",
      features: [
        "AI-driven user research & insights",
        "Rapid prototyping & wireframing",
        "Modern, accessible UI design",
        "Personalized user experiences",
        "Full-stack development & launch",
        "Ongoing optimization with AI analytics"
      ],
      badge: "New",
      cta: "Get Started",
      popular: true
    },
    {
      title: "Project Management Consulting",
      price: "₹2,499",
      description: "Per session - Agile/Scrum implementation and cloud PM strategies",
      features: [
        "Agile methodology implementation",
        "Team performance optimization",
        "Project roadmap development",
        "Risk assessment & mitigation",
        "Stakeholder communication strategies",
        "Ongoing support & guidance"
      ],
      badge: "Most Popular",
      cta: "Get Started",
      popular: false
    },
    {
      title: "AI Content Strategy",
      price: "₹2,999",
      description: "Per session - Data-driven content frameworks and copywriting",
      features: [
        "Content strategy development",
        "AI-powered copywriting",
        "SEO optimization",
        "Brand voice development",
        "Content calendar planning",
        "Performance analytics"
      ],
      badge: "New",
      cta: "Learn More",
      popular: false
    },
    {
      title: "LinkedIn Growth Coaching",
      price: "₹1,499",
      description: "Per session - Strategic LinkedIn optimization for thought leaders",
      features: [
        "Profile optimization",
        "Content strategy",
        "Engagement tactics",
        "Network building",
        "Analytics tracking",
        "Monthly check-ins"
      ],
      badge: "Trending",
      cta: "Start Growing",
      popular: false
    }
  ];

  const additionalServices = [
    {
      title: "Course Improvement & Design",
      price: "₹1,999",
      description: "Transform your training programs with proven instructional design methods"
    },
    {
      title: "Python & Automation",
      price: "₹1,499",
      description: "Custom automation solutions to streamline your business processes"
    },
    {
      title: "YouTube Shorts Scripting",
      price: "₹1,199",
      description: "Viral-ready short-form content that drives engagement and growth"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="container mx-auto max-w-6xl py-20 px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
            Pricing & Services
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Transparent pricing for project management consulting and AI content strategy services
          </p>
        </div>

        {/* Main Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {pricingTiers.map((tier, index) => (
            <Card 
              key={index} 
              className={`relative transition-all duration-300 hover:scale-105 ${
                tier.popular 
                  ? 'ring-2 ring-purple-500 shadow-xl' 
                  : 'hover:shadow-lg'
              }`}
            >
              {tier.badge && (
                <Badge 
                  variant="secondary" 
                  className={`absolute -top-3 left-4 z-10 px-3 py-1 ${
                    tier.popular 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-blue-500/20 text-blue-400'
                  }`}
                >
                  {tier.badge}
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl text-white mb-3">
                  {tier.title}
                </CardTitle>
                <div className="mb-3">
                  <span className="text-4xl font-bold text-white">{tier.price}</span>
                  {tier.price !== "₹499" && <span className="text-gray-400 text-lg">/Session</span>}
                </div>
                <CardDescription className="text-gray-400 text-sm">
                  {tier.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full mt-6 ${
                    tier.popular 
                      ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                  onClick={() => setShowPaymentModal(true)}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {tier.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Services */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10 gradient-text">
            Additional Services
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {additionalServices.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-white mb-2">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-gray-400 text-sm">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-2xl font-bold text-blue-400">{service.price}/Session</p>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                    onClick={() => setShowPaymentModal(true)}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-12 border border-blue-500/20">
          <h2 className="text-3xl font-bold mb-4 gradient-text">
            Ready to Accelerate Your Success?
          </h2>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Let's discuss how I can help you achieve your project management and content strategy goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 text-lg rounded-xl"
              onClick={() => setShowPaymentModal(true)}
            >
              <Calendar className="mr-3 h-5 w-5" />
              Book Discovery Call - ₹499
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white px-8 py-4 text-lg rounded-xl"
              asChild
            >
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={() => {
          setShowPaymentModal(false);
        }}
      />
    </div>
  );
};

export default Pricing; 