import mongoose from "mongoose";

export const baseStages = ({
  filters = {},
  searchQuery,
  skip = 0,
  limit = 10,
}: {
  filters?: any;
  searchQuery?: string;
  skip?: number;
  limit?: number;
}) => {
  const stages: any[] = [];

  if (searchQuery) {
    stages.push(
      {
        $search: {
          index: "products_search_index",
          compound: {
            should: [
              {
                autocomplete: {
                  query: searchQuery,
                  path: "title",
                  fuzzy: { maxEdits: 2, prefixLength: 1 },
                },
              },
              {
                text: {
                  query: searchQuery,
                  path: "description",
                  fuzzy: { maxEdits: 1 },
                },
              },
            ],
          },
        },
      },
      { $addFields: { score: { $meta: "searchScore" } } }
    );
  }

  stages.push({ $match: filters });

  return stages;
};
