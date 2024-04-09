import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GametableComponent } from './gametable/gametable.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { GamelobbyComponent } from './gamelobby/gamelobby.component';
import { ChatexampleComponent } from './chatexample/chatexample.component';
import { GametableadminComponent } from './gametableadmin/gametableadmin.component';
import { GametableplayerComponent } from './gametableplayer/gametableplayer.component';
import { GametableDeactiveGuardClassGuard } from './guards/gametable-deactive-guard-class.guard';

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
        component: GametableComponent,
        canActivate: [authGuard],
        canDeactivate: [GametableDeactiveGuardClassGuard]
    },
    {
        path: 'gametableadmin',
        component: GametableadminComponent,
        canActivate: [authGuard],
    },
    {
        path: 'gametableplayer',
        component: GametableplayerComponent,
        canActivate: [authGuard],
    },
    {
        path: 'gamelobby',
        component: GamelobbyComponent,
        canActivate: [authGuard],
    },
    {
        path: 'chatexample',
        component: ChatexampleComponent,
        canActivate: [authGuard],
    }
];
