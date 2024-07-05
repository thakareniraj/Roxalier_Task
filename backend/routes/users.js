var express = require("express");
var router = express.Router();

const mongoose = require("mongoose");
const transactionSchema = new mongoose.Schema({
  productTitle: String,
  productDescription: String,
  productPrice: Number,
  transactionDate: Date,
  // Add other fields as necessary
});
const Transaction = mongoose.model("Transaction", transactionSchema);

// Search and paginate transactions
router.get("/transactions", async (req, res) => {
  try {
    const { search, page = 1, perPage = 10 } = req.query;
    const pageNumber = parseInt(page);
    const itemsPerPage = parseInt(perPage);

    let query = {};

    if (search) {
      query = {
        $or: [
          { productTitle: { $regex: search, $options: "i" } },
          { productDescription: { $regex: search, $options: "i" } },
          {
            productPrice: isNaN(parseFloat(search))
              ? undefined
              : parseFloat(search),
          },
        ],
      };
    }

    const totalItems = await Transaction.countDocuments(query);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const transactions = await Transaction.find(query)
      .skip((pageNumber - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .sort({ transactionDate: -1 });

    res.json({
      transactions,
      currentPage: pageNumber,
      totalPages,
      totalItems,
      itemsPerPage,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving transactions", error: error.message });
  }
});

module.exports = router;

// This implementation does the following:

// We create a GET route /transactions that accepts query parameters for search, page, and perPage.
// If a search parameter is provided, we create a query that matches the search text against the product title, description, and price. The $regex operator with the i option allows for case-insensitive partial matching on strings.
// If no search parameter is provided, an empty query object is used, which will match all documents.
// We use mongoose methods to:

// Count the total number of matching documents
// Calculate the total number of pages
// Retrieve the transactions for the current page
// Sort the results by transaction date (most recent first)

// The results are returned as JSON, including the transactions, current page number, total pages, total items, and items per page.
// Error handling is implemented to catch and return any errors that occur during the process.

// This implementation supports:

// Searching by product title, description, or price
// Pagination with customizable page size
// Returning all records for a given page when no search parameter is provided
// Default pagination values (page 1, 10 items per page) when not specified

// To use this endpoint, you can make GET requests like:

// /transactions (returns first page of all transactions)
// /transactions?page=2&perPage=20 (returns second page with 20 items per page)
// /transactions?search=laptop (searches for "laptop" in title or description)
// /transactions?search=999.99 (searches for transactions with this price)

// Would you like me to explain any part of this code in more detail?
