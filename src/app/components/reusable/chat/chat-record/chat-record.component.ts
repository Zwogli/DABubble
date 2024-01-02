import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ChatTypes } from 'src/app/interfaces/chats/types';
import { Message } from 'src/app/models/message.class';
import { User } from 'src/app/models/user.class';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat-record',
  templateUrl: './chat-record.component.html',
  styleUrls: ['./chat-record.component.scss'],
})
export class ChatRecordComponent
  implements OnInit, OnDestroy, AfterViewChecked, OnChanges
{
  @Input() chatRecordId!: string;
  @Input() currentUser!: User;
  @Input() parentType!: ChatTypes;
  @Output('startThread') startThread: EventEmitter<any> = new EventEmitter();
  @Output('chatRecordLength') chatRecordLength: EventEmitter<number> =
    new EventEmitter();

  public selectedMsg!: Message | null;
  public today: Date = new Date();
  public chatRecord!: Message[];
  public fileURL!: string;

  public showEditMsgMenu: boolean = false;
  public showEditMsgInput!: Message | null;
  public editMsgPayload!: string;

  private componentIsDestroyed$ = new Subject<boolean>();

  constructor(
    private chatService: ChatService,
    private changeDetector: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {
    this.chatRecord = [];
  }

  ngOnInit() {
    if (this.parentType === 'thread') {
      this.chatService.threadChatRecordIdChanged$.subscribe((chatRecordId) => {
        this.chatRecordId = chatRecordId;
        this.loadChatRecord();
      });
    } else {
      this.chatService.chatRecordIdChanged$.subscribe((chatRecordId) => {
        this.chatRecordId = chatRecordId;
        this.loadChatRecord();
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    
  }

  ngOnDestroy() {
    this.componentIsDestroyed$.next(true);
    this.componentIsDestroyed$.complete();
  }

  ngAfterViewChecked() {
    // Prevents initial scroll-state on chat div to throw err
    setTimeout(() => {
      this.changeDetector.detectChanges();
    }, 500);
  }

  loadChatRecord() {
    if (this.parentType === 'thread') {
      this.chatService.startSubThreadChat(this.chatRecordId);
      this.chatService.threadChatRecord$
        .pipe(takeUntil(this.componentIsDestroyed$))
        .subscribe((chat: Message[]) => {
          this.chatRecord = chat;
          this.checkChatRecordLength();
        });
    } else {
      this.chatService.startSubChat(this.chatRecordId);
      this.chatService.chatRecord$
        .pipe(takeUntil(this.componentIsDestroyed$))
        .subscribe((chat: Message[]) => {
          this.chatRecord = chat;
          this.checkChatRecordLength();
        });
    }
  }

  checkChatRecordLength() {
    if (this.chatRecord) {
      this.chatRecordLength.emit(this.chatRecord.length);
    }
  }

  openThread(msg: Message, event: any) {
    if (msg != this.selectedMsg) {
      event.stopPropagation();
    }
    const channelId = this.route.snapshot.paramMap.get('channelId')!;
    this.chatService.openThread(msg, channelId);
  }

  toggleMsgMenu(msg: Message) {
    if (this.selectedMsg === msg) {
      this.selectedMsg = null;
    } else {
      this.selectedMsg = msg;
    }
  }

  /**
   * This function validates wether or not the current message is the first
   * one of the day. Returns boolean to render the given Date-Pill to the template
   *
   * @param msg - current message from ngFor Loop
   * @param i - current index of message from ngFor Loop
   */
  isFirstMsgOfDay(msg: Message, i: number): boolean {
    if (i > 0) {
      const currentMsgDate = msg.sentAt.toDate().toDateString();
      const prevMsgDate = this.chatRecord[i - 1].sentAt.toDate().toDateString();
      return currentMsgDate != prevMsgDate;
    } else {
      return false;
    }
  }

  loadFile(url: string) {
    this.chatService.openFile(url);
  }

  openEditMsgMenu(event: any) {
    event.stopPropagation();
    this.toggleEditMsgMenu();
  }

  toggleEditMsgMenu() {
    this.showEditMsgMenu = !this.showEditMsgMenu;
  }

  editMsg(msg: Message) {
    this.toggleEditMsgMenu();
    this.showEditMsgInput = msg;
    this.editMsgPayload = msg.message;
  }

  closeEditInput(msg: Message) {
    this.showEditMsgInput = null;
    this.toggleMsgMenu(msg)
  }

  stopPropagation(event: any) {
    event.stopPropagation();
  }
}
