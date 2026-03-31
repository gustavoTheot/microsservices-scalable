FROM node:lts-alpine AS base

# Para fazer escalonamento horizontal, não se tem 1 aplicação rodando, se tem várias e para isso ser possível, as aplicações precisams er stateles (não guardar nada em disco), sendo possível matar a aplicação e subir outra sem perder dados. Para isso, o ideal é usar um banco de dados externo, como o MongoDB, para guardar os dados da aplicação. Assim, mesmo que a aplicação seja reiniciada, os dados não serão perdidos.

# --------- Layer de dependências ---------

FROM base AS deps

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

# --------- Layer de build ---------

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 api

RUN chown api:nodejs .

COPY --chown=api:nodejs . .
COPY --from=deps /app/node_modules ./node_modules

USER api

EXPOSE 3333

ENV PORT=3333
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["npm", "run", "start"]

# Devo rodar:
# docker build . -t service-orders
# docker run -p 3333:3333 service-orders