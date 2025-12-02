// src/services/tamilnaduCities.ts
export const TAMILNADU_CITIES = {
    "Chennai": { lat: 13.0827, lng: 80.2707 },
    "Coimbatore": { lat: 11.0168, lng: 76.9558 },
    "Madurai": { lat: 9.9252, lng: 78.1198 },
    "Trichy": { lat: 10.7905, lng: 78.7047 },
    "Salem": { lat: 11.6643, lng: 78.1460 },
    "Tirunelveli": { lat: 8.7139, lng: 77.7567 },
    "Vellore": { lat: 12.9165, lng: 79.1325 },
    "Erode": { lat: 11.3410, lng: 77.7172 },
    "Kanyakumari": { lat: 8.0883, lng: 77.5385 },
    "Ooty": { lat: 11.4102, lng: 76.6950 },
    "Villupuram": { lat: 11.9398, lng: 79.4928 },
    "Dindigul": { lat: 10.3629, lng: 77.9755 },
    "Virudhunagar": { lat: 9.5827, lng: 77.9570 },
    "Krishnagiri": { lat: 12.5190, lng: 78.2130 },
    "Chengalpattu": { lat: 12.6829, lng: 79.9769 },
    "Thoothukudi": { lat: 8.7642, lng: 78.1348 },
    "Thanjavur": { lat: 10.7869, lng: 79.1378 },
    "Kumbakonam": { lat: 10.9598, lng: 79.3775 },
    "Karaikudi": { lat: 10.0667, lng: 78.7833 },
    "Hosur": { lat: 12.7365, lng: 77.8323 },
    "Tiruppur": { lat: 11.1085, lng: 77.3411 },
    "Nagercoil": { lat: 8.1773, lng: 77.4344 },
    "Cuddalore": { lat: 11.7447, lng: 79.7680 },
    "Karur": { lat: 10.9577, lng: 78.0808 },
    "Namakkal": { lat: 11.2228, lng: 78.1676 },
    "Sivakasi": { lat: 9.4500, lng: 77.8167 },
    "Tiruvannamalai": { lat: 12.2266, lng: 79.0746 },
    "Pollachi": { lat: 10.6588, lng: 77.0086 },
    "Rajapalayam": { lat: 9.4527, lng: 77.5534 },
    "Gobichettipalayam": { lat: 11.4548, lng: 77.4421 }
  };
  
  // Also export as an array for easy iteration
  export const TAMILNADU_CITY_NAMES = Object.keys(TAMILNADU_CITIES);
  
  // Helper function to get city coordinates
  export function getCityCoordinates(cityName: string): { lat: number; lng: number } | null {
    return TAMILNADU_CITIES[cityName as keyof typeof TAMILNADU_CITIES] || null;
  }
  
  // Calculate distance between two cities
  export function calculateDistanceBetweenCities(city1: string, city2: string): number {
    const coords1 = getCityCoordinates(city1);
    const coords2 = getCityCoordinates(city2);
    
    if (!coords1 || !coords2) return 0;
    
    const R = 6371; // Earth's radius in km
    const dLat = (coords2.lat - coords1.lat) * Math.PI / 180;
    const dLon = (coords2.lng - coords1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(coords1.lat * Math.PI / 180) * Math.cos(coords2.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
  }