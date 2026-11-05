import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAppDispatch } from "../app/hooks";
import { loadPublicSettings } from "../features/settings/settingsSlice";
import { usePublicSettings } from "../features/settings/usePublicSettings";

// Navbar
import { Navbar } from "../components/common/Navbar";
import { Footer } from "../components/common/Footer";
import { SearchModal } from "../components/common/SearchModal";
import { CartDrawer } from "../components/common/CartDrawer";
// import { CustomAlert } from "../components/common/CustomAlert";
import { ScrollToTop } from '../utils/ScrollToTop';

export const MainLayout: React.FC = () => {
    const dispatch = useAppDispatch();
    const { settings } = usePublicSettings();

    useEffect(() => {
        const request = dispatch(loadPublicSettings());
        return () => request.abort();
    }, [dispatch]);

    const pageTitle = settings?.seo.metaTitle || settings?.general.storeName || "Twelve Clothing";
    const faviconUrl = settings?.branding.faviconUrl;
    const resolveAsset = (url: string) => url.startsWith("http") ? url : `http://localhost:5001${url}`;

    return (
        <>
        <Helmet>
            <title>{pageTitle}</title>
            {settings?.seo.metaDescription && <meta name="description" content={settings.seo.metaDescription} />}
            {settings?.seo.metaKeywords && <meta name="keywords" content={settings.seo.metaKeywords} />}
            <meta property="og:title" content={pageTitle} />
            {settings?.seo.metaDescription && <meta property="og:description" content={settings.seo.metaDescription} />}
            {settings?.seo.ogImage && <meta property="og:image" content={settings.seo.ogImage} />}
            <link rel="icon" href={faviconUrl ? resolveAsset(faviconUrl) : "/favicon.svg"} />
        </Helmet>
        <div>


            <Navbar />
            <ScrollToTop />

            <main className="min-h-screen">
            <Outlet /> 
            </main>

            {/* SearchModal */}
            <SearchModal />

            {/* <CartDrawer /> */}
            <CartDrawer />

            {/* <Footer /> */}
            <Footer />

            {/* <CustomAlert /> */}
            
        </div>
        </>
    );
}
