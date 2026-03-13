"use client"

import { Button } from "@/components/ui/3d-button"
import { IconCheck } from "@tabler/icons-react"
import { motion } from "framer-motion"
import { useChat } from "@/components/chat-provider"

export function PricingSection() {
  const { open } = useChat()
  const plans = [
    {
      name: "Basic",
      price: "$29",
      period: "/mo",
      description: "Protection Plan",
      features: [
        "Annual whole-home inspection",
        "Drain cleaning (1x/year)",
        "Priority scheduling within 48hrs",
        "10% off all repairs",
      ],
    },
    {
      name: "Standard",
      price: "$49",
      period: "/mo",
      description: "Care Plan",
      features: [
        "Everything in Basic",
        "Boiler inspection (1x/year)",
        "Water heater flush (1x/year)",
        "15% off all repairs",
        "1 emergency call/year (dispatch fee waived)",
      ],
      featured: true,
    },
    {
      name: "Premium",
      price: "$79",
      period: "/mo",
      description: "Total Coverage",
      features: [
        "Everything in Standard",
        "Unlimited emergency dispatch",
        "Water filtration check (1x/year)",
        "Steam radiator inspection (1x/year)",
        "20% off all repairs",
      ],
    },
  ]

  return (
    <section id="pricing" className="py-24 px-6 bg-secondary scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="font-serif text-4xl md:text-5xl font-bold mb-4"
          >
            The plum Protection Plans
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Stop paying per visit. Pay once, stay covered all year.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`rounded-2xl p-8 border-2 ${
                plan.featured ? "bg-background border-primary shadow-lg scale-105" : "bg-background border-border"
              }`}
            >
              {plan.featured && (
                <div className="text-xs font-bold text-primary uppercase tracking-wider mb-4">Most Popular</div>
              )}
              <h3 className="font-serif text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground ml-2">{plan.period}</span>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">{plan.description}</p>
              <Button stretch className="mb-6 rounded-full" onClick={() => open(`I'm interested in the ${plan.name} plan (${plan.price}/mo). Can you help me get signed up?`)}>
                Get {plan.name}
              </Button>
              <div className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3">
                    <IconCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
