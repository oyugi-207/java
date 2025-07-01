
"use client";

import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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
  Sparkles,
  ChevronDown,
  Monitor,
  Cloud,
  Lock,
  Gauge,
  Bot,
  Target,
  Infinity,
  Rocket,
  Crown,
  Gem
} from 'lucide-react';
import { AuthModal } from '@/components/auth/auth-modal';

const features = [
  {
    icon: Bot,
    title: 'AI-Powered Intelligence',
    description: 'Advanced machine learning algorithms predict health issues, optimize breeding schedules, and maximize farm productivity with precision insights.',
    color: 'text-violet-600',
    bgColor: 'bg-violet-50 dark:bg-violet-950/50',
    premium: true
  },
  {
    icon: Heart,
    title: 'Predictive Health System',
    description: 'Real-time health monitoring with IoT sensors, early disease detection, and automated veterinary alerts to keep your livestock thriving.',
    color: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-950/50',
    premium: true
  },
  {
    icon: Gauge,
    title: 'Performance Analytics',
    description: 'Comprehensive dashboards with production metrics, financial insights, and customizable KPIs to drive data-driven decisions.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/50',
    premium: false
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Military-grade encryption, GDPR compliance, SOC 2 certification, and advanced access controls to protect your valuable farm data.',
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-950/50',
    premium: true
  },
  {
    icon: Cloud,
    title: 'Cloud-Native Platform',
    description: 'Scalable infrastructure with 99.9% uptime, automatic backups, global CDN, and seamless synchronization across all devices.',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50 dark:bg-cyan-950/50',
    premium: false
  },
  {
    icon: Zap,
    title: 'Automation Suite',
    description: 'Smart workflows, automated feeding schedules, climate control integration, and intelligent alerts to streamline operations.',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 dark:bg-amber-950/50',
    premium: true
  }
];

const testimonials = [
  {
    name: 'Dr. Sarah Mitchell',
    role: 'Agricultural Director',
    company: 'Heritage Valley Farms',
    content: 'AgroInsight transformed our 2,000-head operation. The AI predictions helped us prevent disease outbreaks and increased our profit margins by 45%. Simply revolutionary.',
    avatar: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    savings: '$128k saved annually'
  },
  {
    name: 'Michael Rodriguez',
    role: 'Ranch Owner',
    company: 'Sunshine Cattle Co.',
    content: 'The breeding optimization alone paid for our subscription in 3 months. We\'ve seen a 38% improvement in conception rates and healthier calves.',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    savings: '38% improved yields'
  },
  {
    name: 'Emily Chen',
    role: 'Dairy Operations Manager',
    company: 'Green Pastures Dairy',
    content: 'Best investment we\'ve made in 20 years. The predictive analytics and automation features have revolutionized how we manage our 1,500 dairy cows.',
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    savings: '200% ROI in year 1'
  }
];

const pricingPlans = [
  {
    name: 'Starter',
    price: '$79',
    period: '/month',
    description: 'Perfect for small farms',
    yearlyPrice: '$790',
    yearlyDiscount: '17% off',
    features: [
      'Up to 200 animals',
      'Basic health tracking',
      'Mobile & web access',
      'Email support',
      'Standard reports',
      'QR code scanning',
      '10GB cloud storage'
    ],
    popular: false,
    tier: 'basic'
  },
  {
    name: 'Professional',
    price: '$199',
    period: '/month',
    description: 'For growing operations',
    yearlyPrice: '$1,990',
    yearlyDiscount: '17% off',
    features: [
      'Up to 2,000 animals',
      'AI health predictions',
      'Advanced analytics suite',
      'Priority support',
      'Custom reports & exports',
      'IoT sensor integration',
      'Genetic tracking & breeding optimizer',
      'Financial management',
      '100GB cloud storage',
      'Team collaboration tools'
    ],
    popular: true,
    tier: 'pro'
  },
  {
    name: 'Enterprise',
    price: '$499',
    period: '/month',
    description: 'For large-scale operations',
    yearlyPrice: '$4,990',
    yearlyDiscount: '17% off',
    features: [
      'Unlimited animals',
      'Full AI suite with predictions',
      'Custom integrations & API access',
      '24/7 dedicated support',
      'White-label options',
      'Dedicated account manager',
      'Advanced automation workflows',
      'Multi-farm management',
      'Unlimited cloud storage',
      'Custom development hours',
      'On-premise deployment option'
    ],
    popular: false,
    tier: 'enterprise'
  }
];

