"use client";

import React, { useState, useEffect } from "react";
import { 
  Heart, Zap, Utensils, Sparkles, Tv, Home, Map,
  BedDouble, Armchair, Briefcase, GraduationCap, MapPin, 
  Play, Lock, Building2, Car, Vote, Landmark, Clock, 
  CloudRain, Sun, Award, Wrench, Fuel, Droplets, ZoomOut, ZoomIn, FileText
} from "lucide-react";

type AreaName = "Oshodi" | "Berger" | "Yaba" | "Surulere" | "Lekki";

const AREA_COORDS: Record<AreaName, number> = {
  Berger: 1,
  Oshodi: 2,
  Yaba: 3,
  Surulere: 4,
  Lekki: 6,
};

export default function LagosEmpireMapSimulator() {
  // 1. ONBOARDING
  const [isCreated, setIsCreated] = useState(false);
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");

  // 2. 15-MINUTE LIVE CLOCK, 8-WEEK RENT CYCLE & WEATHER
  const [gameHour, setGameHour] = useState(8);
  const [gameMinute, setGameMinute] = useState(0);
  const [gameDay, setGameDay] = useState(1);
  const [gameWeek, setGameWeek] = useState(1);
  const [weeksUntilRentDue, setWeeksUntilRentDue] = useState(8); // 8-Week Rent Cycle!
  const [weather, setWeather] = useState<"Sunny 32°C" | "Harmattan Haze" | "Heavy Lagos Rain" | "Warm Night">("Sunny 32°C");

  // 3. CENTRAL BANK 300M RESERVE & DUAL WALLETS
  const [centralBankReserve, setCentralBankReserve] = useState(300000000);
  const [starterBalance, setStarterBalance] = useState(50000);
  const [earnedBalance, setEarnedBalance] = useState(0);
  const [bankLoanDebt, setBankLoanDebt] = useState(0);

  // 4. PLAYER LOCATION, MAP ZOOM & SURVIVAL STATS
  const [area, setArea] = useState<AreaName>("Oshodi");
  const [isMapZoomedOut, setIsMapZoomedOut] = useState(false); // Zoom out to see all 5 Lagos areas!
  const [selectedMapBuilding, setSelectedMapBuilding] = useState<string>("None");
  const [health, setHealth] = useState(90);
  const [energy, setEnergy] = useState(70);
  const [hunger, setHunger] = useState(80);
  const [weight, setWeight] = useState(68.0);
  const [steeze, setSteeze] = useState(5);
  const [citizenPoints, setCitizenPoints] = useState(15);

  // 5. TIMERS ENGINE
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
            setHustlesDoneToday(0);
            setWorkedOfficeToday(false);
          }
          return nextH;
        });

        setHunger((prevH) => {
          const nh = Math.max(0, prevH - 4);
          if (nh === 0) setHealth((hp) => Math.max(10, hp - 5));
          return nh;
        });
        setEnergy((prevE) => {
          const ne = Math.max(0, prevE - 3);
          if (ne === 0) setHealth((hp) => Math.max(10, hp - 4));
          return ne;
        });
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

  // 6. HOUSING (RENTING EVERY 8 WEEKS VS BUYING OUTRIGHT + LANDLORD SUB-LETTING)
  const [shelterType, setShelterType] = useState("Unpainted Single Room");
  const [shelterArea, setShelterArea] = useState<AreaName>("Oshodi");
  const [ownershipMode, setOwnershipMode] = useState<"Rented" | "Bought_Owned">("Rented");
  const [rentPer8Weeks, setRentPer8Weeks] = useState(80000);
  const [parkingSlots, setParkingSlots] = useState(0);
  const [wallColor, setWallColor] = useState("Unplastered");
  const [bedTier, setBedTier] = useState("Bare_Floor");
  const [chairTier, setChairTier] = useState("None");
  const [tvTier, setTvTier] = useState("None");
  const [hasLagosFlix, setHasLagosFlix] = useState(false);
  const [showTvModal, setShowTvModal] = useState(false);
  const [hasCookingStove, setHasCookingStove] = useState(false);
  const [gasLevel, setGasLevel] = useState(0);
  const [rawFoodServings, setRawFoodServings] = useState(0);

  // Landlord Room Renting via Agent Form
  const [ownedProperties, setOwnedProperties] = useState<{
    name: string;
    area: AreaName;
    roomsAvailable: number;
    listedPricePerRoom: number;
    isListedWithAgent: boolean;
  }[]>([]);
  const [customRoomRentInput, setCustomRoomRentInput] = useState("250000");

  // Raw Land -> Architect Plan -> Builder (2h to 8h Construction)
  const [rawLandsOwned, setRawLandsOwned] = useState<AreaName[]>([]);
  const [architectPlans, setArchitectPlans] = useState<string[]>([]);

  // 7. DRIVING SCHOOL, DRIVER'S LICENSE & CAR MAINTENANCE (PETROL, WATER, ENGINE HEALTH)
  const [hasDriversLicense, setHasDriversLicense] = useState(false);
  const [drivingLessonsDone, setDrivingLessonsDone] = useState(0); // Need 3 lessons + FRSC test
  const [carsOwned, setCarsOwned] = useState<string[]>([]);
  const [activeCar, setActiveCar] = useState<string>("None");
  const [carPetrol, setCarPetrol] = useState(80);       // 0 - 100%
  const [carRadiatorWater, setCarRadiatorWater] = useState(90); // 0 - 100%
  const [carEngineHealth, setCarEngineHealth] = useState(100);  // 0 - 100%

  // 8. EDUCATION (ND, HND, BSc, MASTERS, PHD) & PROFESSIONAL COURSES (ICAN, PMP, CISCO)
  const [education, setEducation] = useState("Uneducated");
  const [professionalCerts, setProfessionalCerts] = useState<string[]>([]);
  const [certificatesList, setCertificatesList] = useState<string[]>([]);
  const [enrolledProgram, setEnrolledProgram] = useState<{
    name: string;
    totalClasses: number;
    completedClasses: number;
  } | null>(null);
  const [abroadVisa, setAbroadVisa] = useState(false);
  const [cvScore, setCvScore] = useState(0);
  const [outfit, setOutfit] = useState("Singlet & Slippers");
  const [hasCorporateSuit, setHasCorporateSuit] = useState(false);

  // 9. TIERED BLUEPRINTS (KIOSK 400K VS SMALL EATERY 900K VS MEGA RESTAURANT 1.8M)
  const [ownedBlueprints, setOwnedBlueprints] = useState<string[]>([]);
  const [cacStatus, setCacStatus] = useState<"None" | "Processing" | "Approved">("None");
  const [cofoStatus, setCofoStatus] = useState<"None" | "Processing" | "Approved">("None");
  const [companyName, setCompanyName] = useState("");
  const [activeBusinesses, setActiveBusinesses] = useState<{
    name: string;
    area: AreaName;
    maxStaff: number;
    hiredStaff: number;
    maxCustomers: number;
    revenuePerCycle: number;
  }[]>([]);

  // 10. JOBS, POLITICS & COURTSHIP
  const [hustlesDoneToday, setHustlesDoneToday] = useState(0);
  const [employedJob, setEmployedJob] = useState<{
    title: string;
    company: string;
    area: AreaName;
    payPer3Days: number;
  } | null>(null);
  const [daysWorkedThisCycle, setDaysWorkedThisCycle] = useState(0);
  const [workedOfficeToday, setWorkedOfficeToday] = useState(false);
  const [partyStatus, setPartyStatus] = useState("None");
  const [nominationStatus, setNominationStatus] = useState("None");
  const [cityBillboardText, setCityBillboardText] = useState("BILLBOARD AVAILABLE — Visit Surulere Electoral Office or Agency!");
  const [maritalStatus, setMaritalStatus] = useState<"Single" | "Courting" | "Married">("Single");
  const [partnerName, setPartnerName] = useState("None");
  const [relationshipBond, setRelationshipBond] = useState(0);

  const [activeTab, setActiveTab] = useState<"map" | "home" | "jobs" | "school" | "empire" | "profile">("map");
  const [logMessage, setLogMessage] = useState(
    "Welcome to Lagos! You are standing in Oshodi. You can only view and enter buildings in the Area you are physically standing in!"
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

  // DRIVE PERSONAL CAR ACROSS LAGOS (CHECKS LICENSE, PETROL, RADIATOR WATER & ENGINE HEALTH!)
  const handleDriveCarTo = (dest: AreaName) => {
    if (activeCar === "None") return setLogMessage("❌ You don't have an active car! Buy one in Berger Auto Dealership.");
    if (!hasDriversLicense) return setLogMessage("🚓 FRSC ARREST WARNING: You cannot drive without a Driver's License! Visit Oshodi Driving School.");
    const costs = getTransportCosts(dest);
    if (carPetrol < costs.petrolUsed) return setLogMessage(`⛽ Not enough petrol (${carPetrol}%)! Visit the Filling Station first.`);
    if (carRadiatorWater < costs.waterUsed) return setLogMessage(`🌡️ Radiator water too low (${carRadiatorWater}%)! Add water before your engine overheats.`);
    if (carEngineHealth < 30) return setLogMessage(`🔧 Your ${activeCar} engine health is critical (${carEngineHealth}%)! Visit Oshodi Mechanic Workshop.`);

    startCooldown("commute", 15);
    setCarPetrol((p) => Math.max(0, p - costs.petrolUsed));
    setCarRadiatorWater((w) => Math.max(0, w - costs.waterUsed));
    setCarEngineHealth((h) => Math.max(0, h - costs.wearTear));
    setArea(dest);
    setSelectedMapBuilding("None");
    setIsMapZoomedOut(false);
    setLogMessage(
      `🚗 Drove your ${activeCar} to ${dest}! (Petrol -${costs.petrolUsed}%, Water -${costs.waterUsed}%, Engine Health: ${carEngineHealth - costs.wearTear}%).`
    );
  };

  if (!isCreated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
          <div className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full mb-3">
            LAGOS EMPIRE — AREA-LOCKED MAP EDITION
          </div>
          <h1 className="text-2xl font-extrabold mb-2">Begin From Scratch</h1>
          <p className="text-slate-400 text-sm mb-6">
            Start in Oshodi with 50,000 g₦. Travel area-by-area to unlock local buildings, get your driver's license, maintain your car's petrol & radiator water, and build kiosks, eateries, or estates.
          </p>
          <input
            type="text"
            placeholder="Citizen Name (e.g., Ayodeji)"
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
              if (!username.trim()) return alert("Enter your name!");
              setIsCreated(true);
            }}
            className="w-full py-3.5 bg-emerald-500 text-slate-950 font-extrabold rounded-xl text-sm"
          >
            Spawn in Oshodi (50,000 g₦ Stipend)
          </button>
        </div>
      </div>
    );
  }

  // AREA-SPECIFIC BUILDINGS (ONLY VISIBLE WHEN PHYSICALLY IN THAT AREA!)
  const areaBuildingsMap: Record<AreaName, { id: string; icon: string; name: string; desc: string }[]> = {
    Oshodi: [
      { id: "Driving_School", icon: "🪪", name: "FRSC & Driving School", desc: "Get Driver's License" },
      { id: "Mechanic_Shop", icon: "🔧", name: "Oshodi Mechanic & Water", desc: "Fix Car & Radiator Water" },
      { id: "Agent_Office", icon: "🏘️", name: "Oshodi Estate Agent Office", desc: "Rent/Buy or List Rooms" },
      { id: "Gas_Kitchen_Shop", icon: "🔥", name: "Oshodi Market & Gas Depot", desc: "Stove, Gas & Raw Food" },
      { id: "Party_Ward", icon: "🟢", name: "JPC Party Local Ward", desc: "Apply for Party Card" },
    ],
    Berger: [
      { id: "Auto_Dealership", icon: "🚗", name: "Berger Motor Fair & Dealership", desc: "Buy 10 Car Models" },
      { id: "Filling_Station", icon: "⛽", name: "NNPC Mega Filling Station", desc: "Buy Petrol & Water" },
      { id: "Builder_Yard", icon: "🏗️", name: "Julius Berger Construction", desc: "Hire Builders (2h-8h)" },
      { id: "Agent_Office", icon: "🏘️", name: "Berger Estate Agent Office", desc: "Rent/Buy or List Rooms" },
      { id: "Furniture_Shop", icon: "🛏️", name: "Berger Mattress & Sofa Depot", desc: "Furnish Your Home" },
    ],
    Yaba: [
      { id: "Academic_Campus", icon: "🎓", name: "Yaba Poly, Uni & PhD Campus", desc: "ND, HND, BSc, MSc, PhD" },
      { id: "Blueprint_Academy", icon: "📘", name: "Blueprint & Pro Cert Institute", desc: "Kiosk/Eatery BPs & ICAN/PMP" },
      { id: "Architect_Firm", icon: "📐", name: "Yaba Architectural Studio", desc: "Draw House Plans for Land" },
      { id: "Electronics_Shop", icon: "📺", name: "Yaba Tech & TV Plaza", desc: "Buy 4 TV Tiers" },
      { id: "Agent_Office", icon: "🏘️", name: "Yaba Estate Agent Office", desc: "Rent/Buy or List Rooms" },
    ],
    Surulere: [
      { id: "CAC_Office", icon: "🏛️", name: "CAC Corporate Registry", desc: "Register Company (90s)" },
      { id: "Electoral_HQ", icon: "🗳️", name: "Lagos Electoral & Billboard HQ", desc: "Nomination Forms & Ads" },
      { id: "Eatery_Social", icon: "🍗", name: "Surulere Mall, Eatery & Lounge", desc: "Eat & Meet Partners" },
      { id: "Agent_Office", icon: "🏘️", name: "Surulere Estate Agent Office", desc: "Rent/Buy or List Rooms" },
    ],
    Lekki: [
      { id: "Lands_Bureau", icon: "📜", name: "Lekki Lands Bureau & C-of-O", desc: "Buy Raw Land & C-of-O" },
      { id: "Foreign_Embassy", icon: "✈️", name: "Foreign Embassy (Study Abroad)", desc: "Visa, Abroad MSc & PhD" },
      { id: "Agent_Office", icon: "🏰", name: "Lekki Luxury Estate Agent", desc: "Rent/Buy Duplexes & List" },
      { id: "Filling_Station", icon: "⛽", name: "Lekki Express Fuel & Service", desc: "Petrol & Radiator Water" },
      { id: "Eatery_Social", icon: "🥂", name: "Lekki V.I. Executive Lounge", desc: "Dates & High-Net-Worth Chat" },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-28">
      {/* TOP BAR */}
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
                • 🏠 Home: {shelterType} ({shelterArea} - {ownershipMode})
                • 🪪 License: {hasDriversLicense ? "Verified" : "None"}
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
        {/* PLAYER & VEHICLE DASHBOARD METERS */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 bg-slate-900 border border-slate-800 rounded-2xl p-3">
          <StatBar icon={<Heart className="w-3.5 h-3.5 text-rose-400" />} label="Health" value={`${health}%`} pct={health} color="bg-rose-500" />
          <StatBar icon={<Zap className="w-3.5 h-3.5 text-amber-400" />} label="Energy" value={`${energy}%`} pct={energy} color="bg-amber-500" />
          <StatBar icon={<Utensils className="w-3.5 h-3.5 text-orange-400" />} label="Belly" value={`${hunger}%`} pct={hunger} color="bg-orange-500" />
          <StatBar icon={<Fuel className="w-3.5 h-3.5 text-emerald-400" />} label="Car Petrol" value={activeCar === "None" ? "N/A" : `${carPetrol}%`} pct={carPetrol} color="bg-emerald-500" />
          <StatBar icon={<Droplets className="w-3.5 h-3.5 text-cyan-400" />} label="Radiator H2O" value={activeCar === "None" ? "N/A" : `${carRadiatorWater}%`} pct={carRadiatorWater} color="bg-cyan-500" />
          <StatBar icon={<Wrench className="w-3.5 h-3.5 text-purple-400" />} label="Car Engine" value={activeCar === "None" ? "N/A" : `${carEngineHealth}%`} pct={carEngineHealth} color="bg-purple-500" />
        </div>

        {/* EVENT LOG */}
        <div className="bg-emerald-950/40 border border-emerald-800/60 text-emerald-200 px-4 py-2.5 rounded-xl text-sm font-medium">
          🔔 {logMessage}
        </div>

        {/* =====================================================================
            TAB 1: 🗺️ INTERACTIVE LAGOS MAP (ZOOM OUT OVERVIEW VS LOCAL STREET MAP)
           ===================================================================== */}
        {activeTab === "map" && (
          <div className="space-y-4 text-xs">
            {/* MAP HEADER & ZOOM TOGGLE */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-extrabold text-base text-white flex items-center gap-2">
                  🗺️ {isMapZoomedOut ? "Lagos State Satellite Overview (5 Areas)" : `${area} Local Street Map (Zoomed In)`}
                </h2>
                <p className="text-slate-400 text-[11px]">
                  {isMapZoomedOut
                    ? "Select an Area below to commute via Bus, Cab, Trek, or Drive your personal car. You cannot view inside another Area until you travel there!"
                    : `Showing places physically located in ${area}. To see buildings in other areas, click 'Zoom Out to State Map' and travel there!`}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsMapZoomedOut(!isMapZoomedOut);
                  setSelectedMapBuilding("None");
                }}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl flex items-center gap-1.5"
              >
                {isMapZoomedOut ? <ZoomIn className="w-4 h-4" /> : <ZoomOut className="w-4 h-4" />}
                {isMapZoomedOut ? `Zoom In to ${area} Street` : "Zoom Out: View All Lagos Areas"}
              </button>
            </div>

            {/* VIEW A: ZOOMED-OUT LAGOS STATE OVERVIEW MAP (FOG OF WAR ON OTHER AREAS!) */}
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
                          {isCurrent
                            ? "✅ You are standing here. Click Zoom In to enter buildings!"
                            : "🔒 Fog of War: Travel to this area to view and enter its buildings, shops, and estates."}
                        </p>
                      </div>

                      {isCurrent ? (
                        <button
                          onClick={() => setIsMapZoomedOut(false)}
                          className="w-full py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-xl"
                        >
                          🔍 Explore {dest} Street
                        </button>
                      ) : (
                        <div className="space-y-1.5 pt-2 border-t border-slate-800">
                          <button
                            disabled={!!timers.commute}
                            onClick={() => {
                              if (energy < costs.trekEnergy) return setLogMessage("⚠️ Too tired to trek!");
                              startCooldown("commute", 45);
                              setEnergy((e) => Math.max(0, e - costs.trekEnergy));
                              setArea(dest);
                              setIsMapZoomedOut(false);
                              setLogMessage(`🚶🏾‍♂️ Trekked to ${dest}! You can now see all places in ${dest}.`);
                            }}
                            className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-[10px]"
                          >
                            🚶🏾‍♂️ Trek (₦0 • -{costs.trekEnergy}% En)
                          </button>
                          <button
                            disabled={!!timers.commute}
                            onClick={() => {
                              if (!spendMoney(costs.busCost)) return;
                              startCooldown("commute", 30);
                              setArea(dest);
                              setIsMapZoomedOut(false);
                              setLogMessage(`🚐 Took Danfo Bus to ${dest} (-${costs.busCost.toLocaleString()} g₦).`);
                            }}
                            className="w-full py-1.5 bg-amber-500/20 border border-amber-500 text-amber-300 font-bold rounded-lg text-[10px]"
                          >
                            🚐 Danfo Bus ({costs.busCost.toLocaleString()} g₦)
                          </button>
                          <button
                            disabled={!!timers.commute}
                            onClick={() => {
                              if (!spendMoney(costs.cabCost)) return;
                              startCooldown("commute", 15);
                              setArea(dest);
                              setIsMapZoomedOut(false);
                              setLogMessage(`🚕 Took Cab to ${dest} (-${costs.cabCost.toLocaleString()} g₦).`);
                            }}
                            className="w-full py-1.5 bg-indigo-600 text-white font-bold rounded-lg text-[10px]"
                          >
                            🚕 Book Cab ({costs.cabCost.toLocaleString()} g₦)
                          </button>
                          {activeCar !== "None" && (
                            <button
                              disabled={!!timers.commute}
                              onClick={() => handleDriveCarTo(dest)}
                              className="w-full py-1.5 bg-emerald-600 text-white font-extrabold rounded-lg text-[10px]"
                            >
                              🚗 Drive {activeCar} (-{costs.petrolUsed}% Fuel)
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* VIEW B: ZOOMED-IN LOCAL AREA STREET MAP (SHOWS YOUR HOUSE + AREA BUILDINGS) */
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {/* IF PLAYER HAS A HOUSE OR LAND IN THIS AREA, SHOW IT RIGHT ON THE MAP! */}
                  {shelterArea === area && (
                    <button
                      onClick={() => setActiveTab("home")}
                      className="p-3.5 rounded-2xl border-2 border-emerald-400 bg-emerald-950/50 text-center flex flex-col items-center justify-center gap-1 shadow-lg"
                    >
                      <span className="text-3xl">🏠</span>
                      <span className="font-extrabold text-xs text-emerald-300">My Home ({shelterType})</span>
                      <span className="text-[10px] text-white">Click to Go Inside</span>
                    </button>
                  )}

                  {rawLandsOwned.includes(area) && (
                    <button
                      onClick={() => setSelectedMapBuilding("My_Raw_Land")}
                      className="p-3.5 rounded-2xl border-2 border-amber-400 bg-amber-950/40 text-center flex flex-col items-center justify-center gap-1"
                    >
                      <span className="text-3xl">🚧</span>
                      <span className="font-extrabold text-xs text-amber-300">My Raw Land in {area}</span>
                      <span className="text-[10px] text-white">Click to Inspect / Build</span>
                    </button>
                  )}

                  {/* AREA-SPECIFIC BUILDINGS */}
                  {areaBuildingsMap[area].map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setSelectedMapBuilding(b.id)}
                      className={`p-3.5 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                        selectedMapBuilding === b.id
                          ? "bg-indigo-950/80 border-indigo-400 scale-[1.02]"
                          : "bg-slate-900 border-slate-800 hover:border-slate-600"
                      }`}
                    >
                      <span className="text-3xl">{b.icon}</span>
                      <span className="font-extrabold text-xs text-white">{b.name}</span>
                      <span className="text-[10px] text-slate-400">{b.desc}</span>
                    </button>
                  ))}
                </div>

                {/* ===============================================================
                    INTERACTIVE INTERIOR OF WHATEVER MAP BUILDING WAS CLICKED
                   =============================================================== */}

                {/* 1. DRIVING SCHOOL & FRSC LICENSE (OSHODI) */}
                {selectedMapBuilding === "Driving_School" && (
                  <div className="p-4 bg-slate-900 border border-emerald-500/40 rounded-2xl space-y-3">
                    <h3 className="font-extrabold text-sm text-emerald-400">🪪 Inside Oshodi Driving Academy & FRSC Licensing Office</h3>
                    <p className="text-slate-400">
                      You must complete 3 Practical Driving Lessons (`{drivingLessonsDone}/3`) and pass the FRSC Road Test before you can buy or drive any car!
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        disabled={drivingLessonsDone >= 3 || !!timers.drive_lesson}
                        onClick={() => {
                          if (spendMoney(25000)) {
                            startCooldown("drive_lesson", 60);
                            setDrivingLessonsDone((d) => d + 1);
                            setLogMessage(`🚗 Completed Driving Lesson ${drivingLessonsDone + 1}/3! (60s practical session).`);
                          }
                        }}
                        className="px-4 py-2.5 bg-amber-500 text-slate-950 font-extrabold rounded-xl disabled:opacity-40"
                      >
                        {timers.drive_lesson
                          ? `⏳ In Driving Lesson (${formatSecs(timers.drive_lesson)})`
                          : drivingLessonsDone >= 3
                          ? "✓ 3/3 Driving Lessons Complete"
                          : `Take Driving Lesson #${drivingLessonsDone + 1} (25,000 g₦ • 60s)`}
                      </button>

                      <button
                        disabled={hasDriversLicense || drivingLessonsDone < 3}
                        onClick={() => {
                          if (spendMoney(45000)) {
                            setHasDriversLicense(true);
                            setCertificatesList((c) => [...c, "FRSC Official Driver's License"]);
                            setLogMessage("🪪 FRSC Driver's License Issued! You can now purchase and drive cars in Lagos!");
                          }
                        }}
                        className="px-4 py-2.5 bg-emerald-500 text-slate-950 font-extrabold rounded-xl disabled:opacity-40"
                      >
                        {hasDriversLicense ? "✓ Licensed Driver" : "Obtain Official FRSC Driver's License (45,000 g₦)"}
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. MECHANIC WORKSHOP (OSHODI) */}
                {selectedMapBuilding === "Mechanic_Shop" && (
                  <div className="p-4 bg-slate-900 border border-purple-500/40 rounded-2xl space-y-3">
                    <h3 className="font-extrabold text-sm text-purple-400">🔧 Inside Oshodi Mechanic Village & Radiator Service</h3>
                    <p className="text-slate-400">Active Car: <strong>{activeCar}</strong> • Engine Health: <strong>{carEngineHealth}%</strong> • Radiator Water: <strong>{carRadiatorWater}%</strong></p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => {
                          if (activeCar === "None") return setLogMessage("❌ You don't own a car yet!");
                          if (spendMoney(35000)) {
                            startCooldown("mech_cd", 60);
                            setCarEngineHealth(100);
                            setLogMessage(`🔧 Mechanic overhauled your ${activeCar} engine back to 100% health!`);
                          }
                        }}
                        className="px-4 py-2 bg-purple-600 text-white font-bold rounded-xl"
                      >
                        🔧 Full Engine Servicing & Alignment (35,000 g₦ • 60s)
                      </button>
                      <button
                        onClick={() => {
                          if (activeCar === "None") return setLogMessage("❌ You don't own a car yet!");
                          if (spendMoney(3000)) {
                            setCarRadiatorWater(100);
                            setLogMessage("💧 Topped up Radiator Water & Coolant to 100%!");
                          }
                        }}
                        className="px-4 py-2 bg-cyan-600 text-white font-bold rounded-xl"
                      >
                        💧 Refill Radiator Water & Coolant (3,000 g₦)
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. FILLING STATION (BERGER / LEKKI) */}
                {selectedMapBuilding === "Filling_Station" && (
                  <div className="p-4 bg-slate-900 border border-emerald-500/40 rounded-2xl space-y-3">
                    <h3 className="font-extrabold text-sm text-emerald-400">⛽ Inside {area} Filling Station (Petrol & Water)</h3>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => {
                          if (activeCar === "None") return setLogMessage("❌ Buy a car first!");
                          if (spendMoney(18000)) {
                            setCarPetrol(100);
                            setLogMessage(`⛽ Filled ${activeCar} tank to 100% Petrol!`);
                          }
                        }}
                        className="px-4 py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-xl"
                      >
                        ⛽ Fill Full Tank of Petrol (18,000 g₦)
                      </button>
                      <button
                        onClick={() => {
                          if (activeCar === "None") return setLogMessage("❌ Buy a car first!");
                          if (spendMoney(2000)) {
                            setCarRadiatorWater(100);
                            setLogMessage("💧 Topped up Car Radiator Water to 100%!");
                          }
                        }}
                        className="px-4 py-2 bg-cyan-500 text-slate-950 font-extrabold rounded-xl"
                      >
                        💧 Add Radiator Water (2,000 g₦)
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. AUTOMOBILE DEALERSHIP (BERGER) - REQUIRES DRIVER'S LICENSE! */}
                {selectedMapBuilding === "Auto_Dealership" && (
                  <div className="p-4 bg-slate-900 border border-emerald-500/40 rounded-2xl space-y-3">
                    <h3 className="font-extrabold text-sm text-emerald-400">🚗 Inside Berger Motor Fair & Auto Dealership</h3>
                    <p className="text-slate-400">
                      Requires <strong>FRSC Driver's License</strong> (from Oshodi Driving School) and an available <strong>Parking Slot</strong> (`{carsOwned.length}/{parkingSlots}` used).
                    </p>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {[
                        { name: "Suzuki 'Korope' Mini", cost: 750000, st: 10 },
                        { name: "Tokunbo Toyota Corolla", cost: 1350000, st: 25 },
                        { name: "Honda Accord 'Evil Spirit'", cost: 1950000, st: 35 },
                        { name: "Lexus RX350 SUV", cost: 3200000, st: 55 },
                        { name: "Mercedes-Benz C300", cost: 4500000, st: 75 },
                        { name: "Toyota Land Cruiser Prado", cost: 6200000, st: 95 },
                        { name: "Mercedes G63 G-Wagon", cost: 9500000, st: 140 },
                        { name: "Lamborghini Urus", cost: 14000000, st: 200 },
                      ].map((c, i) => {
                        const owned = carsOwned.includes(c.name);
                        return (
                          <div key={i} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                            <div className="font-bold text-white">{c.name}</div>
                            <div className="text-emerald-400 font-bold">{c.cost.toLocaleString()} g₦ • +{c.st} Steeze</div>
                            <button
                              disabled={owned}
                              onClick={() => {
                                if (!hasDriversLicense) return setLogMessage("❌ Dealership Blocked: Travel to Oshodi Driving School and get your Driver's License first!");
                                if (carsOwned.length >= parkingSlots) return setLogMessage("❌ LASTMA Blocked: You have 0 free parking slots! Rent or buy a house with parking first.");
                                if (spendMoney(c.cost)) {
                                  setCarsOwned((p) => [...p, c.name]);
                                  setActiveCar(c.name);
                                  setCarPetrol(100);
                                  setCarRadiatorWater(100);
                                  setCarEngineHealth(100);
                                  setCertificatesList((cert) => [...cert, `Vehicle Ownership: ${c.name}`]);
                                  setSteeze((s) => s + c.st);
                                  setLogMessage(`🏎️ Purchased ${c.name}! You can now drive it across Lagos.`);
                                }
                              }}
                              className="w-full py-1.5 bg-emerald-500 text-slate-950 font-extrabold rounded-lg disabled:opacity-40"
                            >
                              {owned ? "✓ In Garage" : "Buy Vehicle"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 5. AREA ESTATE AGENT OFFICE (RENT EVERY 8 WEEKS VS BUY OUTRIGHT VS LIST ROOMS AS LANDLORD!) */}
                {selectedMapBuilding === "Agent_Office" && (
                  <div className="p-4 bg-slate-900 border border-cyan-500/40 rounded-2xl space-y-4">
                    <h3 className="font-extrabold text-sm text-cyan-400">
                      🏘️ Inside {area} Licensed Estate Agent Office (Rent, Buy Outright, or List Rooms)
                    </h3>
                    <p className="text-slate-400">
                      Renting is paid every <strong>8 In-Game Weeks</strong>. Buying a house outright is expensive (`12M – 65M g₦`) but makes you a permanent Landlord who can rent out spare rooms!
                    </p>

                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        { name: `${area} Self-Contain Studio`, park: 1, rooms: 1, rent8Wk: 180000, buyPrice: 12000000 },
                        { name: `${area} 2-Bedroom Flat`, park: 2, rooms: 2, rent8Wk: 380000, buyPrice: 22000000 },
                        { name: `${area} 3-Bedroom Executive Flat`, park: 3, rooms: 3, rent8Wk: 720000, buyPrice: 36000000 },
                        { name: `${area} 5-Bedroom Detached Duplex`, park: 5, rooms: 5, rent8Wk: 1850000, buyPrice: 65000000 },
                      ].map((prop, idx) => (
                        <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                          <div className="font-extrabold text-white text-sm">{prop.name}</div>
                          <div className="text-[11px] text-slate-400">
                            🅿️ {prop.park} Parking Slots • 🛏️ {prop.rooms} Rooms • +10% Agent Fee
                          </div>
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <button
                              onClick={() => {
                                if (spendMoney(prop.rent8Wk)) {
                                  setShelterType(prop.name);
                                  setShelterArea(area);
                                  setOwnershipMode("Rented");
                                  setRentPer8Weeks(prop.rent8Wk);
                                  setWeeksUntilRentDue(8);
                                  setParkingSlots(prop.park);
                                  setLogMessage(`🔑 Rented ${prop.name} in ${area} for 8 Weeks!`);
                                }
                              }}
                              className="py-2 bg-cyan-600 text-white font-bold rounded-lg text-[11px]"
                            >
                              Rent / 8 Wks ({(prop.rent8Wk / 1000).toFixed(0)}k g₦)
                            </button>
                            <button
                              onClick={() => {
                                if (spendMoney(prop.buyPrice)) {
                                  setShelterType(prop.name);
                                  setShelterArea(area);
                                  setOwnershipMode("Bought_Owned");
                                  setWeeksUntilRentDue(999);
                                  setParkingSlots(prop.park);
                                  setOwnedProperties((p) => [
                                    ...p,
                                    { name: prop.name, area, roomsAvailable: prop.rooms - 1, listedPricePerRoom: 250000, isListedWithAgent: false },
                                  ]);
                                  setCertificatesList((c) => [...c, `House Deed: ${prop.name}`]);
                                  setLogMessage(`🏰 BOUGHT ${prop.name} OUTRIGHT! You can now list its ${prop.rooms - 1} spare rooms for rent below!`);
                                }
                              }}
                              className="py-2 bg-amber-500 text-slate-950 font-extrabold rounded-lg text-[11px]"
                            >
                              Buy Outright ({(prop.buyPrice / 1000000).toFixed(0)}M g₦)
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* LANDLORD ROOM LISTING FORM (FOR PLAYERS WHO BOUGHT OR BUILT A HOUSE!) */}
                    <div className="p-3 bg-indigo-950/30 border border-indigo-600 rounded-xl space-y-2.5">
                      <div className="font-extrabold text-indigo-300 flex items-center gap-1.5">
                        <FileText className="w-4 h-4" /> Landlord Room-Renting Form (Hand Over Spare Rooms to Estate Agent)
                      </div>
                      {ownedProperties.length === 0 ? (
                        <p className="text-slate-400 text-[11px]">
                          You don't own any bought or constructed houses yet. Buy a house outright above (or build one on raw land) to list rooms for tenants!
                        </p>
                      ) : (
                        ownedProperties.map((op, i) => (
                          <div key={i} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <div className="font-bold text-white">{op.name} ({op.roomsAvailable} Spare Rooms)</div>
                              <div className="text-[10px] text-emerald-400">
                                {op.isListedWithAgent
                                  ? `Listed with Agent at ${op.listedPricePerRoom.toLocaleString()} g₦ / room`
                                  : "Not listed yet — Fill price below"}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={customRoomRentInput}
                                onChange={(e) => setCustomRoomRentInput(e.target.value)}
                                className="w-28 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                                placeholder="Rent per room"
                              />
                              <button
                                onClick={() => {
                                  const price = Number(customRoomRentInput) || 200000;
                                  const updated = [...ownedProperties];
                                  updated[i].listedPricePerRoom = price;
                                  updated[i].isListedWithAgent = true;
                                  setOwnedProperties(updated);
                                  const totalRentCollected = Math.floor(price * op.roomsAvailable * 0.9); // Agent takes 10%
                                  setEarnedBalance((e) => e + totalRentCollected);
                                  setLogMessage(
                                    `🏘️ Submitted Agent Form! Agent rented out ${op.roomsAvailable} rooms in ${op.name} at ${price.toLocaleString()} g₦ each and remitted +${totalRentCollected.toLocaleString()} g₦ (after 10% Agent Fee)!`
                                  );
                                }}
                                className="px-3 py-1.5 bg-emerald-500 text-slate-950 font-extrabold rounded-lg"
                              >
                                Submit Form & Collect Rent
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* 6. LEKKI LANDS BUREAU -> YABA ARCHITECT -> BERGER BUILDERS (2H-8H CONSTRUCTION) */}
                {selectedMapBuilding === "Lands_Bureau" && (
                  <div className="p-4 bg-slate-900 border border-amber-500/40 rounded-2xl space-y-3">
                    <h3 className="font-extrabold text-sm text-amber-400">📜 Inside Lekki Lands Bureau (Buy Raw Land & C-of-O)</h3>
                    <p className="text-slate-400">
                      Step 1: Buy Raw Land & C-of-O (`120s` approval). Step 2: Travel to <strong>Yaba Architectural Studio</strong> for plans. Step 3: Travel to <strong>Berger Construction Yard</strong> to build!
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(["Oshodi", "Berger", "Yaba", "Surulere", "Lekki"] as AreaName[]).map((loc) => (
                        <button
                          key={loc}
                          disabled={rawLandsOwned.includes(loc)}
                          onClick={() => {
                            if (spendMoney(2500000)) {
                              setCofoStatus("Processing");
                              startCooldown("cofo_wait", 120);
                              setRawLandsOwned((r) => [...r, loc]);
                              setTimeout(() => {
                                setCofoStatus("Approved");
                                setCertificatesList((c) => [...c, `Raw Land & C-of-O (${loc})`]);
                                setLogMessage(`📜 Raw Land & C-of-O in ${loc} signed! Now visit Yaba Architectural Studio.`);
                              }, 120000);
                            }
                          }}
                          className="px-3 py-2 bg-amber-500 text-slate-950 font-extrabold rounded-xl disabled:opacity-40"
                        >
                          {rawLandsOwned.includes(loc) ? `✓ Own Land in ${loc}` : `Buy Raw Land in ${loc} (2.5M g₦)`}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedMapBuilding === "Architect_Firm" && (
                  <div className="p-4 bg-slate-900 border border-indigo-500/40 rounded-2xl space-y-3">
                    <h3 className="font-extrabold text-sm text-indigo-400">📐 Inside Yaba Architectural Studio (Draw Building Plans)</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        { id: "Plan_4Flat", name: "4-Bedroom Block of Flats Plan", cost: 450000 },
                        { id: "Plan_Duplex", name: "6-Bedroom Twin Duplex Plan", cost: 850000 },
                      ].map((pl) => (
                        <button
                          key={pl.id}
                          disabled={architectPlans.includes(pl.id)}
                          onClick={() => {
                            if (rawLandsOwned.length === 0) return setLogMessage("❌ Buy Raw Land at Lekki Lands Bureau first!");
                            if (spendMoney(pl.cost)) {
                              startCooldown("arch_cd", 90);
                              setArchitectPlans((p) => [...p, pl.id]);
                              setLogMessage(`📐 Architect completed ${pl.name}! Take it to Berger Construction Yard to build.`);
                            }
                          }}
                          className="p-3 bg-slate-950 border border-indigo-600 rounded-xl font-bold text-left disabled:opacity-40"
                        >
                          <div>{architectPlans.includes(pl.id) ? `✓ Approved: ${pl.name}` : pl.name}</div>
                          <div className="text-amber-400 mt-1">{pl.cost.toLocaleString()} g₦ (90s Design)</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedMapBuilding === "Builder_Yard" && (
                  <div className="p-4 bg-slate-900 border border-amber-500/40 rounded-2xl space-y-3">
                    <h3 className="font-extrabold text-sm text-amber-400">🏗️ Inside Berger Construction & Builders Yard (2h – 8h Build Timers)</h3>
                    <p className="text-slate-400">Requires Raw Land + Architect Plan. Once built, your house is added to your Landlord portfolio!</p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <button
                        disabled={!!timers.build_house}
                        onClick={() => {
                          if (!architectPlans.includes("Plan_4Flat")) return setLogMessage("❌ Get the 4-Flat Architect Plan in Yaba first!");
                          if (spendMoney(4500000)) {
                            startCooldown("build_house", 7200); // 2-Hour Real Construction Timer!
                            const targetArea = rawLandsOwned[0] || "Berger";
                            setOwnedProperties((p) => [
                              ...p,
                              { name: `Custom Built 4-Flat Estate (${targetArea})`, area: targetArea, roomsAvailable: 4, listedPricePerRoom: 300000, isListedWithAgent: false },
                            ]);
                            setLogMessage(`🏗️ Builders mobilized! Constructing 4-Flat Estate in ${targetArea} (2-Hour Build Timer Started & Added to Portfolio)!`);
                          }
                        }}
                        className="p-3 bg-amber-500 text-slate-950 font-extrabold rounded-xl"
                      >
                        {timers.build_house ? `🏗️ Building (${formatSecs(timers.build_house)})` : "Construct 4-Flat Estate (4.5M g₦ • 2 Hours)"}
                      </button>

                      <button
                        disabled={!!timers.build_duplex}
                        onClick={() => {
                          if (!architectPlans.includes("Plan_Duplex")) return setLogMessage("❌ Get the Twin Duplex Architect Plan in Yaba first!");
                          if (spendMoney(9500000)) {
                            startCooldown("build_duplex", 14400); // 4-Hour Real Construction Timer!
                            const targetArea = rawLandsOwned[0] || "Lekki";
                            setOwnedProperties((p) => [
                              ...p,
                              { name: `Custom Twin Duplex (${targetArea})`, area: targetArea, roomsAvailable: 6, listedPricePerRoom: 450000, isListedWithAgent: false },
                            ]);
                            setLogMessage(`🏗️ Builders constructing Twin Duplex in ${targetArea} (4-Hour Build Timer)!`);
                          }
                        }}
                        className="p-3 bg-emerald-500 text-slate-950 font-extrabold rounded-xl"
                      >
                        {timers.build_duplex ? `🏗️ Building (${formatSecs(timers.build_duplex)})` : "Construct Twin Duplex (9.5M g₦ • 4 Hours)"}
                      </button>
                    </div>
                  </div>
                )}

                {/* 7. YABA BLUEPRINT & PROFESSIONAL CERTIFICATIONS INSTITUTE (KIOSK 400K VS EATERY 900K VS MEGA 1.8M!) */}
                {selectedMapBuilding === "Blueprint_Academy" && (
                  <div className="p-4 bg-slate-900 border border-emerald-500/40 rounded-2xl space-y-4">
                    <h3 className="font-extrabold text-sm text-emerald-400">
                      📘 Inside Yaba Business Blueprints & Professional Certifications Institute
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <div className="font-bold text-amber-300 uppercase">Tiered Business Blueprints (By Capacity)</div>
                        {[
                          { id: "BP_Food_Kiosk", name: "🏪 Roadside Food Kiosk Blueprint (Cap: 2 Staff / 15 Cust)", cost: 400000 },
                          { id: "BP_Small_Eatery", name: "🍲 Small Neighborhood Eatery Blueprint (Cap: 6 Staff / 45 Cust)", cost: 900000 },
                          { id: "BP_Mega_Rest", name: "🏢 Mega Fast-Food Restaurant Blueprint (Cap: 15 Staff / 120 Cust)", cost: 1800000 },
                          { id: "BP_Poster_Kiosk", name: "🖨️ Small Digital Poster Kiosk Blueprint (Cap: 2 Staff)", cost: 850000 },
                          { id: "BP_Mega_Agency", name: "🎨 Full Media & Billboard Agency Blueprint (Cap: 12 Staff)", cost: 1600000 },
                        ].map((bp) => (
                          <button
                            key={bp.id}
                            disabled={ownedBlueprints.includes(bp.id)}
                            onClick={() => {
                              if (spendMoney(bp.cost)) {
                                setOwnedBlueprints((p) => [...p, bp.id]);
                                setCertificatesList((c) => [...c, bp.name]);
                                setLogMessage(`📘 Mastered ${bp.name}! You can now launch this business in the CAC/Empire tab.`);
                              }
                            }}
                            className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center disabled:opacity-40"
                          >
                            <span className="font-bold text-left">{ownedBlueprints.includes(bp.id) ? `✓ ${bp.name}` : bp.name}</span>
                            <span className="text-amber-400 font-extrabold shrink-0 ml-2">{(bp.cost / 1000).toFixed(0)}k g₦</span>
                          </button>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <div className="font-bold text-cyan-300 uppercase">High-Paying Professional Courses (ICAN, PMP, CISCO)</div>
                        {[
                          { id: "ICAN", name: "📊 ICAN Chartered Accountant Cert", cost: 350000 },
                          { id: "PMP", name: "📋 PMP Project Management Professional", cost: 420000 },
                          { id: "CISCO", name: "🌐 CISCO Senior Network & Cloud Architect", cost: 500000 },
                          { id: "HSE", name: "🦺 Oil & Gas Offshore HSE Level 3", cost: 650000 },
                        ].map((pc) => (
                          <button
                            key={pc.id}
                            disabled={professionalCerts.includes(pc.id)}
                            onClick={() => {
                              if (spendMoney(pc.cost)) {
                                setProfessionalCerts((p) => [...p, pc.id]);
                                setCertificatesList((c) => [...c, pc.name]);
                                setCvScore((s) => Math.min(100, s + 25));
                                setLogMessage(`🏅 Earned ${pc.name}! CV Score +25% & Executive jobs unlocked.`);
                              }
                            }}
                            className="w-full p-2.5 bg-slate-950 border border-cyan-800/60 rounded-xl flex justify-between items-center disabled:opacity-40"
                          >
                            <span className="font-bold text-left">{professionalCerts.includes(pc.id) ? `✓ ${pc.name}` : pc.name}</span>
                            <span className="text-cyan-400 font-extrabold shrink-0 ml-2">{(pc.cost / 1000).toFixed(0)}k g₦</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 8. YABA ACADEMIC CAMPUS OR LEKKI EMBASSY (ND -> HND -> BSc -> MASTERS -> PHD DOCTORATE!) */}
                {(selectedMapBuilding === "Academic_Campus" || selectedMapBuilding === "Foreign_Embassy") && (
                  <div className="p-4 bg-slate-900 border border-amber-500/40 rounded-2xl space-y-3">
                    <h3 className="font-extrabold text-sm text-amber-400">
                      🎓 {selectedMapBuilding === "Academic_Campus" ? "Yaba Polytechnic, University & Postgraduate School" : "Lekki Foreign Embassy (Study Abroad M.Sc & Ph.D)"}
                    </h3>
                    <div className="grid sm:grid-cols-3 gap-2.5">
                      {[
                        { name: "Polytechnic ND", cost: 220000, classes: 6, req: null },
                        { name: "Polytechnic HND", cost: 350000, classes: 6, req: "Polytechnic ND" },
                        { name: "University B.Sc", cost: 680000, classes: 8, req: null },
                        { name: "Masters Degree (M.Sc)", cost: 1400000, classes: 8, req: "University B.Sc" },
                        { name: "Doctorate Degree (Ph.D)", cost: 2800000, classes: 10, req: "Masters Degree (M.Sc)" },
                      ].map((deg, i) => (
                        <div key={i} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                          <div className="font-bold text-white">{deg.name}</div>
                          <div className="text-amber-400 font-bold">{deg.cost.toLocaleString()} g₦ ({deg.classes} Lectures)</div>
                          <button
                            onClick={() => {
                              if (deg.req && !certificatesList.includes(deg.req) && !certificatesList.includes("Polytechnic HND")) {
                                return setLogMessage(`❌ Requires ${deg.req} (or HND) first!`);
                              }
                              if (spendMoney(deg.cost)) {
                                setEnrolledProgram({ name: deg.name, totalClasses: deg.classes, completedClasses: 0 });
                                setActiveTab("school");
                                setLogMessage(`🎓 Enrolled in ${deg.name}! Attend your lectures in the School tab.`);
                              }
                            }}
                            className="w-full py-1.5 bg-indigo-600 text-white font-bold rounded-lg"
                          >
                            Enroll Now
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* OTHER CLICKED BUILDINGS QUICK HANDLERS */}
                {selectedMapBuilding === "Gas_Kitchen_Shop" && (
                  <div className="p-4 bg-slate-900 border border-orange-500/40 rounded-2xl flex flex-wrap gap-3">
                    <button onClick={() => { if (spendMoney(35000)) { setHasCookingStove(true); setGasLevel(60); setLogMessage("🔥 Bought Stove & Gas!"); }}} className="px-4 py-2 bg-orange-500 text-slate-950 font-bold rounded-xl">Buy Gas Stove (35k)</button>
                    <button onClick={() => { if (spendMoney(12000)) { setGasLevel(100); setLogMessage("⛽ Gas Refilled to 100%!"); }}} className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl">Refill Gas (12k)</button>
                    <button onClick={() => { if (spendMoney(10000)) { setRawFoodServings((r) => r + 5); setLogMessage("🌾 Bought 5 Raw Food Meals!"); }}} className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl">Buy 5 Raw Meals (10k)</button>
                  </div>
                )}

                {selectedMapBuilding === "Furniture_Shop" && (
                  <div className="p-4 bg-slate-900 border border-amber-500/40 rounded-2xl flex flex-wrap gap-3">
                    <button onClick={() => { if (spendMoney(30000)) { setBedTier("Foam_Mattress"); setLogMessage("🛏️ Bought Foam Mattress!"); }}} className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl">Foam Mattress (30k)</button>
                    <button onClick={() => { if (spendMoney(95000)) { setBedTier("King_Bed"); setLogMessage("👑 Bought Royal King Bed!"); }}} className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl">Royal King Bed (95k)</button>
                    <button onClick={() => { if (spendMoney(55000)) { setChairTier("Cushion_Sofa"); setLogMessage("🛋️ Bought Cushion Sofa!"); }}} className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl">Cushion Sofa Set (55k)</button>
                  </div>
                )}

                {selectedMapBuilding === "Electronics_Shop" && (
                  <div className="p-4 bg-slate-900 border border-cyan-500/40 rounded-2xl flex flex-wrap gap-3">
                    <button onClick={() => { if (spendMoney(85000)) { setTvTier("32-Inch LED TV"); setLogMessage("📺 Bought 32-Inch TV!"); }}} className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl">32" LED TV (85k)</button>
                    <button onClick={() => { if (spendMoney(175000)) { setTvTier("55-Inch 4K Smart TV"); setLogMessage("📺 Bought 55-Inch Smart TV!"); }}} className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl">55" Smart TV (175k)</button>
                    <button onClick={() => { if (spendMoney(420000)) { setTvTier("85-Inch OLED Cinema"); setLogMessage("🎬 Bought 85-Inch OLED TV!"); }}} className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl">85" OLED Cinema (420k)</button>
                  </div>
                )}

                {selectedMapBuilding === "CAC_Office" && (
                  <div className="p-4 bg-slate-900 border border-amber-500/40 rounded-2xl space-y-2">
                    <h3 className="font-bold text-amber-400">🏛️ Surulere CAC Corporate Registry</h3>
                    <div className="flex gap-2">
                      <input type="text" placeholder="Company Name..." value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-white" />
                      <button onClick={() => { if (companyName && spendMoney(650000)) { setCacStatus("Approved"); setCertificatesList((c) => [...c, `CAC: ${companyName}`]); setLogMessage(`✅ CAC Registered for ${companyName}!`); }}} className="px-4 py-1.5 bg-amber-500 text-slate-950 font-extrabold rounded">Register CAC (650k g₦)</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* =====================================================================
            TAB 2: 🏠 MY HOME (INDOOR VIEW + 8-WEEK RENT PAYMENT)
           ===================================================================== */}
        {activeTab === "home" && (
          <div className="grid md:grid-cols-3 gap-4 text-xs">
            <div className="md:col-span-2 bg-slate-900 border-2 border-slate-700 rounded-2xl p-6 space-y-4">
              {area !== shelterArea ? (
                <div className="text-center py-12 space-y-3">
                  <div className="text-4xl">🚌</div>
                  <h3 className="font-extrabold text-base text-rose-400">You Are Currently in {area}, Not at Your Home in {shelterArea}!</h3>
                  <p className="text-slate-400">Use the Map tab to commute back to {shelterArea} to enter your house.</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="font-extrabold text-base text-emerald-400">🏠 Inside {shelterType} ({shelterArea})</h2>
                      <p className="text-slate-400">Status: {ownershipMode} • Bed: {bedTier} • Seating: {chairTier} • TV: {tvTier}</p>
                    </div>
                    {ownershipMode === "Rented" && (
                      <button
                        onClick={() => {
                          if (spendMoney(rentPer8Weeks)) {
                            setWeeksUntilRentDue(8);
                            setLogMessage(`🏠 Paid 8-Week Rent (${rentPer8Weeks.toLocaleString()} g₦)!`);
                          }
                        }}
                        className="px-3 py-2 bg-rose-600 text-white font-bold rounded-xl"
                      >
                        Pay 8-Week Rent ({rentPer8Weeks.toLocaleString()} g₦)
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <button
                      onClick={() => {
                        const cap = bedTier === "Bare_Floor" ? 60 : bedTier === "Foam_Mattress" ? 85 : 100;
                        setEnergy(cap);
                        setGameDay((d) => d + 1);
                        setLogMessage(`🛌 Slept overnight! Energy restored to ${cap}%.`);
                      }}
                      className="py-3 bg-indigo-600 text-white font-extrabold rounded-xl"
                    >
                      🛌 Sleep Overnight
                    </button>
                    <button
                      onClick={() => {
                        if (!hasCookingStove || gasLevel < 10 || rawFoodServings < 1) {
                          return setLogMessage("❌ Need Stove, 10% Gas & 1 Raw Food (Buy at Oshodi Market on the Map)!");
                        }
                        setGasLevel((g) => g - 10);
                        setRawFoodServings((r) => r - 1);
                        setHunger(100);
                        setEnergy((e) => Math.min(100, e + 40));
                        setLogMessage("🍳 Cooked delicious meal at home!");
                      }}
                      className="py-3 bg-emerald-500 text-slate-950 font-extrabold rounded-xl"
                    >
                      🍳 Cook at Home ({rawFoodServings} Meals Left)
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
              <h3 className="font-bold text-sm">Garage & Active Car</h3>
              <div>Active Car: <strong className="text-emerald-400">{activeCar}</strong></div>
              <div>License: <strong>{hasDriversLicense ? "Verified" : "None (Visit Oshodi)"}</strong></div>
              {carsOwned.map((c) => (
                <button key={c} onClick={() => setActiveCar(c)} className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-left">
                  🚗 Drive: {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 3: 💼 JOBS (REQUIRES PROFESSIONAL CERTS & DEGREES!)
           ===================================================================== */}
        {activeTab === "jobs" && (
          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <h2 className="font-bold text-sm text-amber-400">🧱 Area-Locked Street Hustles</h2>
              {[
                { name: "Oshodi Market Carrier", loc: "Oshodi" as AreaName, pay: 6500 },
                { name: "Berger Cement Offloading", loc: "Berger" as AreaName, pay: 9000 },
                { name: "Yaba Kitchen & Plate Washing", loc: "Yaba" as AreaName, pay: 8000 },
                { name: "Lekki Duplex Site Bricklayer", loc: "Lekki" as AreaName, pay: 14000 },
              ].map((h, i) => (
                <div key={i} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                  <div>
                    <div className="font-bold">{h.name} (📍 {h.loc})</div>
                    <div className="text-emerald-400">+{h.pay.toLocaleString()} g₦</div>
                  </div>
                  <button
                    onClick={() => {
                      if (area !== h.loc) return setLogMessage(`🚌 Travel to ${h.loc} on the Map first!`);
                      if (energy < 25) return setLogMessage("⚠️ Need 25% Energy!");
                      setEnergy((e) => e - 25);
                      setEarnedBalance((p) => p + h.pay);
                      setLogMessage(`✅ Worked ${h.name} in ${h.loc}! +${h.pay.toLocaleString()} g₦.`);
                    }}
                    className="px-3 py-1.5 bg-amber-500 text-slate-950 font-extrabold rounded-lg"
                  >
                    {area === h.loc ? "Work Shift" : `Go to ${h.loc}`}
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <h2 className="font-bold text-sm text-cyan-400">🏢 Executive & Professional Career Board</h2>
              {[
                { title: "Junior Tech Officer", comp: "Yaba Tech", loc: "Yaba" as AreaName, deg: "Polytechnic ND", cert: null, pay: 75000 },
                { title: "Chartered Bank Auditor", comp: "Zenith Lekki", loc: "Lekki" as AreaName, deg: "University B.Sc", cert: "ICAN", pay: 320000 },
                { title: "Senior Project Director", comp: "Julius Berger", loc: "Berger" as AreaName, deg: "Masters Degree (M.Sc)", cert: "PMP", pay: 580000 },
                { title: "Chief Research Fellow & VP", comp: "Chevron VI", loc: "Lekki" as AreaName, deg: "Doctorate Degree (Ph.D)", cert: "HSE", pay: 1100000 },
              ].map((j, i) => (
                <div key={i} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white">{j.title} — {j.comp} (📍 {j.loc})</div>
                    <div className="text-[10px] text-amber-300">
                      Req: {j.deg} {j.cert && `+ ${j.cert} Pro Cert`} • Pays {j.pay.toLocaleString()} g₦
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (area !== j.loc) return setLogMessage(`🚌 Travel to ${j.loc} first!`);
                      if (!certificatesList.includes(j.deg)) return setLogMessage(`❌ Requires ${j.deg}!`);
                      if (j.cert && !professionalCerts.includes(j.cert)) return setLogMessage(`❌ Requires ${j.cert} Professional Certificate from Yaba Institute!`);
                      setEarnedBalance((p) => p + j.pay);
                      setLogMessage(`💰 Worked as ${j.title} at ${j.comp}! Earned +${j.pay.toLocaleString()} g₦!`);
                    }}
                    className="px-3 py-1.5 bg-cyan-500 text-slate-950 font-extrabold rounded-lg"
                  >
                    Work
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 4: 🎓 ACTIVE LECTURE PROGRESS (ND, HND, BSc, MASTERS, PHD)
           ===================================================================== */}
        {activeTab === "school" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
            <h2 className="font-bold text-sm text-amber-400">🎓 Active Academic Lecture Hall</h2>
            {enrolledProgram ? (
              <div className="p-4 bg-indigo-950/40 border border-indigo-500 rounded-xl space-y-3">
                <div className="font-extrabold text-base">Currently Studying: {enrolledProgram.name}</div>
                <div>Lectures Completed: {enrolledProgram.completedClasses} / {enrolledProgram.totalClasses}</div>
                <button
                  disabled={!!timers.lec_cd}
                  onClick={() => {
                    startCooldown("lec_cd", 60);
                    const nextC = enrolledProgram.completedClasses + 1;
                    if (nextC >= enrolledProgram.totalClasses) {
                      setEducation(enrolledProgram.name);
                      setCertificatesList((c) => [...c, enrolledProgram.name]);
                      setEnrolledProgram(null);
                      setLogMessage(`🎓 Conferred with ${enrolledProgram.name}!`);
                    } else {
                      setEnrolledProgram({ ...enrolledProgram, completedClasses: nextC });
                      setLogMessage(`📖 Attended Lecture ${nextC}/${enrolledProgram.totalClasses}!`);
                    }
                  }}
                  className="px-5 py-2.5 bg-emerald-500 text-slate-950 font-extrabold rounded-xl"
                >
                  {timers.lec_cd ? `⏳ Lecture in Progress (${formatSecs(timers.lec_cd)})` : "Attend Next Lecture (60s)"}
                </button>
              </div>
            ) : (
              <p className="text-slate-400">
                To enroll in <strong>ND, HND, B.Sc, Masters (M.Sc), Doctorate (Ph.D), or ICAN/PMP/Blueprint courses</strong>, travel to <strong>Yaba</strong> (or <strong>Lekki Foreign Embassy</strong>) on the Map and click the Campus building!
              </p>
            )}
          </div>
        )}

        {/* =====================================================================
            TAB 5: 🏪 KIOSKS VS SMALL EATERIES VS MEGA RESTAURANTS (CAPACITY CAPS!)
           ===================================================================== */}
        {activeTab === "empire" && (
          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-amber-400">🏪 Launch Kiosks, Eateries & Agencies (Tiered Capacity)</h2>
              <p className="text-slate-400">
                Higher tiers hold more staff and customers! Requires the matching Blueprint from Yaba Institute.
              </p>
              {[
                { name: "Roadside Food Kiosk", bp: "BP_Food_Kiosk", cost: 350000, maxStaff: 2, maxCust: 15, rev: 45000 },
                { name: "Small Neighborhood Eatery", bp: "BP_Small_Eatery", cost: 850000, maxStaff: 6, maxCust: 45, rev: 135000 },
                { name: "Mega Fast-Food Restaurant", bp: "BP_Mega_Rest", cost: 2200000, maxStaff: 15, maxCust: 120, rev: 380000 },
                { name: "Digital Poster Kiosk", bp: "BP_Poster_Kiosk", cost: 650000, maxStaff: 2, maxCust: 20, rev: 90000 },
                { name: "Full Media & Billboard Agency", bp: "BP_Mega_Agency", cost: 1900000, maxStaff: 12, maxCust: 100, rev: 340000 },
              ].map((b, i) => (
                <div key={i} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white">{b.name} (in {area})</div>
                    <div className="text-[10px] text-slate-400">
                      Cap: {b.maxStaff} Staff / {b.maxCust} Cust • Cost: {b.cost.toLocaleString()} g₦
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (!ownedBlueprints.includes(b.bp)) return setLogMessage(`❌ Buy ${b.bp} at Yaba Institute first!`);
                      if (spendMoney(b.cost)) {
                        setActiveBusinesses((prev) => [
                          ...prev,
                          { name: b.name, area, maxStaff: b.maxStaff, hiredStaff: 1, maxCustomers: b.maxCust, revenuePerCycle: b.rev },
                        ]);
                        setLogMessage(`🏪 Opened ${b.name} in ${area}!`);
                      }
                    }}
                    className="px-3 py-1.5 bg-amber-500 text-slate-950 font-extrabold rounded-lg"
                  >
                    Open
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-emerald-400">📈 My Active Enterprises (Hire Staff to Max Capacity)</h2>
              {activeBusinesses.length === 0 ? (
                <p className="text-slate-500">No active kiosks or eateries yet.</p>
              ) : (
                activeBusinesses.map((biz, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex justify-between font-bold">
                      <span>{biz.name} ({biz.area})</span>
                      <span className="text-emerald-400">Staff: {biz.hiredStaff}/{biz.maxStaff} • Max Cust: {biz.maxCustomers}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        disabled={biz.hiredStaff >= biz.maxStaff}
                        onClick={() => {
                          if (spendMoney(25000)) {
                            const updated = [...activeBusinesses];
                            updated[idx].hiredStaff += 1;
                            setActiveBusinesses(updated);
                            setLogMessage(`👥 Hired +1 Staff for ${biz.name}!`);
                          }
                        }}
                        className="px-3 py-1 bg-indigo-600 text-white font-bold rounded-lg disabled:opacity-40"
                      >
                        Hire Staff (25k)
                      </button>
                      <button
                        onClick={() => {
                          const totalRev = Math.round(biz.revenuePerCycle * (biz.hiredStaff / biz.maxStaff));
                          setEarnedBalance((e) => e + totalRev);
                          setLogMessage(`💰 Collected +${totalRev.toLocaleString()} g₦ from ${biz.name} (${biz.hiredStaff}/${biz.maxStaff} staff capacity)!`);
                        }}
                        className="px-3 py-1 bg-emerald-500 text-slate-950 font-extrabold rounded-lg"
                      >
                        Collect Revenue
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 6: 🏆 PROFILE ACHIEVEMENTS & CENTRAL BANK (FROM ₦500)
           ===================================================================== */}
        {activeTab === "profile" && (
          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
              <h2 className="font-bold text-sm text-amber-400">🏆 Verified Achievements, Degrees & Assets</h2>
              {certificatesList.length === 0 ? (
                <p className="text-slate-500">Complete driving school, degrees, blueprints, or buy houses/cars to see them here!</p>
              ) : (
                certificatesList.map((c, i) => (
                  <div key={i} className="p-2 bg-emerald-950/30 border border-emerald-800 rounded-lg text-emerald-300 font-bold">
                    ✓ {c}
                  </div>
                ))
              )}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
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

      {/* 6-TAB BOTTOM NAV */}
      <nav className="fixed bottom-0 inset-x-0 bg-slate-900/95 backdrop-blur border-t border-slate-800 px-2 py-2 z-40">
        <div className="max-w-3xl mx-auto grid grid-cols-6 gap-1">
          {[

<Map className="w-4 h-4" />
{ id: "map", label: "Lagos Map", icon: },
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
