import { Component, effect, signal } from '@angular/core';
import { ChatsService } from '../../supabase/chats.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.css'
})
export class DeleteModalComponent {
  dismiss = signal(false);
  constructor(
    private chatService: ChatsService,
    private router: Router
  ) {
    effect(()=>{
      console.log(this.chatService.savedChat());
      
    })
  }

  deleteChat() {
    const id = (this.chatService.savedChat() as {id: string}).id
    this.chatService.deleteChat(id).then(()=>{
      let currentUrl = this.router.url;
      console.log('currentUrl: ', currentUrl);

      this.dismiss.set(true);

      this.router
        .navigateByUrl('/', { skipLocationChange: true })
        .then(() => {
          this.router.navigate([currentUrl]);
        });
    }).catch((err)=>{
      alert(err)
    })
  }
}
