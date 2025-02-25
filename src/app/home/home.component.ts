import { MatCardModule } from "@angular/material/card";
import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { Router } from "@angular/router";
import { LoadingService } from "../services/loading.service";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
})
export class HomeComponent {
  constructor(private router: Router, private loadingService: LoadingService) {}
  signup() {
    this.router.navigateByUrl("/signup");
  }
}
