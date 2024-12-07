"use client"
import { ReactNode } from "react";
import { motion } from "framer-motion";

export default function MainLayout({
  children,
}: Readonly<{ children: ReactNode }>) {

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-[90vw] xs:w-[60vw] xs:min-w-[400px] md:w-[95vw] lg:fixed start-[2.5vw] lg:w-[70vw] lg:start-[15vw] lg:h-[95vh] lg:top-[2.5vh] rounded-lg bg-main-100 mx-auto overflow-y-hidden">
          {children}
        </div>
      </motion.div>
    </>
  );
}
