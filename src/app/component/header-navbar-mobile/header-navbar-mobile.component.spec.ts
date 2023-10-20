import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderNavbarMobileComponent } from './header-navbar-mobile.component';

describe('HeaderNavbarMobileComponent', () => {
  let component: HeaderNavbarMobileComponent;
  let fixture: ComponentFixture<HeaderNavbarMobileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderNavbarMobileComponent]
    });
    fixture = TestBed.createComponent(HeaderNavbarMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
