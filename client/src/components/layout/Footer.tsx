"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandFacebook,
  IconMail,
  IconPhone,
  IconMapPin,
  IconHeart,
  IconSparkles,
} from "@tabler/icons-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { name: "All Products", href: "/shop" },
      { name: "Cereal Collection", href: "/shop?category=cereal" },
      { name: "Gift Sets", href: "/shop?category=gifts" },
      { name: "New Arrivals", href: "/shop?filter=new" },
    ],
    customer: [
      { name: "My Account", href: "/profile" },
      { name: "Order Tracking", href: "/orders" },
      { name: "Shipping Info", href: "/shipping" },
      { name: "Returns", href: "/returns" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Our Story", href: "/story" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" },
    ],
    help: [
      { name: "FAQ", href: "/faq" },
      { name: "Contact Us", href: "/contact" },
      { name: "Size Guide", href: "/size-guide" },
      { name: "Support", href: "/support" },
    ],
  };

  const socialLinks = [
    {
      icon: IconBrandInstagram,
      href: "#",
      label: "Instagram",
      color: "hover:text-pink-500",
    },
    {
      icon: IconBrandTwitter,
      href: "#",
      label: "Twitter",
      color: "hover:text-blue-400",
    },
    {
      icon: IconBrandFacebook,
      href: "#",
      label: "Facebook",
      color: "hover:text-blue-600",
    },
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-red-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-orange-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-yellow-400 rounded-full blur-2xl"></div>
      </div>

      {/* Floating cereal pieces */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-br from-red-300 to-orange-400 rounded-full opacity-20"
            style={{
              left: `${10 + i * 12}%`,
              top: `${15 + (i % 4) * 20}%`,
            }}
            animate={{
              y: [0, -15, 0],
              rotate: [0, 180, 360],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 4 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Newsletter Section */}
        <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <motion.div
              className="text-center space-y-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <IconSparkles className="w-6 h-6 text-red-400" />
                <h3 className="text-2xl lg:text-3xl font-bold">
                  Stay Crunchy!
                </h3>
                <IconSparkles className="w-6 h-6 text-red-400" />
              </div>
              <p className="text-slate-300 max-w-2xl mx-auto text-sm lg:text-base">
                Get the latest updates on new flavors, special offers, and
                gaming-inspired cereal adventures. Plus, score 15% off your
                first order!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 
                  text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                />
                <motion.button
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold 
                  rounded-full hover:from-red-500 hover:to-red-400 transition-all duration-300 shadow-lg 
                  hover:shadow-red-500/25 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconMail size={18} />
                  Subscribe
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Link
                  href="/"
                  className="text-2xl font-bold text-white hover:text-red-400 transition-colors"
                >
                  Playable Crunch
                </Link>
                <p className="text-slate-300 mt-4 text-sm leading-relaxed">
                  The cereal that makes breakfast feel like a bonus level.
                  Crispy, crunchy, and packed with gaming-inspired fun in every
                  bowl.
                </p>
              </motion.div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <IconMapPin size={16} className="text-red-400" />
                  <span>123 Gaming Street, Crunch City, CC 12345</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <IconPhone size={16} className="text-red-400" />
                  <span>1-800-CRUNCH-1</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <IconMail size={16} className="text-red-400" />
                  <span>hello@playablecrunch.com</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-4">
                {socialLinks.map(({ icon: Icon, href, label, color }) => (
                  <motion.a
                    key={label}
                    href={href}
                    aria-label={label}
                    className={`p-2 bg-white/10 backdrop-blur-sm rounded-full text-slate-300 ${color} transition-all duration-300 hover:bg-white/20`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon size={20} />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Links Sections */}
            {Object.entries(footerLinks).map(([category, links], index) => (
              <motion.div
                key={category}
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h4 className="font-semibold text-white capitalize text-sm lg:text-base">
                  {category
                    .replace("customer", "Customer Care")
                    .replace("company", "Company")
                    .replace("help", "Help & Support")}
                </h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-slate-300 hover:text-red-400 transition-colors text-sm hover:translate-x-1 
                        transform duration-300 inline-block"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 bg-slate-900/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <motion.div
                className="flex items-center gap-2 text-sm text-slate-400"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <span>© {currentYear} Playable Crunch. Made with</span>
                <IconHeart size={14} className="text-red-400" />
                <span>for cereal lovers everywhere.</span>
              </motion.div>

              <div className="flex gap-6 text-sm">
                <Link
                  href="/privacy"
                  className="text-slate-400 hover:text-red-400 transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="text-slate-400 hover:text-red-400 transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/cookies"
                  className="text-slate-400 hover:text-red-400 transition-colors"
                >
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
