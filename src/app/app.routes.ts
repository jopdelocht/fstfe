import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GametableComponent } from './gametable/gametable.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { GamelobbyComponent } from './gamelobby/gamelobby.component';
import { ChatexampleComponent } from './chatexample/chatexample.component';

// Auth guard and login component
import { authGuard } from './auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'login',
        component: LoginComponent

    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'gametable',
        component: GametableComponent
    },
    {
        path: 'gamelobby',
        component: GamelobbyComponent
    },
    {
        path: 'chatexample',
        component: ChatexampleComponent
    }
];
