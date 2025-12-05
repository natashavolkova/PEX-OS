'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Key, Sparkles, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [masterKey, setMasterKey] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ masterKey }),
            });

            const data = await res.json();

            if (data.success) {
                // Store auth in localStorage
                localStorage.setItem('athena-auth', JSON.stringify({
                    userId: data.user.id,
                    name: data.user.name,
                    email: data.user.email,
                    authenticated: true,
                    timestamp: Date.now(),
                }));
                router.push('/pex-os/analytics');
            } else {
                setError(data.message || 'Invalid Master Key');
            }
        } catch {
            setError('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-athena-navy-deep via-athena-navy to-athena-navy-deep flex items-center justify-center p-4">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-athena-gold/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
            </div>

            {/* Login Card */}
            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-athena-gold to-athena-gold-dark rounded-2xl shadow-athena-glow mb-4">
                        <Shield className="w-10 h-10 text-athena-navy-deep" />
                    </div>
                    <h1 className="font-cinzel text-3xl text-athena-gold font-bold">ATHENA</h1>
                    <p className="text-athena-silver/60 mt-2">Productivity Command Center</p>
                </div>

                {/* Form Card */}
                <div className="bg-gradient-to-br from-athena-navy/80 to-athena-navy-deep/80 backdrop-blur-xl border border-athena-gold/30 rounded-2xl p-8 shadow-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <Key className="w-5 h-5 text-athena-gold" />
                        <h2 className="font-cinzel text-xl text-athena-platinum">Acesso Seguro</h2>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Access Key Input */}
                        <div>
                            <label className="block text-sm font-medium text-athena-silver mb-2">
                                Digite sua chave de acesso
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={masterKey}
                                    onChange={(e) => setMasterKey(e.target.value)}
                                    placeholder="Insira sua chave"
                                    className="w-full bg-athena-navy-deep/60 border border-athena-gold/30 rounded-xl px-4 py-4 text-athena-platinum placeholder:text-athena-silver/30 focus:border-athena-gold focus:ring-2 focus:ring-athena-gold/20 outline-none transition-all font-mono tracking-wider"
                                    required
                                />
                                <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-athena-gold/40" />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || !masterKey}
                            className="w-full bg-gradient-to-r from-athena-gold to-athena-gold-dark hover:from-athena-gold-dark hover:to-athena-gold text-athena-navy-deep font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-athena-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-athena-navy-deep/30 border-t-athena-navy-deep rounded-full animate-spin" />
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    <Shield className="w-5 h-5" />
                                    Access Command Center
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-athena-silver/40 text-xs mt-6">
                        Protected by ENTJ-Grade Security
                    </p>
                </div>
            </div>
        </div>
    );
}
