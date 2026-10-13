
import { Routes, Route } from 'react-router-dom';

import { MainLayout } from '../layouts/MainLayout';
import { publicRoutes } from './Public.route';
import { sellerRoutes } from './Seller.route';

// err
import { NotFoundPage } from '../pages/err/NotFoundPage';

export const AppRoutes: React.FC = () => {

    return (
        <Routes>
            <Route path="/" element={<MainLayout />} >
                {publicRoutes}
            </Route>

            <Route path="/seller" element={<MainLayout />} >
                {sellerRoutes}
            </Route>

            <Route path="*" element={<NotFoundPage />} />

        </Routes>
    );

    
}