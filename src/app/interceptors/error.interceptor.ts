import { HttpInterceptorFn } from "@angular/common/http";
import { catchError, throwError } from "rxjs";
import { BadInput } from "../common/bad-input";
import { AppError } from "../common/app-error";
import { NotFoundError } from "../common/not-found-error";
import { ForbiddenError } from "../common/forbidden-error";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      if (error.status === 400)
        return throwError(new BadInput(error, error.error));
      if (error.status === 404)
        return throwError(new NotFoundError(error, error.error));
      if (error.status === 403)
        return throwError(new ForbiddenError(error, error.error));
      else return throwError(new AppError());
    })
  );
};
