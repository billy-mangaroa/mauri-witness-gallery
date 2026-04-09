import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { kml } from '@tmcw/togeojson';
import 'mapbox-gl/dist/mapbox-gl.css';
import kmlRaw from '../Mangaroa Farm Property Titles.kml?raw';

type Poi = {
  id: string;
  title: string;
  description: string;
  image?: string;
  lng?: number;
  lat?: number;
};

const POIS: Poi[] = [
  {
    id: 'farm-shop',
    title: 'Farm Shop (Kete Kai)',
    description: 'A community food hub for fresh produce, local goods, and seasonal gatherings.',
    image: 'https://cdn.shopify.com/s/files/1/0674/5469/7761/files/Mangaroa-Black_High_Res_Logo.png?v=1685490985',
    lat: -41.145305,
    lng: 175.090346
  },
  {
    id: 'events-space',
    title: 'Events Space',
    description: 'A place for workshops, ceremonies, and learning experiences connected to the land.',
    image: 'https://cdn.shopify.com/s/files/1/0674/5469/7761/files/Tree_Planting.jpg?v=1754355799'
  }
];

const MAP_PADDING = { top: 80, bottom: 80, left: 80, right: 80 };

const ImpactMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const defaultBoundsRef = useRef<mapboxgl.LngLatBounds | null>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);

  useEffect(() => {
    const token = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;
    if (!token || !mapContainerRef.current || mapRef.current) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: (import.meta.env.VITE_MAPBOX_STYLE as string) || 'mapbox://styles/mapbox/standard',
      center: [175.07, -41.16],
      zoom: 11.2,
      pitch: 24,
      bearing: -6,
      attributionControl: false
    });

    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');

    map.on('load', () => {
      const xml = new DOMParser().parseFromString(kmlRaw, 'text/xml');
      const geojson = kml(xml);

      const bounds = getBoundsFromGeoJSON(geojson);
      if (bounds) {
        defaultBoundsRef.current = bounds;
        map.fitBounds(bounds, { padding: MAP_PADDING, duration: 0 });
      }

      map.addSource('property-boundary', {
        type: 'geojson',
        data: geojson
      });

      map.addLayer({
        id: 'property-fill',
        type: 'fill',
        source: 'property-boundary',
        paint: {
          'fill-color': '#F5EFE8',
          'fill-opacity': 0.35
        }
      });

      map.addLayer({
        id: 'property-outline',
        type: 'line',
        source: 'property-boundary',
        paint: {
          'line-color': '#2D4F2D',
          'line-width': 2
        }
      });

      const poiGeoJson = buildPoiGeoJson(bounds);
      map.addSource('poi-points', {
        type: 'geojson',
        data: poiGeoJson
      });

      map.addLayer({
        id: 'poi-halo',
        type: 'circle',
        source: 'poi-points',
        paint: {
          'circle-radius': 18,
          'circle-color': '#2D4F2D',
          'circle-opacity': 0.12
        }
      });

      map.addLayer({
        id: 'poi-core',
        type: 'circle',
        source: 'poi-points',
        paint: {
          'circle-radius': 6,
          'circle-color': '#2D4F2D',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#FDFCFB'
        }
      });

      map.on('mouseenter', 'poi-core', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'poi-core', () => {
        map.getCanvas().style.cursor = '';
      });

      map.on('click', 'poi-core', (event) => {
        const feature = event.features?.[0];
        if (!feature || !feature.properties) return;

        const lngLat = (feature.geometry as GeoJSON.Point).coordinates as [number, number];
        const content = buildPopupContent(feature.properties as Poi);

        if (popupRef.current) popupRef.current.remove();

        popupRef.current = new mapboxgl.Popup({
          closeButton: false,
          maxWidth: '320px',
          offset: 18
        })
          .setLngLat(lngLat)
          .setDOMContent(content)
          .addTo(map);

        map.easeTo({ center: lngLat, offset: [0, -120], duration: 850 });
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const handleResetView = () => {
    const map = mapRef.current;
    const bounds = defaultBoundsRef.current;
    if (!map || !bounds) return;
    map.fitBounds(bounds, { padding: MAP_PADDING, duration: 800 });
  };

  const hasToken = Boolean(import.meta.env.VITE_MAPBOX_TOKEN);

  if (!hasToken) {
    return (
      <div className="bg-white border border-[#E5E1DD] rounded-[28px] p-10 text-center">
        <p className="text-sm text-[#666]">
          Mapbox token missing. Add <span className="font-semibold">VITE_MAPBOX_TOKEN</span> to <span className="font-semibold">.env.local</span>
          to render the interactive map.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div ref={mapContainerRef} className="w-full h-[520px] rounded-[28px] overflow-hidden border border-[#E5E1DD]" />
      <button
        type="button"
        onClick={handleResetView}
        className="absolute top-6 right-6 text-[10px] uppercase tracking-[0.3em] font-bold px-4 py-2 rounded-full bg-white/90 border border-[#E5E1DD] hover:bg-white transition"
      >
        Reset View
      </button>
    </div>
  );
};

const buildPopupContent = (poi: Poi): HTMLElement => {
  const container = document.createElement('div');
  container.style.fontFamily = 'aktiv-grotesk, Inter, sans-serif';
  container.style.padding = '12px 14px';

  const title = document.createElement('div');
  title.textContent = poi.title;
  title.style.fontWeight = '700';
  title.style.fontSize = '13px';
  title.style.textTransform = 'uppercase';
  title.style.letterSpacing = '0.24em';
  title.style.color = '#2D4F2D';
  title.style.marginBottom = '8px';

  const body = document.createElement('p');
  body.textContent = poi.description;
  body.style.fontSize = '12px';
  body.style.lineHeight = '1.5';
  body.style.color = '#555';
  body.style.margin = '0 0 10px 0';

  container.appendChild(title);
  container.appendChild(body);

  if (poi.image) {
    const image = document.createElement('img');
    image.src = poi.image;
    image.alt = poi.title;
    image.style.width = '100%';
    image.style.height = '140px';
    image.style.objectFit = 'cover';
    image.style.borderRadius = '12px';
    container.appendChild(image);
  }

  return container;
};

const buildPoiGeoJson = (bounds: mapboxgl.LngLatBounds | null): GeoJSON.FeatureCollection => {
  const center = bounds ? bounds.getCenter() : { lng: 175.07, lat: -41.16 };
  const spread = 0.0022;

  const withCoords = POIS.map((poi, index) => ({
    ...poi,
    lng: poi.lng ?? center.lng + (index === 0 ? -spread : spread),
    lat: poi.lat ?? center.lat + (index === 0 ? spread * 0.6 : -spread * 0.4)
  }));

  return {
    type: 'FeatureCollection',
    features: withCoords.map(poi => ({
      type: 'Feature',
      properties: poi,
      geometry: {
        type: 'Point',
        coordinates: [poi.lng as number, poi.lat as number]
      }
    }))
  } as GeoJSON.FeatureCollection;
};

const getBoundsFromGeoJSON = (data: GeoJSON.FeatureCollection): mapboxgl.LngLatBounds | null => {
  const bounds = new mapboxgl.LngLatBounds();
  let hasCoords = false;

  const extend = (coords: any): void => {
    if (!coords) return;
    if (typeof coords[0] === 'number' && typeof coords[1] === 'number') {
      bounds.extend([coords[0], coords[1]]);
      hasCoords = true;
      return;
    }
    coords.forEach((coord: any) => extend(coord));
  };

  data.features.forEach(feature => {
    extend(feature.geometry?.coordinates);
  });

  return hasCoords ? bounds : null;
};

export default ImpactMap;
