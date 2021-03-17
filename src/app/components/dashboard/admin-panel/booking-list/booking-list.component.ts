import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss']
})
export class BookingListComponent implements OnInit {

  bookings = [];
  newBookings = [];
  outdatedBookings = []

  constructor(private firestore: AngularFirestore, public authService: AuthService) { }

  ngOnInit(): void {
    this.getBookings()
  }

  async getBookings() {
    try {
      const bookings = (await this.firestore.collection('Bookings').get().toPromise()).docs
      if(bookings.length > 0) {
        this.bookings = await Promise.all(bookings.map(async (booking: any) => {
          const { ref, timestamp, uid } = booking.data()
          const { parkingAreaId, parkingSpaceId, parkingBookingId } = this.getPath(ref)
          const { parkingAreaData, parkingSpaceData, bookingData, userData } = await this.getAllBookingData(parkingAreaId, parkingSpaceId, parkingBookingId, uid)
          return {
            ref,
            bookingId: booking.id,
            timestamp: bookingData.time,
            timeBooked: timestamp,
            parkingAreaTitle: parkingAreaData.title,
            parkingSpaceTitle: parkingSpaceData.title,
            user: {
              name: userData.firstName + ' ' + userData.lastName,
              email: userData.email
            }
          }
        }))
        this.bookings.sort((a, b) => (b.timestamp.from) - (a.timestamp.from))
        this.newBookings = this.bookings.filter(booking => Date.now() < booking.timestamp.from)
        this.outdatedBookings = this.bookings.filter(booking => Date.now() > booking.timestamp.from)
      }
    } catch(e) {
      console.log(e)
    }
  }

  getPath(ref: string) {
    const parkingAreaId = ref.split('/')[1]
    const parkingSpaceId = ref.split('/')[3]
    const parkingBookingId = ref.split('/')[5]
    return { parkingAreaId, parkingSpaceId, parkingBookingId }
  }

  async getAllBookingData(parkingAreaId, parkingSpaceId, parkingBookingId, uid) {
    const parkingAreaPath = this.firestore.collection('ParkingAreas').doc(parkingAreaId)
    const parkingSpacePath = parkingAreaPath.collection('ParkingSpaces').doc(parkingSpaceId)
    const parkingAreaData: any = (await parkingAreaPath.get().toPromise()).data()
    const parkingSpaceData: any = (await parkingSpacePath.get().toPromise()).data()
    const bookingData = (await parkingSpacePath.collection('Bookings').doc(parkingBookingId).get().toPromise()).data()
    const userData: any = (await this.firestore.collection('Users').doc(uid).get().toPromise()).data()
    return { parkingAreaData, parkingSpaceData, bookingData, userData }
  }

  async cancelBooking(event) {
    const bookingPath = this.firestore.collection('Bookings').doc(event.bookingId)
    const bookingData: any = (await bookingPath.get().toPromise()).data()
    bookingData.state = 'cancel-booking'
    await bookingPath.update(bookingData)
    const cancelledBookingIndex = this.newBookings.findIndex(booking => booking.bookingId === event.bookingId)
    this.newBookings.splice(cancelledBookingIndex, 1)
  }


}
