# Schema Migration Guide

## Overview

This guide helps migrate from the old schema structure to the new hexagonal architecture-aligned schema organization.

## Key Changes

### 1. Domain Value Objects
**Before:**
```python
from schemas.common.geo import Volume4D, LatLngPoint, Time
```

**After:**
```python
from domain.value_objects import Volume4D, LatLngPoint, Time
```

### 2. External System Schemas
**Before:**
```python
from schemas.dss.constraints import QueryConstraintReferenceParameters
from schemas.uss.constraints import Constraint
```

**After:**
```python
from schemas.external.dss.constraints import QueryConstraintReferenceParameters
from schemas.external.uss.constraints import Constraint
```

### 3. API Response Models
**Before:**
```python
from schemas.response import Response
```

**After:**
```python
from schemas.api.common import ApiResponse
```

## Migration Steps

### Step 1: Update Domain Imports
Replace all imports of geographic and time primitives:
- `schemas.common.geo` → `domain.value_objects`
- `schemas.common.base.Time` → `domain.value_objects.Time`

### Step 2: Update External Schema Imports
- `schemas.dss.*` → `schemas.external.dss.*`
- `schemas.uss.*` → `schemas.external.uss.*`

### Step 3: Update API Response Imports
- `schemas.response.Response` → `schemas.api.common.ApiResponse`

### Step 4: Use New API Endpoints
- `POST /api/fetch/volumes` → `POST /api/airspace/snapshot`
- `POST /api/constraint_management/create_constraint` → `POST /api/constraints/create`
- `DELETE /api/constraint_management/delete_constraint` → `DELETE /api/constraints/delete-in-area`

## Compatibility

The old schema locations still work through compatibility imports in `schemas/shared/`, but they should be migrated to the new locations for better architecture alignment.

## Benefits

1. **Cleaner Dependencies**: Domain layer doesn't depend on external schemas
2. **Better Organization**: Clear separation between API, domain, and external concerns
3. **Easier Testing**: Domain entities can be tested without external dependencies
4. **Future-Proof**: Changes to external APIs won't break domain logic