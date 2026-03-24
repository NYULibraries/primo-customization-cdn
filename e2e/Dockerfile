FROM mcr.microsoft.com/playwright:v1.58.2-jammy

ENV INSTALL_PATH /e2e
ENV USER pwuser

WORKDIR $INSTALL_PATH

COPY e2e/package.json e2e/yarn.lock ./
RUN yarn install --frozen-lockfile \
    && yarn cache clean

COPY e2e/ .
RUN chmod +x ./docker-entrypoint.sh

COPY unit_tests/ /unit_tests/
WORKDIR /unit_tests
RUN yarn install --frozen-lockfile \
    && yarn cache clean

WORKDIR $INSTALL_PATH

RUN chown -R $USER:$USER /e2e /unit_tests

USER $USER

ENTRYPOINT [ "./docker-entrypoint.sh" ]

CMD ["yarn", "test:e2e"]
