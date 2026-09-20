import HeroSection from '../components/home/HeroSection'
import TrustedBy from '../components/home/TrustedBy'
import CategoryGrid from '../components/home/CategoryGrid'
import PackagingBenefits from '../components/home/PackagingBenefits'
import PremiumFinishes from '../components/home/PremiumFinishes'
import WhyChooseUs from '../components/home/WhyChooseUs'
import TestimonialSection from '../components/home/TestimonialSection'
import HomeQuoteSection from '../components/home/HomeQuoteSection'
import HomeFaq from '../components/home/HomeFaq'
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
      <PackagingBenefits />
      <PremiumFinishes />
      <WhyChooseUs />
      <TestimonialSection />
      <HomeQuoteSection />
      <HomeFaq />
      <HomeCtaBanner />
    </>
  )
}
