import {IProduct} from "../product-models/product-interface";

export const ChangeFilterValuesHelper = (products: IProduct[],
                                         filterValues:
                                           { category?: Array<string> ,
                                            brand?: Array<string>}
                                         ) => {
  filterValues.category = products.map(value => value.category);
}
