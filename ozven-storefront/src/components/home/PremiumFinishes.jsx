import Container from '../common/Container'

const columns = [
  [
    {
      title: 'Holographic Foiling',
      image: '/finishes/finish-holographic.jpg',
      tall: true,
    },
    {
      title: 'Silver Foiling',
      image: '/finishes/finish-silver-foil.jpg',
      tall: false,
    },
  ],
  [
    {
      title: 'Gold Foiling',
      image: '/finishes/finish-gold-foil.jpg',
      tall: false,
    },
    {
      title: 'Spot UV',
      image: '/finishes/finish-spot-uv.jpg',
      tall: true,
    },
  ],
  [
    {
      title: 'Embossing',
      image: '/finishes/finish-embossing.jpg',
      tall: false,
    },
    {
      title: 'Debossing',
      image: '/finishes/finish-debossing.jpg',
      tall: true,
    },
  ],
]

function FinishCard({ title, image, tall }) {
  return (
    <article className="group relative overflow-hidden rounded-sm">
      <div className={tall ? 'aspect-[3/4]' : 'aspect-[4/3]'}>
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
          loading="lazy"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-dark/70 via-dark/20 to-transparent" />
      <p className="absolute bottom-4 left-4 text-sm font-semibold tracking-wide text-white sm:bottom-5 sm:left-5 sm:text-[0.95rem]">
        {title}
      </p>
    </article>
  )
}

export default function PremiumFinishes() {
  return (
    <section className="border-t border-charcoal/8 bg-base py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl leading-tight text-charcoal sm:text-4xl">
            Premium finishes
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-medium uppercase leading-relaxed tracking-[0.14em] text-charcoal/70 sm:text-[0.8rem]">
            Variety of finishing options to ensure spectacular looks and a premium feel for custom
            boxes
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {columns.map((column) => (
            <div key={column[0].title} className="flex flex-col gap-5 lg:gap-6">
              {column.map((item) => (
                <FinishCard key={item.title} {...item} />
              ))}
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
