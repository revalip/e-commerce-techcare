import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Apple-style scroll reveal:
 * opacity 0 -> 1, y 24 -> 0, 0.7s, cubic-bezier(0.25, 0.1, 0.25, 1), once: true.
 */
export default function Reveal({
  children,
  delay = 0,
  duration = 0.7,
  y = 24,
  className = ''
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-48px' }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
