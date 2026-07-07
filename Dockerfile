# =========================
# BUILD STAGE
# =========================
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Angular build
RUN npm run build -- --configuration production

# диагностика (можешь убрать позже)
RUN ls -R /app/dist


# =========================
# NGINX STAGE
# =========================
FROM nginx:alpine

# Angular 17+ output
COPY --from=build /app/dist/magic-items/browser /usr/share/nginx/html

# нормальный nginx конфиг (БЕЗ echo, БЕЗ поломок)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]