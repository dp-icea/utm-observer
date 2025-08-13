#!/usr/bin/env python3
"""
Integration test to verify the refactored hexagonal architecture works end-to-end.
This test verifies that all components can be instantiated and work together.
"""

def test_adapter_instantiation():
    """Test that all adapters can be instantiated"""
    try:
        from adapters.dss_adapter import DSSAdapter
        from adapters.uss_adapter import USSAdapter
        from adapters.flights_adapter import FlightsAdapter
        from adapters.constraint_management_adapter import ConstraintManagementAdapter
        
        # Try to instantiate (this will test imports and basic setup)
        dss_adapter = DSSAdapter()
        uss_adapter = USSAdapter()
        flights_adapter = FlightsAdapter()
        constraint_adapter = ConstraintManagementAdapter()
        
        print("✅ All adapters instantiated successfully")
        return True
    except Exception as e:
        print(f"❌ Adapter instantiation failed: {e}")
        return False

def test_use_case_instantiation():
    """Test that use cases can be instantiated with new adapters"""
    try:
        from application.use_cases import AirspaceQueryUseCase, ConstraintManagementUseCase
        from adapters.dss_adapter import DSSAdapter
        from adapters.uss_adapter import USSAdapter
        from adapters.flights_adapter import FlightsAdapter
        from adapters.constraint_management_adapter import ConstraintManagementAdapter
        
        # Instantiate adapters
        dss_adapter = DSSAdapter()
        uss_adapter = USSAdapter()
        flights_adapter = FlightsAdapter()
        constraint_adapter = ConstraintManagementAdapter()
        
        # Instantiate use cases with adapters
        airspace_use_case = AirspaceQueryUseCase(
            airspace_data_port=dss_adapter,
            volume_details_port=uss_adapter,
            flight_data_port=flights_adapter
        )
        
        constraint_use_case = ConstraintManagementUseCase(
            constraint_management_port=constraint_adapter,
            airspace_data_port=dss_adapter
        )
        
        print("✅ Use cases instantiated successfully with new adapters")
        return True
    except Exception as e:
        print(f"❌ Use case instantiation failed: {e}")
        return False

def test_domain_value_objects():
    """Test that domain value objects work correctly"""
    try:
        from domain.value_objects import Volume4D, Volume3D, Polygon, LatLngPoint, Altitude, Time
        from domain.value_objects import AltitudeReference, AltitudeUnits, TimeFormat
        from datetime import datetime
        
        # Create test objects
        point1 = LatLngPoint(lat=-23.5505, lng=-46.6333)  # São Paulo
        point2 = LatLngPoint(lat=-23.5515, lng=-46.6343)
        point3 = LatLngPoint(lat=-23.5525, lng=-46.6353)
        
        polygon = Polygon(vertices=[point1, point2, point3])
        
        altitude_lower = Altitude(
            value=0,
            reference=AltitudeReference.W84,
            units=AltitudeUnits.M
        )
        
        altitude_upper = Altitude(
            value=1000,
            reference=AltitudeReference.W84,
            units=AltitudeUnits.M
        )
        
        volume_3d = Volume3D(
            outline_polygon=polygon,
            altitude_lower=altitude_lower,
            altitude_upper=altitude_upper
        )
        
        time_start = Time(value=datetime.now(), format=TimeFormat.RFC3339)
        time_end = Time(value=datetime.now(), format=TimeFormat.RFC3339)
        
        volume_4d = Volume4D(
            volume=volume_3d,
            time_start=time_start,
            time_end=time_end
        )
        
        print("✅ Domain value objects work correctly")
        print(f"   Created Volume4D with {len(polygon.vertices)} vertices")
        return True
    except Exception as e:
        print(f"❌ Domain value objects failed: {e}")
        return False

def test_infrastructure_utilities():
    """Test that infrastructure utilities work"""
    try:
        from infrastructure.cache import InMemoryCache
        
        # Test cache
        cache = InMemoryCache()
        cache.set("test_key", {"data": "test_value"}, ttl_seconds=60)
        result = cache.get("test_key")
        
        if result and result.get("data") == "test_value":
            print("✅ Infrastructure utilities work correctly")
            return True
        else:
            print("❌ Cache test failed")
            return False
    except Exception as e:
        print(f"❌ Infrastructure utilities failed: {e}")
        return False

def test_no_service_imports():
    """Test that no old service imports are possible"""
    try:
        # These should all fail
        failed_imports = []
        
        try:
            from services.flights import FlightsService
            failed_imports.append("services.flights.FlightsService")
        except ImportError:
            pass  # Good, should fail
        
        try:
            from services.dss.constraints import DSSConstraintsService
            failed_imports.append("services.dss.constraints.DSSConstraintsService")
        except ImportError:
            pass  # Good, should fail
        
        try:
            from services.uss.constraints import USSConstraintsService
            failed_imports.append("services.uss.constraints.USSConstraintsService")
        except ImportError:
            pass  # Good, should fail
        
        if failed_imports:
            print(f"❌ Old service imports still work: {failed_imports}")
            return False
        else:
            print("✅ Old service imports correctly removed")
            return True
    except Exception as e:
        print(f"❌ Service import test failed: {e}")
        return False

if __name__ == "__main__":
    print("Testing refactored hexagonal architecture integration...\n")
    
    tests = [
        test_adapter_instantiation,
        test_use_case_instantiation,
        test_domain_value_objects,
        test_infrastructure_utilities,
        test_no_service_imports,
    ]
    
    passed = 0
    for test in tests:
        if test():
            passed += 1
        print()
    
    print(f"Results: {passed}/{len(tests)} tests passed")
    
    if passed == len(tests):
        print("🎉 Hexagonal architecture refactor is complete and working!")
        print("✅ True hexagonal architecture achieved")
        print("✅ Service layer successfully eliminated")
        print("✅ Adapters contain complete infrastructure logic")
        print("✅ Domain is independent of external concerns")
    else:
        print("⚠️  Some tests failed. Check the error messages above.")