import mongoose from "mongoose";
import { ApiError } from "../utils/apiError.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { Product } from "../models/Product.model.ts";
import { ApiResponse } from "../utils/apiResponse.ts";
import { uploadOnCloudinary } from "../utils/cloudinary.ts";
import fs from "fs";
const addProducts = asyncHandler(async (req, res) => {
  //get all the necessary fields
  //validate fields
  //validate fields presense
  //1.validate string number array differently
  //2.check types of image,varient
  //3.check category,discount,brand has a valid mongoose id or not
  //4.create new Products
  //if succesfull then save it
  //create products

  const {
    title,
    description,
    base_price,
    images,
    brand,
    varients,
    category,
    discount,
  } = req.body;

  console.log(
    title,
    description,
    base_price,
    images,
    brand,
    varients,
    category,
    discount
  );
  //title validation
  if (!title || title.trim().length < 6) {
    throw new ApiError(400, "title is required");
  }

  //desc validation
  if (!description || description.trim().length < 20) {
    throw new ApiError(400, "description is required");
  }

  //price validation
  if (!base_price) {
    throw new ApiError(400, "price is required");
  }

  //array:image validation

  // if (!Array.isArray(images) || !images.length) {
  //   throw new ApiError(400, "images must be a non-empty array");
  // }

  //array:varients validation

  if (!Array.isArray(varients) || !varients.length) {
    throw new ApiError(400, "varients must be a non-empty array");
  }

  //mongoose objectId validation
  if (!mongoose.Types.ObjectId.isValid(category)) {
    throw new ApiError(400, "invalid category id");
  }

  if (!mongoose.Types.ObjectId.isValid(brand)) {
    throw new ApiError(400, "invalid brand id");
  }

  if (discount && !mongoose.Types.ObjectId.isValid(discount)) {
    throw new ApiError(400, "invalid discount id");
  }

  if (!req.files || req.files.length == 0) {
    throw new ApiError(400, "images missing");
  }
  console.log(req.files, req.files.length);

  const uploadedImages = [];

  for (let i = 0; i < req.files.length; i++) {
    const file = req.files[i];

    // Upload to Cloudinary
    const result = await uploadOnCloudinary(file.path);
    console.log(result);
    if (!result) {
      throw new ApiError(500, "Failed to upload image to Cloudinary");
    }

    // Clean up local temp file (optional if your util already deletes it)
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);

    // Add to images array in DB format
    uploadedImages.push({
      src: result.secure_url,
      alt: req.body.alts?.[i] || "", // optional alt text
    });
  }

  const new_product = await Product.create({
    title,
    description,
    base_price,
    brand,
    category,
    discount: discount ?? null,
    images: uploadedImages,
    varients,
  });
  console.log(new_product);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        new_product,
        "new product succesfully added to database"
      )
    );
});

const removeProducts = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = req.user;
  if (!user || user.role !== "admin") {
    throw new ApiError(400, "Permission denied");
  }

  const deleted_product = await Product.findByIdAndDelete(id);
  res
    .status(200)
    .json(new ApiResponse(200, deleted_product, "product deleted succesfully"));
});

const getProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filters = {};
  //Product.find({category:'mobiles',title:{$regex:''phone,options:'i'},base_price:{$gte:''}})

  if (req.query.category) {
    filters.category = new mongoose.Types.ObjectId(String(req.query.category));
  }

  if (req.query.search) {
    filters.title = {
      $regex: req.query.search,
      $options: "i",
    };
  }

  if (req.query.minPrice || req.query.maxPrice) {
    filters.base_price = {};
    if (req.query.minPrice) {
      filters.base_price.$gte = Number(req.query.minPrice);
    }
    if (req.query.maxPrice) {
      filters.base_price.$lte = Number(req.query.maxPrice);
    }
  }

  const pipeline = [];

  if (req.query.search) {
    pipeline.push({
      $search: {
        index: "products_search_index",
        compound: {
          should: [
            {
              autocomplete: {
                query: req.query.search,
                path: "title",
                fuzzy: {
                  maxEdits: 2,
                  prefixLength: 1,
                },
              },
            },
            {
              text: {
                query: req.query.search,
                path: "description",
                fuzzy: {
                  maxEdits: 1,
                },
              },
            },
          ],
        },
      },
    });

    // expose search score
    pipeline.push({
      $addFields: {
        score: { $meta: "searchScore" },
      },
    });
  }

  pipeline.push(
    { $match: filters },
    {
      $facet: {
        products: [
          { $sort: req.query.search ? { score: -1 } : { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },

          {
            $lookup: {
              from: "brands",
              localField: "brand",
              foreignField: "_id",
              as: "brand",
            },
          },
          { $unwind: { path: "$brand", preserveNullAndEmptyArrays: true } },

          {
            $lookup: {
              from: "discounts",
              localField: "discount",
              foreignField: "_id",
              as: "discount",
            },
          },
          { $unwind: { path: "$discount", preserveNullAndEmptyArrays: true } },

          {
            $project: {
              title: 1,
              base_price: 1,
              rating: 1,
              images: { $slice: ["$images", 2] },
              varients: 1,
              brand: { _id: 1, name: 1 },
              discount: { amount: 1, type: 1 },
            },
          },
        ],
        totalCount: [{ $count: "count" }],
      },
    }
  );

  const products = await Product.aggregate(pipeline);
  res.status(200).json(
    new ApiResponse(200, {
      products,
    })
  );
});
//how i added the products in bulk
// const addManyProducts = asyncHandler(async (req, res) => {
//   async function fetchAll() {
//     const res = await fetch("https://dummyjson.com/products?limit=0");
//     const data = await res.json();
//     return data.products;
//   }
//   const hashedCategory = {
//     beauty: "696080d548c8014d2abb4af3",
//     fragrances: "696080d548c8014d2abb4af4",
//     "home-decoration": "696080d548c8014d2abb4af7",
//     "kitchen-accessories": "696080d548c8014d2abb4af8",
//     laptops: "696080d548c8014d2abb4af9",
//     "mens-shirts": "696080d548c8014d2abb4afa",
//     "mens-shoes": "696080d548c8014d2abb4afb",
//     "mens-watches": "696080d548c8014d2abb4afc",
//     "mobile-accessories": "696080d548c8014d2abb4afd",
//     motorcycle: "696080d548c8014d2abb4afe",
//     "skin-care": "696080d548c8014d2abb4aff",
//     smartphones: "696080d548c8014d2abb4b00",
//     "sports-accessories": "696080d548c8014d2abb4b01",
//     sunglasses: "696080d548c8014d2abb4b02",
//     tablets: "696080d548c8014d2abb4b03",
//     tops: "696080d548c8014d2abb4b04",
//     furniture: "696080d548c8014d2abb4af5",
//     groceries: "696080d548c8014d2abb4af6",
//     "womens-dresses": "696080d548c8014d2abb4b07",
//     "womens-jewellery": "696080d548c8014d2abb4b08",
//     "womens-shoes": "696080d548c8014d2abb4b09",
//     "womens-watches": "696080d548c8014d2abb4b0a",
//     "womens-bags": "696080d548c8014d2abb4b06",
//     vehicle: "696080d548c8014d2abb4b05",
//     "proggrammer-zone": "69608249e4467594d6486d60",
//   };
//   const hashedBrands = {
//     essence: "69608db82dc7ec1791ea80ea",
//     "velvet-touch": "69608db82dc7ec1791ea80ec",
//     chanel: "69608db82dc7ec1791ea80f0",
//     "calvin-klein": "69608db82dc7ec1791ea80ef",
//     dior: "69608db82dc7ec1791ea80f1",
//     "dolce-&-gabbana": "69608db82dc7ec1791ea80f2",
//     gucci: "69608db82dc7ec1791ea80f3",
//     "annibale-colombo": "69608db82dc7ec1791ea80f4",
//     "furniture-co.": "69608db82dc7ec1791ea80f5",
//     knoll: "69608db82dc7ec1791ea80f6",
//     "bath-trends": "69608db82dc7ec1791ea80f7",
//     apple: "69608db82dc7ec1791ea80f8",
//     asus: "69608db82dc7ec1791ea80f9",
//     huawei: "69608db82dc7ec1791ea80fa",
//     lenovo: "69608db82dc7ec1791ea80fb",
//     dell: "69608db82dc7ec1791ea80fc",
//     "fashion-trends": "69608db82dc7ec1791ea80fd",
//     gigabyte: "69608db82dc7ec1791ea80fe",
//     "classic-wear": "69608db82dc7ec1791ea80ff",
//     "casual-comfort": "69608db82dc7ec1791ea8100",
//     "urban-chic": "69608db82dc7ec1791ea8101",
//     nike: "69608db82dc7ec1791ea8102",
//     puma: "69608db82dc7ec1791ea8103",
//     "chic-cosmetics": "69608db82dc7ec1791ea80ed",
//     "nail-couture": "69608db82dc7ec1791ea80ee",
//     longines: "69608db82dc7ec1791ea8106",
//     rolex: "69608db82dc7ec1791ea8107",
//     amazon: "69608db82dc7ec1791ea8108",
//     beats: "69608db82dc7ec1791ea8109",
//     techgear: "69608db82dc7ec1791ea810a",
//     gadgetmaster: "69608db82dc7ec1791ea810b",
//     snaptech: "69608db82dc7ec1791ea810c",
//     provision: "69608db82dc7ec1791ea810d",
//     "generic-motors": "69608db82dc7ec1791ea810e",
//     kawasaki: "69608db82dc7ec1791ea810f",
//     speedmaster: "69608db82dc7ec1791ea8112",
//     scootmaster: "69608db82dc7ec1791ea8111",
//     motogp: "69608db82dc7ec1791ea8110",
//     attitude: "69608db82dc7ec1791ea8113",
//     olay: "69608db82dc7ec1791ea8114",
//     vaseline: "69608db82dc7ec1791ea8115",
//     oppo: "69608db82dc7ec1791ea8116",
//     realme: "69608db82dc7ec1791ea8117",
//     samsung: "69608db82dc7ec1791ea8118",
//     vivo: "69608db82dc7ec1791ea8119",
//     "fashion-shades": "69608db82dc7ec1791ea811a",
//     "fashion-fun": "69608db82dc7ec1791ea811b",
//     chrysler: "69608db82dc7ec1791ea811c",
//     dodge: "69608db82dc7ec1791ea811d",
//     fashionista: "69608db82dc7ec1791ea811e",
//     "elegance-collection": "69608db82dc7ec1791ea8121",
//     heshe: "69608db82dc7ec1791ea811f",
//     prada: "69608db82dc7ec1791ea8120",
//     "comfort-trends": "69608db82dc7ec1791ea8122",
//     pampi: "69608db82dc7ec1791ea8124",
//     "fashion-diva": "69608db82dc7ec1791ea8123",
//     "fashion-express": "69608db82dc7ec1791ea8125",
//     iwc: "69608db82dc7ec1791ea8126",
//     "fashion-gold": "69608db82dc7ec1791ea8127",
//     "fashion-co.": "69608db82dc7ec1791ea8128",
//     "off-white": "69608db82dc7ec1791ea8104",
//     "fashion-timepieces": "69608db82dc7ec1791ea8105",
//     unknown: "69608ddfa0a4bf83e439d987",
//   };

//   async function mapped() {
//     const products = await fetchAll();
//     const mappedPro = products?.map((product) => {
//       return {
//         title: product?.title,
//         description: product?.description,
//         base_price: product?.price,
//         category: hashedCategory[product.category],
//         rating: product?.rating || 0,
//         varients: [{ color: "default", size: "default", stock: product.stock }],
//         images: product?.images?.map((img) => {
//           return { src: img, alt: product?.title };
//         }),
//         brand: hashedBrands[product.brand?.trim()?.toLowerCase()] || null,
//         discount: null,
//         dimensions: product.dimensions,
//         return_policy: null,

//         warrantyInfo: null,
//       };
//     });
//     console.log(mappedPro);
//     return mappedPro;
//   }
//   const product = await mapped();
//   const newProducts = await Product.insertMany(product);
//   res.json(newProducts);
// });

export { addProducts, removeProducts, getProducts };
