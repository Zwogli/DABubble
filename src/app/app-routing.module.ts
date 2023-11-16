import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntroComponent } from './components/general/auth/intro/intro.component';
import { MainChatComponent } from './components/general/main-chat/main-chat.component';
import { SignUpComponent } from './components/general/auth/sign-up/sign-up.component';
import { ChooseAvatarComponent } from './components/general/auth/choose-avatar/choose-avatar.component';
import { NavbarComponent } from './components/general/sidenav/navbar/navbar.component';
import { ForgotPasswordComponent } from './components/general/auth/forgot-password/forgot-password.component';
import { CreateChannelComponent } from './components/general/sidenav/create-channel/create-channel.component';
import { ResetPasswordComponent } from './components/general/auth/reset-password/reset-password.component';


const routes: Routes = [
  { path: '', component: IntroComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'choose-avatar/:id', component: ChooseAvatarComponent },
  { path: 'home', component: NavbarComponent },
  { path: 'home/addChannel', component: CreateChannelComponent },
  { path: 'home/:id', component: MainChatComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
