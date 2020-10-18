import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TestComponent} from './components/test/test.component';
import {NavigationModule} from '../navigation/navigation.module';
import {MatInputModule} from '@angular/material/input';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {AccountModule} from '../account/account.module';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import {SettingsComponent} from './components/settings/settings.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatBadgeModule} from '@angular/material/badge';
import {MatRippleModule} from '@angular/material/core';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';


@NgModule({
    declarations: [
        TestComponent,
        WatchlistComponent,
        SettingsComponent
    ],
    exports: [
        TestComponent,
        WatchlistComponent
    ],
    imports: [
        CommonModule,
        NavigationModule,
        AccountModule,
        MatInputModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatSnackBarModule,
        MatCheckboxModule,
        MatButtonToggleModule,
        MatCardModule,
        MatIconModule,
        MatBadgeModule,
        MatRippleModule,
        MatSlideToggleModule
    ]
})
export class CoreModule {
}
