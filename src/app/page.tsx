"use client";

import React, { useState, useEffect } from "react";
import { 
  Heart, Zap, Utensils, Sparkles, Home, Map,
  Lock, Clock, Award, Wrench, Fuel, Droplets, ZoomOut, ZoomIn,
  Smartphone, ClipboardList, Sun, Sunset, Moon, AlertTriangle
} from "lucide-react";

type AreaName = "Oshodi" | "Berger" | "Yaba" | "Surulere" | "Lekki";

const AREA_COORDS: Record<AreaName, number> = {
  Berger: 1,
  Oshodi: 2,
  Yaba: 3,
  Surulere: 4,
  Lekki: 6,
};

// AREA-SPECIFIC HOSPITAL TREATMENT & EMERGENCY LOAN DEBT TIERS (LEKKI IS MUCH HIGHER!)
const HOSPITAL_AREA_RATES: Record<AreaName, { name: string; cashCost: number; emergencyLoanDebt: number }> = {
  Oshodi: { name: "Oshodi General Hospital", cashCost: 25000, emergencyLoanDebt: 60000 },
  Berger: { name: "Berger Highway Medical Clinic", cashCost: 40000, emergencyLoanDebt: 95000 },
  Yaba: { name: "Yaba Mainland Hospital", cashCost: 55000, emergencyLoanDebt: 130000 },
  Surulere: { name: "Surulere General Hospital", cashCost: 75000, emergencyLoanDebt: 180000 },
  Lekki: { name: "Lekki Lagoon Executive Hospital", cashCost: 160000, emergencyLoanDebt: 380000 },
};

interface MapBuilding {
  id: string;
  roofColor: string;
  icon: string;
  name: string;
  sub: string;
  distKm: number;
}

