import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
// toastr providers
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)
    , provideAnimations()
    , provideToastr()
    , provideHttpClient(), provideAnimationsAsync()]

};
