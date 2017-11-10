import { Component, OnInit, ViewEncapsulation, Output, EventEmitter} from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import * as firebase from 'firebase/app';

declare var $: any;

@Component({
  selector: 'app-submit-post',
  templateUrl: './submit-post.component.html',
  styleUrls: ['./submit-post.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SubmitPostComponent implements OnInit {
	link: string;
	title: string;
	postsRef: AngularFireList<any>;
	@Output() submitted: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public afAuth: AngularFireAuth, db: AngularFireDatabase) { 
  	this.postsRef = db.list('posts');
  }

  ngOnInit() {
  }

  submitPost() {
	this.postsRef.push({ 
		"link": this.link,
		"title": this.title,
		"uid": this.afAuth.auth.currentUser.uid,
		"submittedBy": this.afAuth.auth.currentUser.displayName,
		"upvotes": 0,
	}).then(() => this.closeModal());
  }

  closeModal() {
    this.submitted.emit(true);
  	$('#submitPost').modal('toggle');

  	this.link = "";
  	this.title = "";
  }

}
