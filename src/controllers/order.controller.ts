import { normalizeOrderInput } from "../service/order/normalizeOrderInput.service.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";

const addOrder = asyncHandler(async (req, res) => {
  const normalized = normalizeOrderInput(req.body);
  res.json(normalized);
});

const getOrder = asyncHandler(async (req, res) => {});

const getAllOrder = asyncHandler(async (req, res) => {});

export { getOrder, getAllOrder, addOrder };
