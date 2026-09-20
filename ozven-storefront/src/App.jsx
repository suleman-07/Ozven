import { Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import SubcategoryPage from './pages/SubcategoryPage'
import ProductListingPage from './pages/ProductListingPage'
import ProductDetailPage from './pages/ProductDetailPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import ReviewsPage from './pages/ReviewsPage'
import NotFoundPage from './pages/NotFoundPage'
import LiveChatWidget from './components/chat/LiveChatWidget'
import WhatsAppFloatButton from './components/common/WhatsAppFloatButton'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-base">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:categorySlug/:subcategorySlug" element={<SubcategoryPage />} />
          <Route path="/category/:categorySlug" element={<CategoryPage />} />
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/product/:productSlug" element={<ProductDetailPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppFloatButton />
      <LiveChatWidget />
    </div>
  )
}
