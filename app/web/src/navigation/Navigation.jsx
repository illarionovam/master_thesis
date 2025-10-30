import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ROUTES from './routes.js';
import RequireAuth from './RequireAuth.jsx';

const HomePage = lazy(() => import('../pages/HomePage'));
const SignUpPage = lazy(() => import('../pages/SignUpPage'));
const SignInPage = lazy(() => import('../pages/SignInPage'));
const ConfirmEmailPage = lazy(() => import('../pages/ConfirmEmailPage'));
const ResetPasswordPage = lazy(() => import('../pages/ResetPasswordPage'));
const CharactersPage = lazy(() => import('../pages/CharactersPage'));
const LocationsPage = lazy(() => import('../pages/LocationsPage'));
const WorksPage = lazy(() => import('../pages/WorksPage'));
const UserDetailsPage = lazy(() => import('../pages/UserDetailsPage'));
const LocationDetailsPage = lazy(() => import('../pages/LocationDetailsPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

const Navigation = () => {
    return (
        <Suspense>
            <Routes>
                <Route path={ROUTES.HOME_PAGE} element={<HomePage />} />
                <Route path={ROUTES.SIGN_UP_PAGE} element={<SignUpPage />} />
                <Route path={ROUTES.SIGN_IN_PAGE} element={<SignInPage />} />
                <Route path={ROUTES.CONFIRM_EMAIL_PAGE} element={<ConfirmEmailPage />} />
                <Route path={ROUTES.RESET_PASSWORD_PAGE} element={<ResetPasswordPage />} />
                <Route
                    path={ROUTES.CHARACTERS_PAGE}
                    element={
                        <RequireAuth>
                            <CharactersPage />
                        </RequireAuth>
                    }
                />
                <Route
                    path={ROUTES.LOCATIONS_PAGE}
                    element={
                        <RequireAuth>
                            <LocationsPage />
                        </RequireAuth>
                    }
                />
                <Route
                    path={ROUTES.WORKS_PAGE}
                    element={
                        <RequireAuth>
                            <WorksPage />
                        </RequireAuth>
                    }
                />
                <Route
                    path={ROUTES.USER_DETAIL_PAGE}
                    element={
                        <RequireAuth>
                            <UserDetailsPage />
                        </RequireAuth>
                    }
                />
                <Route
                    path={ROUTES.LOCATION_DETAILS_PAGE}
                    element={
                        <RequireAuth>
                            <LocationDetailsPage />
                        </RequireAuth>
                    }
                />
                <Route path={ROUTES.NOT_FOUND_PAGE} element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    );
};

export default Navigation;
