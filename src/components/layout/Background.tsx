export const Background = () => {
  return (
    <div
      className="fixed left-0 top-0 -z-50 h-screen w-full overflow-hidden"
      aria-hidden="true"
    >
      {/* Base color */}
      <div className="absolute inset-0 bg-background" />

      {/* Dot grid */}
      <div className="absolute inset-0 bg-[radial-gradient(hsl(var(--foreground)/0.07)_1px,transparent_1px)] [background-size:20px_20px]" />

      {/* Radial vignette */}
      <div className="absolute inset-0 bg-background [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,transparent,black)]" />

      {/* Animated blobs */}
      <div className="absolute inset-0">
        <div
          className="absolute right-0 top-0 h-[600px] w-[600px] -translate-x-[20%] translate-y-[10%] rounded-full opacity-50 blur-[130px]"
          style={{
            background: 'radial-gradient(circle farthest-side, hsl(var(--primary)/0.35), transparent)',
            animation: 'blobFloat1 18s ease-in-out infinite',
          }}
        />
        <div
          className="absolute bottom-0 left-1/4 h-[500px] w-[500px] -translate-y-[5%] rounded-full opacity-40 blur-[120px]"
          style={{
            background: 'radial-gradient(circle farthest-side, hsl(var(--accent)/0.3), transparent)',
            animation: 'blobFloat2 22s ease-in-out infinite',
          }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 h-[450px] w-[450px] rounded-full opacity-35 blur-[140px]"
          style={{
            background: 'radial-gradient(circle farthest-side, hsl(188 85% 53% / 0.2), transparent)',
            animation: 'blobFloat3 26s ease-in-out infinite',
          }}
        />
      </div>

      {/* Grain texture overlay */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.035] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      <style>{`
        @keyframes blobFloat1 {
          0%, 100% { transform: translate(-20%, 10%) scale(1); }
          33% { transform: translate(-15%, 15%) scale(1.08); }
          66% { transform: translate(-25%, 5%) scale(0.95); }
        }
        @keyframes blobFloat2 {
          0%, 100% { transform: translateY(-5%) scale(1); }
          40% { transform: translateY(-10%) scale(1.1) translateX(3%); }
          70% { transform: translateY(0%) scale(0.93) translateX(-2%); }
        }
        @keyframes blobFloat3 {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.12) translate(4%, -6%); }
        }
      `}</style>
    </div>
  );
};
