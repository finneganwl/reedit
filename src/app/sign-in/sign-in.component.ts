import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SignInComponent implements OnInit {
  task: string;
  constructor() { }

  ngOnInit() {
  	this.task = "Sign Up";
  }

}
