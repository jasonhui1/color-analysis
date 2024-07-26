import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export async function getUserId() {
    const { data: { user } } = await supabase.auth.getUser()

    return user.id
}

export async function googleSignIn(token) {
    const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: token,
    })

    console.log('Logged In! :>> ', data.user.email);
    return { data, error }
}


export default supabase;
