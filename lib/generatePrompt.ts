import Gemini from "@/lib/Gemini";

function formatDistance(distanceInKm: number) {
  return distanceInKm < 1
    ? `${(distanceInKm * 1000).toFixed(0)} m`
    : `${distanceInKm.toFixed(1)} km`;
}

export async function generatePrompt(recipient: {
  organ: string,
  urgency: number,
  lat: number,
  lng: number
}, donors: any[]) {
  const prompt = `
You are an AI system helping match organ donors with recipients.

Recipient Info:
- Organ needed: ${recipient.organ}
- Location: (${recipient.lat}, ${recipient.lng})
- Urgency level: ${recipient.urgency}/5

Nearby Donors:
${donors.slice(0, 5).map(d => `
- ${d.firstName} ${d.lastName}, Organ: ${d.organ}, Distance: ${formatDistance(d.distance)}
`).join("\n")}

Based on urgency and distance, select top 5 matches and justify why.
`;

  return await Gemini(prompt);
}
