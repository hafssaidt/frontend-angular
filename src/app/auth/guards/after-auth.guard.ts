import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenService } from '../token.service';

@Injectable({
  providedIn: 'root',
})
export class AfterAuthGuard implements CanActivate {
  constructor(private tokenService: TokenService, private router: Router) {}

  canActivate(): boolean {
    if (this.tokenService.loggedIn()) {
      this.router.navigateByUrl('/projects');
      return false;
    }

    return true;
  }
}
