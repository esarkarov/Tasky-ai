import { FooterNav } from '@/components/molecules/FooterNav';

export const Footer = () => {
  return (
    <footer
      className="px-4 pb-0"
      role="contentinfo">
      <div className="container flex min-h-20 flex-col items-center gap-4 rounded-t-2xl border border-b-0 border-white/10 bg-background/70 backdrop-blur-2xl py-8 shadow-[0_-8px_32px_rgba(0,0,0,0.12)] lg:flex-row lg:justify-between lg:gap-6">
        <p
          className="text-center text-sm text-muted-foreground/80"
          aria-label="Copyright notice">
          &copy; All rights reserved.
        </p>
        <FooterNav />
      </div>
    </footer>
  );
};
