// src/services/busService.ts - UPDATED VERSION (with cities included)
const TAMILNADU_CITIES = {
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
  "Chengalpattu": { lat: 12.6829, lng: 79.9769 }
};

// Mock data for all Tamil Nadu bus routes
const MOCK_BUSES = [
  // Chennai Routes
  {
    id: '1',
    busNumber: 'TN-01-AB-1234',
    route: 'Chennai - Coimbatore Express',
    busType: 'AC',
    source: 'Chennai',
    destination: 'Coimbatore',
    departureTime: '08:00 AM',
    arrivalTime: '02:00 PM',
    travelTime: '6 hours',
    totalDistance: '495 km',
    ticketPrice: '₹800',
    currentLocation: 'Salem',
    nextStop: 'Erode',
    eta: '45 min',
    speed: 65,
    passengerLoad: 75,
    status: 'moving',
    progress: 65,
    latitude: 11.6643,
    longitude: 78.1460,
    amenities: ['WiFi', 'AC', 'Charging Ports', 'Water Bottle'],
    seatAvailability: 15,
    totalSeats: 40,
    frequency: 'Every 30 minutes',
    nextDeparture: '08:30 AM',
    qrCode: 'TN01-1234-CHN-CBE-0800'
  },
  {
    id: '2',
    busNumber: 'TN-02-CD-5678',
    route: 'Chennai - Madurai Highway',
    busType: 'Non-AC',
    source: 'Chennai',
    destination: 'Madurai',
    departureTime: '07:30 AM',
    arrivalTime: '03:00 PM',
    travelTime: '7.5 hours',
    totalDistance: '460 km',
    ticketPrice: '₹600',
    currentLocation: 'Trichy',
    nextStop: 'Dindigul',
    eta: '60 min',
    speed: 60,
    passengerLoad: 85,
    status: 'moving',
    progress: 40,
    latitude: 10.7905,
    longitude: 78.7047,
    amenities: ['Basic'],
    seatAvailability: 8,
    totalSeats: 40,
    frequency: 'Every 1 hour',
    nextDeparture: '08:30 AM',
    qrCode: 'TN02-5678-CHN-MDU-0730'
  },
  {
    id: '3',
    busNumber: 'TN-03-EF-9012',
    route: 'Chennai - Tirunelveli Coastal',
    busType: 'Express',
    source: 'Chennai',
    destination: 'Tirunelveli',
    departureTime: '06:00 AM',
    arrivalTime: '03:30 PM',
    travelTime: '9.5 hours',
    totalDistance: '625 km',
    ticketPrice: '₹950',
    currentLocation: 'Madurai',
    nextStop: 'Virudhunagar',
    eta: '30 min',
    speed: 65,
    passengerLoad: 65,
    status: 'stopped',
    progress: 70,
    latitude: 9.9252,
    longitude: 78.1198,
    amenities: ['WiFi', 'AC', 'Premium Seats', 'Charging Ports', 'Snacks'],
    seatAvailability: 12,
    totalSeats: 40,
    frequency: 'Every 2 hours',
    nextDeparture: '08:00 AM',
    qrCode: 'TN03-9012-CHN-TVL-0600'
  },
  {
    id: '4',
    busNumber: 'TN-04-GH-3456',
    route: 'Coimbatore - Madurai Western',
    busType: 'AC Sleeper',
    source: 'Coimbatore',
    destination: 'Madurai',
    departureTime: '09:00 AM',
    arrivalTime: '03:00 PM',
    travelTime: '6 hours',
    totalDistance: '325 km',
    ticketPrice: '₹700',
    currentLocation: 'Dindigul',
    nextStop: 'Madurai',
    eta: '45 min',
    speed: 55,
    passengerLoad: 40,
    status: 'moving',
    progress: 85,
    latitude: 10.3629,
    longitude: 77.9755,
    amenities: ['WiFi', 'AC', 'Sleeper', 'Charging Ports', 'Blanket'],
    seatAvailability: 18,
    totalSeats: 30,
    frequency: 'Every 3 hours',
    nextDeparture: '12:00 PM',
    qrCode: 'TN04-3456-CBE-MDU-0900'
  },
  {
    id: '5',
    busNumber: 'TN-05-IJ-7890',
    route: 'Madurai - Trichy Local',
    busType: 'Ordinary',
    source: 'Madurai',
    destination: 'Trichy',
    departureTime: '08:15 AM',
    arrivalTime: '11:00 AM',
    travelTime: '2.75 hours',
    totalDistance: '135 km',
    ticketPrice: '₹150',
    currentLocation: 'Dindigul',
    nextStop: 'Trichy',
    eta: '90 min',
    speed: 45,
    passengerLoad: 90,
    status: 'moving',
    progress: 35,
    latitude: 10.3629,
    longitude: 77.9755,
    amenities: ['Basic'],
    seatAvailability: 5,
    totalSeats: 40,
    frequency: 'Every 20 minutes',
    nextDeparture: '08:35 AM',
    qrCode: 'TN05-7890-MDU-TRY-0815'
  },
  {
    id: '6',
    busNumber: 'TN-06-KL-2468',
    route: 'Salem - Chennai Express',
    busType: 'AC',
    source: 'Salem',
    destination: 'Chennai',
    departureTime: '09:30 AM',
    arrivalTime: '03:00 PM',
    travelTime: '5.5 hours',
    totalDistance: '345 km',
    ticketPrice: '₹550',
    currentLocation: 'Krishnagiri',
    nextStop: 'Vellore',
    eta: '120 min',
    speed: 60,
    passengerLoad: 55,
    status: 'moving',
    progress: 25,
    latitude: 12.5190,
    longitude: 78.2130,
    amenities: ['WiFi', 'AC', 'Charging Ports'],
    seatAvailability: 22,
    totalSeats: 40,
    frequency: 'Every 1 hour',
    nextDeparture: '10:30 AM',
    qrCode: 'TN06-2468-SLM-CHN-0930'
  },
  {
    id: '7',
    busNumber: 'TN-07-MN-1357',
    route: 'Trichy - Chennai Superfast',
    busType: 'Express',
    source: 'Trichy',
    destination: 'Chennai',
    departureTime: '07:00 AM',
    arrivalTime: '12:30 PM',
    travelTime: '5.5 hours',
    totalDistance: '320 km',
    ticketPrice: '₹500',
    currentLocation: 'Villupuram',
    nextStop: 'Chengalpattu',
    eta: '75 min',
    speed: 58,
    passengerLoad: 70,
    status: 'moving',
    progress: 55,
    latitude: 11.9398,
    longitude: 79.4928,
    amenities: ['AC', 'Charging Ports', 'News Paper'],
    seatAvailability: 10,
    totalSeats: 40,
    frequency: 'Every 45 minutes',
    nextDeparture: '07:45 AM',
    qrCode: 'TN07-1357-TRY-CHN-0700'
  },
  {
    id: '8',
    busNumber: 'TN-08-OP-9876',
    route: 'Tirunelveli - Chennai Night',
    busType: 'AC Sleeper',
    source: 'Tirunelveli',
    destination: 'Chennai',
    departureTime: '09:00 PM',
    arrivalTime: '06:30 AM',
    travelTime: '9.5 hours',
    totalDistance: '625 km',
    ticketPrice: '₹1100',
    currentLocation: 'Madurai',
    nextStop: 'Trichy',
    eta: '180 min',
    speed: 65,
    passengerLoad: 30,
    status: 'moving',
    progress: 20,
    latitude: 9.9252,
    longitude: 78.1198,
    amenities: ['WiFi', 'AC', 'Sleeper', 'Charging Ports', 'Blanket', 'Pillow'],
    seatAvailability: 25,
    totalSeats: 30,
    frequency: 'Daily',
    nextDeparture: '09:00 PM',
    qrCode: 'TN08-9876-TVL-CHN-2100'
  }
];

