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
		//this.posts.forEach(() => this.upvoteIsColored.push(false));
		//this.upvoteIsColored[2] = true;
	}

	ngOnInit() {
		this.currentUser = null;
	}

	onAuthenticated(event) {
		this.currentUser = this.afAuth.auth.currentUser.displayName;
		var postsSubscription = this.postsRef.snapshotChanges().subscribe(pActions => {
			pActions.forEach(pAction => {
				this.upvotesRef = this.db.object('upvotes/' + this.afAuth.auth.currentUser.uid + '/' + pAction.key);
				var upvotesSubscription = this.upvotesRef.snapshotChanges().subscribe(uAction => {
					this.upvoteIsColored[pAction.key] = uAction.payload.val();
					upvotesSubscription.unsubscribe();
				});
			});
			postsSubscription.unsubscribe();
		})
	}

	onSubmitted(event) {
		this.postsRef = this.db.list('posts', ref => ref.orderByChild('upvotes'));
		this.posts = this.postsRef.snapshotChanges();
	}

	upvote(post) {
		// user must be signed in to uvote
		if (this.currentUser) {
			// user can only upvote once
			this.upvotesRef = this.db.object('upvotes/' + this.afAuth.auth.currentUser.uid + '/' + post.key);
			var subscription = this.upvotesRef.snapshotChanges().subscribe(action => {
				var alreadyUpvoted = action.payload.val();
				subscription.unsubscribe(); // only get one value
				if (alreadyUpvoted) {
					// remove upvote and change color back
					this.upvotesRef.set(false);
					this.upvoteIsColored[post.key] = false;

					// decrement upvote count
					var oldUpvoteCount = post.payload.val().upvotes;
					this.postsRef.update(post.key, {"upvotes": oldUpvoteCount - 1});
					//this.postsRef = this.db.list('posts', ref => ref.orderByChild('upvotes'));
					//this.posts = this.postsRef.snapshotChanges();
				}
				else {
					// save upvote and change color
					this.upvotesRef.set(true);
					this.upvoteIsColored[post.key] = true;

					// increment upvote count
					var oldUpvoteCount = post.payload.val().upvotes;
					this.db.list('posts', ref => ref.orderByChild('upvotes')).update(post.key, {"upvotes": oldUpvoteCount + 1});
					//this.postsRef = this.db.list('posts', ref => ref.orderByChild('upvotes'));
					//this.posts = this.postsRef.snapshotChanges();
					
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

}
