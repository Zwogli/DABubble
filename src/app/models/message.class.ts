export class Message {
  id: string;
  message: string;
  sentById: string;
  sentByName: string;
  sentByPhotoUrl: string;
  sentAt: any;
  thread: {
    id: string;
    length: string;
    lastAnswer: any;
  };
  reactedBy: {
    id: string;
    emoteUrl: string;
  }[];

  constructor() {
    this.id = '';
    this.message = '';
    this.sentById = '';
    this.sentByName = '';
    this.sentByPhotoUrl = '';
    this.sentAt = '';
    this.thread = {
      id: '',
      length: '',
      lastAnswer: '',
    };
    this.reactedBy = [];
  }
}
