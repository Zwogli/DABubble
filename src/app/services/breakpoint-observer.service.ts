import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreakpointObserverService {
  mobileView$:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  togglePosts:boolean = false;

  constructor(
    private breakpointService: BreakpointObserver,
  ) { 
    this.breakpointService.observe([
      Breakpoints.Small, 
      Breakpoints.XSmall
    ])
    .subscribe((result) => {
      this.mobileView$.next(false);
        if(result.matches){
          this.mobileView$.next(true);
        }
      })
  }

  openPosts(){
    this.togglePosts = true;
  }

  closePosts(){
    this.togglePosts = false;
  }
}