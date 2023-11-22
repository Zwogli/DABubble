import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Unsubscribe } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Observable,
  Subject,
  Subscription,
  Unsubscribable,
  takeUntil,
} from 'rxjs';
import { Channel } from 'src/app/models/channel.class';
import { Message } from 'src/app/models/message.class';
import { User } from 'src/app/models/user.class';
import { ChatService } from 'src/app/services/chat.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss'],
})
export class ChannelComponent implements OnInit {
  public currentUser!: User;
  public currentChannel!: Channel;
  public chatRecordId!: string;

  private componentIsDestroyed$ = new Subject<boolean>();

  constructor(
    private fireService: FirestoreService,
    private route: ActivatedRoute,
    private router: Router,
    private chatService: ChatService
  ) {
    this.setCurrentUser();
    this.setChatRecordId();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.componentIsDestroyed$.next(true);
    this.componentIsDestroyed$.complete();
  }

  async setChatRecordId() {
    const channelId = this.route.snapshot.paramMap.get('channelId');
    if (channelId) {
      await this.fireService
        .getSingleDoc('channels', channelId)
        .then((doc: any) => {
          this.chatRecordId = doc.chatRecord;
          this.currentChannel = doc;
          this.chatService.setChatRecordId(doc.chatRecord)
        });
    }
  }

  setCurrentUser() {
    this.fireService.currentUser$
      .pipe(takeUntil(this.componentIsDestroyed$))
      .subscribe((user: User) => {
        this.currentUser = user;
      });
  }

  startThread(msg: Message) {
    this.chatService.setLeadingMsg(msg);
    this.router.navigate(['/thread/', msg.id, this.currentChannel.id]);
  }
}
