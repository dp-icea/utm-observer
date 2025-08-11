# 4. Single docker image

Date: 2025-08-11

## Status

Accepted

## Context

Initially we had a separate Docker image for each of the components in the system, one for the backend and another for the interface.

## Decision

Since the backend serves as a Back for Front application, it made more sense to have a single Docker image to run both things together. This simplifies the understanding of the system as we publish the image publicly.

## Consequences

This change simplifies the deployment process, as we only need to manage a single Docker image. It also simplifies the deployments of new instances of the viewer, reducing the complexity for anyone interested in the project.
