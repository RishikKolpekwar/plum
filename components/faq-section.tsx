"use client"

import { useState } from "react"
import { IconChevronDown } from "@tabler/icons-react"
import { motion } from "framer-motion"

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "How quickly can you respond to an emergency?",
      answer:
        "We offer priority dispatch for all emergency calls. Our technicians are available 24/7 and aim to be on-site as fast as possible — often same day or next morning.",
    },
    {
      question: "What areas do you serve?",
      answer:
        "We serve Woonsocket, Providence, Smithfield, and N. Smithfield, Rhode Island. Not sure if you're in our service area? Give us a call and we'll figure it out.",
    },
    {
      question: "Are your technicians licensed?",
      answer:
        "Yes. All plum technicians are master-licensed plumbers in Rhode Island. We're also A+ rated by the BBB and fully insured.",
    },
    {
      question: "What's included in the Protection Plans?",
      answer:
        "Every plan includes an annual whole-home inspection, drain cleaning, priority scheduling, and a discount on all repairs. Higher tiers add boiler inspections, water heater flushes, emergency dispatch coverage, and more.",
    },
    {
      question: "Can I cancel my plan anytime?",
      answer:
        "Yes. Plans are month-to-month with no long-term contracts. You can cancel at any time, no questions asked.",
    },
    {
      question: "How does the referral program work?",
      answer:
        "Refer a friend to plum and earn $15 in credit when they complete their first visit. There's no cap — refer as many people as you like and keep earning.",
    },
  ]

  return (
    <section className="py-14 px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="font-serif text-4xl md:text-5xl font-bold mb-4"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            Everything you need to know about plum.
          </motion.p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="border border-border rounded-xl overflow-hidden bg-secondary"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-background/50 transition-colors"
              >
                <span className="font-semibold text-lg pr-8">{faq.question}</span>
                <IconChevronDown
                  className={`w-5 h-5 flex-shrink-0 transition-transform ${openIndex === index ? "rotate-180" : ""}`}
                />
              </button>
              {openIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-5 text-muted-foreground leading-relaxed"
                >
                  {faq.answer}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
