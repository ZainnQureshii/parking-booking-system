import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ProfileService } from 'src/app/services/profile/profile.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userData: any;

  constructor(
    private router: Router,
    public authService: AuthService,
    public profileService: ProfileService) { }

  async ngOnInit() {
    try {
      this.authService.authState.subscribe(async user => {
        let userData = (await this.profileService.getUserProfileData())?.data()
        this.userData = userData
      })
    } catch(e) {
      console.log(e)
    }
  }

  async logout() {
    await this.authService.logout()
    this.router.navigate(['/auth/login']);
  }

}
