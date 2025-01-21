export function LoadingDots() {
  return (
    <div className="inline-flex gap-1">
      <div className="w-1.5 h-1.5 rounded-full bg-facebook-light-text-secondary dark:bg-facebook-dark-text-secondary animate-[bounce_1s_infinite]"></div>
      <div className="w-1.5 h-1.5 rounded-full bg-facebook-light-text-secondary dark:bg-facebook-dark-text-secondary animate-[bounce_1s_infinite_0.2s]"></div>
      <div className="w-1.5 h-1.5 rounded-full bg-facebook-light-text-secondary dark:bg-facebook-dark-text-secondary animate-[bounce_1s_infinite_0.4s]"></div>
    </div>
  );
}