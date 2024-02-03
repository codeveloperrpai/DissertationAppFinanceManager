"""
Financial Management System Backend

This Flask application serves as the backend for a financial management system.
It provides various API endpoints for user authentication, time-sheet management,
and finance-related functionalities.

"""

from flask import Flask, request, jsonify, session
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_session import Session
from config import ApplicationConfig
from models import db, User, Transaction, Category, Account
import datetime
import base64
import logging
from sqlalchemy import func, desc
import os
import pandas as pd

# UTILS

app = Flask(__name__)
app.config.from_object(ApplicationConfig)

CORS(app, supports_credentials=True, resources={r"/*/*": {"origins": "http://localhost:3000"}})
bcrypt = Bcrypt(app)
server_session = Session(app)
db.init_app(app)

with app.app_context():
    db.create_all()
    
# Define the log folder path
log_folder_path = "./logs"

# Check if the log folder exists, if not, create it
if not os.path.exists(log_folder_path):
    os.makedirs(log_folder_path)

log_file_name = datetime.datetime.today().strftime("%m.%d.%Y")
logging.basicConfig(filename=f'./logs/{log_file_name}.log', encoding='utf-8', level=logging.DEBUG)


# AUTH API'S

@app.route("/@me")
def get_current_user():
    """
    Get information about the currently logged-in user.

    Returns:
        JSON: User information.
    """
    try:
        user_id = session.get("user_id")

        if not user_id:
            logging.warning("401: Unauthorized request made")
            return jsonify({"error": "Unauthorized"}), 401

        user = User.query.filter_by(id=user_id).first()

        return jsonify({
            "id": user.id,
            "email": user.email,
            "name": user.first_name,
            "last_name": user.last_name
        })
    except Exception as e:
        logging.error(e)
        return jsonify({"error": str(e)}), 500


@app.route("/register", methods=["POST"])
def register_user():
    """
    Register a new user and create a session for them.

    Returns:
        JSON: User information.
    """
    try:
        email = request.json["email"]
        password = base64.b64decode(request.json["password"]).decode()
        first_name = request.json["first_name"].capitalize()
        last_name = request.json["last_name"].capitalize()

        user_exists = User.query.filter_by(email=email).first() is not None
        if user_exists:
            return jsonify({"error": "User already exists!"}), 409

        hashed_password = bcrypt.generate_password_hash(email + password)
        new_user = User(email=email, password=hashed_password, first_name=first_name, last_name=last_name)
        db.session.add(new_user)
        db.session.commit()

        session["user_id"] = new_user.id

        return jsonify({"id": new_user.id, "email": new_user.email})

    except Exception as e:
        logging.error(e)
        return jsonify({"error": str(e)}), 500


@app.route("/login", methods=["POST"])
def login_user():
    """
    Login an existing user and create a session.

    Returns:
        JSON: User information.
    """
    try:
        email = request.json["email"]
        password = base64.b64decode(request.json["password"]).decode()

        user = User.query.filter_by(email=email).first()
        if user is None:
            return jsonify({"error": "User does not exist"}), 401

        if not bcrypt.check_password_hash(user.password, email + password):
            return jsonify({"error": "Email/password do not match in the records"}), 401

        session["user_id"] = user.id
        return jsonify({"id": user.id, "email": user.email})

    except Exception as e:
        logging.error(e)
        return jsonify({"error": str(e)}), 500


@app.route("/logout", methods=["POST"])
def logout_user():
    """
    Logout the currently authenticated user.

    Returns:
        str: HTTP status code.
    """
    try:
        user_id = session.get("user_id")
        logging.info(f"{user_id} logged out")
        session.pop("user_id")
        return "200"

    except Exception:
        logging.warning("No session was found")
        return jsonify({"error": "No session was active"}), 400


