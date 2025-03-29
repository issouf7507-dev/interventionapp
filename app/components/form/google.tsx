import React, { useEffect, useRef, useState } from "react";

// Définition simplifiée des types pour Google Maps
declare global {
  interface Window {
    google: any;
  }
}

// Définir les types pour les coordonnées et l'adresse
export type LocationData = {
  location: string;
  latitude: number | null;
  longitude: number | null;
  formattedAddress: string | null;
};

interface AddressAutocompleteProps {
  onLocationSelect: (data: LocationData) => void;
  initialValue?: string;
  apiKey?: string;
}

const AddressAutocomplete = ({
  onLocationSelect,
  initialValue = "",
  apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
}: AddressAutocompleteProps) => {
  const addressInputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<any>(null);
  const [address, setAddress] = useState(initialValue);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (!window.google || !window.google.maps) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly`;
        script.async = true;
        script.defer = true;
        script.onload = initAutocomplete;
        document.body.appendChild(script);
      } else {
        initAutocomplete();
      }
    };

    const initAutocomplete = () => {
      if (window.google && window.google.maps && addressInputRef.current) {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          addressInputRef.current,
          {
            componentRestrictions: { country: ["ci"] }, // Côte d'Ivoire
            fields: ["address_components", "geometry", "formatted_address"],
            types: ["address"],
          }
        );

        // Écouter les événements de sélection d'adresse
        autocompleteRef.current.addListener("place_changed", () => {
          const place = autocompleteRef.current?.getPlace();

          if (place && place.geometry && place.geometry.location) {
            const locationData: LocationData = {
              location: place.formatted_address || address,
              latitude: place.geometry.location.lat(),
              longitude: place.geometry.location.lng(),
              formattedAddress: place.formatted_address,
            };

            setAddress(locationData.location);
            onLocationSelect(locationData);
          }
        });

        if (addressInputRef.current) {
          addressInputRef.current.focus();
        }
      }
    };

    if (apiKey) {
      loadGoogleMapsScript();
    } else {
      console.error("Clé API Google Maps manquante");
    }

    return () => {
      if (autocompleteRef.current && window.google && window.google.maps) {
        window.google.maps.event.clearInstanceListeners(
          autocompleteRef.current
        );
      }
    };
  }, [apiKey, address]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  return (
    <div className="w-full">
      <label
        htmlFor="location"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Adresse de l'intervention*
      </label>
      <input
        ref={addressInputRef}
        id="location"
        name="location"
        value={address}
        onChange={handleChange}
        required
        autoComplete="off"
        placeholder="Entrez l'adresse de l'intervention..."
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <p className="mt-1 text-sm text-gray-500">
        Sélectionnez une adresse dans les suggestions pour récupérer les
        coordonnées GPS
      </p>
    </div>
  );
};

export default AddressAutocomplete;
