import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Channel } from 'src/app/models/channel.class';
import { ChatService } from 'src/app/services/chat.service';
import { AvatarConfig, chatTypes } from 'src/app/interfaces/chats/types';
import { ActivatedRoute } from '@angular/router';
import { DocumentData } from '@angular/fire/firestore';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/models/user.class';

@Component({
  selector: 'app-chat-sub-header',
  templateUrl: './chat-sub-header.component.html',
  styleUrls: ['./chat-sub-header.component.scss'],
})
export class ChatSubHeaderComponent implements OnInit, OnDestroy {
  @Input() type!: chatTypes;
  @Input() channel!: Channel;
  public mainType: string;
  private currentUser!: User;
  public privateChatOpponentUser!: User;
  private componentIsDestroyed$ = new Subject<boolean>();
  public privateChatAvatarConfig!: AvatarConfig;

  constructor(
    private chatService: ChatService,
    private fireService: FirestoreService,
    private route: ActivatedRoute
  ) {
    const channelType: string = this.route.snapshot.paramMap.get('type')!;
    this.mainType = channelType;
  }

  ngOnInit(): void {
    this.setCurrentUser();
  }

  ngOnDestroy() {
    this.componentIsDestroyed$.next(true);
    this.componentIsDestroyed$.complete();
  }

  setCurrentUser() {
    this.fireService.currentUser$
      .pipe(takeUntil(this.componentIsDestroyed$))
      .subscribe((user: User) => {
        this.currentUser = user;
        if (this.mainType === 'private') {
          this.setChatPartner();
        }
      });
  }

  setChatPartner() {
    const channelId: string = this.route.snapshot.paramMap.get('channelId')!;
    this.chatService
      .getUserDataFromPrivateChat(channelId)
      .then((privateChat: DocumentData | undefined) => {
        if (privateChat && this.currentUser) {
          console.log('Private Chat found', privateChat);

          const chatBetween: string[] = privateChat['chatBetween'];
          if (privateChat['id'] === this.currentUser.id) {
            console.log('Private Chat with yourself');
            this.privateChatOpponentUser = this.currentUser;
            this.setAvatarConfigData();
          } else {
            console.log('Private chat with someone else');
            const currentUserIndex = chatBetween.indexOf(this.currentUser.id);
            chatBetween.splice(currentUserIndex, 1);
            this.fireService
              .getUserDoc('user', chatBetween[0])
              .then((user: User | undefined) => {
                if (user) {
                  this.privateChatOpponentUser = user;
                  this.setAvatarConfigData();
                  console.log(this.privateChatOpponentUser);
                }
              });
          }
        }
      });
  }

  setAvatarConfigData() {
    this.privateChatAvatarConfig = {
      user: this.privateChatOpponentUser,
      showStatus: true,
    };
  }

  navigateBack(): void {
    this.chatService.navigateBack('thread');
  }
}