@app.route("/add_transaction", methods=["POST"])
def add_transaction():
    """
    Add a new financial transaction and update the account balance.

    Returns:
        JSON: Success or error message.
    """
    try:
        # Check if the user is authenticated
        if 'user_id' not in session:
            return jsonify({"error": "User not authenticated"}), 401

        user_id = session['user_id']

        # Get transaction details from the request body
        try:
            amount = float(request.json.get("amount"))
            category = request.json.get("category")
            description = request.json.get("description")
            account_name = request.json.get("account_name")
            date_str = request.json.get("date")
            date = datetime.datetime.strptime(date_str.split('T')[0], '%Y-%m-%d') \
                if date_str else datetime.datetime.utcnow()
            transaction_type = request.json.get("type")
        except ValueError:
            return jsonify({"error": "Invalid amount format"}), 400

        # Check if the account already exists in the database
        account = Account.query.filter_by(name=account_name).first()

        # If the account does not exist, create a new account
        if not account:
            account = Account(
                name=account_name,
                initial_balance=0,  # You may want to set the initial balance as needed
                user_id=user_id  # Set the appropriate user_id
            )
            db.session.add(account)

        # Create a new transaction
        new_transaction = Transaction(
            user_id=user_id,
            amount=amount,
            category=category,
            description=description,
            account_name=account_name,
            date=date,
            type=transaction_type
        )

        # Add the transaction to the database
        db.session.add(new_transaction)

        # Update the account balance based on the type of transaction
        if transaction_type == 'income':
            account.balance += amount
        elif transaction_type == 'expense':
            account.balance -= amount

        db.session.commit()

        return jsonify({"message": "Transaction added successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/add_category", methods=["POST"])
def add_category():
    """
    Add a new spending category.

    Returns:
        JSON: Success or error message.
    """
    try:
        # Check if the user is authenticated
        if 'user_id' not in session:
            return jsonify({"error": "User not authenticated"}), 401

        user_id = session['user_id']

        # Get category details from the request body
        try:
            name = request.json.get("name")
        except Exception:
            return jsonify({"error": "Category name is required"}), 400

        # Check if the category with the same name already exists for the user
        existing_category = Category.query.filter_by(user_id=user_id, name=name).first()
        if existing_category:
            return jsonify({"error": "Category with the same name already exists"}), 400

        # Create a new category
        new_category = Category(user_id=user_id, name=name)

        # Add the category to the database
        db.session.add(new_category)
        db.session.commit()

        return jsonify({"message": "Category added successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/get_transactions", methods=["GET"])
def get_transactions():
    """
    Retrieve a list of financial transactions for the authenticated user.

    Returns:
        JSON: List of transaction records.
    """
    try:
        # Check if the user is authenticated
        if 'user_id' not in session:
            return jsonify({"error": "User not authenticated"}), 401

        user_id = session['user_id']

        # Retrieve transactions for the authenticated user, sorted by date in descending order
        user_transactions = Transaction.query.filter_by(user_id=user_id).order_by(desc(Transaction.date)).all()

        # Format the transactions as a list of dictionaries
        transactions_list = [
            {
                "id": transaction.id,
                "amount": transaction.amount,
                "category": transaction.category,
                "description": transaction.description,
                "account_name": transaction.account_name,
                "date": transaction.date.isoformat(),
            }
            for transaction in user_transactions
        ]

        return jsonify({"transactions": transactions_list}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/save_transaction', methods=['POST'])
def save_transaction():
    """
    Update an existing financial transaction.

    Returns:
        JSON: Success or error message.
    """
    try:
        data = request.json

        if 'id' not in data:
            return jsonify({"error": "Transaction ID not provided"}), 400

        transaction_id = data['id']

        # Retrieve the existing transaction from the database
        transaction = Transaction.query.get(transaction_id)

        if not transaction:
            return jsonify({"error": "Transaction not found"}), 404

        # Update transaction fields with new values
        if 'amount' in data:
            transaction.amount = data['amount']
        if 'category' in data:
            transaction.category = data['category']
        if 'description' in data:
            transaction.description = data['description']
        if 'date' in data:
            transaction.date = data['date']

        # Save changes to the database
        db.session.commit()

        response = jsonify({"message": "Transaction updated successfully"})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Credentials', 'true')

        return response
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/get_categories", methods=["GET"])
def get_categories():
    """
    Retrieve spending categories for the authenticated user.

    Returns:
        JSON: List of category records.
    """
    try:
        # Check if the user is authenticated
        if 'user_id' not in session:
            return jsonify({"error": "User not authenticated"}), 401

        user_id = session['user_id']

        # Retrieve categories for the authenticated user
        user_categories = Category.query.filter_by(user_id=user_id).all()

        # Format the categories as a list of dictionaries
        categories_list = [
            {
                "id": category.id,
                "name": category.name,
            }
            for category in user_categories
        ]

        return jsonify({"categories": categories_list}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/add_account", methods=["POST"])
def add_account():
    """
    Add a new financial account.

    Returns:
        JSON: Success or error message.
    """
    try:
        # Check if the user is authenticated
        if 'user_id' not in session:
            return jsonify({"error": "User not authenticated"}), 401

        user_id = session['user_id']

        # Get category details from the request body
        try:
            name = request.json.get("name")
            balance = request.json.get("balance")
        except Exception:
            return jsonify({"error": "Account name is required"}), 400

        # Check if the category with the same name already exists for the user
        existing_account = Account.query.filter_by(user_id=user_id, name=name).first()
        if existing_account:
            return jsonify({"error": "Account with the same name already exists"}), 400

        # Create a new category
        new_account = Account(user_id=user_id, name=name, balance=balance)

        # Add the category to the database
        db.session.add(new_account)
        db.session.commit()

        return jsonify({"message": "Category added successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/get_accounts", methods=["GET"])
def get_accounts():
    """
    Retrieve a list of financial accounts for the authenticated user.

    Returns:
        JSON: List of account records.
    """
    try:
        # Check if the user is authenticated
        if 'user_id' not in session:
            return jsonify({"error": "User not authenticated"}), 401

        user_id = session['user_id']

        # Retrieve categories for the authenticated user
        accounts = Account.query.filter_by(user_id=user_id).all()

        # Format the categories as a list of dictionaries
        account_list = [
            {
                "name": account_name.name,
                "balance": account_name.balance
            }
            for account_name in accounts
        ]

        return jsonify({"accounts": account_list}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/dashboard_statistics", methods=["GET"])
def dashboard_statistics():
    """
    Retrieve statistics for the user's financial dashboard.

    Returns:
        JSON: List of category records with percentages.
    """
    try:
        # Check if the user is authenticated
        if 'user_id' not in session:
            return jsonify({"error": "User not authenticated"}), 401

        user_id = session['user_id']

        # Retrieve total expenses for the authenticated user
        total_expenses = db.session.query(func.sum(Transaction.amount)).filter_by(user_id=user_id).scalar() or 0.0

        # Retrieve categories and their total expenses for the authenticated user
        categories_data = db.session.query(
            Category.id,
            Category.name,
            func.sum(Transaction.amount).label('category_total')
        ).outerjoin(Transaction, Category.name == Transaction.category).filter_by(user_id=user_id).group_by(
            Category.id).all()

        # Calculate percentage of total expense for each category
        categories_with_percentage = [
            {
                "name": category.name,
                "percentage": int(
                    (category.category_total / total_expenses) * 100 if total_expenses > 0 else 0.0)
            }
            for category in categories_data
        ]

        # Additional calculations and data can be added here based on your requirements

        return jsonify({"categories": categories_with_percentage}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/bulk_add_transactions", methods=["POST"])
def bulk_add_transactions():
    """
    Bulk add financial transactions from a CSV file.

    Returns:
        JSON: Success or error message.
    """
    try:
        with app.app_context():
            # Check if the user is authenticated
            if 'user_id' not in session:
                return jsonify({"error": "User not authenticated"}), 401

            user_id = session['user_id']

            # Read the CSV file
            transactions_df = pd.read_csv('/home/sachinpai/Desktop/dissertationApp/backend/utils/transactions2.csv',
                                          parse_dates=['date'])
            print(transactions_df)

            # Iterate through each row in the DataFrame and add transactions to the database
            for index, row in transactions_df.iterrows():
                # Check if the account already exists in the database
                account = Account.query.filter_by(name=row['account_name']).first()

                # If the account does not exist, create a new account
                if not account:
                    account = Account(
                        name=row['account_name'],
                        balance=0,  # You may want to set the balance as needed
                        user_id=1  # Set the appropriate user_id
                    )
                    db.session.add(account)

                # Create a new transaction
                transaction = Transaction(
                    user_id=user_id,  # Set the appropriate user_id
                    account_name=account.name,
                    amount=row['amount'],
                    category=row['category'],
                    description=row['description'],
                    date=row['date'],
                    type=row['type']
                )

                # Add the transaction to the database
                db.session.add(transaction)

                # Update the account balance based on the type of transaction
                if row['type'] == 'income':
                    account.balance += row['amount']
                elif row['type'] == 'expense':
                    account.balance -= row['amount']

                db.session.commit()

            return jsonify({"Result": "Success"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/export_to_csv')
def export_to_csv():
    """
    Export financial transactions to a CSV file.

    Returns:
        Response: CSV file.
    """
    try:
        # Fetch transactions from the database
        with app.app_context():
            transactions = Transaction.query.all()

        # Convert transactions to a DataFrame
        transactions_df = pd.DataFrame([
            {
                'account_name': transaction.account_name,
                'amount': transaction.amount,
                'category': transaction.category,
                'description': transaction.description,
                'date': transaction.date
            } for transaction in transactions
        ])

        # Create a CSV file from the DataFrame
        csv_data = transactions_df.to_csv(index=False)

        # Create a response with the CSV data
        response = app.response_class(
            csv_data,
            mimetype='text/csv',
            headers={'Content-Disposition': 'attachment; filename=transactions.csv'}
        )

        return response

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/")
def main():
    """
    Main endpoint to check the status of the server.

    Returns:
        str: Success message.
    """
    print("The program has started successfully")
    print("You can now run the react app and use the API's")
    return "Flask app is up and running"


if __name__ == "__main__":
    app.debug = True
    main()
    app.run()