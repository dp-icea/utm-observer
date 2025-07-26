from schemas.flights import (
    Height,
    Position,
    CurrentState,
    Flight
)
from schemas.common.base import (
        Time
)
from schemas.common.enums import (
        TimeFormat
)
from uuid import UUID
from datetime import datetime
from random import random
from vnoise import Noise  # Perlin noise library
import time

# In-memory storage for flight data
flight_data_store = {}

# Base coordinates for smooth variations
BASE_COORDS = [
    {"lat": -0.4039612815972356, "lng": -0.8012530716265216, "alt": 2000.0},
    {"lat": -0.4039612815972356, "lng": -0.8012530716265316, "alt": 2000.0},
    {"lat": -0.4039612815972456, "lng": -0.8012530716265216, "alt": 2000.0},
    {"lat": -0.4039612815972456, "lng": -0.8012530716265316, "alt": 2000.0},
]

# UUIDs for the flights
FLIGHT_UUIDS = [
    UUID("e814314a-d25a-4552-9248-1cbff8b0dbe1"),
    UUID("81c9acfd-25af-4a1e-85d5-c3a7e5369ef2"),
    UUID("f168c00b-c709-4621-b662-090669f06bb0"),
    UUID("38183a90-bcf5-4624-b6db-2858328cdca9"),
]

def generate_flight_mock_data():
    global flight_data_store

    # Time-based seed for smooth variations
    noise = Noise()
    t = time.time() * 0.1

    flights = []
    for i, base in enumerate(BASE_COORDS):
        uuid = FLIGHT_UUIDS[i]

        # Generate smooth variations using Perlin noise
        lat_variation = noise.noise1(t + i) * 0.00000001
        lng_variation = noise.noise1(t + i + 10) * 0.00000001
        alt_variation = noise.noise1(t + i + 20) * 10

        # Updated position
        position = Position(
            lat=base["lat"] + lat_variation,
            lng=base["lng"] + lng_variation,
            alt=base["alt"] + alt_variation,
            accuracy_h="HAUnknown",
            accuracy_v="VAUnknown",
            extrapolated=False,
            pressure_altitude=-1000.0,
            height=Height(
                distance=0.0,
                reference="TakeoffLocation",
            )
        )

        # Current state
        current_state = CurrentState(
            timestamp=Time(
                value=datetime.now(),
                format=TimeFormat.RFC3339,
            ),
            timestamp_accuracy=0.0,
            operational_status="Undeclared",
            position=position,
            track=0.0,
            speed=0.0,
            speed_accuracy="SAUnknown",
            vertical_speed=0.0,
        )

        # Flight object
        flight = Flight(
            id=str(uuid),
            aircraft_type="Helicopter",
            current_state=current_state,
            operating_area=None,
            simulated=False,
            recent_positions=[],
        )

        # Store in memory
        flight_data_store[uuid] = flight
        flights.append(flight)

    return flights
