export type ProductPackageSection = {
  title: string;
  items: string[];
};

export type ProductAttribute = {
  name: string;
  values: string[];
};

export type ProductDescriptionContent = {
  intro: string;
  sections: ProductPackageSection[];
};
