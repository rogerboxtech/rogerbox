'use client';

import { useRouter } from 'next/navigation';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const router = useRouter();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <button
              onClick={() => router.push('/')}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity mb-4 mx-auto md:mx-0"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                <span className="font-black">ROGER<span className="text-[#85ea10]">BOX</span></span>
              </h3>
            </button>
            <p className="text-gray-600 dark:text-white/70 mb-4 text-sm leading-relaxed">
              Cambia tu mente, transforma tu cuerpo
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm text-gray-500 dark:text-white/60">
              <div className="flex items-center space-x-2 justify-center md:justify-start">
                <Mail className="w-4 h-4" />
                <span>contacto@rogerbox.com</span>
              </div>
              <div className="flex items-center space-x-2 justify-center md:justify-start">
                <Phone className="w-4 h-4" />
                <span>3005009487</span>
              </div>
              <div className="flex items-center space-x-2 justify-center md:justify-start">
                <MapPin className="w-4 h-4" />
                <span>Sincelejo, Colombia</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Síguenos
            </h4>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <a
                href="https://instagram.com/rogerbox"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#85ea10] rounded-full flex items-center justify-center text-black hover:bg-[#7dd30f] hover:scale-110 transition-all duration-300 shadow-md"
                title="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              
              <a
                href="https://youtube.com/@rogerbox"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#85ea10] rounded-full flex items-center justify-center text-black hover:bg-[#7dd30f] hover:scale-110 transition-all duration-300 shadow-md"
                title="YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              
              <a
                href="https://tiktok.com/@rogerbox"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#85ea10] rounded-full flex items-center justify-center text-black hover:bg-[#7dd30f] hover:scale-110 transition-all duration-300 shadow-md"
                title="TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.03.38.1.76.29 1.1.13.26.33.49.56.66.12.1.25.18.38.25.1.05.2.09.31.12.4.12.81.16 1.22.11.57-.07 1.09-.33 1.52-.68.28-.23.51-.5.7-.8.22-.35.35-.75.39-1.16.07-.8.06-1.6.06-2.4.01-1.59.01-3.18 0-4.77-.01-.5-.06-1-.18-1.48-.1-.4-.25-.78-.45-1.13-.2-.35-.45-.67-.74-.95-.29-.28-.62-.51-.98-.69-.36-.18-.74-.32-1.13-.42-.4-.1-.81-.16-1.22-.18-.41-.02-.82-.01-1.23.01z"/>
                </svg>
              </a>
              
              <a
                href="https://linkedin.com/company/rogerbox"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#85ea10] rounded-full flex items-center justify-center text-black hover:bg-[#7dd30f] hover:scale-110 transition-all duration-300 shadow-md"
                title="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              
              <a
                href="https://facebook.com/rogerbox"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#85ea10] rounded-full flex items-center justify-center text-black hover:bg-[#7dd30f] hover:scale-110 transition-all duration-300 shadow-md"
                title="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-500 dark:text-white/60">
                © 2025 RogerBox. Todos los derechos reservados.
              </p>
              <p className="text-xs text-gray-400 dark:text-white/50 mt-1">
                Plataforma de fitness y bienestar integral
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-xs text-gray-500 dark:text-white/60">
              <a href="/terms" className="hover:text-[#85ea10] transition-colors">Términos de Servicio</a>
              <a href="/privacy" className="hover:text-[#85ea10] transition-colors">Política de Privacidad</a>
              <a href="/cookies" className="hover:text-[#85ea10] transition-colors">Política de Cookies</a>
              <a href="/contact" className="hover:text-[#85ea10] transition-colors">Contacto</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
