// Legal.jsx - Terms of Service & Privacy Policy for SoftXic Labs
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  HiShieldCheck,
  HiLockClosed,
  HiDatabase,
  HiDocumentText,
  HiScale,
  HiGlobeAlt,
  HiChip,
  HiUserGroup,
  HiCurrencyDollar,
  HiMail,
  HiPhone,
  HiCheckCircle,
  HiSparkles,
  HiAcademicCap,
  HiOfficeBuilding,
} from "react-icons/hi";

export default function Legal() {
  const [activeTab, setActiveTab] = useState("terms");

  return (
    <main className="bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-pink-900 to-purple-900">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
            <HiShieldCheck className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-medium text-white/90">Legal Information</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            Legal
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Terms of Service & Privacy Policy for SoftXic Labs, SoftXic Nexus, and all SoftXic digital properties.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-12 md:h-20">
            <path d="M0,0 C300,100 900,100 1200,0 L1200,120 L0,120 Z" fill="#f3f4f6" className="dark:fill-gray-900"></path>
          </svg>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-2 flex gap-2">
          <button
            onClick={() => setActiveTab("terms")}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === "terms"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <HiDocumentText className="w-5 h-5" />
            Terms of Service
          </button>
          <button
            onClick={() => setActiveTab("privacy")}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === "privacy"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <HiLockClosed className="w-5 h-5" />
            Privacy Policy
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 lg:p-10">
          {activeTab === "terms" ? <TermsContent /> : <PrivacyContent />}
        </div>
      </div>

      {/* Footer Note */}
      <div className="border-t border-gray-200 dark:border-gray-700 py-8 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Last updated: January 1, 2025 • For questions, contact{" "}
          <a href="mailto:legal@softxic.com" className="text-purple-600 dark:text-purple-400 hover:underline">
            legal@softxic.com
          </a>
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.6s ease-out; }
        ::selection { background: linear-gradient(to right, #8b5cf6, #ec4899); color: white; }
        .legal-content h2 { font-size: 1.5rem; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; color: #1f2937; }
        .legal-content h3 { font-size: 1.25rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #374151; }
        .legal-content p { margin-bottom: 1rem; line-height: 1.6; color: #4b5563; }
        .legal-content ul { margin: 1rem 0 1rem 1.5rem; list-style-type: disc; }
        .legal-content li { margin-bottom: 0.5rem; line-height: 1.5; color: #4b5563; }
        .dark .legal-content h2 { color: #f9fafb; }
        .dark .legal-content h3 { color: #e5e7eb; }
        .dark .legal-content p, .dark .legal-content li { color: #9ca3af; }
      `}</style>
    </main>
  );
}

// Terms of Service Component
function TermsContent() {
  return (
    <div className="legal-content">
      <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Terms of Service</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome to SoftXic Labs. By accessing or using our services, you agree to be bound by these terms.
        </p>
      </div>

      {/* Entity Information */}
      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-3">
          <HiOfficeBuilding className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Legal Entity Information</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-700 dark:text-gray-300">SoftXic Labs</p>
            <p className="text-gray-500 dark:text-gray-400">Innovation & Development</p>
            <p className="text-xs text-gray-400 mt-1">labs.softxic.com</p>
          </div>
          <div>
            <p className="font-medium text-gray-700 dark:text-gray-300">SoftXic Nexus</p>
            <p className="text-gray-500 dark:text-gray-400">AI Customer Support</p>
            <p className="text-xs text-gray-400 mt-1">nexus.softxic.com</p>
          </div>
          <div>
            <p className="font-medium text-gray-700 dark:text-gray-300">SoftXic Agency</p>
            <p className="text-gray-500 dark:text-gray-400">Parent Company</p>
            <p className="text-xs text-gray-400 mt-1">softxic.com</p>
          </div>
        </div>
      </div>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using any SoftXic digital property including but not limited to SoftXic Labs (labs.softxic.com), 
        SoftXic Nexus (nexus.softxic.com), and SoftXic Agency (softxic.com), you agree to comply with and be bound by 
        these Terms of Service. If you do not agree to these terms, please do not use our services.
      </p>

      <h2>2. Description of Services</h2>
      <p>
        SoftXic provides a range of digital services across three primary platforms:
      </p>
      <ul>
        <li><strong>SoftXic Agency (softxic.com):</strong> Premium digital agency services including web development, mobile app development, SaaS development, and digital marketing solutions.</li>
        <li><strong>SoftXic Nexus (nexus.softxic.com):</strong> AI-powered customer support platform with 24/7 automated assistance, voice AI, and enterprise-grade features.</li>
        <li><strong>SoftXic Labs (labs.softxic.com):</strong> Innovation hub featuring technical blog, experimental projects, developer resources, and community content.</li>
      </ul>

      <h2>3. User Accounts</h2>
      <p>
        To access certain features of our services, you may be required to create an account. You are responsible for:
      </p>
      <ul>
        <li>Maintaining the confidentiality of your account credentials</li>
        <li>All activities that occur under your account</li>
        <li>Notifying us immediately of any unauthorized access</li>
        <li>Providing accurate and complete registration information</li>
      </ul>

      <h2>4. Intellectual Property Rights</h2>
      <p>
        All content, features, and functionality of our services, including but not limited to text, graphics, logos, icons, 
        images, audio clips, video clips, data compilations, and software, are the exclusive property of SoftXic and are 
        protected by Pakistan, UK, and international copyright, trademark, patent, trade secret, and other intellectual 
        property laws.
      </p>
      <ul>
        <li>"SoftXic", "SoftXic Labs", "SoftXic Nexus", and related logos are registered trademarks</li>
        <li>Code snippets and tutorials are for educational purposes with proper attribution</li>
        <li>Unauthorized reproduction, distribution, or modification is prohibited</li>
      </ul>

      <h2>5. User-Generated Content</h2>
      <p>
        Our blog and community features may allow you to post comments, feedback, or other content. By submitting content:
      </p>
      <ul>
        <li>You grant SoftXic a non-exclusive, royalty-free, perpetual license to use, modify, and display your content</li>
        <li>You represent that you own or have permission to share the content</li>
        <li>You agree not to post harmful, illegal, or inappropriate content</li>
        <li>We reserve the right to remove any content at our discretion</li>
      </ul>

      <h2>6. Payment and Subscription Terms</h2>
      <p>
        For paid services including SoftXic Nexus subscriptions and agency services:
      </p>
      <ul>
        <li>All prices are in USD unless otherwise specified</li>
        <li>Subscriptions automatically renew unless cancelled before the renewal date</li>
        <li>Refunds are provided within 14 days of initial purchase for Nexus plans</li>
        <li>Custom development projects require 50% upfront deposit</li>
        <li>Accepted payment methods: Credit Card, Bank Transfer, JazzCash, Wise</li>
      </ul>

      <h2>7. Service Level Agreements</h2>
      <p>
        <strong>SoftXic Nexus:</strong> We guarantee 99.9% uptime for enterprise plans. For every hour of downtime beyond SLA, 
        you receive a 5% service credit, up to 50% of monthly fees.
      </p>
      <p>
        <strong>SoftXic Agency:</strong> Project timelines are agreed upon in the Statement of Work. Delays caused by client 
        feedback or requirement changes extend timelines accordingly.
      </p>

      <h2>8. Prohibited Conduct</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use our services for any illegal purpose or in violation of any laws</li>
        <li>Attempt to gain unauthorized access to our systems or networks</li>
        <li>Interfere with or disrupt the integrity or performance of our services</li>
        <li>Scrape, crawl, or use automated means to access our content without permission</li>
        <li>Transmit viruses, malware, or any code of a destructive nature</li>
        <li>Harass, abuse, or harm another person or entity</li>
      </ul>

      <h2>9. Termination</h2>
      <p>
        We may terminate or suspend your access immediately, without prior notice, for conduct that violates these Terms 
        or is harmful to other users or our services. Upon termination, your right to use the services will cease immediately.
      </p>

      <h2>10. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, SoftXic shall not be liable for any indirect, incidental, special, consequential, 
        or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, 
        resulting from:
      </p>
      <ul>
        <li>Your use or inability to use our services</li>
        <li>Any conduct or content of any third party on our services</li>
        <li>Unauthorized access, use, or alteration of your transmissions or content</li>
      </ul>
      <p>
        Our total liability shall not exceed the amount you paid us, if any, in the past 12 months.
      </p>

      <h2>11. Disclaimer of Warranties</h2>
      <p>
        Our services are provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied, 
        including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
      </p>

      <h2>12. Indemnification</h2>
      <p>
        You agree to defend, indemnify, and hold harmless SoftXic and its employees, contractors, and affiliates from any 
        claims, damages, losses, liabilities, costs, and expenses arising from your use of our services or violation of these Terms.
      </p>

      <h2>13. Governing Law</h2>
      <p>
        These Terms shall be governed by and construed in accordance with the laws of Pakistan and the United Kingdom, 
        without regard to conflict of law provisions. Disputes arising from these Terms shall be resolved in the courts of Lahore, Pakistan.
      </p>

      <h2>14. Changes to Terms</h2>
      <p>
        We reserve the right to modify these Terms at any time. We will notify users of material changes via email or through 
        our services. Your continued use after changes constitutes acceptance of the new Terms.
      </p>

      <h2>15. Contact Information</h2>
      <p>
        For questions about these Terms, please contact us:
      </p>
      <ul>
        <li>Email: <a href="mailto:legal@softxic.com" className="text-purple-600 dark:text-purple-400">legal@softxic.com</a></li>
        <li>Phone: +92 320 2190049</li>
        <li>Address: Lahore, Pakistan / London, United Kingdom</li>
      </ul>

      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500">
        <p>© 2025 SoftXic. All rights reserved. | SoftXic Labs | SoftXic Nexus | SoftXic Agency</p>
      </div>
    </div>
  );
}

// Privacy Policy Component
function PrivacyContent() {
  return (
    <div className="legal-content">
      <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Privacy Policy</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Your privacy is critically important to us. This policy describes how we collect, use, and protect your personal information.
        </p>
      </div>

      {/* Key Privacy Principles */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center">
          <HiShieldCheck className="w-8 h-8 mx-auto text-green-600 dark:text-green-400 mb-2" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">We Never Sell Your Data</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
          <HiLockClosed className="w-8 h-8 mx-auto text-blue-600 dark:text-blue-400 mb-2" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Bank-Level Encryption</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center">
          <HiUserGroup className="w-8 h-8 mx-auto text-purple-600 dark:text-purple-400 mb-2" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">You Control Your Data</p>
        </div>
      </div>

      <h2>1. Information We Collect</h2>
      
      <h3>1.1 Information You Provide</h3>
      <ul>
        <li><strong>Account Information:</strong> Name, email address, password, profile information</li>
        <li><strong>Contact Information:</strong> Phone number, company name, billing address</li>
        <li><strong>Communication:</strong> Messages, feedback, support requests, comments on blog posts</li>
        <li><strong>Payment Information:</strong> Processed securely by third-party providers (Stripe, PayPal) — we never store full payment details</li>
      </ul>

      <h3>1.2 Information Automatically Collected</h3>
      <ul>
        <li><strong>Usage Data:</strong> Pages visited, time spent, features used, search queries</li>
        <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
        <li><strong>Location Data:</strong> Approximate geographic location based on IP address</li>
        <li><strong>Cookies:</strong> Small text files stored on your device to enhance functionality</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li><strong>Provide and Improve Services:</strong> Delivering our platforms, fixing bugs, and developing new features</li>
        <li><strong>Communication:</strong> Responding to inquiries, sending service updates, and important notices</li>
        <li><strong>Personalization:</strong> Tailoring content recommendations and user experience</li>
        <li><strong>Analytics:</strong> Understanding usage patterns and improving performance</li>
        <li><strong>Security:</strong> Detecting and preventing fraud, abuse, and security incidents</li>
        <li><strong>Legal Compliance:</strong> Fulfilling legal obligations and enforcing our terms</li>
      </ul>

      <h2>3. Platform-Specific Data Practices</h2>
      
      <h3>SoftXic Labs (labs.softxic.com)</h3>
      <ul>
        <li>Blog comments are public and visible to all visitors</li>
        <li>We collect reading preferences to recommend relevant articles</li>
        <li>Code snippets shared in comments are stored but not executed</li>
        <li>Newsletter subscribers receive technical content and updates</li>
      </ul>

      <h3>SoftXic Nexus (nexus.softxic.com)</h3>
      <ul>
        <li>Conversations with Nexus AI are logged for quality improvement</li>
        <li>Customer support data is retained for service continuity</li>
        <li>Enterprise clients can request data deletion within 30 days</li>
        <li>Voice interactions are processed but not stored without consent</li>
      </ul>

      <h3>SoftXic Agency (softxic.com)</h3>
      <ul>
        <li>Project-related data is confidential and client-owned</li>
        <li>Development repositories are private unless open-sourced</li>
        <li>NDA agreements available for sensitive projects</li>
        <li>Client communication is stored for project continuity</li>
      </ul>

      <h2>4. Cookies and Tracking Technologies</h2>
      <p>
        We use cookies and similar technologies to enhance your experience. Types of cookies we use:
      </p>
      <ul>
        <li><strong>Essential Cookies:</strong> Required for basic functionality (login, security)</li>
        <li><strong>Preference Cookies:</strong> Remember your settings (dark mode, language)</li>
        <li><strong>Analytics Cookies:</strong> Understand how you use our services (Google Analytics)</li>
        <li><strong>Marketing Cookies:</strong> Deliver relevant advertisements (only with consent)</li>
      </ul>
      <p>
        You can control cookie preferences through your browser settings. Blocking essential cookies may affect service functionality.
      </p>

      <h2>5. Data Sharing and Disclosure</h2>
      <p>We do not sell your personal information. We may share data in these limited circumstances:</p>
      <ul>
        <li><strong>Service Providers:</strong> Third parties who assist with hosting, payment processing, email delivery, analytics</li>
        <li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
        <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
        <li><strong>With Your Consent:</strong> When you explicitly authorize sharing</li>
      </ul>

      <h3>Third-Party Services We Use:</h3>
      <ul>
        <li>Vercel / AWS - Cloud hosting</li>
        <li>MongoDB / PostgreSQL - Database services</li>
        <li>Stripe / PayPal - Payment processing</li>
        <li>Google Analytics - Usage analytics</li>
        <li>SendGrid / Resend - Email delivery</li>
      </ul>

      <h2>6. Data Security</h2>
      <p>
        We implement industry-standard security measures to protect your data:
      </p>
      <ul>
        <li>SSL/TLS encryption for all data transmission (HTTPS)</li>
        <li>Encrypted database storage for sensitive information</li>
        <li>Regular security audits and penetration testing</li>
        <li>Access controls and authentication for internal systems</li>
        <li>24/7 monitoring for suspicious activity</li>
      </ul>

      <h2>7. Data Retention</h2>
      <p>
        We retain your personal information for as long as necessary to provide services and fulfill legal obligations:
      </p>
      <ul>
        <li>Account data: Until account deletion + 30 days for recovery</li>
        <li>Blog comments: Indefinitely (public content)</li>
        <li>Support conversations: 2 years from last interaction</li>
        <li>Analytics data: 26 months (Google Analytics retention)</li>
        <li>Payment records: 7 years for tax/legal compliance</li>
      </ul>

      <h2>8. Your Rights and Choices</h2>
      <p>Depending on your location (GDPR for EU/UK, PDPA for Pakistan, CCPA for California), you may have:</p>
      <ul>
        <li><strong>Right to Access:</strong> Request a copy of your data</li>
        <li><strong>Right to Rectification:</strong> Correct inaccurate information</li>
        <li><strong>Right to Deletion:</strong> Request deletion of your data ("Right to be Forgotten")</li>
        <li><strong>Right to Restrict Processing:</strong> Limit how we use your data</li>
        <li><strong>Right to Data Portability:</strong> Receive your data in a machine-readable format</li>
        <li><strong>Right to Object:</strong> Opt-out of certain processing (marketing)</li>
        <li><strong>Right to Withdraw Consent:</strong> For consent-based processing</li>
      </ul>

      <h2>9. International Data Transfers</h2>
      <p>
        SoftXic operates globally with offices in Pakistan, UK, UAE, and USA. Your information may be transferred to and 
        processed in countries with different data protection laws. We ensure appropriate safeguards (Standard Contractual Clauses) 
        for international transfers.
      </p>

      <h2>10. Children's Privacy</h2>
      <p>
        Our services are not directed to individuals under 13 years of age. We do not knowingly collect personal information 
        from children. If you believe a child has provided us with data, please contact us for deletion.
      </p>

      <h2>11. GDPR Compliance (EU/UK Users)</h2>
      <p>
        For users in the European Union and United Kingdom, we comply with GDPR requirements:
      </p>
      <ul>
        <li>Lawful basis for processing: Contract, legal obligation, legitimate interests, consent</li>
        <li>Data Protection Officer (DPO) contact: dpo@softxic.com</li>
        <li>Right to lodge complaint with supervisory authority</li>
      </ul>

      <h2>12. CCPA Compliance (California Users)</h2>
      <p>
        California residents have additional rights under the California Consumer Privacy Act:
      </p>
      <ul>
        <li>Right to know what personal information is collected</li>
        <li>Right to delete personal information</li>
        <li>Right to opt-out of sale of personal information (we do not sell data)</li>
        <li>Right to non-discrimination for exercising rights</li>
      </ul>
      <p>To exercise CCPA rights, email privacy@softxic.com with "CCPA Request" in the subject line.</p>

      <h2>13. Changes to This Privacy Policy</h2>
      <p>
        We may update this Privacy Policy periodically. Material changes will be notified via:
      </p>
      <ul>
        <li>Email to registered users (30 days before effective date)</li>
        <li>Notice on our websites (prominent banner)</li>
        <li>Updated "Last updated" date at the top of this policy</li>
      </ul>

      <h2>14. Contact Us</h2>
      <p>
        For privacy-related questions, data requests, or concerns:
      </p>
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 mt-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <HiMail className="w-5 h-5 text-purple-600" />
            <a href="mailto:privacy@softxic.com" className="text-purple-600 dark:text-purple-400 hover:underline">
              privacy@softxic.com
            </a>
            <span className="text-gray-400">— Data Protection Requests</span>
          </div>
          <div className="flex items-center gap-3">
            <HiMail className="w-5 h-5 text-purple-600" />
            <a href="mailto:legal@softxic.com" className="text-purple-600 dark:text-purple-400 hover:underline">
              legal@softxic.com
            </a>
            <span className="text-gray-400">— Legal & Compliance</span>
          </div>
          <div className="flex items-center gap-3">
            <HiPhone className="w-5 h-5 text-purple-600" />
            <span>+92 320 2190049</span>
            <span className="text-gray-400">— Business Hours (Mon-Fri, 9AM-6PM PKT)</span>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500">
        <p>© 2025 SoftXic. All rights reserved. | Last updated: January 1, 2025</p>
      </div>
    </div>
  );
}