import { Component, OnInit, ViewEncapsulation, Output, EventEmitter} from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

declare var $: any;

@Component({
	selector: 'app-sign-in',
	templateUrl: './sign-in.component.html',
	styleUrls: ['./sign-in.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class SignInComponent implements OnInit {
	task: string;
	username: string;
	email: string;
	password: string;
	errorOccurred: boolean;
	@Output() authenticated: EventEmitter<boolean> = new EventEmitter<boolean>();

	constructor(public afAuth: AngularFireAuth) { }

	ngOnInit() {
		this.task = "Sign Up";
		this.errorOccurred = false;
	}

	switchTasks() {
		if (this.task == "Sign Up") {
			this.task = "Login";
		}
		else {
			this.task = "Sign Up"
		}
	}

	submitTask() {
		// simple non empty validation
		if (!this.email || !this.password || (this.task == "Sign Up" && !this.username)) {
			return;
		}
		if (this.task == "Sign Up") {
			this.afAuth.auth.createUserWithEmailAndPassword(this.email, this.password).catch((error) => {
				// Handle Errors here.
				var errorCode = error.code;
				var errorMessage = error.message;
				if (errorCode == 'auth/weak-password') {
					alert('The password is too weak.');
				} else {
					alert(errorMessage);
				}
				this.errorOccurred = true;
			}).then(() => this.updateUsername()).then(() => this.closeModal());
		}
		else { // Login
			this.afAuth.auth.signInWithEmailAndPassword(this.email, this.password).catch((error) => {
				// Handle Errors here.
				var errorCode = error.code;
				var errorMessage = error.message;
				if (errorCode === 'auth/wrong-password') {
					alert('Wrong password.');
				} else {
					alert(errorMessage);
				}
				this.errorOccurred = true;
			}).then(() => this.signalAuthenticated()).then(() => this.closeModal());
		}
	}

	signalAuthenticated() {
		this.authenticated.emit(true);
	}

	updateUsername() {
		if (!this.errorOccurred) {
			var user = this.afAuth.auth.currentUser;
			user.updateProfile({
				displayName: this.username,
				photoURL: null
			}).then(() => this.signalAuthenticated());
		}
	}
	closeModal() {	
		if (!this.errorOccurred) {
			console.log($("#signIn"));
			$("#signIn").modal('toggle');

			// reset before exiting
			this.username = "";
			this.email = "";
			this.password = "";
		}
		this.errorOccurred = false;
	}

}
