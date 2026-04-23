const StickyFooter = () => {
  return (
    <footer className="sticky bottom-0 z-50 bg-[#1a2c47] border-t border-white/20 font-montserrat">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-white text-sm">
            <span className="font-bold uppercase">ADRO MARKETING SPHERE</span>
            <span className="hidden sm:inline">|</span>
            <span>© Copyright 2025</span>
          </div>
          <div className="text-white text-xs sm:text-sm text-center sm:text-right">
            <span>Lucknow, Mumbai, London, Denver, Santiago, SaoPaulo</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default StickyFooter
