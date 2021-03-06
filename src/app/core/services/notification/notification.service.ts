import {Injectable} from '@angular/core';
import {AngularFireMessaging} from '@angular/fire/messaging';
import {HttpClient} from '@angular/common/http';

interface NotificationTokenRequest {
    notificationToken: string;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    constructor(private angularFireMessaging: AngularFireMessaging, private httpClient: HttpClient) {
    }

    public requestNotificationPermission(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.angularFireMessaging.requestToken.subscribe(token => {
                console.log(`Permission granted. Token: ${token}`);

                // Register token in backend
                const request: NotificationTokenRequest = {
                    notificationToken: token
                };
                this.httpClient.post('/private/user/notifications/token/register', request, {
                    responseType: 'text'
                })
                    .subscribe(() => {
                        resolve();
                    });
            }, (error => {
                reject();
            }));
        });
    }
}
