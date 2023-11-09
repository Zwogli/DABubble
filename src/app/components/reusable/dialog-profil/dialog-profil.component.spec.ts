import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogProfilComponent } from './dialog-profil.component';

describe('DialogProfilComponent', () => {
  let component: DialogProfilComponent;
  let fixture: ComponentFixture<DialogProfilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogProfilComponent]
    });
    fixture = TestBed.createComponent(DialogProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
