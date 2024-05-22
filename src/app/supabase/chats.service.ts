import { Injectable, signal } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';
import { Ichat } from '../interface/chat-response';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {
  private supabase!: SupabaseClient
  public savedChat = signal({});

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    )
  }

  async chatMessage(text: string) {
    try {
      const { data, error} = await this.supabase.from('chat').insert({
        text
      })
      if (error) {
        console.log('error: ', error);
        alert(error.message)
      }
      // return data
    } catch (error) {
      alert(error)
    }
  }

  async listChat() {
    try {
      const { data, error } = await this.supabase
        .from('chat')
        .select('*,users(*)');

      if (error) {
        alert(error.message);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  selectedChats(msg: Ichat) {
    this.savedChat.set(msg);
  }

  async deleteChat(id: string) {
    const data = await this.supabase.from('chat').delete().eq('id', id);

    return data;
  }
}
