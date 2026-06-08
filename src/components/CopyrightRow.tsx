export function CopyrightRow() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
      <p className="font-instrument text-lg md:text-xl text-black text-center md:text-left">
        © Copyright 2025. Powered by SICMA ET ASSOCIES
      </p>
      <img
        src="/18-185.png"
        alt="Social media icons"
        className="h-[40px] md:h-[50px] object-contain"
      />
    </div>
  );
}
