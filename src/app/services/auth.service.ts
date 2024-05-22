import { Injectable, NgZone } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase!: SupabaseClient
  constructor(
    private router: Router,
    private _ngZone: NgZone
  ) {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    )

    this.supabase.auth.onAuthStateChange((event, session) => {
      localStorage.setItem('session', JSON.stringify(session?.user))
      if (session?.user) {
        this._ngZone.run(() => {
          this.router.navigate(['/chat'])
        })
      }
    })
   }

   async signInGoogle() {
    this.supabase.auth.signInWithOAuth({
      provider: 'google'
    })
   }

   get isLoggedIn(): boolean {
    const user = localStorage.getItem('session') as string
    return user === 'undefined' ? false : true;
   }

   async signOutGoogle() {
    this.supabase.auth.signOut()
   }
}
