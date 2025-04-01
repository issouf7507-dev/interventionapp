import React, { useState, useEffect } from "react";
// @ts-ignore - Module manquant, installez-le avec npm
import * as MapboxSDK from "@mapbox/mapbox-sdk";
// @ts-ignore - Module manquant, installez-le avec npm
import * as MapboxGeocodingService from "@mapbox/mapbox-sdk/services/geocoding";
// @ts-ignore - Module manquant, installez-le avec npm
import debounce from "lodash.debounce";

// Type pour les données de localisation structurées
export type MapboxLocationData = {
  location: string; // Adresse formatée
  latitude: number; // Latitude
  longitude: number; // Longitude
  placeId?: string; // ID du lieu si disponible
  coordinates: [number, number]; // Coordonnées [longitude, latitude] (format GeoJSON)
  country?: string; // Pays
  region?: string; // Région/état
  city?: string; // Ville
  postalCode?: string; // Code postal
  context?: any; // Informations contextuelles supplémentaires
  rawData: any; // Données brutes complètes pour usage avancé
};

const LocationAutocomplete = ({
  onSelect,
  initialValue = "",
}: {
  onSelect: (location: MapboxLocationData) => void;
  initialValue?: string;
}) => {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [geocodingService, setGeocodingService] = useState<any>(null);

  // Initialiser le client Mapbox uniquement côté client
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Vérification côté client
      try {
        const mapboxClient = MapboxSDK.default({
          accessToken: process.env.NEXT_PUBLIC_MAPBOX_API_KEY || "",
        });
        // Initialiser le service de geocoding
        const geocodingClient = MapboxGeocodingService.default(mapboxClient);
        setGeocodingService(geocodingClient);
      } catch (error) {
        console.error("Erreur d'initialisation Mapbox:", error);
      }
    }
  }, []);

  // Fonction pour récupérer les suggestions
  const fetchSuggestions = debounce(async (input: string) => {
    if (!input || !geocodingService) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await geocodingService
        .forwardGeocode({
          query: input,
          autocomplete: true,
          limit: 5,
        })
        .send();

      const results = response.body.features;
      setSuggestions(results);
    } catch (error) {
      console.error("Erreur de recherche:", error);
      setSuggestions([]);
    }
  }, 300);

  // Gère les changements dans l'input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    fetchSuggestions(value);
  };

  // Extraire les informations structurées de la suggestion Mapbox
  const formatLocationData = (suggestion: any): MapboxLocationData => {
    // Extraction des contextes pour les informations administratives
    const context = suggestion.context || [];
    let country = "",
      region = "",
      city = "",
      postalCode = "";

    context.forEach((item: any) => {
      if (item.id.includes("country")) country = item.text;
      if (item.id.includes("region")) region = item.text;
      if (item.id.includes("place")) city = item.text;
      if (item.id.includes("postcode")) postalCode = item.text;
    });

    // Extraction des coordonnées [longitude, latitude] (format GeoJSON)
    const coordinates = suggestion.geometry.coordinates;
    console.log("suggestion", suggestion);

    return {
      location: suggestion.place_name || query,
      latitude: coordinates[1], // Latitude est la deuxième valeur dans GeoJSON
      longitude: coordinates[0], // Longitude est la première valeur dans GeoJSON
      coordinates: coordinates,
      placeId: suggestion.id,
      country,
      region,
      city,
      postalCode,
      context: suggestion.context,
      rawData: suggestion, // Données brutes pour un usage avancé
    };
  };

  // Quand un utilisateur sélectionne une suggestion
  const handleSuggestionClick = (suggestion: any) => {
    setQuery(suggestion.place_name);
    setSuggestions([]); // Efface les suggestions

    // Formatage et transmission des données structurées
    const locationData = formatLocationData(suggestion);
    onSelect(locationData);

    // Affichage des liens utiles en console pour debug
    console.log("Données de localisation:", locationData);
    console.log(
      "Lien Google Maps:",
      `https://www.google.com/maps/dir/?api=1&destination=${locationData.latitude},${locationData.longitude}`
    );
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded"
        placeholder="Rechercher un emplacement..."
        value={query}
        onChange={handleInputChange}
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border dark:bg-background border-gray-300 rounded shadow-lg">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer text-black dark:text-white "
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationAutocomplete;
