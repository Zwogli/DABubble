import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Message } from 'src/app/models/message.class';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-main-chat',
  templateUrl: './main-chat.component.html',
  styleUrls: ['./main-chat.component.scss'],
})
export class MainChatComponent implements OnInit {
  testChatId: string = 'yf80qNMJDA1smEm3J8aX';
  private componentIsDestroyed$ = new Subject<boolean>();

  public chatRecord!: Message[];
  selectedMsg!: Message | null;

  constructor(private fireService: FirestoreService) {}

  ngOnInit() {
    this.loadChatRecord();
  }

  ngOnDestroy() {
    this.fireService.unsubChatRecord();
  }

  loadChatRecord() {
    this.fireService.startSubChat(this.testChatId);
    this.fireService.singleChatRecord$
      .pipe(takeUntil(this.componentIsDestroyed$))
      .subscribe((chat: any[]) => {
        this.chatRecord = chat;
        console.log(chat);
      });
  }

  openThread(msg: Message, event: any) {
    if (msg != this.selectedMsg) {
      event.stopPropagation();
    }
    console.log('OpenThread');
  }

  toggleMsgMenu(msg: Message) {
    if (this.selectedMsg == msg) {
      this.selectedMsg = null;
    } else {
      this.selectedMsg = msg;
    }
  }

  openEmote(event: any) {
    event.stopPropagation();
    console.log('Clicked Emote-Btn');
  }
}
