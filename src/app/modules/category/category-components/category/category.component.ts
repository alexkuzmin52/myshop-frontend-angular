import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ICategory, ISubCategory, ISubSubCategory} from "../../category-models";
import {CategoryActionEnum, RegexEnum} from "../../constants";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CategoryService} from "../../category-services";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  categories: ICategory[] = [];
  subCategories: ISubCategory[] = [];
  subSubCategories: ISubSubCategory[] = [];

  categoryActive: CategoryActionEnum;
  flagAddPhoto = false;

  // selectedCategory: number = 0;
  // selectedSubCategory: number = 0;
  // selectedSubSubCategory: number = 0;

  selectedCategory: ICategory | any;
  selectedSubCategory: any;
  selectedSubSubCategory: any;

  categoryForm: FormGroup;
  subCategoryForm: FormGroup;
  subSubCategoryForm: FormGroup;
  addSubCategoryForm: FormGroup;
  addSubSubCategoryForm: FormGroup;
  addCategoryPhoto: FormGroup;
  addSubCategoryPhoto: FormGroup;
  addSubSubCategoryPhoto: FormGroup;

  //TODO token from local storage
  token: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MTk2MDcxNjUsImV4cCI6MTYyODI0NzE2NX0.hVS9Esd4mVw8gHe97oUJTBd9VdyBCmddqJ1afHuS-Sk';


  constructor(private activatedRoute: ActivatedRoute,
              private fb: FormBuilder,
              private router: Router,
              private categoryService: CategoryService,
              private sanitizer: DomSanitizer) {
    this.categoryActive = CategoryActionEnum.NOT_ACTIONS;
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
    this.categoryActive = CategoryActionEnum.CREATE_CATEGORY;
  }

  onCreateSubCategory(): void {
    this.categoryActive = CategoryActionEnum.CREATE_SUB_CATEGORY;
  }

  onCreateSubSubCategory(): void {
    this.categoryActive = CategoryActionEnum.CREATE_SUB_SUB_CATEGORY;
  }

  onAddSubCategoryToCategory() {
    this.categoryActive = CategoryActionEnum.ADD_SUB_CATEGORY_TO_CATEGORY;
  }

  onAddSubSubCategoryToSubCategory() {
    this.categoryActive = CategoryActionEnum.ADD_SUB_SUB_CATEGORY_TO_SUB_CATEGORY;

  }

  onSubmitCategory(categoryForm: FormGroup) {
    console.log(categoryForm.value);
    this.categoryService.createCategory(categoryForm.value, this.token).subscribe((res) => {
        this.categories.push(res);
      },
      error => {
        alert(`error: ${error.error.message}`);
      });
  }

  onSubmitSubCategory(subCategoryForm: FormGroup) {
    console.log(subCategoryForm.value);
    this.categoryService.createSubCategory(subCategoryForm.value, this.token).subscribe((res) => {
        console.log(res);
      },
      error => {
        console.log(error.error.message);
        alert(`error: ${error.error.message}`);
      });
  }

  onSubmitSubSubCategory(subSubCategoryForm: FormGroup) {
    console.log(subSubCategoryForm.value);
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

  onChangeFile(event: any) {
    let fileList: FileList = event.target.files;
    if (fileList.length) {
      this.addCategoryPhoto.controls['logo'].setValue(fileList[0].name);
      this.categoryService.addFileCategory(fileList[0], this.selectedCategory.id, this.token).subscribe(res => {
        this.flagAddPhoto = false;
      })
    }
  }

  onCancelCategoryForms() {
    this.categoryActive = CategoryActionEnum.NOT_ACTIONS;
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

  onResetAddSubCategoryToCategory() {
    this.selectedCategory = 0;
    this.selectedSubCategory = 0;
  }

  onCancelAddSubCategoryToCategory() {
    this.categoryActive = CategoryActionEnum.NOT_ACTIONS;
    this.selectedCategory = 0;
    this.selectedSubCategory = 0;
  }

  onClickSelectedCategory(cat: ICategory) {
    this.selectedCategory = cat;
    this.addCategoryPhoto.controls['title'].setValue(this.selectedCategory.title)
    this.addCategoryPhoto.controls['overview_url'].setValue(this.selectedCategory.overview_url)
    this.addCategoryPhoto.controls['logo'].setValue(this.selectedCategory.logo)
    this.categoryActive = CategoryActionEnum.GET_SELECTED_CATEGORY;
    console.log(this.selectedCategory);
    this.categoryService.getCategoryPhoto(this.selectedCategory.id)
      .subscribe(res => {
        const url = URL.createObjectURL(res);
        this.selectedCategory.logoURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      })
  }

  onSubmitPhoto(addCategoryPhoto: FormGroup) {
    console.log(addCategoryPhoto.value);
  }

  onRefresh() {
    this.categoryService.getCategoryPhoto(this.selectedCategory.id)
      .subscribe(res => {
        const url = URL.createObjectURL(res);
        this.selectedCategory.logoURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      })
  }
}
