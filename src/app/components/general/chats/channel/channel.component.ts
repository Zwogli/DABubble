import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { chatTypes } from 'src/app/interfaces/chats/types';
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
  private catchAttempts: number = 0;

  private componentIsDestroyed$ = new Subject<boolean>();

  constructor(
    private fireService: FirestoreService,
    private route: ActivatedRoute,
    private chatService: ChatService
  ) {
    this.setCurrentUser();
    this.setChatRecordId('channels');
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.componentIsDestroyed$.next(true);
    this.componentIsDestroyed$.complete();
  }

  /**
   * This function gets the url channel id of wether a channel or private chat
   * and searches for the corresponding document id of the chatRecord. On first
   * attempt it searches through the channels and then through the private Chats.
   *
   * @param colId - String literal to define in which collection in the Firestore
   *                the document should be searched for
   */
  async setChatRecordId(colId: 'channels' | 'privateChat') {
    const channelId = this.route.snapshot.paramMap.get('channelId');
    if (channelId) {
      await this.fireService
        .getSingleDoc(colId, channelId)
        .then((doc: any) => {
          if (doc.chatRecord) {
            this.chatRecordId = doc.chatRecord;
            this.currentChannel = doc;           
            this.chatService.setChatRecordId(doc.chatRecord);
          } else {
            console.log('Document holds no chatRecord id to reference to!');
          }
        })
        .catch(() => {
          if (this.catchAttempts === 0) {
            this.catchAttempts++;
            this.setChatRecordId('privateChat');
          }
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
