import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitContributionComponent } from './submit-contribution.component';

describe('SubmitContributionComponent', () => {
  let component: SubmitContributionComponent;
  let fixture: ComponentFixture<SubmitContributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitContributionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitContributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
