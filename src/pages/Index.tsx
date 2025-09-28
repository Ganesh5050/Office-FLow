import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  Package, 
  MapPin, 
  TrendingUp, 
  Shield, 
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
  BarChart3,
  Zap
} from 'lucide-react';

import heroImage from '@/assets/hero-office.jpg';

const Index = () => {
  const stats = [
    { label: 'Staff Members', value: '156+', icon: Users, color: 'text-blue-500' },
    { label: 'Active Products', value: '89+', icon: Package, color: 'text-green-500' },
    { label: 'Facilities', value: '12+', icon: MapPin, color: 'text-purple-500' },
    { label: 'Clients Served', value: '500+', icon: Building2, color: 'text-orange-500' }
  ];

  const features = [
    {
      title: 'Staff Management',
      description: 'Comprehensive staff directory with detailed profiles and contact information.',
      icon: Users,
      link: '/staff'
    },
    {
      title: 'Product Registration',
      description: 'Streamlined product registration and real-time status tracking system.',
      icon: Package,
      link: '/products'
    },
    {
      title: 'Facility Booking',
      description: 'Modern workspace facilities available for booking with premium amenities.',
      icon: MapPin,
      link: '/facilities'
    },
    {
      title: 'Document Archives',
      description: 'Secure document management with advanced search and filtering capabilities.',
      icon: BarChart3,
      link: '/archives'
    }
  ];

  const benefits = [
    'Enterprise-grade security and reliability',
    'Real-time tracking and notifications',
    'Intuitive user interface and experience',
    '24/7 customer support and assistance',
    'Scalable solutions for growing businesses',
    'Advanced analytics and reporting'
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 hero-bg opacity-90"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <Badge variant="secondary" className="mb-6 glass-card">
              <Star className="h-4 w-4 mr-2" />
              Enterprise Management Solution
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                OfficeFlow
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Streamline your business operations with our comprehensive office and product management system.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button variant="hero" size="hero">
                  Get Started
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="hero" size="hero">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          >
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="glass-card w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-muted-foreground text-sm md:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Powerful Features for Your Business
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover how OfficeFlow can transform your business operations with our comprehensive suite of tools.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Link to={feature.link}>
                  <Card className="premium-card h-full group cursor-pointer">
                    <CardContent className="p-8 text-center">
                      <div className="glass-card w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                        <feature.icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {feature.description}
                      </p>
                      <Button variant="ghost" className="group-hover:variant-premium transition-all">
                        Learn More
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                Why Choose OfficeFlow?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Built for modern businesses, OfficeFlow combines powerful functionality with 
                an intuitive user experience to help you manage your operations efficiently.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                  >
                    <div className="glass-card p-2 rounded-lg flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <span className="text-lg">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              <Card className="premium-card">
                <CardContent className="p-6 text-center">
                  <div className="glass-card w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-6 w-6 text-yellow-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Fast Performance</h3>
                  <p className="text-sm text-muted-foreground">Lightning-fast response times</p>
                </CardContent>
              </Card>

              <Card className="premium-card">
                <CardContent className="p-6 text-center">
                  <div className="glass-card w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Secure & Reliable</h3>
                  <p className="text-sm text-muted-foreground">Enterprise-grade security</p>
                </CardContent>
              </Card>

              <Card className="premium-card">
                <CardContent className="p-6 text-center">
                  <div className="glass-card w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="font-semibold mb-2">24/7 Support</h3>
                  <p className="text-sm text-muted-foreground">Round-the-clock assistance</p>
                </CardContent>
              </Card>

              <Card className="premium-card">
                <CardContent className="p-6 text-center">
                  <div className="glass-card w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-6 w-6 text-purple-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Scalable Solutions</h3>
                  <p className="text-sm text-muted-foreground">Grows with your business</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-primary-glow/10">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join hundreds of businesses that trust OfficeFlow for their operations management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button variant="premium" size="hero">
                  Start Free Trial
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="neomorphic" size="hero">
                  Schedule Demo
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
