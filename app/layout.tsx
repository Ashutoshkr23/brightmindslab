import type { Metadata, Viewport } from "next";
//import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ Theme color for mobile browser
export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "Bright Minds Lab",
  description: "A Next.js PWA App",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
  icons: {
    apple: "/logoo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Your custom script added right after <head> starts 
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(d,z,s){
                s.src='https://'+d+'/401/'+z;
                try{
                  (document.body || document.documentElement).appendChild(s)
                }catch(e){}
              })('groleegni.net',9412753,document.createElement('script'));
            `,
          }}
        />*/
        }
        

        {/* ✅ Other meta and link tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        {/*
         <Script
          src="//pl26836988.profitableratecpm.com/7b/78/8b/7b788b30a4dc41deb218d49c03e8003f.js"
          strategy="lazyOnload"
        />*/}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2423736220466613"
     crossOrigin="anonymous"></script>
        {/*
         
        */}
        
        
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
          {/* <script type='text/javascript' src='//pl26878204.profitableratecpm.com/bc/d4/89/bcd489d0515736de627f9815fe198cc3.js'></script>*/}
       
      </body>
    </html>
  );
}

