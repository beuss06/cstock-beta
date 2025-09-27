# ---- BUILD (Node) ----
FROM node:20 AS build
WORKDIR /app

# Dépendances
COPY package*.json ./
RUN npm ci

# Sources + variable API au build
COPY . .
ARG VITE_API_BASE
ENV VITE_API_BASE=${VITE_API_BASE}
RUN npm run build

# ---- RUNTIME (Nginx) ----
FROM nginx:alpine
# Sert le build statique
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
