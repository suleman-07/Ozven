import Container from './Container'
import CategoryHeroArt from './CategoryHeroArt'

/**
 * Editorial category header — matches Ozven reference:
 * dark band, gold label + rule, serif title, short description,
 * gold line-art on the right, vertical sidebar text.
 */
export default function CategoryHero({ label, title, description }) {
  return (
    <section className="relative overflow-hidden bg-[#141414] text-base">
      {/* Faint dieline / template pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(DIELINE_PATTERN)}")`,
          backgroundSize: '520px 360px',
          backgroundPosition: 'right center',
          backgroundRepeat: 'no-repeat',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 70% at 78% 50%, rgba(201,162,75,0.07), transparent 55%)',
        }}
        aria-hidden
      />

      <Container className="relative">
        <div className="grid items-center gap-6 py-10 sm:gap-8 sm:py-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-6 lg:py-14">
          {/* Copy */}
          <div className="relative z-10 max-w-xl lg:max-w-none">
            {label ? (
              <div className="flex items-center gap-4">
                <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#D4AF6A] sm:text-[11px]">
                  {label}
                </p>
                <span className="h-px w-10 shrink-0 bg-[#C9A24B] sm:w-14" aria-hidden />
              </div>
            ) : null}

            <h1 className="mt-4 font-display text-[2.15rem] leading-[1.12] tracking-tight text-[#F8F6F2] sm:mt-5 sm:text-[2.75rem] lg:text-[3.15rem]">
              {title}
            </h1>

            {description ? (
              <p className="mt-4 max-w-md text-[13px] leading-relaxed text-[#F8F6F2]/78 sm:mt-5 sm:text-[15px] sm:leading-[1.65]">
                {description}
              </p>
            ) : null}
          </div>

          {/* Art + vertical caption */}
          <div className="relative z-10 flex items-center justify-center gap-4 sm:justify-end sm:gap-6 lg:pr-2">
            <CategoryHeroArt
              name={title}
              className="h-[140px] w-[140px] sm:h-[170px] sm:w-[170px] lg:h-[190px] lg:w-[190px]"
            />

            <div className="hidden flex-col items-center gap-3 sm:flex" aria-hidden>
              <p
                className="text-[9px] font-medium uppercase tracking-[0.28em] text-[#E8D5A3]/85"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                Premium Packaging Solutions
              </p>
              <span className="h-px w-8 bg-[#C9A24B]" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

const DIELINE_PATTERN = `
<svg xmlns="http://www.w3.org/2000/svg" width="520" height="360" fill="none" stroke="#9a9a9a" stroke-width="1">
  <path d="M40 80h120v90H40zM160 80l50-35 50 35v90l-50 35-50-35z"/>
  <path d="M280 60h90v70H280zM290 140h70v80H290z"/>
  <path d="M400 100l55-40 55 40v95l-55 40-55-40z"/>
  <path d="M60 220h100v70H60zM200 210l70 40v80l-70 40-70-40v-80z"/>
  <path d="M360 230h110v75H360z"/>
</svg>
`.trim()
