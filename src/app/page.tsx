"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { 
  Heart, Zap, Utensils, Sparkles, Tv, Home, Map,
  Briefcase, GraduationCap, Lock, Building2, 
  Clock, Award, Wrench, Fuel, Droplets, ZoomOut, ZoomIn, 
  FileText, Send, ShieldAlert, Dumbbell, Stethoscope, Trees, Vote
} from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

type AreaName = "Oshodi" | "Berger" | "Yaba" | "Surulere" | "Lekki";

const AREA_COORDS: Record<AreaName, number> = {
  Berger: 1,
  Oshodi: 2,
  Yaba: 3,
  Surulere: 4,
  Lekki: 6,
};

export default function LagosEmpireUltimateSimulator() {
  // 1. ONBOARDING
  const [isCreated, setIsCreated] = useState(false);
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");

  // 2. 15-MINUTE RUNNING CLOCK, WEATHER & 8-WEEK RENT EVICTION ENGINE
  const [gameHour, setGameHour] = useState(8);
  const [gameMinute, setGameMinute] = useState(0);
  const [gameDay, setGameDay] = useState(1);
  const [gameWeek, setGameWeek] = useState(1);
  const [weeksUntilRentDue, setWeeksUntilRentDue] = useState(8);
  const [weather, setWeather] = useState("Sunny 32°C");

  // 3. CENTRAL BANK 300M RESERVE, HOSPITAL LOAN & DUAL WALLETS
  const [centralBankReserve, setCentralBankReserve] = useState(300000000);
  const [starterBalance, setStarterBalance] = useState(50000);
  const [earnedBalance, setEarnedBalance] = useState(0);
  const [hospitalLoanDebt, setHospitalLoanDebt] = useState(0); // Auto-debited from earnings!
  const [transferRecipient, setTransferRecipient] = useState("");
  const [transferAmount, setTransferAmount] = useState("");

  // 4. LOCATION, MAP SUB-VIEW & HUMAN SURVIVAL STATS
  const [area, setArea] = useState<AreaName>("Oshodi");
  const [isMapZoomedOut, setIsMapZoomedOut] = useState(false);
  const [enteredBuildingId, setEnteredBuildingId] = useState<string>("None");
  const [health, setHealth] = useState(90);
  const [energy, setEnergy] = useState(60);
  const [hunger, setHunger] = useState(80);
  const [weight, setWeight] = useState(68.0);
  const [steeze, setSteeze] = useState(5);
  const [citizenPoints, setCitizenPoints] = useState(15);

  // 5. TIMERS ENGINE
  const [timers, setTimers] = useState<Record<string, number>>({});
  const startCooldown = (key: string, seconds: number) => {
    setTimers((prev) => ({ ...prev, [key]: seconds }));
  };

  // HELPER: Add Earned Money (Automatically deducts Hospital Loan if player owes the Hospital!)
  const receiveEarnedMoney = (amount: number, sourceLabel: string) => {
    if (hospitalLoanDebt > 0) {
      const deduction = Math.min(hospitalLoanDebt, Math.floor(amount * 0.5));
      const netPay = amount - deduction;
      setHospitalLoanDebt((d) => d - deduction);
      setEarnedBalance((e) => e + netPay);
      setLogMessage(
        `🏥 ${sourceLabel}: Earned +${amount.toLocaleString()} g₦, but -${deduction.toLocaleString()} g₦ was auto-debited for your Hospital Loan! (Remaining Loan: ${(hospitalLoanDebt - deduction).toLocaleString()} g₦).`
      );
    } else {
      setEarnedBalance((e) => e + amount);
      setLogMessage(`💰 ${sourceLabel}: +${amount.toLocaleString()} g₦ added to your Withdrawable Wallet!`);
    }
  };

  // MASTER CLOCK & EVICTION / HOSPITAL CHECK
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

          // Every 12 Game Hours (Half-Day) = Unlock 1 Eatery Collection Batch!
          if (nextH === 12 || nextH === 0) {
            setActiveBusinesses((prevBiz) =>
              prevBiz.map((b) => ({
                ...b,
                halfDayReady: b.foodStockRemaining > 0 && b.collectionsUsedThisCycle < 2,
              }))
            );
          }

          if (h >= 23) {
            setGameDay((d) => {
              const nd = d + 1;
              if (nd % 7 === 0) {
                setGameWeek((w) => w + 1);
                // Tick 8-Week Rent Due & 8-Week Landlord Tenant Collection!
                setWeeksUntilRentDue((r) => {
                  if (ownershipMode === "Bought_Owned") return 999;
                  const nextR = r - 1;
                  if (nextR <= 0) {
                    setShelterType("Evicted — Sleeping Under Bridge");
                    setParkingSlots(0);
                    setLogMessage("🚨 RENT OVERDUE EVICTION! Your landlord threw your things out! You are now sleeping Under the Bridge.");
                    return 0;
                  }
                  return nextR;
                });

                setOwnedProperties((props) =>
                  props.map((p) => ({
                    ...p,
                    weeksLeftToCollect: p.isListedWithAgent ? Math.max(0, p.weeksLeftToCollect - 1) : 8,
                  }))
                );
              }
              return nd;
            });
            setHustlesDoneToday(0);
            setWorkedOfficeToday(false);
          }
          return nextH;
        });

        // Stat Decay & Hospital Emergency Check
        setHunger((prevH) => {
          const nh = Math.max(0, prevH - 4);
          if (nh === 0) {
            setHealth((hp) => {
              const nextHp = Math.max(10, hp - 8);
              if (nextHp <= 20) {
                setHospitalLoanDebt((debt) => debt + 120000);
                setLogMessage("🚑 COLLAPSED FROM STARVATION! Rushed to Area Hospital and treated on a 120,000 g₦ Emergency Medical Loan (Auto-debited from future earnings)!");
                return 75;
              }
              return nextHp;
            });
          }
          return nh;
        });
        setEnergy((prevE) => Math.max(0, prevE - 3));
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

  // 6. HOME, FURNITURE & LANDLORD STATE (WITH AGENT FORM FEE & 8-WEEK COLLECTION WAIT)
  const [shelterType, setShelterType] = useState("Basic Single Room (120k/8Wks)");
  const [shelterArea, setShelterArea] = useState<AreaName>("Oshodi");
  const [ownershipMode, setOwnershipMode] = useState<"Rented" | "Bought_Owned">("Rented");
  const [rentPer8Weeks, setRentPer8Weeks] = useState(120000); // Low starter rent as requested!
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

  // Landlord Properties (Paid Form + 8-Week Countdown + Move-In vs Rent Choice!)
  const [ownedProperties, setOwnedProperties] = useState<{
    name: string;
    area: AreaName;
    roomsAvailable: number;
    parking: number;
    paidAgentForm: boolean;
    isListedWithAgent: boolean;
    listedPricePerRoom: number;
    weeksLeftToCollect: number; // Counts down from 8 weeks!
  }[]>([]);
  const [customRoomRentInput, setCustomRoomRentInput] = useState("250000");

  // 7. DRIVING LICENSE (75,000 g₦) & CARS (HIDDEN UNTIL BOUGHT)
  const [hasDriversLicense, setHasDriversLicense] = useState(false);
  const [drivingLessonsDone, setDrivingLessonsDone] = useState(0);
  const [carsOwned, setCarsOwned] = useState<string[]>([]);
  const [activeCar, setActiveCar] = useState<string>("None");
  const [carPetrol, setCarPetrol] = useState(100);
  const [carRadiatorWater, setCarRadiatorWater] = useState(100);
  const [carEngineHealth, setCarEngineHealth] = useState(100);

  // 8. STRICT EDUCATION & PROFESSIONAL PREREQUISITES
  const [completedDegrees, setCompletedDegrees] = useState<string[]>([]);
  const [professionalCerts, setProfessionalCerts] = useState<string[]>([]);
  const [ownedBlueprints, setOwnedBlueprints] = useState<string[]>([]);
  const [architectApprovedBps, setArchitectApprovedBps] = useState<string[]>([]); // Blueprints taken to Architect!
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

  // 9. JOBS & GIGS
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

  // 10. KIOSKS, EATERIES & DIGITAL AGENCIES (REQUIRES FOOD STOCK + HALF-DAY COLLECTION!)
  const [companyName, setCompanyName] = useState("");
  const [cacStatus, setCacStatus] = useState<"None" | "Processing" | "Approved">("None");
  const [cofoStatus, setCofoStatus] = useState<"None" | "Processing" | "Approved">("None");
  const [ownsBillboardAsset, setOwnsBillboardAsset] = useState(false);
  const [activeBusinesses, setActiveBusinesses] = useState<{
    name: string;
    type: "Food" | "Agency";
    area: AreaName;
    maxStaff: number;
    hiredStaff: number;
    maxCustomers: number;
    revenuePerHalfDay: number;
    foodStockRemaining: number; // Must > 0 to collect revenue!
    collectionsUsedThisCycle: number; // Max 2 collections per 2-day cycle!
    halfDayReady: boolean;
  }[]>([]);

  // 11. POLITICS (3-DAY MEMBERSHIP REQUIREMENT + MULTI-AGENCY POSTERS)
  const [partyStatus, setPartyStatus] = useState<"None" | "Pending_Approval" | "Member_JPC" | "Member_JSTD">("None");
  const [partyJoinedDay, setPartyJoinedDay] = useState<number>(0);
  const [nominationStatus, setNominationStatus] = useState<"None" | "Submitted_Verified">("None");
  const [hiredAgenciesForPoster, setHiredAgenciesForPoster] = useState<string[]>([]);
  const [cityBillboardText, setCityBillboardText] = useState("BILLBOARD AVAILABLE — Only Licensed Agencies & Billboard Owners Can Publish Here!");
  const [hasVoted, setHasVoted] = useState(false);

  // 12. COURTSHIP (10 DATES + LADY'S SPECIFIC REQUESTS)
  const [maritalStatus, setMaritalStatus] = useState<"Single" | "Courting" | "Married">("Single");
  const [partnerName, setPartnerName] = useState("None");
  const [partnerRequirement, setPartnerRequirement] = useState("Must own a TV & Cushion Sofa");
  const [datesCompleted, setDatesCompleted] = useState(0); // Need 10 dates!
  const [relationshipBond, setRelationshipBond] = useState(0);

  const [activeTab, setActiveTab] = useState<"map" | "home" | "jobs" | "school" | "empire" | "politics" | "profile">("map");
  const [logMessage, setLogMessage] = useState(
    "Welcome to Lagos! Click any Area on the Illustrated Town Map to enter its Sub-Map of buildings (Hospital, Gym, School, Church, Agent, etc.)."
  );

  const maxEnergyCap = bedTier === "Bare_Floor" ? 60 : bedTier === "Foam_Mattress" ? 85 : 100;

  // CALCULATE TOTAL NET WORTH & RICH LEVEL FOR PROFILE
  const totalNetWorth =
    starterBalance +
    earnedBalance +
    ownedProperties.length * 18000000 +
    carsOwned.length * 2500000 +
    activeBusinesses.length * 1200000;

  const richLevelTitle =
    totalNetWorth >= 100000000
      ? "💎 Lagos Billionaire Mogul"
      : totalNetWorth >= 25000000
      ? "🏰 Lekki Real Estate Tycoon"
      : totalNetWorth >= 5000000
      ? "👔 Corporate Oga / Boss"
      : totalNetWorth >= 500000
      ? "📈 Rising Hustler"
      : "🌱 Street Beginner";

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

  const handleCommuteTo = (dest: AreaName, mode: "trek" | "bus" | "cab" | "car") => {
    if (dest === area) return setLogMessage(`📍 You are already in ${dest}!`);
    const costs = getTransportCosts(dest);

    if (mode === "trek") {
      if (energy < costs.trekEnergy) return setLogMessage("⚠️ Too weak to trek! Take a Bus or Cab.");
      startCooldown("commute", 60);
      setEnergy((e) => Math.max(0, e - costs.trekEnergy));
      setHealth((h) => Math.max(15, h - costs.trekHealthLoss));
      setArea(dest);
      setEnteredBuildingId("None");
      setIsMapZoomedOut(false);
      setLogMessage(`🚶🏾‍♂️ Trekked to ${dest} (-${costs.trekEnergy}% Energy, 60s timer).`);
    } else if (mode === "bus") {
      if (!spendMoney(costs.busCost)) return;
      startCooldown("commute", 45);
      setArea(dest);
      setEnteredBuildingId("None");
      setIsMapZoomedOut(false);
      setLogMessage(`🚐 Took Danfo Bus to ${dest} (-${costs.busCost.toLocaleString()} g₦, 45s timer).`);
    } else if (mode === "cab") {
      if (!spendMoney(costs.cabCost)) return;
      startCooldown("commute", 25);
      setArea(dest);
      setEnteredBuildingId("None");
      setIsMapZoomedOut(false);
      setLogMessage(`🚕 Took Cab to ${dest} (-${costs.cabCost.toLocaleString()} g₦).`);
    } else if (mode === "car") {
      if (!hasDriversLicense) return setLogMessage("🚓 FRSC BLOCKED: Obtain your Driver's License (75k) at Oshodi Driving School first!");
      if (carPetrol < costs.petrolUsed || carRadiatorWater < costs.waterUsed || carEngineHealth < 30) {
        return setLogMessage("⚠️ Check your Car Petrol, Radiator Water, or Engine Health before driving!");
      }
      startCooldown("commute", 15);
      setCarPetrol((p) => Math.max(0, p - costs.petrolUsed));
      setCarRadiatorWater((w) => Math.max(0, w - costs.waterUsed));
      setCarEngineHealth((h) => Math.max(0, h - costs.wearTear));
      setArea(dest);
      setEnteredBuildingId("None");
      setIsMapZoomedOut(false);
      setLogMessage(`🚗 Drove ${activeCar} to ${dest}!`);
    }
  };

  if (!isCreated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border-2 border-emerald-500 rounded-2xl p-6 shadow-2xl">
          <div className="inline-block px-3 py-1 bg-emerald-500 text-slate-950 text-xs font-extrabold rounded-full mb-3">
            LAGOS EMPIRE — ILLUSTRATED TOWN & SUB-MAP EDITION
          </div>
          <h1 className="text-2xl font-extrabold mb-2">Start From Scratch</h1>
          <p className="text-slate-400 text-sm mb-6">
            Explore the illustrated 2D Town Map with roads, trees, hospitals, gyms, schools, churches, and offices. Stock food in your eateries, pay agent forms, and build your net worth.
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
              if (!username.trim()) return alert("Please enter your name!");
              setIsCreated(true);
            }}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl text-sm"
          >
            Enter Oshodi Town Map (50,000 g₦ Stipend)
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

  // SUB-MAP BUILDINGS FOR EACH AREA (INCLUDES HOSPITAL, GYM, CHURCH, SCHOOL, ETC.)
  const subMapBuildings: Record<AreaName, { id: string; roofColor: string; icon: string; name: string; sub: string }[]> = {
    Oshodi: [
      { id: "Hospital", roofColor: "bg-rose-600", icon: "🏥", name: "Oshodi General Hospital", sub: "Treat Health / Medical Loan" },
      { id: "Gym", roofColor: "bg-orange-600", icon: "🏋🏾‍♂️", name: "Oshodi Fitness Gym", sub: "Burn Weight & Boost Stamina" },
      { id: "Driving_School", roofColor: "bg-amber-600", icon: "🪪", name: "FRSC & Driving School", sub: "3 Lessons + 75k License" },
      { id: "Mechanic_Shop", roofColor: "bg-purple-600", icon: "🔧", name: "Mechanic & Radiator Depot", sub: "Fix Engine & Water" },
      { id: "Agent_Office", roofColor: "bg-cyan-600", icon: "🏘️", name: "Oshodi Estate Agent", sub: "Rent, Buy or Landlord Form" },
      { id: "Gas_Kitchen_Shop", roofColor: "bg-emerald-600", icon: "🔥", name: "Oshodi Market & Gas", sub: "Stove, Gas & Raw Food" },
      { id: "Church_Lounge", roofColor: "bg-indigo-600", icon: "⛪", name: "Oshodi Church & Park", sub: "Meet People & Dates" },
    ],
    Berger: [
      { id: "Auto_Dealership", roofColor: "bg-emerald-600", icon: "🚗", name: "Berger Motor Dealership", sub: "10 Car Models" },
      { id: "Filling_Station", roofColor: "bg-amber-600", icon: "⛽", name: "NNPC Mega Station", sub: "Petrol & Water" },
      { id: "Builder_Yard", roofColor: "bg-orange-600", icon: "🏗️", name: "Julius Berger Builders", sub: "Construct Blueprints" },
      { id: "Furniture_Shop", roofColor: "bg-indigo-600", icon: "🛏️", name: "Mattress & Sofa Showroom", sub: "Beds & Sofas" },
      { id: "Hospital", roofColor: "bg-rose-600", icon: "🏥", name: "Berger Medical Clinic", sub: "Treat Health" },
      { id: "Agent_Office", roofColor: "bg-cyan-600", icon: "🏘️", name: "Berger Estate Agent", sub: "Houses & Landlord Form" },
    ],
    Yaba: [
      { id: "Academic_Campus", roofColor: "bg-indigo-600", icon: "🎓", name: "Yaba Poly, Uni & PhD", sub: "10-Lecture Degrees" },
      { id: "Blueprint_Academy", roofColor: "bg-emerald-600", icon: "📘", name: "Blueprint & Pro Institute", sub: "Kiosk/Eatery BPs & ICAN" },
      { id: "Architect_Firm", roofColor: "bg-cyan-600", icon: "📐", name: "Yaba Architectural Firm", sub: "Approve Blueprints to Build" },
      { id: "Electronics_Shop", roofColor: "bg-purple-600", icon: "📺", name: "Yaba TV & Tech Plaza", sub: "4 TV Tiers" },
      { id: "Gym", roofColor: "bg-orange-600", icon: "🏋🏾‍♂️", name: "Yaba Fitness Center", sub: "Workout & Lose Weight" },
      { id: "Agent_Office", roofColor: "bg-amber-600", icon: "🏘️", name: "Yaba Estate Agent", sub: "Flats & Landlord Form" },
    ],
    Surulere: [
      { id: "CAC_Office", roofColor: "bg-amber-600", icon: "🏛️", name: "CAC Corporate Registry", sub: "Register Business" },
      { id: "Church_Lounge", roofColor: "bg-rose-600", icon: "🥂", name: "Surulere Mall & Lounge", sub: "Chat & 10-Date Courtship" },
      { id: "Gym", roofColor: "bg-orange-600", icon: "🏋🏾‍♂️", name: "National Stadium Gym", sub: "Fitness & Health" },
      { id: "Hospital", roofColor: "bg-emerald-600", icon: "🏥", name: "Surulere General Hospital", sub: "Medical Care" },
      { id: "Agent_Office", roofColor: "bg-cyan-600", icon: "🏘️", name: "Surulere Estate Agent", sub: "Duplexes & Landlord Form" },
    ],
    Lekki: [
      { id: "Lands_Bureau", roofColor: "bg-amber-600", icon: "📜", name: "Lekki Lands & C-of-O", sub: "Buy Land & C-of-O" },
      { id: "Foreign_Embassy", roofColor: "bg-indigo-600", icon: "✈️", name: "Foreign Embassy", sub: "Visa & Study Abroad" },
      { id: "Agent_Office", roofColor: "bg-cyan-600", icon: "🏰", name: "Lekki Luxury Estate Agent", sub: "Duplexes & Landlord Form" },
      { id: "Filling_Station", roofColor: "bg-emerald-600", icon: "⛽", name: "Lekki Express Fuel", sub: "Petrol & Water" },
      { id: "Church_Lounge", roofColor: "bg-rose-600", icon: "⛪", name: "Lekki VIP Lounge & Church", sub: "High-Class Courtship" },
      { id: "Hospital", roofColor: "bg-purple-600", icon: "🏥", name: "Lekki Lagoon Hospital", sub: "Executive Medical" },
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
                {hospitalLoanDebt > 0 && (
                  <span className="text-[11px] px-2 py-0.5 bg-red-600 text-white font-extrabold rounded-full">
                    🚑 Hospital Loan: -{hospitalLoanDebt.toLocaleString()} g₦
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2 mt-0.5">
                <span className="text-emerald-400 font-extrabold">📍 In: {area}</span>
                • 🏠 Home: {shelterType} ({shelterArea}) • {richLevelTitle}
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
                Withdrawable (Min 15M) <Lock className="w-2.5 h-2.5" />
              </div>
              <div className="font-extrabold text-sm text-emerald-400">{earnedBalance.toLocaleString()} g₦</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-4">
        {/* ALWAYS-VISIBLE "RETURN HOME / COMMUTE" BAR WHEN AWAY FROM HOME OR ON MAP! */}
        <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-emerald-400">
              🚌 Quick Bus &amp; Cab Terminal (Standing in {area} • Home is in {shelterArea}):
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {area !== shelterArea && (
              <button
                onClick={() => handleCommuteTo(shelterArea, "bus")}
                className="px-3 py-1 bg-emerald-500 text-slate-950 font-extrabold rounded-lg"
              >
                🚐 Take Bus Back Home to {shelterArea} ({getTransportCosts(shelterArea).busCost.toLocaleString()} g₦)
              </button>
            )}
            {(["Oshodi", "Berger", "Yaba", "Surulere", "Lekki"] as AreaName[]).map((dest) =>
              dest !== area ? (
                <button
                  key={dest}
                  onClick={() => handleCommuteTo(dest, "bus")}
                  className="px-2.5 py-1 bg-slate-950 border border-slate-700 hover:border-amber-400 rounded-lg font-bold"
                >
                  🚌 Bus to {dest} ({getTransportCosts(dest).busCost.toLocaleString()} g₦)
                </button>
              ) : null
            )}
          </div>
        </div>

        {/* METERS (CAR METERS HIDDEN UNTIL CAR IS BOUGHT) */}
        <div className={`grid grid-cols-2 ${carsOwned.length > 0 ? "sm:grid-cols-7" : "sm:grid-cols-4"} gap-2 bg-slate-900 border border-slate-800 rounded-2xl p-3`}>
          <StatBar icon={<Heart className="w-3.5 h-3.5 text-rose-400" />} label="Health" value={`${health}%`} pct={health} color="bg-rose-500" />
          <StatBar icon={<Zap className="w-3.5 h-3.5 text-amber-400" />} label={`Energy (Cap ${maxEnergyCap}%)`} value={`${energy}%`} pct={energy} color="bg-amber-500" />
          <StatBar icon={<Utensils className="w-3.5 h-3.5 text-orange-400" />} label="Belly/Diet" value={`${hunger}%`} pct={hunger} color="bg-orange-500" />
          <StatBar icon={<Sparkles className="w-3.5 h-3.5 text-cyan-400" />} label="Steeze" value={`${steeze} pts`} pct={Math.min(100, steeze)} color="bg-cyan-500" />
          {carsOwned.length > 0 && (
            <>
              <StatBar icon={<Fuel className="w-3.5 h-3.5 text-emerald-400" />} label="Car Petrol" value={`${carPetrol}%`} pct={carPetrol} color="bg-emerald-500" />
              <StatBar icon={<Droplets className="w-3.5 h-3.5 text-cyan-400" />} label="Radiator H2O" value={`${carRadiatorWater}%`} pct={carRadiatorWater} color="bg-cyan-500" />
              <StatBar icon={<Wrench className="w-3.5 h-3.5 text-purple-400" />} label="Car Engine" value={`${carEngineHealth}%`} pct={carEngineHealth} color="bg-purple-500" />
            </>
          )}
        </div>

        {/* CITY BILLBOARD (ONLY SHOWS IF PLAYER PURCHASED AN AGENCY OR BILLBOARD!) */}
        {(activeBusinesses.some((b) => b.type === "Agency") || ownsBillboardAsset) && (
          <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-amber-950/60 border border-amber-500/40 rounded-xl px-4 py-2 flex items-center justify-between text-xs">
            <span className="font-extrabold text-amber-300">📢 {area.toUpperCase()} AGENCY BILLBOARD:</span>
            <span className="text-white font-semibold truncate ml-2">{cityBillboardText}</span>
          </div>
        )}

        {/* EVENT LOG */}
        <div className="bg-emerald-950/40 border border-emerald-800/60 text-emerald-200 px-4 py-2.5 rounded-xl text-sm font-medium">
          🔔 {logMessage}
        </div>

        {/* =====================================================================
            TAB 1: 🗺️ ILLUSTRATED 2D TOWN MAP & SUB-MAP (ROADS, TREES & BUILDINGS)
           ===================================================================== */}
        {activeTab === "map" && (
          <div className="space-y-4 text-xs">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-extrabold text-base text-white">
                  🗺️ {isMapZoomedOut ? "Lagos State Master Map (Click Area to Travel)" : `${area} Illustrated Town Sub-Map (Roads, Trees & Buildings)`}
                </h2>
                <p className="text-slate-400 text-[11px]">
                  {isMapZoomedOut
                    ? "Select an Area below to commute via Bus, Cab, Trek, or Drive."
                    : `Click any illustrated building along ${area} Main Road below to walk inside!`}
                </p>
              </div>
              <button
                onClick={() => { setIsMapZoomedOut(!isMapZoomedOut); setEnteredBuildingId("None"); }}
                className="px-4 py-2.5 bg-amber-500 text-slate-950 font-extrabold rounded-xl flex items-center gap-1.5"
              >
                {isMapZoomedOut ? <ZoomIn className="w-4 h-4" /> : <ZoomOut className="w-4 h-4" />}
                {isMapZoomedOut ? `Enter ${area} Sub-Map` : "Zoom Out: View All 5 Lagos Areas"}
              </button>
            </div>

            {isMapZoomedOut ? (
              /* MASTER SATELLITE MAP OF ALL 5 AREAS */
              <div className="grid sm:grid-cols-5 gap-3 bg-emerald-950/20 border-2 border-emerald-900/60 p-4 rounded-2xl">
                {(["Berger", "Oshodi", "Yaba", "Surulere", "Lekki"] as AreaName[]).map((dest) => {
                  const isCurrent = area === dest;
                  const costs = getTransportCosts(dest);
                  return (
                    <div key={dest} className={`p-4 rounded-2xl border-2 flex flex-col justify-between space-y-3 ${isCurrent ? "bg-emerald-900/40 border-emerald-400" : "bg-slate-900 border-slate-800"}`}>
                      <div>
                        <div className="text-2xl mb-1">🏙️ 🌳</div>
                        <div className="font-extrabold text-base text-white">📍 {dest}</div>
                        {shelterArea === dest && <span className="inline-block mt-1 text-[10px] bg-indigo-600 px-2 py-0.5 rounded-full">🏠 My Home</span>}
                      </div>
                      {isCurrent ? (
                        <button onClick={() => setIsMapZoomedOut(false)} className="w-full py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-xl">
                          Open {dest} Sub-Map
                        </button>
                      ) : (
                        <div className="space-y-1.5 pt-2 border-t border-slate-800">
                          <button onClick={() => handleCommuteTo(dest, "trek")} className="w-full py-1.5 bg-slate-800 rounded-lg text-[10px]">🚶🏾‍♂️ Trek (₦0 • -{costs.trekEnergy}% En)</button>
                          <button onClick={() => handleCommuteTo(dest, "bus")} className="w-full py-1.5 bg-amber-500/20 border border-amber-500 text-amber-300 font-bold rounded-lg text-[10px]">🚐 Bus ({costs.busCost.toLocaleString()} g₦)</button>
                          <button onClick={() => handleCommuteTo(dest, "cab")} className="w-full py-1.5 bg-indigo-600 text-white font-bold rounded-lg text-[10px]">🚕 Cab ({costs.cabCost.toLocaleString()} g₦)</button>
                          {carsOwned.length > 0 && (
                            <button onClick={() => handleCommuteTo(dest, "car")} className="w-full py-1.5 bg-emerald-600 text-white font-extrabold rounded-lg text-[10px]">🚗 Drive {activeCar}</button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* ILLUSTRATED 2D TOWN SUB-MAP WITH ROADS, TREES & ARCHITECTURAL BUILDINGS */
              <div className="rounded-3xl border-4 border-emerald-800/80 bg-gradient-to-b from-emerald-950/70 via-emerald-900/30 to-emerald-950/70 p-5 space-y-5 relative overflow-hidden shadow-2xl">
                {/* DECORATIVE TREES & PARK HEADER */}
                <div className="flex justify-between items-center text-emerald-300/80 text-xs font-bold px-2">
                  <span>🌳 🌴 🌲 {area} Green Park &amp; Walkway</span>
                  <span>🚦 {area} Express Highway 🚗 🚐 🌳 🌴</span>
                </div>

                {/* TOP ROW OF ILLUSTRATED 2D BUILDINGS */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {shelterArea === area && (
                    <button
                      onClick={() => setActiveTab("home")}
                      className="group bg-slate-900/95 border-2 border-emerald-400 rounded-2xl overflow-hidden shadow-xl hover:scale-[1.03] transition flex flex-col"
                    >
                      <div className="w-full h-5 bg-emerald-500 flex items-center justify-center text-[10px] font-extrabold text-slate-950">
                        MY RESIDENCE ROOF
                      </div>
                      <div className="p-3 flex flex-col items-center gap-1">
                        <div className="text-3xl">🏡</div>
                        <div className="font-extrabold text-white text-xs">{shelterType}</div>
                        <div className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded text-[10px]">🚪 Enter My Home</div>
                      </div>
                    </button>
                  )}

                  {subMapBuildings[area].map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setEnteredBuildingId(b.id)}
                      className={`group bg-slate-900/95 border-2 ${
                        enteredBuildingId === b.id ? "border-amber-400 ring-2 ring-amber-400/50" : "border-slate-700"
                      } rounded-2xl overflow-hidden shadow-xl hover:scale-[1.03] transition flex flex-col`}
                    >
                      {/* 2D ARCHITECTURAL ROOF */}
                      <div className={`w-full h-5 ${b.roofColor} flex items-center justify-between px-2 text-[9px] font-extrabold text-white uppercase`}>
                        <span>🏢 {area}</span>
                        <span>■■</span>
                      </div>
                      {/* BUILDING FACADE & DOOR */}
                      <div className="p-3 flex flex-col items-center gap-1">
                        <div className="text-3xl">{b.icon}</div>
                        <div className="font-extrabold text-white text-xs text-center">{b.name}</div>
                        <div className="text-[10px] text-slate-400 text-center">{b.sub}</div>
                        <div className="mt-1 px-2.5 py-0.5 bg-slate-800 border border-slate-600 rounded text-[10px] text-emerald-300 font-bold">
                          🚪 Click to Enter Building
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* ILLUSTRATED ASPHALT ROAD DIVIDER WITH WHITE DASHED LINES */}
                <div className="w-full bg-slate-800 border-y-4 border-amber-500/60 py-2.5 px-4 flex items-center justify-between rounded-xl">
                  <span className="text-xs font-extrabold text-amber-400">🚐 {area} Main Bus Stop</span>
                  <div className="flex-1 border-t-2 border-dashed border-white/50 mx-4" />
                  <span className="text-xs font-extrabold text-emerald-300">🌳 🌴 Street Trees &amp; Sidewalk 🌳</span>
                </div>

                {/* ===============================================================
                    FULL INTERIOR VIEW OF WHATEVER BUILDING THE PLAYER ENTERED
                   =============================================================== */}

                {/* 1. HOSPITAL INTERIOR (EMERGENCY TREATMENT & MEDICAL LOAN) */}
                {enteredBuildingId === "Hospital" && (
                  <div className="p-4 bg-slate-950 border-2 border-rose-500 rounded-2xl space-y-3">
                    <h3 className="font-extrabold text-sm text-rose-400 flex items-center gap-2">
                      <Stethoscope className="w-4 h-4" /> Inside {area} General Hospital (Medical Care &amp; Emergency Loans)
                    </h3>
                    <p className="text-slate-400">
                      Current Health: <strong>{health}%</strong> • Active Medical Loan Debt: <strong className="text-rose-400">{hospitalLoanDebt.toLocaleString()} g₦</strong>
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => {
                          if (spendMoney(20000)) {
                            setHealth(100);
                            setLogMessage(`🏥 Treated at ${area} Hospital! Health restored to 100%.`);
                          }
                        }}
                        className="px-4 py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-xl"
                      >
                        💊 Pay Cash for Full Treatment (20,000 g₦ → 100% Health)
                      </button>
                      <button
                        onClick={() => {
                          setHealth(100);
                          setHunger(80);
                          setHospitalLoanDebt((d) => d + 50000);
                          setLogMessage("🚑 Treated on Emergency Hospital Credit (+50,000 g₦ Medical Loan)! 50% of your future job earnings will be auto-debited until paid.");
                        }}
                        className="px-4 py-2 bg-rose-600 text-white font-extrabold rounded-xl"
                      >
                        🚑 Treat on Hospital Loan (For Broke/Starving Players • +50k Debt)
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. FITNESS GYM INTERIOR */}
                {enteredBuildingId === "Gym" && (
                  <div className="p-4 bg-slate-950 border-2 border-orange-500 rounded-2xl space-y-3">
                    <h3 className="font-extrabold text-sm text-orange-400 flex items-center gap-2">
                      <Dumbbell className="w-4 h-4" /> Inside {area} Fitness &amp; Weight Loss Gym
                    </h3>
                    <p className="text-slate-400">Current Body Weight: <strong>{weight} kg</strong> • Health: <strong>{health}%</strong></p>
                    <button
                      disabled={!!timers.gym_cd}
                      onClick={() => {
                        if (energy < 25) return setLogMessage("⚠️ Need 25% Energy to workout!");
                        if (spendMoney(5000)) {
                          startCooldown("gym_cd", 60);
                          setEnergy((e) => Math.max(0, e - 25));
                          setWeight((w) => Number(Math.max(52, w - 0.8).toFixed(1)));
                          setHealth((h) => Math.min(100, h + 15));
                          setSteeze((s) => s + 10);
                          setLogMessage("🏋🏾‍♂️ Completed 60s Gym Workout! Burned 0.8kg fat, +15% Health, +10 Steeze!");
                        }
                      }}
                      className="px-4 py-2 bg-orange-500 text-slate-950 font-extrabold rounded-xl disabled:opacity-40"
                    >
                      {timers.gym_cd ? `⏳ Working Out (${formatSecs(timers.gym_cd)})` : "🏋🏾‍♂️ Daily Gym Pass & Workout (5,000 g₦ • 60s Timer)"}
                    </button>
                  </div>
                )}

                {/* 3. DRIVING SCHOOL (75,000 g₦ LICENSE!) */}
                {enteredBuildingId === "Driving_School" && (
                  <div className="p-4 bg-slate-950 border-2 border-amber-500 rounded-2xl space-y-3">
                    <h3 className="font-extrabold text-sm text-amber-400">🪪 Inside Oshodi Driving Academy &amp; FRSC Licensing (75,000 g₦)</h3>
                    <div className="flex flex-wrap gap-3">
                      <button
                        disabled={drivingLessonsDone >= 3 || !!timers.drv_cd}
                        onClick={() => {
                          if (spendMoney(25000)) {
                            startCooldown("drv_cd", 60);
                            setDrivingLessonsDone((d) => d + 1);
                            setLogMessage(`🚗 Completed Driving Lesson ${drivingLessonsDone + 1}/3!`);
                          }
                        }}
                        className="px-4 py-2 bg-amber-500 text-slate-950 font-extrabold rounded-xl disabled:opacity-40"
                      >
                        {timers.drv_cd ? `⏳ Lesson (${formatSecs(timers.drv_cd)})` : drivingLessonsDone >= 3 ? "✓ 3/3 Lessons Done" : `Take Driving Lesson (${drivingLessonsDone}/3) • 25,000 g₦`}
                      </button>
                      <button
                        disabled={hasDriversLicense || drivingLessonsDone < 3}
                        onClick={() => {
                          if (spendMoney(75000)) {
                            setHasDriversLicense(true);
                            setLogMessage("🪪 Official FRSC Driver's License Issued for 75,000 g₦!");
                          }
                        }}
                        className="px-4 py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-xl disabled:opacity-40"
                      >
                        {hasDriversLicense ? "✓ Licensed Driver" : "Obtain Official FRSC Driver's License (75,000 g₦)"}
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. ESTATE AGENT OFFICE (MOVE IN VS RENT OUT + PAY 50K FOR LANDLORD FORM + 8-WEEK RENT WAIT!) */}
                {enteredBuildingId === "Agent_Office" && (
                  <div className="p-4 bg-slate-950 border-2 border-cyan-500 rounded-2xl space-y-4">
                    <h3 className="font-extrabold text-sm text-cyan-400">
                      🏘️ Inside {area} Estate Agent Office (Rent, Buy Houses, or Purchase Landlord Agent Form)
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        { name: `${area} Basic Single Room`, park: 0, rooms: 1, rent: 120000, buy: 8500000 },
                        { name: `${area} 2-Bedroom Flat`, park: 2, rooms: 2, rent: 320000, buy: 18000000 },
                        { name: `${area} 3-Bedroom Flat`, park: 3, rooms: 3, rent: 650000, buy: 32000000 },
                        { name: `${area} 5-Bed Luxury Duplex`, park: 5, rooms: 5, rent: 1600000, buy: 60000000 },
                      ].map((p, i) => (
                        <div key={i} className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
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
                              Rent/8Wks ({(p.rent / 1000).toFixed(0)}k)
                            </button>
                            <button
                              onClick={() => {
                                if (spendMoney(p.buy)) {
                                  setOwnedProperties((prev) => [
                                    ...prev,
                                    {
                                      name: p.name,
                                      area,
                                      roomsAvailable: p.rooms,
                                      parking: p.park,
                                      paidAgentForm: false,
                                      isListedWithAgent: false,
                                      listedPricePerRoom: 250000,
                                      weeksLeftToCollect: 8,
                                    },
                                  ]);
                                  setLogMessage(`🏰 Purchased ${p.name}! Below, choose whether to Move Into It OR Pay the Agent Form to Rent It Out!`);
                                }
                              }}
                              className="py-1.5 bg-amber-500 text-slate-950 font-extrabold rounded-lg"
                            >
                              Buy ({(p.buy / 1000000).toFixed(1)}M g₦)
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* LANDLORD PROPERTY MANAGEMENT: MOVE IN VS BUY AGENT FORM (50K) & 8-WEEK RENT COLLECTION */}
                    <div className="p-3 bg-indigo-950/30 border border-indigo-500 rounded-xl space-y-3">
                      <div className="font-extrabold text-indigo-300">
                        📄 Landlord Property Portfolio (Move In Yourself OR Pay 50k Agent Form &amp; Wait 8 Weeks to Collect Rent)
                      </div>
                      {ownedProperties.length === 0 ? (
                        <p className="text-slate-400">You haven&apos;t bought any properties yet.</p>
                      ) : (
                        ownedProperties.map((op, idx) => (
                          <div key={idx} className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                            <div className="flex flex-wrap justify-between items-center gap-2">
                              <span className="font-bold text-white">
                                🏰 {op.name} ({op.area}) — {op.roomsAvailable} Rooms
                              </span>
                              {/* OPTION A: MOVE INTO THIS BOUGHT APARTMENT & RENT OUT OLD ONE */}
                              <button
                                onClick={() => {
                                  setShelterType(op.name);
                                  setShelterArea(op.area);
                                  setOwnershipMode("Bought_Owned");
                                  setWeeksUntilRentDue(999);
                                  setParkingSlots(op.parking);
                                  setLogMessage(`🏠 Moved into your purchased ${op.name} in ${op.area}! No more personal rent due.`);
                                }}
                                className="px-3 py-1 bg-indigo-600 text-white font-bold rounded-lg"
                              >
                                🏠 Move Into This Apartment
                              </button>
                            </div>

                            {/* OPTION B: PAY AGENT FOR LANDLORD FORM -> LIST PRICE -> WAIT 8 WEEKS TO COLLECT! */}
                            {!op.paidAgentForm ? (
                              <button
                                onClick={() => {
                                  if (area !== op.area) return setLogMessage(`🚌 Visit the Estate Agent Office in ${op.area} to buy this form!`);
                                  if (spendMoney(50000)) {
                                    const up = [...ownedProperties];
                                    up[idx].paidAgentForm = true;
                                    setOwnedProperties(up);
                                    setLogMessage(`📝 Paid 50,000 g₦ to ${area} Estate Agent and collected the Landlord Listing Form!`);
                                  }
                                }}
                                className="w-full py-2 bg-amber-500 text-slate-950 font-extrabold rounded-lg"
                              >
                                Step 1: Pay Agent &amp; Collect Landlord Form (50,000 g₦)
                              </button>
                            ) : !op.isListedWithAgent ? (
                              <div className="flex gap-2">
                                <input
                                  type="number"
                                  value={customRoomRentInput}
                                  onChange={(e) => setCustomRoomRentInput(e.target.value)}
                                  className="w-32 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white"
                                  placeholder="Price per room"
                                />
                                <button
                                  onClick={() => {
                                    const price = Number(customRoomRentInput) || 250000;
                                    const up = [...ownedProperties];
                                    up[idx].listedPricePerRoom = price;
                                    up[idx].isListedWithAgent = true;
                                    up[idx].weeksLeftToCollect = 8; // Starts 8-Week Countdown!
                                    setOwnedProperties(up);
                                    setLogMessage(`🏘️ Submitted Landlord Form! Tenants moved in. 8-Week Rent Collection Countdown has started!`);
                                  }}
                                  className="flex-1 py-1.5 bg-emerald-500 text-slate-950 font-extrabold rounded-lg"
                                >
                                  Step 2: Submit Form &amp; Start 8-Week Tenant Cycle
                                </button>
                              </div>
                            ) : (
                              <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg">
                                <span className="text-amber-300 font-bold">
                                  ⏳ 8-Week Rent Cycle: {op.weeksLeftToCollect > 0 ? `${op.weeksLeftToCollect} Weeks Remaining` : "✅ READY TO COLLECT!"}
                                </span>
                                <button
                                  disabled={op.weeksLeftToCollect > 0}
                                  onClick={() => {
                                    const netRent = Math.floor(op.listedPricePerRoom * op.roomsAvailable * 0.9);
                                    const up = [...ownedProperties];
                                    up[idx].weeksLeftToCollect = 8; // Resets for next 8 weeks!
                                    setOwnedProperties(up);
                                    receiveEarnedMoney(netRent, `8-Week Tenant Rent from ${op.name}`);
                                  }}
                                  className="px-3 py-1.5 bg-emerald-500 text-slate-950 font-extrabold rounded-lg disabled:opacity-40"
                                >
                                  {op.weeksLeftToCollect > 0 ? `Wait ${op.weeksLeftToCollect} Wks` : "💰 Collect 8-Week Rent"}
                                </button>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* 5. YABA ARCHITECTURAL FIRM (APPROVE COMPLETED BLUEPRINTS FOR CONSTRUCTION!) */}
                {enteredBuildingId === "Architect_Firm" && (
                  <div className="p-4 bg-slate-950 border-2 border-cyan-500 rounded-2xl space-y-3">
                    <h3 className="font-extrabold text-sm text-cyan-400">
                      📐 Inside Yaba Architectural Firm (Convert Your Studied Blueprints Into Structural Plans)
                    </h3>
                    <p className="text-slate-400">
                      After completing a Blueprint study in School, bring it here so the Architect stamps it for the Construction Builders!
                    </p>
                    {ownedBlueprints.length === 0 ? (
                      <p className="text-rose-400 font-bold">❌ You haven&apos;t studied any Business Blueprints yet! Visit the School/Blueprint tab first.</p>
                    ) : (
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        {ownedBlueprints.map((bp) => {
                          const isApproved = architectApprovedBps.includes(bp);
                          return (
                            <button
                              key={bp}
                              disabled={isApproved}
                              onClick={() => {
                                if (spendMoney(150000)) {
                                  setArchitectApprovedBps((a) => [...a, bp]);
                                  setLogMessage(`📐 Architect stamped your ${bp} structural plan! Now go to Empire/Builders to open your business.`);
                                }
                              }}
                              className="p-3 bg-slate-900 border border-cyan-700 rounded-xl font-bold flex justify-between disabled:opacity-40"
                            >
                              <span>{isApproved ? `✓ Architect Stamped: ${bp}` : `Stamp ${bp} Plan`}</span>
                              <span className="text-amber-400">150,000 g₦</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* 6. CHURCH & LOUNGE INTERIOR (10 DATES + LADY'S SPECIFIC REQUESTS!) */}
                {enteredBuildingId === "Church_Lounge" && (
                  <div className="p-4 bg-slate-950 border-2 border-rose-500 rounded-2xl space-y-3">
                    <h3 className="font-extrabold text-sm text-rose-400">
                      ⛪ Inside {area} Church &amp; Social Lounge (Meet Partners &amp; Complete 10 Dates)
                    </h3>
                    {maritalStatus === "Single" ? (
                      <div className="grid sm:grid-cols-3 gap-2.5">
                        {[
                          { name: "Chidinma (Lekki)", req: "Must own a Smart TV & Cushion Sofa" },
                          { name: "Zainab (Yaba)", req: "Must hold a B.Sc or HND Degree" },
                          { name: "Tolu (Surulere)", req: "Must own a Personal Car" },
                        ].map((p) => (
                          <div key={p.name} className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5">
                            <div className="font-bold text-white">{p.name}</div>
                            <div className="text-[10px] text-amber-300">Her Request: {p.req}</div>
                            <button
                              onClick={() => {
                                setPartnerName(p.name);
                                setPartnerRequirement(p.req);
                                setMaritalStatus("Courting");
                                setDatesCompleted(1);
                                setRelationshipBond(10);
                                setLogMessage(`❤️ Started courting ${p.name} (1/10 Dates, 10% Bond)! Her requirement: ${p.req}.`);
                              }}
                              className="w-full py-1.5 bg-rose-600 text-white font-bold rounded-lg"
                            >
                              💬 Start Courting (Date 1/10)
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-900 border border-rose-700 rounded-xl space-y-2">
                        <div className="font-bold text-white">
                          💑 Courting: {partnerName} • Dates: <span className="text-emerald-400">{datesCompleted}/10 Dates</span> ({relationshipBond}% Bond)
                        </div>
                        <div className="text-amber-300 text-[11px]">Partner&apos;s Marriage Requirement: {partnerRequirement}</div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            disabled={!!timers.date_cd || datesCompleted >= 10}
                            onClick={() => {
                              if (energy < 30 || health < 60) return setLogMessage("⚠️ Need 30% Energy & 60% Health for a date!");
                              if (spendMoney(25000)) {
                                startCooldown("date_cd", 60);
                                setEnergy((e) => Math.max(0, e - 25));
                                setDatesCompleted((d) => Math.min(10, d + 1));
                                setRelationshipBond((b) => Math.min(100, b + 10));
                                setLogMessage(`🍷 Completed Date ${datesCompleted + 1}/10 with ${partnerName}!`);
                              }
                            }}
                            className="px-4 py-2 bg-rose-600 text-white font-bold rounded-lg disabled:opacity-40"
                          >
                            {timers.date_cd ? `⏳ On Date (${formatSecs(timers.date_cd)})` : `🍷 Go on Date #${datesCompleted + 1}/10 (25,000 g₦ • 60s)`}
                          </button>
                          <button
                            disabled={maritalStatus === "Married"}
                            onClick={() => {
                              if (datesCompleted < 10) return setLogMessage(`❌ You must complete all 10/10 dates first! (${datesCompleted}/10 done).`);
                              if (tvTier === "None" || chairTier === "None") return setLogMessage(`❌ You haven't met ${partnerName}'s requirement (${partnerRequirement})!`);
                              if (spendMoney(150000)) {
                                setMaritalStatus("Married");
                                setSteeze((s) => s + 60);
                                setLogMessage(`💍 Married ${partnerName} after 10 successful dates!`);
                              }
                            }}
                            className="px-4 py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-lg"
                          >
                            💍 Propose &amp; Marry (Req: 10/10 Dates • 150k g₦)
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* QUICK HANDLERS FOR OTHER SUB-MAP BUILDINGS */}
                {(enteredBuildingId === "Mechanic_Shop" || enteredBuildingId === "Filling_Station") && (
                  <div className="p-4 bg-slate-950 border-2 border-emerald-500 rounded-2xl flex flex-wrap gap-3">
                    <button onClick={() => { if (spendMoney(18000)) { setCarPetrol(100); setLogMessage("⛽ Petrol 100%!"); }}} className="px-4 py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-xl">⛽ Refill Petrol (18k)</button>
                    <button onClick={() => { if (spendMoney(3000)) { setCarRadiatorWater(100); setLogMessage("💧 Radiator Water 100%!"); }}} className="px-4 py-2 bg-cyan-500 text-slate-950 font-extrabold rounded-xl">💧 Add Radiator Water (3k)</button>
                    <button onClick={() => { if (spendMoney(35000)) { setCarEngineHealth(100); setLogMessage("🔧 Engine Repaired to 100%!"); }}} className="px-4 py-2 bg-purple-600 text-white font-extrabold rounded-xl">🔧 Fix Car Engine (35k)</button>
                  </div>
                )}

                {(enteredBuildingId === "Auto_Dealership" || enteredBuildingId === "Builder_Yard" || enteredBuildingId === "CAC_Office" || enteredBuildingId === "Lands_Bureau") && (
                  <div className="p-4 bg-slate-950 border-2 border-amber-500 rounded-2xl flex items-center justify-between">
                    <span className="font-bold text-amber-300">🏢 Inside {enteredBuildingId.replace("_", " ")} in {area}</span>
                    <button onClick={() => setActiveTab("empire")} className="px-4 py-2 bg-amber-500 text-slate-950 font-extrabold rounded-xl">
                      Open Full Dealership &amp; Construction Desk
                    </button>
                  </div>
                )}

                {(enteredBuildingId === "Academic_Campus" || enteredBuildingId === "Blueprint_Academy" || enteredBuildingId === "Foreign_Embassy") && (
                  <div className="p-4 bg-slate-950 border-2 border-indigo-500 rounded-2xl flex items-center justify-between">
                    <span className="font-bold text-indigo-300">🎓 Inside {enteredBuildingId.replace("_", " ")} in {area}</span>
                    <button onClick={() => setActiveTab("school")} className="px-4 py-2 bg-indigo-500 text-white font-extrabold rounded-xl">
                      Open Lecture Hall &amp; Blueprint Catalog
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* =====================================================================
            TAB 2: 🏠 MY HOME (FULL INTERIOR: PAINTING, TV, LAGOSFLIX, STOVE & RENT)
           ===================================================================== */}
        {activeTab === "home" && (
          <div className="grid md:grid-cols-3 gap-4 text-xs">
            <div className={`md:col-span-2 rounded-2xl border-2 p-6 relative min-h-[380px] flex flex-col justify-between transition-all ${wallBgMap[wallColor]}`}>
              {area !== shelterArea ? (
                <div className="my-auto text-center bg-black/80 p-6 rounded-2xl border border-rose-500 space-y-3">
                  <h3 className="font-extrabold text-base text-rose-400">You Are Currently in {area}, Not at Home in {shelterArea}!</h3>
                  <button onClick={() => handleCommuteTo(shelterArea, "bus")} className="px-4 py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-xl">
                    🚐 Take Bus Back Home to {shelterArea} ({getTransportCosts(shelterArea).busCost.toLocaleString()} g₦)
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start gap-2">
                    <div className="space-y-1">
                      <span className="bg-black/65 px-3 py-1 rounded-lg font-extrabold text-emerald-300 block">
                        🏠 {shelterType} in {shelterArea} ({ownershipMode})
                      </span>
                      <span className="bg-black/65 px-3 py-1 rounded-lg text-amber-300 block">
                        🧱 Wall: {wallColor} • 👔 Outfit: {outfit}
                      </span>
                    </div>
                    <div className="bg-slate-950/90 border-2 border-slate-700 rounded-xl p-3 text-center">
                      <div className="text-2xl">{tvTier === "None" ? "📦" : "📺"}</div>
                      <div className="font-bold">{tvTier === "None" ? "No TV" : tvTier}</div>
                      {tvTier !== "None" && (
                        <button
                          onClick={() => {
                            if (!hasLagosFlix) return setLogMessage("⚠️ Subscribe to LagosFlix first!");
                            setShowTvModal(true);
                            setEnergy((e) => Math.min(maxEnergyCap, e + 15));
                          }}
                          className="mt-1.5 px-2.5 py-1 bg-rose-600 text-white rounded text-[10px] font-bold"
                        >
                          ▶ Watch LagosFlix
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 my-6">
                    <div className="bg-black/50 border border-white/10 rounded-xl p-3 text-center">
                      <div className="text-2xl">{bedTier === "Bare_Floor" ? "🪵" : bedTier === "Foam_Mattress" ? "🛏️" : "👑"}</div>
                      <div className="text-[10px] text-slate-300">Bed (Cap {maxEnergyCap}%)</div>
                      <div className="font-bold">{bedTier.replace("_", " ")}</div>
                    </div>
                    <div className="bg-black/50 border border-white/10 rounded-xl p-3 text-center">
                      <div className="text-2xl">{chairTier === "None" ? "🚫" : "🛋️"}</div>
                      <div className="text-[10px] text-slate-300">Seating</div>
                      <div className="font-bold">{chairTier.replace("_", " ")}</div>
                    </div>
                    <div className="bg-black/50 border border-white/10 rounded-xl p-3 text-center">
                      <div className="text-2xl">{hasCookingStove ? "🔥" : "🍳"}</div>
                      <div className="text-[10px] text-slate-300">Kitchen</div>
                      <div className="font-bold">{hasCookingStove ? `Gas (${gasLevel}%)` : "No Stove"}</div>
                    </div>
                  </div>

                  <div className="bg-black/55 p-3 rounded-xl border border-white/10 flex flex-wrap items-center justify-between gap-2">
                    <span>🍲 Raw Food Stock: <strong>{rawFoodServings} Meals</strong> • 🔥 Gas: <strong>{gasLevel}%</strong></span>
                    <button
                      disabled={!!timers.cook_cd}
                      onClick={() => {
                        if (!hasCookingStove || gasLevel < 10 || rawFoodServings < 1) return setLogMessage("❌ Buy Stove, Gas & Raw Food on the right panel first!");
                        startCooldown("cook_cd", 60);
                        setGasLevel((g) => g - 10);
                        setRawFoodServings((r) => r - 1);
                        setHunger(100);
                        setEnergy((e) => Math.min(maxEnergyCap, e + 40));
                        setHealth((h) => Math.min(100, h + 10));
                        setLogMessage("🍳 Cooked a fresh meal at home! (+40% Energy, +10% Health).");
                      }}
                      className="px-3 py-1.5 bg-emerald-500 text-slate-950 font-extrabold rounded-lg"
                    >
                      🍳 Cook Meal at Home (60s)
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs">
              <h2 className="font-bold text-sm text-emerald-400">🛠️ Furnish &amp; Home Controls</h2>
              <button
                onClick={() => { setEnergy(maxEnergyCap); setGameDay((d) => d + 1); setLogMessage(`🛌 Slept overnight! Energy restored to ${maxEnergyCap}%.`); }}
                className="w-full py-2.5 bg-indigo-600 text-white font-extrabold rounded-xl"
              >
                🛌 Sleep Overnight (Restores {maxEnergyCap}% En)
              </button>
              {ownershipMode === "Rented" && (
                <button
                  onClick={() => { if (spendMoney(rentPer8Weeks)) { setWeeksUntilRentDue(8); setLogMessage("🏠 Paid 8-Week Rent!"); }}}
                  className="w-full py-2 bg-rose-950 border border-rose-700 text-rose-300 font-bold rounded-xl"
                >
                  Pay Rent ({rentPer8Weeks.toLocaleString()} g₦ • Due in {weeksUntilRentDue} Wks)
                </button>
              )}
              <div className="grid grid-cols-3 gap-1 pt-1">
                {(["Cream", "Emerald", "RoyalBlue"] as const).map((col) => (
                  <button key={col} onClick={() => { if (spendMoney(25000)) { setWallColor(col); setLogMessage(`🎨 Painted ${col}!`); }}} className="p-1.5 bg-slate-950 border border-slate-800 rounded">🎨 {col} (25k)</button>
                ))}
              </div>
              <button onClick={() => { if (spendMoney(30000)) { setBedTier("Foam_Mattress"); setEnergy(85); }}} className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl flex justify-between"><span>🛏️ Foam Mattress (85% Cap)</span><span className="text-amber-400">30k</span></button>
              <button onClick={() => { if (spendMoney(95000)) { setBedTier("King_Bed"); setEnergy(100); }}} className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl flex justify-between"><span>👑 Royal King Bed (100% Cap)</span><span className="text-amber-400">95k</span></button>
              <button onClick={() => { if (spendMoney(55000)) setChairTier("Cushion_Sofa"); }} className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl flex justify-between"><span>🛋️ Cushion Sofa Set</span><span className="text-amber-400">55k</span></button>
              <button onClick={() => { if (spendMoney(175000)) setTvTier("55-Inch Smart TV"); }} className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl flex justify-between"><span>📺 55&quot; Smart TV</span><span className="text-amber-400">175k</span></button>
              <button onClick={() => { if (spendMoney(12500)) setHasLagosFlix(true); }} className="w-full p-2 bg-rose-950/40 border border-rose-800 rounded-xl flex justify-between"><span>🍿 Subscribe LagosFlix</span><span className="text-rose-400">12.5k</span></button>
              <div className="grid grid-cols-3 gap-1 pt-1">
                <button onClick={() => { if (spendMoney(35000)) { setHasCookingStove(true); setGasLevel(60); }}} className="p-1.5 bg-slate-950 border border-orange-700 rounded">🔥 Stove (35k)</button>
                <button onClick={() => { if (spendMoney(12000)) setGasLevel(100); }} className="p-1.5 bg-slate-950 border border-amber-700 rounded">⛽ Gas (12k)</button>
                <button onClick={() => { if (spendMoney(10000)) setRawFoodServings((r) => r + 5); }} className="p-1.5 bg-slate-950 border border-emerald-700 rounded">🌾 5 Food (10k)</button>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 3: 💼 JOBS (AREA-LOCKED HUSTLES, 7 CORPORATES & SOCIAL GIGS)
           ===================================================================== */}
        {activeTab === "jobs" && (
          <div className="grid md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
              <h2 className="font-bold text-sm text-amber-400">🧱 Area-Locked Street Hustles ({hustlesDoneToday}/3)</h2>
              {[
                { id: "h1", name: "📦 Oshodi Market Carrier", loc: "Oshodi" as AreaName, pay: 6500, cd: 60 },
                { id: "h2", name: "🧱 Berger Cement Offloading", loc: "Berger" as AreaName, pay: 9000, cd: 75 },
                { id: "h3", name: "🍽️ Yaba Kitchen Dishwashing", loc: "Yaba" as AreaName, pay: 8000, cd: 60 },
                { id: "h4", name: "🎉 Surulere Event Server", loc: "Surulere" as AreaName, pay: 9500, cd: 75 },
                { id: "h5", name: "🏗️ Lekki Site Bricklayer", loc: "Lekki" as AreaName, pay: 14000, cd: 90 },
              ].map((h) => (
                <div key={h.id} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                  <div>
                    <div className="font-bold">{h.name} (📍 {h.loc})</div>
                    <div className="text-emerald-400">+{h.pay.toLocaleString()} g₦ • {h.cd}s Timer</div>
                  </div>
                  <button
                    disabled={!!timers[h.id] || hustlesDoneToday >= 3}
                    onClick={() => {
                      if (area !== h.loc) return setLogMessage(`🚌 Travel to ${h.loc} first!`);
                      if (energy < 25) return setLogMessage("⚠️ Need 25% Energy!");
                      startCooldown(h.id, h.cd);
                      setHustlesDoneToday((d) => d + 1);
                      setEnergy((e) => Math.max(0, e - 25));
                      receiveEarnedMoney(h.pay, h.name);
                    }}
                    className="px-3 py-1.5 bg-amber-500 text-slate-950 font-extrabold rounded-lg disabled:opacity-40"
                  >
                    {timers[h.id] ? formatSecs(timers[h.id]) : "Work"}
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
              <h2 className="font-bold text-sm text-cyan-400">🏢 Corporate Careers (3-Day Paycheck)</h2>
              {employedJob ? (
                <div className="p-3 bg-cyan-950/30 border border-cyan-700 rounded-xl space-y-2">
                  <div className="font-bold text-white">{employedJob.title} at {employedJob.company} ({employedJob.area})</div>
                  <div>Attendance: {daysWorkedThisCycle}/3 Days • Pay: {employedJob.payPer3Days.toLocaleString()} g₦</div>
                  <button
                    disabled={workedOfficeToday}
                    onClick={() => {
                      if (area !== employedJob.area) return setLogMessage(`🚌 Travel to ${employedJob.area} first!`);
                      setWorkedOfficeToday(true);
                      const nextD = daysWorkedThisCycle + 1;
                      if (nextD >= 3) {
                        setDaysWorkedThisCycle(0);
                        receiveEarnedMoney(employedJob.payPer3Days, `${employedJob.company} 3-Day Salary`);
                      } else {
                        setDaysWorkedThisCycle(nextD);
                        setLogMessage(`🏢 Worked day ${nextD}/3!`);
                      }
                    }}
                    className="w-full py-2 bg-cyan-500 text-slate-950 font-extrabold rounded-xl"
                  >
                    Clock In at {employedJob.area} Office
                  </button>
                  <button onClick={() => setEmployedJob(null)} className="w-full text-slate-400 underline">Resign</button>
                </div>
              ) : (
                [
                  { title: "IT Technician", comp: "Yaba Tech", area: "Yaba" as AreaName, reqDeg: "Polytechnic ND", reqCert: null, pay: 85000 },
                  { title: "Site Supervisor", comp: "Julius Berger", area: "Berger" as AreaName, reqDeg: "Polytechnic HND", reqCert: null, pay: 145000 },
                  { title: "Bank Auditor", comp: "Zenith Lekki", area: "Lekki" as AreaName, reqDeg: "University B.Sc", reqCert: "ICAN", pay: 340000 },
                  { title: "Project Director", comp: "Berger Infra", area: "Berger" as AreaName, reqDeg: "Masters (M.Sc)", reqCert: "PMP", pay: 680000 },
                  { title: "VP Offshore Oil", comp: "Chevron VI", area: "Lekki" as AreaName, reqDeg: "Doctorate (Ph.D)", reqCert: "HSE", pay: 1350000 },
                ].map((j, i) => (
                  <div key={i} className="p-2 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                    <div>
                      <div className="font-bold">{j.title} ({j.area})</div>
                      <div className="text-[10px] text-slate-400">Req: {j.reqDeg} {j.reqCert && `+ ${j.reqCert}`} • {j.pay.toLocaleString()} g₦</div>
                    </div>
                    <button
                      onClick={() => {
                        if (!completedDegrees.includes(j.reqDeg)) return setLogMessage(`❌ Requires ${j.reqDeg}!`);
                        if (j.reqCert && !professionalCerts.includes(j.reqCert)) return setLogMessage(`❌ Requires ${j.reqCert} Pro Cert!`);
                        setEmployedJob({ title: j.title, company: j.comp, area: j.area, payPer3Days: j.pay });
                        setLogMessage(`🎉 Hired at ${j.comp}!`);
                      }}
                      className="px-2.5 py-1 bg-cyan-600 text-white font-bold rounded"
                    >
                      Apply
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <h2 className="font-bold text-sm text-emerald-400">📱 Social Gigs (3m–5m Batch Cooldown)</h2>
              {[
                { id: "sg1", title: "Follow JPC on X", reward: 2500, cd: 180 },
                { id: "sg2", title: "Follow Dev Board on LinkedIn", reward: 4000, cd: 240 },
                { id: "sg3", title: "Beta Test Partner App", reward: 12000, cd: 300 },
              ].map((g) => (
                <div key={g.id} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                  <div className="flex justify-between font-bold"><span>{g.title}</span><span className="text-emerald-400">+{g.reward} g₦</span></div>
                  {timers[g.id] ? (
                    <div className="text-amber-400 font-bold text-center">⏳ Next Batch: {formatSecs(timers[g.id])}</div>
                  ) : (
                    <div className="flex gap-1">
                      <input type="text" placeholder="@handle..." value={gigProofInputs[g.id] || ""} onChange={(e) => setGigProofInputs((p) => ({ ...p, [g.id]: e.target.value }))} className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white" />
                      <button onClick={() => { if (!gigProofInputs[g.id]) return; startCooldown(g.id, g.cd); receiveEarnedMoney(g.reward, g.title); }} className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded">Claim</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 4: 🎓 STRICT ACADEMIC & PROFESSIONAL PREREQUISITES + BLUEPRINTS
           ===================================================================== */}
        {activeTab === "school" && (
          <div className="grid md:grid-cols-3 gap-4 text-xs">
            {/* 1. ACADEMIC LADDER (ND -> HND, BSc -> MASTERS -> PHD) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <h2 className="font-bold text-sm text-amber-400">🎓 10-Lecture Degrees (Strict Hierarchy)</h2>
              {enrolledProgram ? (
                <div className="p-3 bg-indigo-950/50 border-2 border-indigo-500 rounded-xl space-y-2">
                  <div className="font-extrabold text-white">Studying: {enrolledProgram.name} ({enrolledProgram.completedClasses}/10 Lectures)</div>
                  <div className="text-rose-300">Drains -{enrolledProgram.energyPerLecture}% Energy • {enrolledProgram.timerSeconds}s Timer</div>
                  <button
                    disabled={!!timers.lec_cd}
                    onClick={() => {
                      if (energy < enrolledProgram.energyPerLecture) return setLogMessage(`⚠️ Need ${enrolledProgram.energyPerLecture}% Energy! Upgrade to a King Bed (100% Cap) or eat first.`);
                      startCooldown("lec_cd", enrolledProgram.timerSeconds);
                      setEnergy((e) => Math.max(0, e - enrolledProgram.energyPerLecture));
                      const nextC = enrolledProgram.completedClasses + 1;
                      if (nextC >= 10) {
                        setCompletedDegrees((d) => [...d, enrolledProgram.name]);
                        setEnrolledProgram(null);
                        setLogMessage(`🎓 Completed 10/10 Lectures & Graduated with ${enrolledProgram.name}!`);
                      } else {
                        setEnrolledProgram({ ...enrolledProgram, completedClasses: nextC });
                        setLogMessage(`📖 Completed Lecture ${nextC}/10!`);
                      }
                    }}
                    className="w-full py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-xl disabled:opacity-40"
                  >
                    {timers.lec_cd ? `⏳ Lecture (${formatSecs(timers.lec_cd)})` : `Attend Lecture #${enrolledProgram.completedClasses + 1}/10`}
                  </button>
                </div>
              ) : (
                [
                  { id: "ND", name: "Polytechnic ND", cost: 220000, en: 40, sec: 60, req: null },
                  { id: "HND", name: "Polytechnic HND", cost: 350000, en: 50, sec: 75, req: "Polytechnic ND" },
                  { id: "BSC", name: "University B.Sc", cost: 680000, en: 65, sec: 90, req: null },
                  { id: "MSC", name: "Masters (M.Sc)", cost: 1400000, en: 80, sec: 100, req: "University B.Sc" },
                  { id: "PHD", name: "Doctorate (Ph.D)", cost: 2800000, en: 95, sec: 120, req: "Masters (M.Sc)" },
                ].map((d) => (
                  <div key={d.id} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white">{d.name} (-{d.en}% En/class)</div>
                      <div className="text-[10px] text-amber-400">{d.cost.toLocaleString()} g₦ {d.req && `• Req: ${d.req}`}</div>
                    </div>
                    <button
                      disabled={completedDegrees.includes(d.name)}
                      onClick={() => {
                        if (d.req && !completedDegrees.includes(d.req)) return setLogMessage(`❌ You must complete ${d.req} first!`);
                        if (spendMoney(d.cost)) {
                          setEnrolledProgram({ id: d.id, name: d.name, totalClasses: 10, completedClasses: 0, energyPerLecture: d.en, timerSeconds: d.sec, deadlineDaysLeft: 21 });
                          setLogMessage(`🎓 Enrolled in ${d.name}!`);
                        }
                      }}
                      className="px-3 py-1 bg-indigo-600 text-white font-bold rounded disabled:opacity-40"
                    >
                      {completedDegrees.includes(d.name) ? "✓ Done" : "Enroll"}
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* 2. BUSINESS BLUEPRINTS (STUDY HERE -> TAKE TO YABA ARCHITECT -> OPEN BUSINESS!) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <h2 className="font-bold text-sm text-emerald-400">📘 Business Blueprints (Take to Architect After Study!)</h2>
              {[
                { id: "BP_Food_Kiosk", name: "🏪 Roadside Food Kiosk Blueprint (2 Staff)", cost: 400000 },
                { id: "BP_Small_Eatery", name: "🍲 Small Eatery Blueprint (6 Staff)", cost: 900000 },
                { id: "BP_Mega_Rest", name: "🏢 Mega Fast-Food Blueprint (15 Staff)", cost: 1800000 },
                { id: "BP_Poster_Kiosk", name: "🖨️ Small Digital Agency Blueprint (2 Staff)", cost: 850000 },
                { id: "BP_Mega_Agency", name: "🎨 Mega Media & Billboard Blueprint (12 Staff)", cost: 1600000 },
              ].map((bp) => (
                <div key={bp.id} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>{bp.name}</span>
                    <span className="text-amber-400">{(bp.cost / 1000).toFixed(0)}k g₦</span>
                  </div>
                  {ownedBlueprints.includes(bp.id) ? (
                    <div className="text-[10px] text-emerald-400 font-bold">
                      {architectApprovedBps.includes(bp.id)
                        ? "✓ Architect Stamped (Ready to Construct in Empire Tab!)"
                        : "👉 Next Step: Travel to Yaba Architectural Firm on Map to Stamp Plan!"}
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        if (spendMoney(bp.cost)) {
                          setOwnedBlueprints((p) => [...p, bp.id]);
                          setLogMessage(`📘 Studied ${bp.name}! Now visit Yaba Architectural Firm on the Map to stamp it for construction.`);
                        }
                      }}
                      className="w-full py-1 bg-emerald-600 text-white font-bold rounded"
                    >
                      Buy &amp; Study Blueprint
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* 3. PROFESSIONAL COURSES WITH DEGREE PREREQUISITES */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <h2 className="font-bold text-sm text-cyan-400">🏅 Professional Courses (Requires Degree First!)</h2>
              {[
                { id: "ICAN", name: "📊 ICAN Chartered Accountant", reqDeg: "University B.Sc", cost: 350000 },
                { id: "CISCO", name: "🌐 CISCO Network Engineer", reqDeg: "Polytechnic ND", cost: 450000 },
                { id: "PMP", name: "📋 PMP Project Management", reqDeg: "Masters (M.Sc)", cost: 520000 },
                { id: "HSE", name: "🦺 Offshore Oil & Gas HSE", reqDeg: "Doctorate (Ph.D)", cost: 680000 },
              ].map((pc) => (
                <div key={pc.id} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white">{pc.name}</div>
                    <div className="text-[10px] text-cyan-400">Req: {pc.reqDeg} • {pc.cost.toLocaleString()} g₦</div>
                  </div>
                  <button
                    disabled={professionalCerts.includes(pc.id)}
                    onClick={() => {
                      if (!completedDegrees.includes(pc.reqDeg)) return setLogMessage(`❌ ${pc.name} requires ${pc.reqDeg} first!`);
                      if (spendMoney(pc.cost)) {
                        setProfessionalCerts((p) => [...p, pc.id]);
                        setLogMessage(`🏅 Certified in ${pc.name}!`);
                      }
                    }}
                    className="px-3 py-1 bg-cyan-500 text-slate-950 font-extrabold rounded disabled:opacity-40"
                  >
                    {professionalCerts.includes(pc.id) ? "✓ Certified" : "Certify"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 5: 🏪 DEDICATED EATERY & KIOSK OPERATIONS (FOOD STOCK + HALF-DAY COLLECTION!)
           ===================================================================== */}
        {activeTab === "empire" && (
          <div className="space-y-4 text-xs">
            <div className="grid md:grid-cols-2 gap-4">
              {/* LAUNCH NEW KIOSK / EATERY / AGENCY */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
                <h2 className="font-bold text-sm text-amber-400">🏗️ Construct Kiosk, Eatery, or Digital Agency</h2>
                <p className="text-slate-400 text-[11px]">
                  Requires Blueprint + Architect Approval (at Yaba Architectural Firm on Map) + Construction Fee.
                </p>
                {[
                  { name: "Roadside Food Kiosk", type: "Food" as const, bp: "BP_Food_Kiosk", cost: 350000, maxStaff: 2, maxCust: 15, rev: 55000 },
                  { name: "Small Neighborhood Eatery", type: "Food" as const, bp: "BP_Small_Eatery", cost: 850000, maxStaff: 6, maxCust: 45, rev: 145000 },
                  { name: "Mega Fast-Food Restaurant", type: "Food" as const, bp: "BP_Mega_Rest", cost: 2200000, maxStaff: 15, maxCust: 120, rev: 420000 },
                  { name: "Small Digital Poster Agency", type: "Agency" as const, bp: "BP_Poster_Kiosk", cost: 650000, maxStaff: 2, maxCust: 20, rev: 95000 },
                  { name: "Mega Media & Billboard Agency", type: "Agency" as const, bp: "BP_Mega_Agency", cost: 1900000, maxStaff: 12, maxCust: 100, rev: 360000 },
                ].map((b, i) => (
                  <div key={i} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white">{b.name} (in {area})</div>
                      <div className="text-[10px] text-slate-400">
                        Host Cap: {b.maxCust} Cust / {b.maxStaff} Staff • {b.cost.toLocaleString()} g₦
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (!ownedBlueprints.includes(b.bp)) return setLogMessage(`❌ Study ${b.bp} in the School tab first!`);
                        if (!architectApprovedBps.includes(b.bp)) return setLogMessage(`📐 Take your ${b.bp} to Yaba Architectural Firm on the Map to get it stamped before building!`);
                        if (spendMoney(b.cost)) {
                          setActiveBusinesses((prev) => [
                            ...prev,
                            {
                              name: b.name,
                              type: b.type,
                              area,
                              maxStaff: b.maxStaff,
                              hiredStaff: 1,
                              maxCustomers: b.maxCust,
                              revenuePerHalfDay: b.rev,
                              foodStockRemaining: b.type === "Food" ? 2 : 99,
                              collectionsUsedThisCycle: 0,
                              halfDayReady: true,
                            },
                          ]);
                          setLogMessage(`🏪 Constructed ${b.name} in ${area}! Manage food stock & half-day collections on the right.`);
                        }
                      }}
                      className="px-3 py-1.5 bg-amber-500 text-slate-950 font-extrabold rounded-lg"
                    >
                      Construct
                    </button>
                  </div>
                ))}
              </div>

              {/* DEDICATED EATERY & AGENCY OPERATIONS PAGE (STOCK FOOD + COLLECT TWICE PER 2-DAY CYCLE!) */}
              <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-2xl p-4 space-y-3">
                <h2 className="font-bold text-sm text-emerald-400">
                  🍲 Dedicated Eatery &amp; Business Operations Center (2-Day Cycle = 2 Half-Day Collections)
                </h2>
                <p className="text-slate-400 text-[11px]">
                  If your Eatery has <strong>0 Food Stock</strong>, there is nothing to collect! Once you collect twice (Day 1 &amp; Day 2), you must restock food supplies.
                </p>
                {activeBusinesses.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                    No active kiosks or eateries yet. Construct one on the left!
                  </div>
                ) : (
                  activeBusinesses.map((biz, idx) => (
                    <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                      <div className="flex justify-between font-bold text-white">
                        <span>🏪 {biz.name} (📍 {biz.area})</span>
                        <span className="text-amber-400">Hosting Cap: {biz.maxCustomers} Customers</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-300">
                        <span>👥 Staff: {biz.hiredStaff}/{biz.maxStaff}</span>
                        <span>🍲 Food/Material Stock: <strong className={biz.foodStockRemaining === 0 ? "text-rose-400" : "text-emerald-400"}>{biz.foodStockRemaining} Batches Left</strong></span>
                        <span>🔄 Collections Used: {biz.collectionsUsedThisCycle}/2</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 pt-1">
                        <button
                          disabled={biz.hiredStaff >= biz.maxStaff}
                          onClick={() => {
                            if (spendMoney(25000)) {
                              const up = [...activeBusinesses];
                              up[idx].hiredStaff += 1;
                              setActiveBusinesses(up);
                            }
                          }}
                          className="py-1.5 bg-indigo-600 text-white font-bold rounded disabled:opacity-40"
                        >
                          +1 Staff (25k)
                        </button>
                        <button
                          onClick={() => {
                            if (spendMoney(40000)) {
                              const up = [...activeBusinesses];
                              up[idx].foodStockRemaining += 2;
                              up[idx].collectionsUsedThisCycle = 0;
                              up[idx].halfDayReady = true;
                              setActiveBusinesses(up);
                              setLogMessage(`🍲 Restocked 2 days of food supplies for ${biz.name}!`);
                            }
                          }}
                          className="py-1.5 bg-amber-500 text-slate-950 font-extrabold rounded"
                        >
                          🍲 Stock Food (40k)
                        </button>
                        <button
                          disabled={biz.foodStockRemaining <= 0 || biz.collectionsUsedThisCycle >= 2 || !!timers[`biz_cd_${idx}`]}
                          onClick={() => {
                            if (area !== biz.area) return setLogMessage(`🚌 Travel to ${biz.area} to collect from this business!`);
                            startCooldown(`biz_cd_${idx}`, 90); // Half-day countdown!
                            const up = [...activeBusinesses];
                            up[idx].foodStockRemaining -= 1;
                            up[idx].collectionsUsedThisCycle += 1;
                            setActiveBusinesses(up);
                            const payout = Math.round(biz.revenuePerHalfDay * (biz.hiredStaff / biz.maxStaff));
                            receiveEarnedMoney(payout, `${biz.name} Batch #${up[idx].collectionsUsedThisCycle}/2`);
                          }}
                          className="py-1.5 bg-emerald-500 text-slate-950 font-extrabold rounded disabled:opacity-40"
                        >
                          {timers[`biz_cd_${idx}`]
                            ? `⏳ ${formatSecs(timers[`biz_cd_${idx}`])}`
                            : biz.foodStockRemaining <= 0
                            ? "Empty Stock!"
                            : `Collect (${biz.collectionsUsedThisCycle}/2)`}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 10 CARS DEALERSHIP */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
              <h2 className="font-bold text-sm text-emerald-400">
                🚗 Berger Automobile Dealership (Requires 75k Driver&apos;s License &amp; Parking: {carsOwned.length}/{parkingSlots})
              </h2>
              <div className="grid sm:grid-cols-5 gap-2">
                {[
                  { name: "Suzuki Korope", cost: 750000 },
                  { name: "Tokunbo Corolla", cost: 1350000 },
                  { name: "Honda Accord", cost: 1950000 },
                  { name: "Toyota Camry", cost: 2400000 },
                  { name: "Lexus RX350", cost: 3200000 },
                  { name: "Mercedes C300", cost: 4500000 },
                  { name: "Land Cruiser Prado", cost: 6200000 },
                  { name: "Range Rover", cost: 7800000 },
                  { name: "Mercedes G-Wagon", cost: 9500000 },
                  { name: "Lamborghini Urus", cost: 14000000 },
                ].map((c, i) => (
                  <button
                    key={i}
                    disabled={carsOwned.includes(c.name)}
                    onClick={() => {
                      if (!hasDriversLicense) return setLogMessage("❌ Get your 75,000 g₦ FRSC Driver's License at Oshodi Driving School on the Map first!");
                      if (carsOwned.length >= parkingSlots) return setLogMessage("❌ 0 free parking slots! Rent/Buy a Flat or Duplex at the Estate Agent on the Map.");
                      if (spendMoney(c.cost)) {
                        setCarsOwned((p) => [...p, c.name]);
                        setActiveCar(c.name);
                        setLogMessage(`🏎️ Bought ${c.name}!`);
                      }
                    }}
                    className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-left disabled:opacity-40"
                  >
                    <div className="font-bold text-white">{c.name}</div>
                    <div className="text-emerald-400 font-bold">{(c.cost / 1000000).toFixed(2)}M g₦</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 6: 🗳️ POLITICS BUILDINGS, 3-DAY MEMBER RULE, MULTI-AGENCY & BILLBOARDS
           ===================================================================== */}
        {activeTab === "politics" && (
          <div className="space-y-4 text-xs">
            {/* PHYSICAL POLITICAL BUILDINGS */}
            <div className="grid sm:grid-cols-3 gap-4">
              {/* BUILDING 1: PARTY SECRETARIAT (3-DAY MEMBERSHIP WAIT BEFORE NOMINATION!) */}
              <div className="bg-slate-900 border-2 border-emerald-600/50 rounded-2xl p-4 space-y-3">
                <div className="text-2xl">🏛️</div>
                <h2 className="font-extrabold text-sm text-emerald-400">1. JPC &amp; JSTD Party Secretariat Building</h2>
                <p className="text-slate-400">
                  You must be an approved Party Member for at least <strong>3 In-Game Days</strong> before you can purchase a Nomination Form!
                </p>
                <div>Status: <strong className="text-amber-400">{partyStatus}</strong></div>
                {partyStatus === "None" && (
                  <button
                    onClick={() => {
                      if (spendMoney(30000)) {
                        setPartyStatus("Member_JPC");
                        setPartyJoinedDay(gameDay);
                        setLogMessage(`🟢 Joined JPC Party on Day ${gameDay}! You will qualify for Nomination Forms on Day ${gameDay + 3}.`);
                      }
                    }}
                    className="w-full py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-xl"
                  >
                    Join JPC Party (30,000 g₦)
                  </button>
                )}
              </div>

              {/* BUILDING 2: ELECTORAL COMMISSION HQ */}
              <div className="bg-slate-900 border-2 border-amber-500/50 rounded-2xl p-4 space-y-3">
                <div className="text-2xl">🗳️</div>
                <h2 className="font-extrabold text-sm text-amber-400">2. State Electoral Commission HQ</h2>
                <div>Days in Party: <strong>{partyStatus === "None" ? 0 : gameDay - partyJoinedDay} / 3 Days Required</strong></div>
                <button
                  disabled={nominationStatus === "Submitted_Verified"}
                  onClick={() => {
                    if (partyStatus === "None") return setLogMessage("❌ Join a Political Party first!");
                    if (gameDay - partyJoinedDay < 3) {
                      return setLogMessage(`❌ Party Constitution Rule: You must be a member for 3 Days before buying a Nomination Form! (${gameDay - partyJoinedDay}/3 Days completed).`);
                    }
                    if (spendMoney(450000)) {
                      setNominationStatus("Submitted_Verified");
                      setLogMessage("📜 Official Nomination Form Purchased & Cleared for the Primary Ballot!");
                    }
                  }}
                  className="w-full py-2 bg-amber-500 text-slate-950 font-extrabold rounded-xl disabled:opacity-40"
                >
                  {nominationStatus === "Submitted_Verified" ? "✓ Cleared Candidate" : "Buy Nomination Form (450,000 g₦)"}
                </button>
                <button
                  disabled={hasVoted}
                  onClick={() => { setHasVoted(true); receiveEarnedMoney(5000, "Voter Civic Allowance"); }}
                  className="w-full py-2 bg-emerald-600 text-white font-bold rounded-xl disabled:opacity-40"
                >
                  {hasVoted ? "✓ Ballot Cast" : "🗳️ Cast Voter Ballot (+5,000 g₦)"}
                </button>
              </div>

              {/* BUILDING 3: MULTI-AGENCY POSTER SHOWCASE & BILLBOARD OWNERSHIP */}
              <div className="bg-slate-900 border-2 border-indigo-500/50 rounded-2xl p-4 space-y-2.5">
                <div className="text-2xl">🎨</div>
                <h2 className="font-extrabold text-sm text-indigo-400">3. Agency Showcase &amp; Billboard Tower</h2>
                <p className="text-slate-400 text-[11px]">
                  Hire multiple Design Agencies for different poster styles (`{hiredAgenciesForPoster.length}/3` hired), or buy a City Billboard Asset for your Agency!
                </p>
                {[
                  { name: "SkyHigh Creative Agency", style: "Modern 3D Flyer", cost: 65000 },
                  { name: "Yaba Pixel Studios", style: "Grassroots Street Poster", cost: 50000 },
                  { name: "Lekki Prestige Media", style: "Executive Billboard Banner", cost: 95000 },
                ].map((ag) => (
                  <button
                    key={ag.name}
                    disabled={hiredAgenciesForPoster.includes(ag.name)}
                    onClick={() => {
                      if (nominationStatus !== "Submitted_Verified") return setLogMessage("❌ Get selected/verified as a Candidate first!");
                      if (spendMoney(ag.cost)) {
                        setHiredAgenciesForPoster((p) => [...p, ag.name]);
                        setCityBillboardText(`🗳️ VOTE ${username.toUpperCase()} (${ag.style} by ${ag.name})!`);
                        setLogMessage(`🎨 Hired ${ag.name} for ${ag.style}!`);
                      }
                    }}
                    className="w-full p-2 bg-slate-950 border border-indigo-700 rounded-lg flex justify-between font-bold disabled:opacity-40"
                  >
                    <span>{hiredAgenciesForPoster.includes(ag.name) ? `✓ Hired ${ag.name}` : `Hire ${ag.name}`}</span>
                    <span className="text-amber-400">{(ag.cost / 1000).toFixed(0)}k</span>
                  </button>
                ))}

                <button
                  disabled={ownsBillboardAsset}
                  onClick={() => {
                    if (!activeBusinesses.some((b) => b.type === "Agency")) {
                      return setLogMessage("❌ Only owners of a Registered Digital/Media Agency can buy a City Billboard Asset!");
                    }
                    if (spendMoney(1500000)) {
                      setOwnsBillboardAsset(true);
                      setLogMessage("📢 Purchased City Billboard Tower! Politicians now pay your agency to post banners.");
                    }
                  }}
                  className="w-full py-2 bg-amber-500 text-slate-950 font-extrabold rounded-xl disabled:opacity-40"
                >
                  {ownsBillboardAsset ? "✓ Own City Billboard Asset" : "Buy City Billboard Asset (1.5M g₦ • Agency Only)"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 7: 🏆 REALISTIC NET WORTH PROFILE, P2P TRANSFER & 15M CASHOUT BANK
           ===================================================================== */}
        {activeTab === "profile" && (
          <div className="grid md:grid-cols-3 gap-4 text-xs">
            {/* 1. REALISTIC CITIZEN NET WORTH & ASSET DOSSIER */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <h2 className="font-bold text-sm text-amber-400">🏆 {username}&apos;s Citizen Dossier &amp; Net Worth</h2>
              <div className="p-3 bg-gradient-to-br from-emerald-950 to-slate-950 border border-emerald-600 rounded-xl space-y-1">
                <div className="text-[10px] text-emerald-300 uppercase">Estimated Total Net Worth</div>
                <div className="text-lg font-extrabold text-white">{totalNetWorth.toLocaleString()} g₦</div>
                <div className="text-xs font-bold text-amber-400">{richLevelTitle}</div>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                <div>🎓 <strong>Degrees:</strong> {completedDegrees.join(" -> ") || "Uneducated"}</div>
                <div>🏅 <strong>Pro Courses:</strong> {professionalCerts.join(", ") || "None"}</div>
                <div>📘 <strong>Blueprints:</strong> {ownedBlueprints.join(", ") || "None"}</div>
                <div>🪪 <strong>Driver&apos;s License:</strong> {hasDriversLicense ? "✓ Verified (75k)" : "None"}</div>
                <div>💍 <strong>Family:</strong> {maritalStatus} {partnerName !== "None" && `with ${partnerName} (${datesCompleted}/10 Dates)`}</div>
                <div>🏰 <strong>Properties Owned ({ownedProperties.length}):</strong> {ownedProperties.map((p) => `${p.name} (${p.area})`).join(", ") || "None"}</div>
                <div>🏪 <strong>Active Enterprises ({activeBusinesses.length}):</strong> {activeBusinesses.map((b) => `${b.name} (${b.area})`).join(", ") || "None"}</div>
                <div>🚗 <strong>Garage ({carsOwned.length}/{parkingSlots}):</strong> {carsOwned.join(", ") || "None"}</div>
              </div>
            </div>

            {/* 2. TRANSFER MONEY TO ANOTHER PLAYER */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-cyan-400 flex items-center gap-1.5">
                <Send className="w-4 h-4" /> Transfer Money to Another Player
              </h2>
              <p className="text-slate-400 text-[11px]">
                Send `g₦` directly to another citizen&apos;s username (for P2P trades, family support, or hiring).
              </p>
              <input
                type="text"
                placeholder="Recipient @username (e.g. @chinedu)"
                value={transferRecipient}
                onChange={(e) => setTransferRecipient(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
              />
              <input
                type="number"
                placeholder="Amount in g₦ (e.g. 50000)"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
              />
              <button
                onClick={() => {
                  const amt = Number(transferAmount);
                  if (!transferRecipient.trim() || !amt || amt <= 0) return setLogMessage("⚠️ Enter valid recipient and amount!");
                  if (spendMoney(amt)) {
                    setLogMessage(`💸 Transferred ${amt.toLocaleString()} g₦ to ${transferRecipient}!`);
                    setTransferAmount("");
                  }
                }}
                className="w-full py-2.5 bg-cyan-500 text-slate-950 font-extrabold rounded-xl"
              >
                💸 Send Instant Player Transfer
              </button>
            </div>

            {/* 3. CENTRAL BANK (FROM ₦500 BUY-IN & 15,000,000 g₦ = ₦5,000 CASHOUT!) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <h2 className="font-bold text-sm text-emerald-400">🏦 Central Bank (300M Cap &amp; 15M Cashout)</h2>
              <div className="p-2.5 bg-slate-950 border border-emerald-800/60 rounded-xl">
                <div className="text-[10px] text-slate-400">Available Genesis Reserve:</div>
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
                  if (earnedBalance < 15000000) {
                    return setLogMessage(`🔒 Minimum withdrawal is 15,000,000 g₦ (= ₦5,000 real cash) from your Earned Wallet! Current Earned Balance: ${earnedBalance.toLocaleString()} g₦.`);
                  }
                  const nairaPayout = Math.floor((earnedBalance / 15000000) * 5000);
                  setCentralBankReserve((r) => r + earnedBalance);
                  setEarnedBalance(0);
                  setLogMessage(`🏦 CASHOUT APPROVED! ₦${nairaPayout.toLocaleString()} sent to your Bank Account!`);
                }}
                className="w-full py-2.5 bg-emerald-600 text-white font-extrabold rounded-xl"
              >
                💸 Withdraw Earned Cash (15M g₦ = ₦5,000)
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
              <h3 className="font-bold text-rose-400 text-sm">📺 LagosFlix Smart TV</h3>
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
            { id: "map", label: "Town Map", icon: <Map className="w-4 h-4" /> },
            { id: "home", label: "My Home", icon: <Home className="w-4 h-4" /> },
            { id: "jobs", label: "Jobs/Work", icon: <Briefcase className="w-4 h-4" /> },
            { id: "school", label: "School/BP", icon: <GraduationCap className="w-4 h-4" /> },
            { id: "empire", label: "Eatery/Cars", icon: <Building2 className="w-4 h-4" /> },
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