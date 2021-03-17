import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, public router: Router) {}

  async canActivate() {
    try {
      const user = await this.authService.authState.pipe(first()).toPromise();
      if (user) return true;
      else this.router.navigate(['/auth/login'])
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
