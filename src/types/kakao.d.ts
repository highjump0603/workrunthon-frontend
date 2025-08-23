declare global {
  interface Window {
    kakao: {
      maps: {
        services: {
          Geocoder: new () => {
            addressSearch(
              address: string,
              callback: (result: GeocoderResult[], status: Status) => void
            ): void;
          };
          Status: {
            OK: 'OK';
            ZERO_RESULT: 'ZERO_RESULT';
            ERROR: 'ERROR';
          };
        };
        LatLng: new (lat: number, lng: number) => {
          getLat(): number;
          getLng(): number;
        };
      };
    };
  }
}

interface GeocoderResult {
  address_name: string;
  y: string; // 위도
  x: string; // 경도
}

type Status = 'OK' | 'ZERO_RESULT' | 'ERROR';

export {};
