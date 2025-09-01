'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Heart, User, ChevronDown, ChevronRight, Menu, X, Mail, ShoppingBag, MessageCircle, Lock } from 'lucide-react';
import { useCategoryStore } from '@/store/categoryStore';
import { motion } from 'framer-motion';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useUserStore } from '@/store/userStore';
import { useCartStore } from '@/store/cartStore';
import { Router } from 'next/router';
import { useRouter } from 'next/navigation';
import LiveChatComponent from './liveChat';
import LoginModal from '../auth/login';
// Interfaces for type safety
interface Product {
    _id: string;
    slug: string;
    name: string;
    price: number;
    images?: string[];
    variants?: Array<{
        images: string[];
        primaryIndex: number;
    }>;
    createdAt?: string;
}

interface Subcategory {
    _id: string;
    slug: string;
    display_name: string;
    product_count: number;
    products?: Product[];
}

interface Category {
    _id: string;
    slug: string;
    display_name: string;
    subcategories?: Subcategory[];
    products?: Product[];
}

// Mock wishlist hook with proper typing
const useWishlistStore = () => ({
    items: [1, 2],
    totalItems: 2
});

// Enhanced Login Modal Component using shadcn/ui for consistency


// Enhanced Mega Menu Component
const MegaMenu = ({ category, isVisible, onMouseEnter, onMouseLeave }: {
    category: Category | null;
    isVisible: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}) => {
    const [selectedSub, setSelectedSub] = useState<Subcategory | null>(null);

    if (!isVisible || !category) return null;

    // Get products based on selection
    const getProducts = (cat: Category, sub: Subcategory | null) => {
        let products = sub ? sub.products || [] : cat.products || [];

        // Sort by createdAt descending to prioritize newer products
        // products = products.sort((a: Product, b: Product) => {
        //     const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        //     const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        //     return timeB - timeA;
        // });
        return products;
    };

    const allProducts = getProducts(category, selectedSub);
    const featuredProducts = allProducts.slice(0, 4); // First 4 products as featured
    const newProducts = allProducts.slice(4, 8); // Next 4 as new arrivals

    return (
        <motion.div
            className="absolute top-full left-0 w-full bg-white shadow-xl border-t-2 border-navy-200 z-50"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="max-w-7xl mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Subcategories */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-navy-900 uppercase tracking-wide">
                            {category.display_name}
                        </h3>
                        <div className="space-y-2">
                            {category.subcategories && category.subcategories.length > 0 ? (
                                category.subcategories.map((sub: Subcategory, index: number) => (
                                    <motion.a
                                        key={sub._id}
                                        href={`/category/${sub.slug}`}
                                        className={`block py-2 px-3 text-gray-700 hover:text-navy-700 hover:bg-navy-50 rounded-lg transition-all duration-300 group border border-transparent hover:border-navy-200 ${selectedSub?._id === sub._id ? 'bg-navy-100 text-navy-700' : ''}`}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onMouseEnter={() => setSelectedSub(sub)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium capitalize">{sub.display_name}</span>
                                            <ChevronRight
                                                size={14}
                                                className="opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 text-navy-500"
                                            />
                                        </div>
                                        {sub.product_count > 0 && (
                                            <span className="text-xs text-gray-500 mt-1 block">
                                                {sub.product_count} products
                                            </span>
                                        )}
                                    </motion.a>
                                ))
                            ) : (
                                <div className="text-gray-500 text-center py-8">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-4"></div>
                                    No subcategories available
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Featured Products */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-navy-900 uppercase tracking-wide">
                            Featured Products
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {featuredProducts.length > 0 ? (
                                featuredProducts.map((product: Product, index: number) => {
                                    const primaryImage = product.images?.[0] ||
                                        (product.variants?.[0]?.images?.[product.variants[0].primaryIndex || 0]) ||
                                        null;
                                    return (
                                        <motion.a
                                            key={product._id}
                                            href={`/product/${product.slug}`}
                                            className="group cursor-pointer hover:scale-105 transition-all duration-300"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: (index + 6) * 0.1 }}
                                        >
                                            <div className="w-full h-24 bg-gray-100 rounded-lg mb-2 group-hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-navy-300 flex items-center justify-center overflow-hidden relative">
                                                {primaryImage ? (
                                                    <img
                                                        src={primaryImage}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover rounded-lg"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.style.display = 'none';
                                                            const nextSibling = target.nextSibling as HTMLElement;
                                                            if (nextSibling) nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                ) : null}
                                                <div className={`w-full h-full flex items-center justify-center ${primaryImage ? 'hidden' : 'flex'}`}>
                                                    <div className="w-6 h-6 bg-navy-300 rounded-full"></div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-700 group-hover:text-navy-700 transition-colors duration-300 font-medium truncate">
                                                {product.name}
                                            </p>
                                            <p className="text-xs text-gray-500">₹{product.price}</p>
                                        </motion.a>
                                    );
                                })
                            ) : (
                                [1, 2, 3, 4].map((item, index) => (
                                    <motion.div
                                        key={item}
                                        className="group cursor-pointer hover:scale-105 transition-all duration-300"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: (index + 6) * 0.1 }}
                                    >
                                        <div className="w-full h-24 bg-gray-100 rounded-lg mb-2 group-hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-navy-300 flex items-center justify-center">
                                            <div className="w-6 h-6 bg-navy-300 rounded-full"></div>
                                        </div>
                                        <p className="text-sm text-gray-700 group-hover:text-navy-700 transition-colors duration-300 font-medium">
                                            No products available
                                        </p>
                                        <p className="text-xs text-gray-500">-</p>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* New Arrivals */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-navy-900 uppercase tracking-wide">
                            New Arrivals
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {newProducts.length > 0 ? (
                                newProducts.map((product: Product, index: number) => {
                                    const primaryImage = product.images?.[0] ||
                                        (product.variants?.[0]?.images?.[product.variants[0].primaryIndex || 0]) ||
                                        null;
                                    return (
                                        <motion.a
                                            key={product._id}
                                            href={`/product/${product.slug}`}
                                            className="group cursor-pointer hover:scale-105 transition-all duration-300"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: (index + 10) * 0.1 }}
                                        >
                                            <div className="w-full h-24 bg-gray-100 rounded-lg mb-2 group-hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-navy-300 flex items-center justify-center relative overflow-hidden">
                                                <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                                                    NEW
                                                </div>
                                                {primaryImage ? (
                                                    <img
                                                        src={primaryImage}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover rounded-lg"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.style.display = 'none';
                                                            const nextSibling = target.nextSibling as HTMLElement;
                                                            if (nextSibling) nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                ) : null}
                                                <div className={`w-full h-full flex items-center justify-center ${primaryImage ? 'hidden' : 'flex'}`}>
                                                    <div className="w-6 h-6 bg-navy-400 rounded-full"></div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-700 group-hover:text-navy-700 transition-colors duration-300 font-medium truncate">
                                                {product.name}
                                            </p>
                                            <p className="text-xs text-gray-500">₹{product.price}</p>
                                        </motion.a>
                                    );
                                })
                            ) : allProducts.length > 0 ? (
                                allProducts.slice(0, 4).map((product: Product, index: number) => {
                                    const primaryImage = product.images?.[0] ||
                                        (product.variants?.[0]?.images?.[product.variants[0].primaryIndex || 0]) ||
                                        null;
                                    return (
                                        <motion.a
                                            key={`remaining-${product._id}`}
                                            href={`/product/${product.slug}`}
                                            className="group cursor-pointer hover:scale-105 transition-all duration-300"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: (index + 10) * 0.1 }}
                                        >
                                            <div className="w-full h-24 bg-gray-100 rounded-lg mb-2 group-hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-navy-300 flex items-center justify-center relative overflow-hidden">
                                                {primaryImage ? (
                                                    <img
                                                        src={primaryImage}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover rounded-lg"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.style.display = 'none';
                                                            const nextSibling = target.nextSibling as HTMLElement;
                                                            if (nextSibling) nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                ) : null}
                                                <div className={`w-full h-full flex items-center justify-center ${primaryImage ? 'hidden' : 'flex'}`}>
                                                    <div className="w-6 h-6 bg-navy-400 rounded-full"></div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-700 group-hover:text-navy-700 transition-colors duration-300 font-medium truncate">
                                                {product.name}
                                            </p>
                                            <p className="text-xs text-gray-500">₹{product.price}</p>
                                        </motion.a>
                                    );
                                })
                            ) : (
                                [1, 2, 3, 4].map((item, index) => (
                                    <motion.div
                                        key={item}
                                        className="group cursor-pointer hover:scale-105 transition-all duration-300"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: (index + 10) * 0.1 }}
                                    >
                                        <div className="w-full h-24 bg-gray-100 rounded-lg mb-2 group-hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-navy-300 flex items-center justify-center">
                                            <div className="w-6 h-6 bg-navy-300 rounded-full"></div>
                                        </div>
                                        <p className="text-sm text-gray-700 group-hover:text-navy-700 transition-colors duration-300 font-medium">
                                            No products available
                                        </p>
                                        <p className="text-xs text-gray-500">-</p>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Main Navbar Component
const Navbar = () => {
    const { categories, loading, fetchCategories } = useCategoryStore();
    const { items: cartItems } = useCartStore();
    const { totalItems: wishItems } = useWishlistStore();
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState<Category | null>(null);
    const [showLogin, setShowLogin] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const [currency, setCurrency] = useState<string>('INR');
    const [isScrolled, setIsScrolled] = useState<boolean>(false);
    const { user, sessionId, startSession, destorySession, hasHydrated } = useUserStore();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    //for initiate the session 
    useEffect(() => {
        if (!hasHydrated) return; // ✅ Wait for rehydration

        const init = async () => {
            if (!sessionId) {
                await startSession();
            } else {
                console.log("Existing session:", sessionId);
            }
        };

        init();
        // destorySession();
    }, [hasHydrated, sessionId, startSession]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            const isLoggedIn = JSON.parse(sessionStorage.getItem('isLoginModalShowed') || 'false');
            if (!isLoggedIn) {
                setShowLogin(true);
                sessionStorage.setItem('isLoginModalShowed', JSON.stringify(true));
            } else {
                console.log("not showing the login");
            }
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const handleCategoryHover = (category: Category) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setActiveCategory(category);
    };

    const handleCategoryLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setActiveCategory(null);
        }, 200);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            console.log('Searching for:', searchQuery);
            router.push(`search?q=${searchQuery}`);
        }
    };

    const currencyOptions = [
        { code: 'INR', symbol: '₹' },
        { code: 'USD', symbol: '$' },
        { code: 'EUR', symbol: '€' },
        { code: 'GBP', symbol: '£' }
    ];

    return (
        <div className={`w-full bg-white shadow-lg sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'shadow-xl' : ''}`}>
            {/* Top Banner */}
            <div className="bg-navy-900 text-white py-2 overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
                    <p className="text-sm font-medium">
                        🎉 SUMMER SALE - UP TO 60% OFF | FREE SHIPPING ON ORDERS OVER ₹999 🚚
                    </p>
                </div>
            </div>

            {/* Main Header */}
            <div className="flex items-center justify-between px-4 md:px-6 py-4">
                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <Menu size={20} className="text-gray-600" />
                </button>
                <div></div>
                {/* Center Logo */}
                <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
                    <a href="/" className="block">
                        <h1 className="text-2xl md:text-4xl font-bold tracking-[0.3em] text-black">
                            DHANERI
                        </h1>
                        <p className="text-xs tracking-[0.2em] text-gray-600 mt-1">
                            FASHION
                        </p>
                    </a>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 md:gap-4">
                    {/* Search Bar - Hidden on mobile */}
                    <form onSubmit={handleSearch} className="hidden md:block relative">
                        <input
                            type="text"
                            placeholder="Search for Sarees, Lehengas..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch(e); // Call your search function
                                }
                            }}
                            className="w-60 lg:w-80 pl-4 pr-12 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-black transition-colors"
                        />
                        <button
                            type="submit"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-gray-100 transition-colors"
                        >
                            <Search size={20} className="text-gray-400" />
                        </button>
                    </form>

                    {/* Mobile Search Button */}
                    <button className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <Search size={20} className="text-gray-600" />
                    </button>

                    {/* Action Icons */}
                    <div className="flex items-center gap-2 md:gap-3">
                        {/* WhatsApp/Chat */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors hidden sm:block"
                        >
                            <MessageCircle size={20} className="text-gray-600" />
                        </motion.button>

                        {/* User/Login */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setShowLogin(true)}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <User size={20} className="text-gray-600" />
                        </motion.button>

                        {/* Wishlist */}
                        {/* <motion.a
                            href="/wishlist"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
                        >
                            <Heart size={20} className="text-gray-600" />
                            {wishItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                                    {wishItems}
                                </span>
                            )}
                        </motion.a> */}

                        {/* Cart */}
                        <motion.a
                            href="/cart"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
                        >
                            <ShoppingBag size={20} className="text-gray-600" />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                                    {cartItems.length}
                                </span>
                            )}
                        </motion.a>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <div className="border-b border-gray-200 relative bg-white hidden lg:block">
                <div className="px-4">
                    <nav className="flex items-center justify-center py-3">
                        {/* Categories */}
                        <div className="flex items-center space-x-6">
                            {loading ? (
                                <div className="flex space-x-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="h-8 w-16 bg-gray-200 rounded-lg animate-pulse"></div>
                                    ))}
                                </div>
                            ) : (
                                categories.map((category, index) => (
                                    <motion.div
                                        key={category._id}
                                        className="relative"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onMouseEnter={() => handleCategoryHover(category)}
                                        onMouseLeave={handleCategoryLeave}
                                    >
                                        <a
                                            href={`/category/${category.slug}`}
                                            className="flex items-center space-x-1 py-2 px-3 text-gray-700 hover:text-navy-700 hover:bg-navy-50 rounded-lg transition-all duration-300 group font-medium capitalize border border-transparent hover:border-navy-200"
                                        >
                                            <span className="group-hover:scale-105 transition-transform duration-300">{category.display_name}</span>
                                            <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300 text-navy-500" />
                                        </a>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </nav>
                </div>

                {/* Mega Menu */}
                <MegaMenu
                    category={activeCategory}
                    isVisible={!!activeCategory}
                    onMouseEnter={() => {
                        if (timeoutRef.current) {
                            clearTimeout(timeoutRef.current);
                        }
                    }}
                    onMouseLeave={handleCategoryLeave}
                />
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <motion.div
                    className="lg:hidden fixed inset-0 bg-white z-50 overflow-y-auto"
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-xl font-bold text-navy-900">Menu</span>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-300"
                            >
                                <X size={24} className="text-navy-900" />
                            </button>
                        </div>

                        {/* Mobile Search */}
                        <form onSubmit={handleSearch} className="mb-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search for Sarees, Lehengas..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black transition-colors"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-gray-100 transition-colors"
                                >
                                    <Search size={20} className="text-gray-400" />
                                </button>
                            </div>
                        </form>

                        <div className="space-y-4">
                            {categories.map((category, index) => (
                                <motion.div
                                    key={category._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <a
                                        href={`/category/${category.slug}`}
                                        className="block py-3 px-4 text-lg font-medium text-gray-800 hover:bg-navy-50 rounded-lg transition-all duration-300 border border-transparent hover:border-navy-200 capitalize"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {category.display_name}
                                    </a>
                                    {category.subcategories && category.subcategories.length > 0 && (
                                        <div className="ml-4 mt-2 space-y-1">
                                            {category.subcategories.map((sub: Subcategory, subIndex: number) => (
                                                <motion.a
                                                    key={sub._id}
                                                    href={`/category/${sub.slug}`}
                                                    className="block py-2 px-3 text-gray-600 hover:text-navy-700 hover:bg-navy-50 rounded-lg transition-all duration-300 capitalize"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: (index * 0.1) + (subIndex * 0.05) }}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    {sub.display_name}
                                                </motion.a>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <a
                                    href="/track-order"
                                    className="text-center py-3 bg-navy-50 rounded-lg text-navy-700 font-medium hover:bg-navy-100 transition-all duration-300"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Track Order
                                </a>
                                <a
                                    href="/wholesale"
                                    className="text-center py-3 bg-navy-50 rounded-lg text-navy-700 font-medium hover:bg-navy-100 transition-all duration-300"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Wholesale
                                </a>
                            </div>

                            <button
                                onClick={() => {
                                    setShowLogin(true);
                                    setIsMobileMenuOpen(false);
                                }}
                                className="w-full bg-navy-900 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                Login / Sign Up
                            </button>

                            <div className="flex justify-center pt-4">
                                <Select value={currency} onValueChange={setCurrency}>
                                    <SelectTrigger className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white focus:border-navy-500 focus:ring-2 focus:ring-navy-200 transition-all duration-300">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {currencyOptions.map((option) => (
                                            <SelectItem key={option.code} value={option.code}>
                                                {option.code} - {option.symbol}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Login Modal */}
            <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
            <LiveChatComponent />
            {/* Custom CSS for navy colors and animations */}
            <style jsx>{`
                .text-navy-900 { color: #1e3a5f; }
                .text-navy-800 { color: #2563eb; }
                .text-navy-700 { color: #3b82f6; }
                .text-navy-600 { color: #60a5fa; }
                .text-navy-500 { color: #93c5fd; }
                .text-navy-400 { color: #bfdbfe; }
                .text-navy-300 { color: #dbeafe; }
                .text-navy-200 { color: #eff6ff; }
                
                .bg-navy-900 { background-color: #1e3a5f; }
                .bg-navy-800 { background-color: #2563eb; }
                .bg-navy-700 { background-color: #3b82f6; }
                .bg-navy-600 { background-color: #60a5fa; }
                .bg-navy-500 { background-color: #93c5fd; }
                .bg-navy-400 { background-color: #bfdbfe; }
                .bg-navy-300 { background-color: #dbeafe; }
                .bg-navy-200 { background-color: #eff6ff; }
                .bg-navy-100 { background-color: #f0f9ff; }
                .bg-navy-50 { background-color: #f8fafc; }
                
                .border-navy-900 { border-color: #1e3a5f; }
                .border-navy-800 { border-color: #2563eb; }
                .border-navy-700 { border-color: #3b82f6; }
                .border-navy-600 { border-color: #60a5fa; }
                .border-navy-500 { border-color: #93c5fd; }
                .border-navy-400 { border-color: #bfdbfe; }
                .border-navy-300 { border-color: #dbeafe; }
                .border-navy-200 { border-color: #eff6ff; }
                
                .hover\\:bg-navy-900:hover { background-color: #1e3a5f; }
                .hover\\:bg-navy-800:hover { background-color: #2563eb; }
                .hover\\:bg-navy-100:hover { background-color: #f0f9ff; }
                .hover\\:bg-navy-50:hover { background-color: #f8fafc; }
                
                .hover\\:text-navy-900:hover { color: #1e3a5f; }
                .hover\\:text-navy-800:hover { color: #2563eb; }
                .hover\\:text-navy-700:hover { color: #3b82f6; }
                .hover\\:text-navy-600:hover { color: #60a5fa; }
                
                .hover\\:border-navy-500:hover { border-color: #93c5fd; }
                .hover\\:border-navy-300:hover { border-color: #dbeafe; }
                .hover\\:border-navy-200:hover { border-color: #eff6ff; }
                
                .focus\\:ring-navy-500:focus { --tw-ring-color: #93c5fd; }
                .focus\\:ring-navy-200:focus { --tw-ring-color: #eff6ff; }
                .focus\\:ring-navy-100:focus { --tw-ring-color: #f0f9ff; }
                
                .focus\\:border-navy-500:focus { border-color: #93c5fd; }

                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: .8; }
                }
            `}</style>
        </div>
    );
};

export default Navbar;