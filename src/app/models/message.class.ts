export class Message {
  id: string;
  sentById: string;
  sentByName: string;
  sentByPhotoUrl: string;
  sentAt: any;
  thread: {
    id: string;
    length: string;
  };
  message: string;

  constructor() {
    this.id = '';
    this.sentById = '';
    this.sentByName = '';
    this.sentByPhotoUrl = '';
    this.sentAt = '';
    this.thread = {
      id: '',
      length: '',
    };
    this.message = '';
  }
}
