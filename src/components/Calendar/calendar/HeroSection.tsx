import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CalendarMonth } from '../../../types';
import { pageVariants } from '../../../hooks/useCalendar';

interface HeroSectionProps {
  monthKey: string;
  monthInfo: CalendarMonth;
  direction: number;
}

export function HeroSection({ monthKey, monthInfo, direction }: HeroSectionProps) {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.section
        key={monthKey}
        custom={direction}
        variants={pageVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          rotateX: { type: 'spring', stiffness: 150, damping: 25 },
          opacity: { duration: 0.3 },
          scale:   { duration: 0.4 },
        }}
        className="relative w-full h-[180px] sm:h-[250px] lg:h-[400px] bg-outline/10 mb-6 sm:mb-8 lg:mb-16 overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl shadow-black/5"
        style={{ transformOrigin: 'center top', perspective: '1200px' }}
      >
        <img
          src={monthInfo.heroImage}
          alt={monthInfo.heroTitle}
          className="w-full h-full object-cover opacity-90 transition-transform duration-1000 hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface/40 to-transparent" />
        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 lg:bottom-12 lg:left-12">
          <span className="text-[7px] sm:text-[8px] lg:text-[10px] uppercase tracking-[0.3em] text-on-surface-variant mb-1 sm:mb-2 block">
            {monthInfo.heroSubtitle}
          </span>
          <h3 className="serif-italic text-2xl sm:text-3xl lg:text-6xl text-on-surface tracking-tighter">
            {monthInfo.heroTitle}
          </h3>
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
