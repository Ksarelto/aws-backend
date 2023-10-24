import { HttpError } from "@/constants/httpError";
import { ResponseMessage } from "@/constants/responseMessage";
import { StatusCode } from "@/constants/statusCode";
import { findStockById, findStocks } from "@/repository/stocks.repository";
import { IStock } from "@/models/stock.model";

export const getStock = async (id: string): Promise<IStock> => {
  const stock = await findStockById(id)

  if (!stock) {
    throw new HttpError(
      StatusCode.NOT_FOUND,
      ResponseMessage.NOT_FOUND
    )
  }

  return stock
}

export const getStocks = async (): Promise<IStock[]> => {
  const stocks = await findStocks()

  return stocks
}
