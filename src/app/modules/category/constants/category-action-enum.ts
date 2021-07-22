export enum CategoryActionEnum {
  NOT_ACTIONS = '',
  CREATE_CATEGORY = 'create category',
  CREATE_SUB_CATEGORY = 'create subCategory',
  CREATE_SUB_SUB_CATEGORY = 'create subSubCategory',
  DELETE_CATEGORY = 'delete category',
  DELETE_SUB_CATEGORY = 'delete subCategory',
  DELETE_SUB_SUB_CATEGORY = 'delete subSubCategory',
  ADD_SUB_CATEGORY_TO_CATEGORY = 'add subCategory to Category',
  ADD_SUB_SUB_CATEGORY_TO_SUB_CATEGORY = 'add subSubCategory to subCategory',
  UPDATE_CATEGORY = 'update category',
  UPDATE_SUB_CATEGORY = 'update subCategory',
  UPDATE_SUB_SUB_CATEGORY = 'update subSubCategory',
  ADD_LOGO = 'add logo',
  GET_SELECTED_CATEGORY = 'get selected category',
  GET_SELECTED_SUB_CATEGORY = 'get selected subCategory',
  GET_SELECTED_SUB_SUB_CATEGORY = 'get selected subSubCategory'
}
