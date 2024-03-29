import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { TripModel } from '../models';
import { TripService } from '../services/trip.service';

@Component({
  selector: 'app-trip-details',
  templateUrl: './trip-details.component.html',
  styleUrls: ['./trip-details.component.scss'],
  providers: [UntypedFormBuilder]
})
export class TripDetailsComponent implements OnInit, OnDestroy {
  fileToUpload: any;
  imageUrl: any;

  formGroup: UntypedFormGroup;
  isAdmin: boolean;
  isAddMode: boolean;
  photos: Blob[] = [];

  private routeSub: Subscription = new Subscription();

  get description(): string {
    return this.formGroup.get('description')?.value;
  }

  get isFormDisabled(): boolean {
    return this.formGroup.disabled;
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private service: TripService) { }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      id: new UntypedFormControl(),
      title: new UntypedFormControl(),
      description: new UntypedFormControl(),
      private: new UntypedFormControl(false)
    });

    if (this.router.url === '/create-trip') {
      this.isAddMode = true;
    } else {
      //Getting id from url
      this.routeSub = this.activatedRoute.params.subscribe(params => {
        //Getting details for the trip with the id found
        this.service.get(params['id']).subscribe((data: TripModel) => {
          this.formGroup.patchValue(data);
        })
        this.formGroup.disable();
      });
      this.isAddMode = false;
    }
    this.isAdmin = true;
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  startUpdating() {
    this.formGroup.enable();
  }

  save() {
    if (this.isAddMode) {
      this.service.post(this.formGroup.getRawValue()).subscribe();
      this.router.navigate(['list']);
    } else {
      this.service.patch(this.formGroup.getRawValue()).subscribe();
    }

    this.photos.push(this.imageUrl);
    this.imageUrl = null;
    this.formGroup.disable();
  }

  handleFileInput(event: any) {
    const file = event.target.files;
    this.fileToUpload = file.item(0);

    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload);
  }

}
