import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreakpointObserverService {
  mobileView$:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

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
}