const MOCK_ROUTES = [
  {
    id: '1',
    name: 'Chennai - Coimbatore Express',
    source: 'Chennai',
    destination: 'Coimbatore',
    distance: '495 km',
    duration: '6 hours',
    stops: ['Chennai', 'Vellore', 'Krishnagiri', 'Salem', 'Erode', 'Coimbatore'],
    busIds: ['1'],
    popularity: 95
  },
  {
    id: '2',
    name: 'Madurai - Chennai Highway',
    source: 'Madurai',
    destination: 'Chennai',
    distance: '460 km',
    duration: '7.5 hours',
    stops: ['Madurai', 'Dindigul', 'Trichy', 'Vellore', 'Chengalpattu', 'Chennai'],
    busIds: ['2'],
    popularity: 88
  },
  {
    id: '3',
    name: 'Chennai - Tirunelveli Coastal',
    source: 'Chennai',
    destination: 'Tirunelveli',
    distance: '625 km',
    duration: '9.5 hours',
    stops: ['Chennai', 'Villupuram', 'Trichy', 'Dindigul', 'Madurai', 'Virudhunagar', 'Tirunelveli'],
    busIds: ['3'],
    popularity: 82
  },
  {
    id: '4',
    name: 'Coimbatore - Madurai Western',
    source: 'Coimbatore',
    destination: 'Madurai',
    distance: '325 km',
    duration: '6 hours',
    stops: ['Coimbatore', 'Erode', 'Dindigul', 'Madurai'],
    busIds: ['4'],
    popularity: 75
  },
  {
    id: '5',
    name: 'Madurai - Trichy Local',
    source: 'Madurai',
    destination: 'Trichy',
    distance: '135 km',
    duration: '2.75 hours',
    stops: ['Madurai', 'Dindigul', 'Trichy'],
    busIds: ['5'],
    popularity: 92
  },
  {
    id: '6',
    name: 'Salem - Chennai Express',
    source: 'Salem',
    destination: 'Chennai',
    distance: '345 km',
    duration: '5.5 hours',
    stops: ['Salem', 'Krishnagiri', 'Vellore', 'Chennai'],
    busIds: ['6'],
    popularity: 78
  },
  {
    id: '7',
    name: 'Trichy - Chennai Superfast',
    source: 'Trichy',
    destination: 'Chennai',
    distance: '320 km',
    duration: '5.5 hours',
    stops: ['Trichy', 'Villupuram', 'Chengalpattu', 'Chennai'],
    busIds: ['7'],
    popularity: 85
  },
  {
    id: '8',
    name: 'Tirunelveli - Chennai Night',
    source: 'Tirunelveli',
    destination: 'Chennai',
    distance: '625 km',
    duration: '9.5 hours',
    stops: ['Tirunelveli', 'Madurai', 'Trichy', 'Villupuram', 'Chennai'],
    busIds: ['8'],
    popularity: 70
  }
];

