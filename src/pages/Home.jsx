import HeroSection from '../components/home/HeroSection'
import ClothingRackShowcase from '../components/home/ClothingRackShowcase'
import FeaturedSection from '../components/home/FeaturedSection'
import LookbookSection from '../components/home/LookbookSection'
import CategoriesSection from '../components/home/CategoriesSection'
import AboutSection from '../components/home/AboutSection'

export default function Home() {
  return (
    <main className="relative z-10">
      <HeroSection />
      <ClothingRackShowcase />
      <FeaturedSection />
      <LookbookSection />
      <CategoriesSection />
      <AboutSection />
    </main>
  )
}
