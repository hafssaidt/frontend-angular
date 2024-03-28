import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import { AccountService } from '../account.service';
import { TokenService } from '../token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private accountService: AccountService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (!this.tokenService.loggedIn()) {
      this.tokenService.remove();
      this.accountService.changeStatus(false);
      this.router.navigateByUrl('/login');
      return false;
    }
    return true;
  }
}
