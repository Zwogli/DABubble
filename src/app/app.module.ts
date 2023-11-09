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
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireStorageModule } from "@angular/fire/compat/storage";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './components/wrapper/navbar/navbar.component';
import { NavbarHeaderMobileComponent } from './components/component/navbar-header-mobile/navbar-header-mobile.component';
import { NavbarPanelChannelsComponent } from './components/component/navbar-panel-channels/navbar-panel-channels.component';
import { NavbarPanelMessageComponent } from './components/component/navbar-panel-message/navbar-panel-message.component';
import { NavbarSearchbarComponent } from './components/component/navbar-searchbar/navbar-searchbar.component';
import { MenuProfilMobileComponent } from './components/wrapper/menu-profil-mobile/menu-profil-mobile.component';
import { DialogProfilComponent } from './components/reusable/dialog-profil/dialog-profil.component';
import { IntroComponent } from './components/components/intro/intro.component';
import { SignInComponent } from './components/components/sign-in/sign-in.component';

import { MainChatComponent } from './components/components/main-chat/main-chat.component';
import { SignUpComponent } from './components/components/sign-up/sign-up.component';
import { ChooseAvatarComponent } from './components/components/choose-avatar/choose-avatar.component';
import { DialogProfilEditComponent } from './components/reusable/dialog-profil-edit/dialog-profil-edit.component';
import { ForgotPasswordComponent } from './components/components/forgot-password/forgot-password.component';

@NgModule({
  declarations: [
    AppComponent,
    IntroComponent,
    MainChatComponent,
    NavbarComponent,
    NavbarHeaderMobileComponent,
    NavbarPanelChannelsComponent,
    NavbarPanelMessageComponent,
    NavbarSearchbarComponent,
    SignInComponent,
    SignUpComponent,
    ChooseAvatarComponent,
    MenuProfilMobileComponent,
    DialogProfilComponent, DialogProfilEditComponent, ForgotPasswordComponent
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
    AngularFireStorageModule,
    BrowserAnimationsModule,
    LayoutModule,
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'de-DE' }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
