import Button from '../common/Button'
import Container from '../common/Container'

export default function HomeCtaBanner() {
  return (
    <section className="bg-dark py-16 sm:py-20">
      <Container className="flex flex-col items-start justify-between gap-8 border border-gold-hairline/30 px-8 py-12 sm:flex-row sm:items-center sm:px-12">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-gold">Next step</p>
          <h2 className="mt-3 font-display text-3xl text-base sm:text-4xl">Ready to get started?</h2>
          <p className="mt-3 max-w-xl text-sm text-base/65">
            Share your brief and we’ll help shape structure, finishes, and a production plan that
            fits your launch.
          </p>
        </div>
        <Button to="/contact" size="lg">
          Get Custom Quote
        </Button>
      </Container>
    </section>
  )
}
