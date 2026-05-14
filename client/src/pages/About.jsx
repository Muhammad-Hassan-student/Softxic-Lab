import React from "react";
import { Link } from "react-router-dom";
import {
  HiGlobeAlt,
  HiCode,
  HiChip,
  HiUsers,
  HiSparkles,
  HiLightBulb,
  HiHeart,
  HiCheckCircle,
  HiShieldCheck,
  HiGlobe,
  HiChartBar,
  HiArrowNarrowRight,
  HiCursorClick,
  HiStar,
} from "react-icons/hi";
import CallToAction from "./CallToAction";

export default function About() {

  const stats = [
    { label: "Projects Delivered", value: "50+", icon: HiCode },
    { label: "Countries Served", value: "4", icon: HiGlobeAlt },
    { label: "Happy Clients", value: "30+", icon: HiUsers },
    { label: "Satisfaction", value: "99%", icon: HiHeart },
  ];

  const services = [
    "Modern Web Applications",
    "Enterprise SaaS Products",
    "AI & Machine Learning Integration",
    "Cross-Platform Mobile Apps",
    "Cloud Architecture & DevOps",
    "Custom Software Development",
  ];

  const values = [
    {
      title: "Technical Excellence",
      description: "UK Government certified development standards with enterprise-grade quality assurance.",
      icon: HiShieldCheck,
    },
    {
      title: "Innovation First",
      description: "Cutting-edge AI, real-time systems, and modern frameworks for every project.",
      icon: HiChip,
    },
    {
      title: "Global Mindset",
      description: "Serving clients across Pakistan, UK, UAE, and USA with 24/7 support.",
      icon: HiGlobe,
    },
    {
      title: "Client Success",
      description: "Your growth is our mission — we build solutions that drive real business results.",
      icon: HiChartBar,
    },
  ];

  return (
    <main className="bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section - Matches Post.jsx style */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-pink-900 to-purple-900">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
            <HiSparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-medium text-white/90">Building Digital Excellence Worldwide</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            About <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">SoftXic</span>
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            We are a global technology agency specializing in modern web applications, enterprise SaaS products, 
            and cross-platform mobile solutions for clients across Pakistan, UK, UAE, and USA.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-12 md:h-20">
            <path d="M0,0 C300,100 900,100 1200,0 L1200,120 L0,120 Z" fill="#f3f4f6" className="dark:fill-gray-900"></path>
          </svg>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-4 -mt-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 text-center transform hover:scale-105 transition-all duration-300">
              <stat.icon className="w-10 h-10 mx-auto text-purple-600 dark:text-purple-400 mb-3" />
              <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* What is SoftXic Section */}
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 rounded-full px-4 py-1.5 mb-4">
              <HiLightBulb className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">The Brand</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What is <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">SoftXic</span>?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              SoftXic is a global technology innovation agency that builds modern digital solutions for businesses worldwide. 
              From complete web applications and enterprise SaaS platforms to Android and iOS mobile applications, we transform 
              ideas into scalable, production-ready software.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <HiCheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Global Technology Agency — Serving clients across Pakistan, UK, UAE, and USA</span>
              </div>
              <div className="flex items-center gap-3">
                <HiCheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Full-Service Digital Solutions — Web, mobile, SaaS, and AI under one roof</span>
              </div>
              <div className="flex items-center gap-3">
                <HiCheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Enterprise-Grade Quality — UK Government certified development standards</span>
              </div>
              <div className="flex items-center gap-3">
                <HiCheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">End-to-End Delivery — From concept to deployment and beyond</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-20"></div>
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 shadow-2xl">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <HiChip className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">SoftXic Nexus</h3>
                <p className="text-purple-300 mb-4">Flagship AI Customer Support Platform</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white">AI-Powered</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white">24/7 Support</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white">Voice AI</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white">Enterprise Grade</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Founder Section */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 rounded-full px-4 py-1.5 mb-4">
                <HiUsers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Founder & CEO</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Muhammad Hassan Akram
              </h2>
              <p className="text-xl text-purple-600 dark:text-purple-400 mb-6">
                Senior Full Stack Architect | AI Specialist | Technology Entrepreneur
              </p>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p className="leading-relaxed">
                  Muhammad Hassan Akram is a self-taught prodigy who began his software engineering journey at age twelve. 
                  By sixteen, he was building production applications. By nineteen, he secured a contract with the 
                  <span className="font-semibold text-purple-600 dark:text-purple-400"> United Kingdom Government</span> 
                  to deliver a real-time multiplayer gaming platform.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <HiCheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>8+ years of professional software engineering experience starting at age 12</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <HiCheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Built production-ready AI platforms for UK Government projects</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <HiCheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Expert in MERN, Next.js, Flutter, React Native, and AI technologies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <HiCheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Solo-architected 5+ enterprise-grade production systems</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="order-1 md:order-2 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-2xl opacity-30"></div>
                <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
                  <span className="text-7xl font-bold text-white">HA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vision & Mission */}
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="text-center md:text-left">
            <div className="w-16 h-16 mx-auto md:mx-0 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-6">
              <HiCursorClick className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Our Mission</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              To empower businesses with intelligent, accessible, and affordable digital solutions that drive growth, 
              automate operations, and deliver exceptional customer experiences.
            </p>
          </div>
          <div className="text-center md:text-left">
            <div className="w-16 h-16 mx-auto md:mx-0 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-6">
              <HiStar className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Our Vision</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              To become a leading global technology agency with international recognition, serving 10,000+ businesses 
              and launching 100+ SaaS products by 2030.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 dark:bg-gray-800/50 py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 rounded-full px-4 py-1.5 mb-4">
              <HiHeart className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">What Drives Us</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Our Core Values</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
              The principles that guide everything we build
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center mb-4">
                  <value.icon className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 rounded-full px-4 py-1.5 mb-4">
            <HiCode className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">What We Build</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Complete Digital Solutions</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Across all platforms and technologies</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, idx) => (
            <div key={idx} className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all">
              <HiCheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">{service}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <CallToAction />
      </div>

      {/* Contact / Global Presence Footer inside about */}
      <div className="border-t border-gray-200 dark:border-gray-700 max-w-6xl mx-auto px-4 py-12">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Ready to Build Something Great?</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Whether you need a modern web application, a scalable SaaS product, or a cross-platform mobile app, 
            we're here to help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">
              Start Your Project
            </Link>
            <Link to="/search" className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all">
              Explore Our Blog
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.6s ease-out; }
        ::selection { background: linear-gradient(to right, #8b5cf6, #ec4899); color: white; }
      `}</style>
    </main>
  );
}