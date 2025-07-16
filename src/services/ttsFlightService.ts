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

const isLocal =
  typeof window !== "undefined" && window.location.hostname === "localhost";
const API_URL = isLocal
  ? "/api/airservice/rest/search"
  : `${TTS_BASEURL}airservice/rest/search`;

export async function ttsFlightSearch(params: TTSFlightSearchParams) {
  // Log the request payload for debugging

  console.log("TTS Flight Search request payload:", params);
  const maxRetries = 3;
  let attempt = 0;
  let lastError;
  while (attempt < maxRetries) {
    try {
      console.log(`TTS Flight Search attempt ${attempt + 1}`);
      const response = await fetch(API_URL, {
        method: "POST",
        headers: isLocal
          ? { "Content-Type": "application/json" }
          : {
              "Content-Type": "application/json",
              Username: "TTS",
              Password: "Tts@001",
            },
        body: JSON.stringify(params),
      });
      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 500) {
          console.error(
            "TTS Flight Search 500 error - request payload:",
            params,
          );

          console.error(
            "TTS Flight Search 500 error - request headers:",
            isLocal
              ? { "Content-Type": "application/json" }
              : {
                  "Content-Type": "application/json",
                  Username: "TTS",
                  Password: "Tts@001",
                },
          );
        }
        throw new Error(
          `TTS Flight Search failed: ${response.status} ${response.statusText} - ${errorText}`,
        );
      }
      return response.json();
    } catch (error) {
      lastError = error;

      console.error(
        `TTS Flight Search API error (attempt ${attempt + 1}):`,
        error,
      );
      if (attempt < maxRetries - 1) {
        // Wait 1 second before retrying
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    attempt++;
  }
  throw lastError;
}
