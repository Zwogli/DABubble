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

  constructor(data: any) {
    this.id = '';
    this.message = data.message || '';
    this.sentById = data.sentById || '';
    this.sentByName = data.sentByName || '';
    this.sentByPhotoUrl = data.sentByPhotoUrl || '';
    this.sentAt = '';
    this.thread = {
      id: '',
      length: '',
      lastAnswer: '',
    };
    this.reactedBy = [];
  }
}
