# Stage 1: Build the application
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN apk add --no-cache git
RUN yarn install --frozen-lockfile
COPY . .
ENV NODE_ENV production
RUN yarn build

# Stage 2: Serve the application
FROM node:18-alpine
ENV NODE_ENV production
WORKDIR /app
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/yarn.lock ./yarn.lock
RUN yarn install --frozen-lockfile --production
EXPOSE 8080
CMD ["yarn", "start"]