import { UserService } from './auth/user.service';
import { MatMenuModule } from '@angular/material/menu';
import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { TokenService } from './auth/token.service';
import { AccountService } from './auth/account.service';
import { SideBarComponent } from './side-bar/side-bar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { User } from './models/user';
import { UserComponent } from './user/user.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    CommonModule,
    RouterOutlet,
    SideBarComponent,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MenuModule,
    ButtonModule,
  ],
})
export class AppComponent {
  title = 'skyline-ang';
  currentUser = null;
  user: User = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };
  items = [
    {
      label: 'Profile',
      icon: 'pi pi-fw pi-user-edit',
      command: () => {
        this.openEditProfile();
      },
    },
    {
      label: 'Sign Out',
      icon: 'pi pi-fw pi-sign-out',
      command: () => {
        this.logout();
      },
    },
  ];

  constructor(
    private router: Router,
    private tokenService: TokenService,
    private accountService: AccountService,
    private userService: UserService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.accountService.authStatus.subscribe(() => {
      this.currentUser = this.tokenService.getInfo();
      console.log('status', this.currentUser);
      this.getProfile();
    });
  }
  signup() {
    this.router.navigateByUrl('/signup');
  }
  login() {
    this.router.navigateByUrl('/login');
  }
  logout() {
    this.tokenService.remove();
    this.accountService.changeStatus(false);
    this.router.navigateByUrl('/login');
  }
  getProfile() {
    this.userService.getUser().subscribe((res: User) => {
      this.user = res;
    });
  }
  editProfile(user: User) {
    this.userService.updateUser(user).subscribe((res: User) => {
      this.user = res;
    });
  }

  openEditProfile() {
    const dialogRef = this.dialog.open(UserComponent, {
      width: '550px',
      height: '530px',
      data: {
        user: this.user,
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.editProfile(result.user);
      }
    });
  }
}
