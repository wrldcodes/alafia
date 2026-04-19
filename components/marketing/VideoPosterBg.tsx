"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface VideoBackgroundProps {
  // Desktop sources
  src: string;
  webmSrc?: string;
  // Mobile sources (served when viewport ≤ 768px)
  mobileSrc: string;
  mobileWebmSrc?: string;
  // Poster — ideally have one per breakpoint too
  poster: string;
  mobilePoster?: string;
  overlay?: string;
}

export function VideoBackground({
  src,
  webmSrc,
  mobileSrc,
  mobileWebmSrc,
  poster,
  mobilePoster,
  overlay = "bg-black/40",
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Re-evaluate sources after mount (browser picks correct <source media> on load)
    video.load();

    const onReady = () => setVideoReady(true);
    video.addEventListener("canplaythrough", onReady, { once: true });
    if (video.readyState >= 4) setVideoReady(true);

    return () => video.removeEventListener("canplaythrough", onReady);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-x-0 top-0 h-screen z-0 overflow-hidden"
    >
      <div className={cn("absolute inset-0 z-10", overlay)} />

      {/* Poster — browser picks the right one via <source> on the <picture> */}
      <picture
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
          videoReady ? "opacity-0" : "opacity-100",
        )}
      >
        {mobilePoster && (
          <source media="(max-width: 768px)" srcSet={mobilePoster} />
        )}
        <Image
          src={poster}
          alt=""
          fill
          quality={85}
          className="object-cover"
          sizes="100vw"
          loading="eager"
        />
      </picture>

      {/*
The browser evaluates <source media> attributes in order and picks
the first match — no JS, no flash, no hydration mismatch.
Mobile gets the vertical crop, desktop gets the wide shot.
*/}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
          videoReady ? "opacity-100" : "opacity-0",
        )}
      >
        {/* Mobile sources — matched first on narrow viewports */}
        {mobileWebmSrc && (
          <source
            media="(max-width: 768px)"
            src={mobileWebmSrc}
            type="video/webm"
          />
        )}
        <source media="(max-width: 768px)" src={mobileSrc} type="video/mp4" />

        {/* Desktop sources — fallback for wider viewports */}
        {webmSrc && <source src={webmSrc} type="video/webm" />}
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
