import React from 'react';
import { Link } from 'react-router-dom';
import { FiCompass, FiMail, FiPhone, FiMapPin, FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';

const footerLinks = {
  Explore: [
    { label: 'Tourist Places', to: '/explore' },
    { label: 'Events', to: '/events' },
    { label: 'Hotels', to: '/hotels' },
    { label: 'Restaurants', to: '/restaurants' },
    { label: 'Food & Culture', to: '/food-culture' },
  ],
  Features: [
    { label: 'QR Scanner', to: '/qr-scanner' },
    { label: 'AI Planner', to: '/ai-planner' },
    { label: 'Offline Maps', to: '/explore' },
    { label: 'My Dashboard', to: '/dashboard' },
  ],
  Info: [
    { label: 'About Us', to: '/about' },
    { label: 'Contact', to: '/contact' },
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Terms of Use', to: '/terms' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-navy-800 border-t border-white/5 mt-20">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/home" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center">
                <FiCompass className="text-navy-900 text-xl" />
              </div>
              <span className="font-display font-bold text-2xl gold-text">Lucknow Explore</span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
              Your smart companion for exploring the City of Nawabs. Discover heritage, food, culture and events with AI-powered guidance.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              {[FiInstagram, FiTwitter, FiFacebook].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 glass gold-border rounded-xl flex items-center justify-center text-white/60 hover:text-gold-400 hover:border-gold-400/50 transition-all">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-white/90 mb-4 text-sm uppercase tracking-wider">{title}</h4>
              <ul className="space-y-2">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="text-white/50 text-sm hover:text-gold-400 transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-6">
          {[
            { icon: FiMapPin, text: 'Lucknow, Uttar Pradesh, India' },
            { icon: FiMail, text: 'hello@lucknowexplore.com' },
            { icon: FiPhone, text: '+91 9999999999' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-white/50 text-sm">
              <Icon className="text-gold-500 text-base" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-sm">© 2024 Lucknow Explore. All rights reserved.</p>
          <p className="text-white/30 text-sm">Made with ❤️ for the City of Nawabs</p>
        </div>
      </div>
    </footer>
  );
}
