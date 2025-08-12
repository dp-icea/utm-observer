#!/usr/bin/env python3
"""
Startup script for the refactored UTM Observer backend.
This script helps verify the new architecture is working correctly.
"""

import asyncio
import sys
from datetime import datetime, timezone
from uuid import uuid4

from core.container import Container
from application.commands.world_state_commands import CreateWorldStateSnapshotCommand
from application.queries.world_state_queries import GetWorldStateQuery
from domain.entities.world_state import ReservationRequest


async def verify_architecture():
    """Verify the new architecture is working"""
    print("🚀 Starting UTM Observer Backend Architecture Verification...")
    
    try:
        # Initialize container
        container = Container()
        print("✅ Dependency injection container initialized")
        
        # Test handlers are available
        snapshot_handler = container.create_world_state_snapshot_handler()
        query_handler = container.get_world_state_handler()
        print("✅ Command and query handlers created")
        
        # Test repositories
        world_state_repo = container.world_state_repository()
        reservation_repo = container.reservation_repository()
        print("✅ Repositories initialized")
        
        # Test external services
        dss_service = container.dss_service()
        uss_service = container.uss_service()
        flight_service = container.flight_service()
        print("✅ External service adapters created")
        
        print("\n🎉 Architecture verification completed successfully!")
        print("\nNew API endpoints available:")
        print("  POST /api/world-state/volumes")
        print("  POST /api/world-state/reservations")
        print("  GET  /api/world-state/reservations/{id}")
        print("  POST /api/flights/query")
        print("\nLegacy endpoints still available:")
        print("  POST /api/fetch/volumes")
        print("  POST /api/fetch/flights")
        
        return True
        
    except Exception as e:
        print(f"❌ Architecture verification failed: {e}")
        return False


async def main():
    """Main startup function"""
    print("UTM Observer Backend - Hexagonal Architecture")
    print("=" * 50)
    
    success = await verify_architecture()
    
    if success:
        print("\n✅ Backend is ready to start!")
        print("Run: uvicorn app:app --host 0.0.0.0 --port 8000 --reload")
        sys.exit(0)
    else:
        print("\n❌ Backend verification failed!")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())