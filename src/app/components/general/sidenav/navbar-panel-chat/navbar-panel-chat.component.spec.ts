import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarPanelChatComponent } from './navbar-panel-chat.component';

describe('NavbarPanelMessageComponent', () => {
  let component: NavbarPanelChatComponent;
  let fixture: ComponentFixture<NavbarPanelChatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarPanelChatComponent]
    });
    fixture = TestBed.createComponent(NavbarPanelChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
