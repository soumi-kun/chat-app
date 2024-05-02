import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'chatHistoryDatePipe'
})
export class ChatHistoryDatePipe implements PipeTransform {

  transform(value: string): string {
    const date = new Date(value);
    const today = new Date();
    const oneDayMs = 24 * 60 * 60 * 1000; // Number of milliseconds in a day

    // Check if the date is today
    const isToday = date.getDate() === today.getDate() &&
                    date.getMonth() === today.getMonth() &&
                    date.getFullYear() === today.getFullYear();

    // Check if the date is within the same week
    const isSameWeek = date.getTime() - today.getTime() < 7 * oneDayMs;

    // Get formatted time string
    const timeString = new DatePipe('en-US').transform(date, 'h:mm a');

    if (isToday) {
      return `Today, ${timeString}`;
    } else if (isSameWeek && date.getDay() !== today.getDay()) {
      // Display day if within the same week but not today
      return this.getDayString(date) + ', ' + timeString;
    } else {
      // Otherwise, display full date and time
      return new DatePipe('en-US').transform(date, 'medium') || '';
    }
  }

  getDayString(date: Date): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  }

}