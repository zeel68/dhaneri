'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Heart,
    ShoppingBag,
    Menu,
    X,
    Star,
    Truck,
    DollarSign,
    Headphones,
    CreditCard,
    Instagram,
    Facebook,
    Twitter,
    Youtube,
    User,
    Mail,
    Lock,
    ArrowRight,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import KurtiSection from './kurtiSection';
import WishlistCarousel from './wishlistSlider';
import { Button } from '../ui/button';
import Link from 'next/link';

export default function HomePage() {
    const [timeLeft, setTimeLeft] = useState({
        days: 30,
        hours: 14,
        minutes: 22,
        seconds: 41
    });
    const [currentSlide, setCurrentSlide] = useState(0);
    const [activeFilter, setActiveFilter] = useState('all');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [isScrolled, setIsScrolled] = useState(false);

    // Handle scroll for header
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Countdown timer effect
    useEffect(() => {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 30);
        targetDate.setHours(14, 22, 41, 0);

        const timer = setInterval(() => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();

            if (difference <= 0) {
                clearInterval(timer);
                return;
            }

            setTimeLeft({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Auto slide for hero
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    // Product data
    const products = [
        {
            id: 1,
            name: "Kurti 1",
            price: "599.0",
            rating: 5,
            category: "Kurti",
            status: "new",
            image: "https://res.cloudinary.com/dvgpflfpc/image/upload/v1756543699/ecommerce_uploads/products/lepwskrrltr7rxmu75bw.jpg"
        },
        {
            id: 2,
            name: "Kurti 2",
            price: "499.0",
            rating: 5,
            category: "Kurti",
            image: "https://res.cloudinary.com/dvgpflfpc/image/upload/v1756544219/ecommerce_uploads/products/keacxw44ycan8h4ygkrv.jpg"
        },
        {
            id: 3,
            name: "Kurti 3",
            price: "599.0",
            rating: 2.2,
            category: "Kurti",
            status: "out-of-stock",
            image: "https://res.cloudinary.com/dvgpflfpc/image/upload/v1756551269/ecommerce_uploads/products/lb5rplzpbx1ywyf5wyps.jpg"
        },
        {
            id: 4,
            name: "Skirt 1",
            price: "599.0",
            rating: 5,
            category: "Skirt",
            image: "https://res.cloudinary.com/dvgpflfpc/image/upload/v1756551408/ecommerce_uploads/products/k5jxycpxmd4mm3hm8r9i.jpg"
        },
        {
            id: 5,
            name: "Skirt 2",
            price: "$59.0",
            rating: 5,
            category: "Skirt",
            image: "https://res.cloudinary.com/dvgpflfpc/image/upload/v1756556054/ecommerce_uploads/products/s8jnscbnjudmk6pkpuj2.jpg"
        },
        {
            id: 6,
            name: "Skirt 3",
            price: "$49.0",
            originalPrice: "$59.0",
            rating: 5,
            category: "Skirt",
            status: "sale",
            image: "https://res.cloudinary.com/dvgpflfpc/image/upload/v1756570494/ecommerce_uploads/products/fggoytw8ayn6xekyhejt.jpg"
        },
        {
            id: 7,
            name: "Kurti 4",
            price: "$59.0",
            rating: 5,
            category: "Kurti",
            image: "https://res.cloudinary.com/dvgpflfpc/image/upload/v1756571397/ecommerce_uploads/products/srkosqi1sqkcmmowrer0.jpg"
        },
        {
            id: 8,
            name: "Kurti 5",
            price: "$49.0",
            originalPrice: "$59.0",
            rating: 5,
            category: "Kurti",
            status: "sale",
            image: "https://res.cloudinary.com/dvgpflfpc/image/upload/v1756571399/ecommerce_uploads/products/uyh5axmaegvabucjfr2d.jpg"
        }
    ];

    const heroSlides = [
        {
            _id: "6898f3bc9787451b9417de42",
            image_url: "https://res.cloudinary.com/dvgpflfpc/image/upload/v1754854331/ecommerce_uploads/heroslides/fzbqd1oeth3tcbojioao.png",
            title: "Timeless Elegance Redefined",
            subtitle: "Discover our exquisite collection of handwoven Banarasi silk sarees, crafted with centuries of tradition and unmatched artistry.",
            cta: "Explore Heritage Collection"
        },
        {
            _id: "6898f72a9787451b9417df20",
            image_url: "https://res.cloudinary.com/dvgpflfpc/image/upload/v1754855209/ecommerce_uploads/heroslides/uez0koqyzpt9djegsekf.png",
            title: "Festive Splendor 2025",
            subtitle: "Celebrate life's precious moments in our specially curated festive collection, where tradition meets contemporary grace.",
            cta: "Shop Festive Wear"
        },
        {
            _id: "6898f72a9787451b9417df23",
            image_url: "https://res.cloudinary.com/dvgpflfpc/image/upload/v1754855209/ecommerce_uploads/heroslides/nqe9ddbmuwiygghqaptq.png",
            title: "Bridal Dreams Collection",
            subtitle: "Make your special day unforgettable with our luxurious bridal ensembles, designed to make every bride feel like royalty.",
            cta: "Explore Bridal Wear"
        }
    ];

    // Filter products
    const filteredProducts = activeFilter == 'all'
        ? products
        : products.filter(product =>
            product.category == activeFilter
        );

    // Trending products data
    const trendingProducts = {
        hotTrend: [
            { name: "Chain bucket bag", price: "$59.0", rating: 5, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
            { name: "Pendant earrings", price: "$59.0", rating: 5, image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
            { name: "Cotton T-Shirt", price: "$59.0", rating: 5, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" }
        ],
        bestSeller: [
            { name: "Cotton T-Shirt", price: "$59.0", rating: 5, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
            { name: "Zip-pockets pebbled tote briefcase", price: "$59.0", rating: 5, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
            { name: "Round leather bag", price: "$59.0", rating: 5, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" }
        ],
        feature: [
            { name: "Bow wrap skirt", price: "$59.0", rating: 5, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
            { name: "Metallic earrings", price: "$59.0", rating: 5, image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
            { name: "Flap cross-body bag", price: "$59.0", rating: 5, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" }
        ]
    };

    // Services data
    const services = [
        { icon: <Truck className="h-8 w-8" />, title: "Free Shipping", description: "For all orders over $99" },
        { icon: <DollarSign className="h-8 w-8" />, title: "Money Back Guarantee", description: "If goods have problems" },
        { icon: <Headphones className="h-8 w-8" />, title: "Online Support 24/7", description: "Dedicated support" },
        { icon: <CreditCard className="h-8 w-8" />, title: "Payment Secure", description: "100% secure payment" }
    ];

    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const staggerChildren = {
        visible: { transition: { staggerChildren: 0.15 } }
    };

    const scaleIn = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
    };

    const slideIn = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    // Navigation function
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            {/* <header className={`fixed w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <button className="lg:hidden mr-4" onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu className="h-6 w-6" />
                        </button>
                        <h1 className="text-2xl font-bold text-slate-800">Dhaneri</h1>
                    </div>

                    <nav className="hidden lg:flex items-center space-x-8">
                        {['Home', 'Shop', 'Collections', 'Categories', 'Blog', 'Contact'].map((item) => (
                            <a key={item} href="#" className="font-medium text-slate-700 hover:text-red-600 transition-colors">
                                {item}
                            </a>
                        ))}
                    </nav>

                    <div className="flex items-center space-x-4">
                        <button onClick={() => setIsSearchOpen(true)} className="p-2">
                            <Search className="h-5 w-5 text-slate-700" />
                        </button>
                        <button onClick={() => setShowAuthModal(true)} className="p-2">
                            <User className="h-5 w-5 text-slate-700" />
                        </button>
                        <button className="p-2 relative">
                            <Heart className="h-5 w-5 text-slate-700" />
                            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                3
                            </span>
                        </button>
                        <button className="p-2 relative">
                            <ShoppingBag className="h-5 w-5 text-slate-700" />
                            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                5
                            </span>
                        </button>
                    </div>
                </div>
            </header> */}

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <motion.div
                            className="bg-white w-80 h-full p-6"
                            initial={{ x: -320 }}
                            animate={{ x: 0 }}
                            exit={{ x: -320 }}
                            transition={{ type: "tween" }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-bold">Dhaneri</h2>
                                <button onClick={() => setIsMobileMenuOpen(false)}>
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <nav className="space-y-4">
                                {['Home', 'Shop', 'Collections', 'Categories', 'Blog', 'Contact'].map((item) => (
                                    <a
                                        key={item}
                                        href="#"
                                        className="block py-2 font-medium text-slate-700 hover:text-red-600 transition-colors"
                                    >
                                        {item}
                                    </a>
                                ))}
                            </nav>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Section */}
            <section className="relative h-screen pt-16">
                <AnimatePresence mode="wait">
                    {heroSlides.map((slide, index) => (
                        index === currentSlide && (
                            <motion.div
                                key={slide._id}
                                className="absolute inset-0 w-full h-full"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <div
                                    className="bg-cover bg-center h-full w-full"
                                    style={{ backgroundImage: `url(${slide.image_url})` }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex items-center">
                                        <div className="container mx-auto px-6 text-white">
                                            <div className="max-w-2xl">
                                                <motion.h1
                                                    className="text-4xl md:text-5xl lg:text-6xl font-serif font-light mb-6 leading-tight"
                                                    initial={{ y: 30, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.3, duration: 0.8 }}
                                                >
                                                    {slide.title}
                                                </motion.h1>
                                                <motion.p
                                                    className="text-lg md:text-xl mb-8 text-gray-100 leading-relaxed"
                                                    initial={{ y: 30, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.5, duration: 0.8 }}
                                                >
                                                    {slide.subtitle}
                                                </motion.p>
                                                <motion.div
                                                    initial={{ y: 30, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.7, duration: 0.8 }}
                                                >
                                                    <Button className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-full font-medium text-base group">
                                                        {slide.cta}
                                                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                                    </Button>
                                                </motion.div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    ))}
                </AnimatePresence>

                {/* Slide Controls */}
                <button
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors z-10"
                    onClick={prevSlide}
                >
                    <ChevronLeft className="h-6 w-6 text-white" />
                </button>
                <button
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors z-10"
                    onClick={nextSlide}
                >
                    <ChevronRight className="h-6 w-6 text-white" />
                </button>

                {/* Slide Indicators */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
                    {heroSlides.map((_, index) => (
                        <button
                            key={index}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white' : 'bg-white/40'}`}
                            onClick={() => setCurrentSlide(index)}
                        />
                    ))}
                </div>
            </section>

            {/* Categories Grid */}
            <section className="py-16 bg-slate-50">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="text-center mb-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                    >
                        <h2 className="text-3xl font-bold mb-4 text-slate-800">Shop by Category</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Explore our diverse collection of fashion items for every occasion and style.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main category */}
                        <motion.div
                            className="lg:col-span-2 relative h-96 rounded-2xl overflow-hidden group"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={fadeIn}
                        >
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')" }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent flex flex-col justify-end p-8 text-white">
                                <h2 className="text-3xl font-bold mb-2">Women's fashion</h2>
                                <p className="mb-4 text-slate-200">Discover the latest trends in women's fashion</p>
                                <motion.a
                                    href="#"
                                    className="inline-flex items-center text-red-400 font-medium"
                                    whileHover={{ x: 5 }}
                                >
                                    Shop now
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </motion.a>
                            </div>
                        </motion.div>

                        {/* Sub categories */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                            {[
                                { title: "Men's fashion", items: "358 items", image: "img/img-3.jpeg" },
                                { title: "Kid's fashion", items: "273 items", image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
                                // { title: "Accessories", items: "159 items", image: "https://images.unsplash.com/photo-1590649880760-2d4b0f523de7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
                                // { title: "Footwear", items: "792 items", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" }
                            ].map((category, index) => (
                                <motion.div
                                    key={index}
                                    className="relative h-44 rounded-2xl overflow-hidden group"
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: "-100px" }}
                                    variants={fadeIn}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                        style={{ backgroundImage: `url('${category.image}')` }}
                                    />
                                    <div className="absolute inset-0 bg-slate-900/50 flex flex-col justify-center items-center text-white text-center p-4">
                                        <h3 className="font-bold mb-1">{category.title}</h3>
                                        <p className="text-sm mb-2 text-slate-200">{category.items}</p>
                                        <motion.a
                                            href="#"
                                            className="text-xs text-red-400 font-medium"
                                            whileHover={{ x: 5 }}
                                        >
                                            Shop now
                                        </motion.a>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Kurti Section */}
            <KurtiSection />

            {/* Products Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="text-center mb-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                    >
                        <h2 className="text-3xl font-bold mb-4 text-slate-800">New Arrivals</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Check out our latest collection of fashion items for men, women, and kids.
                        </p>
                    </motion.div>

                    {/* Filter buttons */}
                    <motion.div
                        className="flex flex-wrap justify-center gap-2 mb-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerChildren}
                    >
                        {["all", 'Skirt', 'Kurti',].map((filter) => (
                            <motion.button
                                key={filter}
                                className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${activeFilter === filter
                                    ? 'bg-red-600 text-white'
                                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                                    }`}
                                variants={fadeIn}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveFilter(filter)}
                            >
                                {filter === 'all' ? 'All Products' : `${filter}'s`}
                            </motion.button>
                        ))}
                    </motion.div>

                    {/* Products grid */}
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerChildren}
                    >
                        {filteredProducts.map((product) => (
                            <motion.div
                                key={product.id}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group border border-slate-100"
                                variants={scaleIn}
                                whileHover={{ y: -5 }}
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <div
                                        className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                        style={{ backgroundImage: `url('${product.image}')` }}
                                    />

                                    {/* Product status badge */}
                                    {product.status && (
                                        <div className={`absolute top-3 left-3 px-2 py-1 rounded text-xs font-medium ${product.status === 'new' ? 'bg-white text-slate-900' :
                                            product.status === 'sale' ? 'bg-red-600 text-white' :
                                                'bg-slate-800 text-white'
                                            }`}>
                                            {product.status === 'out-of-stock' ? 'Out of stock' : product.status}
                                        </div>
                                    )}

                                    {/* Product actions */}
                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-2">
                                        <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50">
                                            <Search className="h-4 w-4 text-slate-700" />
                                        </button>
                                        <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50">
                                            <Heart className="h-4 w-4 text-slate-700" />
                                        </button>
                                        <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50">
                                            <ShoppingBag className="h-4 w-4 text-slate-700" />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <Link href={`/product/${product.name}`}>
                                        <h3 className="font-medium mb-2 text-slate-800">{product.name}</h3>
                                    </Link>
                                    <div className="flex items-center mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="h-4 w-4 fill-amber-400 text-amber-400"
                                            />
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-slate-900">{product.price}</span>
                                        {product.originalPrice && (
                                            <span className="text-sm text-slate-500 line-through">{product.originalPrice}</span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    <div className="text-center mt-12">
                        <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full">
                            View All Products
                        </Button>
                    </div>
                </div>
            </section>

            {/* Banner Section */}
            <section className="py-16 bg-slate-100">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="relative h-96 rounded-2xl overflow-hidden"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')" }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 to-transparent" />

                        <div className="relative z-10 h-full flex items-center text-white">
                            <div className="max-w-md ml-8 md:ml-16">
                                <motion.span
                                    className="text-sm uppercase tracking-wider text-red-400 mb-2 block"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ delay: 0.2 }}
                                >
                                    The Chloe Collection
                                </motion.span>

                                <motion.h2
                                    className="text-4xl md:text-5xl font-bold mb-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ delay: 0.4 }}
                                >
                                    The Project Jacket
                                </motion.h2>

                                <motion.button
                                    className="px-6 py-3 bg-red-600 text-white rounded-full font-medium"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ delay: 0.6 }}
                                    whileHover={{ scale: 1.05, backgroundColor: "#dc2626" }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Shop now
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Trending Products */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <motion.h2
                        className="text-3xl font-bold text-center mb-12 text-slate-800"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                    >
                        Trending Now
                    </motion.h2>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerChildren}
                    >
                        {/* Hot Trend */}
                        <motion.div variants={fadeIn}>
                            <h3 className="text-xl font-bold mb-6 pb-2 border-b border-slate-200 text-slate-800">Hot Trend</h3>
                            <div className="space-y-6">
                                {trendingProducts.hotTrend.map((product, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex space-x-4 group p-3 rounded-lg hover:bg-slate-50 transition-colors"
                                        whileHover={{ x: 5 }}
                                    >
                                        <div className="w-20 h-20 bg-slate-200 rounded-lg flex-shrink-0 overflow-hidden">
                                            <div
                                                className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                                style={{ backgroundImage: `url('${product.image}')` }}
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-medium mb-1 text-slate-800">{product.name}</h4>
                                            <div className="flex items-center mb-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className="h-3 w-3 fill-amber-400 text-amber-400"
                                                    />
                                                ))}
                                            </div>
                                            <span className="font-bold text-red-600">{product.price}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Best Seller */}
                        <motion.div variants={fadeIn} transition={{ delay: 0.2 }}>
                            <h3 className="text-xl font-bold mb-6 pb-2 border-b border-slate-200 text-slate-800">Best Seller</h3>
                            <div className="space-y-6">
                                {trendingProducts.bestSeller.map((product, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex space-x-4 group p-3 rounded-lg hover:bg-slate-50 transition-colors"
                                        whileHover={{ x: 5 }}
                                    >
                                        <div className="w-20 h-20 bg-slate-200 rounded-lg flex-shrink-0 overflow-hidden">
                                            <div
                                                className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                                style={{ backgroundImage: `url('${product.image}')` }}
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-medium mb-1 text-slate-800">{product.name}</h4>
                                            <div className="flex items-center mb-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className="h-3 w-3 fill-amber-400 text-amber-400"
                                                    />
                                                ))}
                                            </div>
                                            <span className="font-bold text-red-600">{product.price}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Feature */}
                        <motion.div variants={fadeIn} transition={{ delay: 0.4 }}>
                            <h3 className="text-xl font-bold mb-6 pb-2 border-b border-slate-200 text-slate-800">Feature</h3>
                            <div className="space-y-6">
                                {trendingProducts.feature.map((product, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex space-x-4 group p-3 rounded-lg hover:bg-slate-50 transition-colors"
                                        whileHover={{ x: 5 }}
                                    >
                                        <div className="w-20 h-20 bg-slate-200 rounded-lg flex-shrink-0 overflow-hidden">
                                            <div
                                                className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                                style={{ backgroundImage: `url('${product.image}')` }}
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-medium mb-1 text-slate-800">{product.name}</h4>
                                            <div className="flex items-center mb-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className="h-3 w-3 fill-amber-400 text-amber-400"
                                                    />
                                                ))}
                                            </div>
                                            <span className="font-bold text-red-600">{product.price}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Wishlist Carousel */}
            <WishlistCarousel />

            {/* Discount Section */}
            <section className="py-16 bg-slate-900">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-xl"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                    >
                        <div className="md:w-1/2 h-96 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')" }} />

                        <div className="md:w-1/2 bg-red-600 text-white p-8 flex flex-col justify-center">
                            <motion.div
                                className="mb-8"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ delay: 0.2 }}
                            >
                                <span className="text-sm uppercase tracking-wider text-red-200 mb-2 block">Discount</span>
                                <h2 className="text-4xl font-bold mb-2">Diwali 2025</h2>
                                <h3 className="text-2xl">
                                    <span className="bg-white text-red-600 px-2 py-1 rounded mr-2">Sale</span>
                                    10% OFF
                                </h3>
                            </motion.div>

                            <motion.div
                                className="grid grid-cols-4 gap-4 mb-8"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ delay: 0.4 }}
                            >
                                {Object.entries(timeLeft).map(([key, value]) => (
                                    <div key={key} className="text-center bg-red-700 py-3 rounded-lg">
                                        <span className="block text-2xl font-bold">{value.toString().padStart(2, '0')}</span>
                                        <span className="text-sm text-red-200 capitalize">{key}</span>
                                    </div>
                                ))}
                            </motion.div>

                            <motion.button
                                className="self-start px-6 py-3 bg-white text-red-600 rounded-full font-medium"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ delay: 0.6 }}
                                whileHover={{ scale: 1.05, backgroundColor: "#fef2f2", color: "#dc2626" }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Shop now
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerChildren}
                    >
                        {services.map((service, index) => (
                            <motion.div
                                key={index}
                                className="text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-slate-100"
                                variants={fadeIn}
                                whileHover={{ y: -5 }}
                            >
                                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-600 mb-4">
                                    {service.icon}
                                </div>
                                <h4 className="font-bold mb-2 text-slate-800">{service.title}</h4>
                                <p className="text-sm text-slate-600">{service.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Instagram Section */}
            <section className="py-16 bg-slate-50">
                <div className="container mx-auto px-4">
                    <motion.h3
                        className="text-3xl font-bold text-center mb-8 text-slate-800"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                    >
                        Follow us on Instagram
                    </motion.h3>

                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerChildren}
                    >
                        {[1, 10, 7, 4, 5, 6].map((item) => (
                            <motion.div
                                key={item}
                                className="relative group overflow-hidden rounded-2xl aspect-square"
                                variants={scaleIn}
                                whileHover={{ scale: 1.02 }}
                            >
                                <div
                                    className="h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                    style={{ backgroundImage: `url('/img/img-${item}.jpeg')` }}
                                />
                                <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
                                        <Instagram className="h-8 w-8 mx-auto mb-1" />
                                        <span className="text-sm">@dhaneri_fashion</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            {/* <footer className="bg-slate-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4">Dhaneri</h3>
                            <p className="text-slate-400 mb-4">
                                Fashion for everyone. Quality products at affordable prices.
                            </p>
                            <div className="flex space-x-4">
                                {socialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href="#"
                                        className="bg-slate-800 p-2 rounded-full hover:bg-red-600 transition-colors"
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4">Quick Links</h4>
                            <ul className="space-y-2">
                                {['About', 'Blogs', 'Contact', 'FAQ'].map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-slate-400 hover:text-white transition-colors">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4">Account</h4>
                            <ul className="space-y-2">
                                {['My Account', 'Orders Tracking', 'Checkout', 'Wishlist'].map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-slate-400 hover:text-white transition-colors">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4">Newsletter</h4>
                            <p className="text-slate-400 mb-4">
                                Subscribe to our newsletter to get updates on our latest products and offers.
                            </p>
                            <div className="flex">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                                />
                                <button className="px-4 py-2 bg-red-600 rounded-r-lg font-medium">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
                        <p>© 2023 Dhaneri. All rights reserved.</p>
                    </div>
                </div>
            </footer> */}

            {/* Search Modal */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        className="fixed inset-0 bg-slate-900/80 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-2xl p-6 w-full max-w-md"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-slate-800">Search Products</h3>
                                <button
                                    onClick={() => setIsSearchOpen(false)}
                                    className="p-1 hover:bg-slate-100 rounded-full"
                                >
                                    <X className="h-5 w-5 text-slate-600" />
                                </button>
                            </div>
                            <div className="flex">
                                <input
                                    type="text"
                                    placeholder="Search here..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 px-4 py-2 border border-slate-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-slate-800"
                                />
                                <button className="px-4 py-2 bg-red-600 text-white rounded-r-lg font-medium">
                                    <Search className="h-5 w-5" />
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Auth Modal */}
            <AnimatePresence>
                {showAuthModal && (
                    <motion.div
                        className="fixed inset-0 bg-slate-900/80 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-2xl p-6 w-full max-w-md"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-slate-800">
                                    {authMode === 'login' ? 'Login' : 'Create Account'}
                                </h3>
                                <button
                                    onClick={() => setShowAuthModal(false)}
                                    className="p-1 hover:bg-slate-100 rounded-full"
                                >
                                    <X className="h-5 w-5 text-slate-600" />
                                </button>
                            </div>

                            <form className="space-y-4">
                                {authMode === 'signup' && (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Your name"
                                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-slate-800"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <input
                                            type="email"
                                            placeholder="your.email@example.com"
                                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-slate-800"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-slate-800"
                                        />
                                    </div>
                                </div>

                                {authMode === 'login' && (
                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center">
                                            <input type="checkbox" className="h-4 w-4 text-red-600 focus:ring-red-500 border-slate-300 rounded" />
                                            <span className="ml-2 text-sm text-slate-600">Remember me</span>
                                        </label>
                                        <a href="#" className="text-sm text-red-600 hover:text-red-700">Forgot password?</a>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                                >
                                    {authMode === 'login' ? 'Login' : 'Create Account'}
                                </button>

                                <div className="text-center text-sm text-slate-600">
                                    {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                                    <button
                                        type="button"
                                        className="text-red-600 hover:text-red-700 font-medium"
                                        onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                                    >
                                        {authMode === 'login' ? 'Sign up' : 'Login'}
                                    </button>
                                </div>
                            </form>

                            <div className="mt-6 pt-6 border-t border-slate-200">
                                <p className="text-center text-sm text-slate-600 mb-4">Or continue with</p>
                                <div className="flex justify-center space-x-4">
                                    {[Facebook, Twitter, Instagram].map((Icon, index) => (
                                        <button
                                            key={index}
                                            className="p-2 border border-slate-300 rounded-full hover:bg-slate-50 transition-colors"
                                        >
                                            <Icon className="h-5 w-5" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}