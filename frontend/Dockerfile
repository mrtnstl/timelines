# Build the React (Vite) app
FROM node:24-alpine AS builder
WORKDIR /app

# Install dependencies first for better layer caching.
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .
RUN npm run build

# Serve static files with Nginx
FROM nginx:stable-alpine AS production

# SPA fallback so deep links work in React Router.
RUN cat <<'EOF' > /etc/nginx/conf.d/default.conf
server {
	listen 80;
	server_name _;

	root /usr/share/nginx/html;
	index index.html;

	location / {
		try_files $uri $uri/ /index.html;
	}

	location /assets/ {
		expires 1y;
		add_header Cache-Control "public, immutable";
		try_files $uri =404;
	}
}
EOF

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]