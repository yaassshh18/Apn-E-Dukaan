import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in react-leaflet not loading correctly sometimes
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapComponent = ({ latitude, longitude, popupText }) => {
    // Fallback to New Delhi if coords are missing
    const position = [latitude || 28.6139, longitude || 77.2090]; 

    return (
        <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%', minHeight: '300px', borderRadius: '1rem', zIndex: 10 }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <Marker position={position}>
                {popupText && <Popup>{popupText}</Popup>}
            </Marker>
        </MapContainer>
    );
};

export default MapComponent;
