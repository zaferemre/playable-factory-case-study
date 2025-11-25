import { motion } from "framer-motion";
import Image from "next/image";
import { FlavorCard } from "./FlavorCard";

interface Flavor {
  key: string;
  image: string;
  grainImage: string;
  name: string;
  description: string;
  restScale: number;
  popScale: number;
}

interface FlavorDisplayProps {
  currentFlavor: Flavor;
  isLiked: boolean;
  onToggleLike: () => void;
  isMobile?: boolean;
}

export function FlavorDisplay({
  currentFlavor,
  isLiked,
  onToggleLike,
  isMobile = false,
}: FlavorDisplayProps) {
  const startScale = 0.05;

  if (isMobile) {
    return (
      <div className="px-4 pb-28 space-y-3">
        {/* Mobile cereal image */}
        <div className="flex justify-center mb-8">
          <motion.div
            key={currentFlavor.key + "-mobile"}
            initial={{ scale: startScale, y: 40 }}
            animate={{
              scale: [
                startScale,
                currentFlavor.popScale * 0.7,
                currentFlavor.restScale * 0.7,
              ],
              y: [40, -5, 0],
            }}
            transition={{
              duration: 1.2,
              times: [0, 0.6, 1],
              ease: [0.22, 0.61, 0.36, 1],
            }}
            className="relative"
            style={{
              width: "280px",
              height: "280px",
            }}
          >
            <Image
              src={currentFlavor.image}
              alt={currentFlavor.name}
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </motion.div>
        </div>

        {/* Mobile flavor info */}
        <motion.div
          className="text-center"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <motion.div
            key={currentFlavor.key + "-mobile-info"}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-white/60 mx-auto max-w-xs"
          >
            <p className="text-lg font-bold text-slate-900 mb-1">
              {currentFlavor.name}
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              {currentFlavor.description}
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Main cereal image */}
      <div className="pointer-events-none absolute inset-0 z-10 hidden lg:flex items-center justify-center">
        <motion.div
          key={currentFlavor.key}
          initial={{ scale: startScale, y: 40 }}
          animate={{
            scale: [
              startScale,
              currentFlavor.popScale,
              currentFlavor.restScale,
            ],
            y: [40, -10, 0],
          }}
          transition={{
            duration: 1.4,
            times: [0, 0.6, 1],
            ease: [0.22, 0.61, 0.36, 1],
          }}
          className="relative"
          style={{
            width: "420px",
            height: "420px",
          }}
        >
          <Image
            src={currentFlavor.image}
            alt={currentFlavor.name}
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </motion.div>
      </div>

      {/* Desktop flavor card */}
      <div className="hidden lg:flex relative z-20 h-full w-full flex-row items-center justify-end px-20 xl:px-40 -mt-8">
        <FlavorCard
          name={currentFlavor.name}
          description={currentFlavor.description}
          grainImage={currentFlavor.grainImage}
          isLiked={isLiked}
          onToggleLike={onToggleLike}
          className="mr-0"
        />
      </div>
    </>
  );
}
