import { Component, OnInit } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList, AngularFireObject} from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

declare var $: any; // for jquery

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
	currentUser: string;
	db: AngularFireDatabase;
	posts: Observable<any[]>;
	postsRef: AngularFireList<any>;
	upvotesRef: AngularFireObject<any>;
	upvoteIsColored: any;
	//subscription: any;


	constructor(public afAuth: AngularFireAuth, db: AngularFireDatabase) {
		this.db = db;
		this.postsRef = db.list('posts', ref => ref.orderByChild('upvotes'));
		this.posts = this.postsRef.snapshotChanges();
		this.upvoteIsColored = {};
	}

	ngOnInit() {
		this.currentUser = null;
	}

	onAuthenticated(event) {
		this.currentUser = this.afAuth.auth.currentUser.displayName;

		// retrieve previous upvote status for the user
		this.getListItemsOnce(this.postsRef, (post) => {
			this.upvotesRef = this.db.object('upvotes/' + this.afAuth.auth.currentUser.uid + '/' + post.key);
			this.getObjectOnce(this.upvotesRef, (userDidUpvote) => {
				this.upvoteIsColored[post.key] = userDidUpvote.payload.val();
			});
		});
	}

	onSubmitted(event) {
		
	}

	upvote(post) {
		// user must be signed in to upvote
		if (this.currentUser) {
			// user can only upvote once
			this.upvotesRef = this.db.object('upvotes/' + this.afAuth.auth.currentUser.uid + '/' + post.key);
			this.getObjectOnce(this.upvotesRef, (alreadyUpvoted) => {
				var oldUpvoteCount = post.payload.val().upvotes;
				if (alreadyUpvoted) {
					// remove upvote, change color back, decrement count
					this.upvotesRef.set(false);
					this.upvoteIsColored[post.key] = false;
					this.postsRef.update(post.key, {"upvotes": oldUpvoteCount - 1});
				}
				else {
					// save upvote, change color, increment count
					this.upvotesRef.set(true);
					this.upvoteIsColored[post.key] = true;
					this.postsRef.update(post.key, {"upvotes": oldUpvoteCount + 1});
				}
			});
		}
		else {
			$("#signIn").modal();
		}
	}

	submitPost(post) {
		if (this.currentUser) {
			$("#submitPost").modal();
		}
		else {
			$("#signIn").modal();
		}
	}

	logout() {
		this.afAuth.auth.signOut();
		this.currentUser = null;
	}

	getObjectOnce(objectRef, func) {
		var subscription = objectRef.snapshotChanges().subscribe(action => {
			var object = action.payload.val();
			subscription.unsubscribe(); // only get value one time
			return func(object);
		});
	}

	getListItemsOnce(listRef, func) {
		var subscription = listRef.snapshotChanges().subscribe(actions => {
			actions.forEach(action => {
				var listItem = action.payload.val();
				subscription.unsubscribe();
				return func(listItem);
			});
		});
	}
}
