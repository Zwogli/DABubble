import { User } from "src/app/models/user.class";

export const userConverter = {
    toFirestore: (user: User) => {
      return {
        name: user.name,
        email: user.email,
        id: user.id,
        photoUrl: user.photoUrl,
        onlineStatus: user.onlineStatus,
        memberInChannel: user.memberInChannel,
        activePrivateChats: user.activePrivateChats,
      };
    },
    fromFirestore: (snapshot: any, options: any) => {
      const data = snapshot.data(options);
      return new User(data);
    },
  };