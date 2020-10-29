FROM node:12-alpine AS frontend-build
COPY ./ /tmp
COPY docker-props/ /tmp/src/environments/
WORKDIR /tmp
RUN npm install
RUN npm install -g @ionic/cli
RUN ionic build

FROM nginx:alpine
RUN apk add --no-cache tzdata
ENV TZ=Europe/Rome
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=frontend-build /tmp/www /usr/share/nginx/html/edit-studente
