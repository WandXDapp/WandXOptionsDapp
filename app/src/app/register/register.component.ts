import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../services/validate.service';
import { AuthService } from '../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  name: String;
  username: String;
  email: String;
  password: String

  constructor(
  	private validateService: ValidateService,
    private flashMessagesService: FlashMessagesService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
  }

  onRegisterSubmit() {
    // testing console.log(this.name);
    //creating object from above field
    const user = {
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password
    }

    //required field
    if (!this.validateService.validateRegister(user)) {
      //console.log('please fill all the fields');
      this.flashMessagesService.show('please fill all the fields', { cssClass: 'alert-danger', timeout: 3000 });
      return false;
    }

    //validate email
    if (!this.validateService.validateEmail(user.email)) {
      //console.log('please fill validate email');
      this.flashMessagesService.show('please fill valid email address', { cssClass: 'alert-danger', timeout: 3000 });
      return false;
    }

    //register user 
    // this.authService.registerUser(user).subscribe(data => {
    //   if (data.success) {
    //     this.flashMessagesService.show('Registeration Success', { cssClass: 'alert-success', timeout: 1000 });
    //     this.router.navigate(['/login']);
    //   }
    //   else {
    //     this.flashMessagesService.show('Woops Something Gone Wrong', { cssClass: 'alert-danger', timeout: 1000 });
    //     this.router.navigate(['/register']);
    //   }
    // });
  }

}
