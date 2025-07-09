import React from 'react';

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-gray-900 min-h-[320px]">
      {/* Decorative Glassmorphism Blobs */}
      <svg
        className="absolute left-0 top-0 w-40 h-40 sm:w-64 sm:h-64 opacity-30 -z-10"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="100" cy="100" r="100" fill="#818CF8" />
      </svg>
      <svg
        className="absolute right-0 bottom-0 w-32 h-32 sm:w-52 sm:h-52 opacity-20 -z-10"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="100" cy="100" r="100" fill="#FBCFE8" />
      </svg>
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[260px] h-[40vh] sm:h-[50vh] md:h-[60vh] px-4 py-8 sm:py-12 md:py-16 relative z-10">
        <div className="w-full backdrop-blur-lg bg-white/20 border border-white/30 shadow-2xl rounded-3xl p-8 sm:p-12 flex flex-col items-center glassmorphism">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-center text-white drop-shadow-lg leading-tight">
            Explore. Dream. Discover.
          </h1>
          <p className="mt-5 text-base sm:text-lg md:text-xl text-center max-w-2xl text-indigo-100 font-normal drop-shadow">
            Ready to <span className="text-yellow-300 font-semibold">travel</span> to your dream destination? <br className="hidden sm:block" />
            Find the perfect <span className="text-pink-300 font-semibold">hotel</span> for your next adventure.
          </p>
          {/* <div className="mt-8 flex flex-col xs:flex-row gap-3 xs:gap-4 w-full max-w-md justify-center">
            <a
              href="#"
              className="w-full xs:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-yellow-400 via-pink-400 to-indigo-500 text-white font-semibold text-base shadow-lg hover:from-yellow-500 hover:to-indigo-600 transition duration-200 text-center backdrop-blur-md bg-opacity-80"
              style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)' }}
            >
              Get Started
            </a>
            <a
              href="#"
              className="w-full xs:w-auto px-8 py-3 rounded-full bg-white/30 text-indigo-100 font-semibold text-base border border-white/40 shadow-lg hover:bg-white/40 transition duration-200 text-center backdrop-blur-md"
              style={{ boxShadow: '0 4px 24px 0 rgba(31, 38, 135, 0.15)' }}
            >
              Learn More
            </a>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default Hero;
