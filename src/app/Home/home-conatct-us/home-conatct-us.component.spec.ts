import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeConatctUsComponent } from './home-conatct-us.component';

describe('HomeConatctUsComponent', () => {
  let component: HomeConatctUsComponent;
  let fixture: ComponentFixture<HomeConatctUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeConatctUsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeConatctUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
