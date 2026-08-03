import Breadcrumb from '../components/common/Breadcrumb'
import Button from '../components/common/Button'
import Container from '../components/common/Container'
import SectionHeading from '../components/common/SectionHeading'

const values = [
  {
    title: 'Craft with purpose',
    copy: 'Every structure, finish, and detail should serve protection, clarity, and brand presence — never decoration for its own sake.',
  },
  {
    title: 'Honest materials',
    copy: 'We specify board, coatings, and processes that feel premium in hand and hold up from sample to scaled production.',
  },
  {
    title: 'Partnership over transactions',
    copy: 'Ozven works alongside product and brand teams — from first brief through proofs, pilots, and ongoing replenishment.',
  },
]

export default function AboutPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'About' }]} />

      {/* Page heading */}
      <section className="bg-dark py-16 text-base sm:py-20">
        <Container>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold">About</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
            The story behind <span className="text-gold">Ozven</span>
          </h1>
        </Container>
      </section>

      {/* Brand story + image placeholder */}
      <section className="bg-base py-16 sm:py-20">
        <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Brand story"
              title="Packaging as part of the product experience"
              description="This is placeholder brand-story copy. Replace it with Ozven’s real narrative when ready."
            />
            <div className="mt-8 space-y-4 text-sm leading-relaxed text-charcoal/75 sm:text-base">
              <p>
                Ozven began with a simple belief: the moment someone opens a package should feel as
                considered as the product inside. We design and produce premium packaging for brands
                that care about structure, print fidelity, and the quiet confidence of a well-made
                box.
              </p>
              <p>
                From custom mailers to specialty retail structures, our studio pairs craft
                sensibility with production discipline — so every unit feels intentional at scale.
              </p>
            </div>
            <Button to="/contact" className="mt-8" size="lg">
              Work with us
            </Button>
          </div>

          {/* Image placeholder — swap for a real brand image later */}
          <div
            className="flex aspect-[4/5] items-center justify-center border border-gold-hairline/40 bg-dark-alt"
            aria-label="Brand image placeholder"
          >
            <div className="px-8 text-center">
              <p className="font-display text-3xl tracking-[0.12em] text-gold">OZVEN</p>
              <p className="mt-3 text-xs uppercase tracking-[0.22em] text-base/50">
                Image placeholder
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Mission / values */}
      <section className="border-t border-gold-hairline/25 bg-base py-16 sm:py-20">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="Mission & values"
            title="What guides every project"
            description="Placeholder mission and values — refine these to match Ozven’s positioning."
            className="mb-12"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {values.map((value) => (
              <article
                key={value.title}
                className="border border-gold-hairline/25 bg-base px-6 py-8 transition hover:border-gold"
              >
                <div className="mb-5 h-px w-10 bg-gold" />
                <h2 className="font-display text-2xl text-charcoal">{value.title}</h2>
                <p className="mt-4 text-sm leading-relaxed text-charcoal/70">{value.copy}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
