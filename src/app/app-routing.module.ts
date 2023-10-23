import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntroComponent } from './components/intro/intro.component';
import { MainChatComponent } from './components/components/main-chat/main-chat.component';

const routes: Routes = [
  { path: '', component: IntroComponent },
  { path: 'home', component: MainChatComponent },
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
