import { User } from 'src/app/models/user.class';

export type chatTypes = 'channel' | 'thread' | 'private';

export interface AvatarConfig {
  user: User;
  showStatus: boolean;
}
