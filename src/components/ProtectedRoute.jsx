import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader2, AlertCircle } from 'lucide-react';

export default function ProtectedRoute({ children }) {
    const { user, userProfile, isActive, loading } = useAuth();

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center animate-fadeIn">
                    <Loader2 className="animate-spin text-indigo-400 mx-auto mb-4" size={48} />
                    <p className="text-slate-400 text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    // If user is not authenticated, don't render children
    // (App.jsx will show AuthPage instead)
    if (!user) {
        return null;
    }

    // If user is authenticated but account is inactive
    if (!isActive) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
                <div className="max-w-md w-full animate-fadeIn">
                    <div className="bg-slate-800/90 border-2 border-red-500/50 rounded-xl p-8 text-center shadow-xl">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="text-red-400" size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-red-400 mb-2">
                            Account Inactive
                        </h2>
                        <p className="text-slate-300 mb-6">
                            Your account has been deactivated and you cannot access the dashboard at this time.
                        </p>
                        <div className="bg-slate-700/50 rounded-lg p-4 text-sm text-slate-400">
                            <p className="mb-2">
                                <strong className="text-slate-200">Need help?</strong>
                            </p>
                            <p>
                                Please contact our support team to reactivate your account.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // User is authenticated and active - render children
    return <>{children}</>;
}
