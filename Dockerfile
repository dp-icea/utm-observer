# Stage 1: Build the React interface
FROM node:18-alpine AS interface-builder
WORKDIR /app/interface
COPY interface/package*.json ./
RUN npm ci
COPY interface/ ./
RUN npm run build

# Stage 2: Build the FastAPI backend
FROM python:3.11-slim AS backend-builder
WORKDIR /app/backend
COPY backend/requirements.txt ./
RUN python -m venv venv
RUN source venv/bin/activate
RUN pip install --no-cache-dir --upgrade -r requirements.txt
COPY ./backend /app/backend

# Stage 3: Create the final production image
FROM nginx:alpine
FROM python:3.9-slim
WORKDIR /app

# Copy the backend code and dependencies
COPY --from=backend-builder /app /app

# Copy the built interface files from the interface-builder stage
COPY --from=interface-builder /app/interface/dist /usr/share/nginx/html

# Copy the Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Install Nginx
RUN apt-get update && apt-get install -y nginx

# Expose the ports for Nginx and the backend
EXPOSE 80
EXPOSE 8000

# Start Nginx and the backend application
CMD ["nginx -g daemon off && uvicorn app:app --host 0.0.0.0 --port 8000"]

