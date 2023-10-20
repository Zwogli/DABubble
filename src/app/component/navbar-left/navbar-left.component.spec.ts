import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarLeftComponent } from './navbar-left.component';

describe('NavbarLeftComponent', () => {
  let component: NavbarLeftComponent;
  let fixture: ComponentFixture<NavbarLeftComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarLeftComponent],
    });
    fixture = TestBed.createComponent(NavbarLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
