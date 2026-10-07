export default function HeroBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {/* dot grid, faded toward the edges */}
      <div
        className="absolute inset-0 opacity-[0.4] dark:opacity-[0.25]"
        style={{
          backgroundImage:
            "radial-gradient(color-mix(in oklch, var(--foreground) 35%, transparent) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 20%, black 40%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 20%, black 40%, transparent 85%)",
        }}
      />

      {/* ambient glow blobs */}
      <div
        className="animate-blob-a absolute -top-24 right-[8%] size-[420px] rounded-full blur-3xl"
        style={{ background: "oklch(0.6 0.16 290 / 0.22)" }}
      />
      <div
        className="animate-blob-b absolute top-10 left-[5%] size-[360px] rounded-full blur-3xl"
        style={{ background: "oklch(0.7 0.14 230 / 0.18)" }}
      />
    </div>
  );
}
