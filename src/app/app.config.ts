import { ApplicationConfig, EnvironmentProviders } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { errorInterceptor } from './interceptors/error.interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { loggerInterceptor } from './interceptors/logger.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([loggerInterceptor, errorInterceptor])),
    provideAnimationsAsync(),
    provideAnimationsAsync(),
  ],
};
