FROM node:12-alpine AS frontend-build
COPY ./ /tmp
COPY docker-props/ /tmp/src/environments/
WORKDIR /tmp
RUN npm install
RUN npm install -g @angular/cli
RUN ng build --base-href /edit-studente/

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=frontend-build /tmp/www /usr/share/nginx/html/edit-studente/
RUN rm /usr/share/nginx/html/50x.html /usr/share/nginx/html/index.html
