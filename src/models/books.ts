export interface Book {
  title: string;
  author: string;
  isbn: string;
  quantity: string;
  price: string;
}

export type BookAPIFormat = "json" | "xml";

export interface BookAPIResponse {
  status: string;
  message?: string;
  books: Book[];
}

export interface BookEndpointItem {
  book: {
    title: string;
    author: string;
    isbn: string;
  };
  stock: {
    quantity: string;
    price: string;
  };
}
