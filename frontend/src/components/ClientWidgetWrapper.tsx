"use client";

import dynamic from 'next/dynamic';

const ClientSideWidgets = dynamic(() => import('./ClientSideWidgets'), { ssr: false });
const AgileAIWidget = dynamic(() => import('./AgileAIWidget'), { ssr: false });

export default function ClientWidgetWrapper() {
  return (
    <>
      <ClientSideWidgets />
      <AgileAIWidget />
    </>
  );
}
