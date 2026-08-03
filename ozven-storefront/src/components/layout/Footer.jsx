import { Link } from 'react-router-dom'
import Container from '../common/Container'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gold-hairline/25 bg-dark text-base">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link to="/" className="inline-block" aria-label="Ozven Packaging">
            <img src="/logo-ozven.png?v=2" alt="Ozven Packaging" className="h-14 w-auto object-contain" />
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-base/65">
            Premium packaging for brands that treat the unboxing as part of the product experience.
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-gold">Explore</p>
          <ul className="mt-4 space-y-3">
            <li>
              <Link to="/products" className="text-sm text-base/75 transition hover:text-gold-light">
                Products
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-sm text-base/75 transition hover:text-gold-light">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-sm text-base/75 transition hover:text-gold-light">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-gold">Contact</p>
          <p className="mt-4 text-sm leading-relaxed text-base/75">
            Call or email for custom quotes, samples, and production planning.
          </p>
          <Link
            to="/contact"
            className="mt-5 inline-flex text-sm font-medium text-gold transition hover:text-gold-light"
          >
            Get a Quote →
          </Link>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-5 text-xs text-base/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Ozven Packaging. All rights reserved.</p>
          <p className="text-emerald/90">Eco-minded options available.</p>
        </Container>
      </div>
    </footer>
  )
}
