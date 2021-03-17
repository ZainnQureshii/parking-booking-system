import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.scss']
})
export class MyBookingsComponent implements OnInit {

  userBookings = [];
  newBookings = [];
  outdatedBookings = []

  constructor(private firestore: AngularFirestore, public authService: AuthService) { }

  ngOnInit(): void {
    this.getUserBookings()
  }

  async getUserBookings() {
    try {
      const bookings = await this.firestore.collection('Bookings', ref => ref.where('uid', '==', this.authService.user.uid)).get().toPromise()
      if(bookings.docs.length > 0) {
        this.userBookings = await Promise.all(bookings.docs.map(async (booking: any) => {
          const { ref, timestamp } = booking.data()
          const { parkingAreaId, parkingSpaceId, parkingBookingId } = this.getPath(ref)
          const { parkingAreaData, parkingSpaceData, bookingData } = await this.getAllBookingData(parkingAreaId, parkingSpaceId, parkingBookingId)

          return {
            ref,
            bookingId: booking.id,
            time: bookingData.time,
            timeBooked: timestamp,
            parkingAreaTitle: parkingAreaData.title,
            parkingSpaceTitle: parkingSpaceData.title,
          }
        }))
        this.userBookings.sort((a, b) => (b.time.from) - (a.time.from))
        this.newBookings = this.userBookings.filter(booking => Date.now() < booking.time.from)
        this.outdatedBookings = this.userBookings.filter(booking => Date.now() > booking.time.from)
      }
    } catch(e) {
      console.log(e)
    }
  }

  async getAllBookingData(parkingAreaId, parkingSpaceId, parkingBookingId) {
    const parkingAreaPath = this.firestore.collection('ParkingAreas').doc(parkingAreaId)
    const parkingSpacePath = parkingAreaPath.collection('ParkingSpaces').doc(parkingSpaceId)
    const parkingAreaData: any = (await parkingAreaPath.get().toPromise()).data()
    const parkingSpaceData: any = (await parkingSpacePath.get().toPromise()).data()
    const bookingData = (await parkingSpacePath.collection('Bookings').doc(parkingBookingId).get().toPromise()).data()
    return { parkingAreaData, parkingSpaceData, bookingData }
  }

  async cancelBooking(event) {
    const bookingPath = this.firestore.collection('Bookings').doc(event.bookingId)
    const bookingData: any = (await bookingPath.get().toPromise()).data()
    bookingData.state = 'cancel-booking'
    await bookingPath.update(bookingData)
    const cancelledBookingIndex = this.newBookings.findIndex(booking => booking.bookingId === event.bookingId)
    this.newBookings.splice(cancelledBookingIndex, 1)
  }

  getPath(ref: string) {
    const parkingAreaId = ref.split('/')[1]
    const parkingSpaceId = ref.split('/')[3]
    const parkingBookingId = ref.split('/')[5]
    return { parkingAreaId, parkingSpaceId, parkingBookingId }
  }

}
