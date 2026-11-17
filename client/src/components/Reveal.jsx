import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Komponen Reveal animasi scroll
 * Menghormati prefers-reduced-motion
 * Animasi fade + translate Y 24px, 500ms, ease-out
 */
export default function Reveal({
  children,
  delay = 0,
  duration = 0.5,
  y = 24,
  className = '',
  cascade = false
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.25, 0.1, 0.25, 1.0]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
