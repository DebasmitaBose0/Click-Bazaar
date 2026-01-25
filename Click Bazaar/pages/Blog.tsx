import React from 'react';
import { motion } from 'framer-motion';

const BlogPage: React.FC = () => {
  const posts = [
    { title: 'Sustainable Picks for 2026', excerpt: 'Curated list of products that combine quality with sustainability.' },
    { title: 'How We Ensure Fast Delivery', excerpt: 'A behind-the-scenes look at our logistics network and regional hubs.' },
    { title: 'Brand Stories: Makers We Love', excerpt: 'Meet the founders bringing sustainability to market.' },
  ];

  return (
    <div className="cinematic-page cinematic-zoom relative overflow-hidden">
      <div className="letterbox-top letterbox-subtle" aria-hidden="true"></div>
      <div className="letterbox-bottom letterbox-subtle" aria-hidden="true"></div>
      <section className="py-20 bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-500 text-white animate-gradient-shift">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.h1 className="text-4xl md:text-5xl font-extrabold leading-tight cinematic-heading" initial={{opacity:0, y:8, scale:0.98}} animate={{opacity:1, y:0, scale:1}}>ClickBazaar Blog</motion.h1>
          <motion.p className="mt-4 text-lg text-white/90" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.06}}>Insights on sustainable shopping, product reviews, and brand stories.</motion.p>
        </div>

        <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
          <img src="/assets/hero-abstract.svg" className="hero-illustration hero-parallax hidden md:block" alt="blog hero" />
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((p, i) => (
            <motion.article key={p.title} className="p-6 rounded-2xl bg-white shadow-lg border border-gray-100 transform transition hover:-translate-y-3" initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} transition={{delay:0.06 + i * 0.06}}>
              <h3 className="font-extrabold text-lg">{p.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{p.excerpt}</p>
              <div className="mt-4"><a className="inline-block text-indigo-600 font-semibold">Read more</a></div>
            </motion.article>
          ))}
        </div>

        <div className="mt-8 text-center"><a className="inline-block py-2 px-4 bg-indigo-600 text-white rounded-2xl" href="https://blog.clickbazaar.com" target="_blank" rel="noopener noreferrer">Visit External Blog</a></div>
      </div>
    </div>
  );
};

export default BlogPage;  