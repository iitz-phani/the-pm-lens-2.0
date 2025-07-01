import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Calendar, BookOpen, Youtube, Linkedin, Palette, Figma, Layers, Eye, Code, Smartphone, Monitor } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const [isVisible, setIsVisible] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // First, let's test if the server is reachable
      const testResponse = await fetch('http://localhost:5000/api/test-email');
      console.log('Test email response:', await testResponse.json());

      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

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
        message: ''
      });
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

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      {/* Sticky CTA Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-dark-bg/95 backdrop-blur-sm border-b border-dark-border">
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
              onClick={() => window.open('https://calendly.com/phani-bozzam/30min', '_blank')}
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
        onClick={() => window.open('https://calendly.com/phani-bozzam/30min', '_blank')}
      >
        <Calendar className="h-5 w-5" />
      </Button>

      {/* Hero Section */}
      <section id="section-hero" className="pt-70 md:pt-96 pb-24 px-6 scroll-mt-32 ${isVisible['section-hero'] ? 'animate-fade-in' : 'animate-on-scroll'}">
        <div className="container mx-auto text-center max-w-6xl">
          <h1 className="text-6xl md:text-8xl font-bold mb-8 gradient-text animate-scale-in">
            Phani Bozzam
          </h1>
          <h2 className="text-3xl md:text-4xl font-light mb-10 text-gray-300 animate-fade-in-up">
            Project Management Consultant & AI Content Strategist
          </h2>
          <p className="text-2xl md:text-3xl mb-14 text-gray-400 animate-slide-in-right">
            Action-oriented PM insight + AI-driven content to accelerate careers and deliver real ROI.
          </p>
          <Button 
            size="lg" 
            className="bg-brand-blue hover:bg-brand-blue-dark text-white px-10 py-5 text-xl rounded-2xl hover-lift transition-all duration-300"
            onClick={() => window.open('https://calendly.com/phani-bozzam/30min', '_blank')}
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
      <section id="section-about" className="pt-20 pb-24 px-6 scroll-mt-32 ${isVisible['section-about'] ? 'animate-fade-in' : 'animate-on-scroll'}">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-12 gradient-text">How I Work</h2>
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="order-2 md:order-1">
              <div className="space-y-8 text-xl text-gray-300">
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
      <section id="section-services" className="pt-20 pb-24 px-6 scroll-mt-32">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-12 gradient-text">Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {services.map((service, index) => (
              <Card key={index} className="glass-card border-dark-border hover-lift group p-6">
                <CardHeader className="pb-6">
                  <div className="flex justify-between items-start mb-4">
                    <CardTitle className="text-2xl text-white group-hover:text-brand-blue transition-colors">
                      {service.title}
                    </CardTitle>
                    {service.badge && (
                      <Badge variant="secondary" className="bg-brand-blue/20 text-brand-blue text-base whitespace-nowrap">
                        {service.badge}
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-gray-400 text-lg">
                    {service.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Design Section */}
      <section id="section-design" className="pt-20 pb-24 px-6 scroll-mt-32">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-12 gradient-text">Design Expertise</h2>
          <div className="mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-8 text-white">Design Skills & Tools</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {designSkills.map((skill, index) => (
                <Card key={index} className="glass-card border-dark-border hover-lift group p-6">
                  <CardHeader className="pb-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-brand-blue/20 rounded-lg text-brand-blue">
                          {skill.icon}
                        </div>
                        <CardTitle className="text-2xl text-white group-hover:text-brand-blue transition-colors">
                          {skill.title}
                        </CardTitle>
                      </div>
                      {skill.badge && (
                        <Badge variant="secondary" className="bg-brand-blue/20 text-brand-blue text-base whitespace-nowrap">
                          {skill.badge}
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-gray-400 text-lg mb-4">
                      {skill.description}
                    </CardDescription>
                    <div className="flex flex-wrap gap-3">
                      {skill.tools.map((tool, toolIndex) => (
                        <Badge key={toolIndex} variant="outline" className="border-gray-600 text-gray-300 text-base whitespace-nowrap">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Design Portfolio Section */}
      <div id="section-portfolio" className={`py-20 ${isVisible['section-portfolio'] ? 'animate-fade-in' : 'opacity-0'}`}>
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12 text-center">Design Portfolio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {designProjects.map((project, index) => (
              <Card key={index} className="bg-dark-card border-dark-border hover:border-brand-blue transition-all duration-300">
                <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="bg-dark-accent text-white">
                      {project.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold">{project.title}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    View Project
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Portfolio Section */}
      <section id="section-portfolio" className="pt-20 pb-24 px-6 scroll-mt-32">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-12 gradient-text">Portfolio Highlights</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {portfolioItems.map((item, index) => (
              <Card key={index} className="glass-card border-dark-border hover-lift group p-6">
                <CardHeader className="pb-6">
                  <div className="text-3xl font-bold text-brand-blue mb-4">{item.metric}</div>
                  <CardTitle className="text-2xl text-white mb-3">{item.title}</CardTitle>
                  <CardDescription className="text-gray-400 text-lg">
                    {item.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="section-blog" className="pt-20 pb-24 px-6 scroll-mt-32">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-12 gradient-text">Latest Insights</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            <Card className="glass-card border-dark-border hover-lift flex flex-col p-6">
              <CardHeader className="flex-1 pb-6">
                <CardTitle className="text-2xl text-white">The AI-PM Convergence</CardTitle>
                <CardDescription className="text-gray-400 text-lg">
                  How AI is reshaping project management methodologies in 2025
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white w-full text-lg py-3">
                  Read More
                </Button>
              </CardContent>
            </Card>
            <Card className="glass-card border-dark-border hover-lift flex flex-col p-6">
              <CardHeader className="flex-1 pb-6">
                <CardTitle className="text-2xl text-white">LinkedIn Growth Secrets</CardTitle>
                <CardDescription className="text-gray-400 text-lg">
                  5 proven strategies that increased my reach by 300% in 90 days
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white w-full text-lg py-3">
                  Read More
                </Button>
              </CardContent>
            </Card>
            <Card className="glass-card border-dark-border hover-lift flex flex-col p-6">
              <CardHeader className="flex-1 pb-6">
                <CardTitle className="text-2xl text-white">Cloud PM Mastery</CardTitle>
                <CardDescription className="text-gray-400 text-lg">
                  Essential tools and frameworks for managing cloud-native projects
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white w-full text-lg py-3">
                  Read More
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="section-contact" className="pt-20 pb-24 px-6 scroll-mt-32">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-12 gradient-text">Let's Connect</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-10">
              <div>
                <h3 className="text-2xl font-bold mb-6 text-white">Ready to Transform Your Projects?</h3>
                <p className="text-gray-400 mb-6 text-lg">
                  Book a free 30-minute discovery call to discuss how we can accelerate your PM processes and content strategy.
                </p>
                <Button 
                  size="lg" 
                  className="bg-brand-blue hover:bg-brand-blue-dark text-white px-10 py-5 rounded-2xl hover-lift text-xl"
                  onClick={() => window.open('https://calendly.com/phani-bozzam/30min', '_blank')}
                >
                  <Calendar className="mr-3 h-6 w-6" />
                  Schedule Discovery Call
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Linkedin className="h-6 w-6 text-brand-blue" />
                  <a href="https://www.linkedin.com/in/phani-bozzam" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-brand-blue transition-colors text-lg">LinkedIn</a>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-brand-blue text-2xl">✉</span>
                  <a href="mailto:phani.bozzam@gmail.com" className="text-gray-300 hover:text-brand-blue transition-colors text-lg">phani.bozzam@gmail.com</a>
                </div>
              </div>
            </div>
            <Card className="glass-card border-dark-border p-6">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl text-white">Quick Message</CardTitle>
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
                    className="w-full bg-dark-card border border-dark-border rounded-lg p-4 text-white placeholder-gray-500 text-lg"
                  />
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Your Email" 
                    required
                    className="w-full bg-dark-card border border-dark-border rounded-lg p-4 text-white placeholder-gray-500 text-lg"
                  />
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Your Message" 
                    required
                    rows={4}
                    className="w-full bg-dark-card border border-dark-border rounded-lg p-4 text-white placeholder-gray-500 text-lg"
                  ></textarea>
                  <Button 
                    type="submit" 
                    className="w-full bg-brand-blue hover:bg-brand-blue-dark text-lg py-3"
                    disabled={isSubmitting}
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
          <p className="text-gray-500 text-base">
            © 2025 Phani Bhushan Bozzam. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
