"use client"

import { motion } from "framer-motion"

export function ServicesSection() {
  const services = [
    {
      title: "🔥 Boiler Repair & Installation",
      description: "Rhode Island winters demand a reliable boiler. We install, repair, and service all makes and models.",
      image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=250&fit=crop",
    },
    {
      title: "🚿 Drain Cleaning & Maintenance",
      description: "Clogged drains don't wait. Neither do we. Fast, clean, and guaranteed.",
      image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=250&fit=crop",
    },
    {
      title: "🚰 Fixture Installation & Repairs",
      description: "From faucets to full bathroom upgrades — precision work, fair pricing.",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=250&fit=crop",
    },
    {
      title: "⚡ Emergency Plumbing",
      description: "Burst pipe at 2am? We pick up. Priority dispatch for all emergency calls.",
      image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=250&fit=crop",
    },
  ]

  return (
    <section id="services" className="py-12 px-4 sm:px-6 w-full bg-background scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="font-serif text-4xl sm:text-5xl font-normal text-foreground mb-3 tracking-tight"
          >
            What We Fix
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-sans text-base sm:text-lg text-muted-foreground"
          >
            From boilers to burst pipes — expert plumbing for every Rhode Island home.
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-secondary/30 rounded-3xl overflow-hidden flex flex-col transition-all duration-300 hover:bg-secondary/50"
            >
              {/* Image */}
              <div className="w-full aspect-[16/9] overflow-hidden">
                <img
                  src={service.image || "/placeholder.svg"}
                  alt={`${service.title} showcase`}
                  className="w-full h-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-105"
                />
              </div>

              {/* Service Title */}
              <div className="p-6">
                <h3 className="font-sans text-left text-lg font-medium text-foreground">{service.title}</h3>
                <p className="font-sans text-sm text-muted-foreground mt-2">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
