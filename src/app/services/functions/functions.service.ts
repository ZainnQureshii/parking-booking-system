import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FunctionsService {

  constructor() { }

  getDate(timestamp: number) {
    const date = new Date(timestamp);
    const month = date.toLocaleString('default', { month: 'short' });
    return `${date.getDate()}-${month}-${date.getFullYear()}`
  }

  getHours(timestamp: number) {
    return (new Date(timestamp)).getHours()
  }
}
