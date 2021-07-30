import {ActivatedRoute, Router} from "@angular/router";
import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

import {CategoryActionEnum, RegexEnum} from "../../constants";
import {CategoryService} from "../../category-services";
import {ICategory, ISubCategory, ISubSubCategory} from "../../category-models";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  categories: ICategory[] = [];
  subCategories: ISubCategory[] = [];
  subSubCategories: ISubSubCategory[] = [];

  categoryAction: CategoryActionEnum;
  flagAddPhoto = false;

  selectedCategory: ICategory | any;
  selectedSubCategory: ISubCategory | any;
  selectedSubSubCategory: ISubSubCategory | any;

  categoryForm: FormGroup;
  subCategoryForm: FormGroup;
  subSubCategoryForm: FormGroup;
  addSubCategoryForm: FormGroup;
  addSubSubCategoryForm: FormGroup;
  addCategoryPhoto: FormGroup;
  addSubCategoryPhoto: FormGroup;
  addSubSubCategoryPhoto: FormGroup;

  token: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MTk2MDcxNjUsImV4cCI6MTYyODI0NzE2NX0.hVS9Esd4mVw8gHe97oUJTBd9VdyBCmddqJ1afHuS-Sk';

  constructor(private activatedRoute: ActivatedRoute,
              private fb: FormBuilder,
              private router: Router,
              private categoryService: CategoryService,
              private sanitizer: DomSanitizer) {
    this.categoryAction = CategoryActionEnum.NOT_ACTIONS;
    this.categories = activatedRoute.snapshot.data.data[0];
    this.subCategories = activatedRoute.snapshot.data.data[1];
    this.subSubCategories = activatedRoute.snapshot.data.data[2];

    for (const category of this.categories) {
      category.isChecked = false;
      category.isSubCategories = !category.subCategories.length;
      console.log('category.isSubCategories: ', category.isSubCategories);

      for (const subCategory of category.subCategories) {
        subCategory.isChecked = false;
        subCategory.isSubSubCategories = !subCategory.subSubCategories.length;
      }
    }

    this.categoryForm = fb.group({
      title: ['', [Validators.required, Validators.pattern(RegexEnum.title_categories)]],
      overview_url: ['', [Validators.required, Validators.pattern(RegexEnum.url)]],
    })

    this.subCategoryForm = fb.group({
      title: ['', [Validators.required, Validators.pattern(RegexEnum.title_categories)]],
      overview_url: ['', [Validators.required, Validators.pattern(RegexEnum.url)]],
    })

    this.subSubCategoryForm = fb.group({
      title: ['', [Validators.required, Validators.pattern(RegexEnum.title_categories)]],
      overview_url: ['', [Validators.required, Validators.pattern(RegexEnum.url)]],
    })

    this.addSubCategoryForm = fb.group({
      idCat: ['', [Validators.required]],
      id: ['', [Validators.required]]
    })

    this.addSubSubCategoryForm = fb.group({
      idSubCat: ['', [Validators.required]],
      id: ['', [Validators.required]]
    })

    this.addCategoryPhoto = fb.group({
      title: ['', [Validators.required, Validators.pattern(RegexEnum.title_categories)]],
      overview_url: ['', [Validators.required, Validators.pattern(RegexEnum.url)]],
      logo: ['']
    })
    this.addSubCategoryPhoto = fb.group({
      title: ['', [Validators.required, Validators.pattern(RegexEnum.title_categories)]],
      overview_url: ['', [Validators.required, Validators.pattern(RegexEnum.url)]],
      logo: ['']
    })
    this.addSubSubCategoryPhoto = fb.group({
      title: ['', [Validators.required, Validators.pattern(RegexEnum.title_categories)]],
      overview_url: ['', [Validators.required, Validators.pattern(RegexEnum.url)]],
      logo: ['']
    })
  }

  ngOnInit(): void {
  }

  onHome() {
    this.router.navigate([''])
  }

  onCreateCategory(): void {
    this.categoryAction = CategoryActionEnum.CREATE_CATEGORY;
  }

  onCreateSubCategory(): void {
    this.categoryAction = CategoryActionEnum.CREATE_SUB_CATEGORY;
  }

  onCreateSubSubCategory(): void {
    this.categoryAction = CategoryActionEnum.CREATE_SUB_SUB_CATEGORY;
  }

  onAddSubCategoryToCategory() {
    this.categoryAction = CategoryActionEnum.ADD_SUB_CATEGORY_TO_CATEGORY;
  }

  onAddSubSubCategoryToSubCategory() {
    this.categoryAction = CategoryActionEnum.ADD_SUB_SUB_CATEGORY_TO_SUB_CATEGORY;

  }

  onSubmitCategory(categoryForm: FormGroup) {
    this.categoryService.createCategory(categoryForm.value, this.token).subscribe((res) => {
        this.categories.push(res);
      },
      error => {
        alert(`error: ${error.error.message}`);
      });
  }

  onSubmitSubCategory(subCategoryForm: FormGroup) {
    this.categoryService.createSubCategory(subCategoryForm.value, this.token).subscribe((res) => {
        console.log(res);
      },
      error => {
        console.log(error.error.message);
        alert(`error: ${error.error.message}`);
      });
  }

  onSubmitSubSubCategory(subSubCategoryForm: FormGroup) {
    this.categoryService.createSubSubCategory(subSubCategoryForm.value, this.token).subscribe((res) => {
        console.log(res);
      },
      error => {
        console.log(error.error.message);
        alert(`error: ${error.error.message}`);
      });

  }

  onAddLogo() {
    this.flagAddPhoto = true;
  }

  onChangeCategoryFile(event: any) {
    let fileList: FileList = event.target.files;
    if (fileList.length) {
      this.addCategoryPhoto.controls['logo'].setValue(fileList[0].name);
      this.categoryService.addFileCategory(fileList[0], this.selectedCategory.id, this.token).subscribe(res => {
        console.log(res);
        // this.flagAddPhoto = false;
      })
    }
    this.flagAddPhoto = false;

  }

  onChangeSubCategoryFile(event: any) {
    let fileList: FileList = event.target.files;
    if (fileList.length) {
      this.addSubCategoryPhoto.controls['logo'].setValue(fileList[0].name);
      this.categoryService.addFileSubCategory(fileList[0],
        this.selectedSubCategory.id,
        this.selectedSubCategory,
        // this.selectedSubCategory.title,
        this.token).subscribe(res => {
        this.flagAddPhoto = false;
      })
    }
  }

  onChangeSubSubCategoryFile(event: any) {
    let fileList: FileList = event.target.files;
    if (fileList.length) {
      this.addSubSubCategoryPhoto.controls['logo'].setValue(fileList[0].name);
      this.categoryService.addFileSubSubCategory(fileList[0], this.selectedSubSubCategory.id, this.token).subscribe(res => {
        this.flagAddPhoto = false;
      })
    }

  }

  onCancelCategoryForms() {
    this.categoryAction = CategoryActionEnum.NOT_ACTIONS;
  }

  onChangeCategoryCheckBox(category: ICategory, event: any) {
    category.isChecked = event.target.checked;
  }

  onChangeSubCategoryCheckBox(subCategory: ISubCategory, event: any) {
    subCategory.isChecked = event.target.checked;
  }

  onSubmitAddSubCategory(param: FormGroup) {
    this.categoryService.addSubCategoryToCategory(param.value, this.token).subscribe(res => {
      },
      error => {
        alert(`error: ${error.error.message}`)
      })
  }

  onSubmitAddSubSubCategory(param: FormGroup) {
    this.categoryService.addSubSubCategoryToSubCategory(param.value, this.token).subscribe(res => {
      },
      error => {
        alert(`error: ${error.error.message}`)
      })
  }

  onResetAddSubCategoryToCategory() {
    this.selectedCategory = 0;
    this.selectedSubCategory = 0;
  }

  onResetAddSubSubCategoryToCategory() {
    this.selectedSubCategory = 0;
    this.selectedSubSubCategory = 0;
  }

  onCancelAddSubCategoryToCategory() {
    this.categoryAction = CategoryActionEnum.NOT_ACTIONS;
    this.selectedCategory = 0;
    this.selectedSubCategory = 0;
  }

  onCancelAddSubSubCategoryToCategory() {
    this.categoryAction = CategoryActionEnum.NOT_ACTIONS;
    this.selectedSubCategory = 0;
    this.selectedSubSubCategory = 0;
  }

  onClickSelectedCategory(cat: ICategory) {
    this.selectedCategory = cat;
    this.addCategoryPhoto.controls['title'].setValue(this.selectedCategory.title)
    this.addCategoryPhoto.controls['overview_url'].setValue(this.selectedCategory.overview_url)
    this.addCategoryPhoto.controls['logo'].setValue(this.selectedCategory.logo)
    this.categoryAction = CategoryActionEnum.GET_SELECTED_CATEGORY;

    this.categoryService.getCategoryPhoto(this.selectedCategory.id)
      .subscribe(res => {
        const url = URL.createObjectURL(res);
        this.selectedCategory.logoURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      })
  }

  onClickSelectedSubCategory(sub: ISubCategory) {
    this.selectedSubCategory = sub;
    this.addSubCategoryPhoto.controls['title'].setValue(this.selectedSubCategory.title);
    this.addSubCategoryPhoto.controls['overview_url'].setValue(this.selectedSubCategory.overview_url);
    this.addSubCategoryPhoto.controls['logo'].setValue(this.selectedSubCategory.logo);
    this.categoryAction = CategoryActionEnum.GET_SELECTED_SUB_CATEGORY;

    this.categoryService.getSubCategoryPhoto(this.selectedSubCategory.id)
      .subscribe(res => {
        const url = URL.createObjectURL(res);
        this.selectedSubCategory.logoURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      })
  }

  onClickSelectedSubSubCategory(sub_sub: ISubSubCategory) {
    this.selectedSubSubCategory = sub_sub;
    this.addSubSubCategoryPhoto.controls['title'].setValue(this.selectedSubSubCategory.title);
    this.addSubSubCategoryPhoto.controls['overview_url'].setValue(this.selectedSubSubCategory.overview_url);
    this.addSubSubCategoryPhoto.controls['logo'].setValue(this.selectedSubSubCategory.logo);
    this.categoryAction = CategoryActionEnum.GET_SELECTED_SUB_SUB_CATEGORY;

    this.categoryService.getSubSubCategoryPhoto(this.selectedSubSubCategory.id)
      .subscribe(res => {
        const url = URL.createObjectURL(res);
        this.selectedSubSubCategory.logoURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      })
  }

  onDeleteCategory() {
    this.categoryService.deleteCategory(this.selectedCategory, this.token).subscribe(res => {
      console.log(res)
    },
      error => {
        alert(`error: ${error.error.message}`
        )
      })

  }

  onDeleteSubCategory() {
    this.categoryService.deleteSubCategory(this.selectedSubCategory, this.token).subscribe(res => {
        console.log(res)
      },
      error => {
        alert(`error: ${error.error.message}`
        )
      })
  }

  onDeleteSubSubCategory() {
    this.categoryService.deleteSubSubCategory(this.selectedSubSubCategory, this.token).subscribe(res => {
        console.log(res)
      },
      error => {
        alert(`error: ${error.error.message}`
        )
      })
  }
}
