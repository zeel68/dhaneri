"use client";

import { STORE_ID } from '@/data/Consts';
import ApiClient from '@/utils/apiCalling';
import React, { useState, useEffect, useRef, use } from 'react';
import { Heart, Share2, Star, Truck, Shield, RotateCcw, Minus, Plus, ShoppingCart, Eye, ChevronLeft, ChevronRight, Package, Award, Clock, Users, MessageCircle, ChevronDown, Info, X, MapPin, Phone, Mail, Copy, Check, ArrowRight, Crown, Gift, TrendingUp, Verified, CreditCard, ShieldCheck, Search, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface ProductPageProps {
    params: {
        slug: string;
    };
}

interface SizeOption {
    _id: string;
    size: string;
    stock: number;
    priceModifier: number;
    sku: string;
    attributes: Record<string, any>;
}

interface Variant {
    _id: string;
    color: string;
    images: string[];
    sizes: SizeOption[];
    price: number;
    sku: string;
    stock_quantity: number;
}

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    store_id: {
        _id: string;
        name: string;
        id: string;
    };
    slug: string;
    variants: Variant[];
    images: string[];
    is_active: boolean;
    tags: string[];
    availableTags: string[];
    reviews: any[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    GST: string | null;
    HSNCode: string;
    brand: string;
    sku: string;
    ratings: {
        average: number;
        count: number;
    };
    stock: {
        quantity: number;
        track_inventory: boolean;
        low_stock_threshold: number;
        allow_backorder: boolean;
        reserved: number;
    };
}

const ProductDetailsPage = ({ params }: ProductPageProps) => {
    const { slug } = use(params);
    const apiClient = new ApiClient();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
    const [selectedSize, setSelectedSize] = useState<SizeOption | null>(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [activeTab, setActiveTab] = useState('description');
    const [showFullscreen, setShowFullscreen] = useState(false);
    const [showSizeGuide, setShowSizeGuide] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [copied, setCopied] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isZoomed, setIsZoomed] = useState(false);
    const imageRef = useRef<HTMLDivElement>(null);
    const { addToCart, loading: cartLoading, error: cartError } = useCartStore();

    // Calculate final price based on base price and size modifier
    const finalPrice = selectedSize
        ? product.price + selectedSize.priceModifier
        : product?.price || 0;
    const relatedProducts = [
        {
            id: 1,
            name: 'Buttons tweed blazer',
            price: 59.0,
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
            isNew: true
        },
        {
            id: 2,
            name: 'Flowy striped skirt',
            price: 49.0,
            image: 'https://images.unsplash.com/photo-1583496661160-fb5886a13d76?w=300&h=400&fit=crop'
        },
        {
            id: 3,
            name: 'Cotton T-Shirt',
            price: 59.0,
            image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop',
            outOfStock: true
        },
        {
            id: 4,
            name: 'Slim striped pocket shirt',
            price: 59.0,
            image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=400&fit=crop'
        }
    ];
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get(`storefront/store/${STORE_ID}/products/${slug}`) as any;
                const productData = response.data.data.product;

                setProduct(productData);
                if (productData.variants && productData.variants.length > 0) {
                    setSelectedVariant(productData.variants[0]);
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                setError("Failed to load product. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchProduct();
        }
    }, [slug]);

    const handleQuantityInput = (value: number) => {
        const newValue = Math.max(1, Math.min(10, value));
        setQuantity(newValue);
    };

    const handleAddToCart = async () => {
        if (!product || !selectedVariant) return;

        console.log(product._id);
        await addToCart(
            product._id,
            quantity,
            selectedVariant._id,
            selectedSize?._id
        );


        if (!cartError) {
            router.push("/cart");
        }
    };

    const handleColorChange = (variant: Variant) => {
        setSelectedVariant(variant);
        setSelectedImageIndex(0);
        setSelectedSize(null);
    };

    const handleQuantityChange = (change: number) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && newQuantity <= 10) {
            setQuantity(newQuantity);
        }
    };

    const nextImage = () => {
        const currentImages = selectedVariant?.images?.length > 0 ? selectedVariant.images : product?.images || [];
        if (currentImages.length > 0) {
            setSelectedImageIndex((prev) => (prev + 1) % currentImages.length);
        }
    };

    const prevImage = () => {
        const currentImages = selectedVariant?.images?.length > 0 ? selectedVariant.images : product?.images || [];
        if (currentImages.length > 0) {
            setSelectedImageIndex((prev) => (prev - 1 + currentImages.length) % currentImages.length);
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (imageRef.current && isZoomed) {
            const rect = imageRef.current.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            setMousePos({ x, y });
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
                    <p className="text-gray-600">{error || "The product you're looking for doesn't exist."}</p>
                </div>
            </div>
        );
    }

    const currentImages = selectedVariant?.images?.length > 0 ? selectedVariant.images : product.images;

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Product Images */}
                    <div className="space-y-6">
                        {/* Main Image */}
                        <div className="relative group">
                            <div
                                className="aspect-square bg-white rounded-2xl overflow-hidden border border-slate-200 relative cursor-crosshair"
                                onMouseMove={handleMouseMove}
                                onMouseEnter={() => setIsZoomed(true)}
                                onMouseLeave={() => setIsZoomed(false)}
                                ref={imageRef}
                            >
                                <img
                                    src={currentImages[selectedImageIndex]}
                                    alt={product.name}
                                    className={`w-full h-full object-cover transition-all duration-500 ${isZoomed ? 'scale-150' : 'scale-100 group-hover:scale-105'
                                        }`}
                                    style={isZoomed ? {
                                        transformOrigin: `${mousePos.x}% ${mousePos.y}%`
                                    } : {}}
                                />

                                {/* Navigation */}
                                {currentImages.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 flex items-center justify-center"
                                        >
                                            <ChevronLeft className="w-5 h-5 text-slate-700" />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 flex items-center justify-center"
                                        >
                                            <ChevronRight className="w-5 h-5 text-slate-700" />
                                        </button>
                                    </>
                                )}

                                {/* Action Buttons */}
                                <div className="absolute top-4 right-4 flex flex-col gap-2">
                                    <button
                                        onClick={() => setIsWishlisted(!isWishlisted)}
                                        className={`w-10 h-10 rounded-full backdrop-blur-sm shadow-lg transition-all duration-300 flex items-center justify-center ${isWishlisted
                                            ? 'bg-red-500 text-white'
                                            : 'bg-white/90 text-slate-700 hover:bg-white hover:scale-110'
                                            }`}
                                    >
                                        <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                                    </button>
                                    <button
                                        onClick={() => setShowFullscreen(true)}
                                        className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg transition-all duration-300 hover:bg-white hover:scale-110 flex items-center justify-center"
                                    >
                                        <Eye className="w-5 h-5 text-slate-700" />
                                    </button>
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowShare(!showShare)}
                                            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg transition-all duration-300 hover:bg-white hover:scale-110 flex items-center justify-center"
                                        >
                                            <Share2 className="w-5 h-5 text-slate-700" />
                                        </button>
                                        {showShare && (
                                            <div className="absolute right-12 top-0 bg-white rounded-xl shadow-xl border border-slate-200 p-3 min-w-[160px] z-50">
                                                <div className="space-y-2">
                                                    <button
                                                        onClick={copyToClipboard}
                                                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors text-sm"
                                                    >
                                                        {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                                                        <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Image Indicators */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                    {currentImages.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImageIndex(index)}
                                            className={`transition-all duration-300 rounded-full ${selectedImageIndex === index
                                                ? 'bg-slate-800 w-6 h-2'
                                                : 'bg-slate-400 hover:bg-slate-600 w-2 h-2'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Thumbnail Grid */}
                        <div className="grid grid-cols-4 gap-3">
                            {currentImages.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={`aspect-square rounded-xl overflow-hidden transition-all duration-300 ${selectedImageIndex === index
                                        ? 'ring-2 ring-slate-800 ring-offset-2 shadow-lg'
                                        : 'hover:shadow-md'
                                        }`}
                                >
                                    <img src={image} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Information */}
                    <div className="space-y-6">
                        <div>
                            {/* Brand */}
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-slate-800 text-white px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wider">
                                    {product.brand || "Dhaneri"}
                                </span>
                                <div className="flex items-center gap-1 text-green-700 bg-green-50 px-2 py-1 rounded-full">
                                    <Verified className="w-4 h-4" />
                                    <span className="text-sm font-medium">Verified</span>
                                </div>
                            </div>

                            {/* Title */}
                            <h1 className="text-2xl font-bold text-slate-900 mb-2">{product.name}</h1>
                            <p className="text-slate-600">{product.description || "No description available"}</p>
                        </div>

                        {/* Rating */}
                        <div >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-5 h-5 ${i < Math.floor(product.ratings.average)
                                                    ? 'text-amber-400 fill-current'
                                                    : 'text-slate-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="font-semibold text-slate-900">{product.ratings.average.toFixed(1)}</span>
                                    <span className="text-slate-600 text-xs">({product.ratings.count} reviews)</span>
                                </div>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div >
                            <div className="text-xl  flex items-baseline gap-4">
                                <span className="text-3xl font-bold text-red-700 ">₹{finalPrice.toLocaleString()}</span>
                                <span className="text-xl font-bold text-gray-400 line-through  ">₹{finalPrice.toLocaleString()}</span>

                                {/* {selectedSize && selectedSize.priceModifier > 0 && (
                                    <span className="text-sm text-slate-500">
                                        (Base: ₹{product.price.toLocaleString()} + Size: ₹{selectedSize.priceModifier.toLocaleString()})
                                    </span>
                                )} */}
                            </div>
                            <div className="text-sm text-slate-600">Inclusive of all taxes</div>
                        </div>

                        {/* Color Selection */}
                        {product.variants && product.variants.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-slate-900 mb-4">
                                    Color: <span className="text-slate-600">{selectedVariant?.color}</span>
                                </h3>
                                <div className="m-3">
                                    {product.variants.map((variant) => (
                                        <button
                                            key={variant._id}
                                            onClick={() => handleColorChange(variant)}
                                            className={`px-2   transition-all duration-300 ${selectedVariant?._id === variant._id
                                                ? 'border-slate-800 bg-slate-50'
                                                : 'border-slate-200 hover:border-slate-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-6 h-6 rounded-full border border-slate-300"
                                                    style={{ backgroundColor: variant.color.toLowerCase() }}
                                                />
                                                {/* <span className="font-medium text-sm text-slate-900">{variant.color}</span> */}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size Selection */}
                        {selectedVariant?.sizes && selectedVariant.sizes.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-slate-900">Size</h3>
                                    <button
                                        onClick={() => setShowSizeGuide(true)}
                                        className="text-slate-600 text-sm hover:text-slate-900 flex items-center gap-1"
                                    >
                                        <Info className="w-4 h-4" />
                                        Size Guide
                                    </button>
                                </div>
                                <div className="grid grid-cols-5 gap-2 mb-3">
                                    {selectedVariant.sizes.map((sizeOption) => (
                                        <button
                                            key={sizeOption._id}
                                            onClick={() => setSelectedSize(sizeOption)}
                                            disabled={sizeOption.stock === 0}
                                            className={` border-2 rounded-lg font-semibold transition-all duration-300 text-center ${selectedSize?._id === sizeOption._id
                                                ? 'border-slate-800 bg-slate-800 text-white'
                                                : sizeOption.stock === 0
                                                    ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                                                    : 'border-slate-300 text-slate-700 hover:border-slate-400'
                                                }`}
                                        >
                                            {sizeOption.size}
                                            {sizeOption.stock === 0 && (
                                                <div className="text-xs text-red-600 mt-1">Sold Out</div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                                {selectedSize && (
                                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                                        <div className="text-sm text-blue-900">
                                            <strong>Size {selectedSize.size}:</strong>
                                            {selectedSize.stock <= 10 && (
                                                <span className="text-red-700 font-semibold ml-2">
                                                    Only {selectedSize.stock} left in stock
                                                </span>
                                            )}
                                            {selectedSize.stock > 10 && (
                                                <span className="text-green-700 font-semibold ml-2">
                                                    In stock ({selectedSize.stock} available)
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Quantity */}
                        <div>
                            <h3 className="font-semibold text-slate-900 mb-4">Quantity</h3>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border-2 border-slate-300 rounded-2xl shadow-sm overflow-hidden">
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        disabled={quantity <= 1}
                                        className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>

                                    <input
                                        type="number"
                                        min={1}
                                        max={10}
                                        value={quantity}
                                        onChange={(e) => handleQuantityInput(Number(e.target.value))}
                                        className="w-16 text-center font-bold text-lg outline-none border-x-2 border-slate-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />

                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        disabled={quantity >= 10}
                                        className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={!selectedVariant || (selectedVariant.sizes.length > 0 && !selectedSize)}
                                className="w-full bg-slate-800 text-white py-3 px-6 rounded-xl font-semibold hover:bg-slate-900 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                <span>{cartLoading ? "Adding..." : "Add to Cart"}</span>
                            </button>

                            <button className="w-full bg-slate-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-slate-700 transition-all duration-300 flex items-center justify-center gap-3">
                                <span>Buy Now</span>
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl">
                            <div className="text-center">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Truck className="w-5 h-5 text-green-700" />
                                </div>
                                <p className="font-semibold text-slate-900 text-sm">Free Delivery</p>
                                <p className="text-xs text-slate-600">On orders above ₹499</p>
                            </div>
                            <div className="text-center">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <RotateCcw className="w-5 h-5 text-blue-700" />
                                </div>
                                <p className="font-semibold text-slate-900 text-sm">Easy Returns</p>
                                <p className="text-xs text-slate-600">7 days return policy</p>
                            </div>
                            <div className="text-center">
                                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Shield className="w-5 h-5 text-amber-700" />
                                </div>
                                <p className="font-semibold text-slate-900 text-sm">100% Authentic</p>
                                <p className="text-xs text-slate-600">Verified quality</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Details Tabs */}
                <div className="mt-12 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="border-b border-slate-200">
                        <nav className="flex overflow-x-auto">
                            {[
                                { id: 'description', label: 'Product Details', icon: Info },
                                { id: 'specifications', label: 'Specifications', icon: Award },
                                { id: 'reviews', label: 'Reviews', icon: Star },
                                { id: 'shipping', label: 'Shipping & Returns', icon: Truck }
                            ].map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id)}
                                    className={`flex items-center gap-2 py-4 px-6 font-semibold transition-all duration-300 whitespace-nowrap ${activeTab === id
                                        ? 'text-slate-900 border-b-2 border-slate-800 bg-slate-50'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-6">
                        {activeTab === 'description' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-4">Product Description</h3>
                                    <p className="text-slate-700 leading-relaxed">
                                        {product.description || "No detailed description available for this product."}
                                    </p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'specifications' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-slate-900">Product Specifications</h3>

                                <div className="bg-slate-50 rounded-xl p-5">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            {[
                                                { label: 'Product Code', value: product.sku || 'N/A' },
                                                { label: 'Brand', value: product.brand || 'N/A' },
                                                { label: 'HSN Code', value: product.HSNCode || 'N/A' },
                                                { label: 'GST Rate', value: product.GST ? `${product.GST}%` : 'N/A' }
                                            ].map(({ label, value }) => (
                                                <div key={label} className="flex justify-between items-center py-2 border-b border-slate-200">
                                                    <span className="font-medium text-slate-900">{label}</span>
                                                    <span className="text-slate-600">{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="space-y-4">
                                            {[
                                                { label: 'Category', value: product.category || 'N/A' },
                                                { label: 'Store', value: product.store_id.name || 'N/A' },
                                                { label: 'Status', value: product.is_active ? 'Active' : 'Inactive' },
                                                { label: 'Added On', value: new Date(product.createdAt).toLocaleDateString() }
                                            ].map(({ label, value }) => (
                                                <div key={label} className="flex justify-between items-center py-2 border-b border-slate-200">
                                                    <span className="font-medium text-slate-900">{label}</span>
                                                    <span className="text-slate-600">{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-slate-900">Customer Reviews</h3>
                                    <button className="bg-slate-800 text-white px-4 py-2 rounded-lg font-semibold hover:bg-slate-900 transition-colors">
                                        Write a Review
                                    </button>
                                </div>

                                {/* Rating Overview */}
                                <div className="bg-amber-50 rounded-xl p-5">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="text-center">
                                            <div className="text-4xl font-bold text-slate-900 mb-3">{product.ratings.average.toFixed(1)}</div>
                                            <div className="flex items-center justify-center mb-3">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.ratings.average) ? 'text-amber-400 fill-current' : 'text-slate-300'}`} />
                                                ))}
                                            </div>
                                            <div className="text-slate-700 font-semibold">{product.ratings.count} total reviews</div>
                                        </div>
                                        {product.ratings.count > 0 && (
                                            <div className="space-y-2">
                                                {[5, 4, 3, 2, 1].map((rating) => {
                                                    const percentage = rating === 5 ? 75 : rating === 4 ? 18 : rating === 3 ? 5 : rating === 2 ? 1.5 : 0.5;
                                                    return (
                                                        <div key={rating} className="flex items-center gap-2">
                                                            <span className="font-semibold text-slate-900 w-6">{rating}</span>
                                                            <Star className="w-4 h-4 text-amber-400 fill-current" />
                                                            <div className="flex-1 bg-slate-200 rounded-full h-2">
                                                                <div
                                                                    className="bg-amber-400 h-2 rounded-full"
                                                                    style={{ width: `${percentage}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-slate-600 text-sm w-8">{percentage}%</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Sample Reviews */}
                                {product.ratings.count === 0 ? (
                                    <div className="text-center py-8">
                                        <Star className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                        <h4 className="text-lg font-semibold text-slate-700 mb-2">No reviews yet</h4>
                                        <p className="text-slate-500">Be the first to review this product!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {/* Sample review - in a real app, you would map through product.reviews */}
                                        <div className="bg-white rounded-xl p-5 border border-slate-200">
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white font-bold">
                                                    A
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h5 className="font-semibold text-slate-900">Anonymous Customer</h5>
                                                        <div className="flex items-center">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                                                            ))}
                                                        </div>
                                                        <span className="text-slate-500 text-sm">2 weeks ago</span>
                                                    </div>
                                                    <p className="text-slate-700">Great product quality and fast delivery. Would recommend!</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'shipping' && (
                            <div className="space-y-8">
                                <h3 className="text-xl font-bold text-slate-900">Shipping & Returns</h3>

                                <div className="grid lg:grid-cols-2 gap-6">
                                    <div className="bg-green-50 rounded-xl p-5">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-green-700 rounded-lg flex items-center justify-center">
                                                <Truck className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-green-900 mb-3">Delivery Options</h4>
                                                <ul className="space-y-2 text-green-800">
                                                    <li>• Free delivery on orders above ₹499</li>
                                                    <li>• Express delivery (1-2 days) - ₹99</li>
                                                    <li>• Standard delivery (3-5 days) - Free</li>
                                                    <li>• Same day delivery in select cities</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 rounded-xl p-5">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center">
                                                <RotateCcw className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-blue-900 mb-3">Returns Policy</h4>
                                                <ul className="space-y-2 text-blue-800">
                                                    <li>• 7-day return policy</li>
                                                    <li>• Free return pickup</li>
                                                    <li>• Instant refund processing</li>
                                                    <li>• Exchange available</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <motion.section
                    className="py-16 bg-gray-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.h2
                            className="text-2xl font-bold text-center mb-12 text-gray-900 tracking-wide"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.6 }}
                        >
                            RELATED PRODUCTS
                        </motion.h2>

                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                            // variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {relatedProducts.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    // variants={itemVariants}
                                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
                                    whileHover={{ y: -5 }}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.7 + index * 0.1 }}
                                >
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        {product.isNew && (
                                            <motion.span
                                                className="absolute top-3 left-3 bg-black text-white px-2 py-1 text-xs rounded font-medium"
                                                initial={{ scale: 0, rotate: -10 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                transition={{ delay: 1.8 + index * 0.1, type: 'spring' }}
                                            >
                                                New
                                            </motion.span>
                                        )}
                                        {product.outOfStock && (
                                            <motion.span
                                                className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-xs rounded font-medium"
                                                initial={{ scale: 0, rotate: -10 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                transition={{ delay: 1.8 + index * 0.1, type: 'spring' }}
                                            >
                                                out of stock
                                            </motion.span>
                                        )}
                                        <motion.div
                                            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        >
                                            {[Search, Heart, ShoppingBag].map((Icon, iconIndex) => (
                                                <motion.button
                                                    key={iconIndex}
                                                    className="text-white hover:text-gray-300 p-2 rounded-lg bg-white bg-opacity-20 backdrop-blur-sm transition-colors"
                                                    whileHover={{ scale: 1.15, y: -2 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: iconIndex * 0.1 }}
                                                >
                                                    <Icon className="w-5 h-5" />
                                                </motion.button>
                                            ))}
                                        </motion.div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-medium text-gray-900 mb-2 group-hover:text-black transition-colors">{product.name}</h3>
                                        <div className="flex text-yellow-400 mb-3">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 fill-current" />
                                            ))}
                                        </div>
                                        <p className="text-lg font-semibold text-gray-900">$ {product.price}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.section>
            </div>

            {/* Size Guide Modal */}
            {showSizeGuide && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="bg-slate-800 text-white p-5 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold">Size Guide</h2>
                                <p className="text-slate-300 mt-1">Find your perfect fit</p>
                            </div>
                            <button
                                onClick={() => setShowSizeGuide(false)}
                                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-5">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50">
                                            <th className="py-2 px-3 font-semibold text-slate-900">Size</th>
                                            <th className="py-2 px-3 font-semibold text-slate-900">Bust (inches)</th>
                                            <th className="py-2 px-3 font-semibold text-slate-900">Waist (inches)</th>
                                            <th className="py-2 px-3 font-semibold text-slate-900">Hip (inches)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { size: 'S', bust: '32-34', waist: '26-28', hip: '36-38' },
                                            { size: 'M', bust: '34-36', waist: '28-30', hip: '38-40' },
                                            { size: 'L', bust: '36-38', waist: '30-32', hip: '40-42' },
                                            { size: 'XL', bust: '38-40', waist: '32-34', hip: '42-44' },
                                            { size: 'XXL', bust: '40-42', waist: '34-36', hip: '44-46' }
                                        ].map((row) => (
                                            <tr key={row.size} className="border-b border-slate-200">
                                                <td className="py-2 px-3 font-semibold text-slate-800">{row.size}</td>
                                                <td className="py-2 px-3 text-slate-600">{row.bust}</td>
                                                <td className="py-2 px-3 text-slate-600">{row.waist}</td>
                                                <td className="py-2 px-3 text-slate-600">{row.hip}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Fullscreen Image Modal */}
            {showFullscreen && (
                <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
                    <div className="relative max-w-6xl max-h-full">
                        <img
                            src={currentImages[selectedImageIndex]}
                            alt={product.name}
                            className="max-w-full max-h-full object-contain rounded-xl"
                        />
                        <button
                            onClick={() => setShowFullscreen(false)}
                            className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full hover:bg-white/30 flex items-center justify-center transition-colors"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                        {currentImages.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 rounded-full hover:bg-white/30 flex items-center justify-center transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5 text-white" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 rounded-full hover:bg-white/30 flex items-center justify-center transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5 text-white" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetailsPage;