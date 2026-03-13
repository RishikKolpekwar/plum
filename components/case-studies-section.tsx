"use client"

import { motion } from "framer-motion"

export function CaseStudiesSection() {
  const caseStudies = [
    {
      client: "Woonsocket, RI",
      project: "Boiler Replacement",
      metric: "Heat restored in 6 hours",
      description: "Emergency boiler replacement in the middle of a January cold snap. New unit installed same day, warranty activated immediately.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
    },
    {
      client: "Providence, RI",
      project: "Main Drain Clearing",
      metric: "Fully cleared, zero callbacks",
      description: "Stubborn main line blockage cleared with hydro-jetting. Follow-up camera inspection confirmed a clean line.",
      image: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=600&h=400&fit=crop",
    },
    {
      client: "Smithfield, RI",
      project: "Full Bathroom Fixture Upgrade",
      metric: "Completed in one visit",
      description: "Replaced faucets, showerhead, and toilet in a single appointment. Fair flat-rate pricing, no surprise charges.",
      image: "https://images.unsplash.com/photo-1663659505016-d358722c06c3?w=600&h=400&fit=crop",
    },
    {
      client: "N. Smithfield, RI",
      project: "Burst Pipe Emergency",
      metric: "On-site within 90 minutes",
      description: "2am call for a burst pipe in the basement. Technician arrived quickly, stopped the leak, and repaired the line before morning.",
      image: "https://images.unsplash.com/photo-1518201660989-894b770d6e3c?w=600&h=400&fit=crop",
    },
  ]

  return (
    <section className="py-14 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="font-serif text-4xl md:text-5xl font-bold mb-4"
          >
            Recent Jobs
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Real fixes for real Rhode Island homeowners.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {caseStudies.map((study, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-secondary rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300"
            >
              <div className="aspect-[2/1] overflow-hidden">
                <img
                  src={study.image || "/placeholder.svg"}
                  alt={study.project}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <div className="text-xs font-semibold text-primary mb-1">{study.client}</div>
                <h3 className="font-serif text-xl font-bold mb-1">{study.project}</h3>
                <div className="text-xl font-bold text-primary mb-2">{study.metric}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{study.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
