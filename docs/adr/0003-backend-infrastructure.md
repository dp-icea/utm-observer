# 3. Backend infrastructure

Date: 2025-07-16

## Status

Accepted

## Context

I first planned on interacting with the BR-UTM ecosystem APIs using just the frontend application, but I was having CORS-related issues due to the request being managed by the browser.

## Decision

Using a base project inspired by the Fast API template I previously created in the USS Kit to create a authentication free (will live inside the internal application network) backend service to "proxy" all the interactions and authentications. I wont run any database because I wont support any volume creation.

## Consequences

I need to run both applications on deployment. The frontend will be exposed to the public and the backend will be only accessible from the internal network which needs to be configured inside the docker compose later.
