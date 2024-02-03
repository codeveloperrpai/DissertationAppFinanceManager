# Flask and React Financial Management App

This is a Flask application that provides feature for financial management.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Database Models](#database-models)
- [Routes and Endpoints](#routes-and-endpoints)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)

## Overview

The Financial Management App is a web application designed to help users manage organizational finances effectively. It includes features for financial transactions, and user authentication.

## Features

- User authentication (register, login, logout)
- Financial transaction recording
- Dashboard for financial overview
- User-friendly frontend interfaces

## Getting Started

1. Clone the repository:

   ```
git clone <repository-url>
Install dependencies:

This application utilizes Redis to manage user sessions in the cache. Ensure that Redis is installed and running by executing the following command:

bash
Copy code
sudo service redis-server start
To set up and run the application, follow the steps below:

Step 1: Set Up Virtual Environment and Install Dependencies
Create a virtual environment and install the required packages listed in requirements.txt:

pip3 install virtualenv   # Install virtualenv if not already installed
python3 -m venv venv      # Create a virtual environment
source venv/bin/activate  # Activate the virtual environment
pip3 install -r requirements.txt  # Install dependencies
Step 2: Run the Backend
Navigate to the backend directory and run the backend server:


cd backend/
python3 app.py
Step 3: Run the Frontend
Navigate to the frontend directory, install the necessary packages, and start the frontend server:


cd frontend/
yarn install   # Install frontend dependencies
yarn start     # Start the frontend server
Now, the application should be up and running. Visit the specified URLs to access the backend and frontend components.

Feel free to reach out if you encounter any issues during the setup process.