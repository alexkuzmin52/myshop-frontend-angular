import {FormBuilder, FormGroup, Validators} from "@angular/forms";

export class UserEditForm {
  userForm: FormGroup;
  fb: FormBuilder = new FormBuilder();

  constructor() {
    this.userForm = this.fb.group({
      name: [{value: '', disabled: true}],

      surname: [{value: '', disabled: true}],
      email: [{value: '', disabled: true}],
      role: [{value: ''}],
      age: [{value: '', disabled: true}],
      phone: [{value: '', disabled: true}],
      gender: [{value: '', disabled: true}],
      photo: [''],
      status: ['']
    })
  }
}
