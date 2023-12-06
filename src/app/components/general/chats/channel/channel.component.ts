import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Subject,
  Subscription,
  takeUntil,
} from 'rxjs';
import { Channel } from 'src/app/models/channel.class';
import { Message } from 'src/app/models/message.class';
import { User } from 'src/app/models/user.class';
import { BreakpointObserverService } from 'src/app/services/breakpoint-observer.service';
import { ChatService } from 'src/app/services/chat.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss'],
})
export class ChannelComponent implements OnInit {
  private subscription: Subscription;
  mobileView: boolean = false;
  public currentUser!: User;
  public currentChannel!: Channel;
  public chatRecordId!: string;

  private componentIsDestroyed$ = new Subject<boolean>();

  constructor(
    private fireService: FirestoreService,
    private route: ActivatedRoute,
    private chatService: ChatService,
    public responsiveService: BreakpointObserverService, 
  ) {
    this.setCurrentUser();
    this.setChatRecordId();
    this.subscription = this.responsiveService.mobileView$.subscribe(
      visible => {
        this.mobileView = visible;
      });
  }

  ngOnInit() {}

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
          this.chatService.setChatRecordId(doc.chatRecord);
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
    this.chatService.startThreadFromChannel(
      msg.id,
      this.currentChannel.id,
      this.currentChannel.chatRecord
    );
  }
}
