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
import { NavbarLeftComponent } from './component/navbar-left/navbar-left.component';
import { NavbarSearchbarComponent } from './component/navbar-searchbar/navbar-searchbar.component';
import { HeaderNavbarMobileComponent } from './component/header-navbar-mobile/header-navbar-mobile.component';



@NgModule({
  declarations: [AppComponent, NavbarLeftComponent, NavbarSearchbarComponent, HeaderNavbarMobileComponent],
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
