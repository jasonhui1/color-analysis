"use client";

import { useEffect, useState } from "react";
import supabaseClient from "../../lib/clientApis/supabaseClient";

const GoogleLogin = () => {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [signingIn, setSigningIn] = useState(false);
    const [signingOut, setSigningOut] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        supabaseClient.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setAuthLoading(false);
        });

        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null);
                setAuthLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const handleSignIn = async () => {
        setSigningIn(true);
        const { error } = await supabaseClient.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: window.location.href },
        });
        if (error) {
            console.error("Sign-in error:", error);
            setSigningIn(false);
        }
    };

    const handleSignOut = async () => {
        setSigningOut(true);
        await supabaseClient.auth.signOut();
        setSigningOut(false);
    };

    if (!mounted) return null;

    // ── Checking auth ──────────────────────────────────────────────────────────
    if (authLoading) {
        return (
            <div className="flex items-center gap-2 px-4 py-1.5 border border-slate-200 rounded-full bg-slate-50">
                <div className="w-4 h-4 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin" />
                <span className="text-xs text-slate-400">Checking session…</span>
            </div>
        );
    }

    // ── Logged In ──────────────────────────────────────────────────────────────
    if (user) {
        const nameParts = (user.user_metadata?.full_name || user.email || "?").split(" ");
        const initials = nameParts.map((w) => w[0]).join("").slice(0, 2).toUpperCase();
        const avatarUrl = user.user_metadata?.avatar_url;
        const displayName = user.user_metadata?.full_name || user.email;

        return (
            <div className="flex items-center gap-2 pl-1.5 pr-3 py-1 border border-slate-200 rounded-full bg-white shadow-sm text-sm">
                {/* Avatar */}
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt={displayName}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover border-2 border-slate-200 flex-shrink-0"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {initials}
                    </div>
                )}

                {/* Name + session badge */}
                <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-slate-800 truncate max-w-[140px] leading-tight" title={user.email}>
                        {displayName}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-green-500 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_4px_#22c55e]" />
                        Session saved
                    </span>
                </div>

                {/* Sign out */}
                <button
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="flex items-center gap-1.5 ml-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {signingOut ? (
                        <>
                            <div className="w-3 h-3 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                            <span>Signing out…</span>
                        </>
                    ) : (
                        <>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            <span>Sign out</span>
                        </>
                    )}
                </button>
            </div>
        );
    }

    // ── Logged Out ─────────────────────────────────────────────────────────────
    return (
        <button
            onClick={handleSignIn}
            disabled={signingIn}
            className="flex items-center gap-2.5 px-5 py-2 bg-white border border-[#dadce0] rounded-full text-sm font-medium text-[#3c4043] shadow-sm hover:shadow-md hover:bg-gray-50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
            {signingIn ? (
                <>
                    <div className="w-4 h-4 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin" />
                    <span>Redirecting…</span>
                </>
            ) : (
                <>
                    <svg width="18" height="18" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span>Sign in with Google</span>
                </>
            )}
        </button>
    );
};

export default GoogleLogin;