import React from 'react';
import { motion } from 'framer-motion';
import { FiWifiOff } from 'react-icons/fi';

export default function OfflineBanner() {
  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-[100] bg-red-500/90 backdrop-blur-sm text-white text-center py-2 px-4 text-sm font-medium flex items-center justify-center gap-2"
    >
      <FiWifiOff />
      You're offline — viewing cached content
    </motion.div>
  );
}
