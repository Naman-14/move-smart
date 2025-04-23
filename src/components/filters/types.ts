
export interface FilterOption {
  id: string;
  label: string;
}

export interface ContentFilters {
  search: string;
  categories: string[];
  regions: string[];
  fundingStages: string[];
  tags: string[];
}
