import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-selected-parking-area',
  templateUrl: './selected-parking-area.component.html',
  styleUrls: ['./selected-parking-area.component.scss']
})
export class SelectedParkingAreaComponent implements OnInit {

  parkingArea;
  $navigationSubscription: Subscription;
  currDate: Date = new Date()
  minDate = new Date(this.currDate.getTime() - this.currDate.getTimezoneOffset() * 60 * 1000).toISOString().split('T')[0]
  formGroup: FormGroup;
  timeArr: any[] = []
  hoursArr: any[] = []
  slotError: any = {};
  showSlots: boolean;
  slotTimestamps: any = {};
  parkingAreaId: string;
  isBookingConfirmed: boolean;

  constructor(
    public firestore: AngularFirestore,
    public router: Router) {
      this.$navigationSubscription = this.router.events.subscribe((e: any) => {
        if (e instanceof NavigationEnd) {
          this.ngOnInit();
        }
      });
  }

  ngOnInit(): void {
    this.showSlots = false;
    this.parkingAreaId = this.router.url.split('/').pop()
    this.getParkingAreaData(this.parkingAreaId);
    this.initializeForm();
  }

  async getParkingAreaData(parkingAreaId) {
    try {
      const parkingArea: any = await this.firestore.collection('ParkingAreas').doc(parkingAreaId).get().toPromise()
      if(parkingArea.exists) {
        this.parkingArea = {
          id: parkingArea.id,
          exists: parkingArea.exists,
          ...parkingArea.data()
        }
      }
    } catch(e) {
      console.log(e)
    }
  }

  initializeForm() {
    this.formGroup = new FormGroup({
      date: new FormControl('', Validators.required),
      time: new FormControl('', Validators.required),
      hours: new FormControl('', Validators.required),
    });

    this.hoursArr.splice(0, this.hoursArr.length);
    this.timeArr.splice(0, this.timeArr.length);

    for(let i = 1; i<=6; i++) {
      this.hoursArr.push({ value: i, hour: `${i} ${ i > 1 ? 'Hours' : 'Hour' }` })
    }
    for(let i = 6; i<=18; i++) {
      this.timeArr.push({ value: i, time: `${i}:00` })
    }
  };

  selectSlot(formGroup) {
    this.showSlots = false;
    this.isBookingConfirmed = false;
    this.slotError.error = false
    const form = formGroup.value;
    if(Object.values(form).every(val => val)) {
      if(this.checkForErrors(form)) {
        let slotTimestamps = this.getBookingSlotTimestamp(form)
        this.slotTimestamps = slotTimestamps
        this.showSlots = true;
      }
    } else this.setSlotError('Something is missing')
  }

  getBookingSlotTimestamp(form) {
    const selectedDateMilliseconds = (new Date(form.date)).getTime();
    const hoursToMilliseconds = hours => hours * 60 * 60 * 1000;
    const pakGMTOffset = hoursToMilliseconds(5)
    const from = (selectedDateMilliseconds + hoursToMilliseconds(parseInt(form.time))) - pakGMTOffset
    const to = (selectedDateMilliseconds + hoursToMilliseconds(parseInt(form.time)) + hoursToMilliseconds(parseInt(form.hours))) - pakGMTOffset
    return { from, to }
  }

  setSlotError(errorMsg) {
    this.slotError.error = true
    this.slotError.msg = errorMsg
  }

  checkForErrors(form) {
    const selectedDateMilliseconds = (new Date(form.date)).getTime();
    const minDateMilliseconds = (new Date(this.minDate)).getTime();
    const hoursToMilliseconds = hours => hours * 60 * 60 * 1000;
    if(selectedDateMilliseconds < minDateMilliseconds) {
      this.setSlotError('Date should be current or onwards')
      return false
    } else if((selectedDateMilliseconds + hoursToMilliseconds(parseInt(form.time)) <= minDateMilliseconds + hoursToMilliseconds(this.currDate.getHours()))){
      this.setSlotError('Only future timings should be selected')
      return false
    } else if(parseInt(form.time) + parseInt(form.hours) > 18) {
      this.setSlotError('Selected hours should not exceed 18')
      return false
    }
    return true
  }

  bookingConfirmed() {
    this.showSlots = false;
    this.isBookingConfirmed = true
  }

  ngOnDestroy() {
    if (this.$navigationSubscription) {
       this.$navigationSubscription.unsubscribe();
    }
  }

}
