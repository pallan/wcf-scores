FROM mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm

# Pre-create ~/.claude with correct ownership so file-level bind mounts don't create it as root
RUN mkdir -p /home/node/.claude \
    && chown -R node:node /home/node/.claude
