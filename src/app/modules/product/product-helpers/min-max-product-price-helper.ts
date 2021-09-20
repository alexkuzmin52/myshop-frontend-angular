import {IProduct} from "../product-models/product-interface";

export const minMaxProductPriceHelper = (products: IProduct[]): { min: number, max: number } => {
  // console.log('minMaxProductPriceHelper++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
  // console.log(products);
  products.sort((a, b) => a.price > b.price ? 1 : -1);
  const min = products[0].price;
  const max = products[products.length - 1].price;
  return {min: min, max: max};
  // const minMaxPrice = ({min: min, max: max});
  // return minMaxPrice;
}
