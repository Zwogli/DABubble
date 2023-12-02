import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreakpointObserverService {
  mobileViewSubject = new BehaviorSubject<boolean>(false);
  mobileView$: Observable<boolean> = this.mobileViewSubject.asObservable();
  mobileView = false;


  constructor(
    private breakpointService: BreakpointObserver,
  ) { 
    this.breakpointService.observe([
      Breakpoints.Small, 
      Breakpoints.XSmall
    ])
    .subscribe((result) => {
      this.mobileViewSubject.next(false);
        if(result.matches){
          this.mobileViewSubject.next(true);
        }
    })
  }
}