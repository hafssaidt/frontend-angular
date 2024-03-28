import { HttpInterceptorFn } from '@angular/common/http';
import { TokenService } from '../auth/token.service';
import { inject } from '@angular/core';

export const loggerInterceptor: HttpInterceptorFn = (req, next) => {
  console.log(`Request is on its way to ${req.url}`);
  const tokenService = inject(TokenService);
  const token = tokenService.getToken();
  if (token) {
    req = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
  }

  return next(req);
};
