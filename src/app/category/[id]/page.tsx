"use client";

import { STORE_ID } from '@/data/Consts';
import ApiClient from '@/utils/apiCalling';
import React, { useState, useEffect, useRef, useCallback, use } from 'react';
import { Heart, Share2, Star, Truck, Shield, RotateCcw, Minus, Plus, ShoppingCart, Eye, ChevronLeft, ChevronRight, Package, Award, Clock, Users, MessageCircle, ChevronDown, Info, X, MapPin, Phone, Mail, Copy, Check, ArrowRight, Crown, Gift, TrendingUp, Verified, CreditCard, ShieldCheck, Filter, Grid, List, SlidersHorizontal, ChevronUp, Sparkles, Zap, Target, Sparkle, ArrowUpRight, Tag, Award as AwardIcon, Clock as ClockIcon, TrendingUp as TrendingUpIcon, Search, ArrowUp } from 'lucide-react';
import Link from 'next/link';

interface CategoryPageProps {
    params: {
        id: string;
    };
}

interface SizeOption {
    id: string;
    size: string;
    stock: number;
    priceModifier: number;
    sku: string;
}

interface Variant {
    id: string;
    color: string;
    images: string[];
    primaryIndex: number;
    sizes: SizeOption[];
    option: string;
    price: number;
    sku: string;
    stock_quantity: number;
}

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    brand: string;
    sku: string;
    GST: number | null;
    HSNCode: string;
    images: string[];
    variants: Variant[];
    ratings: { average: number; count: number };
    stock: {
        quantity: number;
        reserved: number;
        track_inventory: boolean;
        allow_backorder: boolean;
        low_stock_threshold: number;
    };
    slug: string;
    category: string;
    is_active: boolean;
    tags: string[];
    availableTags: string[];
    reviews: any[];
    createdAt: string;
    updatedAt: string;
}

interface FilterOption {
    name: string;
    type: string;
    options: string[];
    is_required: boolean;
}

interface Category {
    _id: string;
    category_id: string;
    store_id: string;
    slug: string;
    is_primary: boolean;
    products: Product[];
    img_url: string;
    display_name: string;
    description: string;
    sort_order: number;
    is_active: boolean;
    config: {
        filters: FilterOption[];
        attributes: any[];
    };
    createdAt: string;
    updatedAt: string;
}



