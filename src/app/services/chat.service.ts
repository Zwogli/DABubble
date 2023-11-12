import { Injectable } from '@angular/core';
import { Message } from '../models/message.class';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  public leadingThreadMsg!: Message;

  constructor() {}

  setLeadingMsg(msg: Message) {
    this.leadingThreadMsg = msg;
  }
}
