import requests
import json

categories = {
    "categories": [
        {"name": "Rent"},
        {"name": "Insurance"},
        {"name": "Salary"},
        {"name": "Software Licenses"},
        {"name": "Training and Development"},
        {"name": "Team Building"},
        {"name": "Utilities"},
        {"name": "Legal Fees"},
        {"name": "Equipment Purchase"},
        {"name": "Miscellaneous"},
        {"name": "Office Supplies"},
        {"name": "Travel Expenses"},
        {"name": "Transportation"},
        {"name": "Client Payments"},
        {"name": "Marketing"},
    ]
}

url = "http://localhost:5000/add_category"  # Added missing protocol

for cat in categories["categories"]:
    payload = json.dumps(cat)  # Pass the category directly
    headers = {
        'Content-Type': 'application/json',
        'Cookie': 'session=993aeb68-f51f-43d2-99d2-1cf37e5b1ef6.k8Zq8yT1wi_DFgMCydlXc3fg0rk'
    }

    response = requests.post(url, headers=headers, data=payload)

    print(response.text)
