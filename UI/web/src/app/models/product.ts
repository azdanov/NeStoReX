export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  pictureUrl: string;
  type: string;
  brand: string;
  quantityInStock: number;
}

export interface PaginatedProducts {
  products: Product[];
  metaData: ProductPagination;
}

export interface ProductOptions {
  types: string[];
  brands: string[];
}

export interface ProductFilters {
  orderBy: string;
  searchTerm?: string;
  types: string[];
  brands: string[];
  currentPage: number;
  pageSize: number;
}

export interface ProductPagination {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
}
