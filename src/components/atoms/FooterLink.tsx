import { Separator } from '@/components/ui/separator';
import { SOCIAL_LINKS } from '@/constants/links';

interface FooterLinkProps {
  href: string;
  index: number;
  label: string;
}

export const FooterLink = ({ href, index, label }: FooterLinkProps) => {
  return (
    <li className="flex items-center">
      <a
        href={href}
        className="text-sm text-muted-foreground hover:text-foreground"
        target="_blank">
        {label}
      </a>

      {index !== SOCIAL_LINKS.length - 1 && (
        <Separator
          orientation="vertical"
          className="h-3 mx-3"
        />
      )}
    </li>
  );
};
