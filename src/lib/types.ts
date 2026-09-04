export type MenuItem = {
  id: number;
  categoryId: number;
  nameFa: string;
  nameEn: string;
  descriptionFa: string;
  priceToman: number;
  imageUrl: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  isNew: boolean;
  sortOrder: number;
};

export type MenuCategory = {
  id: number;
  slug: string;
  nameFa: string;
  nameEn: string;
  sortOrder: number;
  iconKey: string;
  items: MenuItem[];
};

export type CafeSettings = {
  cafeName: string;
  taglineFa: string;
  taglineEn: string;
};

export type MenuPayload = {
  categories: MenuCategory[];
  settings: CafeSettings;
};