export default function LagosEmpirePerfectMapEngine() {
  // 1. ONBOARDING
  const [isCreated, setIsCreated] = useState(false);
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");

  // 2. 15-MINUTE RUNNING CLOCK, WEATHER & TIME-OF-DAY THEME
  const [gameHour, setGameHour] = useState(8);
  const [gameMinute, setGameMinute] = useState(0);
  const [gameDay, setGameDay] = useState(1);
  const [gameWeek, setGameWeek] = useState(1);
  const [weeksUntilRentDue, setWeeksUntilRentDue] = useState(8);
  const [weather, setWeather] = useState("Sunny 32°C");

  const timeOfDayPhase: "Daylight" | "Afternoon_Sunset" | "Night" =
    gameHour >= 6 && gameHour < 15
      ? "Daylight"
      : gameHour >= 15 && gameHour < 19
      ? "Afternoon_Sunset"
      : "Night";

  const isRushHourTraffic = (gameHour >= 7 && gameHour <= 9) || (gameHour >= 16 && gameHour <= 19);

  // 3. CENTRAL BANK 300M RESERVE, DUAL WALLETS & DETAILED DEBT LEDGER!
  const [centralBankReserve, setCentralBankReserve] = useState(300000000);
  const [starterBalance, setStarterBalance] = useState(50000); // g₦ (Starter/Deposit)
  const [earnedBalance, setEarnedBalance] = useState(0);       // c₦ (Earned Cashout Naira)
  const [hospitalLoanDebt, setHospitalLoanDebt] = useState(0); // Clearly visible debt!
  const [debtHistoryLog, setDebtHistoryLog] = useState<string[]>([]);
  const [hospitalShieldHoursLeft, setHospitalShieldHoursLeft] = useState(0);
  const [convertCnInput, setConvertCnInput] = useState("50000");

  // 4. STRICT IN-BOX MAP POSITION & STRAIGHT-LINE MOVEMENT TRACKER
  const [area, setArea] = useState<AreaName>("Oshodi");
  const [currentBuildingId, setCurrentBuildingId] = useState<string>("My_Home");
  const [exactPosition, setExactPosition] = useState<string>("🏠 Inside My Home (Oshodi)");
  const [isMapZoomedOut, setIsMapZoomedOut] = useState(false);

  // Which building box is currently clicked/expanded on the grid:
  const [selectedBoxId, setSelectedBoxId] = useState<string>("My_Home");

  // Live In-Box Straight-Line Transit State (Shows inside the destination box!)
  const [activeTransit, setActiveTransit] = useState<{
    targetId: string;
    targetName: string;
    targetIcon: string;
    fromName: string;
    modeIcon: string;
    modeLabel: string;
    totalSecs: number;
    remainingSecs: number;
    distKm: number;
  } | null>(null);

  const [phoneOwned, setPhoneOwned] = useState<"None" | "Torchlight_Phone" | "Smartphone">("None");
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [bargainDiscountPct, setBargainDiscountPct] = useState(0);

  // 5. SURVIVAL STATS
  const [health, setHealth] = useState(90);
  const [energy, setEnergy] = useState(60);
  const [hunger, setHunger] = useState(80);
  const [weight, setWeight] = useState(68.0);
  const [steeze, setSteeze] = useState(5);
  const [citizenPoints, setCitizenPoints] = useState(15);
  const [activeGuideTip, setActiveGuideTip] = useState<string>(
    "💡 Click any building box below! Your transport options, live moving line, and building interior all open directly inside that box."
  );

  // 6. DOMESTIC MAID AGENCY & HOUSE MAID
  const [hasHiredMaid, setHasHiredMaid] = useState(false);
  const [maidWeeklyFoodLeft, setMaidWeeklyFoodLeft] = useState(0);
  const [maidTimerSecs, setMaidTimerSecs] = useState(300);
  const [agencyMaidVacanciesCount, setAgencyMaidVacanciesCount] = useState(2);

  // 7. HOME, KG GAS, RAW FOOD & LANDLORD STATE
  const [shelterType, setShelterType] = useState("Basic Single Room (120k/8Wks)");
  const [shelterArea, setShelterArea] = useState<AreaName>("Oshodi");
  const [ownershipMode, setOwnershipMode] = useState<"Rented" | "Bought_Owned">("Rented");
  const [rentPer8Weeks, setRentPer8Weeks] = useState(120000);
  const [parkingSlots, setParkingSlots] = useState(0);
  const [wallColor, setWallColor] = useState("Unplastered");
  const [bedTier, setBedTier] = useState("Bare_Floor");
  const [chairTier, setChairTier] = useState("None");
  const [tvTier, setTvTier] = useState("None");
  const [hasLagosFlix, setHasLagosFlix] = useState(false);
  const [showTvModal, setShowTvModal] = useState(false);
  const [hasCookingStove, setHasCookingStove] = useState(false);
  const [gasKg, setGasKg] = useState<number>(0.0);
  const [rawFoodServings, setRawFoodServings] = useState(0);

  const [ownedProperties, setOwnedProperties] = useState<{
    name: string;
    area: AreaName;
    roomsAvailable: number;
    parking: number;
    paidAgentForm: boolean;
    isListedWithAgent: boolean;
    listedPricePerRoom: number;
    weeksLeftToCollect: number;
  }[]>([]);
  const [customRoomRentInput, setCustomRoomRentInput] = useState("250000");

  // 8. DRIVING LICENSE & CARS
  const [hasDriversLicense, setHasDriversLicense] = useState(false);
  const [drivingLessonsDone, setDrivingLessonsDone] = useState(0);
  const [carsOwned, setCarsOwned] = useState<string[]>([]);
  const [activeCar, setActiveCar] = useState<string>("None");
  const [carPetrol, setCarPetrol] = useState(100);
  const [carRadiatorWater, setCarRadiatorWater] = useState(100);
  const [carEngineHealth, setCarEngineHealth] = useState(100);

  // 9. SEPARATED SCHOOLS & MAJORS
  const [completedDegrees, setCompletedDegrees] = useState<string[]>([]);
  const [professionalCerts, setProfessionalCerts] = useState<string[]>([]);
  const [specialistCerts, setSpecialistCerts] = useState<string[]>([]);
  const [ownedBlueprints, setOwnedBlueprints] = useState<string[]>([]);
  const [architectApprovedBps, setArchitectApprovedBps] = useState<string[]>([]);
  const [enrolledProgram, setEnrolledProgram] = useState<{
    id: string;
    name: string;
    major: string;
    totalClasses: number;
    completedClasses: number;
    energyPerLecture: number;
    timerSeconds: number;
  } | null>(null);

  // 10. LIVE CONSTRUCTION SITES (STRICT OWNER VS WORKER SEPARATION!)
  const [activeConstructionSites, setActiveConstructionSites] = useState<{
    id: string;
    projectName: string;
    ownerName: string;
    area: AreaName;
    type: "Food" | "Agency" | "Arch_Firm" | "House";
    timeRemainingSecs: number;
    minBricklayers: number;
    maxBricklayers: number;
    currentBricklayers: number;
    playerWorkedHere: boolean;
    payPerShiftCn: number;
  }[]>([
    {
      id: "site_lekki_1",
      projectName: "Chief Balogun's 5-Bed Lekki Duplex",
      ownerName: "Chief Balogun", // Owned by NPC Chief Balogun — Player is a WORKER here!
      area: "Lekki",
      type: "House",
      timeRemainingSecs: 7200,
      minBricklayers: 2,
      maxBricklayers: 6,
      currentBricklayers: 1,
      playerWorkedHere: false,
      payPerShiftCn: 12000,
    },
    {
      id: "site_oshodi_1",
      projectName: " Alhaji Musa's Oshodi Eatery Plaza",
      ownerName: "Alhaji Musa", // Owned by NPC Alhaji Musa — Player is a WORKER here!
      area: "Oshodi",
      type: "Food",
      timeRemainingSecs: 5400,
      minBricklayers: 2,
      maxBricklayers: 5,
      currentBricklayers: 0,
      playerWorkedHere: false,
      payPerShiftCn: 9500,
    },
  ]);

  const [timers, setTimers] = useState<Record<string, number>>({});
  const startCooldown = (key: string, seconds: number) => {
    setTimers((prev) => ({ ...prev, [key]: seconds }));
  };

  const [activeTab, setActiveTab] = useState<"map" | "profile">("map");
  const [logMessage, setLogMessage] = useState(
    "Welcome! Click any building box on the map—your transport options, live straight-line movement, and building interior all open directly inside that box!"
  );

  const maxEnergyCap = bedTier === "Bare_Floor" ? 60 : bedTier === "Foam_Mattress" ? 85 : 100;

  // RECEIVE EARNED c₦ (AUTO-GARNISHES 40% TOWARD HOSPITAL/TRANSPORT DEBT IF PLAYER OWES DEBT!)
  const receiveEarnedMoney = (amount: number, sourceLabel: string) => {
    if (hospitalLoanDebt > 0) {
      const deduction = Math.min(hospitalLoanDebt, Math.floor(amount * 0.4));
      const netPay = amount - deduction;
      setHospitalLoanDebt((d) => d - deduction);
      setEarnedBalance((e) => e + netPay);
      setLogMessage(
        `🏥 DEBT GARNISHMENT (${sourceLabel}): Earned +${amount.toLocaleString()} c₦, auto-paid -${deduction.toLocaleString()} c₦ toward your Debt! Net added: +${netPay.toLocaleString()} c₦ (Remaining Debt: ${(hospitalLoanDebt - deduction).toLocaleString()} c₦).`
      );
    } else {
      setEarnedBalance((e) => e + amount);
      setLogMessage(`💰 ${sourceLabel}: +${amount.toLocaleString()} c₦ added to your Earned Cashout Wallet!`);
    }
  };

  const spendMoney = (rawCost: number, applyBargain = false): boolean => {
    const cost = applyBargain && bargainDiscountPct > 0 ? Math.round(rawCost * (1 - bargainDiscountPct / 100)) : rawCost;
    const total = starterBalance + earnedBalance;
    if (total < cost) {
      setLogMessage(`❌ Insufficient funds! You need ${cost.toLocaleString()} g₦ / c₦.`);
      return false;
    }
    if (starterBalance >= cost) {
      setStarterBalance((prev) => prev - cost);
    } else {
      const rem = cost - starterBalance;
      setStarterBalance(0);
      setEarnedBalance((prev) => prev - rem);
    }
    if (applyBargain && bargainDiscountPct > 0) setBargainDiscountPct(0);
    return true;
  };

  // MASTER 1-SECOND ENGINE: HANDLES IN-BOX STRAIGHT-LINE MOVEMENT, CLOCK & AREA-TIERED HOSPITAL ADMISSION!
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Tick general timers
      setTimers((prev) => {
        const next: Record<string, number> = {};
        for (const k in prev) {
          if (prev[k] > 1) next[k] = prev[k] - 1;
        }
        return next;
      });

      // 2. Tick Live In-Box Straight-Line Movement!
      setActiveTransit((prev) => {
        if (!prev) return null;
        if (prev.remainingSecs <= 1) {
          // ARRIVED AT THE DESTINATION BOX!
          setCurrentBuildingId(prev.targetId);
          setExactPosition(`${prev.targetIcon} Inside ${prev.targetName} (${area})`);
          setLogMessage(`✅ Arrived inside ${prev.targetName} (${prev.distKm} km)!`);
          return null;
        }
        return { ...prev, remainingSecs: prev.remainingSecs - 1 };
      });

      // 3. Tick Active Construction Sites
      setActiveConstructionSites((sites) =>
        sites.map((s) => ({
          ...s,
          timeRemainingSecs: Math.max(0, s.timeRemainingSecs - 1),
        }))
      );

      // 4. Tick 5-Minute House Maid Automation
      if (hasHiredMaid) {
        setMaidTimerSecs((prev) => {
          if (prev <= 1) {
            if (maidWeeklyFoodLeft > 0 && gasKg >= 0.4) {
              setMaidWeeklyFoodLeft((f) => f - 1);
              setGasKg((g) => Number(Math.max(0, g - 0.4).toFixed(1)));
              setHealth((h) => Math.max(h, 92));
              setEnergy((e) => Math.max(e, maxEnergyCap));
              setHunger((b) => Math.max(b, 92));
              setLogMessage("👩🏾‍🍳 MAID AUTO-DELIVERY: Cooked with 0.4kg Gas and restored your Health, Energy & Belly!");
            }
            return 300;
          }
          return prev - 1;
        });
      }

      // 5. Advance 15-Minute Clock & Check Area-Tiered Hospital Collapse!
      setGameMinute((m) => {
        if (m < 45) return m + 15;
        setGameHour((h) => {
          const nextH = h >= 23 ? 0 : h + 1;
          if (nextH >= 20 || nextH <= 5) setWeather("Warm Night");
          else if (nextH === 14 || nextH === 15) setWeather("Heavy Lagos Rain");
          else if (nextH >= 6 && nextH <= 10) setWeather("Harmattan Haze");
          else setWeather("Sunny 32°C");

          setHospitalShieldHoursLeft((sh) => Math.max(0, sh - 1));

          if (h >= 23) {
            setGameDay((d) => {
              const nd = d + 1;
              if (nd % 7 === 0) {
                setGameWeek((w) => w + 1);
                setWeeksUntilRentDue((r) => (ownershipMode === "Bought_Owned" ? 999 : Math.max(0, r - 1)));
              }
              return nd;
            });
          }
          return nextH;
        });

        // AREA-TIERED HOSPITAL COLLAPSE (LEKKI HOSPITAL CHARGES 380,000 c₦ DEBT VS OSHODI 60,000 c₦!)
        setHunger((prevHunger) => {
          const decayRate = hospitalShieldHoursLeft > 0 ? 1 : 3;
          const nextHunger = Math.max(0, prevHunger - decayRate);

          if (nextHunger === 0 && hospitalShieldHoursLeft === 0) {
            setHealth((prevHp) => {
              const nextHp = Math.max(0, prevHp - 8);
              if (nextHp <= 15) {
                const areaHosp = HOSPITAL_AREA_RATES[area];
                setHunger(100);
                setEnergy(maxEnergyCap);
                setHospitalShieldHoursLeft(48);
                setCurrentBuildingId("Hospital");
                setSelectedBoxId("Hospital");
                setExactPosition(`🏥 Admitted Inside ${areaHosp.name} (${area})`);
                setHospitalLoanDebt((debt) => debt + areaHosp.emergencyLoanDebt);
                setDebtHistoryLog((logs) => [
                  `Emergency Admission at ${areaHosp.name} (${area}): +${areaHosp.emergencyLoanDebt.toLocaleString()} c₦ Debt`,
                  ...logs,
                ]);
                setLogMessage(
                  `🚑 COLLAPSED IN ${area.toUpperCase()}! Rushed to ${areaHosp.name}! All stats restored to 100% + 48h Shield, and +${areaHosp.emergencyLoanDebt.toLocaleString()} c₦ added to your Debt Ledger!`
                );
                return 100;
              }
              return nextHp;
            });
          }
          return nextHunger;
        });

        setEnergy((prevE) => {
          const decayE = hospitalShieldHoursLeft > 0 ? 1 : 2;
          return Math.max(10, prevE - decayE);
        });

        return 0;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [hasHiredMaid, maidWeeklyFoodLeft, gasKg, hospitalShieldHoursLeft, area, maxEnergyCap, ownershipMode]);

  const formatSecs = (s?: number) => {
    if (!s || s <= 0) return "0s";
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}h ${m}m ${sec}s`;
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
  };

  // ALL 5 AREAS NOW HAVE THEIR OWN HOSPITAL & DISTINCT BUILDINGS!
  const subMapBuildings: Record<AreaName, MapBuilding[]> = {
    Oshodi: [
      { id: "Vacancy_Stand", roofColor: "bg-emerald-600", icon: "📋", name: "Oshodi Vacancy Notice Stand", sub: "Directions to All Live Jobs", distKm: 0.2 },
      { id: "Public_Eatery", roofColor: "bg-amber-600", icon: "🍛", name: "Oshodi Mama Put & Eatery", sub: "6 Standard Hot Meals", distKm: 0.7 },
      { id: "Gas_Kitchen_Shop", roofColor: "bg-teal-600", icon: "🔥", name: "Oshodi Market & Gas Depot", sub: "Buy Gas in kg & 8 Food Bundles", distKm: 1.2 },
      { id: "Hospital", roofColor: "bg-rose-600", icon: "🏥", name: "Oshodi General Hospital", sub: "Cash: 25k | Loan Debt: 60k", distKm: 1.5 },
      { id: "Driving_School", roofColor: "bg-yellow-600", icon: "🪪", name: "FRSC & Driving Academy", sub: "Separate Driving School (75k)", distKm: 2.4 },
      { id: "Mechanic_Shop", roofColor: "bg-purple-600", icon: "🔧", name: "Oshodi Mechanic Village", sub: "Fix Engine & Radiator Water", distKm: 3.8 },
      { id: "Agent_Office", roofColor: "bg-cyan-600", icon: "🏘️", name: "Oshodi Estate Agent", sub: "Rent, Buy or Landlord Form", distKm: 2.1 },
    ],
    Berger: [
      { id: "Vacancy_Stand", roofColor: "bg-emerald-600", icon: "📋", name: "Berger Vacancy Notice Stand", sub: "Directions to All Live Jobs", distKm: 0.2 },
      { id: "Auto_Dealership", roofColor: "bg-emerald-700", icon: "🚗", name: "Berger Motor Fair (10 Cars)", sub: "Bargain & Buy Vehicles", distKm: 2.6 },
      { id: "Filling_Station", roofColor: "bg-yellow-600", icon: "⛽", name: "NNPC Mega Filling Station", sub: "Petrol & Radiator Water", distKm: 1.1 },
      { id: "Builder_Yard", roofColor: "bg-orange-600", icon: "🏗️", name: "Julius Berger Construction HQ", sub: "Step 3: Spawn Construction Site", distKm: 3.4 },
      { id: "Hospital", roofColor: "bg-rose-600", icon: "🏥", name: "Berger Highway Medical Clinic", sub: "Cash: 40k | Loan Debt: 95k", distKm: 1.6 },
      { id: "Public_Eatery", roofColor: "bg-amber-600", icon: "🍛", name: "Berger Highway Bukka", sub: "6 Standard Hot Meals", distKm: 0.8 },
      { id: "Agent_Office", roofColor: "bg-cyan-600", icon: "🏘️", name: "Berger Estate Agent", sub: "Houses & Landlord Form", distKm: 2.0 },
    ],
    Yaba: [
      { id: "Vacancy_Stand", roofColor: "bg-emerald-600", icon: "📋", name: "Yaba Vacancy Notice Stand", sub: "Directions to All Live Jobs", distKm: 0.2 },
      { id: "Yaba_Polytechnic", roofColor: "bg-indigo-600", icon: "🏫", name: "Yaba Polytechnic Campus", sub: "ND, HND & Poly Lecturer Job", distKm: 1.6 },
      { id: "Unilag_University", roofColor: "bg-blue-700", icon: "🎓", name: "University of Lagos Senate", sub: "B.Sc, M.Sc, Ph.D & Prof Job", distKm: 2.9 },
      { id: "Architect_Firm", roofColor: "bg-cyan-600", icon: "📐", name: "Yaba Architectural Studio", sub: "Step 2: Paid Plan Stamping", distKm: 2.2 },
      { id: "Electronics_Shop", roofColor: "bg-purple-600", icon: "📱", name: "Yaba Tech, Phones & TV Plaza", sub: "Buy Smartphones & 4 TV Tiers", distKm: 1.4 },
      { id: "Hospital", roofColor: "bg-rose-600", icon: "🏥", name: "Yaba Mainland Hospital", sub: "Cash: 55k | Loan Debt: 130k", distKm: 1.8 },
      { id: "Public_Eatery", roofColor: "bg-amber-600", icon: "🍛", name: "Yaba Campus Jollof Spot", sub: "6 Standard Hot Meals", distKm: 0.6 },
    ],
    Surulere: [
      { id: "Vacancy_Stand", roofColor: "bg-emerald-600", icon: "📋", name: "Surulere Vacancy Notice Stand", sub: "Directions to All Live Jobs", distKm: 0.2 },
      { id: "Business_Blueprint_School", roofColor: "bg-emerald-700", icon: "💼", name: "Lagos Business & Blueprint School", sub: "Separate Blueprint & ICAN/PMP School", distKm: 2.3 },
      { id: "Domestic_Maid_Agency", roofColor: "bg-rose-600", icon: "👩🏾‍🍳", name: "Domestic Maid Staffing Agency", sub: "Hire Maid (485k) or Work as Maid", distKm: 1.7 },
      { id: "Hospital", roofColor: "bg-red-600", icon: "🏥", name: "Surulere General Hospital", sub: "Cash: 75k | Loan Debt: 180k", distKm: 1.9 },
      { id: "Public_Eatery", roofColor: "bg-amber-600", icon: "🍛", name: "Surulere Kilimanjaro Eatery", sub: "6 Standard Hot Meals", distKm: 0.9 },
    ],
    Lekki: [
      { id: "Vacancy_Stand", roofColor: "bg-emerald-600", icon: "📋", name: "Lekki Vacancy Notice Stand", sub: "Directions to All Live Jobs", distKm: 0.2 },
      { id: "Hospital", roofColor: "bg-rose-600", icon: "🏥", name: "Lekki Lagoon Executive Hospital", sub: "Cash: 160k | Loan Debt: 380k!", distKm: 2.2 },
      { id: "Foreign_Embassy", roofColor: "bg-indigo-700", icon: "✈️", name: "Foreign Embassy (Harvard/Oxford)", sub: "Visa & Study Abroad Universities", distKm: 3.5 },
      { id: "Agent_Office", roofColor: "bg-teal-600", icon: "🏰", name: "Lekki Luxury Estate Agent", sub: "Duplexes & Landlord Form", distKm: 1.9 },
      { id: "Public_Eatery", roofColor: "bg-amber-600", icon: "🍛", name: "Lekki Continental Bistro", sub: "6 Standard Hot Meals", distKm: 1.1 },
    ],
  };

  const getStreetTransitTicket = (target: MapBuilding, isGoingHome = false) => {
    const returnMultiplier = isGoingHome ? 1.25 : 1.0;
    const trafficTimeMult = isRushHourTraffic ? 1.5 : 1.0;
    const km = target.distKm;

    return {
      km,
      trekSecs: Math.max(6, Math.round(km * 15)),
      trekEnergy: Math.min(45, Math.max(4, Math.round(km * 6))),
      busCost: Math.round(km * 450 * returnMultiplier),
      busSecs: Math.max(5, Math.round(km * 9 * trafficTimeMult)),
      cabCost: Math.round(km * 1100 * returnMultiplier),
      cabSecs: Math.max(4, Math.round(km * 5 * trafficTimeMult)),
    };
  };

  // START IN-BOX STRAIGHT-LINE TRANSIT (ANIMATES DIRECTLY INSIDE THE DESTINATION BOX!)
  const handleStartInBoxTransit = (target: MapBuilding, mode: "trek" | "bus" | "cab" | "car", isGoingHome = false) => {
    if (activeTransit) return setLogMessage("⏳ You are already moving! Wait until you arrive.");
    const ticket = getStreetTransitTicket(target, isGoingHome);

    if (mode === "trek") {
      if (energy < ticket.trekEnergy && ticket.km > 0.3) {
        return setLogMessage("⚠️ Too exhausted to trek! Take a Korope/Bus or Cab.");
      }
      setEnergy((e) => Math.max(5, e - ticket.trekEnergy));
      if (hospitalShieldHoursLeft > 0 && ticket.km > 1.0) {
        setHospitalShieldHoursLeft((sh) => Math.max(0, sh - 4));
      }
    } else if (mode === "bus") {
      if (!spendMoney(ticket.busCost)) return;
    } else if (mode === "cab") {
      if (!spendMoney(ticket.cabCost)) return;
    } else if (mode === "car") {
      if (!hasDriversLicense) return setLogMessage("🚓 FRSC BLOCKED: Get your 75k Driver's License at Oshodi Driving Academy first!");
      if (carPetrol < 5 || carRadiatorWater < 5) return setLogMessage("⚠️ Refill Petrol & Radiator Water first!");
      setCarPetrol((p) => Math.max(0, p - 4));
      setCarRadiatorWater((w) => Math.max(0, w - 3));
    }

    const waitSecs = mode === "trek" ? ticket.trekSecs : mode === "bus" ? ticket.busSecs : ticket.cabSecs;
    const modeIcon = mode === "trek" ? "🏃🏾‍♂️" : mode === "bus" ? "🚐" : mode === "cab" ? "🚕" : "🚗";
    const modeLabel = mode === "trek" ? "Trekking" : mode === "bus" ? "Korope / Bus" : mode === "cab" ? "Drop Cab" : `Driving ${activeCar}`;

    setActiveTransit({
      targetId: target.id,
      targetName: target.name,
      targetIcon: target.icon,
      fromName: exactPosition.replace("🏠 Inside ", "").replace("🏢 Inside ", ""),
      modeIcon,
      modeLabel,
      totalSecs: waitSecs,
      remainingSecs: waitSecs,
      distKm: ticket.km,
    });
  };

  if (!isCreated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border-2 border-emerald-500 rounded-2xl p-6 shadow-2xl">
          <div className="inline-block px-3 py-1 bg-emerald-500 text-slate-950 text-xs font-extrabold rounded-full mb-3">
            LAGOS EMPIRE — IN-BOX TRANSIT &amp; VISUAL LINE EDITION
          </div>
          <h1 className="text-2xl font-extrabold mb-2">Begin Your Lagos Life</h1>
          <p className="text-slate-400 text-sm mb-6">
            Click any building box to see transport fares, watch the live straight-line movement tracker inside that box, and unlock the interior upon arrival!
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

  const themeWrapperClass =
    timeOfDayPhase === "Daylight"
      ? "bg-sky-100 text-slate-900"
      : timeOfDayPhase === "Afternoon_Sunset"
      ? "bg-amber-100 text-slate-900"
      : "bg-slate-950 text-slate-100";

  // Helper to render the In-Box Transport Options + Live Straight-Line Movement inside ANY clicked box!
  const renderInBoxTransportOrInterior = (box: MapBuilding, interiorJsx: React.ReactNode, isHomeBox = false) => {
    const isAlreadyHere = currentBuildingId === box.id;
    const isMovingHere = activeTransit?.targetId === box.id;
    const t = getStreetTransitTicket(box, isHomeBox);

    if (isAlreadyHere) {
      return (
        <div className="mt-3 pt-3 border-t border-slate-700 text-left space-y-3">
          <div className="inline-block px-2.5 py-0.5 bg-emerald-500/20 border border-emerald-400 text-emerald-300 rounded-full text-[10px] font-extrabold">
            ✓ ARRIVED &amp; INSIDE: {box.name}
          </div>
          {interiorJsx}
        </div>
      );
    }

    if (isMovingHere && activeTransit) {
      const progressPct = Math.min(
        100,
        Math.round(((activeTransit.totalSecs - activeTransit.remainingSecs) / activeTransit.totalSecs) * 100)
      );
      return (
        <div className="mt-3 pt-3 border-t border-amber-500/50 bg-slate-900/90 p-3 rounded-xl space-y-2.5 text-left">
          <div className="flex justify-between items-center text-[11px] font-extrabold text-amber-300">
            <span>{activeTransit.modeIcon} Moving via {activeTransit.modeLabel} ({activeTransit.distKm} km)</span>
            <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-extrabold">
              Arriving in {activeTransit.remainingSecs}s ({progressPct}%)
            </span>
          </div>

          {/* STRAIGHT-LINE VISUAL MOVEMENT TRACK FROM ORIGIN TO THIS BUILDING BOX! */}
          <div className="relative pt-4 pb-2 px-2">
            <div className="flex justify-between text-[9px] text-slate-400 font-bold mb-1">
              <span className="truncate max-w-[45%]">📍 From: {activeTransit.fromName}</span>
              <span className="truncate max-w-[45%] text-emerald-400">🎯 To: {activeTransit.targetName}</span>
            </div>
            {/* Straight Line Track */}
            <div className="w-full h-2.5 bg-slate-800 rounded-full relative flex items-center border border-slate-600">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
              {/* Moving Traveller Icon Along the Straight Line */}
              <div
                className="absolute -top-3 text-lg transition-all duration-700"
                style={{ left: `calc(${Math.min(92, progressPct)}% - 8px)` }}
              >
                {activeTransit.modeIcon}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // NOT HERE YET: SHOW TRANSPORT OPTIONS DIRECTLY INSIDE THIS BUILDING'S BOX!
    return (
      <div className="mt-3 pt-3 border-t border-slate-700 bg-slate-900/95 p-3 rounded-xl space-y-2 text-left">
        <div className="text-[11px] font-extrabold text-amber-300">
          🚌 Travel to {box.name} ({t.km} km away) {isHomeBox && "• +25% Return Fare"}:
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleStartInBoxTransit(box, "trek", isHomeBox);
            }}
            className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-left"
          >
            <div className="font-extrabold text-white text-[11px]">🚶🏾‍♂️ Trek ({t.km} km)</div>
            <div className="text-[9px] text-emerald-400">₦0 • {t.trekSecs}s • -{t.trekEnergy}% En</div>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleStartInBoxTransit(box, "bus", isHomeBox);
            }}
            className="p-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500 rounded-lg text-left"
          >
            <div className="font-extrabold text-amber-300 text-[11px]">🚐 Korope / Bus</div>
            <div className="text-[9px] text-white">{t.busCost.toLocaleString()} g₦ • {t.busSecs}s</div>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleStartInBoxTransit(box, "cab", isHomeBox);
            }}
            className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-left"
          >
            <div className="font-extrabold text-white text-[11px]">🚕 Drop Cab</div>
            <div className="text-[9px] text-indigo-200">{t.cabCost.toLocaleString()} g₦ • {t.cabSecs}s</div>
          </button>
          {carsOwned.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStartInBoxTransit(box, "car", isHomeBox);
              }}
              className="p-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-left"
            >
              <div className="font-extrabold text-white text-[11px]">🚗 Drive {activeCar}</div>
              <div className="text-[9px] text-emerald-100">-4% Petrol • {t.cabSecs}s</div>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen pb-28 transition-colors duration-700 ${themeWrapperClass}`}>
      {/* TOP BAR */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 px-4 py-2.5 shadow-lg">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-xl">
              {gender === "male" ? "👨🏾" : "👩🏾"}
            </div>
            <div>
              <div className="font-bold text-sm flex flex-wrap items-center gap-1.5">
                {username}
                <span
                  className={`text-[11px] px-2.5 py-0.5 font-extrabold rounded-full flex items-center gap-1 ${
                    timeOfDayPhase === "Daylight"
                      ? "bg-sky-400 text-slate-950"
                      : timeOfDayPhase === "Afternoon_Sunset"
                      ? "bg-amber-400 text-slate-950"
                      : "bg-indigo-950 text-indigo-200 border border-indigo-500"
                  }`}
                >
                  {timeOfDayPhase === "Daylight" ? <Sun className="w-3 h-3" /> : timeOfDayPhase === "Afternoon_Sunset" ? <Sunset className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
                  Wk {gameWeek} • Day {gameDay} • {String(gameHour).padStart(2, "0")}:{String(gameMinute).padStart(2, "0")}
                </span>
                {hospitalShieldHoursLeft > 0 && (
                  <span className="text-[11px] px-2 py-0.5 bg-emerald-600 text-white font-extrabold rounded-full">
                    🛡️ Hospital Shield: {hospitalShieldHoursLeft}h
                  </span>
                )}
                {/* CLEARLY VISIBLE DEBT INDICATOR */}
                <span
                  className={`text-[11px] px-2.5 py-0.5 font-extrabold rounded-full ${
                    hospitalLoanDebt > 0 ? "bg-red-600 text-white animate-pulse" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  🚨 Debt: {hospitalLoanDebt.toLocaleString()} c₦
                </span>
              </div>
              <div className="text-xs text-slate-300 flex flex-wrap items-center gap-2 mt-0.5">
                <span className="text-amber-400 font-extrabold">📍 Current Place: {exactPosition}</span>
                • <span>🔥 Gas: <strong>{gasKg} kg</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
              <div className="text-[10px] text-slate-400 uppercase">Working Capital (g₦)</div>
              <div className="font-extrabold text-sm text-amber-400">{starterBalance.toLocaleString()} g₦</div>
            </div>
            <div className="bg-slate-950 border border-emerald-900/60 rounded-xl px-3 py-1.5">
              <div className="text-[10px] text-emerald-400 uppercase flex items-center gap-1">
                Earned c₦ (Cashout Coming Soon) <Lock className="w-2.5 h-2.5" />
              </div>
              <div className="font-extrabold text-sm text-emerald-400">{earnedBalance.toLocaleString()} c₦</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-3">
        {/* METERS BAR */}
        <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-3 space-y-2 shadow-md">
          <div className={`grid grid-cols-2 ${carsOwned.length > 0 ? "sm:grid-cols-7" : "sm:grid-cols-4"} gap-2`}>
            <StatBar icon={<Heart className="w-3.5 h-3.5 text-rose-400" />} label="Health" value={`${health}%`} pct={health} color="bg-rose-500" onHelp={() => setActiveGuideTip("❤️ HEALTH: Treated at the Hospital in your current Area (Lekki Hospital costs 160k / 380k Debt vs Oshodi 25k / 60k Debt!).")} />
            <StatBar icon={<Zap className="w-3.5 h-3.5 text-amber-400" />} label={`Energy (Cap ${maxEnergyCap}%)`} value={`${energy}%`} pct={energy} color="bg-amber-500" onHelp={() => setActiveGuideTip("⚡ ENERGY: Click 'My Home' box on the Map, travel home, and sleep inside your home box!")} />
            <StatBar icon={<Utensils className="w-3.5 h-3.5 text-orange-400" />} label="Belly/Diet" value={`${hunger}%`} pct={hunger} color="bg-orange-500" onHelp={() => setActiveGuideTip("🍛 BELLY/DIET: Click the Public Eatery box to travel & eat, or cook with 0.4kg Gas inside your Home box.")} />
            <StatBar icon={<Sparkles className="w-3.5 h-3.5 text-cyan-400" />} label="Steeze / Pts" value={`${steeze} • 🌟${citizenPoints}`} pct={Math.min(100, steeze)} color="bg-cyan-500" />
            {carsOwned.length > 0 && (
              <>
                <StatBar icon={<Fuel className="w-3.5 h-3.5 text-emerald-400" />} label="Petrol" value={`${carPetrol}%`} pct={carPetrol} color="bg-emerald-500" />
                <StatBar icon={<Droplets className="w-3.5 h-3.5 text-cyan-400" />} label="Radiator" value={`${carRadiatorWater}%`} pct={carRadiatorWater} color="bg-cyan-500" />
                <StatBar icon={<Wrench className="w-3.5 h-3.5 text-purple-400" />} label="Engine" value={`${carEngineHealth}%`} pct={carEngineHealth} color="bg-purple-500" />
              </>
            )}
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-[11px] text-amber-300">
            {activeGuideTip}
          </div>
        </div>

        {/* EVENT LOG */}
        <div className="bg-slate-900 text-emerald-300 border border-emerald-700/60 px-4 py-2 rounded-xl text-xs font-bold shadow">
          🔔 {logMessage}
        </div>

        {/* =====================================================================
            TAB 1: 🗺️ TOWN MAP (ALL TRANSPORT, MOVING LINES & INTERIORS ARE INSIDE EACH BOX!)
           ===================================================================== */}
        {activeTab === "map" && (
          <div className="space-y-4 text-xs">
            <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-extrabold text-base text-emerald-400">
                  🗺️ {isMapZoomedOut ? "Lagos State Master Map (5 Areas)" : `${area} Town Map — Click Any Building Box Below`}
                </h2>
                <p className="text-slate-400 text-[11px]">
                  Transport options (`Trek`, `Korope/Bus`, `Cab`), the live moving line, and the building interior appear <strong>directly inside the box you click</strong>!
                </p>
              </div>
              <button
                onClick={() => setIsMapZoomedOut(!isMapZoomedOut)}
                className="px-4 py-2 bg-amber-500 text-slate-950 font-extrabold rounded-xl flex items-center gap-1.5"
              >
                {isMapZoomedOut ? <ZoomIn className="w-4 h-4" /> : <ZoomOut className="w-4 h-4" />}
                {isMapZoomedOut ? `Zoom In to ${area}` : "Zoom Out: Switch Lagos Area"}
              </button>
            </div>

            {isMapZoomedOut ? (
              <div className="grid sm:grid-cols-5 gap-3 bg-slate-900 text-white border-2 border-emerald-700 p-4 rounded-2xl">
                {(["Berger", "Oshodi", "Yaba", "Surulere", "Lekki"] as AreaName[]).map((dest) => {
                  const isCurrent = area === dest;
                  const dist = Math.abs(AREA_COORDS[area] - AREA_COORDS[dest]) || 1;
                  const busFare = dist * 1500;
                  const cabFare = dist * 3500;
                  const isMovingToArea = activeTransit?.targetId === `area_${dest}`;

                  return (
                    <div key={dest} className={`p-4 rounded-2xl border-2 flex flex-col justify-between space-y-3 ${isCurrent ? "bg-emerald-950/60 border-emerald-400" : "bg-slate-950 border-slate-800"}`}>
                      <div>
                        <div className="text-2xl mb-1">🏙️ 🌳</div>
                        <div className="font-extrabold text-base text-white">📍 {dest}</div>
                        <div className="text-[10px] text-slate-400">
                          Hospital Debt Tier: {HOSPITAL_AREA_RATES[dest].emergencyLoanDebt.toLocaleString()} c₦
                        </div>
                      </div>

                      {isCurrent ? (
                        <button onClick={() => setIsMapZoomedOut(false)} className="w-full py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-xl">
                          ✓ In {dest} (Open Street)
                        </button>
                      ) : isMovingToArea && activeTransit ? (
                        <div className="space-y-1.5 bg-slate-900 p-2 rounded-xl border border-amber-500">
                          <div className="text-[10px] text-amber-300 font-bold">
                            {activeTransit.modeIcon} Moving to {dest} ({activeTransit.remainingSecs}s)
                          </div>
                          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-400 transition-all"
                              style={{ width: `${((activeTransit.totalSecs - activeTransit.remainingSecs) / activeTransit.totalSecs) * 100}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1.5 pt-2 border-t border-slate-800">
                          <button
                            onClick={() => {
                              if (!spendMoney(busFare)) return;
                              const wait = dist * 8;
                              setActiveTransit({
                                targetId: `area_${dest}`,
                                targetName: `${dest} Bus Stop`,
                                targetIcon: "🚐",
                                fromName: area,
                                modeIcon: "🚐",
                                modeLabel: "Inter-Area Bus",
                                totalSecs: wait,
                                remainingSecs: wait,
                                distKm: dist * 6,
                              });
                              setTimeout(() => {
                                setArea(dest);
                                setCurrentBuildingId("Street_Bus_Stop");
                                setSelectedBoxId("Vacancy_Stand");
                                setExactPosition(`🚐 At ${dest} Main Bus Stop`);
                                setIsMapZoomedOut(false);
                              }, wait * 1000);
                            }}
                            className="w-full py-1.5 bg-amber-500 text-slate-950 font-extrabold rounded-lg text-[10px]"
                          >
                            🚐 Bus ({busFare.toLocaleString()} g₦ • {dist * 8}s)
                          </button>
                          <button
                            onClick={() => {
                              if (!spendMoney(cabFare)) return;
                              const wait = dist * 5;
                              setActiveTransit({
                                targetId: `area_${dest}`,
                                targetName: `${dest} Town`,
                                targetIcon: "🚕",
                                fromName: area,
                                modeIcon: "🚕",
                                modeLabel: "Inter-Area Cab",
                                totalSecs: wait,
                                remainingSecs: wait,
                                distKm: dist * 6,
                              });
                              setTimeout(() => {
                                setArea(dest);
                                setCurrentBuildingId("Street_Bus_Stop");
                                setSelectedBoxId("Vacancy_Stand");
                                setExactPosition(`🚕 At ${dest} Main Bus Stop`);
                                setIsMapZoomedOut(false);
                              }, wait * 1000);
                            }}
                            className="w-full py-1.5 bg-indigo-600 text-white font-bold rounded-lg text-[10px]"
                          >
                            🚕 Cab ({cabFare.toLocaleString()} g₦ • {dist * 5}s)
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* ===============================================================
                  BUILDING BOXES GRID (TRANSPORT + STRAIGHT LINE + INTERIOR ALL INSIDE THE CLICKED BOX!)
                 =============================================================== */
              <div className="rounded-3xl border-4 border-emerald-800 bg-slate-900 text-white p-5 space-y-4 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 1. MY HOME BOX (IF HOME IS IN THIS AREA) */}
                  {shelterArea === area && (() => {
                    const homeBox: MapBuilding = {
                      id: "My_Home",
                      roofColor: "bg-emerald-500",
                      icon: "🏠",
                      name: `My Home (${shelterType})`,
                      sub: "Sleep, Cook with kg Gas & Furnish",
                      distKm: 1.4,
                    };
                    const isSelected = selectedBoxId === "My_Home" || currentBuildingId === "My_Home";
                    return (
                      <div
                        onClick={() => setSelectedBoxId("My_Home")}
                        className={`cursor-pointer bg-slate-950 border-2 ${
                          currentBuildingId === "My_Home" ? "border-emerald-400" : isSelected ? "border-amber-400" : "border-slate-800"
                        } rounded-2xl overflow-hidden shadow-xl p-4 transition`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">🏠</span>
                            <div>
                              <div className="font-extrabold text-sm text-white">{homeBox.name}</div>
                              <div className="text-[11px] text-slate-400">{homeBox.sub} • {homeBox.distKm} km</div>
                            </div>
                          </div>
                          <span className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-[10px] font-bold text-emerald-400">
                            {currentBuildingId === "My_Home" ? "✓ Inside Home" : "Click Box"}
                          </span>
                        </div>

                        {isSelected &&
                          renderInBoxTransportOrInterior(
                            homeBox,
                            <div className="space-y-3">
                              <div className="text-[11px] text-slate-300">
                                Bed: <strong>{bedTier}</strong> (Cap {maxEnergyCap}%) • Kitchen Gas: <strong>{gasKg} kg</strong> • Raw Food: <strong>{rawFoodServings} Meals</strong>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEnergy(maxEnergyCap);
                                    setGameDay((d) => d + 1);
                                    setLogMessage(`🛌 Slept inside your home! Energy restored to ${maxEnergyCap}%.`);
                                  }}
                                  className="py-2 bg-indigo-600 text-white font-extrabold rounded-xl"
                                >
                                  🛌 Sleep Overnight ({maxEnergyCap}% En)
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (!hasCookingStove || gasKg < 0.4 || rawFoodServings < 1) {
                                      return setLogMessage("❌ Need Gas Stove, >=0.4kg Gas & 1 Raw Food (Buy at Oshodi Market box)!");
                                    }
                                    setGasKg((g) => Number(Math.max(0, g - 0.4).toFixed(1)));
                                    setRawFoodServings((r) => r - 1);
                                    setHunger(100);
                                    setEnergy(maxEnergyCap);
                                    setHealth((h) => Math.min(100, h + 15));
                                    setLogMessage("🍳 Cooked meal at home (-0.4kg Gas)!");
                                  }}
                                  className="py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-xl"
                                >
                                  🍳 Cook Meal (-0.4kg Gas)
                                </button>
                              </div>
                            </div>,
                            true
                          )}
                      </div>
                    );
                  })()}

                  {/* 2. LIVE CONSTRUCTION SITE BOXES IN THIS AREA (STRICT OWNER VS WORKER SEPARATION!) */}
                  {activeConstructionSites
                    .filter((s) => s.area === area)
                    .map((site, idx) => {
                      const siteBox: MapBuilding = {
                        id: site.id,
                        roofColor: "bg-amber-500",
                        icon: "🧱",
                        name: site.projectName,
                        sub: `Owner: ${site.ownerName} • Bricklayers: ${site.currentBricklayers}/${site.maxBricklayers} (Min ${site.minBricklayers})`,
                        distKm: 1.8,
                      };
                      const isSelected = selectedBoxId === site.id || currentBuildingId === site.id;
                      const isPlayerTheOwner = site.ownerName.trim().toLowerCase() === username.trim().toLowerCase();

                      return (
                        <div
                          key={site.id}
                          onClick={() => setSelectedBoxId(site.id)}
                          className={`cursor-pointer bg-slate-950 border-2 ${
                            currentBuildingId === site.id ? "border-emerald-400" : isSelected ? "border-amber-400" : "border-amber-600/50"
                          } rounded-2xl overflow-hidden shadow-xl p-4 transition`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-3xl">🧱🏗️</span>
                              <div>
                                <div className="font-extrabold text-sm text-amber-300">{siteBox.name}</div>
                                <div className="text-[11px] text-slate-400">{siteBox.sub} • {siteBox.distKm} km</div>
                              </div>
                            </div>
                            <span className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-[10px] font-bold text-amber-400">
                              {currentBuildingId === site.id ? "✓ On Site" : "Click Box"}
                            </span>
                          </div>

                          {isSelected &&
                            renderInBoxTransportOrInterior(
                              siteBox,
                              <div className="space-y-2.5">
                                <div className="text-[11px] text-slate-300">
                                  Build Timer: <strong>{formatSecs(site.timeRemainingSecs)}</strong> • Bricklayers:{" "}
                                  <strong className="text-emerald-400">{site.currentBricklayers}/{site.maxBricklayers} (Min {site.minBricklayers})</strong>
                                </div>

                                {/* STRICT RULE: IF PLAYER IS NOT THE OWNER, ONLY SHOW THE WORKER BUTTON! */}
                                {!isPlayerTheOwner ? (
                                  <button
                                    disabled={site.playerWorkedHere || site.currentBricklayers >= site.maxBricklayers}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (energy < 40) return setLogMessage("⚠️ Need 40% Energy for a full-day Bricklayer shift!");
                                      setEnergy((en) => Math.max(5, en - 40));
                                      setGameHour((h) => (h + 6) % 24);
                                      const up = [...activeConstructionSites];
                                      const realIdx = up.findIndex((x) => x.id === site.id);
                                      if (realIdx > -1) {
                                        up[realIdx].currentBricklayers += 1;
                                        up[realIdx].playerWorkedHere = true;
                                        up[realIdx].timeRemainingSecs = Math.max(0, up[realIdx].timeRemainingSecs - 1800);
                                        setActiveConstructionSites(up);
                                      }
                                      receiveEarnedMoney(site.payPerShiftCn, `Bricklayer Shift at ${site.projectName}`);
                                    }}
                                    className="w-full py-2.5 bg-amber-500 text-slate-950 font-extrabold rounded-xl disabled:opacity-40"
                                  >
                                    {site.playerWorkedHere
                                      ? "✓ You Already Completed Your 1 Shift on This Project"
                                      : `🧱 Work Full-Day Bricklayer Shift (+${site.payPerShiftCn.toLocaleString()} c₦)`}
                                  </button>
                                ) : (
                                  /* ONLY SHOWN IF THIS PLAYER IS THE OWNER OF THIS PROJECT! */
                                  <div className="p-2.5 bg-indigo-950/50 border border-indigo-500 rounded-xl space-y-2">
                                    <div className="font-bold text-indigo-300">👑 Project Owner Dashboard (Visible Only to You)</div>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (spendMoney(150000)) {
                                          const up = [...activeConstructionSites];
                                          const realIdx = up.findIndex((x) => x.id === site.id);
                                          if (realIdx > -1) {
                                            up[realIdx].currentBricklayers = up[realIdx].maxBricklayers;
                                            up[realIdx].timeRemainingSecs = 0;
                                            setActiveConstructionSites(up);
                                          }
                                          setLogMessage("👷🏾‍♂️ Hired NPC Backup Team for your project! Construction complete.");
                                        }
                                      }}
                                      className="w-full py-2 bg-indigo-600 text-white font-bold rounded-lg"
                                    >
                                      Hire Backup NPC Bricklayer Team (150,000 g₦)
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                        </div>
                      );
                    })}

                  {/* 3. ALL STANDARD BUILDINGS IN THIS AREA (EACH SELF-CONTAINED IN ITS OWN BOX!) */}
                  {subMapBuildings[area].map((b) => {
                    const isSelected = selectedBoxId === b.id || currentBuildingId === b.id;

                    // Define the interior JSX for each building ID:
                    let interiorContent: React.ReactNode = null;

                    if (b.id === "Vacancy_Stand") {
                      interiorContent = (
                        <div className="space-y-2 text-[11px]">
                          {activeConstructionSites.map((s) => (
                            <div key={s.id} className="p-2 bg-slate-900 border border-amber-500/40 rounded-lg">
                              <div className="font-bold text-amber-300">🧱 {s.projectName} ({s.area})</div>
                              <div>Pay: +{s.payPerShiftCn.toLocaleString()} c₦ • Workers: {s.currentBricklayers}/{s.maxBricklayers}</div>
                              <div className="text-emerald-400">👉 Click the Construction Site box in {s.area} (1.8 km) to travel &amp; work!</div>
                            </div>
                          ))}
                          <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg">
                            <div className="font-bold text-rose-300">👩🏾‍🍳 Surulere Domestic Maid Agency ({agencyMaidVacanciesCount} Open)</div>
                            <div className="text-emerald-400">👉 Travel to Surulere -&gt; Domestic Maid Agency box (1.7 km)!</div>
                          </div>
                          <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg">
                            <div className="font-bold text-cyan-300">🏥 Hospital Nurse (+160k c₦) &amp; Doctor (+480k c₦)</div>
                            <div className="text-emerald-400">👉 Click the Hospital box in your Area (1.5–2.2 km)!</div>
                          </div>
                        </div>
                      );
                    } else if (b.id === "Public_Eatery") {
                      interiorContent = (
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { name: "🍞 Bread & Beans", cost: 2000, belly: 35, en: 20, hp: 5 },
                            { name: "🍛 Party Jollof & Plantain", cost: 4500, belly: 50, en: 35, hp: 15 },
                            { name: "🍲 Amala & Ewedu", cost: 6000, belly: 65, en: 45, hp: 20 },
                            { name: "🥣 Pounded Yam & Egusi", cost: 8500, belly: 80, en: 55, hp: 25 },
                            { name: "🐟 Catfish Pepper Soup", cost: 11000, belly: 75, en: 60, hp: 35 },
                            { name: "🍗 Mixed Grill & Salad", cost: 18000, belly: 100, en: 85, hp: 50 },
                          ].map((m, i) => (
                            <button
                              key={i}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (spendMoney(m.cost)) {
                                  setHunger((h) => Math.min(100, h + m.belly));
                                  setEnergy((en) => Math.min(maxEnergyCap, en + m.en));
                                  setHealth((hp) => Math.min(100, hp + m.hp));
                                  setLogMessage(`🍛 Ate ${m.name}!`);
                                }
                              }}
                              className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-left"
                            >
                              <div className="font-bold text-white text-[11px]">{m.name}</div>
                              <div className="text-[10px] text-emerald-400">{m.cost.toLocaleString()} g₦ • +{m.belly}% Belly</div>
                            </button>
                          ))}
                        </div>
                      );
                    } else if (b.id === "Gas_Kitchen_Shop") {
                      interiorContent = (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[11px] text-teal-300 font-bold">Gas: {gasKg}kg • Food: {rawFoodServings} Meals</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setBargainDiscountPct(15);
                                setLogMessage("🗣️ Bargained 15% discount on your next market item!");
                              }}
                              className="px-2 py-1 bg-amber-500 text-slate-950 font-extrabold rounded text-[10px]"
                            >
                              {bargainDiscountPct > 0 ? `✓ -${bargainDiscountPct}% Off` : "🗣️ Bargain (-15%)"}
                            </button>
                          </div>
                          <button
                            disabled={hasCookingStove}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (spendMoney(35000, true)) {
                                setHasCookingStove(true);
                                setGasKg(2.0);
                                setLogMessage("🔥 Bought Gas Stove (+2.0kg Gas)!");
                              }
                            }}
                            className="w-full p-2 bg-slate-900 border border-orange-600 rounded-lg flex justify-between font-bold"
                          >
                            <span>{hasCookingStove ? "✓ Owned: Gas Stove" : "🔥 Buy Tabletop Gas Stove"}</span>
                            <span className="text-amber-400">35,000 g₦</span>
                          </button>
                          <div className="grid grid-cols-2 gap-1.5">
                            {[
                              { label: "⛽ +3.0 kg Gas", kg: 3.0, cost: 3500 },
                              { label: "⛽ +12.5 kg Gas", kg: 12.5, cost: 13500 },
                            ].map((g, i) => (
                              <button
                                key={i}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!hasCookingStove) return setLogMessage("❌ Buy Gas Stove first!");
                                  if (spendMoney(g.cost, true)) setGasKg((p) => Number((p + g.kg).toFixed(1)));
                                }}
                                className="p-1.5 bg-slate-900 border border-slate-800 rounded font-bold text-[10px]"
                              >
                                {g.label} ({g.cost.toLocaleString()})
                              </button>
                            ))}
                          </div>
                          <div className="grid grid-cols-2 gap-1.5">
                            {[
                              { name: "🥖 Garri & Beans (3 Meals)", meals: 3, cost: 4500 },
                              { name: "🍠 Pounded Yam Pack (7 Meals)", meals: 7, cost: 12000 },
                              { name: "🍚 Ofada Rice & Meat (10 Meals)", meals: 10, cost: 18000 },
                              { name: "🥩 25kg Jollof Bag (18 Meals)", meals: 18, cost: 34000 },
                            ].map((f, i) => (
                              <button
                                key={i}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (spendMoney(f.cost, true)) setRawFoodServings((r) => r + f.meals);
                                }}
                                className="p-1.5 bg-slate-900 border border-slate-800 rounded text-left text-[10px]"
                              >
                                <div className="font-bold text-white">{f.name}</div>
                                <div className="text-emerald-400">{f.cost.toLocaleString()} g₦</div>
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    } else if (b.id === "Hospital") {
                      const hospRate = HOSPITAL_AREA_RATES[area];
                      interiorContent = (
                        <div className="space-y-2.5">
                          <div className="p-2 bg-rose-950/40 border border-rose-600 rounded-lg text-[11px]">
                            <div>🏥 <strong>{hospRate.name} ({area} Rates):</strong></div>
                            <div>• Cash Treatment: <strong>{hospRate.cashCost.toLocaleString()} g₦</strong> (100% Stats + 48h Shield)</div>
                            <div>• Emergency Credit Debt: <strong>+{hospRate.emergencyLoanDebt.toLocaleString()} c₦</strong></div>
                            <div className="text-rose-300 font-bold mt-1">🚨 Your Current Total Debt: {hospitalLoanDebt.toLocaleString()} c₦</div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (spendMoney(hospRate.cashCost)) {
                                  setHealth(100);
                                  setEnergy(maxEnergyCap);
                                  setHunger(100);
                                  setHospitalShieldHoursLeft(48);
                                  setLogMessage(`🏥 Treated at ${hospRate.name}! 100% Stats + 48h Shield.`);
                                }
                              }}
                              className="py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-lg text-[10px]"
                            >
                              💊 Pay Cash ({hospRate.cashCost.toLocaleString()} g₦)
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setHealth(100);
                                setEnergy(maxEnergyCap);
                                setHunger(100);
                                setHospitalShieldHoursLeft(48);
                                setHospitalLoanDebt((d) => d + hospRate.emergencyLoanDebt);
                                setDebtHistoryLog((logs) => [
                                  `${hospRate.name} (${area}) Credit Treatment: +${hospRate.emergencyLoanDebt.toLocaleString()} c₦`,
                                  ...logs,
                                ]);
                                setLogMessage(`🚑 Treated on Credit at ${hospRate.name}! +${hospRate.emergencyLoanDebt.toLocaleString()} c₦ added to your Debt!`);
                              }}
                              className="py-2 bg-rose-600 text-white font-extrabold rounded-lg text-[10px]"
                            >
                              🚑 Treat on Credit (+{hospRate.emergencyLoanDebt.toLocaleString()} Debt)
                            </button>
                          </div>
                          {hospitalLoanDebt > 0 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (spendMoney(hospitalLoanDebt)) {
                                  setHospitalLoanDebt(0);
                                  setLogMessage("✅ Cleared 100% of your Hospital & Transport Debt!");
                                }
                              }}
                              className="w-full py-1.5 bg-amber-500 text-slate-950 font-extrabold rounded-lg text-[10px]"
                            >
                              💳 Pay Off Full Debt Now ({hospitalLoanDebt.toLocaleString()})
                            </button>
                          )}
                          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!completedDegrees.some((d) => d.includes("Nursing"))) return setLogMessage("❌ Requires Nursing Degree!");
                                receiveEarnedMoney(160000, `Nurse Shift at ${hospRate.name}`);
                              }}
                              className="py-1.5 bg-cyan-600 text-white font-bold rounded text-[10px]"
                            >
                              👩🏾‍⚕️ Work as Nurse (+160k c₦)
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!completedDegrees.some((d) => d.includes("Medicine"))) return setLogMessage("❌ Requires Medicine MBBS!");
                                receiveEarnedMoney(480000, `Doctor Shift at ${hospRate.name}`);
                              }}
                              className="py-1.5 bg-indigo-600 text-white font-bold rounded text-[10px]"
                            >
                              👨🏾‍⚕️ Work as Doctor (+480k c₦)
                            </button>
                          </div>
                        </div>
                      );
                    } else if (b.id === "Yaba_Polytechnic" || b.id === "Unilag_University" || b.id === "Foreign_Embassy") {
                      interiorContent = (
                        <div className="space-y-2">
                          {enrolledProgram ? (
                            <div className="p-2 bg-indigo-950 border border-indigo-400 rounded-lg space-y-1.5">
                              <div className="font-bold text-white">{enrolledProgram.name} ({enrolledProgram.major}) — {enrolledProgram.completedClasses}/10</div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (energy < enrolledProgram.energyPerLecture) return setLogMessage(`⚠️ Need ${enrolledProgram.energyPerLecture}% Energy!`);
                                  setEnergy((en) => Math.max(5, en - enrolledProgram.energyPerLecture));
                                  const nextC = enrolledProgram.completedClasses + 1;
                                  if (nextC >= 10) {
                                    setCompletedDegrees((d) => [...d, `${enrolledProgram.name} (${enrolledProgram.major})`]);
                                    setEnrolledProgram(null);
                                  } else {
                                    setEnrolledProgram({ ...enrolledProgram, completedClasses: nextC });
                                  }
                                }}
                                className="w-full py-1.5 bg-emerald-500 text-slate-950 font-extrabold rounded"
                              >
                                Attend Lecture #{enrolledProgram.completedClasses + 1}/10
                              </button>
                            </div>
                          ) : (
                            (b.id === "Yaba_Polytechnic"
                              ? [
                                  { id: "ND_N", name: "Polytechnic ND", major: "Nursing", cost: 240000, en: 40 },
                                  { id: "HND_T", name: "Polytechnic HND", major: "Computer Tech", cost: 380000, en: 50 },
                                ]
                              : b.id === "Unilag_University"
                              ? [
                                  { id: "BSC_M", name: "University B.Sc", major: "Medicine (MBBS)", cost: 850000, en: 65 },
                                  { id: "MSC_L", name: "Masters (M.Sc)", major: "Management", cost: 1450000, en: 80 },
                                  { id: "PHD_L", name: "Doctorate (Ph.D)", major: "Research", cost: 2900000, en: 95 },
                                ]
                              : [
                                  { id: "HARV", name: "Harvard University", major: "Executive Ph.D/MBA", cost: 6500000, en: 95 },
                                  { id: "OXF", name: "Oxford University", major: "M.Sc Finance", cost: 4200000, en: 85 },
                                ]
                            ).map((d) => (
                              <button
                                key={d.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (spendMoney(d.cost)) setEnrolledProgram({ id: d.id, name: d.name, major: d.major, totalClasses: 10, completedClasses: 0, energyPerLecture: d.en, timerSeconds: 60 });
                                }}
                                className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg flex justify-between font-bold text-[10px]"
                              >
                                <span>{d.name} ({d.major})</span>
                                <span className="text-amber-400">{(d.cost / 1000).toFixed(0)}k g₦</span>
                              </button>
                            ))
                          )}
                        </div>
                      );
                    } else if (b.id === "Business_Blueprint_School") {
                      interiorContent = (
                        <div className="space-y-1.5">
                          {[
                            { id: "BP_Food_Kiosk", name: "🏪 Food Kiosk Blueprint (Step 1 Knowledge)", cost: 550000 },
                            { id: "BP_Small_Eatery", name: "🍲 Small Eatery Blueprint (Step 1 Knowledge)", cost: 1100000 },
                            { id: "Cert_Rice", name: "🍚🍲 Master of Rice, Jollof & Soup Cert", cost: 550000 },
                            { id: "ICAN", name: "📊 ICAN Chartered Accountant", cost: 950000 },
                          ].map((bp) => (
                            <button
                              key={bp.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (spendMoney(bp.cost)) {
                                  setOwnedBlueprints((p) => [...p, bp.id]);
                                  setSpecialistCerts((s) => [...s, bp.id]);
                                  setLogMessage(`📘 Acquired ${bp.name}!`);
                                }
                              }}
                              className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg flex justify-between font-bold text-[10px]"
                            >
                              <span>{bp.name}</span>
                              <span className="text-emerald-400">{(bp.cost / 1000).toFixed(0)}k g₦</span>
                            </button>
                          ))}
                        </div>
                      );
                    } else if (b.id === "Domestic_Maid_Agency") {
                      interiorContent = (
                        <div className="space-y-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (spendMoney(485000)) {
                                setHasHiredMaid(true);
                                setMaidWeeklyFoodLeft(14);
                                setAgencyMaidVacanciesCount((c) => c + 1);
                                setLogMessage("👩🏾‍🍳 Hired Certified Maid via Agency (485k)!");
                              }
                            }}
                            className="w-full py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-lg text-[10px]"
                          >
                            Homeowner: Hire Live-In Maid (485,000 g₦)
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!specialistCerts.includes("Cert_Rice")) return setLogMessage("❌ Requires Master Culinary Cert!");
                              receiveEarnedMoney(45000, "Domestic Maid Agency Shift");
                            }}
                            className="w-full py-2 bg-rose-600 text-white font-bold rounded-lg text-[10px]"
                          >
                            Worker: Work Agency Maid Vacancy (+45,000 c₦)
                          </button>
                        </div>
                      );
                    } else {
                      interiorContent = (
                        <div className="text-[11px] text-slate-300">
                          You are inside <strong>{b.name}</strong>. Services are active!
                        </div>
                      );
                    }

                    return (
                      <div
                        key={b.id}
                        onClick={() => setSelectedBoxId(b.id)}
                        className={`cursor-pointer bg-slate-950 border-2 ${
                          currentBuildingId === b.id ? "border-emerald-400" : isSelected ? "border-amber-400" : "border-slate-800"
                        } rounded-2xl overflow-hidden shadow-xl p-4 transition`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{b.icon}</span>
                            <div>
                              <div className="font-extrabold text-sm text-white">{b.name}</div>
                              <div className="text-[11px] text-slate-400">{b.sub} • {b.distKm} km</div>
                            </div>
                          </div>
                          <span className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-[10px] font-bold text-emerald-400">
                            {currentBuildingId === b.id ? "✓ Inside" : `${b.distKm} km`}
                          </span>
                        </div>

                        {isSelected && renderInBoxTransportOrInterior(b, interiorContent)}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =====================================================================
            TAB 2: 🏦 DOSSIER, ACTIVE DEBT LEDGER & CENTRAL BANK
           ===================================================================== */}
        {activeTab === "profile" && (
          <div className="grid md:grid-cols-3 gap-4 text-xs">
            {/* 1. CITIZEN DOSSIER & DEBT LEDGER */}
            <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-amber-400">🏆 {username}&apos;s Dossier &amp; Debt Ledger</h2>
              <div className="p-3 bg-rose-950/40 border border-rose-600 rounded-xl space-y-1.5">
                <div className="font-extrabold text-rose-300">🚨 Active Hospital / Transport Debt: {hospitalLoanDebt.toLocaleString()} c₦</div>
                <div className="text-[10px] text-slate-300">
                  (40% of your job earnings are automatically deducted until this debt is 0, or pay it off below!)
                </div>
                {debtHistoryLog.slice(0, 3).map((d, i) => (
                  <div key={i} className="text-[10px] text-rose-200">• {d}</div>
                ))}
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div>📍 <strong>Current Place:</strong> {exactPosition}</div>
                <div>🎓 <strong>Degrees:</strong> {completedDegrees.join(", ") || "Uneducated"}</div>
                <div>🏅 <strong>Certifications:</strong> {specialistCerts.join(", ") || "None"}</div>
              </div>
            </div>

            {/* 2. CONVERT EARNED c₦ TO g₦ (+25% BONUS) */}
            <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-cyan-400">🔄 Convert Earned c₦ to g₦ (+25% Bonus!)</h2>
              <input
                type="number"
                value={convertCnInput}
                onChange={(e) => setConvertCnInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
              />
              <button
                onClick={() => {
                  const amt = Number(convertCnInput) || 0;
                  if (amt <= 0 || earnedBalance < amt) return setLogMessage("❌ Not enough Earned c₦!");
                  const bonusGn = Math.round(amt * 1.25);
                  setEarnedBalance((e) => e - amt);
                  setStarterBalance((s) => s + bonusGn);
                  setLogMessage(`🔄 Converted ${amt.toLocaleString()} c₦ into +${bonusGn.toLocaleString()} g₦ (+25% Bonus)!`);
                }}
                className="w-full py-2.5 bg-cyan-500 text-slate-950 font-extrabold rounded-xl"
              >
                Convert c₦ -&gt; g₦ (+25% Working Capital)
              </button>
            </div>

            {/* 3. CENTRAL BANK */}
            <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-4 space-y-2.5">
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
              <div className="p-3 bg-emerald-950/40 border border-emerald-600 rounded-xl text-center">
                <div className="font-extrabold text-emerald-300">🔒 Real Naira Cashout: COMING SOON</div>
                <div className="text-[10px] text-slate-300">Accumulate your Earned c₦ ({earnedBalance.toLocaleString()} c₦) now!</div>
              </div>
            </div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 inset-x-0 bg-slate-900/95 backdrop-blur border-t border-slate-800 px-2 py-2 z-40">
        <div className="max-w-md mx-auto grid grid-cols-2 gap-2">
          {[
            { id: "map", label: "🗺️ Town Map (Click Any Box)", icon: <Map className="w-4 h-4" /> },
            { id: "profile", label: "🏦 Dossier, Debt & Bank", icon: <Award className="w-4 h-4" /> },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id === "map" ? "map" : "profile")}
              className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition ${
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

function StatBar({ icon, label, value, pct, color, onHelp }: any) {
  return (
    <div className="bg-slate-950 rounded-xl p-2 border border-slate-800">
      <div className="flex items-center justify-between text-[11px] mb-1">
        <span className="flex items-center gap-1 text-slate-300 truncate">{icon} {label}</span>
        <div className="flex items-center gap-1">
          <span className="font-bold text-white">{value}</span>
          {onHelp && (
            <button
              onClick={onHelp}
              className="w-4 h-4 rounded-full bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-400 text-[10px] font-extrabold flex items-center justify-center"
            >
              ?
            </button>
          )}
        </div>
      </div>
      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}