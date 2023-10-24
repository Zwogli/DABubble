import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MaterialModule } from './custom_modules/material.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './components/wrapper/navbar/navbar.component';
import { NavbarHeaderMobileComponent } from './components/component/navbar-header-mobile/navbar-header-mobile.component';
import { NavbarPanelChannelsComponent } from './components/component/navbar-panel-channels/navbar-panel-channels.component';
import { NavbarPanelMessageComponent } from './components/component/navbar-panel-message/navbar-panel-message.component';
import { NavbarSearchbarComponent } from './components/component/navbar-searchbar/navbar-searchbar.component';
import { MenuProfilMobileComponent } from './components/wrapper/menu-profil-mobile/menu-profil-mobile.component';
import { DialogProfilComponent } from './components/component/dialog-profil/dialog-profil.component';



@NgModule({
  declarations: [
    AppComponent, 
    NavbarComponent, 
    NavbarHeaderMobileComponent, 
    NavbarPanelChannelsComponent, 
    NavbarPanelMessageComponent, 
    NavbarSearchbarComponent, MenuProfilMobileComponent, DialogProfilComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
