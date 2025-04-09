import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-user',
  standalone: false,
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 }))
      ])
    ]),
    trigger('float', [
      transition('* => *', [
        style({ transform: 'translateY(0)' }),
        animate('3000ms ease-in-out infinite', 
          style({ transform: 'translateY(-15px)' }))
      ])
    ])
  ]
})
export class UserComponent {
  workflowSteps = [
    { id: 1, name: 'Backlog' },
    { id: 2, name: 'Sprint Planning' },
    { id: 3, name: 'Daily Scrum' },
    { id: 4, name: 'Sprint Execution' },
    { id: 5, name: 'Sprint Review' },
    { id: 6, name: 'Retrospective' }
  ];
}
