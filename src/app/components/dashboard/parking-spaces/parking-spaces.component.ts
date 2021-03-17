import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-parking-spaces',
  templateUrl: './parking-spaces.component.html',
  styleUrls: ['./parking-spaces.component.scss']
})
export class ParkingSpacesComponent implements OnInit {

  @Input() slotTimestamps: { from: number, to: number }
  @Input() parkingAreaId: string;
  @Output() bookingConfirmed = new EventEmitter()
  parkingSpaces: any[] = [];
  selectedParkingSpace: any;

  constructor(
    public authService: AuthService,
    public firestore: AngularFirestore,
    public router: Router) {}

  ngOnInit(): void {
    this.getParkingSpaces(this.parkingAreaId)
  }

  async getParkingSpaces(parkingAreaId) {
    try {
      const parkingSpaces = (await this.firestore.collection('ParkingAreas').doc(parkingAreaId).collection('ParkingSpaces').get().toPromise()).docs
      this.parkingSpaces = await Promise.all(parkingSpaces.map(async parkingSpace => {
        const bookings = (await parkingSpace.ref.collection('Bookings').get()).docs
        const parkingSpaceObj = {
          parkingSpaceId: parkingSpace.id,
          parkingSpaceTitle: parkingSpace.data().title
        }
        if(bookings.length > 0) {
          return {
            ...parkingSpaceObj,
            bookings: bookings.map(booking => {
              return { bookingId: booking.id, ...booking.data(), }
            })
          }
        }
        return parkingSpaceObj
      }))
      this.parkingSpaces.sort((a, b) => {
        const areaA = a.parkingSpaceTitle.split(' ')
        const areaB = b.parkingSpaceTitle.split(' ')
        return parseInt(areaA.pop()) - parseInt(areaB.pop())
      })
    } catch(e) {
      console.log(e)
    }
  }

  checkIfBooked(parkingSpace) {
    if(parkingSpace.bookings) {
      const { from, to } = this.slotTimestamps;
      return parkingSpace.bookings.some(booking => {
        if((from >= booking.time.from && from < booking.time.to) || (to > booking.time.from && to <= booking.time.to))
          return true
        else if((booking.time.from >= from && booking.time.from < to) || (booking.time.to > from && booking.time.to <= to))
          return true
      })
    }
    return false
  }

  selectSlot(parkingSpace, index: number) {
    this.selectedParkingSpace = { ...parkingSpace }
    this.parkingSpaces.forEach(space => space.selected = false)
    this.parkingSpaces[index].selected = true
  }

  async bookParkingSpace(parkingSpaceId: string) {
    if(parkingSpaceId) {
      try {
        await this.firestore.collection('ParkingAreas').doc(this.parkingAreaId)
        .collection('ParkingSpaces').doc(parkingSpaceId).collection('Bookings')
        .add({
          time: { ...this.slotTimestamps },
          state: 'send-booking-email',
          uid: this.authService.user.uid,
        })
        this.bookingConfirmed.emit(true)
      } catch(e) {
        console.log(e)
      }
    }
  }

}
