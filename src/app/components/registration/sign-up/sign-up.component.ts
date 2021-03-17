import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

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
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  signup(formGroup) {
    this.error.error = false;
    const registerUser = async (form) => {
      try {
        const signup = await this.registerUser(form);
        if(signup.success) this.router.navigate(['/dashboard/parking-area'])
      } catch(e) {
        console.log(e)
      }
    }

    // Checking for empty fields
    if(Object.values(formGroup.value).every(val => val)) registerUser(formGroup.value)
    else this.setError('empty-fields')
  }

  async registerUser(form) {
    try {
      const { password, ...rest } = form
      const registerUser = await this.authService.signup(form.email, form.password)
      await registerUser.user.updateProfile({ displayName: rest.firstName });
      await this.firestore.collection('Users').doc(registerUser.user.uid).set({ ...rest, timestamp: Date.now() })
      return { success: true }
    } catch(e) {
      console.log(e)
      this.setError(e.code)
      return { success: false, e }
    }
  }

  setError(code: string) {
    this.error.error = true;
    switch (code) {
      case 'empty-fields':
        this.error.message = 'Please fill all the fields.'
        break;
      case 'auth/email-already-in-use':
        this.error.message = 'The email address is already in use by another account.'
        break;
      case 'auth/too-many-requests':
        this.error.message = 'Too many requests. This account is temporarily unavailable.'
        break;
      case 'auth/invalid-email':
        this.error.message = 'Invalid email format.'
        break;
      default:
        this.error.message = 'Could not process your request. Please try again later.'
        break;
    }
  }

}
