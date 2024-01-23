import { Injectable, OnDestroy, inject } from '@angular/core';
import {
  Firestore,
  query,
  collection,
  where,
  getDoc,
  doc,
  getDocs,
  onSnapshot,
} from '@angular/fire/firestore';
import { User } from '../models/user.class';
import { FirestoreService } from './firestore.service';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { IMessagePanel } from '../interfaces/chats/types';
import {
  privatChatConverter,
  userConverter,
} from '../interfaces/firestore/converter';
import { Chat } from '../models/chat.class';
import { Unsubscribe } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class SidebarService implements OnDestroy {
  firestore: Firestore = inject(Firestore);
  firestoreService: FirestoreService = inject(FirestoreService);

  private currentUserIsDestroyed$ = new Subject<boolean>();
  public currentUser!: User;
  public privateChats: Chat[] = [];
  public privateChatsPanelData: IMessagePanel[] = [];
  public docIdsForQuerySnapUser: string[] = [];
  public docIdsForQuerySnapRecord: string[] = [];

  public privateChatsPanelDataSubject: BehaviorSubject<IMessagePanel[]> =
    new BehaviorSubject<IMessagePanel[]>([]);

  private unsubSidebarPanelUser!: Unsubscribe;

  constructor() {
    this.firestoreService.currentUser$
      .pipe(takeUntil(this.currentUserIsDestroyed$))
      .subscribe((user: User) => {
        this.currentUser = user;
        this.loadPrivateChats();
      });
  }

  ngOnDestroy(): void {
    this.currentUserIsDestroyed$.next(true);
    this.currentUserIsDestroyed$.complete();
    this.privateChatsPanelDataSubject.complete();
    this.unsubSidebarPanelUser();
  }

  async loadPrivateChats() {
    // Ignores before first emit from currentUser
    if (!this.currentUser) return;

    // Query for all privateChat Documents from User
    const q = query(
      collection(this.firestore, 'privateChat'),
      where('id', 'in', this.currentUser.activePrivateChats)
    ).withConverter(privatChatConverter);

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (
        // Cancel if object is already in Array
        this.privateChats.some((chat: Chat) => chat.id === doc.data()['id'])
      ) {
        return;
      } else {
        // Push in stack Array
        this.privateChats.push(doc.data());
      }
    });
    this.loadUserFromPrivateChats();
  }

  async loadUserFromPrivateChats() {
    this.docIdsForQuerySnapUser = [];
    this.docIdsForQuerySnapRecord = [];
    console.log(this.privateChats);

    this.privateChats.forEach((chat: Chat) => {
      if (
        // Determine if chat is chat of the user itself and if its already in the array
        chat.chatBetween.length === 1 &&
        !this.privateChatsPanelData.some(
          (chat: IMessagePanel) => chat.id === this.currentUser.id
        )
      ) {
        // Define data and push to Template Array that gets rendered
        const selfData = {
          id: this.currentUser.id,
          chatWith: this.currentUser,
        };
        this.privateChatsPanelData.push(selfData);
      } else {
        // Chat is with another user
        const index = chat.chatBetween.indexOf(this.currentUser.id);
        console.log(chat.chatBetween);

        // Find index of the other user
        if (chat.chatBetween.length > 1 && index === 0) {
          this.docIdsForQuerySnapUser.push(chat.chatBetween[1]);
          this.docIdsForQuerySnapRecord.push(chat.id);
        } else {
          this.docIdsForQuerySnapUser.push(chat.chatBetween[0]);
          this.docIdsForQuerySnapRecord.push(chat.id);
        }
      }
      console.log(chat);
    });

    try {
      console.log('Array for query snap ', this.docIdsForQuerySnapUser);
      console.log('Array for query snap ', this.docIdsForQuerySnapRecord);

      const q = query(
        collection(this.firestore, 'user'),
        where('id', 'in', this.docIdsForQuerySnapUser)
      ).withConverter(userConverter);

      let userData: IMessagePanel;
      this.unsubSidebarPanelUser = onSnapshot(q, (querySnapshot) => {
        this.privateChatsPanelData = [];

        let chatRecord: string;
        querySnapshot.forEach((user) => {
          user.data().activePrivateChats.forEach((str) => {
            this.privateChats.includes(str);
            chatRecord = str;
          });

          userData = {
            id: chatRecord,
            chatWith: user.data(),
          };

          console.log('User to push in render arr ', user.data());

          if (userData.id === this.currentUser.id) {
            this.privateChatsPanelData.unshift(userData);
          } else {
            this.privateChatsPanelData.push(userData);
          }

          console.log(
            'before emit to render subject ',
            this.privateChatsPanelData
          );
          // Emit to subject
          this.privateChatsPanelDataSubject.next(this.privateChatsPanelData);
        });
      });
    } catch (error) {}

    // try {
    //   await getDoc(
    //     doc(this.firestore, 'user', userId).withConverter(userConverter)
    //   ).then((user) => {
    //     userData = {
    //       id: chat.id,
    //       chatWith: user.data()!,
    //     };
    //     if (
    //       // Cancel if object is already in Template array
    //       this.privateChatsPanelData.some(
    //         (chat: IMessagePanel) => chat.id === userData.id
    //       )
    //     ) {
    //       return;
    //     } else {
    //       this.privateChatsPanelData.push(userData);
    //     }
    //   });
    // } catch (error) {}
  }
}
