export const Background = () => {
  return (
    <div
      className="fixed left-0 top-0 -z-50 h-screen w-full"
      aria-hidden="true"
    >
      <div className="absolute inset-0 -z-30 h-full w-full bg-background bg-[radial-gradient(hsl(var(--foreground)/0.1)_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      <div className="absolute -z-20 h-full w-full bg-background [mask-image:radial-gradient(ellipse_100%_100%_at_50%_50%,black,transparent)]"></div>

      <div className="absolute inset-0 -z-10 h-full w-full">
        <div
          className="
            absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] 
            -translate-x-[30%] translate-y-[20%] rounded-full 
            bg-[radial-gradient(circle_farthest-side,hsl(var(--primary)/0.3),rgba(255,255,255,0))] 
            opacity-70 blur-[120px]
          "
        ></div>
        <div
          className="
            absolute bottom-0 right-auto top-auto left-1/4 h-[500px] w-[500px]
             -translate-y-[10%] rounded-full
            bg-[radial-gradient(circle_farthest-side,hsl(var(--accent)/0.3),rgba(255,255,255,0))] 
            opacity-60 blur-[120px]
          "
        ></div>
        <div
          className="
            absolute bottom-1/2 right-1/4 h-[500px] w-[500px]
            -translate-y-[10%] rounded-full
            bg-[radial-gradient(circle_farthest-side,hsl(188_85%_53%/0.2),rgba(255,255,255,0))] 
            opacity-70 blur-[140px]
          "
        ></div>
      </div>
    </div>
  );
};
