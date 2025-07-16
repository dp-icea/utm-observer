# 2. Frontend framework usage

Date: 2025-07-16

## Status

Accepted

## Context

The issue motivating this decision, and any context that influences or constrains the decision.

I previously created the USS Kit using default webpack bundler. However I endedup having a very raw user experience.

## Decision

For this project, I decided to use the React frontend framework for more dynamic user experience. React is a popular JavaScript library for building user interfaces, and interacts well with the Cesium API for React (Called resium).

## Consequences

Using React will allow for a more modular and maintainable codebase, as well as better performance through its virtual DOM implementation. It also has a large ecosystem of libraries and tools that can be leveraged to enhance the user experience.
