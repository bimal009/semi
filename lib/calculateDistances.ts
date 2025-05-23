import axios from "axios";

export async function calculateDistances(
  recipient: { lat: number, lng: number },
  donors: { location: { lat: number, lng: number } }[]
) {
  const locations = [
    [recipient.lng, recipient.lat],
    ...donors.map(d => [d.location.lng, d.location.lat])
  ];

  const { data } = await axios.post(
    "https://api.openrouteservice.org/v2/matrix/driving-car",
    {
      locations,
      sources: [0],
      destinations: donors.map((_, i) => i + 1),
      metrics: ["distance"],
      units: "km",
    },
    {
      headers: {
        Authorization: process.env.NEXT_PUBLIC_ORS_API_KEY!,
        "Content-Type": "application/json"
      }
    }
  );

  return donors.map((donor, i) => ({
    ...donor,
    distance: data.distances[0][i],
  })).sort((a, b) => a.distance - b.distance);
}
