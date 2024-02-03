# Appendix A: Frontend Routes

This section outlines the various routes within the frontend application. Each route corresponds to a specific page or functionality, enhancing user navigation and interaction.

- **LandingPage:** Main application page.
- **LoginPage:** User login page.
- **NotFound:** Page for handling 404 errors.
- **RegisterPage:** User registration page.
- **FinanceDashboard:** Dashboard displaying financial overview.
- **AddTransactionPage:** Page for adding new financial transactions.
- **AllTransactions:** Page showing all financial transactions.
- **ShowBalances:** Page displaying account balances.

# Appendix B: Backend API Documentation

This section provides comprehensive documentation for the backend APIs. It covers authentication endpoints, finance management endpoints, and miscellaneous endpoints, offering developers insights into the functionalities and proper usage of each API.

## Authentication Endpoints:

- **/@me (GET):** Returns information about the currently logged-in user.
- **/register (POST):** Registers a new user and creates a session for them.
- **/login (POST):** Logs in an existing user and creates a session.
- **/logout (POST):** Logs out the currently authenticated user.

## Finance Management Endpoints:

- **/add_transaction (POST):** Adds a new financial transaction, updates the account balance.
- **/add_category (POST):** Adds a new spending category.
- **/get_transactions (GET):** Retrieves a list of financial transactions for the authenticated user.
- **/save_transaction (POST):** Updates an existing financial transaction.
- **/get_categories (GET):** Retrieves spending categories for the authenticated user.
- **/add_account (POST):** Adds a new financial account.
- **/get_accounts (GET):** Retrieves a list of financial accounts for the authenticated user.
- **/dashboard_statistics (GET):** Retrieves statistics for the user's financial dashboard.
- **/bulk_add_transactions (POST):** Bulk adds financial transactions from a CSV file.
- **/export_to_csv (GET):** Exports financial transactions to a CSV file.

## Miscellaneous Endpoints:

- **/ (GET):** The main endpoint returning a success message when the server is up and running.
