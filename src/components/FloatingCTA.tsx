import Link from 'next/link';
import { YellowButton } from './YellowButton';
import { cn } from '@/utils/cn';

interface FloatingCTAProps {
  title: string;
  buttonText: string;
  buttonLink: string;
  className?: string;
  imageSrc?: string;
}

export function FloatingCTA({
  title,
  buttonText,
  buttonLink,
  className,
  imageSrc,
}: FloatingCTAProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-[58px] shadow-card p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto',
        className
      )}>
      <div className="flex items-center gap-8">
        {imageSrc && (
          <img
            src={imageSrc}
            alt="Gift illustration"
            className="w-24 h-24 object-contain hidden md:block"
          />
        )}
        <h2 className="font-instrument font-medium text-2xl md:text-3xl text-bc-navyDark max-w-sm text-center md:text-left whitespace-pre-line">
          {title}
        </h2>
      </div>
      <Link href={buttonLink}>
        <YellowButton>{buttonText}</YellowButton>
      </Link>
    </div>
  );
}
