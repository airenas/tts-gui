#########################################################################################
FROM node:16.16-alpine3.15 AS ng-builder

WORKDIR /src

RUN npm install -g @angular/cli

COPY synthesis-web/package.json synthesis-web/package-lock.json /src
RUN npm ci --no-audit

COPY synthesis-web /src/
RUN cat /src/src/environments/environment.prod.sample | sed 's/BUILD_VERSION/$BUILD_VERSION/g' > /src/src/environments/environment.prod.ts
RUN ng build --prod --output-path=/deploy/html --base-href / --output-hashing none

#########################################################################################
FROM nginxinc/nginx-unprivileged:1.20-alpine-perl

ARG BUILD_VERSION=0.1

LABEL org.opencontainers.image.version=$BUILD_VERSION \
      org.opencontainers.image.authors="airenass@gmail.com" \
      name="tts-gui" \
      maintainer="airenass@gmail.com" \
      vendor="airenass@gmail.com" \
      version=$BUILD_VERSION \
      release=$BUILD_VERSION \
      summary="This image is used to start TTS GUI HTML service" \
      description="TTS GUI service runtime based on nginx" 

COPY build/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY build/docker/set_env.sh /docker-entrypoint.d/
COPY --from=ng-builder /deploy/html /usr/share/nginx/html

USER root

RUN chown nginx:nginx /usr/share/nginx/html/* /usr/share/nginx/html/assets/* /usr/share/nginx/html

USER nginx
