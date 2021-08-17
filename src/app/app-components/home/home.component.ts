import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {MatSidenav} from "@angular/material/sidenav";
import {delay} from "rxjs/operators";
import {BreakpointObserver} from "@angular/cdk/layout";
import {style} from "@angular/animations";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('sidenavRow')
  sidenavRow!: any;
  @ViewChild('sidenavCol')
  sidenavCol!: any;

  constructor(private router: Router, private menuToggleObserver: BreakpointObserver) { }

  ngOnInit(): void {
  }
  ngAfterViewInit():any {
    this.menuToggleObserver
      .observe(['(max-width: 800px)'])
      .pipe(delay(1))
      .subscribe((res) => {
        if (res.matches) {
          this.sidenavRow.nativeElement.setAttribute('style', 'display:none');
          this.sidenavCol.nativeElement.setAttribute('style', 'display:block');
        } else {
          this.sidenavRow.nativeElement.setAttribute('style', 'display:block');
          this.sidenavCol.nativeElement.setAttribute('style', 'display:none');
        }
      });
  }

  onCategory() {
    this.router.navigate(['category'])
  }

  onProduct() {
    this.router.navigate(['product'])
  }
}
