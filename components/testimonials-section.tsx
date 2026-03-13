import { TestimonialSlider, type Testimonial } from "@/components/ui/testimonial-slider"

const testimonials: Testimonial[] = [
  {
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    quote:
      "Our boiler went out on a Friday night in January. plum had someone here by 9am Saturday. Can't recommend them enough.",
    name: "James H.",
    role: "Woonsocket, RI",
    rating: 5,
  },
  {
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    quote:
      "I've been using plum for 3 years. Mike is fantastic — always on time, always explains exactly what he did. Worth every penny.",
    name: "Linda P.",
    role: "Providence, RI",
    rating: 5,
  },
  {
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    quote:
      "Signed up for the Care Plan and it's already paid for itself twice over. The annual inspection caught a leak I had no idea about.",
    name: "Carol W.",
    role: "N. Smithfield, RI",
    rating: 5,
  },
  {
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    quote:
      "Referred three of my neighbors and they all loved it. Got my $15 credits too. These guys are the real deal.",
    name: "Derek M.",
    role: "Providence, RI",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-16 px-4 bg-background overflow-visible scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3 text-balance">What Our Customers Say</h2>
          <p className="font-sans text-lg text-muted-foreground max-w-2xl mx-auto">
            Don&apos;t just take our word for it — hear from Rhode Island homeowners we&apos;ve helped.
          </p>
        </div>
        <TestimonialSlider testimonials={testimonials} />
      </div>
    </section>
  )
}
