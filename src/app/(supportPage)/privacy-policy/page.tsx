"use client"
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Shield, Eye, Lock, Mail, Phone, MapPin, Clock, AlertTriangle, CheckCircle, Globe } from 'lucide-react';

const PrivacyPolicy = () => {
  const [expandedSections, setExpandedSections] = useState<any>({});
  const [lastUpdated] = useState('January 2025');

  const toggleSection = (sectionId: any) => {
    setExpandedSections((prev: any) => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const quickAccess = [
    { icon: <Shield className="w-5 h-5" />, title: "Data Protection Rights", section: "rights" },
    { icon: <Eye className="w-5 h-5" />, title: "Data We Collect", section: "collection" },
    { icon: <Lock className="w-5 h-5" />, title: "Data Security", section: "security" },
    { icon: <Globe className="w-5 h-5" />, title: "Data Sharing", section: "sharing" }
  ];

  const sections = [
    {
      id: "overview",
      title: "Privacy Policy Overview",
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Company Information</h4>
            <div className="space-y-2 text-blue-800">
              <p><strong>Company:</strong> Dhaneri Fashion</p>
              <p><strong>GSTIN No:</strong> 24BXLPK0517M1ZD</p>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">Legal Framework</h4>
            <p className="text-green-800 text-sm">
              Data Privacy and Protection in India is regulated by the Information Technology Act, 2000 ("IT Act 2000")
              in conjunction with the Information Technology (Reasonable Security Practices and Procedures and
              Sensitive Personal Data or Information) Rules, 2011 ("SPDI Rules").
            </p>
          </div>
        </div>
      )
    },
    {
      id: "grievance",
      title: "Grievance Redressal Officer",
      content: (
        <div className="space-y-4">
          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-semibold text-orange-900 mb-3">Contact Information</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center">
                  <span className="text-orange-800 font-semibold text-sm">PK</span>
                </div>
                <div>
                  <p className="font-semibold text-orange-900">Pinjas Kumbhani</p>
                  <p className="text-orange-700 text-sm">CRM Team Leader</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-orange-700">
                  <Phone className="w-4 h-4" />
                  <span>82009 45846</span>
                </div>
                <div className="flex items-center gap-2 text-orange-700">
                  <Mail className="w-4 h-4" />
                  <span>dhaneri16@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-2">Complaint Process</h4>
            <ul className="space-y-1 text-yellow-800 text-sm">
              <li>• Every complaint receives a unique ticket number</li>
              <li>• Grievance officer acknowledges receipt within 48 hours</li>
              <li>• Contact directly if unsatisfied with customer service response</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 text-sm">
              <strong>Legal Compliance:</strong> In accordance with section 4(4) of the Consumer Protection
              (E-commerce) Rules 2020, we maintain an adequate grievance redressal mechanism.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "definition",
      title: "What is Personal Data?",
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Definition</h4>
            <p className="text-blue-800 text-sm mb-3">
              Personal data can be defined as any piece of information that can be used to identify a person.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold text-blue-900 mb-2">Includes:</h5>
                <ul className="space-y-1 text-blue-700 text-sm">
                  <li>• Name</li>
                  <li>• Phone number</li>
                  <li>• Address</li>
                  <li>• Age</li>
                  <li>• Email ID</li>
                  <li>• Any information that classifies your presence</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-blue-900 mb-2">Sensitive Data:</h5>
                <ul className="space-y-1 text-blue-700 text-sm">
                  <li>• Personal identification documents</li>
                  <li>• Race, religion, ethnic origin data</li>
                  <li>• Biometric data</li>
                  <li>• Beneficial ownership information</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "collection",
      title: "How We Collect Personal Data",
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold mb-3">We obtain personal data in various ways:</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="bg-green-50 p-3 rounded-lg">
                <h5 className="font-semibold text-green-900 mb-2">Direct Collection</h5>
                <ul className="space-y-1 text-green-700 text-sm">
                  <li>• Business card exchanges</li>
                  <li>• Online form completions</li>
                  <li>• Newsletter subscriptions</li>
                  <li>• Pop-up registrations</li>
                  <li>• Event attendance</li>
                  <li>• Store visits</li>
                </ul>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-purple-50 p-3 rounded-lg">
                <h5 className="font-semibold text-purple-900 mb-2">Automatic Collection</h5>
                <ul className="space-y-1 text-purple-700 text-sm">
                  <li>• CCTV footage (automatically overwritten within 30 days)</li>
                  <li>• Location-based data from devices</li>
                  <li>• Professional engagement information</li>
                  <li>• Geographic location data</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h5 className="font-semibold text-blue-900 mb-2">Location Data</h5>
            <p className="text-blue-800 text-sm">
              We may process geographical locations of your computer or mobile device to provide you with
              location-relevant services and improve our location-based products and services.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "usage",
      title: "Why We Need Personal Data",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">We aspire to be transparent when we collect and use personal data. We typically need it for:</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="bg-green-50 p-3 rounded-lg">
                <h5 className="font-semibold text-green-900 mb-2">Service Delivery</h5>
                <ul className="space-y-1 text-green-700 text-sm">
                  <li>• Providing professional advice</li>
                  <li>• Quality assurance reviews</li>
                  <li>• Processing online requests</li>
                  <li>• Responding to communications</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <h5 className="font-semibold text-blue-900 mb-2">Marketing & Events</h5>
                <ul className="space-y-1 text-blue-700 text-sm">
                  <li>• Promoting services and products</li>
                  <li>• Sending event invitations</li>
                  <li>• Personalizing communications</li>
                  <li>• Customizing online experiences</li>
                </ul>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-orange-50 p-3 rounded-lg">
                <h5 className="font-semibold text-orange-900 mb-2">Security & Compliance</h5>
                <ul className="space-y-1 text-orange-700 text-sm">
                  <li>• System security maintenance</li>
                  <li>• User authentication</li>
                  <li>• Anti-money laundering compliance</li>
                  <li>• Fraud prevention</li>
                </ul>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <h5 className="font-semibold text-red-900 mb-2">Safety & Legal</h5>
                <ul className="space-y-1 text-red-700 text-sm">
                  <li>• Health and safety data compilation</li>
                  <li>• Legal and regulatory obligations</li>
                  <li>• Terrorist financing prevention</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "sharing",
      title: "Data Sharing with Third Parties",
      content: (
        <div className="space-y-4">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-2">Our Approach</h4>
            <p className="text-yellow-800 text-sm">
              We may occasionally share personal data with trusted third parties to help us deliver efficient
              and quality services. These recipients are contractually bound to safeguard the data we entrust to them.
            </p>
          </div>
          <h4 className="font-semibold mb-3">Categories of Recipients:</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <h5 className="font-semibold text-blue-900 mb-2">Service Providers</h5>
                <ul className="space-y-1 text-blue-700 text-sm">
                  <li>• Telecommunication systems providers</li>
                  <li>• Mailroom support</li>
                  <li>• IT system support</li>
                  <li>• Archiving services</li>
                  <li>• Document production services</li>
                  <li>• Cloud-based software services</li>
                </ul>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-purple-50 p-3 rounded-lg">
                <h5 className="font-semibold text-purple-900 mb-2">Professional & Legal</h5>
                <ul className="space-y-1 text-purple-700 text-sm">
                  <li>• Professional advisers</li>
                  <li>• Lawyers, auditors, insurers</li>
                  <li>• Anti-money laundering support</li>
                  <li>• Client conflicts checks</li>
                  <li>• Law enforcement agencies</li>
                  <li>• Regulatory agencies (as required by law)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "transfer",
      title: "International Data Transfers",
      content: (
        <div className="space-y-4">
          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-semibold text-orange-900 mb-2">Cross-Border Transfers</h4>
            <p className="text-orange-800 text-sm mb-3">
              We may transfer personal data to international collaborators and third-party organisations
              situated inside or outside India when we have a business reason to engage these organisations.
            </p>
            <div className="bg-orange-100 p-3 rounded">
              <p className="text-orange-800 text-sm">
                <strong>Protection Guarantee:</strong> Each organisation is required to safeguard personal data
                in accordance with our contractual obligations and applicable data protection legislation.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "rights",
      title: "Your Data Protection Rights",
      content: (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-green-600" />
                  <h5 className="font-semibold text-green-900">Access</h5>
                </div>
                <p className="text-green-700 text-sm">
                  Ask us to verify whether we're processing your personal data and request specific information.
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <h5 className="font-semibold text-blue-900">Correction</h5>
                </div>
                <p className="text-blue-700 text-sm">
                  Ask us to correct our records if they contain incorrect or incomplete information.
                </p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <h5 className="font-semibold text-red-900">Erasure</h5>
                </div>
                <p className="text-red-700 text-sm">
                  Ask us to delete your personal data after withdrawing consent or when no longer needed.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-purple-600" />
                  <h5 className="font-semibold text-purple-900">Object to Marketing</h5>
                </div>
                <p className="text-purple-700 text-sm">
                  Object to use of your data for direct marketing purposes, including profiling.
                </p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-orange-600" />
                  <h5 className="font-semibold text-orange-900">Withdraw Consent</h5>
                </div>
                <p className="text-orange-700 text-sm">
                  Withdraw previously given consent for specific processing purposes.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">How to Exercise Your Rights</h4>
            <div className="space-y-2 text-blue-800 text-sm">
              <p>Email us at: <strong>info@dhaneri.com</strong></p>
              <p>We may need to verify your identity and no fee is required unless your request is clearly unfounded or excessive.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "security",
      title: "Personal Data Security",
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">Our Security Measures</h4>
            <ul className="space-y-1 text-green-700 text-sm">
              <li>• Appropriate technical and organisational security policies</li>
              <li>• Protection from loss, misuse, alteration, or destruction</li>
              <li>• Limited access only to those who need it</li>
              <li>• Confidentiality requirements for all data handlers</li>
            </ul>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-2">Your Responsibilities</h4>
            <ul className="space-y-1 text-yellow-800 text-sm">
              <li>• Keep your user ID and password confidential</li>
              <li>• Use secure browsers when transmitting data</li>
              <li>• Be aware that internet transmission isn't completely secure</li>
            </ul>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-red-800 text-sm">
              <strong>Important:</strong> While we do our best to protect your data security, we cannot ensure
              or guarantee the security of data transmitted to our site via unsecure browsers. Any transmission
              is at your own risk.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "retention",
      title: "Data Retention",
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Retention Period</h4>
            <p className="text-blue-800 text-sm mb-3">
              Personal Data will be held for as long as it is necessary to fulfil the purpose for which it was
              collected, or as required or permitted by applicable laws.
            </p>
            <div className="bg-blue-100 p-3 rounded">
              <p className="text-blue-800 text-sm">
                We shall cease to retain Personal Data when the purpose for collection is no longer being served
                and retention is no longer necessary for legal or business purposes.
              </p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Specific Timeframes</h4>
            <ul className="space-y-1 text-gray-700 text-sm">
              <li>• CCTV footage: Automatically overwritten within 30 days</li>
              <li>• Other data: Retained as per firm policy unless different timeframe applies</li>
              <li>• Legal requirements: As mandated by applicable laws and regulations</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: "cookies",
      title: "Cookie Policy",
      content: (
        <div className="space-y-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-900 mb-2">Cookie Settings</h4>
            <p className="text-purple-800 text-sm mb-3">
              You can change your cookie settings to accept or not accept cookies in your browser.
            </p>
            <div className="bg-purple-100 p-3 rounded">
              <p className="text-purple-800 text-sm">
                <strong>Good News:</strong> You can still browse our website even if you don't accept cookies.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "consent",
      title: "Consent Management",
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">Your Consent</h4>
            <p className="text-green-800 text-sm mb-3">
              We may rely on your freely given consent at the time you provided your personal data to us.
            </p>
            <div className="bg-green-100 p-3 rounded">
              <p className="text-green-800 text-sm">
                <strong>Important:</strong> You may withdraw and/or modify your consent at any time by
                contacting us at <strong>info@dhaneri.com</strong>.
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
              <p className="text-gray-600 mt-2">Dhaneri Fashion - Your Privacy Matters</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Quick Access */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {quickAccess.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                setExpandedSections((prev: any) => ({ ...prev, [item.section]: true }));
                document.getElementById(item.section)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200 text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="text-blue-600 group-hover:text-blue-700">
                  {item.icon}
                </div>
                <span className="font-medium text-gray-900 group-hover:text-blue-700">
                  {item.title}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.id} id={section.id} className="bg-white rounded-lg shadow-sm border">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <h2 className="text-lg font-semibold text-gray-900 text-left">
                  {section.title}
                </h2>
                {expandedSections[section.id] ? (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                )}
              </button>

              {expandedSections[section.id] && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="pt-4">
                    {section.content}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Questions About Your Privacy?</h3>
            <p className="text-gray-600 mb-4">
              Contact our team or grievance officer for any privacy-related concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:info@dhaneri.com"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Mail className="w-4 h-4" />
                Email Privacy Team
              </a>
              <a
                href="mailto:dhaneri16@gmail.com"
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200"
              >
                <Phone className="w-4 h-4" />
                Contact Grievance Officer
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;