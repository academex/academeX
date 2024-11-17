FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm cache clean --force
RUN npm install --legacy-peer-deps

COPY . .

RUN npx prisma generate

EXPOSE 3000

# CMD [ "npm","run","start:dev" ]
CMD [  "npm", "run", "start:migrate:prod" ]



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