import { HttpContextToken, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { LoadingService } from "../services/loading.service";
import { finalize, timeout, timer } from "rxjs";

export const SkipLoading = new HttpContextToken<boolean>(() => false);

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  if (req.context.get(SkipLoading)) {
    return next(req);
  }

  const timer = setTimeout(() => {
    loadingService.loadingOn();
  }, 3000);

  return next(req).pipe(
    finalize(() => {
      timeout(3000), clearTimeout(timer);
      loadingService.loadingOff();
    })
  );
};
