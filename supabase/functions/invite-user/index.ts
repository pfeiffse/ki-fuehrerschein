// Supabase Edge Function: invite-user
// Erstellt Lehrkraft-Accounts mit Benutzername+Passwort (keine echte E-Mail noetig)
// Oder sendet Einladungsmail wenn E-Mail angegeben

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Anfragenden User pruefen (muss Superadmin sein)
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

    const { data: profile } = await supabaseAdmin
      .from('users').select('role').eq('id', user.id).single()

    if (!profile || profile.role !== 'superadmin') {
      return new Response(JSON.stringify({ error: 'Nur Superadmins dürfen Accounts anlegen.' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { displayName, role, schoolId, mode, email, username, password } = await req.json()

    if (!displayName || !role) {
      return new Response(JSON.stringify({ error: 'Name und Rolle sind erforderlich.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    let newUserId = null
    let successMessage = ''

    if (mode === 'username') {
      // Benutzername + Passwort (keine echte E-Mail)
      if (!username || !password) {
        return new Response(JSON.stringify({ error: 'Benutzername und Passwort sind erforderlich.' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      if (password.length < 8) {
        return new Response(JSON.stringify({ error: 'Passwort muss mindestens 8 Zeichen haben.' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Interne Fake-E-Mail aus Benutzername
      const fakeEmail = username.toLowerCase().replace(/[^a-z0-9]/g, '') + '@ki-fuehrerschein.intern'

      const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: fakeEmail,
        password: password,
        email_confirm: true, // Sofort aktiv, keine Bestaetigungsmail
        user_metadata: { display_name: displayName, role, username }
      })

      if (createError) {
        if (createError.message.includes('already registered') || createError.message.includes('already exists')) {
          return new Response(JSON.stringify({ error: 'Dieser Benutzername ist bereits vergeben.' }), {
            status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        return new Response(JSON.stringify({ error: 'Fehler: ' + createError.message }), {
          status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      newUserId = createData.user.id
      successMessage = `Account für "${displayName}" angelegt. Benutzername: ${username}`

    } else {
      // E-Mail-Einladung
      if (!email) {
        return new Response(JSON.stringify({ error: 'E-Mail-Adresse ist erforderlich.' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
        email,
        {
          redirectTo: `${Deno.env.get('SITE_URL') ?? 'https://pfeiffse.github.io/ki-fuehrerschein'}/lehrer`,
          data: { display_name: displayName, role }
        }
      )

      if (inviteError) {
        if (inviteError.message.includes('already registered')) {
          return new Response(JSON.stringify({ error: 'Diese E-Mail-Adresse ist bereits registriert.' }), {
            status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        return new Response(JSON.stringify({ error: 'Einladung fehlgeschlagen: ' + inviteError.message }), {
          status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      newUserId = inviteData.user.id
      successMessage = `Einladung an ${email} gesendet. ${displayName} erhält eine E-Mail mit einem Link zum Passwort setzen.`
    }

    // users-Eintrag anlegen
    if (newUserId) {
      await supabaseAdmin.from('users').insert({
        id:           newUserId,
        school_id:    schoolId || '00000000-0000-0000-0000-000000000001',
        role:         role,
        display_name: displayName,
      }).catch(err => console.error('users-Eintrag:', err))
    }

    return new Response(JSON.stringify({ success: true, message: successMessage, userId: newUserId }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Interner Fehler: ' + err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})