// Contact.jsx - Professional Enterprise Version
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiGlobeAlt,
  HiClock,
  HiCheckCircle,
  HiX,
  HiSparkles,
  HiChatAlt2,
  HiPaperAirplane,
  HiMap,
  HiCalendar,
  HiShieldCheck,
  HiGlobe,
  HiTrendingUp,
  HiCode,
  HiDesktopComputer,
  HiDeviceMobile,
  HiCloudUpload,
  HiOfficeBuilding,
  HiUsers,
  HiStar,
  HiBadgeCheck
} from "react-icons/hi";
import { Button, Spinner, TextInput, Textarea } from "flowbite-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      5000
    );
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = "Name is required";
    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.subject?.trim()) newErrors.subject = "Subject is required";
    if (!formData.message?.trim()) newErrors.message = "Message is required";
    if (formData.message?.trim().length < 10)
      newErrors.message = "Message must be at least 10 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast("Please fix the errors in the form", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/contact/send`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (res.ok) {
        showToast("Message sent successfully! We'll get back to you soon.", "success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setErrors({});
        if (formRef.current) formRef.current.reset();
      } else {
        showToast(data.message || "Failed to send message. Please try again.", "error");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      showToast("Something went wrong. Please try again later.", "error");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: HiMail,
      title: "Email Us",
      details: ["hello@softxic.com", "support@softxic.com"],
      link: "mailto:hello@softxic.com",
      color: "from-blue-500 to-cyan-500",
      description: "Response within 24 hours",
    },
    {
      icon: HiPhone,
      title: "Call / WhatsApp",
      details: ["+92 320 2190049", "+44 20 1234 5678"],
      link: "tel:+923202190049",
      color: "from-green-500 to-emerald-500",
      description: "Available 9AM - 6PM GMT",
    },
    {
      icon: HiLocationMarker,
      title: "Head Office",
      details: ["Karachi, Pakistan"],
      link: "https://maps.google.com",
      color: "from-red-500 to-orange-500",
      description: "Global HQ",
    },
    {
      icon: HiClock,
      title: "Business Hours",
      details: ["Mon-Fri: 9AM - 6PM", "Sat-Sun: By Appointment"],
      color: "from-purple-500 to-pink-500",
      description: "24/7 Online Support",
    },
  ];

  const services = [
    {
      icon: HiCode,
      title: "Web Development",
      description: "Modern, scalable web applications",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: HiDeviceMobile,
      title: "Mobile Apps",
      description: "Cross-platform mobile solutions",
      color: "from-green-500 to-teal-500",
    },
    {
      icon: HiCloudUpload,
      title: "Cloud Solutions",
      description: "AWS, Azure, Google Cloud",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: HiTrendingUp,
      title: "Digital Marketing",
      description: "SEO, PPC, Social Media",
      color: "from-orange-500 to-red-500",
    },
  ];

  const globalOffices = [
    {
      city: "Karachi, Pakistan",
      address: "Tech Hub, DHA Phase 8, Karachi",
      phone: "+92 320 2190049",
      email: "pk@softxic.com",
      region: "South Asia",
      timezone: "GMT+5",
    },
    {
      city: "Dubai, UAE",
      address: "Dubai Internet City, DIC",
      phone: "+971 4 123 4567",
      email: "uae@softxic.com",
      region: "Middle East",
      timezone: "GMT+4",
    },
    {
      city: "Riyadh, Saudi Arabia",
      address: "King Abdullah Financial District",
      phone: "+966 11 123 4567",
      email: "ksa@softxic.com",
      region: "Middle East",
      timezone: "GMT+3",
    },
    {
      city: "London, United Kingdom",
      address: "Canary Wharf, London E14",
      phone: "+44 20 1234 5678",
      email: "uk@softxic.com",
      region: "Europe",
      timezone: "GMT+0",
    },
    {
      city: "Shanghai, China",
      address: "Pudong Software Park, Shanghai",
      phone: "+86 21 1234 5678",
      email: "cn@softxic.com",
      region: "Asia Pacific",
      timezone: "GMT+8",
    },
    {
      city: "Istanbul, Turkiye",
      address: "Maslak Business District, Istanbul",
      phone: "+90 212 123 4567",
      email: "tr@softxic.com",
      region: "Middle East",
      timezone: "GMT+3",
    },
  ];

  const partners = [
    { name: "AWS Partner Network", icon: HiCloudUpload, color: "from-orange-500 to-red-500" },
    { name: "Microsoft Gold Partner", icon: HiDesktopComputer, color: "from-blue-500 to-indigo-500" },
    { name: "Google Cloud Partner", icon: HiGlobe, color: "from-green-500 to-teal-500" },
    { name: "Meta Business Partner", icon: HiUsers, color: "from-blue-600 to-cyan-600" },
  ];

  const faqs = [
    {
      question: "What's your typical response time?",
      answer: "We respond to all inquiries within 24 business hours. For urgent matters, please call our WhatsApp number +92 320 2190049.",
    },
    {
      question: "Do you offer free consultations?",
      answer: "Yes, we offer a free 30-minute consultation to discuss your project requirements and provide initial recommendations.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept bank transfers, credit cards, Wise, PayPal, and JazzCash for local clients in Pakistan.",
    },
    {
      question: "Do you work with international clients?",
      answer: "Absolutely! We serve clients worldwide from our global offices in Pakistan, UAE, Saudi Arabia, UK, China, and Turkiye.",
    },
    {
      question: "What industries do you specialize in?",
      answer: "We specialize in FinTech, EdTech, Healthcare, E-commerce, SaaS, and Enterprise solutions across all industries.",
    },
    {
      question: "Do you provide post-launch support?",
      answer: "Yes, we provide 30 days of free support and offer ongoing maintenance and support packages tailored to your needs.",
    },
  ];

  const testimonials = [
    {
      name: "Ahmed Al-Rashid",
      company: "TechVision UAE",
      text: "SoftXic delivered our platform ahead of schedule. Their team's expertise in cloud architecture is outstanding.",
      rating: 5,
    },
    {
      name: "Sarah Johnson",
      company: "London FinTech",
      text: "Working with SoftXic transformed our digital presence. Highly recommended for enterprise solutions.",
      rating: 5,
    },
    {
      name: "Zhang Wei",
      company: "Shanghai Digital",
      text: "Professional, reliable, and technically excellent. They understood our requirements perfectly.",
      rating: 5,
    },
  ];

  return (
    <main className="bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-slate-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
            <HiSparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-medium text-white/90">Global Reach, Local Excellence</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            Contact{" "}
            <span className="bg-gradient-to-r from-indigo-300 via-slate-300 to-blue-300 bg-clip-text text-transparent">
              SoftXic
            </span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            From Karachi to London, Dubai to Shanghai — we're here to help you succeed.
            Reach out to our global team today.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-12 md:h-20">
            <path d="M0,0 C300,100 900,100 1200,0 L1200,120 L0,120 Z" fill="#f3f4f6" className="dark:fill-gray-900"></path>
          </svg>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in">
          <div
            className={`rounded-xl shadow-2xl p-4 min-w-[280px] max-w-md backdrop-blur-sm ${
              toast.type === "success"
                ? "bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/95 dark:to-green-900/95 border border-emerald-200 dark:border-emerald-700"
                : "bg-gradient-to-r from-rose-50 to-red-50 dark:from-rose-900/95 dark:to-red-900/95 border border-red-200 dark:border-red-700"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {toast.type === "success" ? (
                  <HiCheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <HiX className="w-5 h-5 text-red-600 dark:text-red-400" />
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${toast.type === "success" ? "text-emerald-800 dark:text-emerald-200" : "text-red-800 dark:text-red-200"}`}>
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => setToast({ show: false, message: "", type: "success" })}
                className="flex-shrink-0"
              >
                <HiX className="w-4 h-4 text-gray-500 hover:text-gray-700 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Info Cards */}
      <div className="max-w-6xl mx-auto px-4 -mt-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, idx) => (
            <div
              key={idx}
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 text-center transform hover:-translate-y-2 transition-all duration-300 cursor-pointer"
              onClick={() => info.link && window.open(info.link, "_blank")}
            >
              <div
                className={`w-14 h-14 mx-auto rounded-xl bg-gradient-to-r ${info.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <info.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{info.title}</h3>
              {info.details.map((detail, i) => (
                <p key={i} className="text-gray-600 dark:text-gray-400 text-sm">{detail}</p>
              ))}
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{info.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Global Presence Banner */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-indigo-900 to-slate-800 rounded-2xl p-8 text-center text-white">
          <HiGlobe className="w-12 h-12 mx-auto mb-4 text-indigo-300" />
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Global Presence</h2>
          <p className="text-indigo-200 mb-4">Trusted by clients across 6+ countries worldwide</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="px-3 py-1 bg-white/10 rounded-full">Pakistan</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">United Arab Emirates</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">Saudi Arabia</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">United Kingdom</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">China</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">Turkiye</span>
          </div>
        </div>
      </div>

      {/* Contact Form & Services Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full px-4 py-1.5 mb-4">
                <HiChatAlt2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Send a Message</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Let's Talk Business</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Fill out the form below and our global team will get back to you within 24 hours.
              </p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <TextInput
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  color={errors.name ? "failure" : "gray"}
                  helperText={errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <TextInput
                  id="email"
                  type="email"
                  placeholder="hello@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  color={errors.email ? "failure" : "gray"}
                  helperText={errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <TextInput
                  id="subject"
                  type="text"
                  placeholder="Project Inquiry / Support / Partnership"
                  value={formData.subject}
                  onChange={handleChange}
                  color={errors.subject ? "failure" : "gray"}
                  helperText={errors.subject && <span className="text-red-500 text-sm">{errors.subject}</span>}
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your project, questions, or ideas..."
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  color={errors.message ? "failure" : "gray"}
                  helperText={errors.message && <span className="text-red-500 text-sm">{errors.message}</span>}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 10 characters</p>
              </div>

              <Button type="submit" disabled={loading} gradientDuoTone="purpleToPink" className="w-full py-3">
                {loading ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <HiPaperAirplane className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Services & Trust Section */}
          <div>
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full px-4 py-1.5 mb-4">
                <HiOfficeBuilding className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Our Services</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">What We Offer</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Comprehensive technology solutions tailored to your business needs.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-8">
              {services.map((service, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${service.color} flex items-center justify-center flex-shrink-0`}>
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{service.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="bg-gray-100 dark:bg-gray-800/50 rounded-xl p-6 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <HiBadgeCheck className="w-6 h-6 text-indigo-600" />
                <h3 className="font-bold text-gray-900 dark:text-white">Trusted Globally</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {partners.map((partner, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-white dark:bg-gray-700 rounded-lg">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${partner.color} flex items-center justify-center`}>
                      <partner.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{partner.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Offices Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full px-4 py-1.5 mb-4">
            <HiGlobe className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Our Global Network</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">International Offices</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            With 6 strategic locations across the globe, we're always within reach to serve our clients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {globalOffices.map((office, idx) => (
            <div
              key={idx}
              className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-gray-900 dark:text-white text-lg">{office.city}</h4>
                <span className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full">
                  {office.region}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{office.address}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">📞</span> {office.phone}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">✉️</span> {office.email}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Timezone: {office.timezone}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gray-100 dark:bg-gray-800/30 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full px-4 py-1.5 mb-4">
              <HiUsers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Client Success</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">What Our Clients Say</h2>
            <p className="text-gray-600 dark:text-gray-400">Trusted by businesses worldwide</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <HiStar key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 italic">"{testimonial.text}"</p>
                <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
                  <p className="font-bold text-gray-900 dark:text-white">{testimonial.name}</p>
                  <p className="text-xs text-gray-500">{testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full px-4 py-1.5 mb-4">
            <HiClock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Quick Answers</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Frequently Asked Questions</h2>
          <p className="text-gray-600 dark:text-gray-400">Find quick answers to common inquiries</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md hover:shadow-lg transition-all">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">{faq.question}</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* WhatsApp CTA Banner */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-center text-white">
          <HiPhone className="w-12 h-12 mx-auto mb-4 text-green-200" />
          <h2 className="text-2xl font-bold mb-2">Need Immediate Assistance?</h2>
          <p className="text-green-100 mb-4">Connect with us directly on WhatsApp for urgent inquiries</p>
          <a
            href="https://wa.me/923202190049"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-700 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            <HiPhone className="w-5 h-5" />
            +92 320 2190049
          </a>
          <p className="text-xs text-green-200 mt-3">Response within 2 hours</p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in { animation: fadeIn 0.6s ease-out; }
        .animate-slide-in { animation: slideIn 0.3s ease-out; }
        ::selection { background: linear-gradient(to right, #6366f1, #ec4899); color: white; }
      `}</style>
    </main>
  );
}