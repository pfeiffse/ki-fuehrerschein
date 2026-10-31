// Supabase Edge Function: invite-user
// Sendet Einladungsmail und legt users-Eintrag an
// Wird nur von authentifizierten Superadmins aufgerufen

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Supabase Admin Client (Service Role)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Anfragenden User prüfen (muss Superadmin sein)
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Nicht autorisiert.' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Ungültiger Token.' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Prüfen ob anfragender User Superadmin ist
    const { data: profile } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'superadmin') {
      return new Response(JSON.stringify({ error: 'Nur Superadmins dürfen Einladungen versenden.' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Einladungsdaten aus Request
    const { email, displayName, role, schoolId } = await req.json()

    if (!email || !displayName || !role) {
      return new Response(JSON.stringify({ error: 'E-Mail, Name und Rolle sind erforderlich.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (!['teacher', 'superadmin'].includes(role)) {
      return new Response(JSON.stringify({ error: 'Ungültige Rolle.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Einladungsmail senden (Supabase Auth)
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      email,
      {
        redirectTo: `${Deno.env.get('SITE_URL') ?? 'https://pfeiffse.github.io/ki-fuehrerschein'}/lehrer`,
        data: { display_name: displayName, role }
      }
    )

    if (inviteError) {
      // Prüfen ob User bereits existiert
      if (inviteError.message.includes('already registered')) {
        return new Response(JSON.stringify({ error: 'Diese E-Mail-Adresse ist bereits registriert.' }), {
          status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      return new Response(JSON.stringify({ error: 'Einladung fehlgeschlagen: ' + inviteError.message }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // users-Eintrag anlegen
    const { error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        id:           inviteData.user.id,
        school_id:    schoolId || '00000000-0000-0000-0000-000000000001',
        role:         role,
        display_name: displayName,
      })

    if (userError && !userError.message.includes('duplicate')) {
      console.error('users-Eintrag Fehler:', userError)
      // Nicht kritisch – Einladung wurde bereits gesendet
    }

    return new Response(JSON.stringify({
      success: true,
      message: `Einladung an ${email} gesendet. ${displayName} erhält eine E-Mail mit einem Link zum Passwort setzen.`,
      userId: inviteData.user.id,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Interner Fehler: ' + err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})