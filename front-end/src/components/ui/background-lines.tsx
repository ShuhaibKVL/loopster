"use client";
import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";
import React from "react";

export const BackgroundLines = ({
  children,
  className,
  svgOptions,
}: {
  children: React.ReactNode;
  className?: string;
  svgOptions?: {
    duration?: number;
  };
}) => {
  return (
    <div
      className={cn(
        "h-[20rem] md:h-screen w-full bg-[var(--secondary-bg)]",
        className
      )}
    >
      <SVG svgOptions={svgOptions} />
      {children}
    </div>
  );
};

const pathVariants = {
  initial: { strokeDashoffset: 800, strokeDasharray: "50 800" },
  animate: {
    strokeDashoffset: 0,
    strokeDasharray: "20 800",
    opacity: [0, 1, 1, 0],
  },
};

const SVG = ({
  svgOptions,
}: {
  svgOptions?: {
    duration?: number;
  };
}) => {
  // Social media inspired paths - representing connections, networks, and communication
  const paths = [
    // Network connection lines
    "M100 500C200 300, 300 700, 400 500",
    "M500 400C600 600, 700 200, 800 400",
    "M900 500C1000 300, 1100 700, 1200 500",
    
    // Interaction paths
    "M150 600C250 400, 350 800, 450 600",
    "M550 500C650 700, 750 300, 850 500",
    "M1050 600C1150 400, 1250 800, 1350 600",
    
    // Curved communication lines
    "M200 700C300 500, 400 900, 500 700",
    "M700 600C800 800, 900 400, 1000 600",
    "M1200 700C1300 500, 1400 900, 1500 700",
    
    // Diagonal network links
    "M50 800C150 600, 250 1000, 350 800",
    "M650 900C750 700, 850 1100, 950 900",
    "M1150 800C1250 600, 1350 1000, 1450 800"
  ];

  // Social media inspired color palette
  const colors = [
    "#3B5998",   // Facebook blue
    "#1DA1F2",   // Twitter blue
    "#C13584",   // Instagram pink/purple
    "#FF5A5F",   // Airbnb coral
    "#0077B5",   // LinkedIn blue
    "#6441A5",   // Twitch purple
    "#FF4500",   // Reddit orange-red
    "#1DB954",   // Spotify green
    "#00B900",   // LINE green
    "#25D366"    // WhatsApp green
  ];

  return (
    <motion.svg
      viewBox="0 0 1500 1000"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="absolute inset-0 w-full h-full"
    >
      {paths.map((path, idx) => (
        <motion.path
          d={path}
          stroke={colors[idx % colors.length]}
          strokeWidth="3"
          strokeLinecap="round"
          variants={pathVariants}
          initial="initial"
          animate="animate"
          transition={{
            duration: svgOptions?.duration || 10,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
            delay: Math.floor(Math.random() * 10),
            repeatDelay: Math.floor(Math.random() * 10 + 2),
          }}
          key={`path-first-${idx}`}
          opacity={0.7}
        />
      ))}

      {/* Duplicate paths for layered effect */}
      {paths.map((path, idx) => (
        <motion.path
          d={path}
          stroke={colors[idx % colors.length]}
          strokeWidth="3"
          strokeLinecap="round"
          variants={pathVariants}
          initial="initial"
          animate="animate"
          transition={{
            duration: svgOptions?.duration || 10,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
            delay: Math.floor(Math.random() * 10),
            repeatDelay: Math.floor(Math.random() * 10 + 2),
          }}
          key={`path-second-${idx}`}
          opacity={0.4}
        />
      ))}
    </motion.svg>
  );
};