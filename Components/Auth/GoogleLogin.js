import { googleSignIn } from "../../lib/clientApis/supabaseClient";
import { useEffect, useState } from "react";

async function handleSignInWithGoogle(response) {
    const { data, error } = googleSignIn(response.credential)
}

// Assign the function to the window object
if (typeof window !== "undefined") {
    window.handleSignInWithGoogle = handleSignInWithGoogle;
}

const GoogleLogin = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <>
            <div id="g_id_onload"
                data-client_id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
                data-context="signin"
                data-ux_mode="popup"
                data-callback="handleSignInWithGoogle"
                data-auto_prompt="false">
            </div>

            <div className="g_id_signin"
                data-type="standard"
                data-shape="rectangular"
                data-theme="outline"
                data-text="signin_with"
                data-size="large"
                data-logo_alignment="left">
            </div>
        </>
    )
}

export default GoogleLogin