const stats = [
  { number: '150K+', label: 'Animals Managed', sublabel: 'Worldwide' },
  { number: '2,500+', label: 'Farms Trust Us', sublabel: 'In 45 Countries' },
  { number: '99.97%', label: 'Platform Uptime', sublabel: 'SLA Guaranteed' },
  { number: '47%', label: 'Avg. Profit Increase', sublabel: 'In First Year' }
];

const integrations = [
  { name: 'Weather API', logo: '🌤️' },
  { name: 'IoT Sensors', logo: '📡' },
  { name: 'Stripe', logo: '💳' },
  { name: 'QuickBooks', logo: '📊' },
  { name: 'Slack', logo: '💬' },
  { name: 'Microsoft', logo: '🏢' }
];

export function LandingPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [pricingMode, setPricingMode] = useState<'monthly' | 'yearly'>('monthly');
  
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 300], [0, -50]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.8]);

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-300/20 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 right-4 w-72 h-72 bg-blue-300/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-violet-300/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 flex items-center justify-center shadow-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                AgroInsight Pro
              </span>
              <Badge variant="secondary" className="hidden sm:inline-flex bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 border-violet-200">
                <Crown className="h-3 w-3 mr-1" />
                Enterprise
              </Badge>
            </motion.div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-emerald-600 transition-all duration-200 hover:scale-105">Features</a>
              <a href="#testimonials" className="text-gray-600 hover:text-emerald-600 transition-all duration-200 hover:scale-105">Success Stories</a>
              <a href="#pricing" className="text-gray-600 hover:text-emerald-600 transition-all duration-200 hover:scale-105">Pricing</a>
              <Button variant="ghost" onClick={() => openAuth('login')} className="hover:bg-emerald-50">
                Sign In
              </Button>
              <Button 
                onClick={() => openAuth('register')} 
                className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 hover:from-emerald-600 hover:via-green-600 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Start Free Trial
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <motion.div 
          className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <div className="text-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Badge variant="secondary" className="mb-6 bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 border-violet-200 text-sm px-4 py-2">
                <Rocket className="h-4 w-4 mr-2" />
                AI-Powered Agricultural Revolution
              </Badge>
              
              <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-tight">
                The Future of{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 bg-clip-text text-transparent relative">
                  Smart Farming
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed">
                Transform your agricultural empire with enterprise-grade AI intelligence. 
                <span className="font-semibold text-emerald-600"> Increase profits by 47%, </span>
                reduce costs, and revolutionize livestock management with predictive analytics.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                <Button 
                  size="lg" 
                  onClick={() => openAuth('register')}
                  className="text-xl px-10 py-6 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 hover:from-emerald-600 hover:via-green-600 hover:to-teal-700 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
                >
                  <Gem className="mr-3 h-6 w-6" />
                  Start 30-Day Premium Trial
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-xl px-10 py-6 border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400 transition-all duration-300 transform hover:scale-105"
                >
                  <Play className="mr-3 h-6 w-6" />
                  Watch Live Demo
                </Button>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                    className="text-center p-4 rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
                      {stat.number}
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">{stat.label}</div>
                    <div className="text-xs text-gray-500">{stat.sublabel}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="h-8 w-8 text-gray-400" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge variant="secondary" className="mb-6 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-200">
              <Award className="h-4 w-4 mr-2" />
              Industry-Leading Technology
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              Enterprise Features for{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Modern Agriculture
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Comprehensive tools designed for the next generation of agricultural excellence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-emerald-200 dark:hover:border-emerald-800 relative overflow-hidden">
                  {feature.premium && (
                    <Badge className="absolute top-4 right-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                  <CardHeader className="pb-4">
                    <div className={`${feature.bgColor} ${feature.color} p-6 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                      <feature.icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-2xl mb-4 group-hover:text-emerald-600 transition-colors duration-300">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                      {feature.description}
                    </p>
                  </CardContent>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-green-400/5 to-teal-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-950/20 dark:via-green-950/20 dark:to-teal-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge variant="secondary" className="mb-6 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200">
              <Users className="h-4 w-4 mr-2" />
              Trusted by Industry Leaders
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              Transforming Farms{' '}
              <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Worldwide
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              See how agricultural leaders are revolutionizing their operations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-2 border-white/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
                  <CardContent className="p-8">
                    <div className="flex mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <Badge className="mb-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white">
                      {testimonial.savings}
                    </Badge>
                    <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed text-lg italic">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="h-16 w-16 rounded-full mr-4 ring-4 ring-emerald-100"
                      />
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white text-lg">{testimonial.name}</div>
                        <div className="text-emerald-600 dark:text-emerald-400 font-medium">
                          {testimonial.role}
                        </div>
                        <div className="text-gray-500 text-sm">{testimonial.company}</div>
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
      <section id="pricing" className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge variant="secondary" className="mb-6 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border-purple-200">
              <TrendingUp className="h-4 w-4 mr-2" />
              Transparent Pricing
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              Choose Your{' '}
              <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Success Plan
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Scale with confidence - upgrade or downgrade anytime
            </p>
            
            {/* Pricing Toggle */}
            <div className="flex items-center justify-center gap-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-full w-fit mx-auto">
              <button
                onClick={() => setPricingMode('monthly')}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  pricingMode === 'monthly'
                    ? 'bg-white dark:bg-gray-700 shadow-lg text-gray-900 dark:text-white'
                    : 'text-gray-500'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setPricingMode('yearly')}
                className={`px-6 py-2 rounded-full transition-all duration-300 relative ${
                  pricingMode === 'yearly'
                    ? 'bg-white dark:bg-gray-700 shadow-lg text-gray-900 dark:text-white'
                    : 'text-gray-500'
                }`}
              >
                Yearly
                <Badge className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs">
                  17% OFF
                </Badge>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className={`h-full relative transition-all duration-500 ${
                  plan.popular 
                    ? 'border-emerald-500 shadow-2xl scale-105 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/20 dark:to-gray-900' 
                    : 'border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-105'
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-2 text-sm">
                        <Crown className="h-4 w-4 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-3xl mb-4">{plan.name}</CardTitle>
                    <div className="mb-6">
                      <span className="text-6xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                        {pricingMode === 'yearly' ? plan.yearlyPrice : plan.price}
                      </span>
                      <span className="text-gray-500 text-xl">{pricingMode === 'yearly' ? '/year' : plan.period}</span>
                      {pricingMode === 'yearly' && (
                        <div className="text-sm text-emerald-600 font-medium mt-2">
                          {plan.yearlyDiscount}
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">{plan.description}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <ul className="space-y-4">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className={`w-full py-4 text-lg transition-all duration-300 ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg hover:shadow-xl' 
                          : 'hover:bg-emerald-50 hover:border-emerald-300'
                      }`}
                      variant={plan.popular ? 'default' : 'outline'}
                      onClick={() => openAuth('register')}
                    >
                      {plan.tier === 'enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">Seamless Integrations</h3>
            <p className="text-gray-600 dark:text-gray-400">Connect with your favorite tools and services</p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60 hover:opacity-100 transition-opacity duration-500">
            {integrations.map((integration, index) => (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="flex items-center space-x-3 bg-white dark:bg-gray-800 px-6 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span className="text-2xl">{integration.logo}</span>
                <span className="font-medium">{integration.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30">
              <Infinity className="h-4 w-4 mr-2" />
              Join the Revolution
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              Ready to Transform Your Farm?
            </h2>
            <p className="text-xl mb-12 max-w-3xl mx-auto opacity-90 leading-relaxed">
              Join thousands of forward-thinking farmers who've revolutionized their operations. 
              Start your journey to agricultural excellence today.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                onClick={() => openAuth('register')}
                className="text-xl px-10 py-6 bg-white text-emerald-600 hover:bg-gray-100 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
              >
                <Gem className="mr-3 h-6 w-6" />
                Start Free 30-Day Trial
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-xl px-10 py-6 border-white text-white hover:bg-white/10 transition-all duration-300"
              >
                <Monitor className="mr-3 h-6 w-6" />
                Schedule Live Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 flex items-center justify-center shadow-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                AgroInsight Pro
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <Globe className="h-5 w-5 text-emerald-600" />
              <span className="text-gray-600 dark:text-gray-400">
                © 2024 AgroInsight Pro. Revolutionizing agriculture worldwide.
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
      
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes tilt {
          0%, 50%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(0.5deg); }
          75% { transform: rotate(-0.5deg); }
        }
        .animate-tilt {
          animation: tilt 10s infinite linear;
        }
      `}</style>
    </div>
  );
}
