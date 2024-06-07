import { XMLParser } from "fast-xml-parser";
import {
  BookAPIFormat,
  BookAPIResponse,
  Book,
  BookEndpointItem,
} from "../models/books";

// process.env.BOOKS_API_HOST will be populated on build time, fallback to local dev value
const API_HOST =
  process.env.BOOKS_API_HOST || "http://api.book-seller-example.com";

const parser = new XMLParser({
  attributeNamePrefix: "",
  ignoreAttributes: false,
  numberParseOptions: {
    skipLike: /\d/,
    hex: false,
    leadingZeros: false,
  },
});

/**
 * BookSearchApiClient
 * @param format Set the format of the response. Can be either 'json' or 'xml'
 */
export class BookSearchApiClient {
  constructor(private format: BookAPIFormat = "json") {
    this.format = format;
  }

  /**
   * Request method, used internally to make requests to the API
   * @param path
   * @param params
   * @returns Response object
   */
  private async request(
    path: string,
    params: Record<string, string>
  ): Promise<Book[]> {
    const queryParams = new URLSearchParams(params).toString();

    const response = await fetch(`${API_HOST}/${path}?${queryParams}`);

    if (!response.ok) {
      throw new Error(`Request failed. Returned status of ${response.status}`);
    }

    const json =
      this.format === "json"
        ? await response.json()
        : parser.parse(await response.text()).root.item;

    const books: Book[] = json.map((item: BookEndpointItem) => ({
      title: item.book.title,
      author: item.book.author,
      isbn: item.book.isbn,
      quantity: item.stock.quantity,
      price: item.stock.price,
    }));

    return books;
  }

  /**
   * Get books by author
   * @param authorName
   * @param limit
   */
  public async getBooksByAuthor(
    authorName: string,
    limit: number
  ): Promise<BookAPIResponse> {
    try {
      const books: Book[] = await this.request("by-author", {
        q: authorName,
        limit: limit.toString(),
        format: this.format.toLowerCase(),
      });

      return {
        status: "success",
        books,
      };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      console.error(message);
      return {
        status: "error",
        message: message,
        books: [],
      };
    }
  }
}
