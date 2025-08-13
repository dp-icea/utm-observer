# Simple in-memory cache for airspace data
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
import hashlib
import json


class InMemoryCache:
    """Simple in-memory cache with TTL support"""
    
    def __init__(self, default_ttl_seconds: int = 300):  # 5 minutes default
        self._cache: Dict[str, Dict[str, Any]] = {}
        self.default_ttl = default_ttl_seconds
    
    def _generate_key(self, prefix: str, data: Any) -> str:
        """Generate cache key from data"""
        data_str = json.dumps(data, sort_keys=True, default=str)
        hash_obj = hashlib.md5(data_str.encode())
        return f"{prefix}:{hash_obj.hexdigest()}"
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache if not expired"""
        if key not in self._cache:
            return None
        
        entry = self._cache[key]
        if datetime.now() > entry['expires_at']:
            del self._cache[key]
            return None
        
        return entry['value']
    
    def set(self, key: str, value: Any, ttl_seconds: Optional[int] = None) -> None:
        """Set value in cache with TTL"""
        ttl = ttl_seconds or self.default_ttl
        expires_at = datetime.now() + timedelta(seconds=ttl)
        
        self._cache[key] = {
            'value': value,
            'expires_at': expires_at
        }
    
    def cache_airspace_data(self, area_key: str, data: Any, ttl_seconds: int = 60) -> None:
        """Cache airspace data with shorter TTL for real-time data"""
        key = self._generate_key("airspace", area_key)
        self.set(key, data, ttl_seconds)
    
    def get_airspace_data(self, area_key: str) -> Optional[Any]:
        """Get cached airspace data"""
        key = self._generate_key("airspace", area_key)
        return self.get(key)
    
    def clear_expired(self) -> int:
        """Clear expired entries and return count of cleared items"""
        now = datetime.now()
        expired_keys = [
            key for key, entry in self._cache.items()
            if now > entry['expires_at']
        ]
        
        for key in expired_keys:
            del self._cache[key]
        
        return len(expired_keys)
    
    def clear_all(self) -> None:
        """Clear all cache entries"""
        self._cache.clear()


# Global cache instance
cache = InMemoryCache()