import { User } from 'src/app/models/user.class';

export type ChatTypes = 'channel' | 'thread' | 'private';

export interface AvatarConfig {
  user: User;
  showStatus: boolean;
  size: 'xsmall' | 'small' | 'medium' | 'large';
}
