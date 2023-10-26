import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntroComponent } from './components/components/intro/intro.component';
import { MainChatComponent } from './components/components/main-chat/main-chat.component';
import { SignUpComponent } from './components/components/sign-up/sign-up.component';

const routes: Routes = [
  { path: '', component: IntroComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'home', component: MainChatComponent/*, name: main*/ },
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
