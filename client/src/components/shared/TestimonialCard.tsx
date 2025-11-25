import { motion } from "framer-motion";
import Image from "next/image";
import { IconQuote } from "@tabler/icons-react";
import { StarRating } from "@/components/shared/StarRating";

interface TestimonialCardProps {
  name: string;
  role: string;
  rating: number;
  text: string;
  flavor: string;
  avatar?: string;
  delay?: number;
  className?: string;
}

export function TestimonialCard({
  name,
  role,
  rating,
  text,
  flavor,
  avatar,
  delay = 0,
  className = "",
}: TestimonialCardProps) {
  // Generate avatar initials if no avatar provided
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <motion.div
      className={`bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/60 hover:shadow-xl transition-all duration-300 ${className}`}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay,
        type: "spring",
        stiffness: 100,
      }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <div className="flex items-center mb-6">
        <div className="relative w-14 h-14 mr-4">
          {avatar ? (
            <Image
              src={avatar}
              alt={name}
              fill
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {getInitials(name)}
            </div>
          )}
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-slate-900 text-lg">{name}</h4>
          <p className="text-sm text-slate-600">{role}</p>
        </div>
        <StarRating rating={rating} />
      </div>

      <div className="relative">
        <IconQuote size={24} className="text-red-200 absolute -top-2 -left-2" />
        <p className="text-slate-700 leading-relaxed text-lg italic pl-6">
          &ldquo;{text}&rdquo;
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <span className="text-sm font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full">
          Loves: {flavor}
        </span>
      </div>
    </motion.div>
  );
}
