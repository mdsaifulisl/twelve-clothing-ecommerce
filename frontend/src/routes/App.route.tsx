
import { Routes, Route } from 'react-router-dom';

import { MainLayout } from '../layouts/MainLayout';
import { SellerLayout } from '../layouts/SellerLayoout';
import { publicRoutes } from './Public.route';
import { sellerRoutes } from './Seller.route';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { CustomAlert } from '../components/common/CustomAlert';
// err
import { NotFoundPage } from '../pages/err/NotFoundPage';


export const AppRoutes: React.FC = () => {

    return (
        <>
        <Routes>
            <Route path="/" element={<MainLayout />} >
                {publicRoutes}
            </Route>

            <Route path="/seller" element={<SellerLayout />} >
                {sellerRoutes}
            </Route>

            <Route path="*" element={<NotFoundPage />} />

        </Routes>
        
        <ConfirmModal />
        <CustomAlert />
        </>
    );

    
}