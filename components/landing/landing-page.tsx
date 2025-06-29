"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Leaf, 
  Heart, 
  BarChart3, 
  Shield, 
  Smartphone, 
  Zap,
  CheckCircle,
  Star,
  ArrowRight,
  Play,
  TrendingUp,
  Users,
  Globe,
  Award,
  Sparkles
} from 'lucide-react';
import { AuthModal } from '@/components/auth/auth-modal';

const features = [
  {
    icon: Leaf,
    title: 'Smart Animal Management',
    description: 'AI-powered livestock tracking with genetic analysis, health predictions, and performance optimization.',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/50'
  },
  {
    icon: Heart,
    title: 'Predictive Health Analytics',
    description: 'Early disease detection, automated vaccination schedules, and veterinary management with IoT integration.',
    color: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-950/50'
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics Suite',
    description: 'Real-time insights, predictive modeling, and comprehensive reporting with export capabilities.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/50'
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-grade security, regulatory compliance tracking, and data protection with audit trails.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950/50'
  },
  {
    icon: Smartphone,
    title: 'Mobile-First Design',
    description: 'Native mobile apps with offline capabilities, QR/RFID scanning, and field data collection.',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950/50'
  },
  {
    icon: Zap,
    title: 'IoT & Automation',
    description: 'Smart sensors, automated feeding systems, and environmental monitoring with alerts.',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950/50'
  }
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Farm Owner',
    company: 'Green Valley Ranch',
    content: 'AgroInsight transformed our operations. We increased productivity by 40% and reduced costs significantly. The AI insights are game-changing.',
    avatar: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5
  },
  {
    name: 'Michael Chen',
    role: 'Agricultural Manager',
    company: 'Sunrise Farms',
    content: 'The predictive analytics helped us prevent disease outbreaks before they happened. ROI was achieved in just 3 months.',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5
  },
  {
    name: 'Emily Rodriguez',
    role: 'Livestock Specialist',
    company: 'Heritage Cattle Co.',
    content: 'Best investment we made. The breeding recommendations and genetic tracking alone paid for the entire system.',
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5
  }
];

const pricingPlans = [
  {
    name: 'Starter',
    price: '$49',
    period: '/month',
    description: 'Perfect for small farms',
    features: [
      'Up to 100 animals',
      'Basic health tracking',
      'Mobile app access',
      'Email support',
      'Basic reports',
      'QR code scanning'
    ],
    popular: false
  },
  {
    name: 'Professional',
    price: '$149',
    period: '/month',
    description: 'For growing operations',
    features: [
      'Up to 1,000 animals',
      'AI health predictions',
      'Advanced analytics',
      'Priority support',
      'Custom reports',
      'IoT integration',
      'Family tree visualization',
      'Genetic tracking'
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    price: '$399',
    period: '/month',
    description: 'For large-scale farms',
    features: [
      'Unlimited animals',
      'Full AI suite',
      'Custom integrations',
      '24/7 phone support',
      'White-label options',
      'Dedicated account manager',
      'Advanced automation',
      'Custom development'
    ],
    popular: false
  }
];

const stats = [
  { number: '50K+', label: 'Animals Tracked' },
  { number: '1,200+', label: 'Farms Worldwide' },
  { number: '99.9%', label: 'Uptime' },
  { number: '40%', label: 'Avg. Productivity Increase' }
];

export function LandingPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-emerald-200/50 dark:border-emerald-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                AgroInsight
              </span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-emerald-600 transition-colors">Features</a>
              <a href="#testimonials" className="text-gray-600 hover:text-emerald-600 transition-colors">Success Stories</a>
              <a href="#pricing" className="text-gray-600 hover:text-emerald-600 transition-colors">Pricing</a>
              <Button variant="ghost" onClick={() => openAuth('login')}>
                Sign In
              </Button>
              <Button onClick={() => openAuth('register')} className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700">
                Start Free Trial
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 dark:from-emerald-500/5 dark:to-green-500/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="secondary" className="mb-6 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                <Sparkles className="h-4 w-4 mr-2" />
                AI-Powered Farm Intelligence
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                The Future of{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  Smart Farming
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
                Transform your agricultural operations with AgroInsight's enterprise-grade platform. 
                AI-powered insights, predictive analytics, and comprehensive livestock management 
                that scales with your farm.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button size="lg" onClick={() => openAuth('register')} className="text-lg px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700">
                  Start Free 30-Day Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                    className="text-center"
                  >
                    <div className="text-3xl font-bold text-emerald-600 mb-1">{stat.number}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
              <Award className="h-4 w-4 mr-2" />
              Award-Winning Platform
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything You Need for{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Modern Farming
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Comprehensive tools designed for the next generation of agricultural operations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-emerald-100 dark:border-emerald-800/50 group">
                  <CardHeader>
                    <div className={`${feature.bgColor} ${feature.color} p-4 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-7 w-7" />
                    </div>
                    <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
              <Users className="h-4 w-4 mr-2" />
              Trusted Worldwide
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Join Thousands of{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Successful Farmers
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              See how AgroInsight is transforming farms across the globe
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-emerald-100 dark:border-emerald-800/50">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="h-12 w-12 rounded-full mr-4"
                      />
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                        <div className="text-sm text-emerald-600 dark:text-emerald-400">
                          {testimonial.role}, {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
              <TrendingUp className="h-4 w-4 mr-2" />
              Transparent Pricing
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Choose Your{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Growth Plan
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Scale with confidence - upgrade or downgrade anytime
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className={`h-full relative ${plan.popular ? 'border-emerald-500 shadow-xl scale-105' : 'border-emerald-100 dark:border-emerald-800/50'}`}>
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-green-600">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                    <div className="mb-4">
                      <span className="text-5xl font-bold text-emerald-600">{plan.price}</span>
                      <span className="text-gray-500 text-lg">{plan.period}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{plan.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                      onClick={() => openAuth('register')}
                    >
                      Start Free Trial
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-green-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Farm?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Join thousands of farmers who've revolutionized their operations with AgroInsight. 
              Start your free trial today - no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => openAuth('register')}
                className="text-lg px-8 py-4 bg-white text-emerald-600 hover:bg-gray-100"
              >
                Start Free 30-Day Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-4 border-white text-white hover:bg-white/10"
              >
                Schedule Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                AgroInsight
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <Globe className="h-5 w-5 text-emerald-600" />
              <span className="text-gray-600 dark:text-gray-400">
                © 2024 AgroInsight. Transforming agriculture worldwide.
              </span>
            </div>
          </div>
        </div>
      </footer>

      <AuthModal 
        open={authModalOpen} 
        onOpenChange={setAuthModalOpen}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  );
}