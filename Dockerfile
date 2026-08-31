# =============================================================
#  AVMG FRONTEND — Next.js 16, standalone output
#  Three stages: deps -> builder -> runner
# =============================================================

# ---------- deps ----------
# TODO(you): base image.
# Think before you copy the backend's answer. The backend needed
# bookworm-slim because yt-dlp is a Python zipapp and ffmpeg had to come
# from Debian's repo. Does ANY of that apply to a Next.js app that only
# runs JS? What's the smallest sane Node 20 base here, and why is it a
# defensible choice for this image when it wasn't for the backend?
FROM node:20-alpine AS deps
WORKDIR /app

# TODO(you): enable pnpm.
# Note: unlike the backend, avmg-f's package.json has NO "packageManager"
# field — but there IS a pnpm-lock.yaml. So corepack has nothing to read a
# version from. Either add the field to package.json (arguably the right
# fix) or pin the version explicitly here. Your call — but say which and why.
RUN corepack enable && corepack prepare pnpm@10.28.0 --activate

# TODO(you): copy only what's needed to resolve dependencies.
# Same two files as the backend, same layer-caching reason.
COPY package.json pnpm-lock.yaml ./

# TODO(you): install from the lockfile.
RUN pnpm install --frozen-lockfile


# ---------- builder ----------
FROM deps AS builder
WORKDIR /app

# TODO(you): bring in the source.
COPY . .

# ---- THE STAGE 4 LESSON -------------------------------------
# TODO(you): NEXT_PUBLIC_API_URL has to exist as a real env var at the moment
# `next build` runs, or it gets inlined as `undefined` and every API call in
# the browser breaks with a useless error.
#
# Two instructions, in order:
#   1. declare a build-time argument (with a sensible default for local use)
#   2. promote it into an environment variable so the build process sees it
#
# Value must end in /api — see avmg-f/.env. And think about which host the
# BROWSER will use: this string is used by the user's browser, not by the
# container. Does "http://api:5000/api" work here? Why or why not?
ARG NEXT_PUBLIC_API_URL=http://localhost:5000/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# TODO(you): build it.
RUN pnpm run build


# ---------- runner ----------
# TODO(you): base image — same reasoning as `deps`.
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# TODO(you): create/las use a non-root user before copying anything it owns.
# The node image already ships a `node` user (uid 1000) — same as the backend.
RUN chown node:node /app
USER node

# TODO(you): copy the three things standalone needs. This is the part people
# get wrong. `next build` with output:"standalone" produces:
#
#   .next/standalone/   <- server.js + traced node_modules (NOT static assets)
#   .next/static/       <- JS/CSS chunks, hashed filenames
#   public/             <- your svgs etc.
#
# Standalone deliberately EXCLUDES the last two, because in a real deployment
# they're normally served by a CDN, not by Node. You're not using a CDN, so
# you must copy them in yourself — and they must land at the exact paths
# server.js expects relative to WORKDIR.
#
# Use --chown so the files are owned by the user you just switched to.
# Hint on the first one: standalone's contents go at the ROOT of /app, not
# in a subfolder. The other two keep their original relative paths.
COPY --from=builder --chown=node:node /app/.next/standalone/ .
COPY --from=builder --chown=node:node /app/.next/static/ ./.next/static
COPY --from=builder --chown=node:node /app/public/ ./public

# TODO(you): the port. Next's standalone server reads PORT.
EXPOSE 3000

# TODO(you): a gotcha that will cost you 20 minutes if you skip it.
# standalone's server.js binds to localhost by default. Inside a container,
# localhost means "only this container" — Docker's port mapping will connect
# to nothing and you'll get an empty reply. Which env var fixes it, and what
# value makes it listen on all interfaces?
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# TODO(you): start it.
# NOT `next start` — that command doesn't exist in a standalone image
# (there's no next CLI in there). What single file do you run?
CMD ["node", "server.js"]
