import { lazy, Suspense } from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import ChunkLoader from '@/components/loader/chunk-loader';
import LocalStorageSyncWrapper from '@/components/localStorage-sync-wrapper';
import RoutePromptDialog from '@/components/route-prompt-dialog';
import AppLoaderWrapper from '@/components/app-loader/app-loader-wrapper';
import { useAccountSwitching } from '@/hooks/useAccountSwitching';
import { useLanguageFromURL } from '@/hooks/useLanguageFromURL';
import { StoreProvider } from '@/hooks/useStore';
import { initializeI18n, localize, TranslationProvider } from '@deriv-com/translations';
import CoreStoreProvider from './CoreStoreProvider';
import './app-root.scss';

const Layout = lazy(() => import('../components/layout'));
const AppRoot = lazy(() => import('./app-root'));
const CallbackPage = lazy(() => import('../pages/callback'));

// Translations CDN is optional — requires TRANSLATIONS_CDN_URL, R2_PROJECT_NAME, and CROWDIN_BRANCH_NAME env vars.
// Without these, the app defaults to English. See user-guide/03-white-labeling.md#translations for setup instructions.
const i18nInstance = initializeI18n({ cdnUrl: '' });

/**
 * Component wrapper to handle language URL parameter
 * Uses the useLanguageFromURL hook to process language switching
 */
const LanguageHandler = ({ children }: { children: React.ReactNode }) => {
    useLanguageFromURL();
    return <>{children}</>;
};

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route
                path='/'
                element={
                    <Suspense
                        fallback={<ChunkLoader message={localize('Please wait while we connect to the server...')} />}
                    >
                        <TranslationProvider defaultLang='EN' i18nInstance={i18nInstance}>
                            <LanguageHandler>
                                <StoreProvider>
                                    <LocalStorageSyncWrapper>
                                        <RoutePromptDialog />
                                        <CoreStoreProvider>
                                            <Layout />
                                        </CoreStoreProvider>
                                    </LocalStorageSyncWrapper>
                                </StoreProvider>
                            </LanguageHandler>
                        </TranslationProvider>
                    </Suspense>
                }
            >
                {/* All child routes will be passed as children to Layout */}
                <Route index element={<AppRoot />} />
            </Route>
            <Route
                path='/callback'
                element={
                    <Suspense
                        fallback={<ChunkLoader message={localize('Please wait while we connect to the server...')} />}
                    >
                        <TranslationProvider defaultLang='EN' i18nInstance={i18nInstance}>
                            <LanguageHandler>
                                <StoreProvider>
                                    <LocalStorageSyncWrapper>
                                        <CoreStoreProvider>
                                            <CallbackPage />
                                        </CoreStoreProvider>
                                    </LocalStorageSyncWrapper>
                                </StoreProvider>
                            </LanguageHandler>
                        </TranslationProvider>
                    </Suspense>
                }
            />
        </>
    )
);

/**
 * Main App component
 *
 * Responsibilities:
 * 1. Account switching from URL (via useAccountSwitching hook)
 * 2. Router provider setup
 *
 * All complex logic has been extracted into custom hooks for better maintainability
 */
function App() {
    // Handle account switching via URL parameter
    useAccountSwitching();

    return (
        <AppLoaderWrapper>
            <RouterProvider router={router} />
        </AppLoaderWrapper>
    );
}

export default App;
