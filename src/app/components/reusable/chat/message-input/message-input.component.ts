import { Component, Input } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Message } from 'src/app/models/message.class';
import { chatTypes } from 'src/app/interfaces/chats/types';
import { ChatService } from 'src/app/services/chat.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.scss'],
})
export class MessageInputComponent {
  @Input() currentChatRecordId!: string;
  @Input() parentChat!: chatTypes;
  public msgPayload!: string;
  public fileToUpload!: any;

  constructor(
    private fireService: FirestoreService,
    private chatService: ChatService
  ) {}

  /**
   * Sends the message to the corresponding chatRecord and checks if
   * the given chatRecord is for a thread or not. If so, the meta data
   * for the thread gets updated accordingly.
   *
   */
  sendMessage() {
    if (!this.msgPayload) return;
    const data = new Message(this.setMsgData());
    this.fireService.addMessage(
      this.currentChatRecordId,
      data,
      this.fileToUpload
    );
    this.msgPayload = '';
    this.toggleThumbnail();
    this.checkParentType();
  }

  setMsgData() {
    const user = this.fireService.currentUser;
    return {
      message: this.msgPayload,
      sentById: user.id,
      sentByName: user.name,
      sentByPhotoUrl: user.photoUrl,
    };
  }

  checkParentType() {
    if (this.parentChat === 'thread') {
      this.chatService.updateThreadMetaData();
    }
  }

  openFileUpload() {
    document.getElementById('fileUpload')?.click();
  }

  /**
   * This function gets triggered when a file is selected via the
   * html file input. Then sets a preview of the file to show in
   * the text message field
   *
   * @param event - File input from HTML Node
   */
  onFileChange(event: any) {
    this.fileToUpload = event.target;
    let src = URL.createObjectURL(this.fileToUpload.files[0]);
    this.toggleThumbnail(src);
  }

  toggleThumbnail(src?: string) {
    let thumbnail = document.getElementById('filePreview')!;

    src
      ? thumbnail.setAttribute('src', src)
      : thumbnail.setAttribute('src', '');
  }
}
