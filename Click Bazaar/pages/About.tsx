import React from 'react';
import { motion } from 'framer-motion';

const fadeUp = { hidden: { opacity: 0, y: 12, scale: 0.98 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8 } } };
const stagger = { show: { transition: { staggerChildren: 0.06 } } };
const card = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

const AboutPage: React.FC = () => {
  return (
    <div className="cinematic-page cinematic-zoom relative overflow-hidden">
      <div className="letterbox-top letterbox-subtle" aria-hidden="true"></div>
      <div className="letterbox-bottom letterbox-subtle" aria-hidden="true"></div>
      <section className="relative py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white animate-gradient-shift">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.h1 className="text-4xl md:text-5xl font-extrabold leading-tight cinematic-heading" initial="hidden" animate="show" variants={fadeUp}>About ClickBazaar</motion.h1>
          <motion.p className="mt-4 text-lg text-white/90" initial="hidden" animate="show" variants={fadeUp} transition={{ delay: 0.06 }}>Connecting mindful shoppers with sustainable brands across India.</motion.p>

          <div className="mt-8 flex justify-center gap-4">
            <motion.a className="inline-block bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm text-white py-3 px-6 rounded-full transition transform hover:-translate-y-1" whileHover={{ scale: 1.02 }} href="#">Our Story</motion.a>
            <motion.a className="inline-block bg-white text-indigo-700 font-semibold py-3 px-6 rounded-full shadow hover:shadow-lg transition" whileHover={{ scale: 1.03 }} href="#">Shop Now</motion.a>
          </div>
        </div>

        <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-white/10 blur-3xl floating pointer-events-none"></div>
        <div className="absolute -bottom-12 -right-6 w-72 h-72 rounded-full bg-pink-400/10 blur-3xl floating pointer-events-none"></div>

        <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
          <img src="/assets/hero-abstract.svg" className="hero-illustration hero-parallax hidden md:block" alt="abstract" />
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <motion.div className="grid gap-6 sm:grid-cols-2" initial="hidden" animate="show" variants={stagger}>
          <motion.div className="card-fancy p-6 rounded-2xl transform transition hover:-translate-y-3 shadow-lg" style={{ animationDelay: '0.05s' }} variants={card}>
            <h3 className="text-xl font-bold mb-2">Mission</h3>
            <p className="text-gray-800">To be India’s most customer-centric and sustainable marketplace.</p>
          </motion.div>
          <motion.div className="card-fancy p-6 rounded-2xl transform transition hover:-translate-y-3 shadow-lg" style={{ animationDelay: '0.12s' }} variants={card}>
            <h3 className="text-xl font-bold mb-2">Values</h3>
            <p className="text-gray-800">Customer first, transparent policies, and sustainable growth.</p>
          </motion.div>
        </motion.div>

        <motion.div className="space-y-6" initial="hidden" animate="show" variants={stagger}>
          <motion.div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm" style={{ animationDelay: '0.2s' }} variants={card}>
            <h3 className="font-extrabold">Sustainability Focus</h3>
            <p className="text-gray-700 mt-2">We partner with brands that prioritize materials, fair labor and reduced packaging.</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;  