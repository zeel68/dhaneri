"use client"
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Mail, MapPin, Clock, Shield, CreditCard, Truck, RotateCcw } from 'lucide-react';

const TermsAndConditions = () => {
    const [expandedSections, setExpandedSections] = useState<any>({});
    const [lastUpdated] = useState('January 2025');

    const toggleSection = (sectionId: any) => {
        setExpandedSections((prev: any) => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const quickLinks = [
        { icon: <Shield className="w-5 h-5" />, title: "Your Rights", section: "rights" },
        { icon: <RotateCcw className="w-5 h-5" />, title: "Returns & Refunds", section: "returns" },
        { icon: <Truck className="w-5 h-5" />, title: "Delivery", section: "delivery" },
        { icon: <CreditCard className="w-5 h-5" />, title: "Payment", section: "payment" }
    ];

    const sections = [
        {
            id: "contact",
            title: "1. Who We Are & Contact",
            content: (
                <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">Company Information</h4>
                        <p className="text-blue-800 mb-2"><strong>Dhaneri Fashion</strong></p>
                        <div className="flex items-start gap-2 text-blue-700">
                            <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                            <span className="text-sm">Plot no 26, 27 1st floor Girivar small Industry Estate Opp Vihat Mata Mandir Nr Shubham Industry Saniya Hemad, Surat, Gujarat 395010</span>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">How to Contact Us</h4>
                        <ul className="space-y-2 text-gray-700">
                            <li className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                <span>Dhaneri.com/contact</span>
                            </li>
                            <li>• Support section on our e-commerce app</li>
                            <li>• Mail service</li>
                        </ul>
                    </div>
                </div>
            )
        },
        {
            id: "ordering",
            title: "2. Placing an Order",
            content: (
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold mb-2">Order Process</h4>
                        <ol className="list-decimal list-inside space-y-2 text-gray-700">
                            <li>Add products to your basket on our website or app</li>
                            <li>Go through checkout and enter your details</li>
                            <li>Check your order details carefully before completing</li>
                            <li>Click "complete order" or "pay now"</li>
                        </ol>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-yellow-900 mb-2">Important Notes</h4>
                        <ul className="space-y-1 text-yellow-800 text-sm">
                            <li>• Must be at least 18 years old to order</li>
                            <li>• Under 18 requires parent/guardian involvement</li>
                            <li>• Contract forms when we dispatch your order</li>
                        </ul>
                    </div>
                </div>
            )
        },
        {
            id: "cancellation",
            title: "3. Our Rights to Cancel Your Order",
            content: (
                <div className="space-y-4">
                    <h4 className="font-semibold mb-2">We may cancel your order if:</h4>
                    <ul className="space-y-2 text-gray-700">
                        <li>• Product is out of stock</li>
                        <li>• Unable to verify billing information</li>
                        <li>• Delivery requested to unsupported country/state</li>
                        <li>• Pricing or description error</li>
                        <li>• Unusual or suspicious activity detected</li>
                        <li>• Commercial or resale purpose suspected</li>
                    </ul>
                    <div className="bg-red-50 p-4 rounded-lg">
                        <p className="text-red-800 text-sm"><strong>Note:</strong> Our products are for personal use only. We may suspend supply for technical updates or legal compliance.</p>
                    </div>
                </div>
            )
        },
        {
            id: "products",
            title: "4. Our Products",
            content: (
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold mb-2">What We Provide</h4>
                        <p className="text-gray-700 mb-4">We provide fitness gear, including clothing and accessories.</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 text-sm"><strong>Product Images:</strong> Pictures on our website and app are for illustrative purposes. While we work to display colors accurately, we cannot guarantee exact color reproduction on your device.</p>
                    </div>
                </div>
            )
        },
        {
            id: "delivery",
            title: "5. Delivery",
            content: (
                <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-green-900 mb-2">Delivery Info</h4>
                            <ul className="space-y-1 text-green-800 text-sm">
                                <li>• Ships to United States</li>
                                <li>• Risk transfers upon delivery to carrier</li>
                                <li>• Title transfers upon payment</li>
                            </ul>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-2">Delivery Times</h4>
                            <p className="text-blue-800 text-sm">Depends on selected delivery method. Promotional periods may cause delays.</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">If You're Not Available</h4>
                        <p className="text-gray-700 text-sm">Courier will notify you and provide rearrangement instructions if delivery cannot be completed.</p>
                    </div>
                </div>
            )
        },
        {
            id: "rights",
            title: "6. Your Rights",
            content: (
                <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-900 mb-2">Faulty Products</h4>
                        <p className="text-green-800 text-sm">Free return within 7 days if product is faulty or substantially different from description.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Change of Mind - 7 Day Guarantee</h4>
                        <p className="text-gray-700 mb-3">You have 7 days from receipt to change your mind (you pay return costs).</p>
                        <div className="bg-red-50 p-4 rounded-lg">
                            <h5 className="font-semibold text-red-900 mb-2">Non-Returnable Items:</h5>
                            <ul className="space-y-1 text-red-800 text-sm">
                                <li>• Swimwear, underwear, bottles, shakers</li>
                                <li>• Unsealed hygiene items (e.g., socks)</li>
                                <li>• Custom-made or personalized items</li>
                                <li>• Items with care labels removed</li>
                                <li>• Items missing components</li>
                                <li>• Final sale items</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "returns",
            title: "7. Returns and Refunds",
            content: (
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold mb-2">Return Process</h4>
                        <ol className="list-decimal list-inside space-y-2 text-gray-700">
                            <li>Contact customer service at Dhaneri.com/contact</li>
                            <li>Visit Returns Portal at Dhaneri.com/returns</li>
                            <li>Enter required information and print returns label</li>
                            <li>Return within 30 days to designated collection point</li>
                        </ol>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">Refund Policy</h4>
                        <ul className="space-y-1 text-blue-800 text-sm">
                            <li>• Refunded via original payment method</li>
                            <li>• Gift card refunds applied first for mixed payments</li>
                            <li>• Discount codes reduce refund amount proportionally</li>
                            <li>• Refunds processed within 14 days of product receipt</li>
                        </ul>
                    </div>
                </div>
            )
        },
        {
            id: "payment",
            title: "9. Price and Payment",
            content: (
                <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-purple-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-purple-900 mb-2">Payment Methods</h4>
                            <ul className="space-y-1 text-purple-800 text-sm">
                                <li>• Visa, Mastercard, American Express</li>
                                <li>• PayPal, Apple Pay</li>
                                <li>• Afterpay US (4 interest-free installments)</li>
                            </ul>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-orange-900 mb-2">Pricing</h4>
                            <ul className="space-y-1 text-orange-800 text-sm">
                                <li>• Prices exclude sales tax until checkout</li>
                                <li>• Charged upon dispatch</li>
                                <li>• Price changes don't affect existing orders</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "discounts",
            title: "10. Discount Codes",
            content: (
                <div className="space-y-4">
                    <div className="bg-yellow-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-yellow-900 mb-2">Discount Code Rules</h4>
                        <ul className="space-y-1 text-yellow-800 text-sm">
                            <li>• Valid for limited time periods only</li>
                            <li>• Generally for full-priced items only</li>
                            <li>• One code per order</li>
                            <li>• Cannot be combined with other offers</li>
                            <li>• Territory/store specific</li>
                            <li>• Not applicable to delivery charges</li>
                        </ul>
                    </div>
                </div>
            )
        },
        {
            id: "liability",
            title: "11. Our Responsibility",
            content: (
                <div className="space-y-4">
                    <div className="bg-red-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-red-900 mb-2">Liability Limits</h4>
                        <ul className="space-y-1 text-red-800 text-sm">
                            <li>• Responsible for foreseeable loss and damage only</li>
                            <li>• Not liable for unforeseeable damage</li>
                            <li>• Liability capped at US$100.00</li>
                            <li>• Products for private use only</li>
                        </ul>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-green-800 text-sm"><strong>Full Liability:</strong> We maintain full liability for death, personal injury, fraud, or defective products as required by law.</p>
                    </div>
                </div>
            )
        },
        {
            id: "arbitration",
            title: "14. Dispute Resolution",
            content: (
                <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">US Customers</h4>
                        <p className="text-blue-800 text-sm mb-2">Disputes resolved through American Arbitration Association (AAA) binding arbitration.</p>
                        <ul className="space-y-1 text-blue-700 text-sm">
                            <li>• 30-day notice period before arbitration</li>
                            <li>• Individual basis only (no class action)</li>
                            <li>• Telephonic for amounts ≤$10,000</li>
                        </ul>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-orange-900 mb-2">Indian Customers</h4>
                        <p className="text-orange-800 text-sm mb-2">Good faith negotiation first, then optional arbitration in Surat, Gujarat.</p>
                        <ul className="space-y-1 text-orange-700 text-sm">
                            <li>• Consumer Protection Act rights preserved</li>
                            <li>• Virtual hearings for amounts ≤₹7,50,000</li>
                            <li>• Mutual consent required for arbitration</li>
                        </ul>
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
                            <h1 className="text-3xl font-bold text-gray-900">Terms & Conditions</h1>
                            <p className="text-gray-600 mt-2">Dhaneri Fashion - Fitness Gear & Accessories</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>Last updated: {lastUpdated}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Introduction */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="prose max-w-none">
                        <p className="text-gray-700 leading-relaxed">
                            Please read these terms carefully before ordering with us. These terms tell you what you need
                            to know about buying with us. We may revise these terms and conditions without notice by
                            posting revised terms and conditions of sale on our website. The terms and conditions posted
                            on the website or app at the time you place your order will govern that purchase.
                        </p>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                    {quickLinks.map((link, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setExpandedSections((prev: any) => ({ ...prev, [link.section]: true }));
                                document.getElementById(link.section)?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200 text-left group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="text-blue-600 group-hover:text-blue-700">
                                    {link.icon}
                                </div>
                                <span className="font-medium text-gray-900 group-hover:text-blue-700">
                                    {link.title}
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
                        <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
                        <p className="text-gray-600 mb-4">
                            If you have any questions about these terms, please contact our customer service team.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="mailto:support@dhaneri.com"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                            >
                                <Mail className="w-4 h-4" />
                                Contact Support
                            </a>
                            <button
                                onClick={() => window.history.back()}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                            >
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;