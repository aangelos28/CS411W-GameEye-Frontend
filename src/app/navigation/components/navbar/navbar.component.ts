import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {SidemenuComponent} from '../sidemenu/sidemenu.component';
import {Subscription} from 'rxjs';
import {AccountService} from '../../../account/services/account/account.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

    @ViewChild(SidemenuComponent) sidemenu: SidemenuComponent;

    public isLoggedInAndVerified: boolean = null;
    public isInStartingPage: boolean = null;

    private subscriptions = new Subscription();

    constructor(private accountService: AccountService, private location: Location, private router: Router) {
    }

    ngOnInit(): void {
        this.subscriptions.add(this.accountService.isLoggedInAndVerified.subscribe(isLoggedInAndVerified =>
            this.isLoggedInAndVerified = isLoggedInAndVerified
        ));

        this.subscriptions.add(this.router.events.subscribe(val => {
            const path = this.location.path();
            this.isInStartingPage = (path === '/watchlist') || (path === '/login');
        }));
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    goBack(): void {
        this.location.back();
    }
}
