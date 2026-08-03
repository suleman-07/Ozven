import Button from '../components/common/Button'
import Container from '../components/common/Container'

export default function NotFoundPage() {
  return (
    <section className="flex min-h-[60vh] items-center py-20">
      <Container className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">404</p>
        <h1 className="mt-4 font-display text-4xl text-charcoal sm:text-5xl">Page not found</h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-charcoal/70">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button to="/">Back home</Button>
          <Button to="/products" variant="secondary">
            Browse products
          </Button>
        </div>
      </Container>
    </section>
  )
}
