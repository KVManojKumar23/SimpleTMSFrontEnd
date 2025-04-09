import { Injectable } from '@angular/core';
import { Course } from '../Models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
    getCourses(): Course[] {
        return [
          {
            id: 1,
            title: 'Python Full Stack',
            category: 'Programming',
            description: 'Master Python, Django, and React.',
            image: 'assets/images/python.jpg',
            duration: '3 Months',
            isTrending: true
          },
          // Add more courses...
        ];
      }
    
      getCompanies(): string[] {
        return [
          'assets/logos/google.png',
          'assets/logos/amazon.png',
          'assets/logos/tcs.png',
          // Add more logos...
        ];
      }
}