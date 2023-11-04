import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Channel } from 'src/app/models/channel.class';
import { Message } from 'src/app/models/message.class';
import { User } from 'src/app/models/user.class';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-main-chat',
  templateUrl: './main-chat.component.html',
  styleUrls: ['./main-chat.component.scss'],
})
export class MainChatComponent implements OnInit {
  private componentIsDestroyed$ = new Subject<boolean>();
  public currentUser: User;
  chatRecordId!: string;
  public chatRecord!: Message[];
  selectedMsg!: Message | null;
  public msgContent!: string;

  constructor(
    private fireService: FirestoreService,
    private route: ActivatedRoute,
    private changeDetector: ChangeDetectorRef
  ) {
    this.currentUser = this.fireService.currentUser;
  }

  ngOnInit() {
    this.setChatRecordId();
  }

  ngAfterViewChecked() {
    // Prevents initial scroll-state on chat div to throw err
    this.changeDetector.detectChanges();
  }

  ngOnDestroy() {
    this.fireService.unsubChatRecord();
    this.componentIsDestroyed$.next(true);
    this.componentIsDestroyed$.complete();
  }

  async setChatRecordId() {
    const channelId = this.route.snapshot.paramMap.get('id');
    if (channelId) {
      await this.fireService
        .getSingleDoc('channels', channelId)
        .then((doc: any) => {
          this.chatRecordId = doc.chatRecord;
          this.loadChatRecord();
        });
    }
  }

  loadChatRecord() {
    this.fireService.startSubChat(this.chatRecordId);
    this.fireService.singleChatRecord$
      .pipe(takeUntil(this.componentIsDestroyed$))
      .subscribe((chat: Message[]) => {
        this.chatRecord = chat;
        console.log('Messages recieved from service. ', chat);
      });
  }

  sendMessage() {
    const data = new Message(this.setMsgData());
    this.fireService.addMessage(this.chatRecordId, data);
    this.msgContent = '';

    console.log(this.msgContent);
    console.log('msg send');
  }

  setMsgData() {
    const user = this.fireService.currentUser;

    return {
      message: this.msgContent,
      sentById: user.id,
      sentByName: user.name,
      sentByPhotoUrl: user.photoUrl,
    };
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
}