export class BusService {
  // Get all Tamil Nadu cities
  static getCities() {
    return TAMILNADU_CITIES;
  }

  // Get city names as array
  static getCityNames(): string[] {
    return Object.keys(TAMILNADU_CITIES);
  }

  // Get all buses
  static async getAllBuses() {
    await this.simulateDelay(300);
    return MOCK_BUSES;
  }

  // Search buses by cities
  static async searchBuses(fromCity: string, toCity: string) {
    await this.simulateDelay(500);
    
    // Validate cities
    const cityNames = this.getCityNames();
    const isValidFrom = cityNames.some(city => 
      city.toLowerCase().includes(fromCity.toLowerCase())
    );
    const isValidTo = cityNames.some(city => 
      city.toLowerCase().includes(toCity.toLowerCase())
    );
    
    if (!isValidFrom || !isValidTo) {
      throw new Error('Invalid city name. Please select from Tamil Nadu cities.');
    }
    
    return MOCK_BUSES.filter(bus => 
      bus.source.toLowerCase().includes(fromCity.toLowerCase()) &&
      bus.destination.toLowerCase().includes(toCity.toLowerCase())
    );
  }

  // Get bus by ID
  static async getBusById(busId: string) {
    await this.simulateDelay(200);
    return MOCK_BUSES.find(bus => bus.id === busId) || null;
  }

  // Get nearby buses based on city
  static async getNearbyBuses(city: string, limit: number = 5) {
    await this.simulateDelay(400);
    
    const cityNames = this.getCityNames();
    const isValidCity = cityNames.some(c => 
      c.toLowerCase().includes(city.toLowerCase())
    );
    
    if (!isValidCity) {
      return MOCK_BUSES.slice(0, limit);
    }
    
    return MOCK_BUSES
      .filter(bus => 
        bus.currentLocation.toLowerCase().includes(city.toLowerCase()) ||
        bus.nextStop.toLowerCase().includes(city.toLowerCase())
      )
      .slice(0, limit);
  }

