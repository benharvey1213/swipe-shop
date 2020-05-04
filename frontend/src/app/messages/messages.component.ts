import { Component, OnInit } from '@angular/core';
import { DataInteractionService } from '../data-interaction.service';
import { Message } from '../message';
import { AngularFirestore } from '@angular/fire/firestore';
import { CookieService } from 'ngx-cookie-service';
import { UserProfile } from '../user-profile';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  messagePreviews : Message[] = [];

  constructor(private db : AngularFirestore, private cookieService : CookieService, private dataInteractionService : DataInteractionService) { }

  ngOnInit(): void {
    var allMessages : Message[] = [];

    this.db.collection<any>('messages').ref.get().then(res => {
      res.forEach(message => {

        var userTo = null;
        this.db.collection<any>('users').ref.where('username', '==', message.data()['userTo']).get().then(res => {
          res.forEach(user => {
            userTo = new UserProfile(user.data()['userId'], name, user.data()['profilePictureUrl'], user.data()['location'], [])
          })

          var userFrom = null;
          this.db.collection<any>('users').ref.where('username', '==', message.data()['userFrom']).get().then(res => {
            res.forEach(user => {
              userFrom = new UserProfile(user.data()['userId'], name, user.data()['profilePictureUrl'], user.data()['location'], [])
            })
            
            allMessages.push(new Message(userTo, userFrom, userFrom.location, new Date((message.data()['time'])), message.data()['attachmentUrl']))
          });
        });
      })
    });

    console.log(allMessages);
        
    // now filter down to what we want

    this.messagePreviews = allMessages;

    
  }

  userProfileFromUsername(name : string){
    this.db.collection<any>('users').ref.where('username', '==', name).get().then(res => {
      res.forEach(user => {
        return new UserProfile(user.data()['userId'], name, user.data()['profilePictureUrl'], user.data()['location'], [])
      })
    });
  }

}
