import ReactDOM from 'react-dom/client';
import { AuthWrapper } from './app/AuthWrapper';
import { AnalyticsInitializer } from './utils/analytics';
import { performVersionCheck } from './utils/version-check';
import brandConfig from './components/shared/brand.config.json';
import './styles/index.scss';

// Initialize configuration from brand.config.json
localStorage.setItem('config.app_id', brandConfig.oauth.app_id);
localStorage.setItem('config.client_id', brandConfig.oauth.client_id);
localStorage.setItem('config.server_url', brandConfig.platform.auth2_url.production.replace('/oauth2/', '')); // oauth server url
localStorage.setItem('config.post_login_redirect_uri', window.location.origin);
localStorage.setItem('config.post_logout_redirect_uri', window.location.origin);

// Also set from environment variables if available
if (process.env.CLIENT_ID) {
    localStorage.setItem('config.client_id', process.env.CLIENT_ID);
}
if (process.env.APP_ID) {
    localStorage.setItem('config.app_id', process.env.APP_ID);
}
if (process.env.OAUTH_REDIRECT_URI) {
    localStorage.setItem('config.post_login_redirect_uri', process.env.OAUTH_REDIRECT_URI);
}

performVersionCheck();
AnalyticsInitializer();

ReactDOM.createRoot(document.getElementById('root')!).render(<AuthWrapper />);
