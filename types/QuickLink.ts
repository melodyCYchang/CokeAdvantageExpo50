export interface QuickLink {
  termID: number;
  name: string;
  slug: string;
  termGroup: number;
  termTaxonomyID: number;
  taxonomy: string;
  description: string;
  parent: number;
  count: number;
  filter: string;
  termOrder: string;
  isRoot: boolean;
  linkType: string;
  childFolders: any[];
}

export const parseToQuickLink = (data: any) => ({
  termID: data?.term_id,
  name: data?.name,
  slug: data?.slug,
  termGroup: data?.term_group,
  termTaxonomyID: data?.term_taxonomy_id,
  taxonomy: data?.taxonomy,
  description: data?.description,
  parent: data?.parent,
  count: data?.count,
  filter: data?.filter,
  termOrder: data?.term_order,
  isRoot: data?.is_root,
  linkType: data?.link_type,
  childFolders: data?.child_folders
    ? data.child_folders.map(parseToQuickLink)
    : [],
});
