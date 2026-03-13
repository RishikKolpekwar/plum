"use client"

export function PortfolioShowcase() {
  const portfolioItems = [
    {
      image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=250&fit=crop",
    },
    {
      image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=250&fit=crop",
    },
    {
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=250&fit=crop",
    },
    {
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=250&fit=crop",
    },
    {
      image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=250&fit=crop",
    },
  ]

  return (
    <section className="pt-4 pb-12 overflow-hidden">
      <div className="relative flex">
        {/* First set of images */}
        <div className="flex gap-4 animate-scroll-seamless">
          {portfolioItems.map((item, index) => (
            <div key={`set1-${index}`} className="flex-shrink-0 w-[350px]">
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl shadow-lg">
                <img src={item.image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          ))}
        </div>
        {/* Duplicate set for seamless loop */}
        <div className="flex gap-4 animate-scroll-seamless ml-4" aria-hidden="true">
          {portfolioItems.map((item, index) => (
            <div key={`set2-${index}`} className="flex-shrink-0 w-[350px]">
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl shadow-lg">
                <img src={item.image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
