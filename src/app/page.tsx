"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { 
  Heart, Zap, Utensils, Sparkles, Tv, Home, Map,
  BedDouble, Armchair, Briefcase, GraduationCap, MapPin, 
  Play, Lock, Building2, Car, Vote, Landmark, Clock, 
  Award, Wrench, Fuel, Droplets, ZoomOut, ZoomIn, FileText, Flame
} from "lucide-react";

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

export default function LagosEmpireCompleteGame() {
  // 1. ONBOARDING
  const [isCreated, setIsCreated] = useState(false);
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");

  // 2. 15-MINUTE RUNNING CLOCK, WEATHER & 8-WEEK RENT CYCLE
  const [gameHour, setGameHour] = useState(8);
  const [gameMinute, setGameMinute] = useState(0);
  const [gameDay, setGameDay] = useState(1);
  const [gameWeek, setGameWeek] = useState(1);
  const [weeksUntilRentDue, setWeeksUntilRentDue] = useState(8);
  const [weather, setWeather] = useState("Sunny 32°C");

  // 3. CENTRAL BANK 300M RESERVE & DUAL WALLETS
  const [centralBankReserve, setCentralBankReserve] = useState(300000000);
  const [starterBalance, setStarterBalance] = useState(50000);
  const [earnedBalance, setEarnedBalance] = useState(0);
  const [bankLoanDebt, setBankLoanDebt] = useState(0);

  // 4. LOCATION, MAP & HUMAN SURVIVAL STATS
  const [area, setArea] = useState<AreaName>("Oshodi");
  const [isMapZoomedOut, setIsMapZoomedOut] = useState(false);
  const [selectedMapBuilding, setSelectedMapBuilding] = useState<string>("None");
  const [health, setHealth] = useState(90);
  const [energy, setEnergy] = useState(60); // Capped at 60% on Bare Floor, 85% Foam, 100% King Bed!
  const [hunger, setHunger] = useState(80);
  const [weight, setWeight] = useState(68.0);
  const [steeze, setSteeze] = useState(5);
  const [citizenPoints, setCitizenPoints] = useState(15);

  // 5. MULTI-TIMER ENGINE (60s - 120s Minimum Countdowns)
  const [timers, setTimers] = useState<Record<string, number>>({});
  const startCooldown = (key: string, seconds: number) => {
    setTimers((prev) => ({ ...prev, [key]: seconds }));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Tick all active timers every 1 second
      setTimers((prev) => {
        const next: Record<string, number> = {};
        for (const k in prev) {
          if (prev[k] > 1) next[k] = prev[k] - 1;
        }
        return next;
      });

      // Advance 15-minute clock & natural stat decay
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

        // Hourly Belly & Energy decay (damages Health if left at 0%)
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
    }, 1000);
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

  // 6. FULL "MY HOME" INTERIOR STATE (PAINTING, BED, SOFA, TV, LAGOSFLIX, STOVE & GAS)
  const [shelterType, setShelterType] = useState("Unpainted Single Room");
  const [shelterArea, setShelterArea] = useState<AreaName>("Oshodi");
  const [ownershipMode, setOwnershipMode] = useState<"Rented" | "Bought_Owned">("Rented");
  const [rentPer8Weeks, setRentPer8Weeks] = useState(80000);
  const [parkingSlots, setParkingSlots] = useState(0);
  const [wallColor, setWallColor] = useState("Unplastered");
  const [bedTier, setBedTier] = useState("Bare_Floor"); // Bare_Floor (60% cap) | Foam_Mattress (85% cap) | King_Bed (100% cap)
  const [chairTier, setChairTier] = useState("None");
  const [tvTier, setTvTier] = useState("None");
  const [hasLagosFlix, setHasLagosFlix] = useState(false);
  const [showTvModal, setShowTvModal] = useState(false);
  const [hasCookingStove, setHasCookingStove] = useState(false);
  const [gasLevel, setGasLevel] = useState(0);
  const [rawFoodServings, setRawFoodServings] = useState(0);

  // Landlord Properties & Raw Land Construction
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

  // 7. DRIVING LICENSE & CARS (HIDDEN UNTIL BOUGHT!)
  const [hasDriversLicense, setHasDriversLicense] = useState(false);
  const [drivingLessonsDone, setDrivingLessonsDone] = useState(0);
  const [carsOwned, setCarsOwned] = useState<string[]>([]);
  const [activeCar, setActiveCar] = useState<string>("None");
  const [carPetrol, setCarPetrol] = useState(100);
  const [carRadiatorWater, setCarRadiatorWater] = useState(100);
  const [carEngineHealth, setCarEngineHealth] = useState(100);

  // 8. STRICT EDUCATION PIPELINE (10 LECTURES EACH, TIERED ENERGY DRAIN, ABROAD VISA & DEADLINES)
  const [completedDegrees, setCompletedDegrees] = useState<string[]>([]);
  const [professionalCerts, setProfessionalCerts] = useState<string[]>([]);
  const [ownedBlueprints, setOwnedBlueprints] = useState<string[]>([]);
  const [enrolledProgram, setEnrolledProgram] = useState<{
    id: string;
    name: string;
    totalClasses: number;
    completedClasses: number;
    energyPerLecture: number;
    timerSeconds: number;
    deadlineDaysLeft: number;
  } | null>(null);
  const [abroadVisaStatus, setAbroadVisaStatus] = useState<"None" | "Processing" | "Approved">("None");
  const [cvScore, setCvScore] = useState(0);
  const [outfit, setOutfit] = useState("Singlet & Bathroom Slippers");
  const [hasCorporateSuit, setHasCorporateSuit] = useState(false);

  // 9. JOBS, CORPORATE ATTENDANCE & SOCIAL GIGS
  const [hustlesDoneToday, setHustlesDoneToday] = useState(0);
  const [employedJob, setEmployedJob] = useState<{
    title: string;
    company: string;
    area: AreaName;
    payPer3Days: number;
  } | null>(null);
  const [daysWorkedThisCycle, setDaysWorkedThisCycle] = useState(0);
  const [workedOfficeToday, setWorkedOfficeToday] = useState(false);
  const [gigProofInputs, setGigProofInputs] = useState<Record<string, string>>({});

  // 10. CAC, C-OF-O & TIERED KIOSKS / EATERIES / AGENCIES
  const [companyName, setCompanyName] = useState("");
  const [cacStatus, setCacStatus] = useState<"None" | "Processing" | "Approved">("None");
  const [cofoStatus, setCofoStatus] = useState<"None" | "Processing" | "Approved">("None");
  const [activeBusinesses, setActiveBusinesses] = useState<{
    name: string;
    area: AreaName;
    maxStaff: number;
    hiredStaff: number;
    maxCustomers: number;
    revenuePerCycle: number;
  }[]>([]);

  // 11. POLITICS & COURTSHIP (10 DATES AT +10% BOND)
  const [partyStatus, setPartyStatus] = useState<"None" | "Pending_Approval" | "Member_JPC" | "Member_JSTD">("None");
  const [nominationStatus, setNominationStatus] = useState<"None" | "Form_Purchased" | "Submitted_Verified">("None");
  const [cityBillboardText, setCityBillboardText] = useState("CITY BILLBOARD AVAILABLE — Hire a Design Agency in Politics Tab!");
  const [hasVoted, setHasVoted] = useState(false);
  const [maritalStatus, setMaritalStatus] = useState<"Single" | "Courting" | "Married">("Single");
  const [partnerName, setPartnerName] = useState("None");
  const [relationshipBond, setRelationshipBond] = useState(0);

  const [activeTab, setActiveTab] = useState<"map" | "home" | "jobs" | "school" | "empire" | "politics" | "profile">("home");
  const [logMessage, setLogMessage] = useState(
    "Welcome to Lagos! Start inside 'My Home' in Oshodi, or click 'Lagos Map' to travel and enter buildings across the city."
  );

  const maxEnergyCap = bedTier === "Bare_Floor" ? 60 : bedTier === "Foam_Mattress" ? 85 : 100;

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
      trekHealthLoss: Math.min(10, 3 * dist),
      petrolUsed: 8 * dist,
      waterUsed: 6 * dist,
      wearTear: 4 * dist,
    };
  };

  const handleDriveCarTo = (dest: AreaName) => {
    if (carsOwned.length === 0 || activeCar === "None") return;
    if (!hasDriversLicense) return setLogMessage("🚓 FRSC ARREST WARNING: Get your Driver's License at Oshodi Driving School first!");
    const costs = getTransportCosts(dest);
    if (carPetrol < costs.petrolUsed) return setLogMessage(`⛽ Low Petrol (${carPetrol}%)! Refill at a Filling Station.`);
    if (carRadiatorWater < costs.waterUsed) return setLogMessage(`💧 Radiator Water low (${carRadiatorWater}%)! Add water before engine overheats.`);
    if (carEngineHealth < 30) return setLogMessage(`🔧 Engine health critical (${carEngineHealth}%)! Visit Oshodi Mechanic.`);

    startCooldown("commute", 20);
    setCarPetrol((p) => Math.max(0, p - costs.petrolUsed));
    setCarRadiatorWater((w) => Math.max(0, w - costs.waterUsed));
    setCarEngineHealth((h) => Math.max(0, h - costs.wearTear));
    setArea(dest);
    setSelectedMapBuilding("None");
    setIsMapZoomedOut(false);
    setLogMessage(`🚗 Drove ${activeCar} to ${dest}! (Petrol -${costs.petrolUsed}%, Water -${costs.waterUsed}%, Engine: ${carEngineHealth - costs.wearTear}%)`);
  };

  if (!isCreated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border-2 border-emerald-500 rounded-2xl p-6 shadow-2xl">
          <div className="inline-block px-3 py-1 bg-emerald-500 text-slate-950 text-xs font-extrabold rounded-full mb-3">
            LAGOS EMPIRE — COMPLETE FULL-FEATURE EDITION
          </div>
          <h1 className="text-2xl font-extrabold mb-2">Start Your Life From Scratch</h1>
          <p className="text-slate-400 text-sm mb-6">
            Begin uneducated in an unpainted single room in Oshodi with 50,000 g₦. Paint your home, mount a TV, cook with gas, complete 10-lecture degrees (ND to Ph.D), and build your empire.
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
            Enter My Home in Oshodi (50,000 g₦ Stipend)
          </button>
        </div>
      </div>
    );
  }

  const wallBgMap: Record<string, string> = {
    Unplastered: "bg-stone-800 border-stone-700",
    Cream: "bg-amber-950/70 border-amber-700/50",
    Emerald: "bg-emerald-950/80 border-emerald-700/50",
    RoyalBlue: "bg-blue-950/80 border-blue-700/50",
  };

  const areaBuildingsMap: Record<AreaName, { id: string; icon: string; name: string; desc: string }[]> = {
    Oshodi: [
      { id: "Driving_School", icon: "🪪", name: "FRSC & Driving School", desc: "3 Lessons + License" },
      { id: "Mechanic_Shop", icon: "🔧", name: "Oshodi Mechanic & Water", desc: "Fix Engine & Radiator" },
      { id: "Gas_Kitchen_Shop", icon: "🔥", name: "Oshodi Market & Gas Depot", desc: "Stove, Gas & Raw Food" },
      { id: "Agent_Office", icon: "🏘️", name: "Oshodi Estate Agent", desc: "Rent/Buy or List Rooms" },
      { id: "Eatery_Social", icon: "🍲", name: "Oshodi Bukka & Lounge", desc: "Eat & Meet Partners" },
    ],
    Berger: [
      { id: "Auto_Dealership", icon: "🚗", name: "Berger Motor Fair (10 Cars)", desc: "Buy Vehicles" },
      { id: "Filling_Station", icon: "⛽", name: "NNPC Filling Station", desc: "Petrol & Water" },
      { id: "Builder_Yard", icon: "🏗️", name: "Julius Berger Builders", desc: "Construct Houses (2h-8h)" },
      { id: "Furniture_Shop", icon: "🛏️", name: "Mattress & Sofa Showroom", desc: "Foam, King Bed & Sofa" },
      { id: "Agent_Office", icon: "🏘️", name: "Berger Estate Agent", desc: "Rent/Buy or List Rooms" },
    ],
    Yaba: [
      { id: "Academic_Campus", icon: "🎓", name: "Yaba Poly, Uni & PhD Campus", desc: "10-Lecture Degrees" },
      { id: "Blueprint_Academy", icon: "📘", name: "Blueprint & Pro Cert Institute", desc: "Kiosk/Eatery BPs & ICAN" },
      { id: "Architect_Firm", icon: "📐", name: "Yaba Architectural Studio", desc: "Draw House Plans" },
      { id: "Electronics_Shop", icon: "📺", name: "Yaba TV & Electronics Plaza", desc: "4 TV Tiers" },
      { id: "Agent_Office", icon: "🏘️", name: "Yaba Estate Agent", desc: "Rent/Buy or List Rooms" },
    ],
    Surulere: [
      { id: "CAC_Office", icon: "🏛️", name: "CAC Corporate Registry", desc: "Register Company (90s)" },
      { id: "Eatery_Social", icon: "🍗", name: "Surulere Mall & Social Lounge", desc: "Dates & Courting" },
      { id: "Agent_Office", icon: "🏘️", name: "Surulere Estate Agent", desc: "Rent/Buy or List Rooms" },
    ],
    Lekki: [
      { id: "Lands_Bureau", icon: "📜", name: "Lekki Lands Bureau & C-of-O", desc: "Buy Raw Land & C-of-O" },
      { id: "Foreign_Embassy", icon: "✈️", name: "Foreign Embassy (Study Abroad)", desc: "Visa, Abroad MSc & PhD" },
      { id: "Agent_Office", icon: "🏰", name: "Lekki Luxury Estate Agent", desc: "Duplexes & Landlord Form" },
      { id: "Filling_Station", icon: "⛽", name: "Lekki Fuel & Service Station", desc: "Petrol & Radiator Water" },
      { id: "Eatery_Social", icon: "🥂", name: "Lekki VIP Lounge & Church", desc: "Meet High-Value Partners" },
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
                • 🏠 Home: {shelterType} ({shelterArea})
                • 🎓 {completedDegrees[completedDegrees.length - 1] || "Uneducated"}
                {carsOwned.length > 0 && ` • 🚗 Driving: ${activeCar}`}
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
        {/* HUMAN SURVIVAL METERS (CAR METERS ONLY APPEAR AFTER BUYING A CAR!) */}
        <div className={`grid grid-cols-2 ${carsOwned.length > 0 ? "sm:grid-cols-7" : "sm:grid-cols-4"} gap-2 bg-slate-900 border border-slate-800 rounded-2xl p-3`}>
          <StatBar icon={<Heart className="w-3.5 h-3.5 text-rose-400" />} label="Health" value={`${health}%`} pct={health} color="bg-rose-500" />
          <StatBar icon={<Zap className="w-3.5 h-3.5 text-amber-400" />} label={`Energy (Cap ${maxEnergyCap}%)`} value={`${energy}%`} pct={energy} color="bg-amber-500" />
          <StatBar icon={<Utensils className="w-3.5 h-3.5 text-orange-400" />} label="Belly/Diet" value={`${hunger}%`} pct={hunger} color="bg-orange-500" />
          <StatBar icon={<Sparkles className="w-3.5 h-3.5 text-cyan-400" />} label="Steeze" value={`${steeze} pts`} pct={Math.min(100, steeze)} color="bg-cyan-500" />

          {/* CAR METERS: STRICTLY HIDDEN UNTIL PLAYER BUYS AT LEAST 1 CAR! */}
          {carsOwned.length > 0 && (
            <>
              <StatBar icon={<Fuel className="w-3.5 h-3.5 text-emerald-400" />} label="Car Petrol" value={`${carPetrol}%`} pct={carPetrol} color="bg-emerald-500" />
              <StatBar icon={<Droplets className="w-3.5 h-3.5 text-cyan-400" />} label="Radiator H2O" value={`${carRadiatorWater}%`} pct={carRadiatorWater} color="bg-cyan-500" />
              <StatBar icon={<Wrench className="w-3.5 h-3.5 text-purple-400" />} label="Car Engine" value={`${carEngineHealth}%`} pct={carEngineHealth} color="bg-purple-500" />
            </>
          )}
        </div>

        {/* CITY BILLBOARD BANNER */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-amber-950/60 border border-amber-500/40 rounded-xl px-4 py-2 flex items-center justify-between text-xs">
          <span className="font-extrabold text-amber-300">📢 {area.toUpperCase()} BILLBOARD:</span>
          <span className="text-white font-semibold truncate ml-2">{cityBillboardText}</span>
        </div>

        {/* EVENT LOG */}
        <div className="bg-emerald-950/40 border border-emerald-800/60 text-emerald-200 px-4 py-2.5 rounded-xl text-sm font-medium">
          🔔 {logMessage}
        </div>

        {/* =====================================================================
            TAB 1: 🏠 MY HOME (FULL 2D ROOM: PAINTING, TV+LAGOSFLIX, BED, SOFA, STOVE)
           ===================================================================== */}
        {activeTab === "home" && (
          <div className="grid md:grid-cols-3 gap-4 text-xs">
            <div className={`md:col-span-2 rounded-2xl border-2 p-6 relative min-h-[390px] flex flex-col justify-between transition-all ${wallBgMap[wallColor]}`}>
              {area !== shelterArea ? (
                <div className="my-auto text-center bg-black/80 p-6 rounded-2xl border border-rose-500/50 space-y-3">
                  <div className="text-3xl">🚌</div>
                  <h3 className="font-extrabold text-base text-rose-400">You Are Currently in {area}!</h3>
                  <p className="text-slate-300">
                    Your home ({shelterType}) is located in <strong>{shelterArea}</strong>. Go to the <strong>Lagos Map</strong> tab and travel back to {shelterArea} to enter your house, cook, or sleep!
                  </p>
                  <button onClick={() => setActiveTab("map")} className="px-4 py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-xl">
                    Open Lagos Map to Travel Home
                  </button>
                </div>
              ) : (
                <>
                  {/* TOP WALL: WALL PAINT & MOUNTED TV + LAGOSFLIX */}
                  <div className="flex justify-between items-start gap-2">
                    <div className="space-y-1">
                      <span className="bg-black/65 px-3 py-1 rounded-lg font-extrabold text-emerald-300 block">
                        🏠 My Home: {shelterType} in {shelterArea} ({ownershipMode})
                      </span>
                      <span className="bg-black/65 px-3 py-1 rounded-lg text-amber-300 block">
                        🧱 Wall Paint: {wallColor} • 👔 Outfit: {outfit}
                      </span>
                      <span className="bg-black/65 px-3 py-1 rounded-lg text-slate-300 block">
                        🅿️ Compound Parking: {carsOwned.length} / {parkingSlots} Slots Used
                      </span>
                    </div>

                    {/* TV CORNER */}
                    <div className="bg-slate-950/90 border-2 border-slate-700 rounded-xl p-3 text-center min-w-[145px] shadow-xl">
                      <div className="text-2xl mb-1">{tvTier === "None" ? "📦" : "📺"}</div>
                      <div className="font-bold text-white">{tvTier === "None" ? "No TV Mounted" : tvTier}</div>
                      {tvTier !== "None" && (
                        <button
                          onClick={() => {
                            if (!hasLagosFlix) return setLogMessage("⚠️ Subscribe to LagosFlix (12,500 g₦) on the right panel first!");
                            setShowTvModal(true);
                            setEnergy((e) => Math.min(maxEnergyCap, e + 15));
                          }}
                          className="mt-2 px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 mx-auto"
                        >
                          <Play className="w-3 h-3" /> Watch LagosFlix
                        </button>
                      )}
                    </div>
                  </div>

                  {/* MIDDLE FLOOR: ILLUSTRATED BED, SOFA & COOKING STOVE */}
                  <div className="grid grid-cols-3 gap-3 my-6">
                    <div className="bg-black/50 border border-white/10 rounded-xl p-3 text-center">
                      <div className="text-2xl mb-1">{bedTier === "Bare_Floor" ? "🪵" : bedTier === "Foam_Mattress" ? "🛏️" : "👑"}</div>
                      <div className="text-[10px] text-slate-300">Sleeping Spot (Max {maxEnergyCap}% En)</div>
                      <div className="font-extrabold text-white mt-0.5">{bedTier.replace("_", " ")}</div>
                    </div>
                    <div className="bg-black/50 border border-white/10 rounded-xl p-3 text-center">
                      <div className="text-2xl mb-1">{chairTier === "None" ? "🚫" : "🛋️"}</div>
                      <div className="text-[10px] text-slate-300">Living Room Seating</div>
                      <div className="font-extrabold text-white mt-0.5">{chairTier.replace("_", " ")}</div>
                    </div>
                    <div className="bg-black/50 border border-white/10 rounded-xl p-3 text-center">
                      <div className="text-2xl mb-1">{hasCookingStove ? "🔥" : "🍳"}</div>
                      <div className="text-[10px] text-slate-300">Kitchen Corner</div>
                      <div className="font-extrabold text-white mt-0.5">
                        {hasCookingStove ? `Gas Stove (${gasLevel}% Gas)` : "No Stove"}
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM BAR: HOME COOKING & QUICK MEALS (WITH 60s TIMERS!) */}
                  <div className="bg-black/55 p-3 rounded-xl border border-white/10 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-amber-300">
                        🍳 Kitchen Stock: {rawFoodServings} Raw Meals • 🔥 Gas Cylinder: {gasLevel}%
                      </span>
                      <button
                        disabled={!!timers.cook_cd}
                        onClick={() => {
                          if (!hasCookingStove) return setLogMessage("❌ Buy a Gas Stove first (below or at Oshodi Market)!");
                          if (gasLevel < 10) return setLogMessage("❌ Gas cylinder empty! Refill gas (12,000 g₦).");
                          if (rawFoodServings < 1) return setLogMessage("❌ No raw food! Buy 5 Raw Meals (10,000 g₦).");
                          startCooldown("cook_cd", 60);
                          setGasLevel((g) => g - 10);
                          setRawFoodServings((r) => r - 1);
                          setTimeout(() => {
                            setHunger(100);
                            setEnergy((e) => Math.min(maxEnergyCap, e + 40));
                            setHealth((h) => Math.min(100, h + 10));
                            setLogMessage("🍲 Finished cooking home-made Rice, Beans & Chicken! (+40% Energy, +10% Health).");
                          }, 60000);
                        }}
                        className="px-3 py-1.5 bg-emerald-500 text-slate-950 font-extrabold rounded-lg disabled:opacity-40"
                      >
                        {timers.cook_cd ? `⏳ Cooking (${formatSecs(timers.cook_cd)})` : "🍳 Cook Meal at Home (60s Timer)"}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* RIGHT PANEL: PAINTING, FURNISHING, STOVE & RENT CONTROLS */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5 text-xs">
              <h2 className="font-bold text-sm text-emerald-400">🛠️ Furnish, Paint & Home Upgrades</h2>

              <button
                disabled={area !== shelterArea || !!timers.sleep_cd}
                onClick={() => {
                  startCooldown("sleep_cd", 60);
                  setTimeout(() => {
                    setEnergy(maxEnergyCap);
                    setGameDay((d) => d + 1);
                    setHustlesDoneToday(0);
                    setWorkedOfficeToday(false);
                    setLogMessage(`🛌 Slept overnight! Energy restored to ${maxEnergyCap}% (based on your ${bedTier}).`);
                  }, 60000);
                }}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-extrabold text-white disabled:opacity-40"
              >
                {timers.sleep_cd ? `⏳ Sleeping (${formatSecs(timers.sleep_cd)})` : `🛌 Sleep Overnight (60s • Restores ${maxEnergyCap}% En)`}
              </button>

              {ownershipMode === "Rented" && (
                <button
                  onClick={() => {
                    if (spendMoney(rentPer8Weeks)) {
                      setWeeksUntilRentDue(8);
                      setLogMessage(`🏠 Paid 8-Week Rent (${rentPer8Weeks.toLocaleString()} g₦)!`);
                    }
                  }}
                  className="w-full py-2 bg-rose-950/60 border border-rose-700 text-rose-300 font-bold rounded-xl"
                >
                  Pay 8-Week Rent ({rentPer8Weeks.toLocaleString()} g₦ • Due in {weeksUntilRentDue} Wks)
                </button>
              )}

              <div className="font-bold text-slate-400 uppercase pt-1">1. DIY Paint Walls (60s Timer, -25% Energy)</div>
              <div className="grid grid-cols-3 gap-1.5">
                {(["Cream", "Emerald", "RoyalBlue"] as const).map((col) => (
                  <button
                    key={col}
                    disabled={wallColor === col || !!timers.paint_cd}
                    onClick={() => {
                      if (energy < 25) return setLogMessage("⚠️ Need 25% Energy to paint!");
                      if (spendMoney(25000)) {
                        startCooldown("paint_cd", 60);
                        setEnergy((e) => Math.max(0, e - 25));
                        setTimeout(() => {
                          setWallColor(col);
                          setSteeze((s) => s + 15);
                          setLogMessage(`🎨 Painted walls ${col}! (+15 Steeze)`);
                        }, 60000);
                      }
                    }}
                    className="p-2 bg-slate-950 border border-slate-800 rounded-lg disabled:opacity-40"
                  >
                    {wallColor === col ? `✓ ${col}` : `${col} (25k)`}
                  </button>
                ))}
              </div>

              <div className="font-bold text-slate-400 uppercase pt-1">2. Beds (Raises Max Energy Cap for PhD!) & Sofa</div>
              <button
                disabled={bedTier === "Foam_Mattress" || bedTier === "King_Bed"}
                onClick={() => { if (spendMoney(30000)) { setBedTier("Foam_Mattress"); setEnergy(85); setLogMessage("🛏️ Bought Foam Mattress (85% Max Energy)!"); }}}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl flex justify-between disabled:opacity-40"
              >
                <span>🛏️ Foam Mattress (85% Energy Cap)</span><span className="text-amber-400 font-bold">30,000 g₦</span>
              </button>
              <button
                disabled={bedTier === "King_Bed"}
                onClick={() => { if (spendMoney(95000)) { setBedTier("King_Bed"); setEnergy(100); setSteeze((s) => s + 25); setLogMessage("👑 Bought Royal King Bed (100% Max Energy — Unlocks PhD Energy)!"); }}}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl flex justify-between disabled:opacity-40"
              >
                <span>👑 Royal King Bed (100% Energy Cap)</span><span className="text-amber-400 font-bold">95,000 g₦</span>
              </button>
              <button
                disabled={chairTier !== "None"}
                onClick={() => { if (spendMoney(55000)) { setChairTier("Cushion_Sofa"); setSteeze((s) => s + 15); setLogMessage("🛋️ Bought L-Shaped Cushion Sofa!"); }}}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl flex justify-between disabled:opacity-40"
              >
                <span>🛋️ Cushion Sofa Set</span><span className="text-amber-400 font-bold">55,000 g₦</span>
              </button>

              <div className="font-bold text-slate-400 uppercase pt-1">3. TV Tiers, LagosFlix & Kitchen Gas</div>
              <div className="grid grid-cols-2 gap-1.5">
                <button onClick={() => { if (spendMoney(85000)) { setTvTier("32-Inch LED TV"); setLogMessage("📺 Mounted 32-Inch TV!"); }}} className="p-2 bg-slate-950 border border-slate-800 rounded-lg">📺 32&quot; TV (85k)</button>
                <button onClick={() => { if (spendMoney(175000)) { setTvTier("55-Inch Smart TV"); setSteeze((s) => s + 25); setLogMessage("📺 Mounted 55-Inch Smart TV!"); }}} className="p-2 bg-slate-950 border border-slate-800 rounded-lg">🎬 55&quot; TV (175k)</button>
              </div>
              <button
                disabled={hasLagosFlix}
                onClick={() => { if (spendMoney(12500)) { setHasLagosFlix(true); setLogMessage("🍿 Subscribed to LagosFlix! Click Watch on your TV."); }}}
                className="w-full p-2 bg-rose-950/40 border border-rose-800 rounded-xl flex justify-between disabled:opacity-40"
              >
                <span>🍿 Subscribe LagosFlix Monthly</span><span className="text-rose-400 font-bold">12,500 g₦</span>
              </button>

              <div className="grid grid-cols-3 gap-1.5 pt-1">
                <button onClick={() => { if (spendMoney(35000)) { setHasCookingStove(true); setGasLevel(60); setLogMessage("🔥 Bought Stove!"); }}} className="p-2 bg-slate-950 border border-orange-700 rounded-lg">🔥 Stove (35k)</button>
                <button onClick={() => { if (spendMoney(12000)) { setGasLevel(100); setLogMessage("⛽ Gas 100%!"); }}} className="p-2 bg-slate-950 border border-amber-700 rounded-lg">⛽ Gas (12k)</button>
                <button onClick={() => { if (spendMoney(10000)) { setRawFoodServings((r) => r + 5); setLogMessage("🌾 +5 Raw Meals!"); }}} className="p-2 bg-slate-950 border border-emerald-700 rounded-lg">🌾 5 Food (10k)</button>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 2: 🗺️ INTERACTIVE LAGOS MAP (FOG OF WAR + CLICKABLE AREA BUILDINGS)
           ===================================================================== */}
        {activeTab === "map" && (
          <div className="space-y-4 text-xs">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-extrabold text-base text-white">
                  🗺️ {isMapZoomedOut ? "Lagos State Satellite Map (5 Areas)" : `${area} Local Street Map (Zoomed In)`}
                </h2>
                <p className="text-slate-400 text-[11px]">
                  {isMapZoomedOut
                    ? "You cannot view inside another Area until you physically commute there! Fares depend on distance."
                    : `Showing buildings physically inside ${area}. Click 'Zoom Out' to travel to another Area!`}
                </p>
              </div>
              <button
                onClick={() => { setIsMapZoomedOut(!isMapZoomedOut); setSelectedMapBuilding("None"); }}
                className="px-4 py-2.5 bg-amber-500 text-slate-950 font-extrabold rounded-xl flex items-center gap-1.5"
              >
                {isMapZoomedOut ? <ZoomIn className="w-4 h-4" /> : <ZoomOut className="w-4 h-4" />}
                {isMapZoomedOut ? `Zoom In to ${area}` : "Zoom Out: View All 5 Lagos Areas"}
              </button>
            </div>

            {isMapZoomedOut ? (
              <div className="grid sm:grid-cols-5 gap-3">
                {(["Berger", "Oshodi", "Yaba", "Surulere", "Lekki"] as AreaName[]).map((dest) => {
                  const isCurrent = area === dest;
                  const costs = getTransportCosts(dest);
                  return (
                    <div key={dest} className={`p-4 rounded-2xl border-2 flex flex-col justify-between space-y-3 ${isCurrent ? "bg-emerald-950/40 border-emerald-400" : "bg-slate-900 border-slate-800"}`}>
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-base text-white">📍 {dest}</span>
                          {shelterArea === dest && <span className="text-[10px] bg-indigo-600 px-2 py-0.5 rounded-full">🏠 Home</span>}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {isCurrent ? "✅ Standing here now." : "🔒 Fog of War: Commute here to see buildings."}
                        </p>
                      </div>

                      {isCurrent ? (
                        <button onClick={() => setIsMapZoomedOut(false)} className="w-full py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-xl">
                          Explore {dest}
                        </button>
                      ) : (
                        <div className="space-y-1.5 pt-2 border-t border-slate-800">
                          <button
                            disabled={!!timers.commute}
                            onClick={() => {
                              if (energy < costs.trekEnergy) return setLogMessage("⚠️ Too tired to trek!");
                              startCooldown("commute", 60);
                              setEnergy((e) => Math.max(0, e - costs.trekEnergy));
                              setHealth((h) => Math.max(15, h - costs.trekHealthLoss));
                              setArea(dest);
                              setIsMapZoomedOut(false);
                              setLogMessage(`🚶🏾‍♂️ Trekked to ${dest}! (-${costs.trekEnergy}% Energy, -${costs.trekHealthLoss}% Health, 60s timer).`);
                            }}
                            className="w-full py-1.5 bg-slate-800 rounded-lg text-[10px]"
                          >
                            🚶🏾‍♂️ Trek (₦0 • -{costs.trekEnergy}% En)
                          </button>
                          <button
                            disabled={!!timers.commute}
                            onClick={() => {
                              if (!spendMoney(costs.busCost)) return;
                              startCooldown("commute", 45);
                              setArea(dest);
                              setIsMapZoomedOut(false);
                              setLogMessage(`🚐 Took Bus to ${dest} (-${costs.busCost.toLocaleString()} g₦, 45s timer).`);
                            }}
                            className="w-full py-1.5 bg-amber-500/20 border border-amber-500 text-amber-300 font-bold rounded-lg text-[10px]"
                          >
                            🚐 Bus ({costs.busCost.toLocaleString()} g₦)
                          </button>
                          <button
                            disabled={!!timers.commute}
                            onClick={() => {
                              if (!spendMoney(costs.cabCost)) return;
                              startCooldown("commute", 25);
                              setArea(dest);
                              setIsMapZoomedOut(false);
                              setLogMessage(`🚕 Took Cab to ${dest} (-${costs.cabCost.toLocaleString()} g₦).`);
                            }}
                            className="w-full py-1.5 bg-indigo-600 text-white font-bold rounded-lg text-[10px]"
                          >
                            🚕 Cab ({costs.cabCost.toLocaleString()} g₦)
                          </button>
                          {/* DRIVE BUTTON ONLY APPEARS IF PLAYER OWNS A CAR! */}
                          {carsOwned.length > 0 && (
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

                {/* DRIVING SCHOOL IN OSHODI */}
                {selectedMapBuilding === "Driving_School" && (
                  <div className="p-4 bg-slate-900 border border-emerald-500/40 rounded-2xl space-y-3">
                    <h3 className="font-extrabold text-sm text-emerald-400">🪪 Oshodi Driving Academy & FRSC License</h3>
                    <div className="flex flex-wrap gap-3">
                      <button
                        disabled={drivingLessonsDone >= 3 || !!timers.drv_cd}
                        onClick={() => {
                          if (spendMoney(25000)) {
                            startCooldown("drv_cd", 60);
                            setDrivingLessonsDone((d) => d + 1);
                            setLogMessage(`🚗 Completed Driving Lesson ${drivingLessonsDone + 1}/3 (60s timer)!`);
                          }
                        }}
                        className="px-4 py-2 bg-amber-500 text-slate-950 font-extrabold rounded-xl disabled:opacity-40"
                      >
                        {timers.drv_cd ? `⏳ Lesson (${formatSecs(timers.drv_cd)})` : drivingLessonsDone >= 3 ? "✓ 3/3 Lessons Done" : `Take Driving Lesson (${drivingLessonsDone}/3) • 25k`}
                      </button>
                      <button
                        disabled={hasDriversLicense || drivingLessonsDone < 3}
                        onClick={() => {
                          if (spendMoney(45000)) {
                            setHasDriversLicense(true);
                            setLogMessage("🪪 Official FRSC Driver's License Issued! Added to your Profile.");
                          }
                        }}
                        className="px-4 py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-xl disabled:opacity-40"
                      >
                        {hasDriversLicense ? "✓ Licensed Driver" : "Obtain FRSC Driver's License (45,000 g₦)"}
                      </button>
                    </div>
                  </div>
                )}

                {/* MECHANIC & FILLING STATION */}
                {(selectedMapBuilding === "Mechanic_Shop" || selectedMapBuilding === "Filling_Station") && (
                  <div className="p-4 bg-slate-900 border border-cyan-500/40 rounded-2xl flex flex-wrap gap-3">
                    <button onClick={() => { if (spendMoney(18000)) { setCarPetrol(100); setLogMessage("⛽ Filled Petrol to 100%!"); }}} className="px-4 py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-xl">⛽ Refill Petrol (18k)</button>
                    <button onClick={() => { if (spendMoney(3000)) { setCarRadiatorWater(100); setLogMessage("💧 Topped up Radiator Water to 100%!"); }}} className="px-4 py-2 bg-cyan-500 text-slate-950 font-extrabold rounded-xl">💧 Add Radiator Water (3k)</button>
                    <button onClick={() => { if (spendMoney(35000)) { setCarEngineHealth(100); setLogMessage("🔧 Overhauled Car Engine to 100%!"); }}} className="px-4 py-2 bg-purple-600 text-white font-extrabold rounded-xl">🔧 Mechanic Engine Repair (35k)</button>
                  </div>
                )}

                {/* EATERY & SOCIAL LOUNGE (MEET PARTNER & GO ON 10 DATES AT +10% BOND!) */}
                {selectedMapBuilding === "Eatery_Social" && (
                  <div className="p-4 bg-slate-900 border border-rose-500/40 rounded-2xl space-y-3">
                    <h3 className="font-extrabold text-sm text-rose-400">🍗 {area} Eatery, Church & Social Lounge (Eat or Court a Partner)</h3>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => { if (spendMoney(3500)) { startCooldown("eat_cd", 60); setHunger(100); setEnergy((e) => Math.min(maxEnergyCap, e + 30)); setLogMessage("🍲 Ate Amala & Ewedu (60s meal timer)!"); }}} className="px-3 py-2 bg-amber-600 text-white font-bold rounded-xl">🍲 Eat Amala (3.5k • 60s)</button>
                      <button onClick={() => { if (spendMoney(7500)) { startCooldown("eat_cd", 60); setHunger(100); setEnergy((e) => Math.min(maxEnergyCap, e + 45)); setHealth((h) => Math.min(100, h + 10)); setLogMessage("🍗 Ate Balanced Grilled Fish & Salad!"); }}} className="px-3 py-2 bg-emerald-600 text-white font-bold rounded-xl">🍗 Balanced Meal (7.5k • 60s)</button>
                    </div>

                    <div className="border-t border-slate-800 pt-3 space-y-2">
                      <div className="font-bold text-white">💬 Citizens Present in {area} Lounge (Start at 10% Bond to Complete 10 Dates):</div>
                      {maritalStatus === "Single" ? (
                        <div className="grid sm:grid-cols-3 gap-2">
                          {(gender === "male" ? ["Chidinma (Lekki)", "Zainab (Yaba)", "Tolu (Surulere)"] : ["Adewale (Lekki)", "Chinedu (Yaba)", "Ibrahim (Berger)"]).map((p) => (
                            <button
                              key={p}
                              onClick={() => {
                                setPartnerName(p);
                                setMaritalStatus("Courting");
                                setRelationshipBond(10); // Starts at 10%
                                setLogMessage(`❤️ Chatted with ${p}! You are now Courting at 10% Bond. Take them on dates (+10% each) to reach 100%!`);
                              }}
                              className="p-2.5 bg-slate-950 border border-rose-700 rounded-xl font-bold text-rose-300"
                            >
                              💬 Converse with {p} (Start at 10% Bond)
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950 p-3 rounded-xl">
                          <span>💑 Partner: <strong>{partnerName}</strong> • Bond: <strong className="text-emerald-400">{relationshipBond}% / 100%</strong></span>
                          <div className="flex gap-2">
                            <button
                              disabled={!!timers.date_cd}
                              onClick={() => {
                                if (energy < 30 || health < 60) return setLogMessage("⚠️ Need 30% Energy & 60% Health for a date!");
                                if (spendMoney(25000)) {
                                  startCooldown("date_cd", 60);
                                  setEnergy((e) => Math.max(0, e - 25));
                                  setRelationshipBond((b) => Math.min(100, b + 10));
                                  setLogMessage(`🍷 Date with ${partnerName} complete! Bond +10% (60s timer).`);
                                }
                              }}
                              className="px-3 py-1.5 bg-rose-600 text-white font-bold rounded-lg disabled:opacity-40"
                            >
                              {timers.date_cd ? `⏳ Date (${formatSecs(timers.date_cd)})` : "🍷 Go on Date (25k • +10% Bond • 60s)"}
                            </button>
                            <button
                              disabled={maritalStatus === "Married"}
                              onClick={() => {
                                if (relationshipBond < 100) return setLogMessage(`❌ Need 100% Bond! Currently ${relationshipBond}%.`);
                                if (wallColor === "Unplastered" || bedTier === "Bare_Floor" || chairTier === "None") {
                                  return setLogMessage("❌ Paint your room and buy a Bed & Sofa before marriage!");
                                }
                                if (spendMoney(150000)) {
                                  setMaritalStatus("Married");
                                  setSteeze((s) => s + 50);
                                  setLogMessage(`💍 Married ${partnerName}!`);
                                }
                              }}
                              className="px-3 py-1.5 bg-emerald-500 text-slate-950 font-extrabold rounded-lg"
                            >
                              💍 Marry at Registry (150k)
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* =====================================================================
            TAB 3: 💼 ALL JOBS (AREA-LOCKED HUSTLES, 7 CORPORATES & TIMED SOCIAL GIGS)
           ===================================================================== */}
        {activeTab === "jobs" && (
          <div className="grid md:grid-cols-3 gap-4 text-xs">
            {/* 1. STREET HUSTLES (60s-90s COOLDOWNS + AREA-LOCKED) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-sm text-amber-400">🧱 Area-Locked Street Hustles</h2>
                <span className="px-2 py-0.5 bg-amber-950 text-amber-300 rounded-full font-bold">{hustlesDoneToday}/3 Today</span>
              </div>
              {[
                { id: "h_osh", name: "📦 Oshodi Market Load Carrier", loc: "Oshodi" as AreaName, pay: 6500, cd: 60 },
                { id: "h_ber", name: "🧱 Berger Cement Offloading", loc: "Berger" as AreaName, pay: 9000, cd: 75 },
                { id: "h_yab", name: "🍽️ Yaba Kitchen & Plate Washing", loc: "Yaba" as AreaName, pay: 8000, cd: 60 },
                { id: "h_sur", name: "🎉 Surulere Owambe Event Server", loc: "Surulere" as AreaName, pay: 9500, cd: 75 },
                { id: "h_lek", name: "🏗️ Lekki Duplex Site Bricklayer", loc: "Lekki" as AreaName, pay: 14000, cd: 90 },
              ].map((h) => {
                const cd = timers[h.id];
                return (
                  <div key={h.id} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                    <div className="flex justify-between font-bold">
                      <span>{h.name}</span>
                      <span className="text-emerald-400">+{h.pay.toLocaleString()} g₦</span>
                    </div>
                    <div className="text-[10px] text-slate-400">📍 Must be in: {h.loc} • Timer: {h.cd}s • -25% Energy</div>
                    <button
                      disabled={!!cd || hustlesDoneToday >= 3}
                      onClick={() => {
                        if (area !== h.loc) return setLogMessage(`🚌 You are in ${area}! Travel to ${h.loc} on the Lagos Map first!`);
                        if (energy < 25) return setLogMessage("⚠️ Need 25% Energy!");
                        startCooldown(h.id, h.cd);
                        setHustlesDoneToday((p) => p + 1);
                        setEnergy((e) => Math.max(0, e - 25));
                        const actual = health < 60 ? Math.floor(h.pay * 0.65) : h.pay;
                        setEarnedBalance((p) => p + actual);
                        setLogMessage(`✅ Worked ${h.name} in ${h.loc}! Paid +${actual.toLocaleString()} g₦ (${h.cd}s cooldown).`);
                      }}
                      className="w-full py-1.5 bg-amber-500 text-slate-950 font-extrabold rounded-lg disabled:opacity-40"
                    >
                      {cd ? `⏳ Cooldown (${formatSecs(cd)})` : area === h.loc ? "Start Work Shift" : `🚌 Travel to ${h.loc} First`}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* 2. 7 CORPORATE EMPLOYERS (3-DAY PAYCHECK + DEGREE & PRO CERT GATED) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <h2 className="font-bold text-sm text-cyan-400">🏢 Corporate Employment (3-Day Payroll)</h2>
              {employedJob ? (
                <div className="p-3 bg-cyan-950/30 border border-cyan-700 rounded-xl space-y-2.5">
                  <div className="font-extrabold text-sm text-white">{employedJob.title}</div>
                  <div className="text-cyan-300">Employer: {employedJob.company} (📍 {employedJob.area})</div>
                  <div className="text-emerald-400 font-bold">Pay: {employedJob.payPer3Days.toLocaleString()} g₦ every 3 Days</div>
                  <div className="bg-slate-950 p-2 rounded-lg">Attendance: <strong>{daysWorkedThisCycle} / 3 Office Days</strong></div>
                  <button
                    disabled={workedOfficeToday || !!timers.office_cd}
                    onClick={() => {
                      if (area !== employedJob.area) return setLogMessage(`🚌 Travel to ${employedJob.area} on the Map first!`);
                      if (energy < 30) return setLogMessage("⚠️ Need 30% Energy!");
                      startCooldown("office_cd", 60);
                      setWorkedOfficeToday(true);
                      setEnergy((e) => Math.max(0, e - 30));
                      const nextD = daysWorkedThisCycle + 1;
                      if (nextD >= 3) {
                        setDaysWorkedThisCycle(0);
                        setEarnedBalance((p) => p + employedJob.payPer3Days);
                        setLogMessage(`💰 3-DAY PAYCHECK RELEASED! +${employedJob.payPer3Days.toLocaleString()} g₦ paid!`);
                      } else {
                        setDaysWorkedThisCycle(nextD);
                        setLogMessage(`🏢 Office day ${nextD}/3 completed at ${employedJob.company} (60s timer)!`);
                      }
                    }}
                    className="w-full py-2.5 bg-cyan-500 text-slate-950 font-extrabold rounded-xl disabled:opacity-40"
                  >
                    {timers.office_cd ? `⏳ In Office (${formatSecs(timers.office_cd)})` : workedOfficeToday ? "✓ Shift Done Today" : `🏢 Clock In at ${employedJob.area} Office (60s)`}
                  </button>
                  <button onClick={() => setEmployedJob(null)} className="w-full text-slate-400 underline">Resign / Switch Employer</button>
                </div>
              ) : (
                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                  {[
                    { title: "Front Desk Clerk", company: "Oshodi Microfinance", area: "Oshodi" as AreaName, reqDeg: "Polytechnic ND", reqCert: null, reqCv: 25, pay: 60000 },
                    { title: "IT Support Analyst", company: "Yaba CcHub Tech", area: "Yaba" as AreaName, reqDeg: "Polytechnic ND", reqCert: null, reqCv: 50, pay: 85000 },
                    { title: "Site Operations Officer", company: "Julius Berger PLC", area: "Berger" as AreaName, reqDeg: "Polytechnic HND", reqCert: null, reqCv: 65, pay: 130000 },
                    { title: "Chartered Bank Auditor", company: "ZenithMarina Lekki", area: "Lekki" as AreaName, reqDeg: "University B.Sc", reqCert: "ICAN", reqCv: 85, pay: 320000 },
                    { title: "Senior Cloud Architect", company: "Paystack Yaba HQ", area: "Yaba" as AreaName, reqDeg: "University B.Sc", reqCert: "CISCO", reqCv: 85, pay: 450000 },
                    { title: "Executive Project Director", company: "Berger Infrastructure", area: "Berger" as AreaName, reqDeg: "Masters (M.Sc)", reqCert: "PMP", reqCv: 90, pay: 680000 },
                    { title: "VP Offshore & Research", company: "Chevron & Shell VI", area: "Lekki" as AreaName, reqDeg: "Doctorate (Ph.D)", reqCert: "HSE", reqCv: 95, pay: 1250000 },
                  ].map((j, i) => (
                    <div key={i} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                      <div>
                        <div className="font-bold text-white">{j.title} — {j.company}</div>
                        <div className="text-[10px] text-slate-400">
                          📍 {j.area} • Req: {j.reqDeg} {j.reqCert && `+ ${j.reqCert}`} & CV {j.reqCv}% • {j.pay.toLocaleString()} g₦/3d
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (!completedDegrees.includes(j.reqDeg)) return setLogMessage(`❌ You need ${j.reqDeg} on your Profile first!`);
                          if (j.reqCert && !professionalCerts.includes(j.reqCert)) return setLogMessage(`❌ Requires ${j.reqCert} Professional Cert!`);
                          if (cvScore < j.reqCv) return setLogMessage(`❌ Requires CV Score ${j.reqCv}%+!`);
                          setEmployedJob({ title: j.title, company: j.company, area: j.area, payPer3Days: j.pay });
                          setLogMessage(`🎉 Hired at ${j.company} (${j.area})!`);
                        }}
                        className="px-3 py-1 bg-cyan-600 text-white font-bold rounded-lg shrink-0"
                      >
                        Apply
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. SOCIAL GIGS WITH 3-TO-5 MINUTE BATCH COOLDOWNS */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-emerald-400">📱 Verified Social Gigs (3m–5m Cooldowns)</h2>
              {[
                { id: "sg1", title: "Follow JPC Official on X", reward: 2500, cd: 180 },
                { id: "sg2", title: "Follow Lagos Dev on LinkedIn", reward: 4000, cd: 240 },
                { id: "sg3", title: "Beta Test Partner App & Review", reward: 12000, cd: 300 },
              ].map((g) => {
                const cd = timers[g.id];
                return (
                  <div key={g.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex justify-between font-bold">
                      <span>{g.title}</span>
                      <span className="text-emerald-400">+{g.reward.toLocaleString()} g₦</span>
                    </div>
                    {cd ? (
                      <div className="py-1.5 bg-amber-950/60 border border-amber-700 text-amber-300 rounded-lg font-bold text-center">
                        ⏳ Next Batch In: {formatSecs(cd)}
                      </div>
                    ) : (
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          placeholder="@handle proof..."
                          value={gigProofInputs[g.id] || ""}
                          onChange={(e) => setGigProofInputs((p) => ({ ...p, [g.id]: e.target.value }))}
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white"
                        />
                        <button
                          onClick={() => {
                            if (!gigProofInputs[g.id]?.trim()) return setLogMessage("⚠️ Enter your @handle proof!");
                            startCooldown(g.id, g.cd);
                            setEarnedBalance((p) => p + g.reward);
                            setLogMessage(`✅ Verified! +${g.reward.toLocaleString()} g₦ paid. Cooldown: ${formatSecs(g.cd)}.`);
                          }}
                          className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg"
                        >
                          Submit
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 4: 🎓 10-LECTURE DEGREES (TIERED ENERGY: 40% TO 95%), ABROAD VISA & BLUEPRINTS
           ===================================================================== */}
        {activeTab === "school" && (
          <div className="grid md:grid-cols-3 gap-4 text-xs">
            {/* COLUMN 1: 10-LECTURE DEGREES WITH TIERED ENERGY DRAIN & STRICT PREREQUISITES */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <h2 className="font-bold text-sm text-amber-400">🎓 10-Lecture Academic Hierarchy</h2>
              <p className="text-[11px] text-slate-400">
                Each degree requires <strong>10 Timed Lectures</strong>. Higher degrees drain much more Energy per lecture (Ph.D drains 95% Energy, requiring a King Bed!). You must earn B.Sc &amp; M.Sc before Ph.D!
              </p>

              {enrolledProgram ? (
                <div className="p-3 bg-indigo-950/50 border-2 border-indigo-500 rounded-xl space-y-2.5">
                  <div className="font-extrabold text-sm text-white">📚 Active Program: {enrolledProgram.name}</div>
                  <div className="text-amber-300 font-bold">
                    Lectures Completed: {enrolledProgram.completedClasses} / {enrolledProgram.totalClasses}
                  </div>
                  <div className="text-rose-300 text-[11px]">
                    ⚡ Drains -{enrolledProgram.energyPerLecture}% Energy/class • ⏳ Timer: {enrolledProgram.timerSeconds}s • Deadline: {enrolledProgram.deadlineDaysLeft} Days
                  </div>
                  <button
                    disabled={!!timers.lecture_cd}
                    onClick={() => {
                      if (energy < enrolledProgram.energyPerLecture) {
                        return setLogMessage(`⚠️ Not enough Energy! This lecture requires ${enrolledProgram.energyPerLecture}% Energy (Current: ${energy}%). Eat or upgrade to a King Bed (100% Cap)!`);
                      }
                      startCooldown("lecture_cd", enrolledProgram.timerSeconds);
                      setEnergy((e) => Math.max(0, e - enrolledProgram.energyPerLecture));
                      const nextC = enrolledProgram.completedClasses + 1;
                      if (nextC >= enrolledProgram.totalClasses) {
                        setCompletedDegrees((d) => [...d, enrolledProgram.name]);
                        setEnrolledProgram(null);
                        setSteeze((s) => s + 40);
                        setLogMessage(`🎓 GRADUATED! Completed all 10/10 lectures for ${enrolledProgram.name}! Added to your Profile.`);
                      } else {
                        setEnrolledProgram({ ...enrolledProgram, completedClasses: nextC });
                        setLogMessage(`📖 Lecture ${nextC}/10 completed! (-${enrolledProgram.energyPerLecture}% Energy, ${enrolledProgram.timerSeconds}s timer).`);
                      }
                    }}
                    className="w-full py-2.5 bg-emerald-500 text-slate-950 font-extrabold rounded-xl disabled:opacity-40"
                  >
                    {timers.lecture_cd
                      ? `⏳ In Lecture Hall (${formatSecs(timers.lecture_cd)})`
                      : `Attend Lecture #${enrolledProgram.completedClasses + 1}/10 (-${enrolledProgram.energyPerLecture}% Energy)`}
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {[
                    { id: "ND", name: "Polytechnic ND", cost: 220000, en: 40, sec: 60, days: 14, req: null },
                    { id: "HND", name: "Polytechnic HND", cost: 350000, en: 50, sec: 75, days: 14, req: "Polytechnic ND" },
                    { id: "BSC", name: "University B.Sc", cost: 680000, en: 65, sec: 90, days: 28, req: null },
                    { id: "MSC", name: "Masters (M.Sc)", cost: 1400000, en: 80, sec: 100, days: 21, req: "University B.Sc" },
                    { id: "PHD", name: "Doctorate (Ph.D)", cost: 2800000, en: 95, sec: 120, days: 28, req: "Masters (M.Sc)" },
                  ].map((d) => {
                    const done = completedDegrees.includes(d.name);
                    return (
                      <div key={d.id} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                        <div className="flex justify-between font-bold text-white">
                          <span>{d.name} (10 Lectures)</span>
                          <span className="text-amber-400">{d.cost.toLocaleString()} g₦</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          ⚡ -{d.en}% Energy/lecture • ⏱️ {d.sec}s/class {d.req && `• Req: ${d.req}`}
                        </div>
                        <button
                          disabled={done}
                          onClick={() => {
                            if (d.req && !completedDegrees.includes(d.req)) {
                              return setLogMessage(`❌ Strict Prerequisite: You must complete ${d.req} before enrolling in ${d.name}!`);
                            }
                            if (spendMoney(d.cost)) {
                              setEnrolledProgram({
                                id: d.id,
                                name: d.name,
                                totalClasses: 10,
                                completedClasses: 0,
                                energyPerLecture: d.en,
                                timerSeconds: d.sec,
                                deadlineDaysLeft: d.days,
                              });
                              setLogMessage(`🎓 Enrolled in ${d.name}! Complete 10 lectures within ${d.days} days.`);
                            }
                          }}
                          className="w-full py-1.5 bg-indigo-600 text-white font-bold rounded-lg disabled:opacity-40"
                        >
                          {done ? `✓ Completed ${d.name}` : `Enroll in ${d.name}`}
                        </button>
                      </div>
                    );
                  })}

                  {/* STUDY ABROAD VISA (90s EMBASSY WAIT) */}
                  <div className="p-2.5 bg-amber-950/30 border border-amber-700 rounded-xl space-y-1.5">
                    <div className="font-bold text-amber-300">✈️ Foreign Study Abroad Visa (250,000 g₦)</div>
                    {abroadVisaStatus === "None" && (
                      <button
                        onClick={() => {
                          if (!completedDegrees.includes("University B.Sc") && !completedDegrees.includes("Polytechnic HND")) {
                            return setLogMessage("❌ Requires B.Sc or HND before applying for an Abroad Visa!");
                          }
                          if (spendMoney(250000)) {
                            setAbroadVisaStatus("Processing");
                            startCooldown("visa_cd", 90);
                            setTimeout(() => {
                              setAbroadVisaStatus("Approved");
                              setLogMessage("✈️ Study Abroad Visa Approved!");
                            }, 90000);
                          }
                        }}
                        className="w-full py-1.5 bg-amber-500 text-slate-950 font-extrabold rounded-lg"
                      >
                        Apply for Abroad Visa (250k • 90s Wait)
                      </button>
                    )}
                    {abroadVisaStatus === "Processing" && <div className="text-amber-400 font-bold">⏳ Visa Wait: {formatSecs(timers.visa_cd)}</div>}
                    {abroadVisaStatus === "Approved" && <div className="text-emerald-400 font-bold">✓ International Student Visa Active</div>}
                  </div>
                </div>
              )}
            </div>

            {/* COLUMN 2: TIERED BLUEPRINTS (KIOSK 400K VS SMALL EATERY 900K VS MEGA 1.8M) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <h2 className="font-bold text-sm text-emerald-400">📘 Tiered Business Blueprints (90s Study)</h2>
              {[
                { id: "BP_Food_Kiosk", name: "🏪 Roadside Food Kiosk BP (2 Staff / 15 Cust)", cost: 400000 },
                { id: "BP_Small_Eatery", name: "🍲 Small Eatery BP (6 Staff / 45 Cust)", cost: 900000 },
                { id: "BP_Mega_Rest", name: "🏢 Mega Restaurant BP (15 Staff / 120 Cust)", cost: 1800000 },
                { id: "BP_Poster_Kiosk", name: "🖨️ Small Digital Poster Kiosk BP (2 Staff)", cost: 850000 },
                { id: "BP_Mega_Agency", name: "🎨 Full Media & Billboard Agency BP (12 Staff)", cost: 1600000 },
              ].map((bp) => {
                const owned = ownedBlueprints.includes(bp.id);
                const cd = timers[`bp_${bp.id}`];
                return (
                  <button
                    key={bp.id}
                    disabled={owned || !!cd}
                    onClick={() => {
                      if (spendMoney(bp.cost)) {
                        startCooldown(`bp_${bp.id}`, 90);
                        setTimeout(() => {
                          setOwnedBlueprints((p) => [...p, bp.id]);
                          setLogMessage(`📘 Certified in ${bp.name}!`);
                        }, 90000);
                      }
                    }}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center disabled:opacity-40"
                  >
                    <span className="font-bold text-left">{cd ? `⏳ Studying (${formatSecs(cd)})` : owned ? `✓ ${bp.name}` : bp.name}</span>
                    <span className="text-amber-400 font-extrabold shrink-0 ml-2">{(bp.cost / 1000).toFixed(0)}k g₦</span>
                  </button>
                );
              })}
            </div>

            {/* COLUMN 3: PROFESSIONAL COURSES (ICAN, PMP, CISCO, HSE), CV AGENCY & SUIT */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <h2 className="font-bold text-sm text-cyan-400">🏅 Professional Courses, CV & Suit</h2>
              {[
                { id: "ICAN", name: "📊 ICAN Chartered Accountant", cost: 350000 },
                { id: "PMP", name: "📋 PMP Project Management", cost: 420000 },
                { id: "CISCO", name: "🌐 CISCO Network Architect", cost: 500000 },
                { id: "HSE", name: "🦺 Offshore Oil & Gas HSE", cost: 650000 },
              ].map((pc) => (
                <button
                  key={pc.id}
                  disabled={professionalCerts.includes(pc.id)}
                  onClick={() => {
                    if (spendMoney(pc.cost)) {
                      setProfessionalCerts((p) => [...p, pc.id]);
                      setLogMessage(`🏅 Earned ${pc.name} Certification!`);
                    }
                  }}
                  className="w-full p-2 bg-slate-950 border border-cyan-800/60 rounded-xl flex justify-between font-bold disabled:opacity-40"
                >
                  <span>{professionalCerts.includes(pc.id) ? `✓ ${pc.name}` : pc.name}</span>
                  <span className="text-cyan-400">{(pc.cost / 1000).toFixed(0)}k g₦</span>
                </button>
              ))}

              <div className="border-t border-slate-800 pt-2 space-y-2">
                <button
                  onClick={() => { if (spendMoney(55000)) { startCooldown("cv_cd", 60); setTimeout(() => { setCvScore(95); setLogMessage("💼 Pro CV Agency built your 95% CV!"); }, 60000); }}}
                  className="w-full p-2.5 bg-emerald-950/40 border border-emerald-700 rounded-xl flex justify-between font-bold"
                >
                  <span>{timers.cv_cd ? `⏳ Agency Writing (${formatSecs(timers.cv_cd)})` : "📄 Hire Pro CV Agency (95% Score)"}</span>
                  <span className="text-emerald-400">55,000 g₦</span>
                </button>
                <button
                  disabled={hasCorporateSuit}
                  onClick={() => { if (spendMoney(65000)) { setOutfit("Tailored Corporate Suit & Shoes"); setHasCorporateSuit(true); setSteeze((s) => s + 35); setLogMessage("👔 Bought Tailored Suit!"); }}}
                  className="w-full p-2.5 bg-amber-950/40 border border-amber-700 rounded-xl flex justify-between font-bold disabled:opacity-40"
                >
                  <span>{hasCorporateSuit ? "✓ Corporate Suit Owned" : "👔 Buy Corporate Suit & Shoes"}</span>
                  <span className="text-amber-400">65,000 g₦</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 5: 🏢 EMPIRE, KIOSKS/EATERIES, REAL ESTATE (RENT VS BUY) & ALL 10 CARS!
           ===================================================================== */}
        {activeTab === "empire" && (
          <div className="grid md:grid-cols-3 gap-4 text-xs">
            {/* COLUMN 1: CAC (90s), C-OF-O (120s) & KIOSKS / EATERIES / AGENCIES */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <h2 className="font-bold text-sm text-amber-400">🏪 CAC, C-of-O & Kiosks / Eateries</h2>
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                <div>CAC Status: <strong className="text-emerald-400">{cacStatus}</strong> • Land C-of-O: <strong className="text-emerald-400">{cofoStatus}</strong></div>
                {cacStatus === "None" && (
                  <div className="flex gap-1.5">
                    <input type="text" placeholder="Company Name..." value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white" />
                    <button onClick={() => { if (companyName && spendMoney(650000)) { setCacStatus("Processing"); startCooldown("cac_w", 90); setTimeout(() => setCacStatus("Approved"), 90000); }}} className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold rounded">CAC (650k)</button>
                  </div>
                )}
                {cacStatus === "Processing" && <div className="text-amber-400">⏳ CAC Countdown: {formatSecs(timers.cac_w)}</div>}
                {cofoStatus === "None" && (
                  <button onClick={() => { if (spendMoney(1200000)) { setCofoStatus("Processing"); startCooldown("cofo_w", 120); setTimeout(() => setCofoStatus("Approved"), 120000); }}} className="w-full py-1.5 bg-indigo-600 text-white font-bold rounded">
                    Secure Land & C-of-O (1.2M g₦ • 120s Wait)
                  </button>
                )}
                {cofoStatus === "Processing" && <div className="text-amber-400">⏳ C-of-O Countdown: {formatSecs(timers.cofo_w)}</div>}
              </div>

              {[
                { name: "Roadside Food Kiosk", bp: "BP_Food_Kiosk", cost: 350000, maxStaff: 2, maxCust: 15, rev: 45000 },
                { name: "Small Neighborhood Eatery", bp: "BP_Small_Eatery", cost: 850000, maxStaff: 6, maxCust: 45, rev: 135000 },
                { name: "Mega Fast-Food Restaurant", bp: "BP_Mega_Rest", cost: 2200000, maxStaff: 15, maxCust: 120, rev: 380000 },
                { name: "Digital Poster Kiosk", bp: "BP_Poster_Kiosk", cost: 650000, maxStaff: 2, maxCust: 20, rev: 90000 },
                { name: "Full Media & Billboard Agency", bp: "BP_Mega_Agency", cost: 1900000, maxStaff: 12, maxCust: 100, rev: 340000 },
              ].map((b, i) => (
                <div key={i} className="p-2 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white">{b.name}</div>
                    <div className="text-[10px] text-slate-400">Cap: {b.maxStaff} Staff / {b.maxCust} Cust • {b.cost.toLocaleString()} g₦</div>
                  </div>
                  <button
                    onClick={() => {
                      if (!ownedBlueprints.includes(b.bp)) return setLogMessage(`❌ Study ${b.bp} in the School tab first!`);
                      if (spendMoney(b.cost)) {
                        setActiveBusinesses((p) => [...p, { name: b.name, area, maxStaff: b.maxStaff, hiredStaff: 1, maxCustomers: b.maxCust, revenuePerCycle: b.rev }]);
                        setLogMessage(`🏪 Opened ${b.name} in ${area}!`);
                      }
                    }}
                    className="px-2.5 py-1 bg-amber-500 text-slate-950 font-extrabold rounded"
                  >
                    Open
                  </button>
                </div>
              ))}

              {activeBusinesses.map((biz, idx) => (
                <div key={idx} className="p-2 bg-emerald-950/30 border border-emerald-700 rounded-xl flex justify-between items-center">
                  <span>{biz.name} ({biz.hiredStaff}/{biz.maxStaff} Staff)</span>
                  <div className="flex gap-1">
                    <button disabled={biz.hiredStaff >= biz.maxStaff} onClick={() => { if (spendMoney(25000)) { const up = [...activeBusinesses]; up[idx].hiredStaff += 1; setActiveBusinesses(up); }}} className="px-2 py-1 bg-indigo-600 text-white rounded">+Staff</button>
                    <button onClick={() => { const rev = Math.round(biz.revenuePerCycle * (biz.hiredStaff / biz.maxStaff)); setEarnedBalance((e) => e + rev); setLogMessage(`💰 Collected +${rev.toLocaleString()} g₦!`); }} className="px-2 py-1 bg-emerald-500 text-slate-950 font-bold rounded">Collect</button>
                  </div>
                </div>
              ))}
            </div>

            {/* COLUMN 2: RESIDENTIAL ESTATES (RENT EVERY 8 WKS VS BUY OUTRIGHT + AGENT SUB-LETTING) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5 max-h-[540px] overflow-y-auto">
              <h2 className="font-bold text-sm text-cyan-400">🏡 Area Real Estate (Rent vs Buy Outright)</h2>
              {[
                { name: "Oshodi 2-Bedroom Flat", area: "Oshodi" as AreaName, park: 2, rooms: 2, rent: 280000, buy: 14000000 },
                { name: "Berger 3-Bedroom Flat", area: "Berger" as AreaName, park: 3, rooms: 3, rent: 480000, buy: 24000000 },
                { name: "Yaba Executive Terrace", area: "Yaba" as AreaName, park: 3, rooms: 3, rent: 650000, buy: 32000000 },
                { name: "Surulere 4-Bed Semi-Duplex", area: "Surulere" as AreaName, park: 4, rooms: 4, rent: 1100000, buy: 45000000 },
                { name: "Lekki 5-Bed Luxury Duplex", area: "Lekki" as AreaName, park: 5, rooms: 5, rent: 1850000, buy: 65000000 },
              ].map((h, i) => (
                <div key={i} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                  <div className="font-bold text-white">{h.name} (📍 {h.area} • 🅿️ {h.park} Parking)</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => {
                        if (spendMoney(h.rent)) {
                          setShelterType(h.name);
                          setShelterArea(h.area);
                          setOwnershipMode("Rented");
                          setRentPer8Weeks(h.rent);
                          setWeeksUntilRentDue(8);
                          setParkingSlots(h.park);
                          setLogMessage(`🔑 Rented ${h.name} in ${h.area}!`);
                        }
                      }}
                      className="py-1 bg-cyan-600 text-white font-bold rounded"
                    >
                      Rent/8Wks ({(h.rent / 1000).toFixed(0)}k)
                    </button>
                    <button
                      onClick={() => {
                        if (spendMoney(h.buy)) {
                          setShelterType(h.name);
                          setShelterArea(h.area);
                          setOwnershipMode("Bought_Owned");
                          setParkingSlots(h.park);
                          setOwnedProperties((p) => [...p, { name: h.name, area: h.area, roomsAvailable: h.rooms - 1, listedPricePerRoom: 250000, isListedWithAgent: false }]);
                          setLogMessage(`🏰 BOUGHT ${h.name} OUTRIGHT! List spare rooms below.`);
                        }
                      }}
                      className="py-1 bg-amber-500 text-slate-950 font-extrabold rounded"
                    >
                      Buy ({(h.buy / 1000000).toFixed(0)}M g₦)
                    </button>
                  </div>
                </div>
              ))}

              {/* LANDLORD ROOM LISTING */}
              {ownedProperties.map((op, i) => (
                <div key={i} className="p-2.5 bg-indigo-950/40 border border-indigo-500 rounded-xl space-y-1.5">
                  <div className="font-bold text-indigo-300">📄 Landlord Agent Form: {op.name} ({op.roomsAvailable} Spare Rooms)</div>
                  <div className="flex gap-1.5">
                    <input type="number" value={customRoomRentInput} onChange={(e) => setCustomRoomRentInput(e.target.value)} className="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white" />
                    <button
                      onClick={() => {
                        const net = Math.floor((Number(customRoomRentInput) || 250000) * op.roomsAvailable * 0.9);
                        setEarnedBalance((e) => e + net);
                        setLogMessage(`🏘️ Agent rented out ${op.roomsAvailable} rooms and remitted +${net.toLocaleString()} g₦!`);
                      }}
                      className="flex-1 py-1 bg-emerald-500 text-slate-950 font-extrabold rounded"
                    >
                      Collect Rent via Agent
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* COLUMN 3: FULL 10-CAR AUTOMOBILE DEALERSHIP */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 max-h-[540px] overflow-y-auto">
              <h2 className="font-bold text-sm text-emerald-400">🚗 Automobile Dealership (10 Models)</h2>
              <div className="text-[11px] text-amber-300">
                Requires Driver&apos;s License ({hasDriversLicense ? "✓ Verified" : "❌ Visit Oshodi on Map"}) &amp; Parking ({carsOwned.length}/{parkingSlots})
              </div>
              {[
                { name: "Suzuki 'Korope' Mini", cost: 750000, st: 10 },
                { name: "Tokunbo Toyota Corolla", cost: 1350000, st: 25 },
                { name: "Honda Accord 'Evil Spirit'", cost: 1950000, st: 35 },
                { name: "Toyota Camry 'Muscle'", cost: 2400000, st: 45 },
                { name: "Lexus RX350 SUV", cost: 3200000, st: 60 },
                { name: "Mercedes-Benz C300", cost: 4500000, st: 75 },
                { name: "Toyota Land Cruiser Prado", cost: 6200000, st: 95 },
                { name: "Range Rover Autobiography", cost: 7800000, st: 120 },
                { name: "Mercedes-AMG G63 G-Wagon", cost: 9500000, st: 150 },
                { name: "Lamborghini Urus Performante", cost: 14000000, st: 200 },
              ].map((c, i) => {
                const owned = carsOwned.includes(c.name);
                return (
                  <div key={i} className="p-2 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white">{c.name}</div>
                      <div className="text-[10px] text-emerald-400">{c.cost.toLocaleString()} g₦ • +{c.st} Steeze</div>
                    </div>
                    <button
                      disabled={owned}
                      onClick={() => {
                        if (!hasDriversLicense) return setLogMessage("❌ Get your FRSC Driver's License at Oshodi Driving School on the Map first!");
                        if (carsOwned.length >= parkingSlots) return setLogMessage("❌ You have 0 free parking slots! Rent or buy a Flat/Duplex first.");
                        if (spendMoney(c.cost)) {
                          setCarsOwned((p) => [...p, c.name]);
                          setActiveCar(c.name);
                          setCarPetrol(100);
                          setCarRadiatorWater(100);
                          setCarEngineHealth(100);
                          setSteeze((s) => s + c.st);
                          setLogMessage(`🏎️ Purchased ${c.name}! Car Petrol, Water & Engine meters are now active at the top!`);
                        }
                      }}
                      className="px-3 py-1 bg-emerald-500 text-slate-950 font-extrabold rounded disabled:opacity-40"
                    >
                      {owned ? "✓ Owned" : "Buy Car"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 6: 🗳️ POLITICS (STEP 1 PARTY -> STEP 2 FORM -> BILLBOARD -> VOTE)
           ===================================================================== */}
        {activeTab === "politics" && (
          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-emerald-400">🏛️ Party Approval (30k) & Nomination Form (450k)</h2>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div>1. Party Status: <strong className="text-amber-400">{partyStatus}</strong></div>
                {partyStatus === "None" && (
                  <button onClick={() => { if (spendMoney(30000)) { setPartyStatus("Pending_Approval"); startCooldown("p_cd", 60); setTimeout(() => setPartyStatus("Member_JPC"), 60000); }}} className="w-full py-2 bg-emerald-600 text-white font-bold rounded-lg">
                    Join JPC Ruling Party (30,000 g₦ • 60s Approval)
                  </button>
                )}
                {partyStatus === "Pending_Approval" && <div>⏳ Screening: {formatSecs(timers.p_cd)}</div>}
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div>2. Chairman Nomination Form: <strong className="text-amber-400">{nominationStatus}</strong></div>
                {nominationStatus === "None" && (
                  <button
                    onClick={() => {
                      if (partyStatus !== "Member_JPC") return setLogMessage("❌ Complete Step 1 (Party Membership Approval) first!");
                      if (spendMoney(450000)) {
                        setNominationStatus("Submitted_Verified");
                        setLogMessage("📜 Official Nomination Form Purchased & Verified!");
                      }
                    }}
                    className="w-full py-2 bg-amber-500 text-slate-950 font-extrabold rounded-lg"
                  >
                    Buy Nomination Form (450,000 g₦)
                  </button>
                )}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-amber-400">📢 City Billboard (75k) & Voting (+5k Reward)</h2>
              <button
                onClick={() => {
                  if (spendMoney(75000)) {
                    setCityBillboardText(`🗳️ VOTE ${username.toUpperCase()} FOR ${area.toUpperCase()} CHAIRMAN (JPC)!`);
                    setLogMessage("📢 Your Campaign Billboard is now live across Lagos!");
                  }
                }}
                className="w-full py-2.5 bg-indigo-600 text-white font-extrabold rounded-xl"
              >
                🎨 Publish Campaign Poster on City Billboard (75,000 g₦)
              </button>
              <button
                disabled={hasVoted}
                onClick={() => { setHasVoted(true); setEarnedBalance((e) => e + 5000); setCitizenPoints((p) => p + 20); setLogMessage("🗳️ Voted! +5,000 g₦ Voter Reward paid."); }}
                className="w-full py-3 bg-emerald-500 text-slate-950 font-extrabold rounded-xl disabled:opacity-40"
              >
                {hasVoted ? "✓ Voted" : "🗳️ Cast Ballot (+5,000 g₦ Voter Reward)"}
              </button>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 7: 🏆 COMPLETE CITIZEN PROFILE DOSSIER & CENTRAL BANK (FROM ₦500)
           ===================================================================== */}
        {activeTab === "profile" && (
          <div className="grid md:grid-cols-2 gap-4 text-xs">
            {/* COMPLETE ACHIEVEMENTS & QUALIFICATIONS RECORD */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <h2 className="font-bold text-sm text-amber-400">🏆 {username}&apos;s Full Qualifications &amp; Assets Dossier</h2>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                <div>🎓 <strong>Academic Degrees:</strong> {completedDegrees.length > 0 ? completedDegrees.join(" -> ") : "Uneducated"}</div>
                <div>🏅 <strong>Professional Certs:</strong> {professionalCerts.length > 0 ? professionalCerts.join(", ") : "None"}</div>
                <div>📘 <strong>Business Blueprints:</strong> {ownedBlueprints.length > 0 ? ownedBlueprints.join(", ") : "None"}</div>
                <div>🪪 <strong>FRSC Driver&apos;s License:</strong> {hasDriversLicense ? "✓ Licensed Driver" : "Unlicensed"}</div>
                <div>📄 <strong>CV Score:</strong> {cvScore}% • <strong>Outfit:</strong> {outfit}</div>
                <div>💍 <strong>Marital Status:</strong> {maritalStatus} {partnerName !== "None" && `with ${partnerName} (${relationshipBond}% Bond)`}</div>
                <div>🏠 <strong>Current Residence:</strong> {shelterType} in {shelterArea} ({ownershipMode})</div>
                <div>🏰 <strong>Owned Landlord Estates:</strong> {ownedProperties.length > 0 ? ownedProperties.map((p) => p.name).join(", ") : "None"}</div>
                <div>🚗 <strong>Vehicles in Garage ({carsOwned.length}/{parkingSlots}):</strong> {carsOwned.length > 0 ? carsOwned.join(", ") : "No Cars Owned"}</div>
                <div>🏛️ <strong>CAC &amp; Land C-of-O:</strong> CAC: {cacStatus} • C-of-O: {cofoStatus}</div>
              </div>
            </div>

            {/* CENTRAL BANK 300M RESERVE & MICRO BUY-INS */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <h2 className="font-bold text-sm text-emerald-400">🏦 Central Bank (Live 300M Reserve)</h2>
              <div className="p-2.5 bg-slate-950 border border-emerald-800/60 rounded-xl">
                <div className="text-[10px] text-slate-400">Available Reserve (Decreases as Players Buy):</div>
                <div className="font-extrabold text-sm text-amber-400">{centralBankReserve.toLocaleString()} g₦</div>
              </div>
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
              <button
                onClick={() => {
                  if (earnedBalance < 5000000) return setLogMessage("🔒 Minimum cashout is 5,000,000 g₦ (₦5,000) from Earned Wallet!");
                  const payout = Math.floor(earnedBalance / 1000);
                  setCentralBankReserve((r) => r + earnedBalance);
                  setEarnedBalance(0);
                  setLogMessage(`🏦 Withdrew ₦${payout.toLocaleString()} to your Bank Account!`);
                }}
                className="w-full py-2.5 bg-emerald-600 text-white font-extrabold rounded-xl"
              >
                💸 Withdraw Earned Cash (Min 5M g₦)
              </button>
            </div>
          </div>
        )}
      </main>

      {/* LAGOSFLIX YOUTUBE MODAL */}
      {showTvModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-rose-400 text-sm">📺 LagosFlix Smart TV — Featured Movie</h3>
              <button onClick={() => setShowTvModal(false)} className="text-xs bg-slate-800 px-3 py-1 rounded-lg text-white">Close TV</button>
            </div>
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
              <iframe className="w-full h-full" src="https://www.youtube.com/embed/jfKfPfyJRdk" title="LagosFlix" allowFullScreen />
            </div>
          </div>
        </div>
      )}

      {/* 7-TAB BOTTOM NAV */}
      <nav className="fixed bottom-0 inset-x-0 bg-slate-900/95 backdrop-blur border-t border-slate-800 px-2 py-2 z-40">
        <div className="max-w-4xl mx-auto grid grid-cols-7 gap-1">
          {[
            { id: "home", label: "My Home", icon: <Home className="w-4 h-4" /> },

            { id: "map", label: "Lagos Map", icon: <Map className="w-4 h-4" /> },
            { id: "jobs", label: "Jobs/Work", icon: <Briefcase className="w-4 h-4" /> },
            { id: "school", label: "School/PhD", icon: <GraduationCap className="w-4 h-4" /> },
            { id: "empire", label: "Biz & Cars", icon: <Building2 className="w-4 h-4" /> },
            { id: "politics", label: "Politics", icon: <Vote className="w-4 h-4" /> },
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