const CLIENT_LOGOS = [
  { name: 'Crate & Co Packaging', src: '/clients/crate-co.png?v=2' },
  { name: 'Atlas Trade Co', src: '/clients/atlas-trade.png?v=2' },
  { name: 'Nova Goods', src: '/clients/nova-goods.png?v=2' },
  { name: 'Orbit Labs', src: '/clients/orbit-labs.png?v=2' },
  { name: 'Haven Foods', src: '/clients/haven-foods.png?v=2' },
  { name: 'Sterling Cosmetics', src: '/clients/sterling-cosmetics.png?v=2' },
  { name: 'Peak Supply Co', src: '/clients/peak-supply.png?v=2' },
  { name: 'Lumen Box Studio', src: '/clients/lumen-box.png?v=2' },
  { name: 'ZestPop', src: '/clients/zestpop.png?v=2' },
  { name: 'Pure Tide Skin & Body', src: '/clients/pure-tide.png?v=2' },
  { name: 'Nimble & Known Organicz', src: '/clients/nimble-known.png?v=2' },
  { name: 'Greenfield Farms', src: '/clients/greenfield-farms.png?v=2' },
  { name: 'Wild Creek Outfitters', src: '/clients/wild-creek.png?v=2' },
  { name: 'Orbital Trading Co', src: '/clients/orbital-trading.png?v=2' },
]

function LogoItem({ client }) {
  return (
    <div
      className="group flex h-14 w-[168px] shrink-0 items-center justify-center px-5 sm:h-16 sm:w-[196px] sm:px-7"
      title={client.name}
    >
      <img
        src={client.src}
        alt={client.name}
        loading="lazy"
        className="h-9 w-auto max-w-[140px] object-contain opacity-[0.82] grayscale transition duration-300 ease-out group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-[1.04] sm:h-10 sm:max-w-[160px]"
      />
    </div>
  )
}

function MarqueeTrack({ logos, ariaHidden = false }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={ariaHidden || undefined}>
      {logos.map((client) => (
        <LogoItem key={`${ariaHidden ? 'dup' : 'main'}-${client.src}`} client={client} />
      ))}
    </div>
  )
}

export default function TrustedBy() {
  return (
    <section aria-label="Trusted by" className="bg-white">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-4 pt-8 sm:gap-5 sm:pt-10">
          <span className="hidden h-px w-10 bg-gold/45 sm:block" aria-hidden />
          <p className="text-center text-[11px] font-medium uppercase tracking-[0.28em] text-gold">
            Trusted by growing brands
          </p>
          <span className="hidden h-px w-10 bg-gold/45 sm:block" aria-hidden />
        </div>

        <div className="relative overflow-hidden pt-7 pb-4 sm:pt-9 sm:pb-5">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-white via-white/85 to-transparent sm:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-white via-white/85 to-transparent sm:w-24" />

          {/* Static wrap for reduced-motion users */}
          <div className="hidden flex-wrap items-center justify-center gap-x-2 gap-y-4 motion-reduce:flex">
            {CLIENT_LOGOS.map((client) => (
              <LogoItem key={`static-${client.src}`} client={client} />
            ))}
          </div>

          <div className="group/marquee flex overflow-hidden motion-reduce:hidden">
            <div className="flex w-max animate-marquee [animation-duration:56s] group-hover/marquee:[animation-play-state:paused]">
              <MarqueeTrack logos={CLIENT_LOGOS} />
              <MarqueeTrack logos={CLIENT_LOGOS} ariaHidden />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
