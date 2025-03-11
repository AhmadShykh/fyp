# Use Kali Linux as the base image
FROM kalilinux/kali-rolling

# Install necessary packages, including Docker and tools
RUN apt update && apt install -y \
    docker.io \
    nodejs \
    npm \
    curl \
    nmap \
    metasploit-framework \
    zaproxy && \
    apt clean && rm -rf /var/lib/apt/lists/*

USER root

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your server will run on
EXPOSE 3000

# Start Docker service and the Node.js server
CMD service docker start && node server.js

