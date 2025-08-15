// src/components/ProfessionalCarousel.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProfessionalCarousel({ items, renderItem }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % items.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [items.length, isAutoPlaying]);

    const goToSlide = (index) => {
        setCurrentIndex(index);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 5000);
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 5000);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 5000);
    };

    return (
        <div className="relative w-full max-w-6xl mx-auto">
            {/* Main Carousel Container */}
            <div className="relative overflow-hidden">
                <div className="flex items-center justify-center min-h-[400px] px-4">
                    {items.map((item, index) => {
                        const offset = index - currentIndex;
                        const isCenter = offset === 0;
                        const isAdjacent = Math.abs(offset) === 1;
                        const isVisible = Math.abs(offset) <= 2;

                        if (!isVisible) return null;

                        return (
                            <motion.div
                                key={index}
                                className="absolute"
                                initial={false}
                                animate={{
                                    x: `${offset * 280}px`,
                                    scale: isCenter ? 1 : isAdjacent ? 0.8 : 0.6,
                                    opacity: isCenter ? 1 : isAdjacent ? 0.7 : 0.4,
                                    zIndex: isCenter ? 10 : isAdjacent ? 5 : 1,
                                }}
                                transition={{
                                    duration: 0.5,
                                    ease: [0.25, 0.46, 0.45, 0.94]
                                }}
                                onClick={() => !isCenter && goToSlide(index)}
                                style={{ cursor: !isCenter ? 'pointer' : 'default' }}
                            >
                                <motion.div
                                    whileHover={!isCenter ? { scale: 0.85 } : {}}
                                    transition={{ duration: 0.2 }}
                                >
                                    {renderItem(item, isCenter)}
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-gray-200/80 dark:bg-white/10 backdrop-blur-md border border-gray-300/50 dark:border-white/20 rounded-full flex items-center justify-center text-gray-800 dark:text-white hover:bg-gray-300/80 dark:hover:bg-white/20 transition-all duration-300 z-20"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>

            <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-gray-200/80 dark:bg-white/10 backdrop-blur-md border border-gray-300/50 dark:border-white/20 rounded-full flex items-center justify-center text-gray-800 dark:text-white hover:bg-gray-300/80 dark:hover:bg-white/20 transition-all duration-300 z-20"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center space-x-2 mt-8">
                {items.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === currentIndex
                                ? "bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 scale-125"
                                : "bg-white/30 hover:bg-white/50"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}
