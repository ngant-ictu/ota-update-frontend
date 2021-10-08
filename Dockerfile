FROM node:12.16.1 as build-stage
WORKDIR /codebase
COPY . /codebase      
RUN npm install
RUN npm rebuild node-sass
RUN npm run build  

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /codebase/dist /var/www/ota
WORKDIR /app
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/* /etc/nginx/templates/default.conf.template

# expose HTTPS port
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]