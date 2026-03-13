"use client"

import { motion } from "framer-motion"

export function StatsSection() {
  return (
    <section className="py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="font-serif text-3xl md:text-4xl lg:text-5xl text-center mb-10 leading-tight text-balance"
        >
          <span className="text-accent">Fixing leaks, warming homes,</span> and keeping Rhode Island{" "}
          <span className="text-accent">flowing all winter long.</span>
        </motion.h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Stat 1 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="border-2 border-dashed border-border rounded-3xl p-6 text-center"
          >
            <div className="mb-4">
              <span className="font-serif text-7xl md:text-8xl font-bold">11</span>
              <span className="text-accent text-5xl md:text-6xl font-serif font-bold">+</span>
            </div>
            <h3 className="font-serif text-2xl font-semibold mb-4">Years in Business</h3>
            <p className="text-muted-foreground font-sans leading-relaxed">
              Serving Rhode Island homeowners since 2013 with master-licensed expertise.
            </p>
          </motion.div>

          {/* Stat 2 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="border-2 border-dashed border-border rounded-3xl p-6 text-center"
          >
            <div className="mb-4">
              <span className="font-serif text-7xl md:text-8xl font-bold">80</span>
              <span className="text-accent text-5xl md:text-6xl font-serif font-bold">%</span>
            </div>
            <h3 className="font-serif text-2xl font-semibold mb-4">Repeat Customers</h3>
            <p className="text-muted-foreground font-sans leading-relaxed">
              Our work speaks for itself — 4 out of 5 customers call us back.
            </p>
          </motion.div>

          {/* Stat 3 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="border-2 border-dashed border-border rounded-3xl p-6 text-center"
          >
            <div className="mb-4">
              <span className="font-serif text-7xl md:text-8xl font-bold">4.9</span>
              <span className="text-accent text-5xl md:text-6xl font-serif font-bold">★</span>
            </div>
            <h3 className="font-serif text-2xl font-semibold mb-4">Google Rating</h3>
            <p className="text-muted-foreground font-sans leading-relaxed">
              A+ BBB accredited with hundreds of five-star reviews across RI.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
