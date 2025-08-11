# Stage 1: Build React Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/interface
ARG VITE_ION_ACCESS_TOKEN
ARG VITE_CREDENTIALS
COPY interface/package*.json ./
RUN npm ci
COPY interface/ ./
RUN npm run build

# Stage 2: Final Image with Nginx and Supervisor
FROM nginx

# Install Supervisor and Python
RUN apt update && apt install -y \
    supervisor \
    python3 \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy built frontend from the first stage
COPY --from=frontend-builder /app/interface/dist /usr/share/nginx/html

# Copy backend application code
COPY backend/ /app/backend/

# Install backend dependencies
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy Nginx and Supervisor configurations
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 80

# Start Supervisor to manage both Nginx and the backend
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
