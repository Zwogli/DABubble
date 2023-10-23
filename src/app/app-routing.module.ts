import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainChatComponent } from './components/components/main-chat/main-chat.component';

const routes: Routes = [
  {path: '', component: MainChatComponent, outlet: 'main'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
