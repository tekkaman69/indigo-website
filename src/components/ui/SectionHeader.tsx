import Balancer from 'react-wrap-balancer';

interface SectionHeaderProps {
  title: string;
  description: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
};

export function SectionHeader({ title, description, maxWidth = '2xl' }: SectionHeaderProps) {
  return (
    <div className={`text-center ${maxWidthClasses[maxWidth]} mx-auto mb-12`}>
      <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">{title}</h2>
      <p className="mt-4 text-muted-foreground">
        <Balancer>{description}</Balancer>
      </p>
    </div>
  );
}
