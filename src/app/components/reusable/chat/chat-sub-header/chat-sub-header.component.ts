import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Channel } from 'src/app/models/channel.class';
import { ChatService } from 'src/app/services/chat.service';
import { AvatarConfig } from 'src/app/interfaces/chats/types';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/models/user.class';

@Component({
  selector: 'app-chat-sub-header',
  templateUrl: './chat-sub-header.component.html',
  styleUrls: ['./chat-sub-header.component.scss'],
})
export class ChatSubHeaderComponent implements OnInit, OnDestroy {
  @Input() type!: string;
  @Input() channel!: Channel;
  @Input() privateChatOpponentUser!: User;
  @Input() privateChatAvatarConfig!: AvatarConfig;

  private componentIsDestroyed$ = new Subject<boolean>();

  public currentUser!: User;

  constructor(
    private chatService: ChatService,
    private fireService: FirestoreService
  ) {}

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
      });
  }

  navigateBack(): void {
    this.chatService.navigateBack('thread');
  }
}
