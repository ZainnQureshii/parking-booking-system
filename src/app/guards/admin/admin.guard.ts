import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { ProfileService } from 'src/app/services/profile/profile.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private profileService: ProfileService,
    private router: Router) {}

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    try {
      const userObj: any = (await this.profileService.getUserProfileData()).data()
      if(userObj?.isAdmin) return true
      else this.router.navigate(['/']);
    } catch (e) {
      console.log(e)
    }
  }

}
