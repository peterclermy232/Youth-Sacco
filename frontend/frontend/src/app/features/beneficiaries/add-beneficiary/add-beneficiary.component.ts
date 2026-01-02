import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-add-beneficiary',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './add-beneficiary.component.html',
  styleUrl: './add-beneficiary.component.scss'
})
export class AddBeneficiaryComponent {

  beneficiaryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.beneficiaryForm = this.fb.group({
      full_name: ['', Validators.required],
      relationship: ['', Validators.required],
      date_of_birth: [''],
      phone_number: [''],
      occupation: [''],
      percentage_share: [null, [Validators.min(1), Validators.max(100)]],
      is_primary: [false]
    });
  }

  submit(): void {
    if (this.beneficiaryForm.invalid) {
      this.beneficiaryForm.markAllAsTouched();
      return;
    }

    const payload = this.beneficiaryForm.value;
    console.log('Submitting beneficiary:', payload);

    // TODO: call API
    // this.beneficiaryService.create(payload).subscribe(() => {
    //   this.router.navigate(['/beneficiaries']);
    // });

    this.router.navigate(['/beneficiaries']);
  }

  cancel(): void {
    this.router.navigate(['/beneficiaries']);
  }
}
