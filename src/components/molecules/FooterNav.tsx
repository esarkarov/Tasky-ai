import { SOCIAL_LINKS } from '@/constants/links';
import { FooterNavLink } from '../atoms/FooterNavLink';

export const FooterNav = () => {
  return (
    <nav aria-label="Social media links">
      <ul className="flex flex-wrap items-center">
        {SOCIAL_LINKS.map(({ href, label }, index) => (
          <FooterNavLink
            key={href}
            href={href}
            label={label}
            index={index}
          />
        ))}
      </ul>
    </nav>
  );
};
