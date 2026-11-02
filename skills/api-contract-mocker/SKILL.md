---
name: api-contract-mocker
description: Generates zero-dependency mock handlers and fixtures from API specs. Use when receiving OpenAPI schemas, Swagger JSON, or TypeScript interfaces to mock endpoints.
category: mocking
tags:
  - mocking
  - openapi
  - api
  - test-fixtures
---

## Skill Purpose
Translates OpenAPI, Swagger, or TypeScript interface contracts into realistic, type-safe JSON mock data and zero-dependency in-memory mock handlers without requiring external npm packages.

## Trigger Conditions
Activate this skill whenever:
- User provides an OpenAPI (3.0/3.1), Swagger, GraphQL, or TypeScript interface definition.
- Developing frontend UI components before backend endpoints are built or deployed.
- Creating isolated test fixtures or end-to-end integration tests without network dependencies.
- User instructs to "mock this endpoint", "generate mock data from schema", or "stub this API".

## Execution Protocol

1. **Schema Parsing & Route Extraction**:
   - Extract HTTP method (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`), endpoint URL pattern (e.g., `/api/v1/users/:id`), request body structure, query parameters, and response status codes.

2. **Realistic Mock Data Generation**:
   - Populate fields with plausible semantic test data rather than placeholder gibberish (`lorem ipsum`, `test1`).
   - Format compliance:
     - `uuid` -> RFC 4122 v4 compliant UUID (e.g., `d3b07384-d113-4f44-93e9-a68212133499`).
     - `date-time` -> ISO 8601 / RFC 3339 formatted strings (e.g., `2026-03-31T14:22:00Z`).
     - `email` -> Realistic domain emails (e.g., `alex.dev@zaarvy.io`).
     - `enum` -> Select primary valid enum value.

3. **Zero-Dependency Handler Synthesis**:
   - Generate a pure JavaScript / TypeScript in-memory fetch monkey-patch or request interceptor.
   - Support route matching with path parameters (e.g. regex or simple split) and query params.
   - Require **zero** external npm dependencies (no MSW, no Nock, no miragejs required).

4. **Fixture Export**:
   - Return clear JSON fixtures suitable for direct storage in `fixtures.json`.

## Constraints
- **NEVER** depend on heavy npm mocking frameworks (`msw`, `nock`, `express`) unless explicitly requested by the user.
- **NEVER** generate negative numbers for IDs, counts, or currency amounts.
- **NEVER** omit required fields defined in the schema contract.
- **NEVER** output invalid JSON or unescaped strings in mock fixtures.

## Output Contract
Respond with two self-contained sections: the mock JSON fixture and the zero-dependency in-memory fetch interceptor:

```json
// mock-fixtures.json
{
  "<route_key>": {
    "status": 200,
    "data": { ... }
  }
}
```

```typescript
// mock-interceptor.ts
// Zero-dependency native fetch interceptor
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  // Route matching and mocked Response resolution
  return originalFetch(input, init);
};
```
