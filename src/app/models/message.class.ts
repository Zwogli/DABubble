export class Message {
  id: string;
  message: string;
  sentById: string;
  sentByName: string;
  sentByPhotoUrl: string;
  sentAt: any;
  file: string;
  thread: {
    id: string;
    length: number;
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
    this.file = '';
    this.thread = {
      id: '',
      length: 0,
      lastAnswer: '',
    };
    this.reactedBy = [];
  }
}
