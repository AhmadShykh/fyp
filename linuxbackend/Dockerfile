# Use Kali Linux as the base image
FROM kalilinux/kali-rolling

# Install necessary tools (including Docker)
RUN apt update && apt install -y \
    nodejs \
    npm \
    curl \
    nmap \
    metasploit-framework \
    docker.io && \
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

# Start the Node.js server
CMD ["node", "server.js"]

