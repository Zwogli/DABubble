import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogProfilEditComponent } from './dialog-profil-edit.component';

describe('DialogProfilEditComponent', () => {
  let component: DialogProfilEditComponent;
  let fixture: ComponentFixture<DialogProfilEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogProfilEditComponent]
    });
    fixture = TestBed.createComponent(DialogProfilEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
