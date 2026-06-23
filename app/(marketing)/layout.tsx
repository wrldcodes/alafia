import type { Metadata } from "next";
import { metadataBase } from "@/lib/site";
import { VideoBackground } from "@/components/marketing/VideoPosterBg";
import { Navbar } from "@/components/marketing/Navbar";

export const metadata: Metadata = {
  metadataBase,
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="relative min-h-screen">
        <VideoBackground
          src="/hero-desktop.mp4"
          webmSrc="/hero-desktop.webm"
          mobileSrc="/hero-mobile.mp4"
          mobileWebmSrc="/hero-mobile.webm"
          poster="/hero-poster.jpg"
          mobilePoster="/hero-poster-mobile.jpg"
          overlay="bg-black/35"
        />
        <Navbar />
        <div className="relative z-20">{children}</div>
      </div>

      {/* Sections below the hero sit outside the video wrapper */}
    </>
  );
}
