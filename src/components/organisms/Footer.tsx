import { SOCIAL_LINKS } from '@/constants/links';
import { FooterLink } from '../atoms/FooterLink';

export const Footer = () => {
  return (
    <footer
      className="p-4 pb-0"
      role="contentinfo">
      <div className="container flex min-h-16 flex-col items-center gap-3 rounded-t-xl border border-b-0 bg-background py-4 lg:flex-row lg:justify-between">
        <p
          className="text-center text-sm"
          aria-label="Copyright notice">
          &copy; 2025 ElvinWeb. All rights reserved.
        </p>

        <nav aria-label="Social media links">
          <ul className="flex flex-wrap items-center">
            {SOCIAL_LINKS.map(({ href, label }, index) => (
              <FooterLink
                key={href}
                href={href}
                label={label}
                index={index}
              />
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
};
