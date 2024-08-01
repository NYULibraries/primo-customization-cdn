FROM mcr.microsoft.com/playwright:v1.42.1-focal

ENV CONTAINER_MODE true
ENV INSTALL_PATH /e2e
ENV USER pwuser

WORKDIR $INSTALL_PATH

COPY e2e/package.json e2e/yarn.lock ./
RUN yarn install --frozen-lockfile \
    && yarn cache clean \
    # Install only the Chromium browser, as it is the only browser needed for the project:
    # Reduce build time and size: no need to install other browser binaries, reduces the size of the image.
    && npx playwright install chromium

COPY e2e/ .

COPY unit_tests/ /unit_tests/
WORKDIR /unit_tests
RUN yarn install --frozen-lockfile \
    && yarn cache clean

WORKDIR $INSTALL_PATH

RUN chown -R $USER:$USER /e2e /unit_tests

USER $USER

ENTRYPOINT [ "./docker-entrypoint.sh" ]

CMD ["yarn", "test:e2e"]
