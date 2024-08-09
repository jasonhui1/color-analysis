import { createClient } from '@supabase/supabase-js';
const supabaseClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export async function getUserId() {
    const { data: { user } } = await supabaseClient.auth.getUser()

    return user?.id
}

export async function googleSignIn(token) {
    const { data, error } = await supabaseClient.auth.signInWithIdToken({
        provider: 'google',
        token: token,
    })

    console.log('Logged In! :>> ', data.user.email);
    console.log('userId :>> ', await getUserId());
    return { data, error }
}


export default supabaseClient;
