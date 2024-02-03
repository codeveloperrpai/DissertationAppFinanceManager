import csv
from faker import Faker
import random
from datetime import datetime, timedelta

fake = Faker()

# Function to generate random transactions
def generate_transaction():
    account_name = random.choice(["ICICI Bank", "HDFC Bank", "IDBI Bank", "Cash"])
    amount = random.uniform(50, 5000)
    category = random.choice([ "Salary",
    "Office Supplies",
    "Travel Expenses",
    "Transportation",
    "Utilities",
    "Insurance",
    "Rent",
    "Training and Development",
    "Marketing",
    "Client Payments",
    "Team Building",
    "Software Licenses",
    "Equipment Purchase",
    "Legal Fees",
    "Miscellaneous"])
    description = fake.sentence()
    date = (datetime.now() - timedelta(days=random.randint(1, 365))).strftime('%Y-%m-%d')
    transaction_type = random.choice(["expense", "income"])

    return [account_name, round(amount, 2), category, description, date, transaction_type]

# Generate 200 transactions
transactions = [generate_transaction() for _ in range(600)]

# Write transactions to CSV file
with open('transactions2.csv', 'w', newline='') as csvfile:
    csv_writer = csv.writer(csvfile)
    csv_writer.writerow(['account_name', 'amount', 'category', 'description', 'date', 'type'])
    csv_writer.writerows(transactions)
