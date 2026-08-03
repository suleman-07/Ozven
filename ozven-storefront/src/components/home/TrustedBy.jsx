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
      className="group flex h-12 w-[152px] shrink-0 items-center justify-center px-5 sm:h-14 sm:w-[172px] sm:px-6"
      title={client.name}
    >
      <img
        src={client.src}
        alt={client.name}
        loading="lazy"
        className="h-8 w-auto max-w-[132px] object-contain opacity-70 transition duration-300 ease-out group-hover:opacity-100 group-hover:scale-[1.03] sm:h-9 sm:max-w-[148px]"
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
    <section aria-label="Trusted by" className="border-y border-gold-hairline/20 bg-base">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden py-5 sm:py-6">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-base via-base/80 to-transparent sm:w-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-base via-base/80 to-transparent sm:w-20" />

          <div className="group/marquee flex overflow-hidden">
            <div className="flex w-max animate-marquee motion-reduce:animate-none group-hover/marquee:[animation-play-state:paused]">
              <MarqueeTrack logos={CLIENT_LOGOS} />
              <MarqueeTrack logos={CLIENT_LOGOS} ariaHidden />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
