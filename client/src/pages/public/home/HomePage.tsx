

import { HeroBanner } from "../../../components/public/home/HeroBanner"
import { FeaturedCategories } from "../../../components/public/home/FeaturedCategories"
import { BrandVideoBanner } from "../../../components/public/home/BrandVideoBanner"
import { CategoryGrid } from "../../../components/public/home/CategoryGrid"
// import { StoreLocationBanner } from "../../../components/public/home/StoreLocationBanner"

export const HomePage = () => {
    
    return (
        <div>
            <HeroBanner />
            <FeaturedCategories />
            <BrandVideoBanner />
            <CategoryGrid />
            {/* <StoreLocationBanner /> */}
        </div>
    )
}