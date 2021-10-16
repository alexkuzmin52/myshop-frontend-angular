import {ActivatedRoute, Router} from "@angular/router";
import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BreakpointObserver} from "@angular/cdk/layout";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatSidenav} from "@angular/material/sidenav";
import {Subject} from "rxjs";
import {delay, takeUntil} from "rxjs/operators";

import {IUser} from "../../user-models";
import {UserRoleEnum} from "../../user-constans";
import {UserService} from "../../user-services";
import {UserStatusEnum} from "../../user-constans";

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  selectedUser: IUser | any = 0;
  userPhoto: File | any = null;
  sourcePhotoFile: SafeResourceUrl = '';
  photoURL: SafeResourceUrl = '';

  destroy$: Subject<boolean> = new Subject<boolean>();

  userEditForm: FormGroup;

  roleChange = false;
  addPhoto = false;
  preview = false;

  roles: Array<string>;
  statuses: Array<string>;

  token: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MjgzMTY1NDUsImV4cCI6MTYzNjk1NjU0NX0.0B0nGk9yZZc2zO0Butx8J6ugMFkc_ddhi1Hwe-UobjE';

  constructor(private userService: UserService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private menuToggleObserver: BreakpointObserver,
              private fb: FormBuilder,
              private sanitizer: DomSanitizer) {
    this.roles = Object.values(UserRoleEnum);
    this.roles.shift();
    this.statuses = Object.values(UserStatusEnum);
    this.statuses.shift();

    this.userEditForm = fb.group({
      role: [''],
      status: ['']
    })
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
          this.userService.getUser(params.userID)
            .subscribe(res => {
              console.log(res);
              this.selectedUser = res;
              this.getUserPhoto(this.selectedUser);
            },
              error => {
                console.log(error.error.message);
              })
        }
      )
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngAfterViewInit() {
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
      },
        error => {
          console.log(error.error.message);
        })
  }

  onChangeRole() {
    this.roleChange = true;
    this.addPhoto = false;
  }

  onSubmitUserEditForm() {
    this.userService.updateUser(this.userEditForm.value as Partial<IUser>, this.selectedUser._id, this.token)
      .subscribe(res => {
          this.selectedUser = res;
          this.userEditForm.controls['role'].patchValue(this.selectedUser.role);
          this.userEditForm.controls['status'].patchValue(this.selectedUser.status);
          this.getUserPhoto(this.selectedUser);

        },
        error => {
          console.log(error.error.message);
        })
  }

  onChangeAddPhoto() {
    this.addPhoto = true;
    this.roleChange = false;
  }

  onChangeUserPhoto(event: any) {
    const fileList = event.target.files;

    if (fileList.length > 0) {
      this.preview = true;
      this.userPhoto = fileList[0];
      this.sourcePhotoFile = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.userPhoto));
    }
  }

  onSaveUserPhoto() {
    this.userService.saveUserPhoto(this.userPhoto, this.token)
      .subscribe(res => {
        const url = URL.createObjectURL(res);
        this.selectedUser.photoSRC = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      },
        error => {
          console.log(error.error.message);
        });

    this.photoURL = '';
    this.addPhoto = false;
    this.preview = false;
  }

  getUserPhoto(user: IUser) {
    if (user.photo) {
      this.userService.getUserPhoto(user)
        .subscribe(res => {
          const url = URL.createObjectURL(res);
          user.photoSRC = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        },
          error => {
            console.log(error.error.message);
          })
    }
  }

  onCancel() {
    this.photoURL = '';
    this.addPhoto = false;
    this.preview = false;
    this.roleChange = false;
  }
}


