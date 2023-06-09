import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginService } from 'src/app/login.service';
import { map } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export default class LoginComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  loginService = inject(LoginService);

  user = {
    email: '',
    password: '',
  };

  redirectUrl = '/';

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.redirectUrl = params.get('redirect') || '/';
      console.log(params.get('redirect'));
    });
  }

  login() {
    console.log(this.user);
    this.loginService
      .login(this.user)
      .pipe(map((data) => data.user.token))
      .subscribe({
        next: (token) => {
          console.log(token);
          localStorage.setItem('token', token);
          this.router.navigateByUrl(this.redirectUrl);
        },
        error: (err: HttpErrorResponse) => {
          console.log(err.error.body[0]);
          alert(err.error.body[0]);
        }
      });
  }
}
