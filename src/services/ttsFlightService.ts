// src/services/ttsFlightService.ts

const TTS_BASEURL = "https://www.stagingapi.bdsd.technology/api/";

export interface TTSFlightSearchParams {
  UserIp: string;
  Adult: number;
  Child: number;
  Infant: number;
  DirectFlight: boolean;
  JourneyType: number;
  PreferredCarriers: string[];
  CabinClass: number;
  SeriesFare: null | string;
  AirSegments: Array<{
    Origin: string;
    Destination: string;
    PreferredTime: string;
  }>;
}

export async function ttsFlightSearch(params: TTSFlightSearchParams) {
  const response = await fetch(`${TTS_BASEURL}airservice/rest/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Username: "TTS",
      Password: "Tts@001",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`TTS Flight Search failed: ${response.statusText}`);
  }
  return response.json();
}
