# =============================================================================
# Rescue Platform — Drupal Backend Dockerfile
# =============================================================================
# Multi-stage build:
#   base      - PHP 8.2 + Apache with all required extensions
#   composer  - Installs Composer dependencies
#   dev       - Development image with Xdebug and Drush
#   prod      - Production-optimised image
# =============================================================================

# --- Stage 1: Base PHP + Apache image ---
FROM php:8.2-apache AS base

LABEL maintainer="Rescue Platform <https://github.com/AlannaBurke/rescue-platform>"
LABEL description="Rescue Platform Drupal Backend"

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libwebp-dev \
    libzip-dev \
    libxml2-dev \
    libicu-dev \
    libonig-dev \
    libpq-dev \
    mariadb-client \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions required by Drupal
RUN docker-php-ext-configure gd \
        --with-freetype \
        --with-jpeg \
        --with-webp \
    && docker-php-ext-install -j$(nproc) \
        gd \
        pdo \
        pdo_mysql \
        mysqli \
        zip \
        xml \
        mbstring \
        intl \
        opcache \
        bcmath \
        exif

# Enable Apache modules
RUN a2enmod rewrite headers expires deflate

# PHP configuration for Drupal
RUN echo "memory_limit = 256M" >> /usr/local/etc/php/conf.d/drupal.ini \
    && echo "upload_max_filesize = 64M" >> /usr/local/etc/php/conf.d/drupal.ini \
    && echo "post_max_size = 64M" >> /usr/local/etc/php/conf.d/drupal.ini \
    && echo "max_execution_time = 300" >> /usr/local/etc/php/conf.d/drupal.ini \
    && echo "max_input_vars = 3000" >> /usr/local/etc/php/conf.d/drupal.ini \
    && echo "date.timezone = UTC" >> /usr/local/etc/php/conf.d/drupal.ini

# OPcache configuration
RUN echo "opcache.enable = 1" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.memory_consumption = 128" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.interned_strings_buffer = 8" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.max_accelerated_files = 4000" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.revalidate_freq = 60" >> /usr/local/etc/php/conf.d/opcache.ini

# Apache virtual host configuration
COPY docker/apache-vhost.conf /etc/apache2/sites-available/000-default.conf

# Set working directory
WORKDIR /var/www/html

# --- Stage 2: Composer dependencies ---
FROM base AS composer

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy Composer files first for layer caching
COPY composer.json composer.lock* ./

# Install dependencies (no dev in prod)
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --optimize-autoloader \
    --prefer-dist

# Copy the rest of the application
COPY . .

# --- Stage 3: Development image ---
FROM base AS development

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Install Xdebug for development
RUN pecl install xdebug \
    && docker-php-ext-enable xdebug \
    && echo "xdebug.mode = debug" >> /usr/local/etc/php/conf.d/xdebug.ini \
    && echo "xdebug.start_with_request = yes" >> /usr/local/etc/php/conf.d/xdebug.ini \
    && echo "xdebug.client_host = host.docker.internal" >> /usr/local/etc/php/conf.d/xdebug.ini \
    && echo "xdebug.client_port = 9003" >> /usr/local/etc/php/conf.d/xdebug.ini

# Install Drush globally
RUN composer global require drush/drush && \
    echo 'export PATH="$PATH:/root/.composer/vendor/bin"' >> /root/.bashrc

# Set permissive file permissions for development
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

EXPOSE 80

CMD ["apache2-foreground"]

# --- Stage 4: Production image ---
FROM composer AS production

# Set correct permissions
RUN chown -R www-data:www-data /var/www/html \
    && find /var/www/html/web -type d -exec chmod 755 {} \; \
    && find /var/www/html/web -type f -exec chmod 644 {} \; \
    && chmod -R 777 /var/www/html/web/sites/default/files

# Remove development files
RUN rm -rf \
    /var/www/html/web/core/tests \
    /var/www/html/web/modules/contrib/*/tests \
    /var/www/html/web/themes/contrib/*/tests

EXPOSE 80

CMD ["apache2-foreground"]
