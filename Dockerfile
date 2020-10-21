FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=frontend-build /tmp/www /usr/share/nginx/html/edit-studente
