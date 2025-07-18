import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useLayoutEffect,
} from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  CalendarIcon,
  Search,
  Plane,
  MapPin,
  Loader2,
  Filter,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import {
  ttsFlightSearch,
  TTSFlightSearchParams,
} from "@/services/ttsFlightService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Fragment } from "react";

export interface FlightOffer {
  id: string;
  airline: string;
  flightNumber: string;
  departure: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  arrival: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  duration: string;
  stops: number;
  cabin: string;
  aircraft?: string;
  price: {
    total: string;
    currency: string;
    published?: number;
    offered?: number;
  };
  rawOffer?: unknown;
}

interface AirportSuggestion {
  id: string;
  iataCode: string;
  name: string;
  address?: {
    cityName?: string;
    countryName?: string;
  };
  subType?: string;
  [key: string]: unknown;
}

interface FlightSearchParams {
  tripType: "ONE_WAY" | "ROUND_TRIP" | "MULTI_CITY";
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: Date;
  returnDate?: Date;
  adults: number;
  children: number;
  infants: number;
  travelClass: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";
  nonStop: boolean;
}

interface FlightSearchProps {
  onFlightSelect?: (
    flight: FlightOffer,
    searchParams: FlightSearchParams,
  ) => void;
  onDrawerOpenChange?: (open: boolean) => void;
  onResults?: (results: FlightOffer[]) => void;
  initialSearchParams?: FlightSearchParams;
  suppressLoadingOverlay?: boolean;
  onSearchStart?: () => void;
  onSearchEnd?: () => void;
}

function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const ADULT_MIN = 1,
  ADULT_MAX = 9,
  CHILD_MIN = 0,
  CHILD_MAX = 8,
  INFANT_MIN = 0,
  INFANT_MAX = 4;

const TABS = [
  { key: "details", label: "Flight Details" },
  { key: "fare", label: "Fare Summary" },
  { key: "cancellation", label: "Cancellation" },
  { key: "datechange", label: "Date Change" },
];

// Add these interfaces at the top, after existing interfaces

interface TTSFlightSegment {
  Origin: {
    AirportCode: string;
    AirportName: string;
    CityName: string;
    DepartTime: string;
    Terminal?: string;
  };
  Destination: {
    AirportCode: string;
    AirportName: string;
    CityName: string;
    ArrivalTime: string;
    Terminal?: string;
  };
  Airline: {
    AirlineCode: string;
    AirlineName: string;
    FlightNumber: string;
    AircraftType?: string;
    Craft?: string;
  };
  TotalDuration: number;
  LayoverTime?: number;
  Layover?: string;
  CabinClass?: string;
  Baggage?: string;
  SeatBaggage?: TTSBaggageInfo[];
}

interface TTSBaggageInfo {
  PaxType: "ADULT" | "CHILD" | "INFANT";
  Sector?: string;
  CheckIn?: string;
  Cabin?: string;
}

interface TTSFare {
  BaseFare: number;
  Tax: number;
  Discount: number;
  OfferedPrice: number;
  PublishedPrice: number;
  Currency: string;
  SeatBaggage?: TTSBaggageInfo[][];
  FareBreakdown?: string[];
  CancellationPolicy?: string;
  DateChangePolicy?: string;
  CabinClass?: string;
}

