#!/bin/bash

# Install dependencies in the root directory
echo "Installing dependencies in the root directory..."
npm install

# Change to the 'marketplace' directory and install dependencies
echo "Installing dependencies in the marketplace directory..."
cd marketplace
npm install

# Run the marketplace development server
echo "Starting the marketplace development server..."
npm run dev &

# Go back to the root directory
cd ../

# Start the Vite server
echo "Starting the Vite server..."
npx vite
