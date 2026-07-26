'use client';

import Script from 'next/script';

export default function AgileAIWidget() {
  return (
    <>
      <div id="agile-ai-widget"></div>
      {/* non-blocking stylesheet load — this is a floating overlay widget, not core content,
          so a moment of unstyled DOM before it swaps to screen media is an acceptable trade
          for not blocking render on every page (Lighthouse: render-blocking requests, ~510ms) */}
      <link
        rel="stylesheet"
        href="/widget.css"
        media="print"
        onLoad={(e) => { (e.currentTarget as HTMLLinkElement).media = 'all' }}
      />
      <Script 
        src="/widget.js" 
        strategy="afterInteractive" 
        onLoad={() => {
          // @ts-ignore
          if (window.AgileWidget) {
            // @ts-ignore
            window.AgileWidget.init({
              apiUrl: '/api/chat',
              title: 'Agile AI Support',
              themeColor: '#0052CC'
            });
          }
        }} 
      />
    </>
  );
}
