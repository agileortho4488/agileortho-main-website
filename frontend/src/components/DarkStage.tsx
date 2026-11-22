import type { ReactNode } from 'react';

/**
 * The device stage on a dark hero: a soft light ring that breathes once, an optional floor shadow, the device on top.
 * The maroon light comes from the section behind it (.dk). Size the stage with className; the ring sizes itself.
 */
export default function DarkStage({ className = '', floor = false, children }: { className?: string; floor?: boolean; children: ReactNode }) {
  return (
    <div className={`stg ${className}`}>
      <div className="stg-ring" aria-hidden="true" />
      {floor && <div className="stg-floor" aria-hidden="true" />}
      {children}
    </div>
  );
}
