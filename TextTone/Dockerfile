# frontend/Dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY  TextTone/package.json  TextTone/yarn.lock* ./
RUN npm install
COPY  TextTone .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY  TextTone/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]