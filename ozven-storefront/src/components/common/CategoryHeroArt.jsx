/**
 * Gold line-art illustrations for category hero (reference-style).
 * Picks a variant from the category/subcategory name.
 */
export default function CategoryHeroArt({ name = '', className = '' }) {
  const key = String(name).toLowerCase()
  const variant = resolveVariant(key)

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {variant === 'bakery' ? <BakeryBoxArt /> : null}
      {variant === 'cosmetic' ? <CosmeticBoxArt /> : null}
      {variant === 'gift' ? <GiftBoxArt /> : null}
      {variant === 'bottle' ? <BottleBoxArt /> : null}
      {variant === 'mailer' ? <MailerBoxArt /> : null}
      {variant === 'material' ? <MaterialStackArt /> : null}
      {variant === 'default' ? <DefaultBoxArt /> : null}
    </div>
  )
}

function resolveVariant(key) {
  if (/baker|pastry|cake|cookie|candy|confection|chocolate|dessert/.test(key)) return 'bakery'
  if (/cosmetic|beauty|perfume|soap|skincare|makeup/.test(key)) return 'cosmetic'
  if (/gift|present|holiday/.test(key)) return 'gift'
  if (/bottle|wine|beverage|drink/.test(key)) return 'bottle'
  if (/mailer|sleeve|shipping|folding|drawer|display|style/.test(key)) return 'mailer'
  if (/kraft|board|rigid|plastic|chip|corrugat|material|card\s*board|paper/.test(key)) {
    return 'material'
  }
  return 'default'
}

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.35,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

function BakeryBoxArt() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full text-[#E8D5A3]" aria-hidden>
      {/* Gable / handle-top bakery box */}
      <path {...stroke} d="M52 78 L100 42 L148 78" />
      <path {...stroke} d="M58 78 V148 H142 V78" />
      <path {...stroke} d="M58 78 H142" />
      <path {...stroke} d="M100 42 V78" />
      <path {...stroke} d="M72 78 L100 58 L128 78" />
      {/* Handle arches */}
      <path {...stroke} d="M78 58 Q100 28 122 58" />
      <path {...stroke} d="M86 58 Q100 38 114 58" />
      {/* Front panel detail */}
      <rect x="78" y="98" width="44" height="36" rx="2" {...stroke} />
      {/* Wheat emblem */}
      <path {...stroke} d="M100 108 V128" />
      <path {...stroke} d="M100 112 Q90 108 88 116 Q96 118 100 114" />
      <path {...stroke} d="M100 112 Q110 108 112 116 Q104 118 100 114" />
      <path {...stroke} d="M100 118 Q91 116 90 122 Q97 124 100 120" />
      <path {...stroke} d="M100 118 Q109 116 110 122 Q103 124 100 120" />
      <path {...stroke} d="M96 128 Q100 134 104 128" />
    </svg>
  )
}

function CosmeticBoxArt() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full text-[#E8D5A3]" aria-hidden>
      <rect x="68" y="48" width="64" height="104" rx="3" {...stroke} />
      <path {...stroke} d="M68 72 H132" />
      <path {...stroke} d="M68 128 H132" />
      <circle cx="100" cy="100" r="14" {...stroke} />
      <path {...stroke} d="M100 90 V110 M93 100 H107" />
      <path {...stroke} d="M84 48 V40 H116 V48" />
    </svg>
  )
}

function GiftBoxArt() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full text-[#E8D5A3]" aria-hidden>
      <rect x="55" y="78" width="90" height="70" rx="2" {...stroke} />
      <path {...stroke} d="M55 98 H145" />
      <path {...stroke} d="M100 78 V148" />
      <path {...stroke} d="M100 78 Q78 52 62 68 Q78 78 100 78" />
      <path {...stroke} d="M100 78 Q122 52 138 68 Q122 78 100 78" />
      <path {...stroke} d="M55 78 L70 58 H130 L145 78" />
    </svg>
  )
}

function BottleBoxArt() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full text-[#E8D5A3]" aria-hidden>
      <path {...stroke} d="M78 52 H122 V70 L130 86 V152 H70 V86 L78 70 Z" />
      <path {...stroke} d="M86 52 V42 H114 V52" />
      <rect x="86" y="100" width="28" height="28" rx="2" {...stroke} />
      <path {...stroke} d="M93 114 H107" />
    </svg>
  )
}

function MailerBoxArt() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full text-[#E8D5A3]" aria-hidden>
      <path {...stroke} d="M48 86 L100 54 L152 86 V148 L100 180 L48 148 Z" />
      <path {...stroke} d="M48 86 L100 118 L152 86" />
      <path {...stroke} d="M100 118 V180" />
      <path {...stroke} d="M72 100 L100 82 L128 100" />
    </svg>
  )
}

function MaterialStackArt() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full text-[#E8D5A3]" aria-hidden>
      <rect x="58" y="54" width="84" height="28" rx="2" {...stroke} />
      <rect x="50" y="86" width="100" height="32" rx="2" {...stroke} />
      <rect x="62" y="122" width="76" height="30" rx="2" {...stroke} />
      <path {...stroke} d="M70 68 H130 M62 102 H138 M74 137 H126" />
    </svg>
  )
}

function DefaultBoxArt() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full text-[#E8D5A3]" aria-hidden>
      <path {...stroke} d="M56 78 L100 48 L144 78 V138 L100 168 L56 138 Z" />
      <path {...stroke} d="M56 78 L100 108 L144 78" />
      <path {...stroke} d="M100 108 V168" />
      <rect x="84" y="88" width="32" height="32" rx="2" {...stroke} />
      <path {...stroke} d="M100 96 V112 M92 104 H108" />
    </svg>
  )
}
