import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { UserService, User } from '../../services/user.service';
import { WeatherService, WeatherData } from '../../services/weather.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: User | null;
  istTime: Date = new Date();
  estTime: Date = new Date();
  city: string = 'Hyderabad';
  weatherData: WeatherData | null = null;
  weatherLoading: boolean = false;
  weatherError: string | null = null;
  private timeSubscription: Subscription;

  constructor(
    private router: Router,
    private userService: UserService,
    private weatherService: WeatherService
  ) {}

  ngOnInit(): void {
    if (!this.userService.isLoggedIn()) {
      this.logout(); // Clean up and redirect
      return;
    }

    this.currentUser = this.userService.currentUserValue;

    this.timeSubscription = interval(1000).subscribe(() => {
      this.updateTimes();
    });

    this.getWeather();
  }

  updateTimes(): void {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;

    this.istTime = new Date(utc + 5.5 * 60 * 60 * 1000); // UTC+5:30
    this.estTime = new Date(utc - 5 * 60 * 60 * 1000); // UTC-5:00
  }

  getWeather(): void {
    if (!this.city) {
      this.weatherError = 'Please enter a city name';
      return;
    }

    this.weatherLoading = true;
    this.weatherError = null;

    this.weatherService.getCurrentWeather(this.city).subscribe(
      (data) => {
        this.weatherData = data;
        this.weatherLoading = false;
      },
      (error) => {
        this.weatherError = 'Failed to load weather data. Please try again.';
        this.weatherLoading = false;
        console.error('Weather API error:', error);
      }
    );
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
  }
}
