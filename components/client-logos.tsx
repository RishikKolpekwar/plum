"use client"

const communities = [
  {
    name: "East Greenwich",
    initials: "EG",
    color: "#1B4D3E",
    accent: "#2E8B57",
  },
  {
    name: "Barrington",
    initials: "B",
    color: "#1C3A5F",
    accent: "#3B7DD8",
  },
  {
    name: "Newport",
    initials: "N",
    color: "#6B1D1D",
    accent: "#C0392B",
  },
  {
    name: "Narragansett",
    initials: "NK",
    color: "#2C3E50",
    accent: "#5DADE2",
  },
  {
    name: "Watch Hill",
    initials: "WH",
    color: "#4A235A",
    accent: "#8E44AD",
  },
  {
    name: "Jamestown",
    initials: "J",
    color: "#0E4D45",
    accent: "#1ABC9C",
  },
  {
    name: "Bristol",
    initials: "B",
    color: "#7B241C",
    accent: "#E74C3C",
  },
  {
    name: "Providence",
    initials: "PVD",
    color: "#1A1A2E",
    accent: "#E8601C",
  },
  {
    name: "Woonsocket",
    initials: "W",
    color: "#1B3A4B",
    accent: "#2980B9",
  },
  {
    name: "Smithfield",
    initials: "S",
    color: "#2C3E50",
    accent: "#27AE60",
  },
  {
    name: "N. Smithfield",
    initials: "NS",
    color: "#3B3B1A",
    accent: "#D4AC0D",
  },
  {
    name: "Cranston",
    initials: "C",
    color: "#1A1A3E",
    accent: "#6C5CE7",
  },
]

function CommunityLogo({ name, initials, color, accent }: typeof communities[number]) {
  return (
    <svg viewBox="0 0 120 48" className="h-12 w-auto" aria-label={name}>
      {/* Shield / badge shape */}
      <rect x="0" y="4" width="40" height="40" rx="8" fill={color} />
      {/* Inner accent ring */}
      <rect x="3" y="7" width="34" height="34" rx="6" fill="none" stroke={accent} strokeWidth="1.5" />
      {/* Initials */}
      <text
        x="20"
        y="28"
        textAnchor="middle"
        fill="white"
        fontFamily="serif"
        fontWeight="bold"
        fontSize={initials.length > 2 ? "11" : "14"}
      >
        {initials}
      </text>
      {/* Town name */}
      <text x="48" y="21" fill={color} fontFamily="sans-serif" fontWeight="700" fontSize="11">
        {name.split(" ")[0]}
      </text>
      {name.split(" ").length > 1 && (
        <text x="48" y="35" fill={accent} fontFamily="sans-serif" fontWeight="600" fontSize="10">
          {name.split(" ").slice(1).join(" ")}
        </text>
      )}
      {name.split(" ").length === 1 && (
        <text x="48" y="35" fill={accent} fontFamily="sans-serif" fontWeight="600" fontSize="9">
          Rhode Island
        </text>
      )}
    </svg>
  )
}

export function ClientLogos() {
  return (
    <section className="py-12 px-6 border-t border-border overflow-hidden">
      <div className="container mx-auto">
        <h2 className="font-serif text-2xl md:text-3xl text-center mb-8 text-foreground/60">Proudly Serving</h2>
        <div className="relative flex opacity-60">
          {/* First set */}
          <div className="flex items-center gap-12 animate-scroll-logos">
            {communities.map((c) => (
              <div key={`a-${c.name}`} className="flex-shrink-0">
                <CommunityLogo {...c} />
              </div>
            ))}
          </div>
          {/* Duplicate set for seamless loop */}
          <div className="flex items-center gap-12 animate-scroll-logos ml-12" aria-hidden="true">
            {communities.map((c) => (
              <div key={`b-${c.name}`} className="flex-shrink-0">
                <CommunityLogo {...c} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
