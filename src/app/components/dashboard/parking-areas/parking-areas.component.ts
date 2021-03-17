import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-parking-areas',
  templateUrl: './parking-areas.component.html',
  styleUrls: ['./parking-areas.component.scss']
})
export class ParkingAreasComponent implements OnInit {

  parkingAreas: any[];
  selectedParkingSpace: any;

  constructor(
    public firestore: AngularFirestore,
    public router: Router,
    public activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.getParkingAreas();
  }

  async getParkingAreas() {
    try {
      const parkingAreas = await this.firestore.collection('ParkingAreas').get().toPromise()
      if(parkingAreas.docs.length > 0) {
        this.parkingAreas = parkingAreas.docs.map((parkingArea: any) => {
          return {
            id: parkingArea.id,
            title: parkingArea.data().title,
            imageUrl: parkingArea.data().imageUrl
          }
        })

        this.parkingAreas.sort((a, b) => {
          const areaA = a.title.split(' ')
          const areaB = b.title.split(' ')
          return parseInt(areaA.pop()) - parseInt(areaB.pop())
        })
      }
    } catch(e) {
      console.log(e)
    }
  }

  selectSlot(parkingArea, index: number) {
    this.selectedParkingSpace = { ...parkingArea }
    this.parkingAreas.forEach(space => space.selected = false)
    this.parkingAreas[index].selected = true
  }

}
