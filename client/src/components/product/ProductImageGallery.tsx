import { motion, AnimatePresence } from "motion/react";
import {
  IconChevronLeft,
  IconChevronRight,
  IconPackage,
} from "@tabler/icons-react";
import { useState } from "react";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  activeImageIndex: number;
  onPrevImage: () => void;
  onNextImage: () => void;
  onSelectImage: (index: number) => void;
}

export default function ProductImageGallery({
  images,
  productName,
  activeImageIndex,
  onPrevImage,
  onNextImage,
  onSelectImage,
}: ProductImageGalleryProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const activeImage = images[activeImageIndex];

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative group">
        <div className="aspect-square relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl">
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-16 h-16 bg-red-100 rounded-full blur-2xl opacity-60"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 bg-orange-100 rounded-full blur-xl opacity-40"></div>

          {activeImage ? (
            <img
              src={activeImage}
              alt={productName}
              className="relative z-10 h-full w-full object-contain p-8"
              onLoad={() => setImageLoading(false)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <IconPackage size={64} className="text-slate-300" />
            </div>
          )}

          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            </div>
          )}

          {/* Navigation arrows */}
          {images.length > 1 && (
            <AnimatePresence>
              <motion.button
                type="button"
                onClick={onPrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg text-slate-700 hover:bg-white hover:shadow-xl transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <IconChevronLeft size={20} stroke={2} />
              </motion.button>
              <motion.button
                type="button"
                onClick={onNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg text-slate-700 hover:bg-white hover:shadow-xl transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <IconChevronRight size={20} stroke={2} />
              </motion.button>
            </AnimatePresence>
          )}

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
              {activeImageIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail gallery */}
        {images.length > 1 && (
          <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
            {images.map((src, idx) => (
              <motion.button
                key={src + idx}
                type="button"
                onClick={() => onSelectImage(idx)}
                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${
                  idx === activeImageIndex
                    ? "border-red-400 shadow-lg"
                    : "border-slate-200 hover:border-slate-300"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={src}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  className="h-full w-full object-contain p-2 bg-white"
                />
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
