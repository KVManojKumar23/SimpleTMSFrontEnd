import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRigisterComponent } from './user-rigister.component';

describe('UserRigisterComponent', () => {
  let component: UserRigisterComponent;
  let fixture: ComponentFixture<UserRigisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserRigisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRigisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
