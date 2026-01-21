import { cn } from '@/lib/utils';
import Link from 'next/link';

type GradientButtonProps = {
  children: React.ReactNode;
  className?: string;
  href?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement>;

const GradientButton = ({
  children,
  className,
  href,
  ...props
}: GradientButtonProps) => {
  const commonClasses = cn(
    'relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white transition-all duration-300 rounded-lg group',
    className
  );

  const content = (
    <>
      <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-primary via-accent to-cyan-400 opacity-75 blur transition-all duration-300 group-hover:opacity-100 group-hover:blur-md"></div>
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary to-accent"></div>
      <span className="relative">{children}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={commonClasses} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button className={commonClasses} {...props}>
      {content}
    </button>
  );
};

export default GradientButton;
