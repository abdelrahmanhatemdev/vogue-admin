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
        w-[90%] md:w-[95vw] xl:w-[70vw] 
        start-[5%] xs:start-[5vw] xl:start-[15vw] 
        fixed h-[95vh] top-[2.5vh]
        rounded-lg bg-transparent md:bg-neutral-100 md:dark:bg-neutral-900 mx-auto 
        overflow-y-auto scrollbar-hide pt-16 md:pt-0">
           {children}
        </div>
      </motion.div>
    </>
  );
}

export default memo(AppLayout)
