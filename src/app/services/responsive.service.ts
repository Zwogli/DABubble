import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResponsiveService {
  isMobile$: Observable<boolean>;
  isTablet$: Observable<boolean>;
  isDesktop$: Observable<boolean>;

  constructor(private responsive: BreakpointObserver) {
    this.isMobile$ = this.responsive
      .observe(Breakpoints.XSmall)
      .pipe(map((result) => result.matches));

    this.isTablet$ = this.responsive
      .observe('(min-width: 600px) and (max-width: 1370px)')
      .pipe(map((result) => result.matches));

    this.isDesktop$ = this.responsive
      .observe('(min-width: 1370.02px)')
      .pipe(map((result) => result.matches));
  }
}
