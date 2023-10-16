import { HttpError } from "@/constants/httpError";
import { ResponseMessage } from "@/constants/responseMessage";
import { StatusCode } from "@/constants/statusCode";
import {
  addProduct,
  findProductById,
  findProducts
} from "@/repository/products.repository.";
import { IRequestProduct, IResponseProduct } from "@/models/product.model";
import { IStock } from "@/models/stock.model";
import * as crypto from 'crypto'

export const createNewProduct = async (product: IRequestProduct): Promise<IResponseProduct> => {
  const id = crypto.randomUUID()

  const newProduct = await addProduct({
    ...product,
    id
  })

  return newProduct
}

export const getProduct = async (id: string, count: number): Promise<IResponseProduct> => {
  const product = await findProductById(id)

  if (!product) {
    throw new HttpError(
      StatusCode.NOT_FOUND,
      ResponseMessage.NOT_FOUND
    )
  }

  return {
    ...product,
    count
  }
}

export const getProducts = async (stocks: IStock[]): Promise<IResponseProduct[]> => {
  const products = await findProducts()

  const result = products.map((product) => {
    const appropriateStock = stocks.find((stock) => stock.productId === product.id)

    return {
      ...product,
      count: appropriateStock.count
    }
  })

  return result
}
