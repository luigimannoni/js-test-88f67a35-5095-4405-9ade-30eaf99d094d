import { describe, expect, test, vi } from "vitest";
import { BookSearchApiClient } from "./books";

// Mock endpoint responses
const mockResponseJSON = [
  {
    book: {
      title: "Hamlet",
      author: "William Shakespeare",
      isbn: "9780140714548",
    },
    stock: {
      quantity: "5",
      price: "10.99",
    },
  },
  {
    book: {
      title: "Macbeth",
      author: "William Shakespeare",
      isbn: "9780140714685",
    },
    stock: {
      quantity: "3",
      price: "8.99",
    },
  },
];

const mockResponseXML = `
<?xml version="1.0" encoding="UTF-8" ?>
<root>
  <item>
    <book>
      <title>Hamlet</title>
      <author>William Shakespeare</author>
      <isbn>9780140714548</isbn>
    </book>
    <stock>
      <quantity>5</quantity>
      <price>10.99</price>
    </stock>
  </item>
  <item>
    <book>
      <title>Macbeth</title>
      <author>William Shakespeare</author>
      <isbn>9780140714685</isbn>
    </book>
    <stock>
      <quantity>3</quantity>
      <price>8.99</price>
    </stock>
  </item>
</root>
`;

// Mock fetch function
const fetchMock = vi.fn(() => ({
  ok: true,
  json: async () => mockResponseJSON,
  text: async () => mockResponseXML,
}));

vi.stubGlobal("fetch", fetchMock);

describe("BookSearchApiClient", () => {
  const books = [
    {
      title: "Hamlet",
      author: "William Shakespeare",
      isbn: "9780140714548",
      quantity: "5",
      price: "10.99",
    },
    {
      title: "Macbeth",
      author: "William Shakespeare",
      isbn: "9780140714685",
      quantity: "3",
      price: "8.99",
    },
  ];

  test("should be defined", () => {
    expect(BookSearchApiClient).toBeDefined();
  });

  test("should retrieve books with in a json format", async () => {
    const client = new BookSearchApiClient("json");
    const response = await client.getBooksByAuthor("Shakespeare", 10);
    expect(response).toEqual({ status: "success", books });
  });

  test("should retrieve books with in an xml format", async () => {
    const client = new BookSearchApiClient("xml");
    const response = await client.getBooksByAuthor("Shakespeare", 10);
    expect(response).toEqual({ status: "success", books });
  });

  test("should handle errors", async () => {
    fetchMock.mockImplementationOnce(() => ({
      status: 404,
      ok: false,
      json: async () => mockResponseJSON,
      text: async () => mockResponseXML,
    }));
    const client = new BookSearchApiClient("json");
    const response = await client.getBooksByAuthor("Shakespeare", 10);
    expect(response).toEqual({
      status: "error",
      message: "Request failed. Returned status of 404",
      books: [],
    });
  });
});
