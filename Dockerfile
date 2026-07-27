# Official Bun image — see https://bun.com/docs/guides/ecosystem/docker
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

FROM base AS release
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY package.json bun.lock ./
COPY nino ./nino
COPY bootstrap ./bootstrap
COPY app ./app
COPY config ./config
COPY routes ./routes
COPY resources ./resources
COPY database ./database
COPY types ./types
COPY scripts ./scripts
COPY tsconfig.json ./tsconfig.json
COPY bunfig.toml ./bunfig.toml

ENV NODE_ENV=production
ENV APP_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

USER root
# Normalize shebang line endings (Windows checkouts may ship CRLF)
RUN sed -i 's/\r$//' nino \
    && chmod +x nino \
    && mkdir -p storage/logs storage/framework/cache storage/sessions \
    && chown -R bun:bun /usr/src/app

USER bun
EXPOSE 3000/tcp

# Entrypoint: CLI wrapper → bootstrap/cli.ts (nino serve)
CMD ["./nino", "serve", "--port", "3000"]
