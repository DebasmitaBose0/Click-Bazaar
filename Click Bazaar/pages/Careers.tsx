import React from 'react';
import { motion } from 'framer-motion';

const card = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const CareersPage: React.FC = () => {
  const roles = [
    { title: 'Frontend Engineer', desc: 'Build beautiful, fast interfaces.' },
    { title: 'Product Manager', desc: 'Shape product strategy and growth.' },
    { title: 'Logistics Coordinator', desc: 'Keep our delivery network humming.' },
    { title: 'Customer Success Lead', desc: 'Deliver exceptional post-purchase experience.' },
  ];

  return (
    <div className="cinematic-page cinematic-zoom relative overflow-hidden">
      <div className="letterbox-top letterbox-subtle" aria-hidden="true"></div>
      <div className="letterbox-bottom letterbox-subtle" aria-hidden="true"></div>
      <section className="py-20 bg-gradient-to-r from-teal-500 via-cyan-500 to-indigo-600 text-white animate-gradient-shift">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.h1 className="text-4xl md:text-5xl font-extrabold leading-tight cinematic-heading" initial={{opacity:0, y:12, scale:0.98}} animate={{opacity:1, y:0, scale:1}}>Careers at ClickBazaar</motion.h1>
          <motion.p className="mt-4 text-lg text-white/90" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.06}}>Join a fast-moving team building sustainable e-commerce across India.</motion.p>
        </div>
        <div className="absolute -top-8 -right-10 w-56 h-56 rounded-full bg-white/10 blur-3xl floating pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
          <img src="/assets/hero-abstract.svg" className="hero-illustration hero-parallax hidden md:block" alt="careers hero" />
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid gap-6 sm:grid-cols-2">
          {roles.map((r, i) => (
            <motion.div key={r.title} className="p-6 rounded-2xl bg-white shadow-lg border border-gray-100 transform transition hover:-translate-y-3" initial="hidden" animate="show" variants={card} style={{ animationDelay: `${0.06 + i * 0.06}s` }}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold">{r.title}</h3>
                  <p className="text-gray-600 mt-1 text-sm">{r.desc}</p>
                </div>
                <a className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition">Apply</a>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">Send your CV to <a className="text-indigo-600 font-semibold" href="mailto:dbose272@gmail.com">dbose272@gmail.com</a></div>
      </div>
    </div>
  );
};

export default CareersPage;  