import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ROUTES from './routes.js';

const SignUpPage = lazy(() => import('../pages/SignUpPage/index.jsx'));
const SignInPage = lazy(() => import('../pages/SignInPage/index.jsx'));

const Navigation = () => {
    return (
        <Suspense>
            <Routes>
                <Route path={ROUTES.SIGN_UP_PAGE} element={<SignUpPage />} />
                <Route path={ROUTES.SIGN_IN_PAGE} element={<SignInPage />} />
            </Routes>
        </Suspense>
    );
};

export default Navigation;
