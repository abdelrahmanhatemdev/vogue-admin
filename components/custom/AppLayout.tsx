"use client";
import { memo, ReactNode } from "react";
import { motion } from "framer-motion";

function AppLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0}}
        animate={{ opacity: 1}}
        transition={{ duration: 1 }}
      >
        <div className="
        w-[95vw] xs:w-[90vw] xl:w-[70vw] 
        start-[2.5vw] xs:start-[5vw] xl:start-[15vw] 
        fixed h-[95vh] top-[2.5vh]
        rounded-lg bg-neutral-100 dark:bg-neutral-900 mx-auto 
        overflow-y-auto scrollbar-hide pt-16 md:pt-0">
           {children}
        </div>
      </motion.div>
    </>
  );
}

export default memo(AppLayout)
