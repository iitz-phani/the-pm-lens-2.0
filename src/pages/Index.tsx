import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Calendar, BookOpen, Youtube, Linkedin } from 'lucide-react';

const Index = () => {
  const [isVisible, setIsVisible] = useState({});

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

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const services = [
    {
      title: "Project Management Consulting",
      description: "Agile/Scrum implementation and cloud PM strategies for high-growth teams",
      badge: "Most Popular"
    },
    {
      title: "AI Content Strategy & Copy",
      description: "Data-driven content frameworks that convert and scale your brand",
      badge: "New"
    },
    {
      title: "Course Improvement & Design",
      description: "Transform your training programs with proven instructional design methods",
      badge: ""
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
    }
  ];

  const portfolioItems = [
    {
      title: "22 Udemy Courses",
      description: "Comprehensive project management and AI training programs",
      metric: "50K+ Students"
    },
    {
      title: "OCI Data Lake Modernization",
      description: "Enterprise webinar deck for Oracle Cloud Infrastructure",
      metric: "Enterprise Scale"
    },
    {
      title: "LinkedIn Mastery Workshop",
      description: "Signature workshop for professional brand building",
      metric: "95% Success Rate"
    }
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      {/* Sticky CTA Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/95 backdrop-blur-sm border-b border-dark-border">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/The PM Lens Logo.png" alt="The PM Lens Logo" className="h-8 w-auto" />
            <div className="font-bold text-xl text-white">The PM Lens</div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-6">
              <a onClick={() => scrollToSection('section-about')} className="text-gray-300 hover:text-white cursor-pointer transition-colors">About</a>
              <a onClick={() => scrollToSection('section-services')} className="text-gray-300 hover:text-white cursor-pointer transition-colors">Services</a>
              <a onClick={() => scrollToSection('section-blog')} className="text-gray-300 hover:text-white cursor-pointer transition-colors">Blog</a>
              <a onClick={() => scrollToSection('section-contact')} className="text-gray-300 hover:text-white cursor-pointer transition-colors">Contact</a>
            </nav>
            <Button 
              className="bg-brand-blue hover:bg-brand-blue-dark transition-all duration-300 animate-glow flex items-center"
              onClick={() => window.open('https://calendly.com', '_blank')}
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
        onClick={() => window.open('https://calendly.com', '_blank')}
      >
        <Calendar className="h-5 w-5" />
      </Button>

      {/* Hero Section */}
      <section id="section-hero" className={`pt-32 md:pt-40 pb-20 px-6 ${isVisible['section-hero'] ? 'animate-fade-in' : 'animate-on-scroll'}`}>
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 gradient-text animate-scale-in">
            Phani Bozzam
          </h1>
          <h2 className="text-2xl md:text-3xl font-light mb-8 text-gray-300 animate-fade-in-up">
            Project Management Consultant & AI Content Strategist
          </h2>
          <p className="text-xl md:text-2xl mb-12 text-gray-400 animate-slide-in-right">
            Action-oriented PM insight + AI-driven content to accelerate careers and deliver real ROI.
          </p>
          <Button 
            size="lg" 
            className="bg-brand-blue hover:bg-brand-blue-dark text-white px-8 py-4 text-lg rounded-2xl hover-lift transition-all duration-300"
            onClick={() => window.open('https://calendly.com', '_blank')}
          >
            <Calendar className="mr-3 h-5 w-5" />
            Book a Discovery Call
          </Button>
          <div className="mt-16 animate-bounce-subtle cursor-pointer" onClick={() => scrollToSection('section-about')}>
            <ChevronDown className="mx-auto h-8 w-8 text-gray-500" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="section-about" className={`py-20 px-6 ${isVisible['section-about'] ? 'animate-fade-in' : 'animate-on-scroll'}`}>
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 gradient-text text-center">How I Work</h2>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="space-y-6 text-lg text-gray-300">
                <p>
                  I bridge the gap between strategic project management and AI-powered content creation. With deep expertise in Agile methodologies and modern cloud PM practices, I help organizations accelerate their delivery while building thought leadership that drives real business results.
                </p>
                <p>
                  My approach combines battle-tested PM frameworks with cutting-edge AI content strategies, ensuring your projects ship on time while your brand scales with authority.
                </p>
                <p>
                  Whether you're launching a new product, optimizing team performance, or building a content engine that converts, I deliver actionable insights that create immediate impact.
                </p>
              </div>
            </div>
            <div className="relative order-1 md:order-2 mx-auto md:mx-0 max-w-md w-full">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="/My Image.jpg" 
                  alt="Phani Bozzam" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-brand-blue rounded-full animate-glow"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="section-services" className={`py-20 px-6 ${isVisible['section-services'] ? 'animate-fade-in' : 'animate-on-scroll'}`}>
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 gradient-text">Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="glass-card border-dark-border hover-lift group">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl text-white group-hover:text-brand-blue transition-colors">
                      {service.title}
                    </CardTitle>
                    {service.badge && (
                      <Badge variant="secondary" className="bg-brand-blue/20 text-brand-blue">
                        {service.badge}
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-gray-400">
                    {service.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="section-portfolio" className={`py-20 px-6 ${isVisible['section-portfolio'] ? 'animate-fade-in' : 'animate-on-scroll'}`}>
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 gradient-text">Portfolio Highlights</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {portfolioItems.map((item, index) => (
              <Card key={index} className="glass-card border-dark-border hover-lift group">
                <CardHeader>
                  <div className="text-3xl font-bold text-brand-blue mb-4">{item.metric}</div>
                  <CardTitle className="text-xl text-white mb-3">{item.title}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {item.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="section-blog" className={`py-20 px-6 ${isVisible['section-blog'] ? 'animate-fade-in' : 'animate-on-scroll'}`}>
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 gradient-text">Latest Insights</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="glass-card border-dark-border hover-lift">
              <CardHeader>
                <CardTitle className="text-white">The AI-PM Convergence</CardTitle>
                <CardDescription className="text-gray-400">
                  How AI is reshaping project management methodologies in 2025
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white">
                  Read More
                </Button>
              </CardContent>
            </Card>
            <Card className="glass-card border-dark-border hover-lift">
              <CardHeader>
                <CardTitle className="text-white">LinkedIn Growth Secrets</CardTitle>
                <CardDescription className="text-gray-400">
                  5 proven strategies that increased my reach by 300% in 90 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white">
                  Read More
                </Button>
              </CardContent>
            </Card>
            <Card className="glass-card border-dark-border hover-lift">
              <CardHeader>
                <CardTitle className="text-white">Cloud PM Mastery</CardTitle>
                <CardDescription className="text-gray-400">
                  Essential tools and frameworks for managing cloud-native projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white">
                  Read More
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="section-contact" className={`py-20 px-6 ${isVisible['section-contact'] ? 'animate-fade-in' : 'animate-on-scroll'}`}>
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 gradient-text">Let's Connect</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-white">Ready to Transform Your Projects?</h3>
                <p className="text-gray-400 mb-6">
                  Book a free 30-minute discovery call to discuss how we can accelerate your PM processes and content strategy.
                </p>
                <Button 
                  size="lg" 
                  className="bg-brand-blue hover:bg-brand-blue-dark text-white px-8 py-4 rounded-2xl hover-lift"
                  onClick={() => window.open('https://calendly.com', '_blank')}
                >
                  <Calendar className="mr-3 h-5 w-5" />
                  Schedule Discovery Call
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Linkedin className="h-6 w-6 text-brand-blue" />
                  <a href="https://www.linkedin.com/in/phani-bozzam" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-brand-blue transition-colors">LinkedIn</a>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-brand-blue text-2xl">✉</span>
                  <a href="mailto:phani.bozzam@gmail.com" className="text-gray-300 hover:text-brand-blue transition-colors">phani.bozzam@gmail.com</a>
                </div>
              </div>
            </div>
            <Card className="glass-card border-dark-border">
              <CardHeader>
                <CardTitle className="text-white">Quick Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="w-full bg-dark-card border border-dark-border rounded-lg p-3 text-white placeholder-gray-500"
                />
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="w-full bg-dark-card border border-dark-border rounded-lg p-3 text-white placeholder-gray-500"
                />
                <textarea 
                  placeholder="Your Message" 
                  rows={4}
                  className="w-full bg-dark-card border border-dark-border rounded-lg p-3 text-white placeholder-gray-500"
                ></textarea>
                <Button className="w-full bg-brand-blue hover:bg-brand-blue-dark">
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-card border-t border-dark-border py-12 px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="gradient-text text-2xl font-bold mb-4">The PM Lens</div>
          <p className="text-gray-400 mb-6">
            Action-oriented PM insight + AI-driven content to accelerate careers and deliver real ROI.
          </p>
          <p className="text-gray-500 text-sm">
            © 2025 Phani Bhushan Bozzam. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
