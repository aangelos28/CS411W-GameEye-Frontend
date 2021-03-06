import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Game} from '../watchlist/watchlist.component';
import {HttpClient} from '@angular/common/http';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-updates',
    templateUrl: './updates.component.html',
    styleUrls: ['./updates.component.scss']
})
export class UpdatesComponent implements OnInit, OnDestroy {
    public gameId: string;
    public game: Game;

    private subscriptions = new Subscription();

    constructor(private route: ActivatedRoute, private httpClient: HttpClient) {
    }

    ngOnInit(): void {
        this.subscriptions.add(this.route.params.subscribe(params => {
            this.gameId = params.gameId;
            this.httpClient.get<Game>(`/private/watchlist/game/${this.gameId}`).subscribe(game => this.game = game);
        }));
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
