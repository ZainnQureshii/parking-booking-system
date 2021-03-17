import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formGroup: FormGroup;
  error: any = {}

  constructor(
    public formBuilder: FormBuilder,
    private authService: AuthService,
    public firestore: AngularFirestore,
    public router: Router) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.formGroup = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  login(formGroup) {
    this.error.error = false;
    const loginUser = async (form) => {
      try {
        await this.authService.login(form.email, form.password)
        this.router.navigate(['/dashboard/parking-area'])
      } catch(e) {
        console.log(e)
        this.setError(e.code)
      }
    }

    // Checking for empty fields
    if(Object.values(formGroup.value).every(val => val)) loginUser(formGroup.value)
    else this.setError('empty-fields')
  }


  setError(code: string) {
    this.error.error = true;
    switch (code) {
      case 'empty-fields':
        this.error.message = 'Please fill both fields'
        break;
      case 'auth/wrong-password':
        this.error.message = 'Invalid Password'
        break;
      case 'auth/user-not-found':
        this.error.message = 'User does not exist'
        break;
      case 'auth/too-many-requests':
        this.error.message = 'Too many requests. This account is temporarily unavailable'
        break;
      case 'auth/invalid-email':
        this.error.message = 'Invalid email format'
        break;
      default:
        this.error.message = 'Could not process your request. Please try again later'
        break;
    }
  }
}
