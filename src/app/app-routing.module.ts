import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntroComponent } from './components/components/intro/intro.component';
import { MainChatComponent } from './components/components/main-chat/main-chat.component';
import { SignUpComponent } from './components/components/sign-up/sign-up.component';
import { ChooseAvatarComponent } from './components/components/choose-avatar/choose-avatar.component';
import { NavbarComponent } from './components/wrapper/navbar/navbar.component';
import { AppBodyComponent } from './components/wrapper/app-body/app-body.component';

const routes: Routes = [
  { path: '', component: IntroComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'choose-avatar', component: ChooseAvatarComponent },
  // { path: 'home', component: MainChatComponent, outlet:"main" },
  // { path: 'home', component: NavbarComponent },
  { path: 'home', component: AppBodyComponent },
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
