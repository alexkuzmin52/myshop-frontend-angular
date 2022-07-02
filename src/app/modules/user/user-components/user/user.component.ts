import {ActivatedRoute, Router} from "@angular/router";
import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BreakpointObserver} from "@angular/cdk/layout";
import {DomSanitizer} from "@angular/platform-browser";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSidenav} from "@angular/material/sidenav";
import {Subject} from "rxjs";
import {delay, takeUntil} from "rxjs/operators";

import {IUserFilterQuery} from "../../user-models";
import {IUser} from "../../user-models";
import {UserRoleEnum} from "../../user-constans";
import {UserService} from "../../user-services";
import {UserStatusEnum} from "../../user-constans";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})

export class UserComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  users: IUser[];

  userFilter: IUserFilterQuery = {};
  userFilterArray: Array<any> = [];
  userFilterForm: FormGroup;

  ageMin: number;
  ageMax: number;

  roles: Array<string>;
  listRoles: Array<string> = [];
  statuses: Array<string>;
  listStatuses: Array<string> = [];

  filterActions = {
    actionAgeGte: false,
    actionAgeLte: false,
  };

  destroy$: Subject<boolean> = new Subject<boolean>();

  gridColumns = 4;

  constructor(private activatedRouter: ActivatedRoute,
              private fb: FormBuilder,
              private menuToggleObserver: BreakpointObserver,
              private router: Router,
              private sanitizer: DomSanitizer,
              private userService: UserService) {
    this.users = this.activatedRouter.snapshot.data.data;
    this.ageMin = (Math.min(...this.users.map(v => v.age)));
    this.ageMax = (Math.max(...this.users.map(v => v.age)));
    this.roles = Object.values(UserRoleEnum);
    this.statuses = Object.values(UserStatusEnum);
    this.listRoles = Array.from(new Set(this.users.map(v => v.role)));
    this.listRoles.unshift('');
    this.listStatuses = Array.from(new Set(this.users.map(v => v.status)));
    this.listStatuses.unshift('');

    this.userFilterForm = fb.group({
      role: [''],
      ageGte: [this.ageMin, [Validators.min(this.ageMin), Validators.max(this.ageMax), Validators.pattern('^\\d+$')]],
      ageLte: [this.ageMax, [Validators.min(this.ageMin), Validators.max(this.ageMax), Validators.pattern('^\\d+$')]],
      status: [''],
    });
        this.getAllUserPhoto(this.users);
  }

  ngOnInit(): void {
    this.userFilterForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      // TODO .pipe(delay(1))
      .subscribe(res => {
        this.userFilter = Object.fromEntries(Object.entries(res).filter(([k, v]) => v !== '' && v !== null));
      })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit(): any {
    this.menuToggleObserver
      .observe(['(max-width: 800px)'])
      .pipe(delay(1))
      .subscribe((res) => {
        if (res.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close().then();
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open().then();
        }
      })
  }

  onChangeUserFilter() {
    if (!this.filterActions.actionAgeGte)
      delete this.userFilter.ageGte;
    if (!this.filterActions.actionAgeLte)
      delete this.userFilter.ageLte;

    this.userFilterArray = Object.entries(this.userFilter);
    this.userService.getUsersByFilters(this.userFilter).subscribe(res => {
      this.users = res;
      this.userFilterForm.controls['ageGte'].setValue(Math.min(...this.users.map(v => v.age)), {emitEvent: false});
      this.userFilterForm.controls['ageLte'].setValue(Math.max(...this.users.map(v => v.age)), {emitEvent: false});
      this.getAllUserPhoto(this.users);
    })
  }

  onItemEdit(user: IUser) {
    this.router.navigate(['user/edit'], {queryParams: {userID: user._id, photo: user.photo}}).then();
  }

  onChangeAgeGte() {
    this.filterActions.actionAgeGte = true;
    this.onChangeUserFilter();
  }

  onChangeAgeLte() {
    this.filterActions.actionAgeLte = true;
    this.onChangeUserFilter();
  }

  onRemoveElemFilters(event: any) {
    switch (event[0]) {
      case 'role':
        this.userFilterForm.controls['role'].setValue('');
        this.onChangeUserFilter();
        break;
      case 'status':
        this.userFilterForm.controls['status'].setValue('');
        this.onChangeUserFilter();
        break;
      case 'ageGte':
        this.filterActions.actionAgeGte = false;
        this.onChangeUserFilter();
        break;
      case 'ageLte':
        this.filterActions.actionAgeLte = false;
        this.onChangeUserFilter();
        break;
      default:
        break;
    }
  }

  getAllUserPhoto(users: IUser[]) {
    for (let user of users) {
      if (user.photo) {
        this.userService.getUserPhoto(user)
          .subscribe(res => {
            const url = URL.createObjectURL(res);
            user.photoSRC = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          })
      }
    }
  }

  onClearFilters() {
    this.userFilterForm.reset();
    this.onChangeUserFilter();
  }
}
