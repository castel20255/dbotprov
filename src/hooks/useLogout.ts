import { useCallback } from 'react';
import { useStore } from '@/hooks/useStore';
import { ErrorLogger } from '@/utils/error-logger';

/**
 * Custom hook to handle logout functionality
 * Clears all session and local storage to reset the session
 * @returns {Function} handleLogout - Function to trigger the logout process
 */
export const useLogout = () => {
    const { client } = useStore() ?? {};

    return useCallback(async () => {
        try {
            // Call the client store logout method which clears all storage
            await client?.logout();
            // Analytics.reset() removed - Analytics package has been removed from the project
            // See migrate-docs/MONITORING_PACKAGES.md for re-enabling analytics if needed
        } catch (error) {
            ErrorLogger.error('Logout', 'Logout failed', error);
            // If logout fails, clear only auth-related storage keys
            // This preserves user preferences (theme, language, etc.) while ensuring auth data is cleared
            try {
                // Clear auth-related sessionStorage items
                sessionStorage.removeItem('auth_info');

                // Clear auth-related localStorage items
                localStorage.removeItem('active_loginid');
                localStorage.removeItem('authToken');
                localStorage.removeItem('accountsList');
                localStorage.removeItem('clientAccounts');
                localStorage.removeItem('account_type');
            } catch (storageError) {
                ErrorLogger.error('Logout', 'Failed to clear auth storage', storageError);
                // Last resort: if targeted clearing fails, clear all storage
                try {
                    // Preserve OAuth state even in last resort
                    const preserveSessionKeys = ['oauth_csrf_token', 'oauth_csrf_token_timestamp', 'oauth_code_verifier', 'oauth_code_verifier_timestamp', 'query_param_currency', 'redirect_url'];
                    const preserveLocalKeys = ['configured_client_id', 'configured_app_id', 'config.app_id', 'config.server_url', 'bot_version'];
                    
                    // Clear sessionStorage except preserve keys
                    for (let i = sessionStorage.length - 1; i >= 0; i--) {
                        const key = sessionStorage.key(i);
                        if (key && !preserveSessionKeys.includes(key)) {
                            sessionStorage.removeItem(key);
                        }
                    }
                    
                    // Clear localStorage except preserve keys
                    for (let i = localStorage.length - 1; i >= 0; i--) {
                        const key = localStorage.key(i);
                        if (key && !preserveLocalKeys.includes(key)) {
                            localStorage.removeItem(key);
                        }
                    }
                } catch (finalError) {
                    ErrorLogger.error('Logout', 'Failed to clear all storage', finalError);
                }
            }
        }
    }, [client]);
};
