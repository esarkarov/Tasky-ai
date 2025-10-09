import { FooterNav } from '../molecules/FooterNav';

export const Footer = () => {
  return (
    <footer
      className="p-4 pb-0"
      role="contentinfo">
      <div className="container flex min-h-16 flex-col items-center gap-3 rounded-t-xl border border-b-0 bg-background py-4 lg:flex-row lg:justify-between">
        <p
          className="text-center text-sm"
          aria-label="Copyright notice">
          &copy; All rights reserved.
        </p>
        <FooterNav />
      </div>
    </footer>
  );
};
