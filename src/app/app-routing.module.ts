import { NgModule } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, Routes } from '@angular/router';
import { IntroComponent } from './components/general/auth/intro/intro.component';
import { ChannelComponent } from './components/general/chats/channel/channel.component';
import { SignUpComponent } from './components/general/auth/sign-up/sign-up.component';
import { ChooseAvatarComponent } from './components/general/auth/choose-avatar/choose-avatar.component';
import { NavbarComponent } from './components/general/sidenav/navbar/navbar.component';
import { ForgotPasswordComponent } from './components/general/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/general/auth/reset-password/reset-password.component';
import { CreateChannelComponent } from './components/general/sidenav/create-channel/create-channel.component';
import { ThreadComponent } from './components/general/chats/thread/thread.component';
import { SignInMergeAccountsComponent } from './components/general/auth/sign-in-merge-accounts/sign-in-merge-accounts.component';
import { ResponsiveService } from './services/responsive.service';

const mobileRoutes: Routes = [
  { path: '', component: IntroComponent },
  {
    path: 'sign-in-merge-accounts/:id',
    component: SignInMergeAccountsComponent,
  },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'choose-avatar/:id', component: ChooseAvatarComponent },
  { path: 'home', component: NavbarComponent },
  { path: 'home/addChannel', component: CreateChannelComponent },
  { path: 'chat/:type', component: ChannelComponent },
  { path: 'thread', component: ThreadComponent },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];

const desktopRoutes: Routes = [
  { path: '', component: IntroComponent },
  {
    path: 'sign-in-merge-accounts/:id',
    component: SignInMergeAccountsComponent,
  },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'choose-avatar/:id', component: ChooseAvatarComponent },
  { path: 'home', component: NavbarComponent },
  { path: 'home/addChannel', component: CreateChannelComponent },
  {
    path: 'chat/:type',
    component: ChannelComponent,
    outlet: 'channel',
  },
  {
    path: 'thread',
    component: ThreadComponent,
    outlet: 'thread',
  },
  {
    path: '**',
    redirectTo: '/home(channel:chat/channel)?channelID=82C9Qh2AsibAiC6Ehti2',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(mobileRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
  constructor(public router: Router, private rs: ResponsiveService) {
    this.rs.isMobile$.subscribe((val) => {
      if (val) {
        router.resetConfig(mobileRoutes);
        this.rs.changeRoutes(!val);
        // console.log('Mobile Route config:', router.config);
      }
    });

    this.rs.isTablet$.subscribe((val) => {
      // console.log('Tablet in routing', val);

      if (val) {
        router.resetConfig(mobileRoutes);
        // console.log('Tablet Route config:', router.config);
        // console.log('Change routes');
        this.rs.changeRoutes(!val);
      }
    });

    this.rs.isDesktop$.subscribe((val) => {
      // console.log('Desktop in routing', val);

      if (val) {
        router.resetConfig(desktopRoutes);
        // console.log('Desktop Route config:', router.config);
        // console.log('Change routes');
        this.rs.changeRoutes(val);
      }
    });
  }
}
