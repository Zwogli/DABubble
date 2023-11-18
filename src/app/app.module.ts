import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeDE from '@angular/common/locales/de';
registerLocaleData(localeDE, 'de');

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';

import { MaterialModule } from './custom_modules/material.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './components/general/sidenav/navbar/navbar.component';
import { NavbarHeaderMobileComponent } from './components/general/sidenav/navbar-header-mobile/navbar-header-mobile.component';
import { NavbarPanelChannelsComponent } from './components/general/sidenav/navbar-panel-channels/navbar-panel-channels.component';
import { NavbarPanelMessageComponent } from './components/general/sidenav/navbar-panel-message/navbar-panel-message.component';
import { NavbarSearchbarComponent } from './components/general/sidenav/navbar-searchbar/navbar-searchbar.component';
import { DialogProfilComponent } from './components/reusable/dialog-profil/dialog-profil.component';
import { IntroComponent } from './components/general/auth/intro/intro.component';
import { SignInComponent } from './components/general/auth/sign-in/sign-in.component';

import { ChannelComponent } from './components/general/chats/channel/channel.component';
import { SignUpComponent } from './components/general/auth/sign-up/sign-up.component';
import { ChooseAvatarComponent } from './components/general/auth/choose-avatar/choose-avatar.component';
import { DialogProfilEditComponent } from './components/reusable/dialog-profil-edit/dialog-profil-edit.component';
import { ForgotPasswordComponent } from './components/general/auth/forgot-password/forgot-password.component';
import { CreateChannelComponent } from './components/general/sidenav/create-channel/create-channel.component';
import { ResetPasswordComponent } from './components/general/auth/reset-password/reset-password.component';

import { MessageInputComponent } from './components/reusable/message-input/message-input.component';
import { ThreadComponent } from './components/general/chats/thread/thread.component';


import { DialogOverlayComponent } from './components/reusable/dialog-overlay/dialog-overlay.component';
import { DialogProfilMenuComponent } from './components/reusable/dialog-profil-menu/dialog-profil-menu.component';
import { DialogNewChatComponent } from './components/reusable/dialog-new-chat/dialog-new-chat.component';
import { DialogNewChannelComponent } from './components/reusable/dialog-new-channel/dialog-new-channel.component';


@NgModule({
  declarations: [
    AppComponent,
    IntroComponent,
    ChannelComponent,
    NavbarComponent,
    NavbarHeaderMobileComponent,
    NavbarPanelChannelsComponent,
    NavbarPanelMessageComponent,
    NavbarSearchbarComponent,
    SignInComponent,
    SignUpComponent,
    ChooseAvatarComponent,
    DialogProfilComponent,
    DialogProfilEditComponent,
    ForgotPasswordComponent,
    CreateChannelComponent,
    ResetPasswordComponent,
    MessageInputComponent,
    ThreadComponent,
    DialogOverlayComponent,
    DialogProfilMenuComponent,
    DialogNewChatComponent,
    DialogNewChannelComponent,
  ],

  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MaterialModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireStorageModule,
    BrowserAnimationsModule,
    LayoutModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'de-DE' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
