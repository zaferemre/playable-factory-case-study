"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { IconStar, IconStarFilled, IconQuote } from "@tabler/icons-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: "Alex Chen",
      role: "Pro Gamer",
      rating: 5,
      text: "This cereal is literally my power-up breakfast! The crunch is perfect and it actually keeps me energized during long gaming sessions.",
      flavor: "Choco Splash",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Mom of 3 Gamers",
      rating: 5,
      text: "Finally found a cereal that my kids are excited about AND I feel good giving them. The vitamin content is impressive and they love the gaming theme.",
      flavor: "Fruity Loops",
    },
    {
      id: 3,
      name: "Marcus Rivera",
      role: "Streamer",
      rating: 5,
      text: "Been featuring this on my morning streams and chat goes CRAZY for it! The taste is incredible and the brand really gets gaming culture.",
      flavor: "Both Flavors",
    },
  ];

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) =>
      index < rating ? (
        <IconStarFilled key={index} size={16} className="text-yellow-400" />
      ) : (
        <IconStar key={index} size={16} className="text-gray-300" />
      )
    );
  };

  return (
    <section className="py-12 lg:py-16 bg-slate-50 relative">
      {/* Very minimal background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-32 h-32 bg-red-100 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-orange-100 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <IconStarFilled size={16} />
            Player Reviews
          </motion.div>

          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 mb-4">
            What Our
            <span className="text-red-600 ml-3">Community Says</span>
          </h2>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Join thousands of satisfied gamers, families, and cereal enthusiasts
            who have leveled up their breakfast game with Playable Crunch.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="group relative"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              viewport={{ once: true }}
            >
              <div
                className="h-full p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl 
              transition-all duration-300 border border-slate-100 group-hover:border-slate-200
              group-hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Quote icon background */}
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <IconQuote size={32} className="text-red-500" />
                </div>

                {/* Header with avatar and info */}
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-12 h-12 bg-gradient-to-br from-red-400 to-orange-500 rounded-full 
                  flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                  >
                    {testimonial.name[0]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 truncate">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-slate-500 truncate">
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {renderStars(testimonial.rating)}
                  <span className="text-sm text-slate-500 ml-2">
                    {testimonial.rating}.0
                  </span>
                </div>

                {/* Testimonial text */}
                <p className="text-slate-700 text-sm leading-relaxed mb-4 overflow-hidden max-h-20">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                {/* Favorite flavor badge */}
                <div
                  className="inline-flex items-center px-3 py-1 bg-red-50 text-red-700 
                rounded-full text-xs font-medium"
                >
                  Loves: {testimonial.flavor}
                </div>

                {/* Hover gradient overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-5 
                bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl transition-opacity duration-300"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {[
            {
              label: "Happy Customers",
              value: "50,000+",
              color: "text-red-600",
            },
            {
              label: "Average Rating",
              value: "4.9/5",
              color: "text-yellow-600",
            },
            { label: "Countries Served", value: "25+", color: "text-blue-600" },
            { label: "Boxes Sold", value: "1M+", color: "text-green-600" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              viewport={{ once: true }}
            >
              <div
                className={`text-2xl lg:text-3xl font-bold ${stat.color} mb-2`}
              >
                {stat.value}
              </div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-slate-600 mb-6">
            Join our growing community of breakfast gamers
          </p>
          <motion.a
            href="/shop"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 
            text-white font-semibold rounded-full hover:from-red-500 hover:to-red-400 
            transition-all duration-300 shadow-lg hover:shadow-red-500/25 gap-2"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <IconStarFilled size={20} />
            Start Your Journey
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
