# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production --legacy-peer-deps
RUN npx prisma generate

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Set production environment
# ENV NODE_ENV=production

# EXPOSE 3000

# CMD ["npm", "run", "start:migrate:prod"]

# # Developement:
# # FROM node:20-alpine

# WORKDIR /app

# COPY package*.json ./
# COPY prisma ./prisma/

# RUN npm install --legacy-peer-deps
# RUN npx prisma generate

# COPY . .

# EXPOSE 3000

# CMD ["npm", "run", "start:dev"]




# FROM node:20

# WORKDIR /usr/src/app

# COPY package*.json ./

# RUN npm cache clean --force
# RUN npm install --legacy-peer-deps

# COPY . .

# RUN npx prisma generate

# EXPOSE 3000

# # CMD [ "npm","run","start:dev" ]
# CMD [  "npm", "run", "start:migrate:prod" ]



#  to create an image using dcoker file: 
# docker build -t imageTag -f fileName . #. for the location of the dir
#  to run a container from an image:
# docker run -p localPort:containerPort  imageTag
# docker run -p 4000:3000  imageTag
# but the problem is we can't access the project (because docker is isolated from local machine), so we need to expose it 
# we still  not live reloaded, so to do this  

# ! after creating a compose file;
# now we don't need the pre cmds, we jsut need to run this:
# docker-compose up --build