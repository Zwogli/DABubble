export class Channel {
    id: string;
    name: string;
    description: string;
    chatRecord: string;
    createdAt: any;
    createdBy: string;
    member: [];
  
    constructor(data: any) {
        this.id = data.id || '';
        this.name = '';
        this.description = '';
        this.chatRecord = '';
        this.createdAt = '';
        this.createdBy = '';
        this.member = [];
    }
  }
  