export default function CategoryPage({ params }: { params: any }) {
    const param = use(params);
    const apiClient = new ApiClient();
    const categoryId = param.id;
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState('newest');
    const [showFilters, setShowFilters] = useState(true);
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(12);
    const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
    const [hoveredImageIndex, setHoveredImageIndex] = useState(0);
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [selectedQuickViewVariant, setSelectedQuickViewVariant] = useState<Variant | null>(null);
    const [selectedQuickViewSize, setSelectedQuickViewSize] = useState<SizeOption | null>(null);
    const [quickViewQuantity, setQuickViewQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState<Record<string, boolean>>({});
    const [showSizeGuide, setShowSizeGuide] = useState(false);
    const [activeFilterTab, setActiveFilterTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showBackToTop, setShowBackToTop] = useState(false);

    const observerRef = useRef<IntersectionObserver | null>(null);
    const lastProductRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get(`storefront/store/${STORE_ID}/category/${categoryId}`) as any;
                const categoryData = response.data.data[0];
                setCategory(categoryData);
            } catch (error) {
                console.error("Error fetching category:", error);
                setError("Failed to load category. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (categoryId) {
            fetchCategory();
        }
    }, [categoryId]);

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 400);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleFilterChange = (filterName: string, value: string) => {
        setSelectedFilters(prev => {
            const current = prev[filterName] || [];
            const newFilters = current.includes(value)
                ? current.filter(v => v !== value)
                : [...current, value];

            return {
                ...prev,
                [filterName]: newFilters
            };
        });
        setCurrentPage(1);
    };

    const handlePriceRangeChange = (min: number, max: number) => {
        setPriceRange([min, max]);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setSelectedFilters({});
        setPriceRange([0, 10000]);
        setCurrentPage(1);
    };

    const toggleWishlist = (productId: string) => {
        setIsWishlisted(prev => ({
            ...prev,
            [productId]: !prev[productId]
        }));
    };

    const getFilteredProducts = () => {
        if (!category?.products) return [];

        let filtered = [...category.products];

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        // Apply filters
        Object.entries(selectedFilters).forEach(([filterName, values]) => {
            if (values.length > 0) {
                filtered = filtered.filter(product => {
                    if (filterName === 'Size') {
                        return product.variants.some(variant =>
                            variant.sizes.some(size => values.includes(size.size))
                        );
                    } else if (filterName === 'Color') {
                        return product.variants.some(variant => values.includes(variant.color));
                    } else if (filterName === 'Type') {
                        return product.tags.some(tag => values.includes(tag));
                    }
                    return true;
                });
            }
        });

        // Apply price filter
        filtered = filtered.filter(product =>
            product.price >= priceRange[0] && product.price <= priceRange[1]
        );

        // Apply sorting
        switch (sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                filtered.sort((a, b) => b.ratings.average - a.ratings.average);
                break;
            case 'newest':
                filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
            case 'oldest':
                filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                break;
        }

        return filtered;
    };

    const filteredProducts = getFilteredProducts();
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);

    const getProductImages = (product: Product) => {
        const allImages = [];
        if (product.images.length > 0) {
            allImages.push(...product.images);
        }
        product.variants.forEach(variant => {
            if (variant?.images?.length > 0) {
                allImages.push(...variant.images);
            }
        });
        return allImages.length > 0 ? allImages : ['/placeholder-product.jpg'];
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="relative">
                            <div className="w-24 h-24 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 w-24 h-24 border-4 border-transparent border-t-blue-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                        </div>
                        <div className="mt-6 space-y-2">
                            <div className="h-4 bg-slate-200 rounded-full w-48 animate-pulse"></div>
                            <div className="h-3 bg-slate-200 rounded-full w-32 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !category) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-pink-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-6">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <X className="w-10 h-10 text-red-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">Category Not Found</h1>
                    <p className="text-slate-600 mb-8">{error || "The category you're looking for doesn't exist."}</p>
                    <Link href="/" className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-all duration-300 hover:scale-105">
                        <ChevronLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Hero Section */}
            {/* <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-900/90"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

                <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-blue-200 font-medium">Premium Collection</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        {category.display_name}
                        <span className="block text-4xl md:text-5xl text-blue-200 font-light mt-2">
                            Collection
                        </span>
                    </h1>

                    {category.description && (
                        <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
                            {category.description}
                        </p>
                    )}

                    <div className="flex items-center justify-center gap-8 text-white/80">
                        <div className="flex items-center gap-2">
                            <Package className="w-5 h-5 text-blue-300" />
                            <span>{filteredProducts.length} Products</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-400" />
                            <span>Premium Quality</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-green-300" />
                            <span>Authentic</span>
                        </div>
                    </div>
                </div>
            </div> */}

            <div className="max-w-9xl mx-auto px-6 py-12">
                {/* Search and Quick Stats */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search products, brands, or tags..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white/90 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                />
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-slate-900">{filteredProducts.length}</div>
                                <div className="text-sm text-slate-600">Products</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{category.config.filters.length}</div>
                                <div className="text-sm text-slate-600">Filters</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">{Math.max(...filteredProducts.map(p => p.ratings.average), 0).toFixed(1)}</div>
                                <div className="text-sm text-slate-600">Avg Rating</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Filter Toggle */}
                <div className="lg:hidden mb-6">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-3 bg-white/90 backdrop-blur-xl border border-white/20 px-6 py-4 rounded-2xl w-full justify-between shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        <span className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <SlidersHorizontal className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-semibold text-slate-900">Filters & Options</span>
                        </span>
                        {showFilters ? <ChevronUp className="w-5 h-5 text-slate-600" /> : <ChevronDown className="w-5 h-5 text-slate-600" />}
                    </button>
                </div>

                <div className="flex gap-8">
                    {/* Enhanced Sidebar Filters */}
                    <div className={`lg:w-96 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 sticky top-8">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                        <Filter className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">Smart Filters</h2>
                                </div>
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="lg:hidden w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-200 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Filter Tabs */}
                            {/* <div className="flex gap-2 mb-6 p-1 bg-slate-100 rounded-2xl">
                                {['all', 'price', 'attributes'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveFilterTab(tab)}
                                        className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${activeFilterTab === tab
                                            ? 'bg-white text-slate-900 shadow-sm'
                                            : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                    >
                                        {tab === 'all' && 'All'}
                                        {tab === 'price' && 'Price'}
                                        {tab === 'attributes' && 'Attributes'}
                                    </button>
                                ))}
                            </div> */}

                            {/* Price Range Filter */}
                            {(activeFilterTab === 'all' || activeFilterTab === 'price') && (
                                <div className="mb-8">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Tag className="w-5 h-5 text-blue-600" />
                                        <h3 className="font-semibold text-slate-900">Price Range</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex gap-3">
                                            <div className="flex-1">
                                                <label className="block text-xs font-medium text-slate-600 mb-2">Min</label>
                                                <input
                                                    type="number"
                                                    placeholder="0"
                                                    value={priceRange[0]}
                                                    onChange={(e) => handlePriceRangeChange(Number(e.target.value), priceRange[1])}
                                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-xs font-medium text-slate-600 mb-2">Max</label>
                                                <input
                                                    type="number"
                                                    placeholder="10000"
                                                    value={priceRange[1]}
                                                    onChange={(e) => handlePriceRangeChange(priceRange[0], Number(e.target.value))}
                                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                                />
                                            </div>
                                        </div>
                                        <div className="text-center text-sm text-slate-500">
                                            Range: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Dynamic Filters */}
                            {(activeFilterTab === 'all' || activeFilterTab === 'attributes') && (
                                <div className="space-y-6">
                                    {category.config.filters.map((filter) => (
                                        <div key={filter.name} className="border border-slate-100 rounded-2xl p-4 bg-white/50">
                                            <div className="flex items-center gap-2 mb-4">
                                                {filter.name === 'Size' && <Target className="w-4 h-4 text-green-600" />}
                                                {filter.name === 'Color' && <Sparkle className="w-4 h-4 text-purple-600" />}
                                                {filter.name === 'Type' && <AwardIcon className="w-4 h-4 text-amber-600" />}
                                                {filter.name === 'Price' && <Tag className="w-4 h-4 text-blue-600" />}
                                                <h3 className="font-semibold text-slate-900">{filter.name}</h3>
                                            </div>
                                            <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
                                                {filter.options.map((option) => (
                                                    <label key={option} className="flex items-center gap-3 cursor-pointer group">
                                                        <div className="relative">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedFilters[filter.name]?.includes(option) || false}
                                                                onChange={() => handleFilterChange(filter.name, option)}
                                                                className="w-4 h-4 text-blue-600 bg-white border-2 border-slate-300 rounded focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                                                            />
                                                            <div className="absolute inset-0 w-4 h-4 bg-blue-600 rounded scale-0 transition-transform duration-200 pointer-events-none"></div>
                                                        </div>
                                                        <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">{option}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Clear Filters */}
                            <div className="pt-6 border-t border-slate-200 mt-8">
                                <button
                                    onClick={clearFilters}
                                    className="w-full bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 py-3 px-4 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Enhanced Controls */}
                        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                {/* Left side - View mode and results */}
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center bg-slate-100 rounded-2xl p-1">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-3 rounded-xl transition-all duration-300 ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-lg scale-105' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'}`}
                                        >
                                            <Grid className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p-3 rounded-xl transition-all duration-300 ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-lg scale-105' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'}`}
                                        >
                                            <List className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="text-slate-600">
                                        <span className="font-semibold text-slate-900">{filteredProducts.length}</span> products found
                                    </div>
                                </div>

                                {/* Right side - Sort */}
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-medium text-slate-600">Sort by:</span>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    >
                                        <option value="newest">Newest First</option>
                                        <option value="oldest">Oldest First</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                        <option value="rating">Highest Rated</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Products Grid */}
                        {currentProducts.length > 0 ? (
                            <div className={`grid gap-6 ${viewMode === 'grid'
                                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4'
                                : 'grid-cols-1'
                                }`}>
                                {currentProducts.map((product, index) => {
                                    const productImages = getProductImages(product);
                                    const isHovered = hoveredProduct === product._id;

                                    return (
                                        <div
                                            key={product._id}
                                            ref={index === currentProducts.length - 1 ? lastProductRef : null}
                                            className="group bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
                                            onMouseEnter={() => setHoveredProduct(product._id)}
                                            onMouseLeave={() => {
                                                setHoveredProduct(null);
                                                setHoveredImageIndex(0);
                                            }}
                                        >
                                            {/* Enhanced Product Image */}
                                            <div className="relative aspect-[4/5] bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                                                <img
                                                    src={isHovered && productImages.length > 1
                                                        ? productImages[hoveredImageIndex % productImages.length]
                                                        : productImages[0]}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                                                />

                                                {/* Premium Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                                {/* Enhanced Image Navigation */}
                                                {isHovered && productImages.length > 1 && (
                                                    <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setHoveredImageIndex(prev =>
                                                                    prev > 0 ? prev - 1 : productImages.length - 1
                                                                );
                                                            }}
                                                            className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 flex items-center justify-center"
                                                        >
                                                            <ChevronLeft className="w-6 h-6 text-slate-700" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setHoveredImageIndex(prev =>
                                                                    (prev + 1) % productImages.length
                                                                );
                                                            }}
                                                            className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 flex items-center justify-center"
                                                        >
                                                            <ChevronRight className="w-6 h-6 text-slate-700" />
                                                        </button>
                                                    </div>
                                                )}

                                                {/* Enhanced Quick Actions */}
                                                <div className="absolute top-4 right-4 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                                                    <button
                                                        onClick={() => toggleWishlist(product._id)}
                                                        className={`w-12 h-12 rounded-full backdrop-blur-sm shadow-lg transition-all duration-300 flex items-center justify-center hover:scale-110 ${isWishlisted[product._id]
                                                            ? 'bg-red-500 text-white'
                                                            : 'bg-white/90 text-slate-700 hover:bg-white'
                                                            }`}
                                                    >
                                                        <Heart className={`w-5 h-5 ${isWishlisted[product._id] ? 'fill-current' : ''}`} />
                                                    </button>
                                                    <button
                                                        onClick={() => setQuickViewProduct(product)}
                                                        className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg transition-all duration-300 hover:bg-white hover:scale-110 flex items-center justify-center"
                                                    >
                                                        <Eye className="w-5 h-5 text-slate-700" />
                                                    </button>
                                                    <button className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg transition-all duration-300 hover:bg-white hover:scale-110 flex items-center justify-center">
                                                        <Share2 className="w-5 h-5 text-slate-700" />
                                                    </button>
                                                </div>

                                                {/* Enhanced Stock Badges */}
                                                {product.stock.quantity <= product.stock.low_stock_threshold && product.stock.quantity > 0 && (
                                                    <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-3 py-2 rounded-full font-medium shadow-lg">
                                                        <div className="flex items-center gap-1">
                                                            <Zap className="w-3 h-3" />
                                                            Low Stock
                                                        </div>
                                                    </div>
                                                )}
                                                {product.stock.quantity === 0 && (
                                                    <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-2 rounded-full font-medium shadow-lg">
                                                        <div className="flex items-center gap-1">
                                                            <X className="w-3 h-3" />
                                                            Out of Stock
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Enhanced Image Counter */}
                                                {productImages.length > 1 && (
                                                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-full font-medium">
                                                        {isHovered ? `${hoveredImageIndex + 1}/${productImages.length}` : `1/${productImages.length}`}
                                                    </div>
                                                )}

                                                {/* Premium Badge */}
                                                {product.ratings.average >= 4.5 && (
                                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs px-3 py-2 rounded-full font-medium shadow-lg">
                                                        <div className="flex items-center gap-1">
                                                            <Crown className="w-3 h-3" />
                                                            Premium
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Enhanced Product Info */}
                                            <div className="p-4">
                                                {/* Brand and Badges */}
                                                <div className="flex items-center justify-between mb-3">
                                                    {product.brand && (
                                                        <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                                                            {product.brand}
                                                        </span>
                                                    )}
                                                    <div className="flex items-center gap-1">
                                                        {product.ratings.average >= 4.5 && (
                                                            <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                                                                <Star className="w-3 h-3 text-white fill-current" />
                                                            </div>
                                                        )}
                                                        {product.stock.quantity > 50 && (
                                                            <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                                                                <TrendingUp className="w-3 h-3 text-white" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Title */}
                                                <Link href={`/product/${product.slug}`} className="block mb-2">
                                                    <h3 className="font-semibold text-slate-900 text-base line-clamp-2 hover:text-blue-600 transition-colors group-hover:text-blue-600">
                                                        {product.name}
                                                    </h3>
                                                </Link>

                                                {/* Enhanced Rating */}
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="flex items-center gap-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-4 h-4 ${i < Math.floor(product.ratings.average)
                                                                    ? 'text-yellow-400 fill-current'
                                                                    : 'text-slate-300'
                                                                    }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-sm text-slate-600 font-medium">
                                                        {product.ratings.average.toFixed(1)} ({product.ratings.count})
                                                    </span>
                                                </div>

                                                {/* Enhanced Price */}
                                                <div className="flex items-baseline gap-3 mb-4">
                                                    <span className="text-2xl font-bold text-slate-900">
                                                        ₹{product.price.toLocaleString()}
                                                    </span>
                                                    {product.GST && (
                                                        <span className="text-sm text-slate-500">+{product.GST}% GST</span>
                                                    )}
                                                </div>

                                                {/* Enhanced Size Options */}
                                                {product.variants.length > 0 && product.variants.some(v => v.sizes.length > 0) && (
                                                    <div className="mb-4">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <Target className="w-4 h-4 text-green-600" />
                                                            <span className="text-sm font-medium text-slate-700">Available Sizes:</span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {Array.from(new Set(
                                                                product.variants.flatMap(v => v.sizes.map(s => s.size))
                                                            )).slice(0, 6).map((size) => (
                                                                <span
                                                                    key={size}
                                                                    className="px-3 py-2 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 text-sm rounded-xl border border-slate-200 font-medium hover:from-slate-200 hover:to-slate-300 transition-all duration-300 cursor-pointer"
                                                                >
                                                                    {size}
                                                                </span>
                                                            ))}
                                                            {Array.from(new Set(
                                                                product.variants.flatMap(v => v.sizes.map(s => s.size))
                                                            )).length > 6 && (
                                                                    <span className="px-3 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-sm rounded-xl border border-blue-200 font-medium">
                                                                        +{Array.from(new Set(
                                                                            product.variants.flatMap(v => v.sizes.map(s => s.size))
                                                                        )).length - 6}
                                                                    </span>
                                                                )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Enhanced Variants Preview */}
                                                {product.variants.length > 0 && (
                                                    <div className="mb-4">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <Sparkle className="w-4 h-4 text-purple-600" />
                                                            <span className="text-sm font-medium text-slate-700">Colors:</span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            {product.variants.slice(0, 5).map((variant) => (
                                                                <div
                                                                    key={variant.id}
                                                                    className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
                                                                    style={{ backgroundColor: variant.color.toLowerCase() }}
                                                                    title={variant.color}
                                                                />
                                                            ))}
                                                            {product.variants.length > 5 && (
                                                                <div className="w-8 h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                                                                    <span className="text-xs text-slate-600 font-bold">
                                                                        +{product.variants.length - 5}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Enhanced Action Buttons */}
                                                <div className="flex gap-3">
                                                    <button
                                                        disabled={product.stock.quantity === 0}
                                                        className="flex-1 bg-gradient-to-r from-slate-800 to-slate-900 text-white py-3 px-4 rounded-xl font-semibold hover:from-slate-700 hover:to-slate-800 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
                                                    >
                                                        <ShoppingCart className="w-5 h-5" />
                                                        {product.stock.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                                                    </button>
                                                    <button
                                                        onClick={() => setQuickViewProduct(product)}
                                                        className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 flex items-center justify-center shadow-lg"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <div className="w-32 h-32 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-8">
                                    <Package className="w-16 h-16 text-slate-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">No products found</h3>
                                <p className="text-slate-600 mb-8 max-w-md mx-auto">Try adjusting your filters or search criteria to find what you're looking for.</p>
                                <button
                                    onClick={clearFilters}
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}

                        {/* Enhanced Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-16 flex items-center justify-center">
                                <div className="flex items-center gap-3 bg-white/90 backdrop-blur-xl rounded-2xl p-2 shadow-xl border border-white/20">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="w-12 h-12 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-md"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-12 h-12 rounded-xl font-semibold transition-all duration-300 ${currentPage === page
                                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-110'
                                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:scale-105'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="w-12 h-12 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-md"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Back to Top Button */}
            {
                showBackToTop && (
                    <button
                        onClick={scrollToTop}
                        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 z-50 flex items-center justify-center"
                    >
                        <ArrowUp className="w-6 h-6" />
                    </button>
                )
            }

            {/* Custom Scrollbar Styles */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </div >
    );
};

