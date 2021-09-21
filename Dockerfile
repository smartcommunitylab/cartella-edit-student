FROM node:12-alpine AS frontend-build
ARG ENVIRONMENT=demo
COPY ./ /tmp
COPY docker-props/ /tmp/src/environments/
WORKDIR /tmp
RUN npm install
RUN npm install -g @ionic/cli
RUN ionic build --configuration=${ENVIRONMENT}

FROM nginx:alpine
RUN apk add --no-cache tzdata
ENV TZ=Europe/Rome
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=frontend-build /tmp/www /usr/share/nginx/html/edit-studente
