'use client';

import dynamic from 'next/dynamic';
import ChatWidget from './ChatWidget';

const OTCommandDesk = dynamic(() => import('./OTCommandDesk'), { 
  ssr: false 
});

export default function ClientSideWidgets() {
  return (
    <>
      <ChatWidget />
      <OTCommandDesk />
    </>
  );
}
