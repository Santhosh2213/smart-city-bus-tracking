// src/services/tamilnaduBusData.ts
export const TAMILNADU_CITIES = [
    'Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 
    'Tirunelveli', 'Vellore', 'Erode', 'Kanyakumari', 'Ooty',
    'Thanjavur', 'Tiruppur', 'Nagercoil', 'Kanchipuram', 'Kumbakonam',
    'Karur', 'Udhagamandalam', 'Hosur', 'Ambur', 'Pollachi'
  ];
  
  export interface BusSchedule {
    id: string;
    busNumber: string;
    route: string;
    busType: 'AC' | 'Non-AC' | 'Express' | 'Deluxe' | 'Sleeper';
    source: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    travelTime: string;
    totalDistance: string;
    ticketPrice: string;
    frequency: string;
    status: 'on-time' | 'delayed' | 'cancelled';
    amenities: string[];
    nextDeparture: string;
    popularity: 'High' | 'Medium' | 'Low';
    seatAvailability: number;
    totalSeats: number;
    currentLocation?: string;
    speed?: number;
    passengerLoad?: number;
    nextStop?: string;
    progress?: number;
    qrCodeData?: string;
  }
  
  export const ALL_BUS_SCHEDULES: BusSchedule[] = [
    {
      id: '1',
      busNumber: 'TN-01-AB-1234',
      route: 'Chennai Express',
      busType: 'Express',
      source: 'Chennai',
      destination: 'Ooty',
      departureTime: '06:00 AM',
      arrivalTime: '02:00 PM',
      travelTime: '8 hours',
      totalDistance: '535 km',
      ticketPrice: '₹850',
      frequency: 'Every 2 hours',
      status: 'on-time',
      amenities: ['WiFi', 'AC', 'Charging Ports', 'Water Bottle', 'Snacks'],
      nextDeparture: '08:00 AM',
      popularity: 'High',
      seatAvailability: 15,
      totalSeats: 40,
      qrCodeData: 'BUS_TN01_1234_CHENNAI_OOTY_0600'
    },
    {
      id: '2',
      busNumber: 'TN-02-CD-5678',
      route: 'Hill Queen',
      busType: 'Deluxe',
      source: 'Chennai',
      destination: 'Ooty',
      departureTime: '10:00 AM',
      arrivalTime: '06:00 PM',
      travelTime: '8 hours',
      totalDistance: '535 km',
      ticketPrice: '₹950',
      frequency: 'Daily',
      status: 'on-time',
      amenities: ['WiFi', 'AC', 'Premium Seats', 'Blanket', 'Meal'],
      nextDeparture: 'Tomorrow 10:00 AM',
      popularity: 'Medium',
      seatAvailability: 25,
      totalSeats: 40,
      qrCodeData: 'BUS_TN02_5678_CHENNAI_OOTY_1000'
    },
    {
      id: '3',
      busNumber: 'TN-03-EF-9012',
      route: 'Night Rider',
      busType: 'Sleeper',
      source: 'Chennai',
      destination: 'Ooty',
      departureTime: '10:00 PM',
      arrivalTime: '06:00 AM',
      travelTime: '8 hours',
      totalDistance: '535 km',
      ticketPrice: '₹1100',
      frequency: 'Daily',
      status: 'on-time',
      amenities: ['Sleeper', 'AC', 'Charging Ports', 'Pillow'],
      nextDeparture: 'Tomorrow 10:00 PM',
      popularity: 'High',
      seatAvailability: 8,
      totalSeats: 30,
      qrCodeData: 'BUS_TN03_9012_CHENNAI_OOTY_2200'
    },
    {
      id: '4',
      busNumber: 'TN-04-GH-3456',
      route: 'Madurai Express',
      busType: 'AC',
      source: 'Madurai',
      destination: 'Trichy',
      departureTime: '07:00 AM',
      arrivalTime: '09:30 AM',
      travelTime: '2.5 hours',
      totalDistance: '135 km',
      ticketPrice: '₹250',
      frequency: 'Every 30 min',
      status: 'on-time',
      amenities: ['AC', 'Charging Ports'],
      nextDeparture: '07:30 AM',
      popularity: 'High',
      seatAvailability: 32,
      totalSeats: 40,
      qrCodeData: 'BUS_TN04_3456_MADURAI_TRICHY_0700'
    },
    {
      id: '5',
      busNumber: 'TN-05-IJ-7890',
      route: 'Coimbatore Fast',
      busType: 'Non-AC',
      source: 'Coimbatore',
      destination: 'Salem',
      departureTime: '08:15 AM',
      arrivalTime: '10:00 AM',
      travelTime: '1.75 hours',
      totalDistance: '160 km',
      ticketPrice: '₹180',
      frequency: 'Every 45 min',
      status: 'delayed',
      amenities: ['Basic'],
      nextDeparture: '09:00 AM',
      popularity: 'Medium',
      seatAvailability: 40,
      totalSeats: 40,
      qrCodeData: 'BUS_TN05_7890_COIMBATORE_SALEM_0815'
    },
    {
      id: '6',
      busNumber: 'TN-06-KL-2468',
      route: 'Coastal Express',
      busType: 'Express',
      source: 'Kanyakumari',
      destination: 'Tirunelveli',
      departureTime: '09:00 AM',
      arrivalTime: '10:15 AM',
      travelTime: '1.25 hours',
      totalDistance: '85 km',
      ticketPrice: '₹120',
      frequency: 'Every hour',
      status: 'on-time',
      amenities: ['AC', 'WiFi'],
      nextDeparture: '10:00 AM',
      popularity: 'Medium',
      seatAvailability: 28,
      totalSeats: 40,
      qrCodeData: 'BUS_TN06_2468_KANYAKUMARI_TIRUNELVELI_0900'
    },
    {
      id: '7',
      busNumber: 'TN-07-MN-1357',
      route: 'Vellore Local',
      busType: 'Non-AC',
      source: 'Vellore',
      destination: 'Chennai',
      departureTime: '11:00 AM',
      arrivalTime: '02:00 PM',
      travelTime: '3 hours',
      totalDistance: '135 km',
      ticketPrice: '₹200',
      frequency: 'Every 2 hours',
      status: 'on-time',
      amenities: ['Basic'],
      nextDeparture: '01:00 PM',
      popularity: 'Low',
      seatAvailability: 38,
      totalSeats: 40,
      qrCodeData: 'BUS_TN07_1357_VELLORE_CHENNAI_1100'
    },
    {
      id: '8',
      busNumber: 'TN-08-OP-2468',
      route: 'Erode Special',
      busType: 'AC',
      source: 'Erode',
      destination: 'Coimbatore',
      departureTime: '12:00 PM',
      arrivalTime: '01:30 PM',
      travelTime: '1.5 hours',
      totalDistance: '95 km',
      ticketPrice: '₹150',
      frequency: 'Every hour',
      status: 'on-time',
      amenities: ['AC', 'Water Bottle'],
      nextDeparture: '01:00 PM',
      popularity: 'High',
      seatAvailability: 12,
      totalSeats: 40,
      qrCodeData: 'BUS_TN08_2468_ERODE_COIMBATORE_1200'
    },
    {
      id: '9',
      busNumber: 'TN-09-QR-3579',
      route: 'Thanjavur Express',
      busType: 'Deluxe',
      source: 'Thanjavur',
      destination: 'Trichy',
      departureTime: '02:00 PM',
      arrivalTime: '03:00 PM',
      travelTime: '1 hour',
      totalDistance: '55 km',
      ticketPrice: '₹100',
      frequency: 'Every 30 min',
      status: 'on-time',
      amenities: ['AC', 'WiFi', 'Newspaper'],
      nextDeparture: '02:30 PM',
      popularity: 'Medium',
      seatAvailability: 35,
      totalSeats: 40,
      qrCodeData: 'BUS_TN09_3579_THANJAVUR_TRICHY_1400'
    },
    {
      id: '10',
      busNumber: 'TN-10-ST-4680',
      route: 'Tiruppur Fast',
      busType: 'Express',
      source: 'Tiruppur',
      destination: 'Coimbatore',
      departureTime: '03:30 PM',
      arrivalTime: '04:15 PM',
      travelTime: '45 min',
      totalDistance: '50 km',
      ticketPrice: '₹80',
      frequency: 'Every 20 min',
      status: 'delayed',
      amenities: ['AC'],
      nextDeparture: '03:50 PM',
      popularity: 'High',
      seatAvailability: 18,
      totalSeats: 40,
      qrCodeData: 'BUS_TN10_4680_TIRUPPUR_COIMBATORE_1530'
    }
  ];
  
  // Helper function to get buses by source and destination
  export const getBusesByRoute = (source: string, destination: string): BusSchedule[] => {
    if (!source || !destination) return [];
    
    return ALL_BUS_SCHEDULES.filter(bus => 
      bus.source.toLowerCase() === source.toLowerCase() && 
      bus.destination.toLowerCase() === destination.toLowerCase()
    );
  };
  
  // Helper function to get all unique routes
  export const getAllUniqueRoutes = () => {
    const routes = new Set<string>();
    ALL_BUS_SCHEDULES.forEach(bus => {
      routes.add(`${bus.source} → ${bus.destination}`);
    });
    return Array.from(routes);
  };
  
  // Helper function to get bus by QR code data
  export const getBusByQRCode = (qrCodeData: string): BusSchedule | undefined => {
    return ALL_BUS_SCHEDULES.find(bus => bus.qrCodeData === qrCodeData);
  };
  
  // Helper to get all buses for debugging
  export const getAllBuses = () => {
    return ALL_BUS_SCHEDULES;
  };