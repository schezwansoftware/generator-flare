import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordResetInitComponent } from './password-reset-init.component';

describe('PasswordResetInitComponent', () => {
  let component: PasswordResetInitComponent;
  let fixture: ComponentFixture<PasswordResetInitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordResetInitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordResetInitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
