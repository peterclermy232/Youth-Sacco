import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyContributionComponent } from './verify-contribution.component';

describe('VerifyContributionComponent', () => {
  let component: VerifyContributionComponent;
  let fixture: ComponentFixture<VerifyContributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyContributionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyContributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
