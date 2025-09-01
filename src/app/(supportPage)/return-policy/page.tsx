"use client"
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, RotateCcw, Truck, CreditCard, Clock, AlertCircle, CheckCircle, XCircle, Package, Phone, Mail, Calendar, IndianRupee } from 'lucide-react';

const ReturnPolicy = () => {
    const [expandedSections, setExpandedSections] = useState<any>({});
    const [activeTab, setActiveTab] = useState('returns');

    const toggleSection = (sectionId: any) => {
        setExpandedSections((prev: any) => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const quickActions = [
        { icon: <RotateCcw className="w-5 h-5" />, title: "Start Return", action: "return", color: "bg-blue-50 text-blue-700" },
        { icon: <Package className="w-5 h-5" />, title: "Track Return", action: "track", color: "bg-green-50 text-green-700" },
        { icon: <CreditCard className="w-5 h-5" />, title: "Refund Status", action: "refund", color: "bg-purple-50 text-purple-700" },
        { icon: <Phone className="w-5 h-5" />, title: "Need Help?", action: "help", color: "bg-orange-50 text-orange-700" }
    ];

    const nonReturnableItems = [
        { item: "Accessories", reason: "Policy exclusion" },
        { item: "Bags", reason: "Policy exclusion" },
        { item: "Blouses", reason: "Policy exclusion" },
        { item: "Footwear", reason: "Policy exclusion" },
        { item: "Sarees with stitched blouses", reason: "Custom fitting" },
        { item: "Customized products", reason: "Personalization" },
        { item: "Personalized products", reason: "Custom made" }
    ];

    const tabs = [
        { id: 'returns', label: 'Returns', icon: <RotateCcw className="w-4 h-4" /> },
        { id: 'process', label: 'Return Process', icon: <Package className="w-4 h-4" /> },
        { id: 'charges', label: 'Charges', icon: <IndianRupee className="w-4 h-4" /> },
        { id: 'refunds', label: 'Refunds', icon: <CreditCard className="w-4 h-4" /> }
    ];

    const sections = [
        {
            id: "eligibility",
            title: "Return Eligibility",
            content: (
                <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-green-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-3">
                                <Clock className="w-5 h-5 text-green-600" />
                                <h4 className="font-semibold text-green-900">Return Period</h4>
                            </div>
                            <p className="text-green-800 text-sm mb-2">
                                <strong>5 Days</strong> from delivery date
                            </p>
                            <p className="text-green-700 text-xs">
                                Items must be in original condition with all labels & tags intact
                            </p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-3">
                                <CheckCircle className="w-5 h-5 text-blue-600" />
                                <h4 className="font-semibold text-blue-900">Return Conditions</h4>
                            </div>
                            <p className="text-blue-800 text-sm">
                                Returns accepted only for items that are:
                            </p>
                            <ul className="text-blue-700 text-xs mt-2 space-y-1">
                                <li>• Damaged</li>
                                <li>• Defective</li>
                                <li>• Significantly different from online description</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                            <XCircle className="w-5 h-5 text-red-600" />
                            <h4 className="font-semibold text-red-900">Non-Returnable Items</h4>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            {nonReturnableItems.map((item, index) => (
                                <div key={index} className="flex justify-between items-center py-1 border-b border-red-200 last:border-b-0">
                                    <span className="text-red-800 text-sm font-medium">{item.item}</span>
                                    <span className="text-red-600 text-xs">{item.reason}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="w-5 h-5 text-yellow-600" />
                            <h4 className="font-semibold text-yellow-900">Important Notes</h4>
                        </div>
                        <ul className="space-y-1 text-yellow-800 text-sm">
                            <li>• All returns are subject to approval</li>
                            <li>• Petticoat charges are non-refundable</li>
                            <li>• Check product page for specific return terms</li>
                        </ul>
                    </div>
                </div>
            )
        },
        {
            id: "process",
            title: "How to Return a Product",
            content: (
                <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-3">For Logged In Customers</h4>
                            <ol className="list-decimal list-inside space-y-2 text-blue-800 text-sm">
                                <li>Go to the order page on dhaneri.com</li>
                                <li>Find your order</li>
                                <li>Follow the return process</li>
                                <li>Submit return request online</li>
                            </ol>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-purple-900 mb-3">For Guest Customers</h4>
                            <ol className="list-decimal list-inside space-y-2 text-purple-800 text-sm">
                                <li>Click on the Return Portal link</li>
                                <li>Enter your Order number</li>
                                <li>Enter your Email or Phone number</li>
                                <li>Follow the return process</li>
                            </ol>
                        </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-900 mb-2">Online Return Request</h4>
                        <p className="text-green-800 text-sm">
                            You can put the return request online without needing to call or email.
                            Simply use our Return Portal for a seamless experience.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: "charges",
            title: "Shipping and Return Charges",
            content: (
                <div className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-green-50 p-4 rounded-lg text-center">
                            <Truck className="w-8 h-8 text-green-600 mx-auto mb-2" />
                            <h4 className="font-semibold text-green-900 mb-1">Shipping</h4>
                            <p className="text-green-800 text-sm font-medium">FREE</p>
                            <p className="text-green-700 text-xs">Within India</p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg text-center">
                            <RotateCcw className="w-8 h-8 text-red-600 mx-auto mb-2" />
                            <h4 className="font-semibold text-red-900 mb-1">Returns</h4>
                            <p className="text-red-800 text-sm font-medium">₹199</p>
                            <p className="text-red-700 text-xs">Return & restocking charges</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                            <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                            <h4 className="font-semibold text-blue-900 mb-1">Exchanges</h4>
                            <p className="text-blue-800 text-sm font-medium">FREE</p>
                            <p className="text-blue-700 text-xs">No fees within India</p>
                        </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-yellow-900 mb-2">Charge Details</h4>
                        <ul className="space-y-1 text-yellow-800 text-sm">
                            <li>• Return charges: Flat fee of INR 199 applied to order value</li>
                            <li>• Applicable for orders within India only</li>
                            <li>• Exchange charges: No fees applicable within India</li>
                        </ul>
                    </div>
                </div>
            )
        },
        {
            id: "refund",
            title: "Refund Process",
            content: (
                <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-3">Step-by-Step Refund Process</h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-semibold text-xs">1</div>
                                <span className="text-blue-800 text-sm">Raise return request online</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-semibold text-xs">2</div>
                                <span className="text-blue-800 text-sm">We arrange pickup for the product</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-semibold text-xs">3</div>
                                <span className="text-blue-800 text-sm">Pickup agent conducts quality check</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-semibold text-xs">4</div>
                                <span className="text-blue-800 text-sm">Upon successful pickup, refund is initiated</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center text-green-800 font-semibold text-xs">5</div>
                                <span className="text-green-800 text-sm">Receive refund within 7-10 days</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-5 h-5 text-green-600" />
                            <h4 className="font-semibold text-green-900">Refund Timeline</h4>
                        </div>
                        <p className="text-green-800 text-sm">
                            You will receive your refund within <strong>7 to 10 days</strong> after successful pickup and quality verification.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: "cancellation",
            title: "Order Cancellation",
            content: (
                <div className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                            <Calendar className="w-5 h-5 text-orange-600" />
                            <h4 className="font-semibold text-orange-900">Cancellation Window</h4>
                        </div>
                        <p className="text-orange-800 text-sm mb-2">
                            Order cancellations are accepted within <strong>24 hours</strong> of placing the order.
                        </p>
                        <div className="bg-orange-100 p-3 rounded">
                            <p className="text-orange-800 text-xs">
                                <strong>Note:</strong> After 24 hours, you'll need to follow the return process once the item is delivered.
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
                            <h1 className="text-3xl font-bold text-gray-900">Return Policy</h1>
                            <p className="text-gray-600 mt-2">Dhaneri Fashion - Easy Returns & Exchanges</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Package className="w-4 h-4" />
                            <span>5-Day Return Window</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Quick Actions */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                    {quickActions.map((action, index) => (
                        <button
                            key={index}
                            className={`${action.color} p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200 text-left group`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="group-hover:scale-110 transition-transform duration-200">
                                    {action.icon}
                                </div>
                                <span className="font-medium">
                                    {action.title}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Key Information Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <Clock className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Return Window</h3>
                                <p className="text-gray-600 text-sm">5 days from delivery</p>
                            </div>
                        </div>
                        <p className="text-gray-700 text-sm">
                            Items must be in original condition with all labels and tags intact.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <IndianRupee className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Return Charges</h3>
                                <p className="text-gray-600 text-sm">₹199 flat fee</p>
                            </div>
                        </div>
                        <p className="text-gray-700 text-sm">
                            Return and restocking charges apply. Exchanges are free within India.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Refund Timeline</h3>
                                <p className="text-gray-600 text-sm">7-10 business days</p>
                            </div>
                        </div>
                        <p className="text-gray-700 text-sm">
                            After successful pickup and quality verification.
                        </p>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-lg shadow-sm border mb-6">
                    <div className="border-b border-gray-200">
                        <div className="flex overflow-x-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors duration-200 whitespace-nowrap ${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {tab.icon}
                                    <span className="font-medium">{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-6">
                        {activeTab === 'returns' && (
                            <div className="space-y-4">
                                <h3 className="font-semibold text-gray-900 mb-4">Return Eligibility & Conditions</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-green-900 mb-2">Eligible Returns</h4>
                                        <ul className="space-y-1 text-green-700 text-sm">
                                            <li>• Damaged items</li>
                                            <li>• Defective products</li>
                                            <li>• Items significantly different from description</li>
                                            <li>• Must be within 5 days of delivery</li>
                                        </ul>
                                    </div>
                                    <div className="bg-red-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-red-900 mb-2">Non-Returnable</h4>
                                        <ul className="space-y-1 text-red-700 text-sm">
                                            <li>• Accessories & bags</li>
                                            <li>• Blouses & footwear</li>
                                            <li>• Sarees with stitched blouses</li>
                                            <li>• Customized/personalized items</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'process' && (
                            <div className="space-y-4">
                                <h3 className="font-semibold text-gray-900 mb-4">Return Process Steps</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                                        <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-semibold text-sm">1</div>
                                        <div>
                                            <h4 className="font-semibold text-blue-900">Initiate Return</h4>
                                            <p className="text-blue-800 text-sm">Log into your account or use guest return portal with order details</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
                                        <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center text-purple-800 font-semibold text-sm">2</div>
                                        <div>
                                            <h4 className="font-semibold text-purple-900">Schedule Pickup</h4>
                                            <p className="text-purple-800 text-sm">We'll arrange pickup for your product at your convenience</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg">
                                        <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center text-orange-800 font-semibold text-sm">3</div>
                                        <div>
                                            <h4 className="font-semibold text-orange-900">Quality Check</h4>
                                            <p className="text-orange-800 text-sm">Our pickup agent will conduct a quality check of the product</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                                        <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center text-green-800 font-semibold text-sm">4</div>
                                        <div>
                                            <h4 className="font-semibold text-green-900">Refund Processing</h4>
                                            <p className="text-green-800 text-sm">Upon successful pickup, we initiate your refund within 7-10 days</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'charges' && (
                            <div className="space-y-4">
                                <h3 className="font-semibold text-gray-900 mb-4">Detailed Charge Information</h3>
                                <div className="space-y-4">
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Truck className="w-5 h-5 text-green-600" />
                                            <h4 className="font-semibold text-green-900">Free Shipping</h4>
                                        </div>
                                        <p className="text-green-800 text-sm">All orders within India enjoy free shipping with no minimum order value.</p>
                                    </div>
                                    <div className="bg-red-50 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <RotateCcw className="w-5 h-5 text-red-600" />
                                            <h4 className="font-semibold text-red-900">Return Charges</h4>
                                        </div>
                                        <p className="text-red-800 text-sm mb-2">
                                            A flat fee of <strong>INR 199</strong> will be applied as return and restocking charges for orders within India.
                                        </p>
                                        <p className="text-red-700 text-xs">This fee covers processing, quality checks, and restocking costs.</p>
                                    </div>
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Package className="w-5 h-5 text-blue-600" />
                                            <h4 className="font-semibold text-blue-900">Exchange Charges</h4>
                                        </div>
                                        <p className="text-blue-800 text-sm">No fees are applicable for exchanges within India - completely free!</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'refunds' && (
                            <div className="space-y-4">
                                <h3 className="font-semibold text-gray-900 mb-4">Refund Details</h3>
                                <div className="space-y-4">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-blue-900 mb-2">Refund Process Timeline</h4>
                                        <div className="space-y-2 text-blue-800 text-sm">
                                            <p>• <strong>Immediate:</strong> Return request acknowledgment</p>
                                            <p>• <strong>1-2 days:</strong> Pickup arrangement</p>
                                            <p>• <strong>Same day:</strong> Quality check during pickup</p>
                                            <p>• <strong>7-10 days:</strong> Refund processed to original payment method</p>
                                        </div>
                                    </div>
                                    <div className="bg-yellow-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-yellow-900 mb-2">Important Notes</h4>
                                        <ul className="space-y-1 text-yellow-800 text-sm">
                                            <li>• Petticoat charges are non-refundable</li>
                                            <li>• Return charges (₹199) will be deducted from refund</li>
                                            <li>• All returns subject to quality check approval</li>
                                            <li>• Refund amount = Product price - Return charges</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Detailed Sections */}
                <div className="space-y-4 mt-8">
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

                {/* Return Portal CTA */}
                <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
                    <div className="text-center">
                        <h3 className="font-bold text-gray-900 text-xl mb-2">Ready to Return an Item?</h3>
                        <p className="text-gray-600 mb-6">
                            Start your return process now - it only takes a few minutes!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
                                <RotateCcw className="w-5 h-5" />
                                Start Return Process
                            </button>
                            <button className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium">
                                <Phone className="w-5 h-5" />
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
                    <div className="text-center">
                        <h3 className="font-semibold text-gray-900 mb-2">Need Help with Returns?</h3>
                        <p className="text-gray-600 mb-4">
                            Our customer service team is here to assist you with any return-related questions.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="https://dhaneri.com/contact"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                            >
                                <Mail className="w-4 h-4" />
                                Contact Support
                            </a>
                            <a
                                href="https://dhaneri.com/returns"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                            >
                                <Package className="w-4 h-4" />
                                Return Portal
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReturnPolicy;