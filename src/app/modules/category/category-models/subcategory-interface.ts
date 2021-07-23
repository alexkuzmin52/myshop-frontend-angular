export interface ISubCategory {
  id: number;
  parentID: number;
  overview_url: string;
  title: string;
  logo: string;
  subSubCategories: any[];
  isChecked: boolean;
  isSubSubCategories: boolean;
  logoURL: string;

}
