import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuProfilMobileComponent } from './menu-profil-mobile.component';

describe('MenuProfilMobileComponent', () => {
  let component: MenuProfilMobileComponent;
  let fixture: ComponentFixture<MenuProfilMobileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuProfilMobileComponent]
    });
    fixture = TestBed.createComponent(MenuProfilMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
