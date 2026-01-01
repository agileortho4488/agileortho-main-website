import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Navigation, Loader2 } from 'lucide-react';

export function DistanceSearch({ onLocationSelect, className = "" }) {
  const [userLocation, setUserLocation] = useState(null);
  const [radius, setRadius] = useState(25); // km
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [manualPincode, setManualPincode] = useState('');

  const getUserLocation = useCallback(() => {
    setLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);
        onLocationSelect?.(location, radius);
        setLoading(false);
      },
      (err) => {
        setError('Unable to get your location. Please enter your pincode.');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes cache
      }
    );
  }, [onLocationSelect, radius]);

  const handlePincodeSearch = async () => {
    if (!manualPincode || manualPincode.length !== 6) {
      setError('Please enter a valid 6-digit pincode');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Use Google Geocoding API via our backend or directly
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${manualPincode},India&key=${process.env.REACT_APP_GOOGLE_MAPS_KEY}`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const location = {
          lat: data.results[0].geometry.location.lat,
          lng: data.results[0].geometry.location.lng,
        };
        setUserLocation(location);
        onLocationSelect?.(location, radius);
      } else {
        setError('Could not find location for this pincode');
      }
    } catch (err) {
      setError('Failed to search location');
    } finally {
      setLoading(false);
    }
  };

  const handleRadiusChange = (newRadius) => {
    setRadius(newRadius);
    if (userLocation) {
      onLocationSelect?.(userLocation, newRadius);
    }
  };

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-4 ${className}`}>
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
        <Navigation className="h-4 w-4 text-teal-600" />
        Find Surgeons Near You
      </div>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <Button
          onClick={getUserLocation}
          disabled={loading}
          variant="outline"
          className="h-10 flex-1 rounded-xl border-teal-200 text-teal-700 hover:bg-teal-50"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <MapPin className="mr-2 h-4 w-4" />
          )}
          Use My Location
        </Button>

        <div className="flex flex-1 gap-2">
          <Input
            type="text"
            value={manualPincode}
            onChange={(e) => setManualPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="Enter Pincode"
            className="h-10 rounded-xl border-slate-200"
            maxLength={6}
          />
          <Button
            onClick={handlePincodeSearch}
            disabled={loading || manualPincode.length !== 6}
            className="h-10 rounded-xl bg-teal-600 hover:bg-teal-700"
          >
            Search
          </Button>
        </div>
      </div>

      {userLocation && (
        <div className="mt-3">
          <div className="text-xs font-medium text-slate-600">Search Radius</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {[10, 25, 50, 100].map((r) => (
              <button
                key={r}
                onClick={() => handleRadiusChange(r)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  radius === r
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {r} km
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 rounded-lg bg-rose-50 p-2 text-xs text-rose-600">
          {error}
        </div>
      )}

      {userLocation && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-teal-50 p-2 text-xs text-teal-700">
          <MapPin className="h-3 w-3" />
          Searching within {radius} km of your location
        </div>
      )}
    </div>
  );
}
