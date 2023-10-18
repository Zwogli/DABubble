import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // { path: '', component: loginComponent, outlet: 'login' },
  // { path: '/home', component: channelListComponent, outlet: 'aside-left'}, 
  // { path: '/home', component: homeComponent, outlet: 'main'}, 
  // { path: '/home', component: threadCompnent, outlet: 'aside-right'}, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
