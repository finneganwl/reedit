import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SignInComponent } from './sign-in/sign-in.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule} from 'angularfire2/database'
import { environment } from '../environments/environment';
import { ReversePipe } from './reverse.pipe';
import { SubmitPostComponent } from './submit-post/submit-post.component';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    ReversePipe,
    SubmitPostComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp({
		apiKey: "AIzaSyA5KINdd80Z8wwPjqfcHts5fH6AO06qiP0",
		authDomain: "reedit-79239.firebaseapp.com",
		databaseURL: "https://reedit-79239.firebaseio.com",
		projectId: "reedit-79239",
		storageBucket: "",
		messagingSenderId: "240657226873"
	}, 'reedit'),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
