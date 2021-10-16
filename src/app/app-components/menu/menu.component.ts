import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";
import {BreakpointObserver} from "@angular/cdk/layout";
import {delay} from "rxjs/operators";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav

  constructor(private menuToggleObserver:BreakpointObserver) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): any {
    this.menuToggleObserver
      .observe(['(max-width: 800px)'])
      .pipe(delay(1))
      .subscribe(res => {
        if (!res.matches) {
          // console.log('11111111111111111111111111111111111111111111111111');
          this.sidenav.mode = 'over';
          this.sidenav.close();
        }else {
          // console.log('22222222222222222222222222222222222222222222222222222222');
          this.sidenav.mode = 'side';
          // this.sidenav.open();
        }
      })
  }

}
