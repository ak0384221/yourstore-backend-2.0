import mongoose from "mongoose";
import { ApiError } from "../utils/apiError.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { Product } from "../models/Product.model.ts";
import { ApiResponse } from "../utils/apiResponse.ts";

const smartphones = [
  {
    title: "iPhone 5s",
    description:
      "The iPhone 5s is a classic smartphone known for its compact design and advanced features during its release. While it's an older model, it still provides a reliable user experience.",
    basePrice: 199.99,
    rating: 2.83,
    images: [
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/iphone-5s/1.webp",
        alt: "iPhone 5s image 1",
      },
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/iphone-5s/2.webp",
        alt: "iPhone 5s image 2",
      },
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/iphone-5s/3.webp",
        alt: "iPhone 5s image 3",
      },
    ],
    brand: "69608db82dc7ec1791ea80f8",
    varients: [
      {
        size: "standard",
        color: "default",
        stock: 25,
      },
    ],
    category: "696080d548c8014d2abb4b00",
  },
  {
    title: "iPhone 6",
    description:
      "The iPhone 6 is a stylish and capable smartphone with a larger display and improved performance. It introduced new features and design elements, making it a popular choice in its time.",
    basePrice: 299.99,
    rating: 3.41,
    images: [
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/iphone-6/1.webp",
        alt: "iPhone 6 image 1",
      },
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/iphone-6/2.webp",
        alt: "iPhone 6 image 2",
      },
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/iphone-6/3.webp",
        alt: "iPhone 6 image 3",
      },
    ],
    brand: "69608db82dc7ec1791ea80f8",
    varients: [
      {
        size: "standard",
        color: "default",
        stock: 60,
      },
    ],
    category: "696080d548c8014d2abb4b00",
  },
  {
    title: "iPhone 13 Pro",
    description:
      "The iPhone 13 Pro is a cutting-edge smartphone with a powerful camera system, high-performance chip, and stunning display. It offers advanced features for users who demand top-notch technology.",
    basePrice: 1099.99,
    rating: 4.12,
    images: [
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/1.webp",
        alt: "iPhone 13 Pro image 1",
      },
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/2.webp",
        alt: "iPhone 13 Pro image 2",
      },
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/3.webp",
        alt: "iPhone 13 Pro image 3",
      },
    ],
    brand: "69608db82dc7ec1791ea80f8",
    varients: [
      {
        size: "standard",
        color: "default",
        stock: 56,
      },
    ],
    category: "696080d548c8014d2abb4b00",
  },
  {
    title: "iPhone X",
    description:
      "The iPhone X is a flagship smartphone featuring a bezel-less OLED display, facial recognition technology (Face ID), and impressive performance. It represents a milestone in iPhone design and innovation.",
    basePrice: 899.99,
    rating: 2.51,
    images: [
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/iphone-x/1.webp",
        alt: "iPhone X image 1",
      },
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/iphone-x/2.webp",
        alt: "iPhone X image 2",
      },
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/iphone-x/3.webp",
        alt: "iPhone X image 3",
      },
    ],
    brand: "69608db82dc7ec1791ea80f8",
    varients: [
      {
        size: "standard",
        color: "default",
        stock: 37,
      },
    ],
    category: "696080d548c8014d2abb4b00",
  },
  {
    title: "Oppo A57",
    description:
      "The Oppo A57 is a mid-range smartphone known for its sleek design and capable features. It offers a balance of performance and affordability, making it a popular choice.",
    basePrice: 249.99,
    rating: 3.94,
    images: [
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/oppo-a57/1.webp",
        alt: "Oppo A57 image 1",
      },
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/oppo-a57/2.webp",
        alt: "Oppo A57 image 2",
      },
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/oppo-a57/3.webp",
        alt: "Oppo A57 image 3",
      },
    ],
    brand: "69608db82dc7ec1791ea8116",
    varients: [
      {
        size: "standard",
        color: "default",
        stock: 19,
      },
    ],
    category: "696080d548c8014d2abb4b00",
  },
  {
    title: "Oppo F19 Pro Plus",
    description:
      "The Oppo F19 Pro Plus is a feature-rich smartphone with a focus on camera capabilities. It boasts advanced photography features and a powerful performance for a premium user experience.",
    basePrice: 399.99,
    rating: 3.51,
    images: [
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/oppo-f19-pro-plus/1.webp",
        alt: "Oppo F19 Pro Plus image 1",
      },
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/oppo-f19-pro-plus/2.webp",
        alt: "Oppo F19 Pro Plus image 2",
      },
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/oppo-f19-pro-plus/3.webp",
        alt: "Oppo F19 Pro Plus image 3",
      },
    ],
    brand: "69608db82dc7ec1791ea8116",
    varients: [
      {
        size: "standard",
        color: "default",
        stock: 78,
      },
    ],
    category: "696080d548c8014d2abb4b00",
  },
  {
    title: "Oppo K1",
    description:
      "The Oppo K1 series offers a range of smartphones with various features and specifications. Known for their stylish design and reliable performance, the Oppo K1 series caters to diverse user preferences.",
    basePrice: 299.99,
    rating: 4.25,
    images: [
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/oppo-k1/1.webp",
        alt: "Oppo K1 image 1",
      },
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/oppo-k1/2.webp",
        alt: "Oppo K1 image 2",
      },
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/oppo-k1/3.webp",
        alt: "Oppo K1 image 3",
      },
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/oppo-k1/4.webp",
        alt: "Oppo K1 image 4",
      },
    ],
    brand: "69608db82dc7ec1791ea8116",
    varients: [
      {
        size: "standard",
        color: "default",
        stock: 55,
      },
    ],
    category: "696080d548c8014d2abb4b00",
  },
  {
    title: "Realme C35",
    description:
      "The Realme C35 is a budget-friendly smartphone with a focus on providing essential features for everyday use. It offers a reliable performance and user-friendly experience.",
    basePrice: 149.99,
    rating: 4.2,
    images: [
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/realme-c35/1.webp",
        alt: "Realme C35 image 1",
      },
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/realme-c35/2.webp",
        alt: "Realme C35 image 2",
      },
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/realme-c35/3.webp",
        alt: "Realme C35 image 3",
      },
    ],
    brand: "69608db82dc7ec1791ea8117",
    varients: [
      {
        size: "standard",
        color: "default",
        stock: 48,
      },
    ],
    category: "696080d548c8014d2abb4b00",
  },
  {
    title: "Realme X",
    description:
      "The Realme X is a mid-range smartphone known for its sleek design and impressive display. It offers a good balance of performance and camera capabilities for users seeking a quality device.",
    basePrice: 299.99,
    rating: 3.7,
    images: [
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/realme-x/1.webp",
        alt: "Realme X image 1",
      },
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/realme-x/2.webp",
        alt: "Realme X image 2",
      },
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/realme-x/3.webp",
        alt: "Realme X image 3",
      },
    ],
    brand: "69608db82dc7ec1791ea8117",
    varients: [
      {
        size: "standard",
        color: "default",
        stock: 12,
      },
    ],
    category: "696080d548c8014d2abb4b00",
  },
  {
    title: "Realme XT",
    description:
      "The Realme XT is a feature-rich smartphone with a focus on camera technology. It comes equipped with advanced camera sensors, delivering high-quality photos and videos for photography enthusiasts.",
    basePrice: 349.99,
    rating: 4.58,
    images: [
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/realme-xt/1.webp",
        alt: "Realme XT image 1",
      },
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/realme-xt/2.webp",
        alt: "Realme XT image 2",
      },
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/realme-xt/3.webp",
        alt: "Realme XT image 3",
      },
    ],
    brand: "69608db82dc7ec1791ea8117",
    varients: [
      {
        size: "standard",
        color: "default",
        stock: 80,
      },
    ],
    category: "696080d548c8014d2abb4b00",
  },
  {
    title: "Samsung Galaxy S7",
    description:
      "The Samsung Galaxy S7 is a flagship smartphone known for its sleek design and advanced features. It features a high-resolution display, powerful camera, and robust performance.",
    basePrice: 299.99,
    rating: 3.3,
    images: [
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s7/1.webp",
        alt: "Samsung Galaxy S7 image 1",
      },
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s7/2.webp",
        alt: "Samsung Galaxy S7 image 2",
      },
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s7/3.webp",
        alt: "Samsung Galaxy S7 image 3",
      },
    ],
    brand: "69608db82dc7ec1791ea8118",
    varients: [
      {
        size: "standard",
        color: "default",
        stock: 67,
      },
    ],
    category: "696080d548c8014d2abb4b00",
  },
  {
    title: "Samsung Galaxy S8",
    description:
      "The Samsung Galaxy S8 is a premium smartphone with an Infinity Display, offering a stunning visual experience. It boasts advanced camera capabilities and cutting-edge technology.",
    basePrice: 499.99,
    rating: 4.4,
    images: [
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s8/1.webp",
        alt: "Samsung Galaxy S8 image 1",
      },
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s8/2.webp",
        alt: "Samsung Galaxy S8 image 2",
      },
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s8/3.webp",
        alt: "Samsung Galaxy S8 image 3",
      },
    ],
    brand: "69608db82dc7ec1791ea8118",
    varients: [
      {
        size: "standard",
        color: "default",
        stock: 0,
      },
    ],
    category: "696080d548c8014d2abb4b00",
  },
  {
    title: "Samsung Galaxy S10",
    description:
      "The Samsung Galaxy S10 is a flagship device featuring a dynamic AMOLED display, versatile camera system, and powerful performance. It represents innovation and excellence in smartphone technology.",
    basePrice: 699.99,
    rating: 3.06,
    images: [
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s10/1.webp",
        alt: "Samsung Galaxy S10 image 1",
      },
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s10/2.webp",
        alt: "Samsung Galaxy S10 image 2",
      },
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s10/3.webp",
        alt: "Samsung Galaxy S10 image 3",
      },
    ],
    brand: "69608db82dc7ec1791ea8118",
    varients: [
      {
        size: "standard",
        color: "default",
        stock: 19,
      },
    ],
    category: "696080d548c8014d2abb4b00",
  },
  {
    title: "Vivo S1",
    description:
      "The Vivo S1 is a stylish and mid-range smartphone offering a blend of design and performance. It features a vibrant display, capable camera system, and reliable functionality.",
    basePrice: 249.99,
    rating: 3.5,
    images: [
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/vivo-s1/1.webp",
        alt: "Vivo S1 image 1",
      },
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/vivo-s1/2.webp",
        alt: "Vivo S1 image 2",
      },
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/vivo-s1/3.webp",
        alt: "Vivo S1 image 3",
      },
    ],
    brand: "69608db82dc7ec1791ea8119",
    varients: [
      {
        size: "standard",
        color: "default",
        stock: 50,
      },
    ],
    category: "696080d548c8014d2abb4b00",
  },
  {
    title: "Vivo V9",
    description:
      "The Vivo V9 is a smartphone known for its sleek design and emphasis on capturing high-quality selfies. It features a notch display, dual-camera setup, and a modern design.",
    basePrice: 299.99,
    rating: 3.6,
    images: [
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/vivo-v9/1.webp",
        alt: "Vivo V9 image 1",
      },
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/vivo-v9/2.webp",
        alt: "Vivo V9 image 2",
      },
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/vivo-v9/3.webp",
        alt: "Vivo V9 image 3",
      },
    ],
    brand: "69608db82dc7ec1791ea8119",
    varients: [
      {
        size: "standard",
        color: "default",
        stock: 82,
      },
    ],
    category: "696080d548c8014d2abb4b00",
  },
  {
    title: "Vivo X21",
    description:
      "The Vivo X21 is a premium smartphone with a focus on cutting-edge technology. It features an in-display fingerprint sensor, a high-resolution display, and advanced camera capabilities.",
    basePrice: 499.99,
    rating: 4.26,
    images: [
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/vivo-x21/1.webp",
        alt: "Vivo X21 image 1",
      },
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/vivo-x21/2.webp",
        alt: "Vivo X21 image 2",
      },
      {
        src: "https://cdn.dummyjson.com/product-images/smartphones/vivo-x21/3.webp",
        alt: "Vivo X21 image 3",
      },
    ],
    brand: "69608db82dc7ec1791ea8119",
    varients: [
      {
        size: "standard",
        color: "default",
        stock: 7,
      },
    ],
    category: "696080d548c8014d2abb4b00",
  },
];

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

  if (!Array.isArray(images) || !images.length) {
    throw new ApiError(400, "images must be a non-empty array");
  }

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

  const new_product = await Product.create({
    title,
    description,
    base_price,
    brand,
    category,
    discount: discount ?? null,
    images,
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

export { addProducts };
