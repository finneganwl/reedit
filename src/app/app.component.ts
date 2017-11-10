import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
	currentUser: string;
	posts: Observable<any[]>;
	postsRef: AngularFireList<any>;
	db: AngularFireDatabase;


	constructor(public afAuth: AngularFireAuth, db: AngularFireDatabase) {
		this.db = db;
		this.postsRef = this.db.list('posts', ref => ref.orderByChild('upvotes'));
		this.posts = this.postsRef.snapshotChanges();
	}

	ngOnInit() {
		this.currentUser = null;
	}

	onAuthenticated(event) {
		this.currentUser = this.afAuth.auth.currentUser.displayName;
	}

	upvote(post) {
		if (this.currentUser) {
			var oldUpvotes = post.payload.val().upvotes;
			this.postsRef.update(post.key, {"upvotes": oldUpvotes + 1});
			this.postsRef = this.db.list('posts', ref => ref.orderByChild('upvotes'));
			this.posts = this.postsRef.snapshotChanges();
		}
		else {
			$("#signIn").modal();
		}
	}

}
