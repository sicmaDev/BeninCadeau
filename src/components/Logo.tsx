import Link from 'next/link';

export function Logo({
  size = 80,
  withLink = true,
}: {
  size?: number;
  withLink?: boolean;
}) {
  const img = (
    <img
      src="/1-19.png"
      alt="Bénin Cadeau"
      style={{ width: size, height: size }}
      className="object-contain"
    />
  );

  if (!withLink) return img;
  return (
    <Link href="/" className="inline-block">
      {img}
    </Link>
  );
}
