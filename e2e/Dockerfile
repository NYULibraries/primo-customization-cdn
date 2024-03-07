FROM mcr.microsoft.com/playwright:v1.42.1-focal AS builder

WORKDIR /e2e

COPY e2e/package.json e2e/yarn.lock ./

# Install e2e dependencies
RUN yarn install --frozen-lockfile \
    && yarn cache clean \
    # Install only the Chromium browser, as it is the only browser needed for the project:
    # Reduce build time and size: no need to install other browser binaries, reduces the size of the image.
    && npx playwright install chromium

# Copy over remaining e2e files
COPY e2e/ .

# Copy the unit_tests directory (relative to the build context)
COPY unit_tests/ /unit_tests/

# Install unit test dependencies
WORKDIR /unit_tests
RUN yarn install --frozen-lockfile \
    && yarn cache clean;

# Return to the e2e directory
WORKDIR /e2e

FROM node:lts-bullseye-slim

RUN apt-get update -y && apt-get install -y curl

WORKDIR /e2e

# Install Chromium dependencies using the Playwright CLI
# Separation of concerns: The build stage is primarily focused on building and preparing the application,
# including installing dependencies required for the application to run.
# Installing Chromium dependencies in the production stage ensures that only the necessary dependencies
# for running the application are included in the final image, reducing the overall image size
RUN npx playwright install-deps chromium

# Copy e2e directory and dependencies from builder
COPY --from=builder /e2e .

# Copy unit_tests directory from builder
COPY --from=builder /unit_tests /unit_tests

# Copy the browser binaries
# https://github.com/microsoft/playwright/blob/1f209204cd18bce7d1bfae50f5af105dec752df8/utils/docker/Dockerfile.focal#L33
COPY --from=builder /ms-playwright /ms-playwright

RUN chown -R node:node /e2e && \
    chown -R node:node /unit_tests && \
    chown -R node:node /ms-playwright

# Set the PLAYWRIGHT_BROWSERS_PATH environment variable to tell Playwright where to look for the browser binaries
# https://github.com/microsoft/playwright/blob/1f209204cd18bce7d1bfae50f5af105dec752df8/utils/docker/Dockerfile.focal#L24
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

ENV CONTAINER_MODE true

# Switch to non-root user
USER node

# Entrypoint ensures $PLAYWRIGHT_BASE_URL has started
ENTRYPOINT [ "./docker-entrypoint.sh" ]

# Run playwright tests
CMD ["yarn", "test:e2e"]
