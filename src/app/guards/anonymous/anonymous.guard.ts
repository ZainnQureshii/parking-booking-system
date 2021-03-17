import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AnonymousGuard implements CanActivate {
  constructor(private authService: AuthService, public router: Router) {}

  async canActivate() {
    try {
      const user = await this.authService.authState.pipe(first()).toPromise();
      if (user === null) {
        return true;
      }
      else this.router.navigate(['/dashboard/parking-area']);
    }
    catch (e) {
      console.log(e);
    }
  }

}
