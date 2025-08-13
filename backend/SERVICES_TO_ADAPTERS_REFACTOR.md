# Services to Adapters Refactor Plan

## Overview

This document outlines the refactoring plan to eliminate the service layer and move all infrastructure logic directly into adapters, achieving true hexagonal architecture.

## Current State

### Current Architecture Issues
- **Double abstraction**: Adapters are thin wrappers around services
- **Unnecessary complexity**: Service layer adds no business value
- **Not true hexagonal**: Infrastructure logic is split across two layers

### Current Structure
```
backend/
├── adapters/                    # Thin wrappers
│   ├── flights_adapter.py       # → FlightsService
│   ├── dss_adapter.py          # → DSSConstraintsService, etc.
│   └── uss_adapter.py          # → USSConstraintsService, etc.
├── services/                    # Contains actual logic
│   ├── flights.py
│   ├── dss/
│   └── uss/
```

## Target State

### Target Architecture
- **Single responsibility**: Adapters contain all infrastructure logic
- **Direct implementation**: No service layer intermediary
- **Clean separation**: Ports define contracts, adapters implement them

### Target Structure
```
backend/
├── adapters/                    # Contains all infrastructure logic
│   ├── flights_adapter.py       # Direct HTTP client usage
│   ├── dss_adapter.py          # Direct DSS API calls
│   └── uss_adapter.py          # Factory pattern for dynamic URLs
├── infrastructure/              # Shared utilities only
│   ├── auth_client.py          # Moved from services/client.py
│   └── cache.py                # Existing
└── services/                    # DELETED
```

## Refactoring Strategy

### Phase 1: Move Shared Utilities

**Move reusable components to infrastructure:**

```bash
# Move authentication utilities
mv backend/services/client.py backend/infrastructure/auth_client.py

# Keep geoawareness if it's a utility
mv backend/services/geoawareness.py backend/infrastructure/geoawareness.py
```

**Update imports across the codebase:**
```python
# Old
from services.client import AuthAsyncClient

# New  
from infrastructure.auth_client import AuthAsyncClient
```

### Phase 2: Refactor Simple Adapters

#### FlightsAdapter Refactor

**Before (Wrapper Pattern):**
```python
class FlightsAdapter(FlightDataPort):
    def __init__(self):
        self.flights_service = FlightsService()  # Wrapper!
    
    async def get_active_flights(self, area: QueryFlightsRequest) -> List[Flight]:
        response = await self.flights_service.query_flights(area)
        return response.flights
```

**After (Direct Implementation):**
```python
class FlightsAdapter(FlightDataPort):
    def __init__(self):
        settings = Settings()
        self.client = AsyncClient(base_url=settings.BRUTM_BASE_URL)
        self.dss_client = DSSRemoteIDService()  # Keep if complex
        
    async def get_active_flights(self, area: QueryFlightsRequest) -> List[Flight]:
        # Move ALL logic from FlightsService.query_flights here
        settings = Settings()
        apikey = settings.BRUTM_KEY
        
        query_params = {
            "apikey": apikey,
            "lat1": str(area.north),
            # ... rest of the logic
        }
        
        # Direct implementation, no service wrapper
        # ... complete implementation
```

#### DSSAdapter Refactor

**Before (Multiple Service Dependencies):**
```python
class DSSAdapter(AirspaceDataPort):
    def __init__(self):
        self.constraints_service = DSSConstraintsService()
        self.operational_intents_service = DSSOperationalIntentsService()
        self.remoteid_service = DSSRemoteIDService()
```

**After (Direct Client Usage):**
```python
class DSSAdapter(AirspaceDataPort):
    def __init__(self):
        settings = Settings()
        self.client = AuthAsyncClient(
            base_url=settings.DSS_BASE_URL,
            aud=settings.DSS_AUDIENCE
        )
        
    async def get_constraint_references(self, area: Volume4D) -> List[ConstraintReference]:
        # Move logic from DSSConstraintsService directly here
        response = await self.client.request(
            "POST",
            "/dss/v1/constraint_references/query",
            json={"area_of_interest": area.model_dump()},
            scope=Authority.CONSTRAINT_PROCESSING
        )
        return QueryConstraintReferencesResponse.model_validate(response.json()).constraint_references
```

### Phase 3: USS Adapter Factory Pattern

**The Challenge:**
USS services need dynamic base URLs (different USS providers).

**Solution: Factory Pattern**