  // Get popular routes
  static async getPopularRoutes(limit: number = 5) {
    await this.simulateDelay(300);
    return MOCK_ROUTES
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, limit);
  }

  // Get routes between cities
  static async getRoutes(fromCity?: string, toCity?: string) {
    await this.simulateDelay(350);
    
    if (fromCity && toCity) {
      return MOCK_ROUTES.filter(route => 
        route.source.toLowerCase().includes(fromCity.toLowerCase()) &&
        route.destination.toLowerCase().includes(toCity.toLowerCase())
      );
    }
    
    return MOCK_ROUTES;
  }

  // Get city suggestions
  static async getCitySuggestions(query: string) {
    await this.simulateDelay(200);
    
    if (!query) return [];
    
    const cities = this.getCityNames();
    return cities
      .filter(city => 
        city.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5);
  }

  // Calculate distance between cities
  static calculateDistance(fromCity: string, toCity: string): number {
    const from = TAMILNADU_CITIES[fromCity as keyof typeof TAMILNADU_CITIES];
    const to = TAMILNADU_CITIES[toCity as keyof typeof TAMILNADU_CITIES];
    
    if (!from || !to) return 0;
    
    // Haversine formula
    const R = 6371; // Earth's radius in km
    const dLat = (to.lat - from.lat) * Math.PI / 180;
    const dLon = (to.lng - from.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(from.lat * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
  }

  // Get estimated travel time
  static calculateTravelTime(distance: number, avgSpeed: number = 60): string {
    const hours = Math.floor(distance / avgSpeed);
    const minutes = Math.round((distance % avgSpeed) / avgSpeed * 60);
    
    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}m`;
    }
  }

  // Book ticket
  static async bookTicket(busId: string, userId: string, seatCount: number = 1) {
    await this.simulateDelay(600);
    
    const bus = MOCK_BUSES.find(b => b.id === busId);
    if (!bus) {
      throw new Error('Bus not found');
    }
    
    if (bus.seatAvailability < seatCount) {
      throw new Error('Not enough seats available');
    }
    
    const ticketId = `TICKET_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    return {
      success: true,
      ticketId,
      bus: {
        id: bus.id,
        busNumber: bus.busNumber,
        route: bus.route,
        source: bus.source,
        destination: bus.destination,
        departureTime: bus.departureTime,
        arrivalTime: bus.arrivalTime
      },
      ticketPrice: `₹${parseInt(bus.ticketPrice.replace('₹', '')) * seatCount}`,
      seats: seatCount,
      qrCodeData: this.generateQRCodeData(ticketId, busId, userId),
      bookingTime: new Date().toISOString()
    };
  }

  // Generate QR code data
  static generateQRCodeData(ticketId: string, busId: string, userId: string) {
    const bus = MOCK_BUSES.find(b => b.id === busId);
    
    return JSON.stringify({
      ticketId,
      busId,
      userId,
      busNumber: bus?.busNumber,
      route: bus?.route,
      source: bus?.source,
      destination: bus?.destination,
      departureTime: bus?.departureTime,
      ticketPrice: bus?.ticketPrice,
      timestamp: Date.now(),
      type: 'bus_ticket',
      status: 'confirmed'
    });
  }

  // Set alert for bus
  static async setAlert(busId: string, userId: string, minutesBefore: number = 10) {
    await this.simulateDelay(400);
    
    const bus = MOCK_BUSES.find(b => b.id === busId);
    if (!bus) {
      throw new Error('Bus not found');
    }
    
    const alertId = `ALERT_${Date.now()}`;
    
    return {
      success: true,
      alertId,
      busId,
      busRoute: bus.route,
      alertTime: `${minutesBefore} minutes before arrival`,
      status: 'active'
    };
  }

  // Get bus schedules for a route
  static async getBusSchedules(routeId: string) {
    await this.simulateDelay(350);
    
    const route = MOCK_ROUTES.find(r => r.id === routeId);
    if (!route) return [];
    
    const buses = route.busIds.map(busId => 
      MOCK_BUSES.find(b => b.id === busId)
    ).filter(Boolean);
    
    return buses.map(bus => ({
      busId: bus!.id,
      busNumber: bus!.busNumber,
      busType: bus!.busType,
      departureTime: bus!.departureTime,
      arrivalTime: bus!.arrivalTime,
      travelTime: bus!.travelTime,
      ticketPrice: bus!.ticketPrice,
      seatAvailability: bus!.seatAvailability,
      amenities: bus!.amenities,
      status: bus!.status
    }));
  }

  // Simulate API delay
  private static simulateDelay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Update bus positions (for real-time simulation)
  static updateBusPositions() {
    return MOCK_BUSES.map(bus => {
      // Simulate movement
      const newProgress = Math.min(100, bus.progress + Math.random() * 3);
      const newPassengerLoad = Math.min(100, Math.max(20, bus.passengerLoad + Math.random() * 10 - 5));
      const newSpeed = Math.max(30, Math.min(80, bus.speed + Math.random() * 10 - 5));
      
      // Update ETA based on progress
      const remainingProgress = 100 - newProgress;
      const newETA = Math.max(1, Math.round(remainingProgress / 3)) + ' min';
      
      return {
        ...bus,
        progress: newProgress,
        passengerLoad: newPassengerLoad,
        speed: newSpeed,
        eta: newETA,
        status: newProgress >= 100 ? 'arrived' : bus.status
      };
    });
  }
}

// Export for use in other files
export { TAMILNADU_CITIES };