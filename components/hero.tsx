"use client"

import { Button } from "@/components/ui/3d-button"
import { Handshake, Star, ShieldCheck, Users, Droplets, Flame, Wrench, ThermometerSnowflake } from "lucide-react"
import { motion } from "framer-motion"
import { useChat } from "@/components/chat-provider"

export function Hero() {
  const { open } = useChat()

  return (
    <section className="pt-32 pb-12 px-6 relative overflow-hidden">
      {/* Floating decorative icons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.07 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute inset-0 pointer-events-none"
      >
        <Droplets className="absolute top-28 left-[8%] w-12 h-12 text-primary rotate-12" />
        <Flame className="absolute top-40 right-[10%] w-10 h-10 text-accent -rotate-12" />
        <Wrench className="absolute bottom-24 left-[12%] w-14 h-14 text-foreground rotate-45" />
        <ThermometerSnowflake className="absolute bottom-32 right-[8%] w-11 h-11 text-primary -rotate-6" />
        <Droplets className="absolute top-[45%] left-[3%] w-8 h-8 text-accent rotate-[-20deg]" />
        <Wrench className="absolute top-[35%] right-[4%] w-9 h-9 text-foreground rotate-[30deg]" />
      </motion.div>

      <div className="container mx-auto max-w-5xl relative">
        {/* Trust Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center gap-6 mb-8 text-sm text-muted-foreground"
        >
          <span className="flex items-center gap-2 font-medium">
            <Star className="w-4 h-4 text-accent fill-accent" />
            4.9 Google Rating
          </span>
          <span className="text-border">|</span>
          <span className="flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-accent" />
            A+ BBB Accredited
          </span>
          <span className="text-border">|</span>
          <span className="flex items-center gap-2 font-medium">
            <Users className="w-4 h-4 text-accent" />
            80% Repeat Customers
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-serif text-4xl md:text-6xl lg:text-7xl font-normal text-center leading-[1.1] mb-6 text-balance"
        >
          Rhode Island&apos;s Plumbing,{" "}
          <span className="inline-flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-full bg-accent/15">
              <Handshake className="w-5 h-5 md:w-7 md:h-7 text-accent" />
            </span>
            Done Right.
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed"
        >
          Expert technicians available when you need them most. Boilers, drains, fixtures, emergencies — we handle it all.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex justify-center"
        >
          <Button size="lg" className="rounded-full px-8 text-base" onClick={() => open()}>
            Book a Visit ❄️
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
