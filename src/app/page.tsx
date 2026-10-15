"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { 
  Heart, Zap, Utensils, Tv, Home, Map,
  Briefcase, GraduationCap, Lock, Building2, 
  Clock, Award, Wrench, Fuel, Droplets, ZoomOut, ZoomIn, FileText
} from "lucide-react";

// Self-contained Supabase client (No broken @/lib/supabase path!)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

type AreaName = "Oshodi" | "Berger" | "Yaba" | "Surulere" | "Lekki";

const AREA_COORDS: Record<AreaName, number> = {
  Berger: 1,
  Oshodi: 2,
  Yaba: 3,
  Surulere: 4,
  Lekki: 6,
};

export default function LagosEmpireMapSimulator() {
  const [isCreated, setIsCreated] = useState(false);
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");

  // 15-MINUTE LIVE CLOCK, 8-WEEK RENT CYCLE & WEATHER
  const [gameHour, setGameHour] = useState(8);
  const [gameMinute, setGameMinute] = useState(0);
  const [gameDay, setGameDay] = useState(1);
  const [gameWeek, setGameWeek] = useState(1);
  const [weeksUntilRentDue, setWeeksUntilRentDue] = useState(8);
  const [weather, setWeather] = useState("Sunny 32°C");

  // CENTRAL BANK 300M RESERVE & DUAL WALLETS
  const [centralBankReserve, setCentralBankReserve] = useState(300000000);
  const [starterBalance, setStarterBalance] = useState(50000);
  const [earnedBalance, setEarnedBalance] = useState(0);

  // PLAYER LOCATION, MAP ZOOM & SURVIVAL STATS
  const [area, setArea] = useState<AreaName>("Oshodi");
  const [isMapZoomedOut, setIsMapZoomedOut] = useState(false);
  const [selectedMapBuilding, setSelectedMapBuilding] = useState<string>("None");
  const [health, setHealth] = useState(90);
  const [energy, setEnergy] = useState(70);
  const [hunger, setHunger] = useState(80);
  const [steeze, setSteeze] = useState(5);

  // TIMERS ENGINE
  const [timers, setTimers] = useState<Record<string, number>>({});
  const startCooldown = (key: string, seconds: number) => {
    setTimers((prev) => ({ ...prev, [key]: seconds }));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        const next: Record<string, number> = {};
        for (const k in prev) {
          if (prev[k] > 1) next[k] = prev[k] - 1;
        }
        return next;
      });

      setGameMinute((m) => {
        if (m < 45) return m + 15;
        setGameHour((h) => {
          const nextH = h >= 23 ? 0 : h + 1;
          if (nextH >= 20 || nextH <= 5) setWeather("Warm Night");
          else if (nextH === 14 || nextH === 15) setWeather("Heavy Lagos Rain");
          else if (nextH >= 6 && nextH <= 10) setWeather("Harmattan Haze");
          else setWeather("Sunny 32°C");

          if (h >= 23) {
            setGameDay((d) => {
              const nd = d + 1;
              if (nd % 7 === 0) {
                setGameWeek((w) => w + 1);
                setWeeksUntilRentDue((r) => Math.max(0, r - 1));
              }
              return nd;
            });
          }
          return nextH;
        });

        setHunger((prevH) => Math.max(0, prevH - 4));
        setEnergy((prevE) => Math.max(0, prevE - 3));
        return 0;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const formatSecs = (s?: number) => {
    if (!s || s <= 0) return "0s";
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}h ${m}m ${sec}s`;
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
  };

  // HOUSING & LANDLORD STATE
  const [shelterType, setShelterType] = useState("Unpainted Single Room");
  const [shelterArea, setShelterArea] = useState<AreaName>("Oshodi");
  const [ownershipMode, setOwnershipMode] = useState<"Rented" | "Bought_Owned">("Rented");
  const [rentPer8Weeks, setRentPer8Weeks] = useState(80000);
  const [parkingSlots, setParkingSlots] = useState(0);
  const [bedTier, setBedTier] = useState("Bare_Floor");
  const [chairTier, setChairTier] = useState("None");
  const [tvTier, setTvTier] = useState("None");
  const [hasCookingStove, setHasCookingStove] = useState(false);
  const [gasLevel, setGasLevel] = useState(0);
  const [rawFoodServings, setRawFoodServings] = useState(0);

  const [ownedProperties, setOwnedProperties] = useState<{
    name: string;
    area: AreaName;
    roomsAvailable: number;
    listedPricePerRoom: number;
    isListedWithAgent: boolean;
  }[]>([]);
  const [customRoomRentInput, setCustomRoomRentInput] = useState("250000");
  const [rawLandsOwned, setRawLandsOwned] = useState<AreaName[]>([]);
  const [architectPlans, setArchitectPlans] = useState<string[]>([]);

  // DRIVING LICENSE & CAR MAINTENANCE
  const [hasDriversLicense, setHasDriversLicense] = useState(false);
  const [drivingLessonsDone, setDrivingLessonsDone] = useState(0);
  const [carsOwned, setCarsOwned] = useState<string[]>([]);
  const [activeCar, setActiveCar] = useState<string>("None");
  const [carPetrol, setCarPetrol] = useState(80);
  const [carRadiatorWater, setCarRadiatorWater] = useState(90);
  const [carEngineHealth, setCarEngineHealth] = useState(100);

  // EDUCATION & BLUEPRINTS
  const [education, setEducation] = useState("Uneducated");
  const [professionalCerts, setProfessionalCerts] = useState<string[]>([]);
  const [certificatesList, setCertificatesList] = useState<string[]>([]);
  const [enrolledProgram, setEnrolledProgram] = useState<{
    name: string;
    totalClasses: number;
    completedClasses: number;
  } | null>(null);
  const [ownedBlueprints, setOwnedBlueprints] = useState<string[]>([]);
  const [companyName, setCompanyName] = useState("");
  const [activeBusinesses, setActiveBusinesses] = useState<{
    name: string;
    area: AreaName;
    maxStaff: number;
    hiredStaff: number;
    maxCustomers: number;
    revenuePerCycle: number;
  }[]>([]);

  const [activeTab, setActiveTab] = useState<"map" | "home" | "jobs" | "school" | "empire" | "profile">("map");
  const [logMessage, setLogMessage] = useState(
    "v2.0 LIVE: You are in Oshodi! Use 'Zoom Out' on the Map to travel across Lagos. You can only view buildings in the Area you are standing in."
  );

  const spendMoney = (cost: number): boolean => {
    const total = starterBalance + earnedBalance;
    if (total < cost) {
      setLogMessage(`❌ Insufficient funds! You need ${cost.toLocaleString()} g₦.`);
      return false;
    }
    if (starterBalance >= cost) {
      setStarterBalance((prev) => prev - cost);
    } else {
      const rem = cost - starterBalance;
      setStarterBalance(0);
      setEarnedBalance((prev) => prev - rem);
    }
    return true;
  };

  const getTransportCosts = (dest: AreaName) => {
    const dist = Math.abs(AREA_COORDS[area] - AREA_COORDS[dest]) || 1;
    const rainMult = weather === "Heavy Lagos Rain" ? 1.5 : 1;
    return {
      dist,
      busCost: Math.round(1500 * dist * rainMult),
      cabCost: Math.round(3500 * dist * rainMult),
      trekEnergy: Math.min(50, 15 * dist),
      petrolUsed: 8 * dist,
      waterUsed: 6 * dist,
      wearTear: 4 * dist,
    };
  };

  const handleDriveCarTo = (dest: AreaName) => {
    if (activeCar === "None") return setLogMessage("❌ You don't have an active car!");
    if (!hasDriversLicense) return setLogMessage("🚓 FRSC BLOCKED: Get your Driver's License at Oshodi Driving School first!");
    const costs = getTransportCosts(dest);
    if (carPetrol < costs.petrolUsed) return setLogMessage(`⛽ Low Petrol (${carPetrol}%)! Refill at a Filling Station.`);
    if (carRadiatorWater < costs.waterUsed) return setLogMessage(`💧 Low Radiator Water (${carRadiatorWater}%)! Add water first.`);
    if (carEngineHealth < 30) return setLogMessage(`🔧 Engine health critical (${carEngineHealth}%)! Visit Oshodi Mechanic.`);

    startCooldown("commute", 15);
    setCarPetrol((p) => Math.max(0, p - costs.petrolUsed));
    setCarRadiatorWater((w) => Math.max(0, w - costs.waterUsed));
    setCarEngineHealth((h) => Math.max(0, h - costs.wearTear));
    setArea(dest);
    setSelectedMapBuilding("None");
    setIsMapZoomedOut(false);
    setLogMessage(`🚗 Drove ${activeCar} to ${dest}!`);
  };

  if (!isCreated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border-2 border-emerald-500/60 rounded-2xl p-6 shadow-2xl">
          <div className="inline-block px-3 py-1 bg-emerald-500 text-slate-950 text-xs font-extrabold rounded-full mb-3">
            ✓ V2.0 AREA-LOCKED MAP ENGINE LIVE
          </div>
          <h1 className="text-2xl font-extrabold mb-2">Lagos Empire Simulator</h1>
          <p className="text-slate-400 text-sm mb-6">
            Start in Oshodi with 50,000 g₦. Travel area-by-area on the Map, earn your FRSC Driver&apos;s License, maintain your car&apos;s petrol &amp; water, and build kiosks, eateries, or estates.
          </p>
          <input
            type="text"
            placeholder="Enter Citizen Name (e.g., Ayodeji)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white mb-4 text-sm"
          />
          <div className="grid grid-cols-2 gap-3 mb-6">
            {(["male", "female"] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`py-3 rounded-xl font-bold capitalize border text-sm ${
                  gender === g ? "bg-emerald-600/20 border-emerald-500 text-emerald-300" : "bg-slate-950 border-slate-800 text-slate-400"
                }`}
              >
                {g === "male" ? "👨🏾 Male" : "👩🏾 Female"}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              if (!username.trim()) return alert("Please enter your name!");
              setIsCreated(true);
            }}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl text-sm"
          >
            Launch Lagos Map (50,000 g₦ Stipend)
          </button>
        </div>
      </div>
    );
  }

  const areaBuildingsMap: Record<AreaName, { id: string; icon: string; name: string; desc: string }[]> = {
    Oshodi: [
      { id: "Driving_School", icon: "🪪", name: "FRSC & Driving School", desc: "Get Driver's License" },
      { id: "Mechanic_Shop", icon: "🔧", name: "Oshodi Mechanic & Water", desc: "Fix Car & Radiator Water" },
      { id: "Agent_Office", icon: "🏘️", name: "Oshodi Estate Agent Office", desc: "Rent/Buy or List Rooms" },
      { id: "Gas_Kitchen_Shop", icon: "🔥", name: "Oshodi Market & Gas Depot", desc: "Stove, Gas & Raw Food" },
    ],
    Berger: [
      { id: "Auto_Dealership", icon: "🚗", name: "Berger Motor Dealership", desc: "Buy 8 Car Models" },
      { id: "Filling_Station", icon: "⛽", name: "NNPC Filling Station", desc: "Buy Petrol & Water" },
      { id: "Builder_Yard", icon: "🏗️", name: "Julius Berger Construction", desc: "Hire Builders (2h-8h)" },
      { id: "Agent_Office", icon: "🏘️", name: "Berger Estate Agent Office", desc: "Rent/Buy or List Rooms" },
      { id: "Furniture_Shop", icon: "🛏️", name: "Berger Mattress & Sofa Depot", desc: "Furnish Your Home" },
    ],
    Yaba: [
      { id: "Academic_Campus", icon: "🎓", name: "Yaba Poly, Uni & PhD Campus", desc: "ND, HND, BSc, MSc, PhD" },
      { id: "Blueprint_Academy", icon: "📘", name: "Blueprint & Pro Cert Institute", desc: "Kiosk/Eatery BPs & ICAN/PMP" },
      { id: "Architect_Firm", icon: "📐", name: "Yaba Architectural Studio", desc: "Draw House Plans for Land" },
      { id: "Electronics_Shop", icon: "📺", name: "Yaba Tech & TV Plaza", desc: "Buy TV Tiers" },
      { id: "Agent_Office", icon: "🏘️", name: "Yaba Estate Agent Office", desc: "Rent/Buy or List Rooms" },
    ],
    Surulere: [
      { id: "CAC_Office", icon: "🏛️", name: "CAC Corporate Registry", desc: "Register Company" },
      { id: "Agent_Office", icon: "🏘️", name: "Surulere Estate Agent Office", desc: "Rent/Buy or List Rooms" },
    ],
    Lekki: [
      { id: "Lands_Bureau", icon: "📜", name: "Lekki Lands Bureau & C-of-O", desc: "Buy Raw Land & C-of-O" },
      { id: "Academic_Campus", icon: "✈️", name: "Foreign Embassy (Abroad MSc/PhD)", desc: "Study Abroad" },
      { id: "Agent_Office", icon: "🏰", name: "Lekki Luxury Estate Agent", desc: "Rent/Buy Duplexes & List" },
      { id: "Filling_Station", icon: "⛽", name: "Lekki Fuel & Water Station", desc: "Petrol & Radiator Water" },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-28">
      <header className="bg-slate-900/95 backdrop-blur border-b border-slate-800 sticky top-0 z-30 px-4 py-2.5">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-xl">
              {gender === "male" ? "👨🏾" : "👩🏾"}
            </div>
            <div>
              <div className="font-bold text-sm flex flex-wrap items-center gap-1.5">
                {username}
                <span className="text-[11px] px-2 py-0.5 bg-amber-500 text-slate-950 font-extrabold rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Wk {gameWeek} • Day {gameDay} • {String(gameHour).padStart(2, "0")}:{String(gameMinute).padStart(2, "0")}
                </span>
                <span className="text-[11px] px-2 py-0.5 bg-slate-800 text-cyan-300 rounded-full">{weather}</span>
                <span className="text-[11px] px-2 py-0.5 bg-rose-950 text-rose-300 border border-rose-700 rounded-full">
                  Rent Due: {weeksUntilRentDue} Wks
                </span>
              </div>
              <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2 mt-0.5">
                <span className="text-emerald-400 font-extrabold">📍 Standing In: {area}</span>
                • 🏠 Home: {shelterType} ({shelterArea}) • 🪪 License: {hasDriversLicense ? "Verified" : "None"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
              <div className="text-[10px] text-slate-400 uppercase">Starter / Deposit</div>
              <div className="font-extrabold text-sm text-amber-400">{starterBalance.toLocaleString()} g₦</div>
            </div>
            <div className="bg-slate-950 border border-emerald-900/60 rounded-xl px-3 py-1.5">
              <div className="text-[10px] text-emerald-400 uppercase flex items-center gap-1">
                Withdrawable <Lock className="w-2.5 h-2.5" />
              </div>
              <div className="font-extrabold text-sm text-emerald-400">{earnedBalance.toLocaleString()} g₦</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 bg-slate-900 border border-slate-800 rounded-2xl p-3">
          <StatBar icon={<Heart className="w-3.5 h-3.5 text-rose-400" />} label="Health" value={`${health}%`} pct={health} color="bg-rose-500" />
          <StatBar icon={<Zap className="w-3.5 h-3.5 text-amber-400" />} label="Energy" value={`${energy}%`} pct={energy} color="bg-amber-500" />
          <StatBar icon={<Utensils className="w-3.5 h-3.5 text-orange-400" />} label="Belly" value={`${hunger}%`} pct={hunger} color="bg-orange-500" />
          <StatBar icon={<Fuel className="w-3.5 h-3.5 text-emerald-400" />} label="Car Petrol" value={activeCar === "None" ? "N/A" : `${carPetrol}%`} pct={carPetrol} color="bg-emerald-500" />
          <StatBar icon={<Droplets className="w-3.5 h-3.5 text-cyan-400" />} label="Radiator H2O" value={activeCar === "None" ? "N/A" : `${carRadiatorWater}%`} pct={carRadiatorWater} color="bg-cyan-500" />
          <StatBar icon={<Wrench className="w-3.5 h-3.5 text-purple-400" />} label="Car Engine" value={activeCar === "None" ? "N/A" : `${carEngineHealth}%`} pct={carEngineHealth} color="bg-purple-500" />
        </div>

        <div className="bg-emerald-950/40 border border-emerald-800/60 text-emerald-200 px-4 py-2.5 rounded-xl text-sm font-medium">
          🔔 {logMessage}
        </div>

        {/* TAB 1: LAGOS MAP */}
        {activeTab === "map" && (
          <div className="space-y-4 text-xs">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-extrabold text-base text-white">
                  🗺️ {isMapZoomedOut ? "Lagos State Overview Map (5 Areas)" : `${area} Street Map (Zoomed In)`}
                </h2>
                <p className="text-slate-400 text-[11px]">
                  {isMapZoomedOut
                    ? "Travel to an Area to unlock its buildings! Fog-of-War hides areas you aren't standing in."
                    : `Showing places inside ${area}. Click 'Zoom Out' to travel to Berger, Yaba, Surulere, or Lekki!`}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsMapZoomedOut(!isMapZoomedOut);
                  setSelectedMapBuilding("None");
                }}
                className="px-4 py-2.5 bg-amber-500 text-slate-950 font-extrabold rounded-xl flex items-center gap-1.5"
              >
                {isMapZoomedOut ? <ZoomIn className="w-4 h-4" /> : <ZoomOut className="w-4 h-4" />}
                {isMapZoomedOut ? `Zoom In to ${area}` : "Zoom Out: View All Lagos Areas"}
              </button>
            </div>

            {isMapZoomedOut ? (
              <div className="grid sm:grid-cols-5 gap-3">
                {(["Berger", "Oshodi", "Yaba", "Surulere", "Lekki"] as AreaName[]).map((dest) => {
                  const isCurrent = area === dest;
                  const costs = getTransportCosts(dest);
                  const hasHouseHere = shelterArea === dest || ownedProperties.some((p) => p.area === dest);
                  return (
                    <div
                      key={dest}
                      className={`p-4 rounded-2xl border-2 flex flex-col justify-between space-y-3 ${
                        isCurrent ? "bg-emerald-950/40 border-emerald-400" : "bg-slate-900 border-slate-800"
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-base text-white">📍 {dest}</span>
                          {hasHouseHere && <span className="text-[10px] bg-indigo-600 px-2 py-0.5 rounded-full">🏠 My House</span>}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {isCurrent ? "✅ You are here." : "🔒 Travel here to view buildings in this area."}
                        </p>
                      </div>

                      {isCurrent ? (
                        <button onClick={() => setIsMapZoomedOut(false)} className="w-full py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-xl">
                          Explore {dest}
                        </button>
                      ) : (
                        <div className="space-y-1.5 pt-2 border-t border-slate-800">
                          <button
                            onClick={() => {
                              if (energy < costs.trekEnergy) return setLogMessage("⚠️ Too tired to trek!");
                              setEnergy((e) => Math.max(0, e - costs.trekEnergy));
                              setArea(dest);
                              setIsMapZoomedOut(false);
                              setLogMessage(`🚶🏾‍♂️ Trekked to ${dest}!`);
                            }}
                            className="w-full py-1.5 bg-slate-800 rounded-lg text-[10px]"
                          >
                            🚶🏾‍♂️ Trek (₦0 • -{costs.trekEnergy}% En)
                          </button>
                          <button
                            onClick={() => {
                              if (!spendMoney(costs.busCost)) return;
                              setArea(dest);
                              setIsMapZoomedOut(false);
                              setLogMessage(`🚐 Took Danfo Bus to ${dest} (-${costs.busCost.toLocaleString()} g₦).`);
                            }}
                            className="w-full py-1.5 bg-amber-500/20 border border-amber-500 text-amber-300 font-bold rounded-lg text-[10px]"
                          >
                            🚐 Bus ({costs.busCost.toLocaleString()} g₦)
                          </button>
                          <button
                            onClick={() => {
                              if (!spendMoney(costs.cabCost)) return;
                              setArea(dest);
                              setIsMapZoomedOut(false);
                              setLogMessage(`🚕 Took Cab to ${dest} (-${costs.cabCost.toLocaleString()} g₦).`);
                            }}
                            className="w-full py-1.5 bg-indigo-600 text-white font-bold rounded-lg text-[10px]"
                          >
                            🚕 Cab ({costs.cabCost.toLocaleString()} g₦)
                          </button>
                          {activeCar !== "None" && (
                            <button
                              onClick={() => handleDriveCarTo(dest)}
                              className="w-full py-1.5 bg-emerald-600 text-white font-extrabold rounded-lg text-[10px]"
                            >
                              🚗 Drive {activeCar}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {shelterArea === area && (
                    <button
                      onClick={() => setActiveTab("home")}
                      className="p-3.5 rounded-2xl border-2 border-emerald-400 bg-emerald-950/50 text-center flex flex-col items-center justify-center gap-1"
                    >
                      <span className="text-3xl">🏠</span>
                      <span className="font-extrabold text-xs text-emerald-300">My Home ({shelterType})</span>
                      <span className="text-[10px] text-white">Click to Enter Home</span>
                    </button>
                  )}

                  {areaBuildingsMap[area].map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setSelectedMapBuilding(b.id)}
                      className={`p-3.5 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                        selectedMapBuilding === b.id ? "bg-indigo-950/80 border-indigo-400" : "bg-slate-900 border-slate-800"
                      }`}
                    >
                      <span className="text-3xl">{b.icon}</span>
                      <span className="font-extrabold text-xs text-white">{b.name}</span>
                      <span className="text-[10px] text-slate-400">{b.desc}</span>
                    </button>
                  ))}
                </div>

                {selectedMapBuilding === "Driving_School" && (
                  <div className="p-4 bg-slate-900 border border-emerald-500/40 rounded-2xl space-y-3">
                    <h3 className="font-extrabold text-sm text-emerald-400">🪪 Oshodi Driving School & FRSC License</h3>
                    <div className="flex flex-wrap gap-3">
                      <button
                        disabled={drivingLessonsDone >= 3}
                        onClick={() => {
                          if (spendMoney(25000)) {
                            setDrivingLessonsDone((d) => d + 1);
                            setLogMessage(`🚗 Completed Driving Lesson ${drivingLessonsDone + 1}/3!`);
                          }
                        }}
                        className="px-4 py-2 bg-amber-500 text-slate-950 font-extrabold rounded-xl disabled:opacity-40"
                      >
                        {drivingLessonsDone >= 3 ? "✓ 3/3 Lessons Done" : `Take Driving Lesson (${drivingLessonsDone}/3) - 25k g₦`}
                      </button>
                      <button
                        disabled={hasDriversLicense || drivingLessonsDone < 3}
                        onClick={() => {
                          if (spendMoney(45000)) {
                            setHasDriversLicense(true);
                            setCertificatesList((c) => [...c, "FRSC Official Driver's License"]);
                            setLogMessage("🪪 FRSC Driver's License Issued!");
                          }
                        }}
                        className="px-4 py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-xl disabled:opacity-40"
                      >
                        {hasDriversLicense ? "✓ Licensed" : "Get FRSC License (45k g₦)"}
                      </button>
                    </div>
                  </div>
                )}

                {selectedMapBuilding === "Mechanic_Shop" && (
                  <div className="p-4 bg-slate-900 border border-purple-500/40 rounded-2xl flex flex-wrap gap-3">
                    <button onClick={() => { if (spendMoney(35000)) { setCarEngineHealth(100); setLogMessage("🔧 Engine fixed to 100%!"); }}} className="px-4 py-2 bg-purple-600 text-white font-bold rounded-xl">🔧 Fix Car Engine (35k)</button>
                    <button onClick={() => { if (spendMoney(3000)) { setCarRadiatorWater(100); setLogMessage("💧 Radiator Water filled to 100%!"); }}} className="px-4 py-2 bg-cyan-600 text-white font-bold rounded-xl">💧 Fill Radiator Water (3k)</button>
                  </div>
                )}

                {selectedMapBuilding === "Filling_Station" && (
                  <div className="p-4 bg-slate-900 border border-emerald-500/40 rounded-2xl flex flex-wrap gap-3">
                    <button onClick={() => { if (spendMoney(18000)) { setCarPetrol(100); setLogMessage("⛽ Petrol Tank Filled to 100%!"); }}} className="px-4 py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-xl">⛽ Buy Full Tank Petrol (18k)</button>
                    <button onClick={() => { if (spendMoney(2000)) { setCarRadiatorWater(100); setLogMessage("💧 Added Radiator Water!"); }}} className="px-4 py-2 bg-cyan-500 text-slate-950 font-extrabold rounded-xl">💧 Add Radiator Water (2k)</button>
                  </div>
                )}

                {selectedMapBuilding === "Auto_Dealership" && (
                  <div className="p-4 bg-slate-900 border border-emerald-500/40 rounded-2xl space-y-3">
                    <h3 className="font-extrabold text-sm text-emerald-400">🚗 Berger Auto Dealership (Requires Driver&apos;s License &amp; Parking)</h3>
                    <div className="grid sm:grid-cols-4 gap-2.5">
                      {[
                        { name: "Tokunbo Corolla", cost: 1350000 },
                        { name: "Honda Accord", cost: 1950000 },
                        { name: "Lexus RX350", cost: 3200000 },
                        { name: "Mercedes C300", cost: 4500000 },
                        { name: "Land Cruiser Prado", cost: 6200000 },
                        { name: "Mercedes G-Wagon", cost: 9500000 },
                        { name: "Lamborghini Urus", cost: 14000000 },
                      ].map((c, i) => (
                        <div key={i} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                          <div className="font-bold">{c.name}</div>
                          <div className="text-emerald-400 font-bold">{c.cost.toLocaleString()} g₦</div>
                          <button
                            onClick={() => {
                              if (!hasDriversLicense) return setLogMessage("❌ Get your Driver's License in Oshodi first!");
                              if (carsOwned.length >= parkingSlots) return setLogMessage("❌ No free parking slots! Rent/Buy a flat or duplex at the Estate Agent.");
                              if (spendMoney(c.cost)) {
                                setCarsOwned((p) => [...p, c.name]);
                                setActiveCar(c.name);
                                setCertificatesList((cert) => [...cert, `Car: ${c.name}`]);
                                setLogMessage(`🏎️ Bought ${c.name}!`);
                              }
                            }}
                            className="w-full py-1.5 bg-emerald-500 text-slate-950 font-extrabold rounded-lg"
                          >
                            Buy Car
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedMapBuilding === "Agent_Office" && (
                  <div className="p-4 bg-slate-900 border border-cyan-500/40 rounded-2xl space-y-4">
                    <h3 className="font-extrabold text-sm text-cyan-400">🏘️ {area} Estate Agent (Rent Every 8 Weeks vs Buy Outright vs List Rooms)</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        { name: `${area} Self-Contain`, park: 1, rooms: 1, rent: 180000, buy: 12000000 },
                        { name: `${area} 2-Bedroom Flat`, park: 2, rooms: 2, rent: 380000, buy: 22000000 },
                        { name: `${area} 3-Bedroom Flat`, park: 3, rooms: 3, rent: 720000, buy: 36000000 },
                        { name: `${area} 5-Bed Luxury Duplex`, park: 5, rooms: 5, rent: 1850000, buy: 65000000 },
                      ].map((p, i) => (
                        <div key={i} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                          <div className="font-bold text-white">{p.name} (🅿️ {p.park} Parking • 🛏️ {p.rooms} Rooms)</div>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => {
                                if (spendMoney(p.rent)) {
                                  setShelterType(p.name);
                                  setShelterArea(area);
                                  setOwnershipMode("Rented");
                                  setRentPer8Weeks(p.rent);
                                  setWeeksUntilRentDue(8);
                                  setParkingSlots(p.park);
                                  setLogMessage(`🔑 Rented ${p.name} in ${area} for 8 Weeks!`);
                                }
                              }}
                              className="py-1.5 bg-cyan-600 text-white font-bold rounded-lg"
                            >
                              Rent / 8Wks ({(p.rent / 1000).toFixed(0)}k)
                            </button>
                            <button
                              onClick={() => {
                                if (spendMoney(p.buy)) {
                                  setShelterType(p.name);
                                  setShelterArea(area);
                                  setOwnershipMode("Bought_Owned");
                                  setParkingSlots(p.park);
                                  setOwnedProperties((prev) => [
                                    ...prev,
                                    { name: p.name, area, roomsAvailable: Math.max(1, p.rooms - 1), listedPricePerRoom: 250000, isListedWithAgent: false },
                                  ]);
                                  setCertificatesList((c) => [...c, `House Deed: ${p.name}`]);
                                  setLogMessage(`🏰 BOUGHT ${p.name}! List spare rooms below.`);
                                }
                              }}
                              className="py-1.5 bg-amber-500 text-slate-950 font-extrabold rounded-lg"
                            >
                              Buy ({(p.buy / 1000000).toFixed(0)}M g₦)
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* LANDLORD SUB-LETTING FORM */}
                    <div className="p-3 bg-indigo-950/30 border border-indigo-600 rounded-xl space-y-2">
                      <div className="font-extrabold text-indigo-300">📄 Landlord Room-Renting Agent Form</div>
                      {ownedProperties.length === 0 ? (
                        <p className="text-slate-400">Buy a house outright (or build one on raw land) to list rooms for rent here!</p>
                      ) : (
                        ownedProperties.map((op, idx) => (
                          <div key={idx} className="flex flex-wrap items-center justify-between gap-2 bg-slate-950 p-2.5 rounded-xl">
                            <span>{op.name} ({op.roomsAvailable} Rooms)</span>
                            <div className="flex gap-2">
                              <input
                                type="number"
                                value={customRoomRentInput}
                                onChange={(e) => setCustomRoomRentInput(e.target.value)}
                                className="w-28 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                              />
                              <button
                                onClick={() => {
                                  const rentVal = Number(customRoomRentInput) || 250000;
                                  const net = Math.floor(rentVal * op.roomsAvailable * 0.9);
                                  setEarnedBalance((e) => e + net);
                                  setLogMessage(`🏘️ Agent rented out ${op.roomsAvailable} rooms and paid you +${net.toLocaleString()} g₦!`);
                                }}
                                className="px-3 py-1 bg-emerald-500 text-slate-950 font-extrabold rounded"
                              >
                                List & Collect Rent
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {selectedMapBuilding === "Blueprint_Academy" && (
                  <div className="p-4 bg-slate-900 border border-emerald-500/40 rounded-2xl space-y-3">
                    <h3 className="font-extrabold text-sm text-emerald-400">📘 Yaba Tiered Blueprints (Kiosk vs Eatery vs Mega) & Pro Courses</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        {[
                          { id: "BP_Food_Kiosk", name: "🏪 Roadside Food Kiosk BP (2 Staff Cap)", cost: 400000 },
                          { id: "BP_Small_Eatery", name: "🍲 Small Eatery BP (6 Staff Cap)", cost: 900000 },
                          { id: "BP_Mega_Rest", name: "🏢 Mega Fast-Food Restaurant BP (15 Staff Cap)", cost: 1800000 },
                          { id: "BP_Poster_Kiosk", name: "🖨️ Small Digital Poster Kiosk BP", cost: 850000 },
                        ].map((bp) => (
                          <button
                            key={bp.id}
                            onClick={() => {
                              if (spendMoney(bp.cost)) {
                                setOwnedBlueprints((p) => [...p, bp.id]);
                                setCertificatesList((c) => [...c, bp.name]);
                                setLogMessage(`📘 Purchased ${bp.name}!`);
                              }
                            }}
                            className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg flex justify-between font-bold"
                          >
                            <span>{bp.name}</span>
                            <span className="text-amber-400">{(bp.cost / 1000).toFixed(0)}k g₦</span>
                          </button>
                        ))}
                      </div>
                      <div className="space-y-1.5">
                        {[
                          { id: "ICAN", name: "📊 ICAN Chartered Accountant", cost: 350000 },
                          { id: "PMP", name: "📋 PMP Project Manager", cost: 420000 },
                          { id: "CISCO", name: "🌐 CISCO Network Engineer", cost: 500000 },
                        ].map((pc) => (
                          <button
                            key={pc.id}
                            onClick={() => {
                              if (spendMoney(pc.cost)) {
                                setProfessionalCerts((p) => [...p, pc.id]);
                                setCertificatesList((c) => [...c, pc.name]);
                                setLogMessage(`🏅 Certified in ${pc.name}!`);
                              }
                            }}
                            className="w-full p-2 bg-slate-950 border border-cyan-800 rounded-lg flex justify-between font-bold"
                          >
                            <span>{pc.name}</span>
                            <span className="text-cyan-400">{(pc.cost / 1000).toFixed(0)}k g₦</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedMapBuilding === "Academic_Campus" && (
                  <div className="p-4 bg-slate-900 border border-amber-500/40 rounded-2xl grid sm:grid-cols-3 gap-2.5">
                    {[
                      { name: "Polytechnic ND", cost: 220000, classes: 6 },
                      { name: "Polytechnic HND", cost: 350000, classes: 6 },
                      { name: "University B.Sc", cost: 680000, classes: 8 },
                      { name: "Masters (M.Sc)", cost: 1400000, classes: 8 },
                      { name: "Doctorate (Ph.D)", cost: 2800000, classes: 10 },
                    ].map((d, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          if (spendMoney(d.cost)) {
                            setEnrolledProgram({ name: d.name, totalClasses: d.classes, completedClasses: 0 });
                            setActiveTab("school");
                            setLogMessage(`🎓 Enrolled in ${d.name}!`);
                          }
                        }}
                        className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-left"
                      >
                        <div className="font-bold text-white">{d.name}</div>
                        <div className="text-amber-400 font-bold">{d.cost.toLocaleString()} g₦ ({d.classes} Lectures)</div>
                      </button>
                    ))}
                  </div>
                )}

                {selectedMapBuilding === "Lands_Bureau" && (
                  <div className="p-4 bg-slate-900 border border-amber-500/40 rounded-2xl flex flex-wrap gap-2">
                    {(["Oshodi", "Berger", "Yaba", "Surulere", "Lekki"] as AreaName[]).map((loc) => (
                      <button
                        key={loc}
                        onClick={() => {
                          if (spendMoney(2500000)) {
                            setRawLandsOwned((r) => [...r, loc]);
                            setCertificatesList((c) => [...c, `Raw Land & C-of-O (${loc})`]);
                            setLogMessage(`📜 Bought Raw Land in ${loc}! Now visit Yaba Architect & Berger Builders.`);
                          }
                        }}
                        className="px-3 py-2 bg-amber-500 text-slate-950 font-extrabold rounded-xl"
                      >
                        Buy Raw Land in {loc} (2.5M g₦)
                      </button>
                    ))}
                  </div>
                )}

                {selectedMapBuilding === "Architect_Firm" && (
                  <div className="p-4 bg-slate-900 border border-indigo-500/40 rounded-2xl flex flex-wrap gap-3">
                    <button onClick={() => { if (spendMoney(450000)) { setArchitectPlans((p) => [...p, "4Flat"]); setLogMessage("📐 4-Flat Plan Approved! Go to Berger Builders."); }}} className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl">Draw 4-Flat Plan (450k)</button>
                    <button onClick={() => { if (spendMoney(850000)) { setArchitectPlans((p) => [...p, "Duplex"]); setLogMessage("📐 Duplex Plan Approved! Go to Berger Builders."); }}} className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl">Draw Duplex Plan (850k)</button>
                  </div>
                )}

                {selectedMapBuilding === "Builder_Yard" && (
                  <div className="p-4 bg-slate-900 border border-amber-500/40 rounded-2xl flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        if (rawLandsOwned.length === 0 || architectPlans.length === 0) return setLogMessage("❌ Need Raw Land & Architect Plan first!");
                        if (spendMoney(4500000)) {
                          startCooldown("build_timer", 7200);
                          setOwnedProperties((p) => [...p, { name: `Built 4-Flat Estate (${rawLandsOwned[0]})`, area: rawLandsOwned[0], roomsAvailable: 4, listedPricePerRoom: 300000, isListedWithAgent: false }]);
                          setLogMessage("🏗️ 2-Hour Construction Started & Added to Landlord Portfolio!");
                        }
                      }}
                      className="px-4 py-2 bg-amber-500 text-slate-950 font-extrabold rounded-xl"
                    >
                      Construct 4-Flat Estate (4.5M g₦ • 2 Hours)
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY HOME */}
        {activeTab === "home" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs">
            <h2 className="font-extrabold text-base text-emerald-400">🏠 My Home: {shelterType} in {shelterArea} ({ownershipMode})</h2>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => { setEnergy(100); setGameDay((d) => d + 1); setLogMessage("🛌 Slept overnight!"); }} className="px-4 py-2.5 bg-indigo-600 text-white font-extrabold rounded-xl">🛌 Sleep Overnight</button>
              <button onClick={() => { if (spendMoney(3500)) { setHunger(100); setEnergy((e) => Math.min(100, e + 30)); setLogMessage("🍲 Ate meal!"); }}} className="px-4 py-2.5 bg-emerald-500 text-slate-950 font-extrabold rounded-xl">🍲 Eat Meal (3,500 g₦)</button>
            </div>
          </div>
        )}

        {/* TAB 3: JOBS */}
        {activeTab === "jobs" && (
          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
              <h2 className="font-bold text-sm text-amber-400">🧱 Area-Locked Street Jobs</h2>
              {[
                { name: "Oshodi Market Loader", loc: "Oshodi" as AreaName, pay: 6500 },
                { name: "Berger Cement Offloader", loc: "Berger" as AreaName, pay: 9000 },
                { name: "Yaba Dishwashing", loc: "Yaba" as AreaName, pay: 8000 },
                { name: "Lekki Site Bricklayer", loc: "Lekki" as AreaName, pay: 14000 },
              ].map((j, i) => (
                <div key={i} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                  <span>{j.name} (📍 {j.loc}) — +{j.pay.toLocaleString()} g₦</span>
                  <button
                    onClick={() => {
                      if (area !== j.loc) return setLogMessage(`🚌 Travel to ${j.loc} on the Map first!`);
                      setEarnedBalance((e) => e + j.pay);
                      setLogMessage(`✅ Worked ${j.name}! +${j.pay.toLocaleString()} g₦.`);
                    }}
                    className="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded"
                  >
                    Work
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
              <h2 className="font-bold text-sm text-cyan-400">🏢 Executive & Professional Careers</h2>
              {[
                { title: "Chartered Auditor (Req: B.Sc + ICAN)", loc: "Lekki" as AreaName, pay: 320000, cert: "ICAN" },
                { title: "Project Director (Req: M.Sc + PMP)", loc: "Berger" as AreaName, pay: 580000, cert: "PMP" },
                { title: "Network Architect (Req: B.Sc + CISCO)", loc: "Yaba" as AreaName, pay: 450000, cert: "CISCO" },
              ].map((c, i) => (
                <div key={i} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                  <span>{c.title} (📍 {c.loc}) — +{c.pay.toLocaleString()} g₦</span>
                  <button
                    onClick={() => {
                      if (!professionalCerts.includes(c.cert)) return setLogMessage(`❌ Requires ${c.cert} Cert from Yaba Institute!`);
                      setEarnedBalance((e) => e + c.pay);
                      setLogMessage(`💰 Paid +${c.pay.toLocaleString()} g₦!`);
                    }}
                    className="px-3 py-1 bg-cyan-500 text-slate-950 font-bold rounded"
                  >
                    Work
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SCHOOL LECTURES */}
        {activeTab === "school" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
            <h2 className="font-bold text-sm text-amber-400">🎓 Active Lecture Hall</h2>
            {enrolledProgram ? (
              <div className="space-y-2">
                <div className="font-bold">Studying: {enrolledProgram.name} ({enrolledProgram.completedClasses}/{enrolledProgram.totalClasses} Lectures)</div>
                <button
                  onClick={() => {
                    const nextC = enrolledProgram.completedClasses + 1;
                    if (nextC >= enrolledProgram.totalClasses) {
                      setEducation(enrolledProgram.name);
                      setCertificatesList((c) => [...c, enrolledProgram.name]);
                      setEnrolledProgram(null);
                      setLogMessage(`🎓 Graduated with ${enrolledProgram.name}!`);
                    } else {
                      setEnrolledProgram({ ...enrolledProgram, completedClasses: nextC });
                      setLogMessage(`📖 Lecture ${nextC}/${enrolledProgram.totalClasses} complete!`);
                    }
                  }}
                  className="px-4 py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-xl"
                >
                  Attend Next Lecture
                </button>
              </div>
            ) : (
              <p className="text-slate-400">Travel to <strong>Yaba Campus</strong> or <strong>Lekki Embassy</strong> on the Map to enroll in ND, HND, B.Sc, Masters, or Ph.D!</p>
            )}
          </div>
        )}

        {/* TAB 5: KIOSKS VS EATERIES */}
        {activeTab === "empire" && (
          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
              <h2 className="font-bold text-sm text-amber-400">🏪 Open Kiosk, Small Eatery, or Mega Restaurant</h2>
              {[
                { name: "Roadside Food Kiosk", bp: "BP_Food_Kiosk", cost: 350000, maxStaff: 2, maxCust: 15, rev: 45000 },
                { name: "Small Neighborhood Eatery", bp: "BP_Small_Eatery", cost: 850000, maxStaff: 6, maxCust: 45, rev: 135000 },
                { name: "Mega Fast-Food Restaurant", bp: "BP_Mega_Rest", cost: 2200000, maxStaff: 15, maxCust: 120, rev: 380000 },
              ].map((b, i) => (
                <div key={i} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                  <div>
                    <div className="font-bold">{b.name} (Cap: {b.maxStaff} Staff / {b.maxCust} Cust)</div>
                    <div className="text-amber-400">{b.cost.toLocaleString()} g₦</div>
                  </div>
                  <button
                    onClick={() => {
                      if (!ownedBlueprints.includes(b.bp)) return setLogMessage(`❌ Buy ${b.bp} at Yaba Institute on the Map first!`);
                      if (spendMoney(b.cost)) {
                        setActiveBusinesses((prev) => [...prev, { name: b.name, area, maxStaff: b.maxStaff, hiredStaff: 1, maxCustomers: b.maxCust, revenuePerCycle: b.rev }]);
                        setLogMessage(`🏪 Opened ${b.name} in ${area}!`);
                      }
                    }}
                    className="px-3 py-1.5 bg-amber-500 text-slate-950 font-extrabold rounded-lg"
                  >
                    Launch
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
              <h2 className="font-bold text-sm text-emerald-400">📈 Active Businesses & Staff Capacity</h2>
              {activeBusinesses.map((biz, i) => (
                <div key={i} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                  <span>{biz.name} ({biz.hiredStaff}/{biz.maxStaff} Staff)</span>
                  <div className="flex gap-1.5">
                    <button
                      disabled={biz.hiredStaff >= biz.maxStaff}
                      onClick={() => {
                        if (spendMoney(25000)) {
                          const up = [...activeBusinesses];
                          up[i].hiredStaff += 1;
                          setActiveBusinesses(up);
                        }
                      }}
                      className="px-2 py-1 bg-indigo-600 text-white rounded"
                    >
                      +1 Staff
                    </button>
                    <button
                      onClick={() => {
                        const rev = Math.round(biz.revenuePerCycle * (biz.hiredStaff / biz.maxStaff));
                        setEarnedBalance((e) => e + rev);
                        setLogMessage(`💰 Collected +${rev.toLocaleString()} g₦!`);
                      }}
                      className="px-2 py-1 bg-emerald-500 text-slate-950 font-bold rounded"
                    >
                      Collect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: PROFILE & CENTRAL BANK */}
        {activeTab === "profile" && (
          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
              <h2 className="font-bold text-sm text-amber-400">🏆 Verified Profile Achievements ({certificatesList.length})</h2>
              {certificatesList.map((c, i) => (
                <div key={i} className="p-2 bg-emerald-950/30 border border-emerald-800 rounded-lg text-emerald-300 font-bold">✓ {c}</div>
              ))}
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
              <h2 className="font-bold text-sm text-emerald-400">🏦 Central Bank Reserve: {centralBankReserve.toLocaleString()} g₦</h2>
              {[
                { naira: 500, gCash: 50000 },
                { naira: 1000, gCash: 100000 },
                { naira: 5000, gCash: 500000 },
                { naira: 10000, gCash: 1000000 },
              ].map((t, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCentralBankReserve((r) => r - t.gCash);
                    setStarterBalance((s) => s + t.gCash);
                    setLogMessage(`💳 Bought ${t.gCash.toLocaleString()} g₦ for ₦${t.naira}!`);
                  }}
                  className="w-full p-2 bg-slate-950 border border-amber-500/50 rounded-xl flex justify-between font-bold"
                >
                  <span>Buy {t.gCash.toLocaleString()} g₦</span>
                  <span className="text-amber-400">₦{t.naira.toLocaleString()}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 inset-x-0 bg-slate-900/95 backdrop-blur border-t border-slate-800 px-2 py-2 z-40">
        <div className="max-w-3xl mx-auto grid grid-cols-6 gap-1">
          {[

{ id: "map", label: "Lagos Map", icon: <Map className="w-4 h-4" /> },
            { id: "home", label: "My Home", icon: <Home className="w-4 h-4" /> },
            { id: "jobs", label: "Jobs/Work", icon: <Briefcase className="w-4 h-4" /> },
            { id: "school", label: "Lectures", icon: <GraduationCap className="w-4 h-4" /> },
            { id: "empire", label: "Kiosk/Biz", icon: <Building2 className="w-4 h-4" /> },
            { id: "profile", label: "Profile/Bank", icon: <Award className="w-4 h-4" /> },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`py-2 rounded-xl text-[10px] sm:text-[11px] font-bold flex flex-col items-center gap-1 transition ${
                activeTab === t.id ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-white"
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

function StatBar({ icon, label, value, pct, color }: any) {
  return (
    <div className="bg-slate-950 rounded-xl p-2">
      <div className="flex items-center justify-between text-[11px] mb-1">
        <span className="flex items-center gap-1 text-slate-300">{icon} {label}</span>
        <span className="font-bold">{value}</span>
      </div>
      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
