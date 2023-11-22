import { Injectable } from '@angular/core';
import { Message } from '../models/message.class';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  public leadingThreadMsg!: Message;

  private chatRecordIdSubject = new Subject<string>();
  chatRecordIdChanged$ = this.chatRecordIdSubject.asObservable();

  constructor() {  }

  setLeadingMsg(msg: Message) {
    this.leadingThreadMsg = msg;
  }

  setChatRecordId(chatRecordId: string) {
    this.chatRecordIdSubject.next(chatRecordId);
  }
}
