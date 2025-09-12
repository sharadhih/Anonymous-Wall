import React from "react";

const Footer = () => (
  <footer className="w-full py-6 bg-[#18181b] border-t border-[#37beb0]/30 text-center">
    <div className="text-[#37beb0] text-sm font-sans">
      &copy; {new Date().getFullYear()} Anonymous Wall &mdash; Made with ❤️ for open expression.
    </div>
    <div className="mt-2 text-xs text-[#37beb0]/70">
      This is a demo project. No personal data is stored.
    </div>
  </footer>
);

export default Footer;
