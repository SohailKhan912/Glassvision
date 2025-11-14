"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Play, Shield, Award, TrendingUp, X } from "lucide-react";
import { useEffect, useState } from "react";

export function HeroSection() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [ytLoaded, setYtLoaded] = useState(false);
  const [useIframe, setUseIframe] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // Probe if local file exists; if not, fallback to YouTube
    fetch("/media/hero.mp4", { method: "HEAD" })
      .then((res) => {
        if (!res.ok && !cancelled) setUseIframe(true);
      })
      .catch(() => !cancelled && setUseIframe(true));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden bg-gradient-to-br from-white via-teal-50 to-white">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(20,184,166,0.08),transparent_50%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* LEFT CONTENT */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 animate-pulse-subtle">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">Next-Gen Glass Solutions</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-balance">
                Experience Your Perfect Glass Doors
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Visualize, customize, and book premium glass doors with cutting-edge AR/VR technology.
                Transform your space with precision-engineered solutions.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/customize">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
                >
                  Start Customizing
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/catalog">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent hover:bg-muted">
                  View Catalog
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
              <div className="space-y-1">
                <p className="text-3xl font-bold text-primary">2,500+</p>
                <p className="text-sm text-muted-foreground">Happy Customers</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-primary">24hrs</p>
                <p className="text-sm text-muted-foreground">Fast Delivery</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-primary">99.8%</p>
                <p className="text-sm text-muted-foreground">Satisfaction</p>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-primary" />
                <span>5-Year Warranty</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Award className="w-4 h-4 text-primary" />
                <span>ISO Certified</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span>Industry Leader</span>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT — LOCAL VIDEO WITH SAME FRAME (no internet lag) */}
          <div className="relative h-96 md:h-[600px] rounded-2xl overflow-hidden group shadow-2xl border border-border bg-black/90">
            <div className="relative w-full h-full overflow-hidden rounded-2xl mask-gradient">
              {/* Background image for immediate paint */}
              <img
                src="/premium-modern-glass-door-entrance-with-ar-visuali.jpg"
                alt="Glass Door Showcase"
                className="absolute top-[-15%] left-[-10%] w-[120%] h-[130%] object-cover rounded-2xl"
                style={{ transform: "scale(1.6)", objectPosition: "center center" }}
              />
              {/* Local video or YouTube fallback, same crop/frame */}
              {!useIframe ? (
                <video
                  key="hero-video"
                  className="absolute top-[-15%] left-[-10%] w-[120%] h-[130%] object-cover rounded-2xl"
                  style={{ transform: "scale(1.6)", objectPosition: "center center" }}
                  src="/media/hero.mp4"
                  poster="/premium-modern-glass-door-entrance-with-ar-visuali.jpg"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  onPlay={() => setIsVideoPlaying(true)}
                  onPause={() => setIsVideoPlaying(false)}
                  onError={() => setUseIframe(true)}
                />
              ) : (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${process.env.NEXT_PUBLIC_YT_ID || "btYbp8mk9Ho"}?autoplay=1&mute=1&loop=1&playlist=${process.env.NEXT_PUBLIC_YT_ID || "btYbp8mk9Ho"}&controls=0&modestbranding=1&showinfo=0&rel=0&fs=0&iv_load_policy=3&disablekb=1&playsinline=1`}
                  title="Glass Door Showcase"
                  frameBorder="0"
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  className="absolute top-[-15%] left-[-10%] w-[120%] h-[130%] object-cover rounded-2xl"
                  style={{ transform: "scale(1.6)", objectPosition: "center center", pointerEvents: "none" }}
                  onLoad={() => { setYtLoaded(true); setIsVideoPlaying(true); }}
                />
              )}

              {/* Shimmer effect */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-[-120%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/15 to-transparent animate-[shimmer_6s_infinite]" />
              </div>

              {/* Optional pause button (keeps frame unchanged) */}
              <button
                onClick={() => setIsVideoPlaying(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-black/80 transition-all duration-300 z-10"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Floating feature cards — always visible */}
            <div className="absolute bottom-6 left-6 right-6 flex gap-3">
              <div className="flex-1 bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                <p className="text-xs text-muted-foreground mb-1">AR Preview</p>
                <p className="text-sm font-semibold">See in Your Space</p>
              </div>
              <div className="flex-1 bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                <p className="text-xs text-muted-foreground mb-1">3D Customize</p>
                <p className="text-sm font-semibold">Real-Time Design</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(200%);
          }
          100% {
            transform: translateX(200%);
          }
        }

        .mask-gradient {
          mask-image: linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%);
        }
      `}</style>
    </section>
  );
}
