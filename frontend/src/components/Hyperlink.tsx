import {
  type AnchorHTMLAttributes,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';

// Named "Hyperlink" because "Link" and "Anchor" are being used.

// Extend a native <a>.
type HyperlinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  variant?: 'default' | 'title' | 'icon' | 'unstyled';
  className?: string;
  style?: CSSProperties;
  external?: boolean;
};

const linkStyles = tv({
  base: 'cursor-pointer transition-colors duration-200 ease-in-out',
  variants: {
    variant: {
      default: 'text-primary hover:underline hover:underline-offset-4',
      title: 'text-inherit hover:text-primary',
      icon: ' text-muted-foreground hover:text-primary',
      unstyled: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export default function Hyperlink({
  children,
  variant,
  className,
  style,
  external = false,
  href,
  ...props
}: HyperlinkProps) {
  const combinedClasses = twMerge(linkStyles({ variant }), className);

  // Props for external links.
  const externalLinkProps = external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};

  // Render <Link> or <a>.
  const Component = external ? 'a' : RouterLink;

  // If <Link>, use 'to'.
  const linkProps = {
    className: combinedClasses,
    style,
    ...externalLinkProps,
    ...(Component === RouterLink ? { to: href } : { href }),
    ...props,
  };

  return (
    // @ts-ignore - TS complains about type union but it works fine.
    <Component {...linkProps}>{children}</Component>
  );
}
