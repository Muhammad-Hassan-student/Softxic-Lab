import { Button } from 'flowbite-react';
import React from 'react';
import { 
 HiGift, 
  HiChip, 
  HiOfficeBuilding, 
  HiSparkles, 
  HiArrowNarrowRight,
  HiCloudUpload,
  HiUsers,
  HiUserCircle
} from 'react-icons/hi';
import { Link } from 'react-router-dom';

export default function CallToAction() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl shadow-2xl">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative flex flex-col lg:flex-row p-8 md:p-12 gap-8 items-center">
        {/* Left Content */}
        <div className="flex-1 text-center lg:text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <HiSparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-white/90">Softxic Agency • Since 2024</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Launch Your Digital 
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Success Story</span>
          </h2>
          
          <p className="text-base md:text-lg text-gray-300 mb-6 leading-relaxed">
            From SaaS products to enterprise solutions — we help businesses transform ideas into scalable digital realities.
          </p>
          
          {/* Services Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            {[
              { icon: HiGift, name: "SaaS Launch", color: "from-blue-500 to-cyan-500" },
              { icon: HiCloudUpload, name: "Project Launch", color: "from-purple-500 to-pink-500" },
              { icon: HiOfficeBuilding, name: "Enterprise", color: "from-green-500 to-emerald-500" },
              { icon: HiChip, name: "AI Solutions", color: "from-orange-500 to-red-500" },
              { icon: HiUsers, name: "Team Training", color: "from-indigo-500 to-blue-500" },
              { icon: HiSparkles, name: "Digital Transformation", color: "from-pink-500 to-rose-500" }
            ].map((service, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <service.icon className={`w-4 h-4 text-transparent bg-gradient-to-r ${service.color} bg-clip-text`} />
                <span className="text-xs font-medium text-white">{service.name}</span>
              </div>
            ))}
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link to="/contact">
              <Button 
                gradientDuoTone="purpleToPink" 
                className="w-full sm:w-auto rounded-full px-6 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Start Your Project
                <HiArrowNarrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/services">
              <Button 
                color="gray" 
                className="w-full sm:w-auto rounded-full px-6 py-3 text-base font-semibold bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all duration-300"
              >
                Explore Services
              </Button>
            </Link>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mt-8 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400">50+ Projects Launched</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400">24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400">Enterprise Grade</span>
            </div>
          </div>
        </div>
        
        {/* Right Image - Modern Illustration */}
        <div className="flex-1 relative">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
            <img 
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%238b5cf6;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23ec4899;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='%231a1a2e'/%3E%3Ccircle cx='200' cy='200' r='150' fill='url(%23grad)' opacity='0.3'/%3E%3Ccircle cx='600' cy='400' r='200' fill='url(%23grad)' opacity='0.2'/%3E%3Cpath d='M400,200 L500,300 L400,400 L300,300 Z' fill='url(%23grad)' opacity='0.8'/%3E%3Ccircle cx='400' cy='300' r='50' fill='white' opacity='0.9'/%3E%3Cpath d='M350,300 L450,300 M400,250 L400,350' stroke='%231a1a2e' stroke-width='3'/%3E%3C/svg%3E"
              alt="Softxic Agency - SaaS, Enterprise & Project Launch Services"
              className="w-full h-auto rounded-2xl"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          </div>
          
          {/* Floating Badges */}
          <div className="absolute -top-4 -left-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-3 animate-bounce">
            <div className="flex items-center gap-2">
              <HiGift className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-bold text-gray-800 dark:text-white">SaaS Launch</span>
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-3 animate-bounce delay-700">
            <div className="flex items-center gap-2">
              <HiOfficeBuilding className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-bold text-gray-800 dark:text-white">Enterprise</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}