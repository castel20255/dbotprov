import ReactDOM from 'react-dom/client';
import { AuthWrapper } from './app/AuthWrapper';
import { AnalyticsInitializer } from './utils/analytics';
import { performVersionCheck } from './utils/version-check';
import './styles/index.scss';

performVersionCheck();
AnalyticsInitializer();

ReactDOM.createRoot(document.getElementById('root')!).render(<AuthWrapper />);
