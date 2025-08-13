#!/usr/bin/env python3
"""
Simple test to verify the new schema structure works correctly.
Run this after setting up your virtual environment.
"""

def test_domain_imports():
    """Test that domain value objects can be imported"""
    try:
        from domain.value_objects import Volume4D, LatLngPoint, Time, Altitude
        print("✅ Domain value objects import successfully")
        return True
    except ImportError as e:
        print(f"❌ Domain imports failed: {e}")
        return False

def test_api_schema_imports():
    """Test that API schemas can be imported"""
    try:
        from schemas.api.common import ApiResponse, ApiError
        from schemas.api.requests.airspace import AirspaceSnapshotRequest
        print("✅ API schemas import successfully")
        return True
    except ImportError as e:
        print(f"❌ API schema imports failed: {e}")
        return False

def test_external_schema_imports():
    """Test that external schemas can be imported"""
    try:
        from schemas.external.dss.constraints import QueryConstraintReferenceParameters
        from schemas.external.uss.constraints import Constraint
        print("✅ External schemas import successfully")
        return True
    except ImportError as e:
        print(f"❌ External schema imports failed: {e}")
        return False

def test_adapter_imports():
    """Test that adapters can be imported"""
    try:
        from adapters.dss_adapter import DSSAdapter
        from adapters.uss_adapter import USSAdapter
        from adapters.flights_adapter import FlightsAdapter
        from adapters.constraint_management_adapter import ConstraintManagementAdapter
        print("✅ Adapters import successfully")
        return True
    except ImportError as e:
        print(f"❌ Adapter imports failed: {e}")
        return False

def test_infrastructure_imports():
    """Test that infrastructure utilities can be imported"""
    try:
        from infrastructure.auth_client import AuthAsyncClient
        from infrastructure.geoawareness import GeoawarenessService
        from infrastructure.cache import InMemoryCache
        print("✅ Infrastructure utilities import successfully")
        return True
    except ImportError as e:
        print(f"❌ Infrastructure imports failed: {e}")
        return False

def test_services_removed():
    """Test that service layer has been removed"""
    try:
        import os
        services_exists = os.path.exists("services")
        if not services_exists:
            print("✅ Service layer successfully removed")
            return True
        else:
            print("❌ Service layer still exists")
            return False
    except Exception as e:
        print(f"❌ Error checking services removal: {e}")
        return False

def test_use_case_imports():
    """Test that use cases can be imported"""
    try:
        from application.use_cases import AirspaceQueryUseCase, ConstraintManagementUseCase
        print("✅ Use cases import successfully")
        return True
    except ImportError as e:
        print(f"❌ Use case imports failed: {e}")
        return False

if __name__ == "__main__":
    print("Testing new hexagonal architecture schema structure...\n")
    
    tests = [
        test_domain_imports,
        test_api_schema_imports,
        test_external_schema_imports,
        test_adapter_imports,
        test_use_case_imports,
        test_infrastructure_imports,
        test_services_removed,
    ]
    
    passed = 0
    for test in tests:
        if test():
            passed += 1
        print()
    
    print(f"Results: {passed}/{len(tests)} tests passed")
    
    if passed == len(tests):
        print("🎉 All tests passed! Schema refactoring is complete.")
    else:
        print("⚠️  Some imports failed. Check the error messages above.")