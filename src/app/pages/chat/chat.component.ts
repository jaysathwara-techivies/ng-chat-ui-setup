import { Component, effect, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChatsService } from '../../supabase/chats.service';
import { Ichat } from '../../interface/chat-response';
import { DatePipe } from '@angular/common';
import { DeleteModalComponent } from '../../layout/delete-modal/delete-modal.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, DeleteModalComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {

  chatForm!:FormGroup;
  chats = signal<Ichat[]>([])
  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private chatService: ChatsService
  ) {
    this.createForom()

    effect(() =>{
      this.onListChat()
    })
  }

  async handleSignOut() {
    this.authService.signOutGoogle().then(()=>{
      this.router.navigate(['/login'])
    }).catch((err)=>{
      alert(err)
    })
  }

  createForom() {
    this.chatForm = this.formBuilder.group({
      chat_message: ['', Validators.required]
    })
  }

  onSubmit() {
    let value =this.chatForm.value.chat_message
    this.chatService.chatMessage(value).then((res)=>{
      this.chatForm.reset()
      this.onListChat()
    }).catch((err)=>{
      alert(err)
    })
  }

  onListChat() {
    this.chatService.listChat().then((res: Ichat[] | null) =>{
      if (res !== null) {
        console.log('res: ', res);
        this.chats.set(res);
      } else {
        console.log('No messages Found');
      }}).catch((err)=>{
      alert(err)
    })
  }

  openDropDown(msg: Ichat) {
    console.log(msg);
    this.chatService.selectedChats(msg);
  }
}
