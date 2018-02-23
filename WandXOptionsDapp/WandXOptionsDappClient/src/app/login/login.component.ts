import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username: String;
  password: String;

  constructor(private authService: AuthService,
    private router: Router,
    private flashMessagesServie: FlashMessagesService) { }

  ngOnInit() {
  }

  onLoginSubmit() {
    //console.log(this.username);
    const user = {
      username: this.username,
      password: this.password
    }

    this.authService.authenticateUser(user).subscribe(data => {
      if (data.success) {
        this.authService.storeUserData(data.token, data.user);
        this.flashMessagesServie.show('You Are Loggedin', {
          cssClass: 'alert-success', timeout: 1000
        });
        this.router.navigate(['dashboard']);
      }
      else {
        this.flashMessagesServie.show(data.msg, {
          cssClass: 'alert-danger', timeout: 5000
        });
        this.router.navigate(['login']);
      }
    });
  }

}
