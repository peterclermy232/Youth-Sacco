import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpouseDetailsComponent } from './spouse-details.component';

describe('SpouseDetailsComponent', () => {
  let component: SpouseDetailsComponent;
  let fixture: ComponentFixture<SpouseDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpouseDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpouseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