function FlightDetailsModal({
  open,
  onClose,
  flight,
  searchParams,
  onFlightSelect,
  fareRule,
  fareRuleLoading,
}: {
  open: boolean;
  onClose: () => void;
  flight: FlightOffer | null;
  searchParams: FlightSearchParams;
  onFlightSelect?: (
    flight: FlightOffer,
    searchParams: FlightSearchParams,
  ) => void;
  fareRule?: unknown;
  fareRuleLoading?: boolean;
}) {
  // All hooks at the top
  const [tab, setTab] = useState<
    "details" | "fare" | "cancellation" | "datechange"
  >("details");
  const [selectedFareIndex, setSelectedFareIndex] = useState(0);
  const summaryRef = useRef<HTMLDivElement>(null);
  const [summaryHeight, setSummaryHeight] = useState(0);
  useLayoutEffect(() => {
    if (summaryRef.current) {
      setSummaryHeight(summaryRef.current.offsetHeight);
    }
  }, [open, flight]);
  // Fare selection effect
  const flightOption = flight?.rawOffer as {
    Segments: TTSFlightSegment[][];
    FareList: TTSFare[];
    [key: string]: unknown;
  };
  const fareList = useMemo(() => flightOption?.FareList || [], [flightOption]);
  const segmentsGroups = flightOption?.Segments;
  useEffect(() => {
    if (selectedFareIndex >= fareList.length) setSelectedFareIndex(0);
  }, [fareList, selectedFareIndex]);
  // Only after all hooks and variable definitions, do conditional return
  if (!open || !flight) return null;
  const selectedFare = fareList[selectedFareIndex] || fareList[0];
  // If any required API data is missing, show loading/error
  if (!flightOption || !segmentsGroups || !fareList || !selectedFare) {
    return (
      <div className="fixed inset-0 z-[12000] flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto mb-4"></div>
          <div className="text-gray-700 font-semibold">Data not available</div>
        </div>
      </div>
    );
  }
  const airlineCode = segmentsGroups[0]?.[0]?.Airline?.AirlineCode || "";
  const airlineName = segmentsGroups[0]?.[0]?.Airline?.AirlineName || "";
  const flightNumber = segmentsGroups[0]?.[0]?.Airline?.FlightNumber || "";
  // Fare summary fields
  const baseFare = selectedFare.BaseFare || 0;
  const surcharges = selectedFare.Tax || 0;
  const discount = selectedFare.Discount || 0;
  const total = selectedFare.OfferedPrice || selectedFare.PublishedPrice || 0;
  const currency = selectedFare.Currency || "₹";
  // Passenger summary
  const paxSummary = () => {
    const { adults, children, infants } = searchParams;
    const parts = [];
    if (adults) parts.push(`${adults} Adult${adults > 1 ? "s" : ""}`);
    if (children) parts.push(`${children} Child${children > 1 ? "ren" : ""}`);
    if (infants) parts.push(`${infants} Infant${infants > 1 ? "s" : ""}`);
    return parts.length ? parts.join(", ") : "Select passengers";
  };
  const tripTypeLabel =
    searchParams.tripType === "ROUND_TRIP"
      ? "Round Trip"
      : searchParams.tripType === "ONE_WAY"
        ? "One Way"
        : "Multi City";
  const travelClassLabel = searchParams.travelClass
    .replace("ECONOMY", "Economy")
    .replace("PREMIUM_ECONOMY", "Premium Economy")
    .replace("BUSINESS", "Business")
    .replace("FIRST", "First");
  const depDateStr = searchParams.departureDate
    ? new Date(searchParams.departureDate).toLocaleDateString(undefined, {
        weekday: "short",
        day: "numeric",
        month: "short",
      })
    : "";

  return (
    <div className="fixed inset-0 z-[12000] flex">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 transition-opacity duration-200 z-[12000]"
        onClick={onClose}
        aria-label="Close details drawer"
      />
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-full md:w-[700px] lg:w-[800px] bg-white shadow-2xl rounded-l-2xl flex flex-col animate-slide-in overflow-y-auto z-[12000]">
        {/* Small close button, top left, absolute */}
        <button
          className="absolute left-2 top-2 w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-800 transition-all duration-200 shadow-sm z-30"
          onClick={onClose}
          aria-label="Close details drawer"
          style={{ fontSize: "1rem", lineHeight: 1 }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        {/* Fare selection tabs */}
        {fareList.length > 1 && (
          <div className="flex gap-2 px-6 pt-4 pb-2 border-b border-gray-100 bg-white sticky top-0 z-30">
            {fareList.map((fare, idx) => (
              <button
                key={fare.FareId || idx}
                className={`px-4 py-2 rounded-t-lg font-medium text-sm border-b-2 transition-colors duration-150 focus:outline-none ${
                  idx === selectedFareIndex
                    ? "border-blue-600 text-blue-700 bg-blue-50"
                    : "border-transparent text-gray-600 bg-white hover:bg-gray-50"
                }`}
                onClick={() => setSelectedFareIndex(idx)}
              >
                {fare.CabinClass || "Fare"}
                {fare.FareClass ? ` (${fare.FareClass})` : ""} - ₹
                {(
                  fare.OfferedPrice ??
                  fare.PublishedPrice ??
                  fare.Fare?.OfferedPrice ??
                  fare.Fare?.PublishedPrice ??
                  0
                ).toLocaleString()}
              </button>
            ))}
          </div>
        )}
        {/* Summary section (compressed) */}
        <div
          ref={summaryRef}
          className="sticky top-0 z-20 bg-white flex flex-col md:flex-row md:items-center justify-between px-6 pt-4 pb-2 border-b border-gray-200 gap-2 relative"
        >
          <div className="flex-1 flex flex-col justify-center pl-2 md:pl-6">
            <div className="text-xl font-bold text-gray-900 mb-0.5">
              Flight Details
            </div>
            <div className="font-medium text-gray-800 text-base flex flex-wrap items-center gap-2 mb-0.5">
              {/* Route */}
              {(() => {
                // Onward
                const onward = segmentsGroups?.[0] || [];
                const onwardOrigin =
                  onward[0]?.Origin?.CityName ||
                  onward[0]?.Origin?.AirportCode ||
                  "-";
                const onwardDest =
                  onward[onward.length - 1]?.Destination?.CityName ||
                  onward[onward.length - 1]?.Destination?.AirportCode ||
                  "-";
                let route = `${onwardOrigin} → ${onwardDest}`;
                // Return (if round trip)
                if (
                  searchParams.tripType === "ROUND_TRIP" &&
                  segmentsGroups.length > 1
                ) {
                  const ret = segmentsGroups[1] || [];
                  const retOrigin =
                    ret[0]?.Origin?.CityName ||
                    ret[0]?.Origin?.AirportCode ||
                    "-";
                  const retDest =
                    ret[ret.length - 1]?.Destination?.CityName ||
                    ret[ret.length - 1]?.Destination?.AirportCode ||
                    "-";
                  route += ` | ${retOrigin} → ${retDest}`;
                }
                return <span>{route}</span>;
              })()}
            </div>
            <div className="text-gray-500 text-xs flex flex-wrap items-center gap-2 mb-0.5">
              <span>{tripTypeLabel}</span>
              <span>·</span>
              <span>{travelClassLabel}</span>
              <span>·</span>
              <span>{paxSummary()}</span>
            </div>
            <div className="text-gray-500 text-xs flex items-center gap-2">
              {depDateStr && <span>{depDateStr}</span>}
              {searchParams.tripType === "ROUND_TRIP" &&
                searchParams.returnDate && (
                  <>
                    <span>→</span>
                    <span>
                      {new Date(searchParams.returnDate).toLocaleDateString(
                        undefined,
                        { weekday: "short", day: "numeric", month: "short" },
                      )}
                    </span>
                  </>
                )}
            </div>
          </div>
          {/* Fare box */}
          <div className="flex flex-col items-end bg-gray-50 rounded-xl px-6 py-2 min-w-[180px] shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">
                {currency} {total.toLocaleString()}
              </span>
              {discount > 0 && (
                <span className="text-xs text-gray-500 line-through">
                  {currency} {(total + discount).toLocaleString()}
                </span>
              )}
            </div>
            <div className="text-emerald-700 text-sm font-semibold mt-1">
              Offer price {currency} {total.toLocaleString()}
            </div>
          </div>
        </div>
        {/* Tabs section, sticky just below summary */}
        <div
          className="flex border-b border-gray-200 px-4 md:px-8 pt-4 bg-white z-30"
          style={{
            position: "sticky",
            top: summaryHeight,
            background: "#fff",
            zIndex: 30,
            overflow: "visible",
          }}
        >
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`px-6 py-2 font-semibold text-sm border-b-2 transition-colors duration-150 ${tab === t.key ? "border-blue-500 text-blue-700" : "border-transparent text-gray-500 hover:text-blue-700"}`}
              onClick={() =>
                setTab(
                  t.key as "details" | "fare" | "cancellation" | "datechange",
                )
              }
            >
              {t.label}
            </button>
          ))}
        </div>
        {/* Tab content */}
        <div className="p-4 md:p-8 pt-6 flex-1">
          {tab === "details" && (
            <div className="flex flex-col md:flex-row gap-6">
              {segmentsGroups.map(
                (segments: TTSFlightSegment[], idx: number) => {
                  if (!Array.isArray(segments) || segments.length === 0)
                    return null;
                  const firstSeg = segments[0];
                  const lastSeg = segments[segments.length - 1];
                  const depTime = firstSeg?.Origin?.DepartTime
                    ? new Date(firstSeg.Origin.DepartTime)
                    : null;
                  const arrTime = lastSeg?.Destination?.ArrivalTime
                    ? new Date(lastSeg.Destination.ArrivalTime)
                    : null;
                  const depCity = firstSeg?.Origin?.CityName || "-";
                  const arrCity = lastSeg?.Destination?.CityName || "-";
                  const depAirport = firstSeg?.Origin?.AirportName || "-";
                  const arrAirport = lastSeg?.Destination?.AirportName || "-";
                  const depTerminal = firstSeg?.Origin?.Terminal
                    ? `Terminal ${firstSeg.Origin.Terminal}`
                    : "";
                  const arrTerminal = lastSeg?.Destination?.Terminal
                    ? `Terminal ${lastSeg.Destination.Terminal}`
                    : "";
                  const routeLabel = `${depCity} to ${arrCity}, ${depTime ? depTime.toLocaleDateString(undefined, { day: "numeric", month: "short" }) : ""}`;
                  // Duration
                  let totalDuration = "-";
                  if (firstSeg.TotalDuration && firstSeg.TotalDuration > 0) {
                    const hours = Math.floor(firstSeg.TotalDuration / 60);
                    const mins = firstSeg.TotalDuration % 60;
                    totalDuration = `${hours} h ${mins} m`;
                  }
                  // Airline info
                  const airlineCode = firstSeg?.Airline?.AirlineCode || "";
                  const airlineName = firstSeg?.Airline?.AirlineName || "-";
                  const flightNumber = firstSeg?.Airline?.FlightNumber || "-";
                  const aircraft = firstSeg?.Airline?.AircraftType || "";
                  // Baggage info for ADULT, CHILD, INFANT
                  const baggageArr = selectedFare.SeatBaggage?.[idx] || [];
                  const getBaggage = (type: string, field: string) => {
                    const entry = Array.isArray(baggageArr)
                      ? baggageArr.find((b) => b.PaxType === type)
                      : null;
                    return entry && entry[field]
                      ? entry[field]
                      : field === "CheckIn" && entry && entry["CheckIn"] === ""
                        ? "Cabin bag only"
                        : "-";
                  };
                  return (
                    <div
                      key={idx}
                      className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col min-w-[320px]"
                    >
                      <div className="font-bold text-lg mb-2">{routeLabel}</div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 flex items-center justify-center bg-white rounded-xl border border-gray-200 shadow-sm p-0">
                          <img
                            src={`https://content.airhex.com/content/logos/airlines_${airlineCode.toLowerCase()}_350_100_r.png?background=fff&pad=auto`}
                            alt={airlineName}
                            className="w-8 h-8 object-contain"
                            onError={(e) =>
                              (e.currentTarget.src = "/placeholder.svg")
                            }
                          />
                        </div>
                        <div className="font-bold text-base text-gray-900">
                          {airlineName}{" "}
                          <span className="font-normal text-gray-500">
                            {flightNumber}
                          </span>
                        </div>
                        {aircraft && (
                          <span className="text-xs text-gray-400 ml-2">
                            {aircraft}
                          </span>
                        )}
                        <span className="text-xs text-gray-400 ml-2">
                          Operated By {airlineName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col items-start">
                          <span className="text-2xl font-bold text-gray-900">
                            {depTime
                              ? depTime.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "-"}
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            {depTime
                              ? depTime.toLocaleDateString(undefined, {
                                  weekday: "short",
                                  day: "numeric",
                                  month: "short",
                                })
                              : "-"}
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            {depAirport}
                          </span>
                          <span className="text-xs text-gray-400">
                            {depTerminal}
                          </span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-base font-semibold text-emerald-700 mb-1">
                            {totalDuration}
                          </span>
                          <span className="w-24 h-1 bg-emerald-200 rounded-full mb-1" />
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-2xl font-bold text-gray-900">
                            {arrTime
                              ? arrTime.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "-"}
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            {arrTime
                              ? arrTime.toLocaleDateString(undefined, {
                                  weekday: "short",
                                  day: "numeric",
                                  month: "short",
                                })
                              : "-"}
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            {arrAirport}
                          </span>
                          <span className="text-xs text-gray-400">
                            {arrTerminal}
                          </span>
                        </div>
                      </div>
                      {/* Baggage Table */}
                      <div className="mt-2">
                        <div className="flex gap-8 font-bold text-base mb-2">
                          <span className="w-20">BAGGAGE</span>
                          <span className="w-24">CHECK IN</span>
                          <span className="w-16">CABIN</span>
                        </div>
                        <div className="flex gap-8 mb-1 text-sm items-center">
                          <span className="w-20"></span>
                          <span className="w-24 text-gray-900">
                            {baggageArr[0]?.CheckIn || "-"}
                          </span>
                          <span className="w-16 text-gray-900">
                            {baggageArr[0]?.Cabin || "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          )}
          {tab === "fare" && (
            <div className="max-w-lg mx-auto w-full">
              <div className="text-2xl font-bold mb-4">Fare Breakup</div>
              <hr className="mb-6" />
              {/* Beautified cards for Adult, Child, Infant totals */}
              {selectedFare.FareBreakdown && (
                <div className="flex gap-4 mb-6">
                  {["ADT", "CHD", "INF"].map((type) => {
                    const info = selectedFare.FareBreakdown[type];
                    if (!info) return null;
                    const label =
                      type === "ADT"
                        ? "Adult"
                        : type === "CHD"
                          ? "Child"
                          : "Infant";
                    // Prefer OfferedPrice, then PublishedPrice, then fallback
                    let total = info.OfferedPrice ?? info.PublishedPrice;
                    if (total === undefined) {
                      total = info.BaseFare + info.Tax + info.YQTax;
                    }
                    return (
                      <div
                        key={type}
                        className="flex-1 bg-white rounded-xl shadow border border-gray-200 p-4 flex flex-col items-center justify-center min-w-[120px]"
                      >
                        <div className="text-lg font-semibold text-gray-800 mb-1">
                          {label}
                        </div>
                        <div className="text-sm text-gray-500 mb-2">
                          x {info.PassengerCount}
                        </div>
                        <div className="text-2xl font-bold text-blue-700">
                          ₹{total.toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {/* Remove the old table and details, keep only base fare/surcharges/total if needed */}
              <div className="flex flex-col gap-4 text-base">
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-700">
                      Instant discount applied
                    </span>
                    <span className="text-green-700 font-medium">
                      - {currency} {discount.toLocaleString()}
                    </span>
                  </div>
                )}
                <hr />
                {/* Remove base fare and surcharges, keep only cards and total */}
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold text-lg">TOTAL</span>
                  <span className="font-bold text-2xl text-black">
                    {currency} {total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
          {tab === "cancellation" && (
            <div className="max-w-lg mx-auto w-full">
              <div className="text-2xl font-bold mb-4">Cancellation Policy</div>
              <hr className="mb-6" />
              {/* Debug log for fareRule */}
              {console.log("fareRule:", fareRule)}
              {fareRuleLoading ? (
                <div className="text-gray-400 text-base">
                  Loading fare rules...
                </div>
              ) : fareRule && fareRule.Result && fareRule.Result.length > 0 ? (
                fareRule.Result.map((rule, idx) => (
                  <div key={idx} className="mb-8">
                    <div className="font-semibold mb-2 text-gray-800">
                      {rule.Origin} → {rule.Destination}
                    </div>
                    <div
                      className="prose max-w-full bg-gray-50 rounded-lg p-4 border border-gray-200"
                      dangerouslySetInnerHTML={{ __html: rule.FareRuleDetail }}
                    />
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-base">Not available</div>
              )}
            </div>
          )}
          {tab === "datechange" && (
            <div className="max-w-lg mx-auto w-full">
              <div className="text-2xl font-bold mb-4">Date Change Policy</div>
              <hr className="mb-6" />
              {selectedFare.DateChangePolicy ? (
                <div className="text-gray-700 whitespace-pre-line text-base">
                  {selectedFare.DateChangePolicy}
                </div>
              ) : (
                <div className="text-gray-400 text-base">Not available</div>
              )}
            </div>
          )}
        </div>
        {/* Action buttons at bottom */}
        <div className="flex gap-4 px-8 py-6 border-t border-gray-200 bg-white sticky bottom-0 z-20">
          <button className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-base shadow transition">
            BOOK NOW
          </button>
          <button
            className="flex-1 py-3 border border-blue-600 text-blue-700 font-bold rounded-lg text-base bg-white hover:bg-blue-50 transition"
            onClick={() => {
              if (typeof onFlightSelect === "function") {
                onFlightSelect(flight, searchParams);
              }
              onClose();
            }}
          >
            ADD TO PACKAGE
          </button>
        </div>
      </div>
    </div>
  );
}

const FlightSearch: React.FC<FlightSearchProps> = ({
  onFlightSelect,
  onDrawerOpenChange,
  onResults,
  initialSearchParams,
  suppressLoadingOverlay = false,
  onSearchStart,
  onSearchEnd,
}) => {
  const [searchParams, setSearchParams] = useState<FlightSearchParams>(
    initialSearchParams || {
      tripType: "ROUND_TRIP",
      originLocationCode: "",
      destinationLocationCode: "",
      departureDate: new Date(),
      returnDate: new Date(),
      adults: 1,
      children: 0,
      infants: 0,
      travelClass: "ECONOMY",
      nonStop: false,
    },
  );

  // Separate state for display values
  const [originDisplayValue, setOriginDisplayValue] = useState("");
  const [destDisplayValue, setDestDisplayValue] = useState("");

  const [flightOffers, setFlightOffers] = useState<FlightOffer[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [originSuggestions, setOriginSuggestions] = useState<
    AirportSuggestion[]
  >([]);
  const [destSuggestions, setDestSuggestions] = useState<AirportSuggestion[]>(
    [],
  );
  const [originLoading, setOriginLoading] = useState(false);
  const [destLoading, setDestLoading] = useState(false);
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const [originError, setOriginError] = useState<string | null>(null);
  const [destError, setDestError] = useState<string | null>(null);
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);
  const [passengerModalOpen, setPassengerModalOpen] = useState(false);
  const [departurePopoverOpen, setDeparturePopoverOpen] = useState(false);
  const [returnPopoverOpen, setReturnPopoverOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // Add state to FlightSearch
  const [selectedFlight, setSelectedFlight] = useState<FlightOffer | null>(
    null,
  );
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  // Fare rule state
  const [fareRule, setFareRule] = useState(null);
  const [fareRuleLoading, setFareRuleLoading] = useState(false);

  // Debug useEffect to monitor flight offers
  useEffect(() => {
    console.log("Flight offers changed:", flightOffers.length);
    console.log("First flight offer:", flightOffers[0]);
    if (onResults) {
      onResults(flightOffers);
    }
  }, [flightOffers, onResults]);

  // Add state for sorting
  const [sortOption, setSortOption] = useState<"cheapest" | "fastest" | "best">(
    "best",
  );

  // Add state for pagination
  const [visibleCount, setVisibleCount] = useState(10);

  // Sorting logic before rendering flightOffers (must come before filters)
  const sortedFlightOffers = React.useMemo(() => {
    if (flightOffers.length === 0) return [];
    // Calculate min/max for normalization
    const prices = flightOffers.map((o) => {
      const flightOption = o.rawOffer as {
        Segments?: TTSFlightSegment[][];
        FareList?: TTSFare[];
      };
      const fareList = flightOption?.FareList || [];
      const minFare =
        fareList.length > 0
          ? Math.min(
              ...fareList.map(
                (fare) => fare.OfferedPrice || fare.PublishedPrice || 0,
              ),
            )
          : 0;
      return o.price.offered || o.price.published || minFare;
    });
    const durations = flightOffers.map((o) => {
      const flightOption = o.rawOffer as {
        Segments?: TTSFlightSegment[][];
        FareList?: TTSFare[];
      };
      const segments = flightOption?.Segments?.[0] || [];
      if (segments.length > 0) {
        const dep = new Date(segments[0].Origin.DepartTime);
        const arr = new Date(
          segments[segments.length - 1].Destination.ArrivalTime,
        );
        return (arr.getTime() - dep.getTime()) / 60000;
      }
      return Infinity;
    });
    const stopsArr = flightOffers.map((o) => {
      const flightOption = o.rawOffer as {
        Segments?: TTSFlightSegment[][];
        FareList?: TTSFare[];
      };
      const segments = flightOption?.Segments?.[0] || [];
      return Math.max(0, segments.length - 1);
    });
    // Helper to sum layover durations in minutes
    const layoverArr = flightOffers.map((o) => {
      const flightOption = o.rawOffer as {
        Segments?: TTSFlightSegment[][];
        FareList?: TTSFare[];
      };
      const segments = flightOption?.Segments?.[0] || [];
      let totalLayover = 0;
      for (let i = 1; i < segments.length; i++) {
        const prevArr = new Date(segments[i - 1].Destination.ArrivalTime);
        const nextDep = new Date(segments[i].Origin.DepartTime);
        totalLayover += (nextDep.getTime() - prevArr.getTime()) / 60000;
      }
      return totalLayover;
    });
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const minDuration = Math.min(...durations);
    const maxDuration = Math.max(...durations);
    const minStops = Math.min(...stopsArr);
    const maxStops = Math.max(...stopsArr);
    const minLayover = Math.min(...layoverArr);
    const maxLayover = Math.max(...layoverArr);
    // Helper to normalize
    const normalize = (val: number, min: number, max: number) => {
      if (max === min) return 0.5; // avoid div by zero
      return (val - min) / (max - min);
    };
    return [...flightOffers].sort((a, b) => {
      if (sortOption === "cheapest") {
        return (
          (a.price.offered || a.price.published || 0) -
          (b.price.offered || b.price.published || 0)
        );
      }
      if (sortOption === "fastest") {
        const getDuration = (offer: FlightOffer) => {
          const flightOption = offer.rawOffer as {
            Segments?: TTSFlightSegment[][];
            FareList?: TTSFare[];
          };
          const segments = flightOption?.Segments?.[0] || [];
          if (segments.length > 0) {
            const dep = new Date(segments[0].Origin.DepartTime);
            const arr = new Date(
              segments[segments.length - 1].Destination.ArrivalTime,
            );
            return (arr.getTime() - dep.getTime()) / 60000;
          }
          return Infinity;
        };
        return getDuration(a) - getDuration(b);
      }
      // 'Best': normalized weighted score (price 55%, duration 20%, stops 15%, layover 10%)
      const getDuration = (offer: FlightOffer) => {
        const flightOption = offer.rawOffer as {
          Segments?: TTSFlightSegment[][];
          FareList?: TTSFare[];
        };
        const segments = flightOption?.Segments?.[0] || [];
        if (segments.length > 0) {
          const dep = new Date(segments[0].Origin.DepartTime);
          const arr = new Date(
            segments[segments.length - 1].Destination.ArrivalTime,
          );
          return (arr.getTime() - dep.getTime()) / 60000;
        }
        return Infinity;
      };
      const getStops = (offer: FlightOffer) => {
        const flightOption = offer.rawOffer as {
          Segments?: TTSFlightSegment[][];
          FareList?: TTSFare[];
        };
        const segments = flightOption?.Segments?.[0] || [];
        return Math.max(0, segments.length - 1);
      };
      const getLayover = (offer: FlightOffer) => {
        const flightOption = offer.rawOffer as {
          Segments?: TTSFlightSegment[][];
          FareList?: TTSFare[];
        };
        const segments = flightOption?.Segments?.[0] || [];
        let totalLayover = 0;
        for (let i = 1; i < segments.length; i++) {
          const prevArr = new Date(segments[i - 1].Destination.ArrivalTime);
          const nextDep = new Date(segments[i].Origin.DepartTime);
          totalLayover += (nextDep.getTime() - prevArr.getTime()) / 60000;
        }
        return totalLayover;
      };
      const aPrice = a.price.offered || a.price.published || 0;
      const bPrice = b.price.offered || b.price.published || 0;
      const aDuration = getDuration(a);
      const bDuration = getDuration(b);
      const aStops = getStops(a);
      const bStops = getStops(b);
      const aLayover = getLayover(a);
      const bLayover = getLayover(b);
      const aScore =
        normalize(aPrice, minPrice, maxPrice) * 0.55 +
        normalize(aDuration, minDuration, maxDuration) * 0.2 +
        normalize(aStops, minStops, maxStops) * 0.15 +
        normalize(aLayover, minLayover, maxLayover) * 0.1;
      const bScore =
        normalize(bPrice, minPrice, maxPrice) * 0.55 +
        normalize(bDuration, minDuration, maxDuration) * 0.2 +
        normalize(bStops, minStops, maxStops) * 0.15 +
        normalize(bLayover, minLayover, maxLayover) * 0.1;
      return aScore - bScore;
    });
  }, [flightOffers, sortOption]);

  // Add filter state
  const [filterStops, setFilterStops] = useState<string[]>([]); // e.g. ['direct', '1', '2+']
  const [filterAirlines, setFilterAirlines] = useState<string[]>([]); // airline codes
  const [filterDepTimes, setFilterDepTimes] = useState<string[]>([]); // e.g. ['morning', 'afternoon', ...]
  const [filterMaxDuration, setFilterMaxDuration] = useState<number | null>(
    null,
  );
  const [filterBaggage, setFilterBaggage] = useState(false);

  // Compute available airlines and max duration from results
  const availableAirlines = useMemo(() => {
    const codes = new Set<string>();
    sortedFlightOffers.forEach((offer) => {
      const flightOption = offer.rawOffer as {
        Segments?: TTSFlightSegment[][];
        FareList?: TTSFare[];
      };
      const segmentsGroups = flightOption?.Segments || [];
      segmentsGroups.forEach((segments) => {
        segments.forEach((seg) => {
          if (seg.Airline?.AirlineCode) codes.add(seg.Airline.AirlineCode);
        });
      });
    });
    return Array.from(codes);
  }, [sortedFlightOffers]);
  const maxDuration = useMemo(() => {
    return Math.max(
      ...sortedFlightOffers.map((offer) => {
        const flightOption = offer.rawOffer as {
          Segments?: TTSFlightSegment[][];
          FareList?: TTSFare[];
        };
        const segmentsGroups = flightOption?.Segments || [];
        const onwardSegments = segmentsGroups[0] || [];
        if (onwardSegments.length > 0) {
          const dep = new Date(onwardSegments[0].Origin.DepartTime);
          const arr = new Date(
            onwardSegments[onwardSegments.length - 1].Destination.ArrivalTime,
          );
          return (arr.getTime() - dep.getTime()) / 60000;
        }
        return 0;
      }),
    );
  }, [sortedFlightOffers]);

  // Filter logic
  const filteredFlightOffers = useMemo(() => {
    return sortedFlightOffers.filter((offer) => {
      const flightOption = offer.rawOffer as {
        Segments?: TTSFlightSegment[][];
        FareList?: TTSFare[];
      };
      const segmentsGroups = flightOption?.Segments || [];
      const onwardSegments = segmentsGroups[0] || [];

      // Stops
      if (filterStops.length) {
        const stops = onwardSegments.length - 1;
        if (
          (filterStops.includes("direct") && stops === 0) ||
          (filterStops.includes("1") && stops === 1) ||
          (filterStops.includes("2+") && stops >= 2)
        ) {
          // pass
        } else {
          return false;
        }
      }

      // Airlines
      if (filterAirlines.length) {
        const airlineCodes = onwardSegments
          .map((seg) => seg.Airline?.AirlineCode)
          .filter(Boolean);
        if (!airlineCodes.some((code) => filterAirlines.includes(code)))
          return false;
      }

      // Departure time
      if (filterDepTimes.length) {
        const dep = new Date(onwardSegments[0]?.Origin?.DepartTime);
        const hour = dep.getHours();
        const slot =
          hour >= 6 && hour < 12
            ? "morning"
            : hour >= 12 && hour < 18
              ? "afternoon"
              : hour >= 18 && hour < 24
                ? "evening"
                : "night";
        if (!filterDepTimes.includes(slot)) return false;
      }

      // Duration
      if (filterMaxDuration !== null) {
        const dep = new Date(onwardSegments[0]?.Origin?.DepartTime);
        const arr = new Date(
          onwardSegments[onwardSegments.length - 1]?.Destination?.ArrivalTime,
        );
        const duration = (arr.getTime() - dep.getTime()) / 60000;
        if (duration > filterMaxDuration) return false;
      }

      // Baggage (at least one segment with checked baggage info)
      if (filterBaggage) {
        const hasBaggage = onwardSegments.some((seg) => {
          const baggage = seg.Baggage || seg.SeatBaggage;
          return (
            baggage &&
            (typeof baggage === "string"
              ? baggage.includes("Kg")
              : Array.isArray(baggage) && baggage.length > 0)
          );
        });
        if (!hasBaggage) return false;
      }

      return true;
    });
  }, [
    sortedFlightOffers,
    filterStops,
    filterAirlines,
    filterDepTimes,
    filterMaxDuration,
    filterBaggage,
  ]);

  // Slice the filtered list for display
  const paginatedFlightOffers = filteredFlightOffers.slice(0, visibleCount);

  const fetchOriginSuggestions = debounce(async (val: string) => {
    if (!val || val.length < 2) {
      setOriginSuggestions([]);
      setOriginError(null);
      return;
    }
    setOriginLoading(true);
    setOriginError(null);
    try {
      // Only fetch AIRPORT suggestions, not CITY
      const { data, error } = await supabase.functions.invoke(
        "amadeus-airport-suggest",
        {
          body: { keyword: val, subType: "AIRPORT" },
        },
      );

      if (error) {
        throw new Error(error.message);
      }

      let suggestions = data.data || data || [];
      // Sort: exact IATA code matches first, then by best match as input grows
      suggestions = suggestions.sort((a, b) => {
        const aExact = a.iataCode?.toLowerCase() === val.toLowerCase();
        const bExact = b.iataCode?.toLowerCase() === val.toLowerCase();
        const aStart = a.iataCode?.toLowerCase().startsWith(val.toLowerCase());
        const bStart = b.iataCode?.toLowerCase().startsWith(val.toLowerCase());
        const aNameStart = a.name?.toLowerCase().startsWith(val.toLowerCase());
        const bNameStart = b.name?.toLowerCase().startsWith(val.toLowerCase());
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        if (aStart && !bStart) return -1;
        if (!aStart && bStart) return 1;
        if (aNameStart && !bNameStart) return -1;
        if (!aNameStart && bNameStart) return 1;
        return 0;
      });
      setOriginSuggestions(suggestions);
      setApiAvailable(true);
    } catch (e) {
      setOriginError(
        `Failed to load suggestions: ${e instanceof Error ? e.message : "Unknown error"}`,
      );
      setOriginSuggestions([]);
      setApiAvailable(false);
    }
    setOriginLoading(false);
  }, 300);

  const fetchDestSuggestions = debounce(async (val: string) => {
    if (!val || val.length < 2) {
      setDestSuggestions([]);
      setDestError(null);
      return;
    }
    setDestLoading(true);
    setDestError(null);
    try {
      // Only fetch AIRPORT suggestions, not CITY
      const { data, error } = await supabase.functions.invoke(
        "amadeus-airport-suggest",
        {
          body: { keyword: val, subType: "AIRPORT" },
        },
      );

      if (error) {
        throw new Error(error.message);
      }

      let suggestions = data.data || data || [];
      // Sort: exact IATA code matches first, then by best match as input grows
      suggestions = suggestions.sort((a, b) => {
        const aExact = a.iataCode?.toLowerCase() === val.toLowerCase();
        const bExact = b.iataCode?.toLowerCase() === val.toLowerCase();
        const aStart = a.iataCode?.toLowerCase().startsWith(val.toLowerCase());
        const bStart = b.iataCode?.toLowerCase().startsWith(val.toLowerCase());
        const aNameStart = a.name?.toLowerCase().startsWith(val.toLowerCase());
        const bNameStart = b.name?.toLowerCase().startsWith(val.toLowerCase());
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        if (aStart && !bStart) return -1;
        if (!aStart && bStart) return 1;
        if (aNameStart && !bNameStart) return -1;
        if (!aNameStart && bNameStart) return 1;
        return 0;
      });
      setDestSuggestions(suggestions);
      setApiAvailable(true);
    } catch (e) {
      setDestError(
        `Failed to load suggestions: ${e instanceof Error ? e.message : "Unknown error"}`,
      );
      setDestSuggestions([]);
      setApiAvailable(false);
    }
    setDestLoading(false);
  }, 300);

  // Test function to check API status
  const testAPI = async () => {
    try {
      console.log("Testing Amadeus API...");
      const { data, error } = await supabase.functions.invoke(
        "amadeus-airport-suggest",
        {
          body: { keyword: "delhi", subType: "AIRPORT,CITY" },
        },
      );

      if (error) {
        console.log("❌ API is not working. Error:", error.message);
        setApiAvailable(false);
      } else {
        console.log("✅ API is working correctly");
        console.log("API Test Response:", data);
        setApiAvailable(true);
      }
    } catch (error) {
      console.error("❌ API test failed:", error);
      setApiAvailable(false);
    }
  };

  // Test API on component mount
  useEffect(() => {
    testAPI();
  }, []);

  useEffect(() => {
    // On initial load or when departure date changes, ensure return date is not before departure date
    setSearchParams((prev) => {
      if (prev.returnDate && prev.returnDate < prev.departureDate) {
        return { ...prev, returnDate: prev.departureDate };
      }
      return prev;
    });
  }, [searchParams.departureDate]);

  // Reset pagination on new search
  useEffect(() => {
    setVisibleCount(10);
  }, [flightOffers, sortOption]);

  const formatSuggestion = (suggestion: AirportSuggestion) => {
    const cityName = suggestion.address?.cityName || suggestion.name;
    const countryName = suggestion.address?.countryName;
    const type = suggestion.subType === "CITY" ? "City" : "Airport";

    return {
      display: `${suggestion.iataCode} - ${cityName}${countryName ? `, ${countryName}` : ""}`,
      subtitle: type,
      iataCode: suggestion.iataCode,
      name: suggestion.name,
      cityName,
      countryName,
      type,
    };
  };

  const handleDepartureDateChange = (date: Date | undefined) => {
    if (date) {
      setSearchParams((prev) => {
        let newReturn = prev.returnDate;
        if (!newReturn || newReturn < date) {
          newReturn = date;
        }
        return {
          ...prev,
          departureDate: date,
          returnDate: newReturn,
        };
      });
      setDeparturePopoverOpen(false);
    }
  };

  const handleReturnDateChange = (date: Date | undefined) => {
    if (date) {
      setSearchParams((prev) => ({
        ...prev,
        returnDate: date,
      }));
      setReturnPopoverOpen(false);
    }
  };

  const handleAdultsChange = (value: number) => {
    setSearchParams((prev) => ({
      ...prev,
      adults: value,
    }));
  };

  const handleChildrenChange = (value: number) => {
    setSearchParams((prev) => ({
      ...prev,
      children: value,
    }));
  };

  const handleInfantsChange = (value: number) => {
    setSearchParams((prev) => ({
      ...prev,
      infants: value,
    }));
  };

  const handleTripTypeChange = (value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      tripType: value as "ONE_WAY" | "ROUND_TRIP" | "MULTI_CITY",
    }));
  };

  const handleTravelClassChange = (value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      travelClass: value as
        | "ECONOMY"
        | "PREMIUM_ECONOMY"
        | "BUSINESS"
        | "FIRST",
    }));
  };

  // Update handleSearchFlights to call the Amadeus API for flight offers using the form values
  const handleSearchFlights = async () => {
    console.log("Search triggered with params:", searchParams);
    if (
      !searchParams.originLocationCode ||
      !searchParams.destinationLocationCode
    ) {
      console.error("Origin and destination are required");
      return;
    }

    setIsLoading(true);
    if (onSearchStart) onSearchStart();
    try {
      // Map UI fields to TTS API request
      const ttsParams: TTSFlightSearchParams = {
        UserIp: "122.161.64.143", // TODO: Replace with dynamic IP if available
        Adult: searchParams.adults,
        Child: searchParams.children,
        Infant: searchParams.infants,
        DirectFlight: searchParams.nonStop,
        JourneyType: searchParams.tripType === "ROUND_TRIP" ? 2 : 1,
        PreferredCarriers: [],
        CabinClass:
          ["ECONOMY", "PREMIUM_ECONOMY", "BUSINESS", "FIRST"].indexOf(
            searchParams.travelClass,
          ) + 1,
        SeriesFare: null,
        AirSegments: [
          {
            Origin: searchParams.originLocationCode,
            Destination: searchParams.destinationLocationCode,
            PreferredTime:
              searchParams.departureDate.toISOString().split("T")[0] +
              "T00:00:00",
          },
          ...(searchParams.tripType === "ROUND_TRIP" && searchParams.returnDate
            ? [
                {
                  Origin: searchParams.destinationLocationCode,
                  Destination: searchParams.originLocationCode,
                  PreferredTime:
                    searchParams.returnDate.toISOString().split("T")[0] +
                    "T00:00:00",
                },
              ]
            : []),
        ],
      };

      const ttsResults = await ttsFlightSearch(ttsParams);
      console.log("TTS API raw response:", ttsResults);

      // TTS API returns Result: [Array of flight options]
      const flights =
        Array.isArray(ttsResults.Result) && Array.isArray(ttsResults.Result[0])
          ? ttsResults.Result[0]
          : [];
      console.log("TTS API Result[0]:", ttsResults.Result[0]);

      // Transform TTS API response to FlightOffer format
      const transformedFlights = flights.map(
        (
          flightOption: {
            Segments: TTSFlightSegment[][];
            FareList: TTSFare[];
            ResultIndex?: string | number;
            [key: string]: unknown;
          },
          index: number,
        ) => {
          // Get segments for both directions
          const segmentsGroups = flightOption?.Segments || [];
          const onwardSegments = segmentsGroups[0] || [];
          const returnSegments = segmentsGroups[1] || [];

          // Get first segment of onward journey for basic info
          const firstOnwardSeg = onwardSegments[0];

          // Find the minimum price from FareList
          const fareList = flightOption?.FareList || [];
          const minFare =
            fareList.length > 0
              ? Math.min(
                  ...fareList.map(
                    (fare) => fare.OfferedPrice || fare.PublishedPrice || 0,
                  ),
                )
              : 0;

          // Get airline info from all segments
          const allSegments = [...onwardSegments, ...returnSegments];
          const airlineCodes = Array.from(
            new Set(
              allSegments.map((s) => s.Airline?.AirlineCode).filter(Boolean),
            ),
          );
          const airlineNames = Array.from(
            new Set(
              allSegments.map((s) => s.Airline?.AirlineName).filter(Boolean),
            ),
          );

          // Fix: id must be string
          const id = flightOption.ResultIndex
            ? String(flightOption.ResultIndex)
            : `flight-${index}`;

          // Fix: duration and aircraft from correct properties
          const duration =
            firstOnwardSeg && typeof firstOnwardSeg.TotalDuration === "number"
              ? (() => {
                  const hours = Math.floor(firstOnwardSeg.TotalDuration / 60);
                  const mins = firstOnwardSeg.TotalDuration % 60;
                  return `${hours}h ${mins}m`;
                })()
              : "Unknown";
          const aircraft =
            firstOnwardSeg?.Airline?.AircraftType ||
            firstOnwardSeg?.Airline?.Craft;

          return {
            id,
            airline: airlineNames[0] || "Unknown",
            flightNumber: firstOnwardSeg?.Airline?.FlightNumber || "Unknown",
            departure: {
              iataCode: firstOnwardSeg?.Origin?.AirportCode || "Unknown",
              terminal: firstOnwardSeg?.Origin?.Terminal,
              at:
                firstOnwardSeg?.Origin?.DepartTime || new Date().toISOString(),
            },
            arrival: {
              iataCode: firstOnwardSeg?.Destination?.AirportCode || "Unknown",
              terminal: firstOnwardSeg?.Destination?.Terminal,
              at:
                firstOnwardSeg?.Destination?.ArrivalTime ||
                new Date().toISOString(),
            },
            duration,
            stops: Math.max(0, onwardSegments.length - 1),
            cabin: firstOnwardSeg?.CabinClass || "ECONOMY",
            aircraft,
            price: {
              total: minFare.toString(),
              currency: "INR",
              published: minFare,
              offered: minFare,
            },
            rawOffer: {
              ...flightOption,
              SearchTokenId: ttsResults.SearchTokenId, // Ensure SearchTokenId is present
            },
          };
        },
      );
      console.log("Transformed flights:", transformedFlights);
      console.log("Number of flights:", transformedFlights.length);
      setFlightOffers(transformedFlights);
      console.log("Flight offers set, checking state after...");
    } catch (error) {
      console.error("Error during flight search:", error);
      setFlightOffers([]);
    } finally {
      setIsLoading(false);
      if (onSearchEnd) onSearchEnd();
    }
  };

  // Custom input for DatePicker
  interface CustomDateInputProps {
    value?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    placeholder?: string;
    id?: string;
  }
  const CustomDateInput = React.forwardRef<
    HTMLButtonElement,
    CustomDateInputProps
  >(({ value, onClick, placeholder, id }, ref) => (
    <button
      type="button"
      onClick={onClick}
      ref={ref}
      id={id}
      className="w-full flex items-center justify-between border rounded px-3 py-2 bg-white text-left focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm hover:border-emerald-400 transition"
      aria-label={placeholder}
    >
      <span>
        {value || <span className="text-gray-400">{placeholder}</span>}
      </span>
      <CalendarIcon className="ml-2 h-4 w-4 text-emerald-600" />
    </button>
  ));

  useEffect(() => {
    if (onDrawerOpenChange) onDrawerOpenChange(detailsModalOpen);
  }, [detailsModalOpen, onDrawerOpenChange]);

  // paxSummary function for passenger button label
  const paxSummary = () => {
    const { adults, children, infants } = searchParams;
    const parts = [];
    if (adults) parts.push(`${adults} Adult${adults > 1 ? "s" : ""}`);
    if (children) parts.push(`${children} Child${children > 1 ? "ren" : ""}`);
    if (infants) parts.push(`${infants} Infant${infants > 1 ? "s" : ""}`);
    return parts.length ? parts.join(", ") : "Select passengers";
  };

  // Fetch fare rule when modal opens and selectedFlight changes
  useEffect(() => {
    console.log("useEffect triggered:", { detailsModalOpen, selectedFlight });
    const fetchFareRule = async () => {
      if (!detailsModalOpen || !selectedFlight) return;
      // Get FareId and SearchTokenId
      const fareList = selectedFlight.rawOffer?.FareList || [];
      const fareId = fareList[0]?.FareId;
      const searchTokenId =
        selectedFlight.rawOffer?.SearchTokenId || selectedFlight.SearchTokenId;
      const userIp = "122.161.64.143"; // TODO: Replace with dynamic IP if available
      if (!fareId || !searchTokenId) return;
      // Log FareId and ResultIndex for debugging
      console.log(
        "FareRule fetch: FareId:",
        fareId,
        "ResultIndex:",
        fareId,
        "SearchTokenId:",
        searchTokenId,
      );
      setFareRuleLoading(true);
      try {
        // Use proxy endpoint in development, real endpoint in production
        const isLocal =
          window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1";
        const fareRuleUrl = isLocal
          ? "/api/farerule"
          : "https://www.stagingapi.bdsd.technology/api/airservice/rest/farerule";
        // Add Username and Password headers from Vite env variables
        // Set VITE_API_USERNAME and VITE_API_PASSWORD in your .env file
        const response = await fetch(fareRuleUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Username: import.meta.env.VITE_API_USERNAME,
            Password: import.meta.env.VITE_API_PASSWORD,
            "X-Debug-FareId": fareId,
            "X-Debug-ResultIndex": fareId,
            "X-Debug-SearchTokenId": searchTokenId,
          },
          body: JSON.stringify({
            UserIp: userIp,
            SearchTokenId: searchTokenId,
            ResultIndex: fareId,
          }),
        });
        const data = await response.json();
        console.log("FareRule API response:", data);
        setFareRule(data);
      } catch (e) {
        console.error("FareRule fetch error:", e);
        setFareRule(null);
      } finally {
        setFareRuleLoading(false);
      }
    };
    fetchFareRule();
  }, [detailsModalOpen, selectedFlight]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search Flights</h1>

      {apiAvailable === false && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-yellow-800">
              Using demo data - Amadeus API not configured. Contact
              administrator to set up API credentials.
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label>Trip Type</Label>
          <Select
            value={searchParams.tripType}
            onValueChange={handleTripTypeChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select trip type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ONE_WAY">One Way</SelectItem>
              <SelectItem value="ROUND_TRIP">Round Trip</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Travel Class</Label>
          <Select
            value={searchParams.travelClass}
            onValueChange={handleTravelClassChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select travel class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ECONOMY">Economy</SelectItem>
              <SelectItem value="PREMIUM_ECONOMY">Premium Economy</SelectItem>
              <SelectItem value="BUSINESS">Business</SelectItem>
              <SelectItem value="FIRST">First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* Dates and Passengers in the same row, as the last row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <Label>Departure Date</Label>
          <DatePicker
            selected={searchParams.departureDate}
            onChange={(date) => handleDepartureDateChange(date as Date)}
            minDate={new Date()}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            dateFormat="dd MMM yyyy"
            placeholderText="Pick a date"
            customInput={
              <CustomDateInput placeholder="Pick a date" id="departure-date" />
            }
            popperClassName="custom-datepicker-popper"
            dayClassName={(date) =>
              `rounded-full transition-all duration-150 ${
                date.toDateString() === new Date().toDateString()
                  ? "border-2 border-emerald-400"
                  : ""
              }`
            }
            aria-label="Departure date picker"
          />
        </div>
        {searchParams.tripType === "ROUND_TRIP" && (
          <div>
            <Label>Return Date</Label>
            <DatePicker
              selected={searchParams.returnDate}
              onChange={(date) => handleReturnDateChange(date as Date)}
              minDate={searchParams.departureDate || new Date()}
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              dateFormat="dd MMM yyyy"
              placeholderText="Pick a date"
              customInput={
                <CustomDateInput placeholder="Pick a date" id="return-date" />
              }
              popperClassName="custom-datepicker-popper"
              dayClassName={(date) =>
                `rounded-full transition-all duration-150 ${
                  date.toDateString() === new Date().toDateString()
                    ? "border-2 border-emerald-400"
                    : ""
                }`
              }
              aria-label="Return date picker"
            />
          </div>
        )}
        <div>
          <Label>Passengers</Label>
          <Button
            type="button"
            variant="outline"
            className="w-full text-left"
            onClick={() => setPassengerModalOpen(true)}
          >
            {paxSummary()}
          </Button>
          <Dialog
            open={passengerModalOpen}
            onOpenChange={setPassengerModalOpen}
          >
            <DialogContent className="max-w-lg w-full">
              <DialogHeader>
                <DialogTitle>Select Passengers</DialogTitle>
              </DialogHeader>
              {/* Passenger selectors in a single row */}
              <div className="flex flex-col gap-2">
                <div className="flex flex-row flex-nowrap items-end justify-between gap-2">
                  {/* Adults */}
                  <div className="flex-1 min-w-0 flex flex-col items-center px-1">
                    <span className="font-medium text-sm">Adults</span>
                    <span className="text-xs text-gray-500">(12+ yrs)</span>
                    <div className="flex items-center gap-1 mt-1">
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        disabled={searchParams.adults <= ADULT_MIN}
                        onClick={() =>
                          setSearchParams((p) => {
                            // If infants > new adults, reduce infants as well
                            const newAdults = Math.max(ADULT_MIN, p.adults - 1);
                            let newInfants = p.infants;
                            if (newInfants > newAdults) newInfants = newAdults;
                            return {
                              ...p,
                              adults: newAdults,
                              infants: newInfants,
                            };
                          })
                        }
                      >
                        -
                      </Button>
                      <span>{searchParams.adults}</span>
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        disabled={
                          searchParams.adults >= ADULT_MAX ||
                          searchParams.adults +
                            searchParams.children +
                            searchParams.infants >=
                            9
                        }
                        onClick={() =>
                          setSearchParams((p) => {
                            if (p.adults + p.children + p.infants >= 9)
                              return p;
                            return {
                              ...p,
                              adults: Math.min(ADULT_MAX, p.adults + 1),
                            };
                          })
                        }
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  {/* Children */}
                  <div className="flex-1 min-w-0 flex flex-col items-center px-1">
                    <span className="font-medium text-sm">Children</span>
                    <span className="text-xs text-gray-500">(2-11 yrs)</span>
                    <div className="flex items-center gap-1 mt-1">
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        disabled={searchParams.children <= CHILD_MIN}
                        onClick={() =>
                          setSearchParams((p) => ({
                            ...p,
                            children: Math.max(CHILD_MIN, p.children - 1),
                          }))
                        }
                      >
                        -
                      </Button>
                      <span>{searchParams.children}</span>
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        disabled={
                          searchParams.children >= CHILD_MAX ||
                          searchParams.adults +
                            searchParams.children +
                            searchParams.infants >=
                            9
                        }
                        onClick={() =>
                          setSearchParams((p) => {
                            if (p.adults + p.children + p.infants >= 9)
                              return p;
                            return {
                              ...p,
                              children: Math.min(CHILD_MAX, p.children + 1),
                            };
                          })
                        }
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  {/* Infants */}
                  <div className="flex-1 min-w-0 flex flex-col items-center px-1">
                    <span className="font-medium text-sm">Infants</span>
                    <span className="text-xs text-gray-500">(&lt;2 yrs)</span>
                    <div className="flex items-center gap-1 mt-1">
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        disabled={searchParams.infants <= INFANT_MIN}
                        onClick={() =>
                          setSearchParams((p) => ({
                            ...p,
                            infants: Math.max(INFANT_MIN, p.infants - 1),
                          }))
                        }
                      >
                        -
                      </Button>
                      <span>{searchParams.infants}</span>
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        disabled={
                          searchParams.infants >= searchParams.adults ||
                          searchParams.infants >= INFANT_MAX ||
                          searchParams.adults +
                            searchParams.children +
                            searchParams.infants >=
                            9
                        }
                        onClick={() =>
                          setSearchParams((p) => {
                            if (
                              p.infants >= p.adults ||
                              p.adults + p.children + p.infants >= 9
                            )
                              return p;
                            return {
                              ...p,
                              infants: Math.min(INFANT_MAX, p.infants + 1),
                            };
                          })
                        }
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
                {/* Helper message for limits */}
                {searchParams.adults +
                  searchParams.children +
                  searchParams.infants >=
                  9 && (
                  <div className="text-xs text-red-500 text-center mt-2">
                    Maximum 9 passengers allowed in total.
                  </div>
                )}
                {searchParams.infants >= searchParams.adults &&
                  searchParams.adults > 0 && (
                    <div className="text-xs text-red-500 text-center mt-1">
                      Only 1 infant per adult allowed.
                    </div>
                  )}
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  onClick={() => setPassengerModalOpen(false)}
                >
                  Done
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="origin">Origin</Label>
          <div className="relative">
            <Input
              type="text"
              id="origin"
              placeholder="Enter origin airport or city"
              value={originDisplayValue || searchParams.originLocationCode}
              autoComplete="off"
              onFocus={() => setShowOriginDropdown(true)}
              onBlur={() => setTimeout(() => setShowOriginDropdown(false), 200)}
              onChange={(e) => {
                const val = e.target.value;
                setOriginDisplayValue(val);
                setSearchParams((prev) => ({
                  ...prev,
                  originLocationCode: val,
                }));
                fetchOriginSuggestions(val);
                setShowOriginDropdown(true);
              }}
            />
            {showOriginDropdown &&
              searchParams.originLocationCode.length >= 2 && (
                <div className="absolute left-0 right-0 z-50 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto mt-1">
                  {originLoading ? (
                    <div className="p-4 text-center text-gray-500">
                      Searching...
                    </div>
                  ) : originError ? (
                    <div className="p-4 text-center text-red-500 text-sm">
                      {originError}
                    </div>
                  ) : originSuggestions.length > 0 ? (
                    originSuggestions.map((suggestion) => {
                      const formatted = formatSuggestion(suggestion);
                      return (
                        <div
                          key={suggestion.id}
                          className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                          onMouseDown={() => {
                            setSearchParams((prev) => ({
                              ...prev,
                              originLocationCode: formatted.iataCode,
                            }));
                            setOriginDisplayValue(formatted.display);
                            setShowOriginDropdown(false);
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              {formatted.type === "City" ? (
                                <MapPin className="h-4 w-4 text-blue-500" />
                              ) : (
                                <Plane className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900">
                                {formatted.iataCode}
                              </div>
                              <div className="text-sm text-gray-600 truncate">
                                {formatted.display}
                              </div>
                              <div className="text-xs text-gray-400">
                                {formatted.subtitle}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No results found
                    </div>
                  )}
                </div>
              )}
          </div>
        </div>
        <div>
          <Label htmlFor="destination">Destination</Label>
          <div className="relative">
            <Input
              type="text"
              id="destination"
              placeholder="Enter destination airport or city"
              value={destDisplayValue || searchParams.destinationLocationCode}
              autoComplete="off"
              onFocus={() => setShowDestDropdown(true)}
              onBlur={() => setTimeout(() => setShowDestDropdown(false), 200)}
              onChange={(e) => {
                const val = e.target.value;
                setDestDisplayValue(val);
                setSearchParams((prev) => ({
                  ...prev,
                  destinationLocationCode: val,
                }));
                fetchDestSuggestions(val);
                setShowDestDropdown(true);
              }}
            />
            {showDestDropdown &&
              searchParams.destinationLocationCode.length >= 2 && (
                <div className="absolute left-0 right-0 z-50 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto mt-1">
                  {destLoading ? (
                    <div className="p-4 text-center text-gray-500">
                      Searching...
                    </div>
                  ) : destError ? (
                    <div className="p-4 text-center text-red-500 text-sm">
                      {destError}
                    </div>
                  ) : destSuggestions.length > 0 ? (
                    destSuggestions.map((suggestion) => {
                      const formatted = formatSuggestion(suggestion);
                      return (
                        <div
                          key={suggestion.id}
                          className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                          onMouseDown={() => {
                            setSearchParams((prev) => ({
                              ...prev,
                              destinationLocationCode: formatted.iataCode,
                            }));
                            setDestDisplayValue(formatted.display);
                            setShowDestDropdown(false);
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              {formatted.type === "City" ? (
                                <MapPin className="h-4 w-4 text-blue-500" />
                              ) : (
                                <Plane className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900">
                                {formatted.iataCode}
                              </div>
                              <div className="text-sm text-gray-600 truncate">
                                {formatted.display}
                              </div>
                              <div className="text-xs text-gray-400">
                                {formatted.subtitle}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No results found
                    </div>
                  )}
                </div>
              )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 mt-2">
        <input
          type="checkbox"
          id="direct-flight-checkbox"
          checked={searchParams.nonStop}
          onChange={(e) =>
            setSearchParams((prev) => ({ ...prev, nonStop: e.target.checked }))
          }
          className="form-checkbox h-4 w-4 text-emerald-600 border-gray-300 rounded"
        />
        <label
          htmlFor="direct-flight-checkbox"
          className="text-sm text-gray-700 select-none"
        >
          Direct flight only
        </label>
      </div>

      <Button
        className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white"
        onClick={handleSearchFlights}
        disabled={isLoading}
      >
        {isLoading ? (
          "Searching..."
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" />
            Search Flights
          </>
        )}
      </Button>

      {/* Overlay loading GIF when isLoading */}
      {!suppressLoadingOverlay && isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <img
            src="https://res.cloudinary.com/doxoxzz02/image/upload/v1752633038/mh_flight_loading_wuwevi.gif"
            alt="Loading flights..."
            className="w-32 h-32 md:w-48 md:h-48 object-contain"
          />
        </div>
      )}

      {/* Test button for debugging */}
      <Button
        className="mt-2 ml-2 bg-blue-600 hover:bg-blue-700 text-white"
        onClick={() => {
          console.log("Test search triggered");
          setSearchParams((prev) => ({
            ...prev,
            originLocationCode: "BLR",
            destinationLocationCode: "JED",
            departureDate: new Date("2025-08-16"),
            returnDate: new Date("2025-08-23"),
          }));
        }}
      >
        Test Search (BLR-JED)
      </Button>

      {isLoading && !suppressLoadingOverlay ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] py-12">
          <img
            src="https://res.cloudinary.com/doxoxzz02/image/upload/v1752633038/mh_flight_loading_wuwevi.gif"
            alt="Loading flights..."
            className="h-32 w-32 mb-4"
          />
          <div className="text-lg text-emerald-700 font-semibold">
            Searching for flights...
          </div>
        </div>
      ) : (
        <div className="mt-8">
          {/* Controls Row: Filter and Sort */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            {/* Filter Modal Trigger */}
            <button
              className="flex items-center px-4 py-2 border border-emerald-600 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-50 transition shadow-sm"
              onClick={() => setFilterModalOpen(true)}
              aria-label="Open filters"
            >
              <Filter className="mr-2 h-5 w-5" /> Filters
            </button>
            {/* Sorting dropdown */}
            <div className="flex items-center">
              <label
                htmlFor="flight-sort"
                className="mr-2 text-sm text-gray-700"
              >
                Sort by:
              </label>
              <select
                id="flight-sort"
                value={sortOption}
                onChange={(e) =>
                  setSortOption(
                    e.target.value as "cheapest" | "fastest" | "best",
                  )
                }
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="cheapest">Cheapest</option>
                <option value="fastest">Fastest</option>
                <option value="best">Best</option>
              </select>
            </div>
          </div>
          {/* Filter Modal */}
          {filterModalOpen && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-30">
              <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg relative animate-fade-in max-h-[85vh] overflow-y-auto mb-20">
                <button
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
                  onClick={() => setFilterModalOpen(false)}
                  aria-label="Close filter modal"
                >
                  ×
                </button>
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <Filter className="mr-2 h-5 w-5" /> Filters
                </h3>
                <div className="space-y-6 max-h-[55vh] overflow-y-auto pb-12">
                  {/* Stops filter */}
                  <div>
                    <div className="font-semibold text-sm mb-2">Stops</div>
                    <div className="flex gap-3 flex-wrap">
                      <label className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={filterStops.includes("direct")}
                          onChange={(e) =>
                            setFilterStops((fs) =>
                              e.target.checked
                                ? [...fs, "direct"]
                                : fs.filter((f) => f !== "direct"),
                            )
                          }
                        />{" "}
                        Direct
                      </label>
                      <label className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={filterStops.includes("1")}
                          onChange={(e) =>
                            setFilterStops((fs) =>
                              e.target.checked
                                ? [...fs, "1"]
                                : fs.filter((f) => f !== "1"),
                            )
                          }
                        />{" "}
                        1 stop
                      </label>
                      <label className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={filterStops.includes("2+")}
                          onChange={(e) =>
                            setFilterStops((fs) =>
                              e.target.checked
                                ? [...fs, "2+"]
                                : fs.filter((f) => f !== "2+"),
                            )
                          }
                        />{" "}
                        2+ stops
                      </label>
                    </div>
                  </div>
                  {/* Airlines filter */}
                  <div>
                    <div className="font-semibold text-sm mb-2">Airlines</div>
                    <div className="space-y-3">
                      {availableAirlines.map((code) => {
                        // Find airline name and price for this airline
                        const airlineInfo = sortedFlightOffers.find((offer) => {
                          const flightOption = offer.rawOffer as {
                            Segments?: TTSFlightSegment[][];
                            FareList?: TTSFare[];
                          };
                          const segmentsGroups = flightOption?.Segments || [];
                          return segmentsGroups.some((segments) =>
                            segments.some(
                              (seg) => seg.Airline?.AirlineCode === code,
                            ),
                          );
                        });

                        const airlineName = airlineInfo
                          ? (() => {
                              const flightOption = airlineInfo.rawOffer;
                              const segmentsGroups =
                                flightOption?.Segments || [];
                              for (const segments of segmentsGroups) {
                                for (const seg of segments) {
                                  if (seg.Airline?.AirlineCode === code) {
                                    return seg.Airline?.AirlineName || code;
                                  }
                                }
                              }
                              return code;
                            })()
                          : code;

                        const airlinePrice = airlineInfo
                          ? (() => {
                              const flightOption = airlineInfo.rawOffer;
                              const fareList = flightOption?.FareList || [];
                              if (fareList.length > 0) {
                                const minFare = Math.min(
                                  ...fareList.map(
                                    (fare) =>
                                      fare.OfferedPrice ||
                                      fare.PublishedPrice ||
                                      0,
                                  ),
                                );
                                return minFare;
                              }
                              return null;
                            })()
                          : null;

                        return (
                          <label
                            key={code}
                            className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={filterAirlines.includes(code)}
                              onChange={(e) =>
                                setFilterAirlines((fa) =>
                                  e.target.checked
                                    ? [...fa, code]
                                    : fa.filter((f) => f !== code),
                                )
                              }
                              className="form-checkbox h-4 w-4 text-emerald-600 border-gray-300 rounded"
                            />
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-8 h-8 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-100">
                                <img
                                  src={`https://content.airhex.com/content/logos/airlines_${code.toLowerCase()}_350_100_r.png?background=fff&pad=auto`}
                                  alt={airlineName}
                                  className="w-6 h-6 object-contain"
                                  onError={(e) =>
                                    (e.currentTarget.src = "/placeholder.svg")
                                  }
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900 truncate">
                                  {airlineName}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {code}
                                </div>
                              </div>
                              {airlinePrice && (
                                <div className="text-right">
                                  <div className="font-semibold text-emerald-600">
                                    ₹{airlinePrice.toLocaleString()}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    from
                                  </div>
                                </div>
                              )}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  {/* Departure time filter */}
                  <div>
                    <div className="font-semibold text-sm mb-2">
                      Departure Time
                    </div>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filterDepTimes.includes("morning")}
                          onChange={(e) =>
                            setFilterDepTimes((ft) =>
                              e.target.checked
                                ? [...ft, "morning"]
                                : ft.filter((f) => f !== "morning"),
                            )
                          }
                          className="form-checkbox h-4 w-4 text-emerald-600 border-gray-300 rounded"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            Morning
                          </div>
                          <div className="text-xs text-gray-500">
                            06:00 - 11:59
                          </div>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filterDepTimes.includes("afternoon")}
                          onChange={(e) =>
                            setFilterDepTimes((ft) =>
                              e.target.checked
                                ? [...ft, "afternoon"]
                                : ft.filter((f) => f !== "afternoon"),
                            )
                          }
                          className="form-checkbox h-4 w-4 text-emerald-600 border-gray-300 rounded"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            Afternoon
                          </div>
                          <div className="text-xs text-gray-500">
                            12:00 - 17:59
                          </div>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filterDepTimes.includes("evening")}
                          onChange={(e) =>
                            setFilterDepTimes((ft) =>
                              e.target.checked
                                ? [...ft, "evening"]
                                : ft.filter((f) => f !== "evening"),
                            )
                          }
                          className="form-checkbox h-4 w-4 text-emerald-600 border-gray-300 rounded"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            Evening
                          </div>
                          <div className="text-xs text-gray-500">
                            18:00 - 23:59
                          </div>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filterDepTimes.includes("night")}
                          onChange={(e) =>
                            setFilterDepTimes((ft) =>
                              e.target.checked
                                ? [...ft, "night"]
                                : ft.filter((f) => f !== "night"),
                            )
                          }
                          className="form-checkbox h-4 w-4 text-emerald-600 border-gray-300 rounded"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">Night</div>
                          <div className="text-xs text-gray-500">
                            00:00 - 05:59
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                  {/* Duration filter */}
                  <div>
                    <div className="font-semibold text-sm mb-2">
                      Max Duration (hrs)
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={1}
                        max={Math.ceil(maxDuration / 60)}
                        value={
                          filterMaxDuration !== null
                            ? Math.ceil(filterMaxDuration / 60)
                            : Math.ceil(maxDuration / 60)
                        }
                        onChange={(e) =>
                          setFilterMaxDuration(Number(e.target.value) * 60)
                        }
                        className="w-32"
                      />
                      <span className="ml-2 text-xs">
                        {filterMaxDuration !== null
                          ? Math.ceil(filterMaxDuration / 60)
                          : Math.ceil(maxDuration / 60)}
                        h
                      </span>
                    </div>
                  </div>
                  {/* Baggage filter */}
                  <div>
                    <div className="font-semibold text-sm mb-2">
                      Checked Baggage
                    </div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filterBaggage}
                        onChange={(e) => setFilterBaggage(e.target.checked)}
                      />{" "}
                      Show only flights with checked baggage
                    </label>
                  </div>
                </div>
                <div className="flex justify-between gap-4 mt-6 pt-4 border-t border-gray-200">
                  <button
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
                    onClick={() => {
                      setFilterStops([]);
                      setFilterAirlines([]);
                      setFilterDepTimes([]);
                      setFilterMaxDuration(null);
                      setFilterBaggage(false);
                    }}
                  >
                    Clear Filters
                  </button>
                  <button
                    className="px-6 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 shadow"
                    onClick={() => setFilterModalOpen(false)}
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Flight Results Section */}
          <h2 className="text-xl font-bold mb-4">
            Flight Offers ({filteredFlightOffers.length} found)
          </h2>
          {console.log(
            "Rendering flights:",
            paginatedFlightOffers.length,
            "offers",
          )}
          {paginatedFlightOffers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No flights found. Try adjusting your search criteria.
              </p>
            </div>
          ) : (
            <>
              {paginatedFlightOffers.map((offer) => {
                // The rawOffer is already the flight option from TTS
                const flightOption = offer.rawOffer as {
                  Segments?: TTSFlightSegment[][];
                  FareList?: TTSFare[];
                };
                console.log("Flight offer rawOffer:", flightOption);
                if (!flightOption) return null;

                const segmentsGroups = flightOption?.Segments || [];

                // Airline logos: collect unique airline codes from all segments
                const airlineCodes = Array.from(
                  new Set(
                    segmentsGroups.flatMap((seg) =>
                      seg.map((s) => s.Airline?.AirlineCode).filter(Boolean),
                    ),
                  ),
                );
                const airlineNames = Array.from(
                  new Set(
                    segmentsGroups.flatMap((seg) =>
                      seg.map((s) => s.Airline?.AirlineName).filter(Boolean),
                    ),
                  ),
                );

                // Get first and last segments for overall journey
                const firstSeg = segmentsGroups[0]?.[0];
                const lastSeg =
                  segmentsGroups[segmentsGroups.length - 1]?.[
                    segmentsGroups[segmentsGroups.length - 1].length - 1
                  ];

                const logoUrl =
                  offer.airline && offer.flightNumber
                    ? `https://content.airhex.com/content/logos/airlines_${offer.airline.toLowerCase()}_350_100_r.png?background=fff&pad=auto`
                    : "/placeholder.svg";
                const depTime = firstSeg?.Origin?.DepartTime
                  ? new Date(firstSeg.Origin.DepartTime).toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit" },
                    )
                  : "-";
                const arrTime = lastSeg?.Destination?.ArrivalTime
                  ? new Date(
                      lastSeg.Destination.ArrivalTime,
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-";
                const depCity = firstSeg?.Origin?.CityName || "-";
                const arrCity = lastSeg?.Destination?.CityName || "-";

                // Calculate total duration
                let totalDuration = "-";
                if (segmentsGroups.length > 0) {
                  const depDate = new Date(
                    firstSeg?.Origin?.DepartTime || new Date(),
                  );
                  const arrDate = new Date(
                    lastSeg?.Destination?.ArrivalTime || new Date(),
                  );
                  const diffMs = arrDate - depDate;
                  if (!isNaN(diffMs) && diffMs > 0) {
                    const diffMins = Math.floor(diffMs / 60000);
                    const hours = Math.floor(diffMins / 60);
                    const mins = diffMins % 60;
                    totalDuration = `${hours}h ${mins}m`;
                  }
                }

                // Stops
                let stopsText = "Non-stop";
                let stopoverCity = "";
                if (segmentsGroups.length > 1) {
                  stopsText = `${segmentsGroups.length - 1} stop${segmentsGroups.length > 2 ? "s" : ""}`;
                  stopoverCity = segmentsGroups
                    .slice(0, -1)
                    .flatMap((seg) => seg.map((s) => s.Destination.CityName))
                    .join(", ");
                }

                // Prices from FareList
                const fareList = flightOption?.FareList || [];
                const minFare =
                  fareList.length > 0
                    ? Math.min(
                        ...fareList.map(
                          (fare) =>
                            fare.OfferedPrice || fare.PublishedPrice || 0,
                        ),
                      )
                    : 0;
                const publishedPrice =
                  offer.price?.published || offer.price?.total || minFare;
                const offerPrice = offer.price?.offered || minFare;
                const showOffer = offerPrice && offerPrice < publishedPrice;
                // Fare badge
                const showPartnerBadge = showOffer;
                return (
                  <div
                    key={offer.id}
                    className="relative flex flex-col md:flex-row items-center justify-between bg-white rounded-2xl shadow-md p-6 mb-6 border border-gray-100 hover:shadow-lg transition-all duration-200 overflow-hidden group"
                  >
                    {/* Airline logo and info */}
                    <div className="flex flex-col items-center min-w-0 md:w-1/4 w-full mb-4 md:mb-0">
                      <div className="flex items-center gap-3 mb-3">
                        {airlineCodes.length > 0 ? (
                          airlineCodes.map((code, idx) => (
                            <div
                              key={code}
                              className="w-20 h-20 flex items-center justify-center bg-white rounded-xl border border-gray-200 shadow-sm p-0"
                            >
                              <img
                                src={`https://content.airhex.com/content/logos/airlines_${code.toLowerCase()}_350_100_r.png?background=fff&pad=auto`}
                                alt={airlineNames[idx] || code}
                                className="w-[72px] h-[72px] object-contain"
                                onError={(e) =>
                                  (e.currentTarget.src = "/placeholder.svg")
                                }
                              />
                            </div>
                          ))
                        ) : (
                          <div className="w-20 h-20 flex items-center justify-center bg-white rounded-xl border border-gray-200 shadow-sm p-0">
                            <img
                              src="/placeholder.svg"
                              alt="No airline"
                              className="w-[72px] h-[72px] object-contain"
                            />
                          </div>
                        )}
                      </div>
                      <div className="text-center min-w-0">
                        <div className="font-semibold text-sm text-gray-900 truncate">
                          {offer.airline}
                        </div>
                        <div className="text-xs text-gray-400">
                          {offer.flightNumber}
                        </div>
                      </div>
                    </div>
                    {/* Main flight info */}
                    <div className="flex flex-1 flex-col md:flex-row items-center justify-center gap-8 w-full md:w-3/5 ml-0 md:ml-8">
                      {/* Timeline for each route (onward, return) */}
                      <div className="flex flex-col gap-6 flex-1">
                        {segmentsGroups.map(
                          (segments: TTSFlightSegment[], groupIdx: number) => {
                            if (
                              !Array.isArray(segments) ||
                              segments.length === 0
                            )
                              return null;

                            // Each group represents a direction (onward/return)
                            const firstSeg = segments[0];
                            const lastSeg = segments[segments.length - 1];
                            const depTime = firstSeg?.Origin?.DepartTime
                              ? new Date(
                                  firstSeg.Origin.DepartTime,
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "-";
                            const arrTime = lastSeg?.Destination?.ArrivalTime
                              ? new Date(
                                  lastSeg.Destination.ArrivalTime,
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "-";
                            const depCity = firstSeg?.Origin?.CityName || "-";
                            const arrCity =
                              lastSeg?.Destination?.CityName || "-";

                            // Get total duration from API response
                            let totalDuration = "-";
                            if (segments.length > 0) {
                              // Use the TotalDuration from the first segment of this direction
                              const totalDurationMinutes =
                                firstSeg.TotalDuration;
                              if (
                                totalDurationMinutes &&
                                totalDurationMinutes > 0
                              ) {
                                const hours = Math.floor(
                                  totalDurationMinutes / 60,
                                );
                                const mins = totalDurationMinutes % 60;
                                totalDuration = `${hours}h ${mins}m`;
                              }
                            }

                            // Stops for this direction
                            let stopsText = "Non-stop";
                            let stopoverCity = "";
                            if (segments.length > 1) {
                              stopsText = `${segments.length - 1} stop${segments.length > 2 ? "s" : ""}`;
                              stopoverCity = segments
                                .slice(0, -1)
                                .map((seg) => seg.Destination.CityName)
                                .join(", ");
                            }

                            // Get airline info for this direction
                            const directionAirlineCodes = Array.from(
                              new Set(
                                segments
                                  .map((s) => s.Airline?.AirlineCode)
                                  .filter(Boolean),
                              ),
                            );
                            const directionAirlineNames = Array.from(
                              new Set(
                                segments
                                  .map((s) => s.Airline?.AirlineName)
                                  .filter(Boolean),
                              ),
                            );

                            return (
                              <div
                                key={groupIdx}
                                className="flex flex-col md:flex-row items-center gap-2 border-b last:border-b-0 pb-2"
                              >
                                <div className="flex flex-1 flex-col md:flex-row items-center justify-center gap-8 w-full">
                                  {/* Departure */}
                                  <div className="flex flex-col items-center min-w-0">
                                    <span className="font-bold text-lg text-gray-900 tracking-wide">
                                      {depTime}
                                    </span>
                                    <span className="text-xs text-gray-500 mt-1">
                                      {depCity}
                                    </span>
                                  </div>
                                  {/* Timeline and stops */}
                                  <div className="flex flex-col items-center min-w-0">
                                    <span className="font-semibold text-base text-gray-700">
                                      {totalDuration}
                                    </span>
                                    <div className="flex flex-col items-center mt-1">
                                      <span className="w-20 h-1 bg-emerald-200 rounded-full mb-1" />
                                      <span className="text-xs text-gray-500 text-center">
                                        {stopsText}
                                        {stopoverCity && ` via ${stopoverCity}`}
                                      </span>
                                    </div>
                                  </div>
                                  {/* Arrival */}
                                  <div className="flex flex-col items-center min-w-0">
                                    <span className="font-bold text-lg text-gray-900 tracking-wide">
                                      {arrTime}
                                    </span>
                                    <span className="text-xs text-gray-500 mt-1">
                                      {arrCity}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          },
                        )}
                      </div>
                    </div>
                    {/* Divider for desktop */}
                    <div className="hidden md:block h-16 w-px bg-gray-100 mx-8" />
                    {/* Price and actions */}
                    <div className="flex flex-col items-end md:w-1/5 w-full mt-4 md:mt-0">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-2xl font-bold text-gray-900">
                          ₹{publishedPrice.toLocaleString()}
                        </span>
                        {showOffer && (
                          <span className="text-emerald-700 font-semibold text-base">
                            Offer ₹{offerPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      {showPartnerBadge && (
                        <span className="bg-pink-600 text-white text-xs rounded-full px-3 py-1 mb-3">
                          PARTNER EXCLUSIVE RATE
                        </span>
                      )}
                      <div className="flex flex-col gap-2 w-full">
                        <a
                          href="#"
                          className="block text-blue-600 font-normal hover:underline text-center text-[11px]"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedFlight(offer);
                            setDetailsModalOpen(true);
                          }}
                        >
                          View Details
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
          {/* View more button */}
          {visibleCount < filteredFlightOffers.length && (
            <div className="flex justify-center mt-4">
              <button
                className="px-6 py-2 border border-emerald-600 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-50 transition"
                onClick={() => setVisibleCount((c) => c + 10)}
              >
                View more flight options
              </button>
            </div>
          )}
        </div>
      )}
      {/* Flight Details Modal */}
      <FlightDetailsModal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        flight={selectedFlight}
        searchParams={searchParams}
        onFlightSelect={onFlightSelect}
        fareRule={fareRule}
        fareRuleLoading={fareRuleLoading}
      />
    </div>
  );
};

export default FlightSearch;
