'use client';

import { useRouter } from 'next/navigation';

export default function Footer() {
  const router = useRouter();

  return (
    <footer className="bg-gray-100/80 dark:bg-white/5 backdrop-blur-lg border-t border-gray-200 dark:border-white/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Logo and Description */}
          <div className="text-center md:text-left">
            <button
              onClick={() => router.push('/')}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity mx-auto md:mx-0"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                <span className="font-black">ROGER<span className="text-[#85ea10]">BOX</span></span>
              </h3>
            </button>
            <p className="text-gray-600 dark:text-white/60 mb-4 mt-2">
              Transforma tu cuerpo, transforma tu vida
            </p>
            <p className="text-sm text-gray-500 dark:text-white/50">
              © 2024 RogerBox. Todos los derechos reservados.
            </p>
          </div>

          {/* Social Media */}
          <div className="text-center md:text-right">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Síguenos en Redes Sociales
            </h4>
            <div className="flex justify-center md:justify-end space-x-4">
              <a
                href="https://instagram.com/rogerbox"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-[#85ea10] rounded-full flex items-center justify-center text-black hover:bg-[#7dd30f] hover:scale-110 transition-all duration-300 shadow-lg"
                title="Instagram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.928-.875-1.418-2.026-1.418-3.323s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244z"/>
                </svg>
              </a>
              
              <a
                href="https://youtube.com/@rogerbox"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-[#85ea10] rounded-full flex items-center justify-center text-black hover:bg-[#7dd30f] hover:scale-110 transition-all duration-300 shadow-lg"
                title="YouTube"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              
              <a
                href="https://tiktok.com/@rogerbox"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-[#85ea10] rounded-full flex items-center justify-center text-black hover:bg-[#7dd30f] hover:scale-110 transition-all duration-300 shadow-lg"
                title="TikTok"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.03.38.1.76.29 1.1.13.26.33.49.56.66.12.1.25.18.38.25.1.05.2.09.31.12.4.12.81.16 1.22.11.57-.07 1.09-.33 1.52-.68.28-.23.51-.5.7-.8.22-.35.35-.75.39-1.16.07-.8.06-1.6.06-2.4.01-1.59.01-3.18 0-4.77-.01-.5-.06-1-.18-1.48-.1-.4-.25-.78-.45-1.13-.2-.35-.45-.67-.74-.95-.29-.28-.62-.51-.98-.69-.36-.18-.74-.32-1.13-.42-.4-.1-.81-.16-1.22-.18-.41-.02-.82-.01-1.23.01z"/>
                </svg>
              </a>
              
              <a
                href="https://linkedin.com/company/rogerbox"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-[#85ea10] rounded-full flex items-center justify-center text-black hover:bg-[#7dd30f] hover:scale-110 transition-all duration-300 shadow-lg"
                title="LinkedIn"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
