import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-main-chat',
  templateUrl: './main-chat.component.html',
  styleUrls: ['./main-chat.component.scss'],
})
export class MainChatComponent implements OnInit {
  testChatId: string = 'XJs8a192fOAERg5D9kJg';

  constructor(private fireService: FirestoreService) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.fireService.unsubSingleChat();
  }
}
