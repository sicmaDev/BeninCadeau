export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-transparent px-4">
      <div className="relative w-14 h-14 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-accent animate-spin" />
        <img
          src="/1-19.png"
          alt="Chargement..."
          className="w-8 h-8 object-contain animate-pulse"
        />
      </div>
    </div>
  );
}
