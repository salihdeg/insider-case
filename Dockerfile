FROM node:22.3-slim


WORKDIR /opt/insider-case
COPY . .

ENV PORT=3000
ENV DATABASE_URL=mysql://root:123456@mysql:3306/insider-case
ENV JWT_SECRET_KEY=whencowsfly

# During testing with Prisma, encountered an error due to missing OpenSSL.
# Installing OpenSSL to resolve the issue.
RUN apt-get update -y && apt-get install -y openssl

RUN npm install
RUN npm run build


EXPOSE 3000

CMD ["npm", "run", "start:migrate:prod"]