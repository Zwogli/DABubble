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

  constructor(private fireService: FirestoreService) {}

  ngOnInit() {
    this.loadChatRecord();
  }

  ngOnDestroy() {}

  loadChatRecord() {
    this.fireService.startSubChat(this.testChatId);
    this.fireService.singleChatRecord$
      .pipe(takeUntil(this.componentIsDestroyed$))
      .subscribe((chat: any[]) => {
        this.chatRecord = chat;
        this.convertTimestampToDate();
        console.log(chat);
      });
  }

  convertTimestampToDate() {
    this.chatRecord.forEach((msg) => {
      let convertTime = msg.sentAt.toDate().toLocaleTimeString();
      msg.sentAt = convertTime;
    });
  }
}
