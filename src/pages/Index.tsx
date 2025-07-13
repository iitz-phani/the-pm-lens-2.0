import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Calendar, BookOpen, Youtube, Linkedin, Palette, Figma, Layers, Eye, Code, Smartphone, Monitor, Check, X, Clock, Sun, Moon } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import PaymentModal from '@/components/PaymentModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const Index = () => {
  const [isVisible, setIsVisible] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    verificationCode: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showUIDesignModal, setShowUIDesignModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showTimerPopup, setShowTimerPopup] = useState(false);
  const [minimizedPopup, setMinimizedPopup] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored) return stored;
      // Default to dark theme
      return 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: true
          }));
        }
      });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('[id^="section-"]');
    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Timer popup effect
  useEffect(() => {
    const hideUntil = localStorage.getItem('hideTimerPopupUntil');
    const now = Date.now();
    if (hideUntil && now < parseInt(hideUntil, 10)) {
      // Still within the hidden period, do not show popup
      return;
    }
    const timer = setTimeout(() => {
      setShowTimerPopup(true);
    }, 30000); // 30 seconds
    return () => clearTimeout(timer);
  }, []);

  // Hide popup for 3 days (in ms)
  const hidePopupFor3Days = () => {
    const threeDays = 3 * 24 * 60 * 60 * 1000;
    localStorage.setItem('hideTimerPopupUntil', (Date.now() + threeDays).toString());
  };

  // Countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if ((showTimerPopup || minimizedPopup) && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev > 0 ? prev - 1 : 0);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showTimerPopup, minimizedPopup, countdown]);

  // Format countdown mm:ss
  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const services = [
    {
      title: "Project Management Consulting",
      description: "Agile/Scrum implementation for   high-growth teams",
      badge: "Most Popular"
    },
    {
      title: "AI Content Strategy & Copy",
      description: "Data-driven content frameworks that convert and scale your brand",
      badge: "New"
    },
    {
      title: "LinkedIn Growth Coaching",
      description: "Strategic LinkedIn optimization for thought leaders and consultants",
      badge: ""
    },
    {
      title: "Python & Automation Projects",
      description: "Custom automation solutions to streamline your business processes",
      badge: ""
    },
    {
      title: "YouTube Shorts Scripting",
      description: "Viral-ready short-form content that drives engagement and growth",
      badge: "Trending"
    },
    {
      title: "AI + UI/UX Design and Development",
      description: "End-to-end UI/UX design and development for your digital products.",
      badge: "New"
    }
  ];

  const portfolioItems = [
    {
      title: "View My Contributions",
      description: "Explore my open-source work, side projects, and professional contributions on GitHub.",
      metric: "GitHub",
      link: "https://github.com/iitz-phani"
    }
  ];

  const designSkills = [
    {
      title: "UI/UX Design",
      description: "User-centered design with focus on usability and accessibility",
      icon: <Eye className="h-6 w-6" />,
      tools: ["Figma", "Adobe XD", "Sketch", "InVision"],
      badge: "Core Skill"
    },
    {
      title: "Visual Design",
      description: "Brand identity, typography, and visual communication",
      icon: <Palette className="h-6 w-6" />,
      tools: ["Adobe Creative Suite", "Canva Pro", "Figma"],
      badge: ""
    },
    {
      title: "Prototyping",
      description: "Interactive prototypes and user flow design",
      icon: <Layers className="h-6 w-6" />,
      tools: ["Figma", "Principle", "Marvel", "Adobe XD"],
      badge: ""
    },
    {
      title: "Design Systems",
      description: "Component libraries and design consistency",
      icon: <Code className="h-6 w-6" />,
      tools: ["Figma", "Storybook", "Design Tokens"],
      badge: "Advanced"
    },
    {
      title: "Mobile Design",
      description: "Native and responsive mobile app design",
      icon: <Smartphone className="h-6 w-6" />,
      tools: ["Figma", "Sketch", "iOS/Android Guidelines"],
      badge: ""
    },
    {
      title: "Web Design",
      description: "Modern web interfaces and responsive design",
      icon: <Monitor className="h-6 w-6" />,
      tools: ["Figma", "Adobe XD", "HTML/CSS", "Tailwind"],
      badge: ""
    }
  ];

  const designProjects = [
    {
      title: "E-commerce App Redesign",
      description: "Complete UI/UX overhaul resulting in 40% increase in conversion",
      category: "Mobile App",
      image: "/images/ecommerce-design.svg"
    },
    {
      title: "Brand Identity Package",
      description: "Logo, color palette, and brand guidelines for tech startup",
      category: "Branding",
      image: "/images/brand-identity.svg"
    },
    {
      title: "Dashboard Design System",
      description: "Component library and design tokens for enterprise platform",
      category: "Design System",
      image: "/images/dashboard.svg"
    }
  ];

  const uiuxCategories = [
    {
      main: 'UI Design',
      subs: [
        { name: 'Web App Interfaces', pricing: 'Per screen: ₹2,000 – ₹5,000/screen\nFull project: ₹50,000 – ₹1,50,000' },
        { name: 'Mobile App Interfaces', pricing: 'Per screen: ₹1,500 – ₹4,000/screen\nFull app (8–12 screens): ₹40,000 – ₹1,20,000' },
        { name: 'E-commerce UI', pricing: 'Fixed + Pages: ₹75,000 – ₹2,00,000\nProduct Catalog only: ₹30,000 – ₹60,000' },
      ]
    },
    {
      main: 'UX Design',
      subs: [
        { name: 'Wireframing & Prototyping', pricing: 'Per screen/wireframe: ₹1,000 – ₹2,500/screen\nEnd-to-end flows: ₹25,000 – ₹75,000' },
        { name: 'User Flows & Interaction Design', pricing: 'Per flow: ₹5,000 – ₹15,000/flow\nFull journey map: ₹25,000 – ₹60,000' },
        { name: 'Usability Testing & Reporting', pricing: 'Per session/user: ₹5,000 – ₹10,000\nFull report: ₹15,000 – ₹50,000' },
      ]
    },
    {
      main: 'Web & Mobile App Design',
      subs: [
        { name: 'Full Product UI/UX Design', pricing: 'End-to-end project: ₹1,00,000 – ₹4,00,000\nSaaS or Dashboard: ₹1,50,000 – ₹3,50,000' },
        { name: 'Redesign of Existing Products', pricing: 'Based on audit scope: ₹60,000 – ₹2,00,000' },
        { name: 'MVP UX for Startups', pricing: 'Fixed: ₹50,000 – ₹1,50,000\nSprint model: ₹30,000/sprint' },
        { name: 'No-Code UX (WordPress)', pricing: 'Fixed (5–10 pages): ₹40,000 – ₹1,20,000' },
      ]
    },
    {
      main: 'Consulting & Strategy',
      subs: [
        { name: 'UX Workshops (For Teams/Clients)', pricing: 'Half or full-day: ₹15,000 – ₹50,000/day\nMulti-day engagement: ₹75,000 – ₹2,00,000' },
        { name: 'Design Sprint Facilitation', pricing: '1-week engagement: ₹75,000 – ₹1,50,000' },
        { name: 'Product/UX Roadmap Consulting', pricing: 'Hourly or Monthly: ₹2,000 – ₹4,000/hr or ₹40,000 – ₹1,00,000/month' },
      ]
    },
  ];

  const [selectedMain, setSelectedMain] = useState('');
  const [selectedSub, setSelectedSub] = useState('');

  const selectedCategory = uiuxCategories.find(cat => cat.main === selectedMain);
  const selectedSubObj = selectedCategory?.subs.find(sub => sub.name === selectedSub);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Reset verification when email changes
    if (name === 'email') {
      setEmailVerified(false);
      setVerificationSent(false);
      setFormData(prev => ({ ...prev, verificationCode: '' }));
    }
  };

  const sendVerificationCode = async () => {
    if (!formData.email || !formData.email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);

    try {
      const response = await fetch(
        import.meta.env.PROD
          ? '/.netlify/functions/simple-verification'
          : 'http://localhost:5000/api/send-verification',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email: formData.email,
            action: 'send'
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to send verification code');
      }

      const data = await response.json();
      setVerificationSent(true);
      
      console.log('Full response data:', data);
      
      if (data.emailSent) {
        // Email was sent successfully
        console.log('✅ Email sent successfully to:', data.email);
        console.log('📧 Message ID:', data.messageId);
        
        toast({
          title: "✅ Verification Code Sent!",
          description: "Please check your email for the verification code.",
          duration: 5000,
        });
      } else {
        // Email failed - show error message
        console.log('❌ Email delivery failed');
        console.log('📧 Email:', data.email);
        console.log('❌ Email Error:', data.emailError);
        
        toast({
          title: "❌ Email Delivery Failed",
          description: "Unable to send verification code. Please try again later.",
          variant: "destructive",
          duration: 8000,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to send verification code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const verifyCode = async () => {
    if (!formData.verificationCode || formData.verificationCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter the 6-digit verification code.",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);

    try {
      const response = await fetch(
        import.meta.env.PROD
          ? '/.netlify/functions/simple-verification'
          : 'http://localhost:5000/api/verify-code',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email: formData.email, 
            code: formData.verificationCode,
            action: 'verify'
          })
        }
      );

      if (!response.ok) {
        throw new Error('Invalid verification code');
      }

      setEmailVerified(true);
      toast({
        title: "Email Verified!",
        description: "Your email has been successfully verified.",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Verification Failed",
        description: "Invalid verification code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailVerified) {
      toast({
        title: "Email Not Verified",
        description: "Please verify your email address before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        import.meta.env.PROD
          ? '/.netlify/functions/contact'
          : 'http://localhost:5000/api/contact',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            message: formData.message
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      console.log('Response:', data);

      toast({
        title: "Message Sent!",
        description: "Thank you for your message. I'll get back to you soon.",
      });

      // Clear the form
      setFormData({
        name: '',
        email: '',
        message: '',
        verificationCode: ''
      });
      setEmailVerified(false);
      setVerificationSent(false);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-dark-bg text-white' : 'bg-white text-black'}`}>
      {/* Sticky CTA Bar */}
      <div className={`fixed top-0 left-0 right-0 z-40 border-b transition-colors duration-300 ${theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-gray-50 border-gray-200'}`}>
        <div className="container mx-auto px-6 py-1 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img 
              src={theme === 'dark' ? '/The PM Lens Logo.png' : '/The PM Lens Logo - Dark.png'} 
              alt="The PM Lens Logo" 
              className="h-16 w-auto cursor-pointer" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            />
          </div>
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-6">
              <a onClick={() => scrollToSection('section-about')} className={`cursor-pointer transition-colors ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-black hover:text-blue-600'}`}>About</a>
              <a onClick={() => scrollToSection('section-services')} className={`cursor-pointer transition-colors ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-black hover:text-blue-600'}`}>Services</a>
              <a onClick={() => scrollToSection('section-blog')} className={`cursor-pointer transition-colors ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-black hover:text-blue-600'}`}>Blog</a>
              <Link to="/pricing" className={`cursor-pointer transition-colors ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-black hover:text-blue-600'}`}>Pricing</Link>
              <a onClick={() => scrollToSection('section-contact')} className={`cursor-pointer transition-colors ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-black hover:text-blue-600'}`}>Contact</a>
            </nav>
            <Button 
              className="bg-brand-blue hover:bg-brand-blue-dark transition-all duration-300 animate-glow flex items-center"
              onClick={() => {
                setSelectedService({ title: 'Discovery Call', price: '₹499', description: 'Book a 30-minute discovery call.' });
                setShowPaymentModal(true);
              }}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Book a Call
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Floating CTA */}
      <Button 
        className="fixed bottom-6 right-6 z-50 bg-brand-blue hover:bg-brand-blue-dark rounded-full p-4 shadow-lg animate-bounce-subtle md:hidden"
        onClick={() => {
          setSelectedService({ title: 'Discovery Call', price: '₹499', description: 'Book a 30-minute discovery call.' });
          setShowPaymentModal(true);
        }}
      >
        <Calendar className="h-5 w-5" />
      </Button>

      {/* Hero Section */}
      <section id="section-hero" className={`pt-32 md:pt-40 pb-24 px-6 scroll-mt-32 ${isVisible['section-hero'] ? 'animate-fade-in' : 'animate-on-scroll'}`}>
        <div className="container mx-auto text-center max-w-6xl">
          <h1 id="section-hero" className="text-6xl md:text-8xl font-bold mb-8 gradient-text animate-scale-in scroll-mt-16">
            Phani Bozzam
          </h1>
          <h2 className={`text-3xl md:text-4xl font-light mb-10 animate-fade-in-up transition-colors duration-300 ${theme === 'dark' ? 'text-gray-300' : 'text-black'}`}>
            Project Management Consultant & AI Content Strategist
          </h2>
          <p className={`text-2xl md:text-3xl mb-14 animate-slide-in-right transition-colors duration-300 ${theme === 'dark' ? 'text-gray-300' : 'text-black'}`}>
            Action-oriented PM insight + AI-driven content to accelerate careers and deliver real ROI.
          </p>
          <Button 
            size="lg" 
            className="bg-brand-blue hover:bg-brand-blue-dark text-white px-10 py-5 text-xl rounded-2xl hover-lift transition-all duration-300"
            onClick={() => {
              setSelectedService({ title: 'Discovery Call', price: '₹499', description: 'Book a 30-minute discovery call.' });
              setShowPaymentModal(true);
            }}
          >
            <Calendar className="mr-3 h-6 w-6" />
            Book a Discovery Call
          </Button>
          <div className="mt-20 animate-bounce-subtle cursor-pointer" onClick={() => scrollToSection('section-about')}>
            <ChevronDown className="mx-auto h-10 w-10 text-gray-500" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="pt-20 pb-24 px-6 ${isVisible['section-about'] ? 'animate-fade-in' : 'animate-on-scroll'}">
        <div className="container mx-auto max-w-6xl">
          <h2 id="section-about" className="text-5xl md:text-6xl font-bold text-center mb-12 gradient-text pt-6 scroll-mt-16">How I Work</h2>
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="order-2 md:order-1">
              <div className="space-y-8 text-xl text-gray-300">
                <p className={`transition-colors duration-300 text-black dark:text-gray-300`}>
                  I bridge the gap between strategic project management and AI-powered content creation. With deep expertise in Agile methodologies and modern cloud PM practices, I help organizations accelerate their delivery while building thought leadership that drives real business results.
                </p>
                <p className={`transition-colors duration-300 text-black dark:text-gray-300`}>
                  My approach combines battle-tested PM frameworks with cutting-edge AI content strategies, ensuring your projects ship on time while your brand scales with authority.
                </p>
                <p className={`transition-colors duration-300 text-black dark:text-gray-300`}>
                  Whether you're launching a new product, optimizing team performance, or building a content engine that converts, I deliver actionable insights that create immediate impact.
                </p>
              </div>
            </div>
            <div className="relative order-1 md:order-2 mx-auto md:mx-0 max-w-md w-full">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/My Image.jpg" 
                  alt="Phani Bozzam" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-brand-blue rounded-full animate-glow"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="pt-12 pb-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 id="section-services" className="text-5xl md:text-6xl font-bold text-center mb-12 gradient-text pt-6 scroll-mt-16">Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {services.map((service, index) => (
              <Link to="/pricing" key={index} style={{ textDecoration: 'none' }}>
                <Card
                  className={`group p-6 relative cursor-pointer border transition-colors duration-300 ${theme === 'dark' ? 'bg-dark-card border-dark-border text-white' : 'bg-white border-gray-200 text-black'}`}
                >
                {service.badge && (
                  <Badge 
                    variant="secondary" 
                    className="bg-brand-blue/20 text-brand-blue text-xs whitespace-nowrap absolute top-3 right-3 z-10 px-2 py-0.5"
                  >
                    {service.badge}
                  </Badge>
                )}
                  <CardHeader className={`pb-6 transition-colors duration-300 ${theme === 'dark' ? 'bg-dark-card text-white' : 'bg-white text-black'}`}>
                    <CardTitle className={`text-2xl group-hover:text-brand-blue transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                    {service.title}
                  </CardTitle>
                    <CardDescription className={`text-lg mt-4 transition-colors duration-300 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                    {service.description}
                  </CardDescription>
                </CardHeader>
              </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Design Section */}
      <section className="pt-12 pb-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <h2 id="section-design" className="text-5xl md:text-6xl font-bold text-center mb-12 gradient-text pt-6 scroll-mt-16">Design Expertise</h2>
          <div className="mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-8 text-white">Design Skills & Tools</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {designSkills.map((skill, index) => (
                <Card key={index} className={`group p-6 border transition-colors duration-300 ${theme === 'dark' ? 'bg-dark-card border-dark-border text-white' : 'bg-white border-gray-200 text-black'}`}>
                  <CardHeader className={`pb-6 transition-colors duration-300 ${theme === 'dark' ? 'bg-dark-card text-white' : 'bg-white text-black'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-brand-blue/20 rounded-lg text-brand-blue">
                          {skill.icon}
                        </div>
                        <CardTitle className={`text-2xl group-hover:text-brand-blue transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{skill.title}</CardTitle>
                      </div>
                      {skill.badge && (
                        <Badge variant="secondary" className="bg-brand-blue/20 text-brand-blue text-base whitespace-nowrap">
                          {skill.badge}
                        </Badge>
                      )}
                    </div>
                    <CardDescription className={`text-lg mb-4 transition-colors duration-300 ${theme === 'dark' ? 'text-gray-300' : 'text-black'}`}>{skill.description}</CardDescription>
                    <div className="flex flex-wrap gap-3">
                      {skill.tools.map((tool, toolIndex) => (
                        <Badge key={toolIndex} variant="outline" className={`text-base whitespace-nowrap transition-colors duration-300 ${theme === 'dark' ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-black'}`}>{tool}</Badge>
                      ))}
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="pt-12 pb-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <h2 id="section-portfolio" className="text-5xl md:text-6xl font-bold text-center mb-12 gradient-text pt-6 scroll-mt-16">Portfolio Highlights</h2>
          <div className="grid grid-cols-1 justify-center gap-10">
            {portfolioItems.map((item, index) => (
              <Card key={index} className={`group p-6 border transition-colors duration-300 ${theme === 'dark' ? 'bg-dark-card border-dark-border text-white' : 'bg-white border-gray-200 text-black'}`}>
                <CardHeader className="pb-6">
                  <div
                    className={`text-3xl font-bold mb-4 transition-colors duration-300 text-blue-600`}
                    style={theme === 'dark' ? {} : { color: '#2563eb' }}
                  >
                    {item.metric}
                  </div>
                  <CardTitle className={`text-2xl mb-3 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{item.title}</CardTitle>
                  <CardDescription className={`text-lg transition-colors duration-300 ${theme === 'dark' ? 'text-gray-300' : 'text-black'}`}>
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Button variant="outline" className={`w-full transition-colors duration-300 ${theme === 'dark' ? '' : 'bg-white text-black border-gray-300 hover:bg-gray-100'}`} onClick={() => window.open(item.link, '_blank')}>
                    View on GitHub
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="pt-12 pb-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 id="section-blog" className="text-5xl md:text-6xl font-bold text-center mb-12 gradient-text pt-6 scroll-mt-16 text-blue-600">Latest Insights</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            <Card className={`group p-6 border transition-colors duration-300 ${theme === 'dark' ? 'bg-dark-card border-dark-border text-white' : 'bg-white border-gray-200 text-black'}`}>
              <CardHeader className="flex-1 pb-6">
                <CardTitle className={`text-2xl mb-3 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>The AI-PM Convergence</CardTitle>
                <CardDescription className={`text-lg transition-colors duration-300 ${theme === 'dark' ? 'text-gray-300' : 'text-black'}`}>
                  How AI is reshaping project management methodologies in 2025
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button 
                  variant="outline" 
                  className={`w-full text-lg py-3 transition-colors duration-300 border ${theme === 'dark' ? 'border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white' : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'}`}
                  onClick={() => setShowPaymentModal(true)}
                >
                  Book Discovery Call
                </Button>
              </CardContent>
            </Card>
            <Card className={`group p-6 border transition-colors duration-300 ${theme === 'dark' ? 'bg-dark-card border-dark-border text-white' : 'bg-white border-gray-200 text-black'}`}>
              <CardHeader className="flex-1 pb-6">
                <CardTitle className={`text-2xl mb-3 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>LinkedIn Growth Secrets</CardTitle>
                <CardDescription className={`text-lg transition-colors duration-300 ${theme === 'dark' ? 'text-gray-300' : 'text-black'}`}>
                  5 proven strategies that increased my reach by 300% in 90 days
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button 
                  variant="outline" 
                  className={`w-full text-lg py-3 transition-colors duration-300 border ${theme === 'dark' ? 'border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white' : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'}`}
                  onClick={() => setShowPaymentModal(true)}
                >
                  Book Discovery Call
                </Button>
              </CardContent>
            </Card>
            <Card className={`group p-6 border transition-colors duration-300 ${theme === 'dark' ? 'bg-dark-card border-dark-border text-white' : 'bg-white border-gray-200 text-black'}`}>
              <CardHeader className="flex-1 pb-6">
                <CardTitle className={`text-2xl mb-3 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Project Management Mastery</CardTitle>
                <CardDescription className={`text-lg transition-colors duration-300 ${theme === 'dark' ? 'text-gray-300' : 'text-black'}`}>
                  Essential tools and frameworks for managing projects
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button 
                  variant="outline" 
                  className={`w-full text-lg py-3 transition-colors duration-300 border ${theme === 'dark' ? 'border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white' : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'}`}
                  onClick={() => setShowPaymentModal(true)}
                >
                  Book Discovery Call
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="pt-12 pb-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <h2 id="section-contact" className="text-5xl md:text-6xl font-bold text-center mb-12 gradient-text pt-6 scroll-mt-16">Let's Connect</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-10">
              <div>
                <h3 className="text-2xl font-bold mb-6 text-white">Ready to Transform Your Projects?</h3>
                <p className={`mb-6 text-lg transition-colors duration-300 text-black dark:text-gray-300`}>Book a 30-minute discovery call to discuss how we can accelerate your current strategy.</p>
                <Button 
                  size="lg" 
                  className="bg-brand-blue hover:bg-brand-blue-dark text-white px-10 py-5 rounded-2xl hover-lift text-xl"
                  onClick={() => setShowPaymentModal(true)}
                >
                  <Calendar className="mr-3 h-6 w-6" />
                  Schedule Discovery Call
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Linkedin className="h-6 w-6 text-brand-blue" />
                  <a href="https://www.linkedin.com/in/phani-bozzam" target="_blank" rel="noopener noreferrer" className={`transition-colors duration-300 text-black dark:text-gray-300 hover:text-brand-blue`}>LinkedIn</a>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-brand-blue text-2xl">✉</span>
                  <a href="mailto:phani.bozzam@gmail.com" className={`transition-colors duration-300 text-black dark:text-gray-300 hover:text-brand-blue`}>phani.bozzam@gmail.com</a>
                </div>
              </div>
            </div>
            <Card className={`group p-6 border transition-colors duration-300 ${theme === 'dark' ? 'bg-dark-card border-dark-border text-white' : 'bg-white border-gray-200 text-black'}`}>
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl text-blue-600 transition-colors duration-300">Quick Message</CardTitle>
                <p className={`text-sm transition-colors duration-300 text-black dark:text-gray-300`}>Please verify your email to ensure we can respond to you.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your Name" 
                    required
                    className={`w-full rounded-lg p-4 text-lg border transition-colors duration-300 ${theme === 'dark' ? 'bg-dark-card border-dark-border text-white placeholder-gray-400' : 'bg-white border-gray-300 text-black placeholder-gray-500'}`}
                  />
                  
                  <div className="space-y-3">
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Your Email" 
                    required
                    className={`w-full rounded-lg p-4 text-lg border transition-colors duration-300 ${theme === 'dark' ? 'bg-dark-card border-dark-border text-white placeholder-gray-400' : 'bg-white border-gray-300 text-black placeholder-gray-500'}`}
                  />
                    
                    {!emailVerified && formData.email && (
                      <div className="space-y-3">
                        {!verificationSent ? (
                          <Button
                            type="button"
                            onClick={sendVerificationCode}
                            disabled={isVerifying}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            {isVerifying ? 'Sending...' : 'Send Verification Code'}
                          </Button>
                        ) : (
                          <div className="space-y-3">
                            <input
                              type="text"
                              name="verificationCode"
                              value={formData.verificationCode}
                              onChange={handleInputChange}
                              placeholder="Enter 6-digit verification code"
                              maxLength={6}
                              className={`w-full rounded-lg p-4 text-lg border transition-colors duration-300 ${theme === 'dark' ? 'bg-dark-card border-dark-border text-white placeholder-gray-400' : 'bg-white border-gray-300 text-black placeholder-gray-500'}`}
                            />
                            <div className="flex gap-3">
                              <Button
                                type="button"
                                onClick={verifyCode}
                                disabled={isVerifying || !formData.verificationCode}
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                              >
                                {isVerifying ? 'Verifying...' : 'Verify Code'}
                              </Button>
                              <Button
                                type="button"
                                onClick={sendVerificationCode}
                                disabled={isVerifying}
                                variant="outline"
                                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                              >
                                Resend
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {emailVerified && (
                      <div className="flex items-center gap-2 text-green-400 text-sm">
                        <Check className="h-4 w-4" />
                        Email verified successfully
                      </div>
                    )}
                  </div>
                  
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Your Message" 
                    required
                    rows={4}
                    className={`w-full rounded-lg p-4 text-lg border transition-colors duration-300 ${theme === 'dark' ? 'bg-dark-card border-dark-border text-white placeholder-gray-400' : 'bg-white border-gray-300 text-black placeholder-gray-500'}`}
                  ></textarea>
                  <Button 
                    type="submit" 
                    className="w-full bg-brand-blue hover:bg-brand-blue-dark text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting || !emailVerified}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-card border-t border-dark-border py-16 px-6">
        <div className="container mx-auto max-w-7xl text-center">
          <div className="gradient-text text-3xl font-bold mb-6">The PM Lens</div>
          <p className="text-gray-400 mb-8 text-lg">
            Action-oriented PM insight + AI-driven content to accelerate careers and deliver real ROI.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-8 text-base">
            <Link to="/cancellation-refunds" className="text-gray-400 hover:text-brand-blue transition-colors">Cancellation & Refunds</Link>
            <Link to="/terms-and-conditions" className="text-gray-400 hover:text-brand-blue transition-colors">Terms and Conditions</Link>
            <Link to="/privacy" className="text-gray-400 hover:text-brand-blue transition-colors">Privacy</Link>
            <Link to="/contact" className="text-gray-400 hover:text-brand-blue transition-colors">Contact Us</Link>
          </div>
          <p className="text-gray-500 text-base">
            © 2025 Phani Bhushan Bozzam. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={() => {
          setShowPaymentModal(false);
          toast({
            title: "Payment Successful!",
            description: "Thank you for your payment. We will contact you soon.",
          });
        }}
        service={selectedService}
      />

      {/* UI/UX Design and Development Modal */}
      <Dialog open={showUIDesignModal} onOpenChange={setShowUIDesignModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select a Service</DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            <label className="block mb-2">Main Category</label>
            <select
              className="w-full p-2 rounded bg-dark-card border border-dark-border text-white"
              value={selectedMain}
              onChange={e => {
                setSelectedMain(e.target.value);
                setSelectedSub('');
              }}
            >
              <option value="">Select...</option>
              {uiuxCategories.map(cat => (
                <option key={cat.main} value={cat.main}>{cat.main}</option>
              ))}
            </select>
          </div>
          {selectedMain && (
            <div className="mb-4">
              <label className="block mb-2">Subcategory</label>
              <select
                className="w-full p-2 rounded bg-dark-card border border-dark-border text-white"
                value={selectedSub}
                onChange={e => setSelectedSub(e.target.value)}
              >
                <option value="">Select...</option>
                {selectedCategory?.subs.map(sub => (
                  <option key={sub.name} value={sub.name}>{sub.name}</option>
                ))}
              </select>
            </div>
          )}
          {selectedSubObj && (
            <div className="mb-4 p-3 rounded bg-gray-800 text-white">
              <strong>Pricing:</strong>
              <pre className="whitespace-pre-wrap mt-2">{selectedSubObj.pricing}</pre>
            </div>
          )}
          <Button
            className="w-full bg-brand-blue hover:bg-brand-blue-dark text-white"
            disabled={!selectedMain || !selectedSub}
            onClick={() => window.open('https://calendly.com/phani-bozzam/ui-ux-ai-consulting', '_blank')}
          >
            Book Now
          </Button>
        </DialogContent>
      </Dialog>

      {/* Timer Popup */}
      {showTimerPopup && !minimizedPopup && (
        <div className="fixed z-50 inset-0 flex items-center justify-center animate-fade-in">
          <div className="relative bg-white text-black rounded-2xl shadow-2xl p-10 w-[600px] flex flex-row gap-10 border-2 border-blue-500 items-center">
            <button onClick={() => { setShowTimerPopup(false); setMinimizedPopup(true); hidePopupFor3Days(); }} className="absolute top-4 right-4 text-gray-400 hover:text-black z-10">
              <X className="w-7 h-7" />
            </button>
            <div className="flex-1 flex flex-col gap-4">
              <div className="font-bold text-2xl flex items-center gap-2">
                <Clock className="w-7 h-7 text-blue-500" />
                Limited Time Offer!
              </div>
              <div className="text-xl text-blue-700 font-semibold">Book a 30-min Discovery Call for just <span className="text-3xl font-bold text-blue-600">₹299</span> <span className="line-through text-gray-400 text-lg ml-2">₹499</span></div>
              <div className="text-lg text-gray-700">Unlock actionable project management and AI content strategy insights tailored to your business. This exclusive price is available for a limited time only!</div>
              <div className="text-sm text-gray-500 mt-2">Offer expires when timer hits 00:00. Don’t miss out!</div>
            </div>
            <div className="flex flex-col items-center gap-6 min-w-[170px]">
              <div className="flex items-center gap-2 text-blue-600 font-mono text-3xl">
                <Clock className="w-6 h-6" />
                <span>{formatCountdown(countdown)}</span>
              </div>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xl py-4 rounded-lg"
                onClick={() => {
                  setSelectedService({ title: 'Discovery Call (Limited Offer)', price: '₹299', description: 'Book a 30-minute discovery call at a special price.' });
                  setShowPaymentModal(true);
                  setShowTimerPopup(false);
                  setMinimizedPopup(false);
                  hidePopupFor3Days();
                }}
                disabled={countdown === 0}
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Minimized Widget */}
      {minimizedPopup && countdown > 0 && (
        <div className="fixed z-50 bottom-8 right-8 bg-white text-black rounded-full shadow-xl px-5 py-3 flex items-center gap-3 border border-blue-500 cursor-pointer hover:shadow-2xl transition-all" onClick={() => { setShowTimerPopup(true); setMinimizedPopup(false); }} onMouseLeave={hidePopupFor3Days}>
          <Clock className="w-4 h-4 text-blue-600" />
          <span className="font-semibold text-blue-600">{formatCountdown(countdown)}</span>
          <span className="font-medium">Book @299</span>
        </div>
      )}
      {/* Theme Toggle Button */}
      <button
        className="fixed bottom-6 left-6 z-50 bg-white dark:bg-dark-card border border-gray-300 dark:border-dark-border rounded-full shadow-lg p-3 flex items-center justify-center hover:scale-105 transition-all"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-blue-600" />}
      </button>
    </div>
  );
};

export default Index;
