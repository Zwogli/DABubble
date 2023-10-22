export class Message {
  id: string;
  sentById: string;
  sentByName: string;
  sentByPhotoUrl: string;
  sentAt: any;
  thread: string;
  message: string;

  constructor() {
    this.id = '';
    this.sentById = '';
    this.sentByName = '';
    this.sentByPhotoUrl = '';
    this.sentAt = '';
    this.thread = '';
    this.message = '';
  }
}
