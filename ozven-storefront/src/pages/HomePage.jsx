import HeroSection from '../components/home/HeroSection'
import TrustedBy from '../components/home/TrustedBy'
import CategoryGrid from '../components/home/CategoryGrid'
import WhyChooseUs from '../components/home/WhyChooseUs'
import TrustBadges from '../components/home/TrustBadges'
import TestimonialSection from '../components/home/TestimonialSection'
import HomeCtaBanner from '../components/home/HomeCtaBanner'
import { getCategories } from '../api'
import useFetch from '../hooks/useFetch'

export default function HomePage() {
  const {
    data: categories = [],
    loading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useFetch(() => getCategories(), [])

  return (
    <>
      <HeroSection />
      <TrustedBy />
      <CategoryGrid
        categories={Array.isArray(categories) ? categories : []}
        loading={categoriesLoading}
        error={categoriesError}
        onRetry={refetchCategories}
      />
      <WhyChooseUs />
      <TrustBadges />
      <TestimonialSection />
      <HomeCtaBanner />
    </>
  )
}
