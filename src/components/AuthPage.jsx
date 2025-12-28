import React, { useState } from 'react';
import { Mail, Lock, User, Chrome, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';

export default function AuthPage() {
    const [activeTab, setActiveTab] = useState('login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [formErrors, setFormErrors] = useState({});

    const { signUp, signIn, signInWithGoogle, isActive } = useAuth();
    const isLogin = activeTab === 'login';

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
        setError('');
    };

    // Validate form
    const validateForm = () => {
        const errors = {};

        if (!isLogin && !formData.name.trim()) {
            errors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (!isLogin && formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setError('');

        try {
            let result;

            if (isLogin) {
                result = await signIn(formData.email, formData.password);
            } else {
                result = await signUp(formData.email, formData.password, formData.name);
            }

            if (result.error) {
                setError(result.error);
            } else {
                // Success - AuthContext will handle the redirect
                setFormData({ name: '', email: '', password: '' });
            }
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    // Handle Google sign in
    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');

        try {
            const result = await signInWithGoogle();
            if (result.error) {
                setError(result.error);
            }
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    // Switch between login and signup
    const handleTabChange = (value) => {
        setActiveTab(value);
        setError('');
        setFormErrors({});
        setFormData({ name: '', email: '', password: '' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md animate-fadeIn">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg mb-2">
                        Toolkit Generators
                    </h1>
                    <p className="text-slate-400 text-sm">
                        Professional tools for CPA marketing
                    </p>
                </div>

                {/* Account Inactive Warning */}
                {!isActive && (
                    <div className="mb-6 p-4 bg-red-500/10 border-2 border-red-500/50 rounded-lg animate-slideUp">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="text-red-400 mt-0.5 flex-shrink-0" size={20} />
                            <div>
                                <h3 className="text-red-400 font-semibold mb-1">Account Inactive</h3>
                                <p className="text-sm text-red-300">
                                    Your account has been deactivated. Please contact support for assistance.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <Card className="overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-center">
                            Welcome to Toolkit Generators
                        </CardTitle>
                        <CardDescription className="text-center">
                            Sign in or create an account to get started
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {/* Tabs for Login/Signup */}
                        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="login">Login</TabsTrigger>
                                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                            </TabsList>

                            {/* Error Message */}
                            {error && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg animate-fadeIn">
                                    <p className="text-sm text-red-400 flex items-center gap-2">
                                        <AlertCircle size={16} />
                                        {error}
                                    </p>
                                </div>
                            )}

                            {/* Login Tab Content */}
                            <TabsContent value="login">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Email field */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            <Mail size={16} className="inline mr-2" />
                                            Email Address
                                        </label>
                                        <Input
                                            type="email"
                                            name="email"
                                            placeholder="you@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            error={formErrors.email}
                                            disabled={loading}
                                            required
                                        />
                                    </div>

                                    {/* Password field */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            <Lock size={16} className="inline mr-2" />
                                            Password
                                        </label>
                                        <Input
                                            type="password"
                                            name="password"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            error={formErrors.password}
                                            disabled={loading}
                                            required
                                        />
                                    </div>

                                    {/* Submit button */}
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        size="lg"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="animate-spin mr-2" size={18} />
                                                Please wait...
                                            </>
                                        ) : (
                                            <>Sign In</>
                                        )}
                                    </Button>
                                </form>
                            </TabsContent>

                            {/* Signup Tab Content */}
                            <TabsContent value="signup">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Name field */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            <User size={16} className="inline mr-2" />
                                            Full Name
                                        </label>
                                        <Input
                                            type="text"
                                            name="name"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={handleChange}
                                            error={formErrors.name}
                                            disabled={loading}
                                            required
                                        />
                                    </div>

                                    {/* Email field */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            <Mail size={16} className="inline mr-2" />
                                            Email Address
                                        </label>
                                        <Input
                                            type="email"
                                            name="email"
                                            placeholder="you@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            error={formErrors.email}
                                            disabled={loading}
                                            required
                                        />
                                    </div>

                                    {/* Password field */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            <Lock size={16} className="inline mr-2" />
                                            Password
                                        </label>
                                        <Input
                                            type="password"
                                            name="password"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            error={formErrors.password}
                                            disabled={loading}
                                            required
                                        />
                                    </div>

                                    {/* Submit button */}
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        size="lg"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="animate-spin mr-2" size={18} />
                                                Please wait...
                                            </>
                                        ) : (
                                            <>Create Account</>
                                        )}
                                    </Button>
                                </form>
                            </TabsContent>

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-600"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-slate-800 text-slate-400">OR</span>
                                </div>
                            </div>

                            {/* Google Sign In */}
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                size="lg"
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                            >
                                <Chrome size={20} className="mr-2" />
                                Continue with Google
                            </Button>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Footer */}
                <p className="text-center text-xs text-slate-500 mt-6">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
}
