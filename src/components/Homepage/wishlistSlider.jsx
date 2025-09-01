'use client';

import React, { useState, useEffect } from 'react';

const products = [
    {
        title: 'Peach Linen Printed Saree With Authentic ...',
        price: '₹2,995',
        image: '/video/video-1.mp4',
    },
    {
        title: 'White Georgette Chikankari Embroidered ...',
        price: '₹15,995',
        image: '/video/video-2.mp4',
    },
    {
        title: 'Black Georgette Banarasi Kurta Set With ...',
        price: '₹10,995',
        image: '/video/video-5.mp4',
    },
    {
        title: 'Pink Chinon Anarkali Suit With Cutdana ...',
        price: '₹9,995',
        image: '/video/video-3.mp4',
    },
    {
        title: 'Black Georgette Banarasi Kurta Set With ...',
        price: '₹10,995',
        image: '/video/video-2.mp4',
    },
    {
        title: 'Black Georgette Banarasi Kurta Set With ...',
        price: '₹10,995',
        image: '/video/video-1.mp4',
    },
];

export default function WishlistCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsToShow, setItemsToShow] = useState(4); // Default for larger screens

    // Handle responsive behavior
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setItemsToShow(1); // Mobile
            } else if (window.innerWidth < 768) {
                setItemsToShow(2); // Tablet
            } else if (window.innerWidth < 1024) {
                setItemsToShow(3); // Small desktop
            } else {
                setItemsToShow(4); // Large screens
            }
        };

        handleResize(); // Set initial value
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex >= products.length - itemsToShow ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex <= 0 ? products.length - itemsToShow : prevIndex - 1
        );
    };

    // Calculate which products to show based on current index
    const visibleProducts = products.slice(currentIndex, currentIndex + itemsToShow);

    // If we're at the end and don't have enough products to fill the carousel
    if (visibleProducts.length < itemsToShow) {
        const remaining = itemsToShow - visibleProducts.length;
        visibleProducts.push(...products.slice(0, remaining));
    }

    return (
        <section className="py-12 bg-gray-50 relative">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                Most Wishlisted Styles
            </h2>

            <div className="relative px-4 md:px-12 overflow-hidden">
                {/* Navigation Buttons */}
                <button
                    onClick={prevSlide}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all"
                    aria-label="Previous products"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <button
                    onClick={nextSlide}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all"
                    aria-label="Next products"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                {/* Carousel Container */}
                <div className="flex transition-transform duration-300 ease-in-out">
                    {visibleProducts.map((product, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2"
                        >
                            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                {/* Fixed aspect ratio container */}
                                <div className="relative w-full aspect-[3/4] overflow-hidden rounded-t-lg">
                                    <video
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        preload="metadata"
                                        className="w-full h-full object-cover"
                                        aria-label={`${product.title} product video`}
                                    >
                                        <source src={`${product.image}`} type="video/mp4" />
                                        <p>Your browser does not support the video tag.</p>
                                    </video>
                                </div>
                                <div className="p-4">
                                    <p className="text-sm font-medium text-gray-700 truncate">{product.title}</p>
                                    <p className="text-sm font-semibold mt-1 text-gray-900">{product.price}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Indicator Dots */}
                <div className="flex justify-center mt-6 space-x-2">
                    {Array.from({ length: Math.ceil(products.length / itemsToShow) }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index * itemsToShow)}
                            className={`w-3 h-3 rounded-full ${currentIndex >= index * itemsToShow && currentIndex < (index + 1) * itemsToShow
                                ? 'bg-gray-800'
                                : 'bg-gray-300'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}