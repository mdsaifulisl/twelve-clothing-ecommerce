import { Outlet } from "react-router-dom";

// Navbar
import { Navbar } from "../components/common/Navbar";
import { Footer } from "../components/common/Footer";
import { SearchModal } from "../components/common/SearchModal";
import { CartDrawer } from "../components/common/CartDrawer";
import { CustomAlert } from "../components/common/CustomAlert";
import { ScrollToTop } from '../utils/ScrollToTop';

export const MainLayout: React.FC = () => {
   
    

    return (
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
            <CustomAlert />
        </div>
    );
}