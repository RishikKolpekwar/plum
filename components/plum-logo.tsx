export function PlumLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Stem */}
      <path
        d="M32 8 C32 8 34 2 38 4"
        stroke="#5A3A1A"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Leaf */}
      <ellipse
        cx="39"
        cy="5"
        rx="5"
        ry="2.5"
        transform="rotate(-20 39 5)"
        fill="#6BBF59"
      />
      {/* Plum body */}
      <ellipse cx="32" cy="30" rx="18" ry="20" fill="#7B2D8E" />
      {/* Shine highlight */}
      <ellipse cx="24" cy="22" rx="5" ry="7" fill="#9B4DCA" opacity="0.6" />
      {/* Melting drip left */}
      <path
        d="M22 48 C22 48 22 56 20 60 C19 62 21 63 22 61 C23 58 23 54 23 48"
        fill="#7B2D8E"
      />
      {/* Melting drip center */}
      <path
        d="M30 50 C30 50 30 58 29 62 C28.5 64 31.5 64 31 62 C30 58 30 54 30 50"
        fill="#7B2D8E"
      />
      {/* Melting drip right */}
      <path
        d="M38 47 C38 47 39 53 40 56 C40.5 58 38 58 38 56 C37.5 53 38 50 38 47"
        fill="#7B2D8E"
      />
    </svg>
  )
}
