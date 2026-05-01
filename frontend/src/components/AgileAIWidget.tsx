'use client';

import Script from 'next/script';

export default function AgileAIWidget() {
  return (
    <>
      <div id="agile-ai-widget"></div>
      <link rel="stylesheet" href="/widget.css" />
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
