import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full mt-auto px-4 py-4 bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-800 border-t border-yellow-500/30 shadow-2xl">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3">
        <span className="text-xl text-center sm:text-2xl font-extrabold text-yellow-300 tracking-tight drop-shadow">
          holidays.com
        </span>
      </div>
    </footer>
  );
};

export default Footer;
