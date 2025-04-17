import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface WeatherData {
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiKey = 'bda9e7fe60f1a4bc89cb0461272b2c3e';
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(private http: HttpClient) {}

  getCurrentWeather(city: string): Observable<WeatherData> {
    const encodedCity = encodeURIComponent(city.trim());
    const url = `/api/weather?q=${encodedCity}&appid=${this.apiKey}&units=metric`;

    return this.http.get<WeatherData>(url).pipe(
      tap((data) => console.log('Weather data received:', data)),
      catchError((error) => {
        console.error('API Error:', error);
        return throwError('Failed to fetch weather data. Please try again.');
      })
    );
  }
}
