"use client";

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform, animate } from 'framer-motion';

interface StatsCounterProps {
  value: number;
  label: string;
  suffix?: string;
}

export default function StatsCounter({ value, label, suffix = "" }: StatsCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 2,
      onUpdate(value) {
        setDisplayValue(Math.floor(value));
      },
    });
    return () => controls.stop();
  }, [value]);

  return (
    <div className="flex flex-col items-center">
      <div className="text-4xl md:text-6xl font-black text-primary mb-2 flex items-center">
        {displayValue}
        <span className="text-2xl md:text-3xl ml-1 opacity-80">{suffix}</span>
      </div>
      <div className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-black text-muted-foreground opacity-60">
        {label}
      </div>
    </div>
  );
}
