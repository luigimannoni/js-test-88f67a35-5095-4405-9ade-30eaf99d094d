// This file is an example of how to use the BookSearchApiClient class to make requests to the Books endpoint
import { BookSearchApiClient } from "./api/books";
import { BookAPIResponse } from "./models/books";

// Create instances of the BookSearchApiClient class
const BookSearchApiClientJSON = new BookSearchApiClient("json");
const BookSearchApiClientXML = new BookSearchApiClient("xml");

// Get books by author
BookSearchApiClientJSON.getBooksByAuthor("Shakespeare", 10).then(
  (response: BookAPIResponse) => {
    console.log(response.books);
  }
);

// Get books by author in XML format
BookSearchApiClientXML.getBooksByAuthor("Shakespeare", 10).then(
  (response: BookAPIResponse) => {
    console.log(response.books);
  }
);

// Or use async/await
(async () => {
  const response = await BookSearchApiClientJSON.getBooksByAuthor(
    "Shakespeare",
    10
  );
  console.log(response.books);
})();
