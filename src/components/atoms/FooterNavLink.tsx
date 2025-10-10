import { Separator } from '@/components/ui/separator';
import { SOCIAL_LINKS } from '@/constants/app-links';

interface FooterNavLinkProps {
  href: string;
  index: number;
  label: string;
}

export const FooterNavLink = ({ href, index, label }: FooterNavLinkProps) => {
  const isLast = index === SOCIAL_LINKS.length - 1;

  return (
    <li className="flex items-center">
      <a
        href={href}
        className="text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}>
        {label}
      </a>

      {!isLast && (
        <Separator
          orientation="vertical"
          className="h-3 mx-3"
          aria-hidden="true"
          role="presentation"
        />
      )}
    </li>
  );
};
