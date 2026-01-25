import React from 'react';
import { motion } from 'framer-motion';

const PressPage: React.FC = () => {
  return (
    <div className="cinematic-page cinematic-zoom relative overflow-hidden">
      <div className="letterbox-top letterbox-subtle" aria-hidden="true"></div>
      <div className="letterbox-bottom letterbox-subtle" aria-hidden="true"></div>
      <section className="py-20 bg-gradient-to-r from-gray-800 via-zinc-800 to-indigo-700 text-white animate-gradient-shift">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.h1 className="text-4xl md:text-5xl font-extrabold leading-tight cinematic-heading" initial={{opacity:0, y:8, scale:0.98}} animate={{opacity:1, y:0, scale:1}}>Press & Media</motion.h1>
          <motion.p className="mt-4 text-lg text-white/90" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.06}}>Press kits, logos and media contacts. For media requests, email <a className="text-white font-semibold" href="mailto:dbose272@gmail.com">dbose272@gmail.com</a>.</motion.p>
          <div className="mt-6"><a className="inline-block bg-white text-indigo-700 font-semibold py-3 px-6 rounded-full shadow hover:shadow-lg transition" href="/press-kit.zip" download>Download Press Kit</a></div>
        </div>

        <div className="absolute -top-8 -right-10 w-56 h-56 rounded-full bg-white/10 blur-3xl floating pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
          <img src="/assets/hero-abstract.svg" className="hero-illustration hero-parallax hidden md:block" alt="press hero" />
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid gap-6 sm:grid-cols-3">
          {['Logo', 'Brand Guidelines', 'High-res Images'].map((item, i) => (
            <motion.div key={item} className="p-6 rounded-2xl bg-white shadow-lg border border-gray-100 transform transition hover:-translate-y-3" initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} transition={{delay:0.06 + i * 0.06}}>
              <h3 className="font-bold">{item}</h3>
              <p className="mt-2 text-sm text-gray-600">Download the latest {item.toLowerCase()} for editorial use.</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PressPage;  