```python
class USSAdapter(VolumeDetailsPort):
    """Adapter using factory pattern for dynamic USS clients"""
    
    def _create_auth_client(self, base_url: str) -> AuthAsyncClient:
        """Factory method to create USS-specific authenticated clients"""
        return AuthAsyncClient(
            base_url=base_url,
            aud=HttpUrl(base_url).host,
        )
    
    async def get_constraint_details(self, reference: ConstraintReference):
        """Get constraint details using factory-created client"""
        client = self._create_auth_client(reference.uss_base_url)
        
        # Direct implementation (moved from USSConstraintsService)
        response = await client.request(
            "GET",
            f"/uss/v1/constraints/{reference.id}",
            scope=Authority.CONSTRAINT_PROCESSING,
        )
        
        if response.status_code != 200:
            raise ValueError(f"Error getting constraint details: {response.text}")
            
        return GetConstraintDetailsResponse.model_validate(response.json()).constraint
    
    async def get_operational_intent_details(self, reference: OperationalIntentReference):
        """Get operational intent details using factory-created client"""
        client = self._create_auth_client(reference.uss_base_url)
        
        # Direct implementation (moved from USSOperationalIntentsService)
        response = await client.request(
            "GET",
            f"/uss/v1/operational_intents/{reference.id}",
            scope=Authority.STRATEGIC_COORDINATION,
        )
        
        if response.status_code != 200:
            raise ValueError(f"Error getting operational intent details: {response.text}")
            
        return GetOperationalIntentDetailsResponse.model_validate(response.json()).operational_intent
    
    async def get_identification_service_area_details(self, reference: IdentificationServiceArea):
        """Get ISA details using factory-created client"""
        client = self._create_auth_client(reference.uss_base_url)
        
        # Direct implementation (moved from USSRemoteIDService)
        response = await client.request(
            "GET",
            f"/uss/v1/identification_service_areas/{reference.id}",
            scope=Authority.CONFORMANCE_MONITORING_SA,
        )
        
        if response.status_code != 200:
            raise ValueError(f"Error getting ISA details: {response.text}")
            
        return GetIdentificationServiceAreaDetailsResponse.model_validate(response.json())
```

### Phase 4: Cleanup

**Delete service files:**
```bash
rm -rf backend/services/dss/
rm -rf backend/services/uss/
rm backend/services/flights.py
# Keep only utilities moved to infrastructure/
```

**Update imports throughout codebase:**
- Remove all imports from `services/`
- Update to use `infrastructure/` for shared utilities

## Benefits of This Refactor

### 1. **True Hexagonal Architecture**
- Adapters contain complete infrastructure implementation
- No unnecessary abstraction layers
- Clear separation between domain and infrastructure

### 2. **Simplified Testing**
```python
# Before: Need to mock both adapter AND service
def test_flights_adapter():
    with patch('adapters.flights_adapter.FlightsService') as mock_service:
        # Complex mocking setup
        
# After: Mock only the HTTP client
def test_flights_adapter():
    with patch('adapters.flights_adapter.AsyncClient') as mock_client:
        # Simple, direct mocking
```

### 3. **Better Performance**
- Eliminates one layer of method calls
- Reduces object creation overhead
- More direct code path

### 4. **Easier Maintenance**
- Single place for each infrastructure concern
- No confusion about where logic belongs
- Clearer error handling and debugging

## Migration Checklist

### Pre-Migration
- [ ] Backup current codebase
- [ ] Ensure all tests are passing
- [ ] Document current service interfaces

### Phase 1: Utilities
- [ ] Move `services/client.py` to `infrastructure/auth_client.py`
- [ ] Move `services/geoawareness.py` to `infrastructure/` (if utility)
- [ ] Update all imports for moved utilities
- [ ] Run tests to ensure utilities work

### Phase 2: Simple Adapters
- [ ] Refactor `FlightsAdapter` to direct implementation
- [ ] Refactor `DSSAdapter` to direct implementation
- [ ] Update dependency injection in use cases
- [ ] Run tests for each refactored adapter

### Phase 3: USS Factory Pattern
- [ ] Implement factory methods in `USSAdapter`
- [ ] Move USS service logic into adapter methods
- [ ] Test dynamic client creation
- [ ] Verify all USS operations work

### Phase 4: Cleanup
- [ ] Delete unused service files
- [ ] Remove service imports
- [ ] Update documentation
- [ ] Run full test suite
- [ ] Performance testing

## Risk Mitigation

### Potential Issues
1. **Complex USS logic**: USS services have complex authentication and error handling
2. **Shared utilities**: Some service code might be reused elsewhere
3. **Testing complexity**: Need to ensure all edge cases are covered

### Mitigation Strategies
1. **Incremental migration**: Refactor one adapter at a time
2. **Comprehensive testing**: Test each phase thoroughly before proceeding
3. **Rollback plan**: Keep service files until all tests pass
4. **Code review**: Review each adapter refactor for completeness

## Alternative Approaches

### Option A: Keep USS Services as Utilities
If USS logic is too complex, keep them as utilities in `infrastructure/`:
```python
# infrastructure/uss_clients.py
class USSConstraintsClient:  # Not a "service", just a utility
    def __init__(self, base_url: str):
        self.client = AuthAsyncClient(base_url=base_url, aud=HttpUrl(base_url).host)
```

### Option B: Gradual Migration
Migrate one adapter at a time over multiple sprints to reduce risk.

### Option C: Hybrid Approach
Keep complex services as utilities, refactor simple ones to direct implementation.

## Conclusion

This refactor will achieve true hexagonal architecture by eliminating the unnecessary service layer and moving all infrastructure logic directly into adapters. The factory pattern for USS clients provides a clean solution for dynamic URL requirements while maintaining the architectural benefits.

The key is to move incrementally, test thoroughly, and maintain the clear separation between domain logic (use cases) and infrastructure concerns (adapters).