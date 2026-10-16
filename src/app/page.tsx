"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { 
  Heart, Zap, Utensils, Sparkles, Tv, Home, Map,
  BedDouble, Armchair, Briefcase, GraduationCap, Lock,
  Clock, Award, Wrench, Fuel, Droplets, ZoomOut, ZoomIn,
  Smartphone, ClipboardList, Sun, Sunset, Moon,
  UserSearch, Bath, Flame, Play, ArrowLeft, Send, MessageSquareQuote
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

const HOSPITAL_AREA_RATES: Record<AreaName, { name: string; cashCost: number; emergencyLoanDebt: number }> = {
  Oshodi: { name: "Oshodi General Hospital", cashCost: 25000, emergencyLoanDebt: 60000 },
  Berger: { name: "Berger Highway Medical Clinic", cashCost: 40000, emergencyLoanDebt: 95000 },
  Yaba: { name: "Yaba Mainland Hospital", cashCost: 55000, emergencyLoanDebt: 130000 },
  Surulere: { name: "Surulere General Hospital", cashCost: 75000, emergencyLoanDebt: 180000 },
  Lekki: { name: "Lekki Lagoon Executive Hospital", cashCost: 160000, emergencyLoanDebt: 380000 },
};

interface MapBuilding {
  id: string;
  roofStyle: string;
  icon: string;
  name: string;
  sub: string;
  distKm: number;
}

export default function LagosEmpireAuditedMaster() {
  // 1. ONBOARDING
  const [isCreated, setIsCreated] = useState(false);
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");

  // 2. 15-MINUTE RUNNING CLOCK, WEATHER & TIME-OF-DAY VISUAL THEME
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

  // 3. CENTRAL BANK (300M RESERVE + 10M DAILY BUY CAP), DUAL WALLETS & DEBT LEDGER
  const [centralBankReserve, setCentralBankReserve] = useState(300000000);
  const [dailyGnBoughtToday, setDailyGnBoughtToday] = useState(0);
  const DAILY_BUY_LIMIT = 10000000;
  const [starterBalance, setStarterBalance] = useState(50000); // g₦
  const [earnedBalance, setEarnedBalance] = useState(0);       // c₦
  const [hospitalLoanDebt, setHospitalLoanDebt] = useState(0);
  const [debtHistoryLog, setDebtHistoryLog] = useState<string[]>([]);
  const [hospitalShieldHoursLeft, setHospitalShieldHoursLeft] = useState(0);
  const [convertCnInput, setConvertCnInput] = useState("50000");
  const [transferRecipient, setTransferRecipient] = useState("");
  const [transferAmount, setTransferAmount] = useState("");

  // 4. MAP LOCATION, BUILDING SELECTION & INESCAPABLE FORCED TRANSIT POP-UP
  const [area, setArea] = useState<AreaName>("Oshodi");
  const [currentBuildingId, setCurrentBuildingId] = useState<string>("My_Home");
  const [exactPosition, setExactPosition] = useState<string>("🏠 Inside My Home (Oshodi)");
  const [isMapZoomedOut, setIsMapZoomedOut] = useState(false);
  const [clickedCardForTicket, setClickedCardForTicket] = useState<string>("None");

  const [forcedTransitPopup, setForcedTransitPopup] = useState<{
    fromLabel: string;
    toLabel: string;
    toIcon: string;
    modeIcon: string;
    modeName: string;
    distKm: number;
    totalSecs: number;
    remainingSecs: number;
    targetBuildingId: string;
    targetArea: AreaName;
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
    "💡 Click any building on the Town Map to see transport options inside its card. Once you pick a ride, a live moving Transit Pop-Up will carry you there!"
  );

  // 6. DOMESTIC MAID AGENCY & HOUSE MAID
  const [hasHiredMaid, setHasHiredMaid] = useState(false);
  const [maidWeeklyFoodLeft, setMaidWeeklyFoodLeft] = useState(0);
  const [maidTimerSecs, setMaidTimerSecs] = useState(300);
  const [agencyMaidVacanciesCount, setAgencyMaidVacanciesCount] = useState(2);

  // 7. FULL "MY HOME" INTERIOR STATE (4 ZONES)
  const [shelterType, setShelterType] = useState("Single Room (Shared Kitchen & Bath)");
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
  const [rawLandsOwned, setRawLandsOwned] = useState<AreaName[]>([]);

  // 8. DRIVING LICENSE (75K) & CARS
  const [hasDriversLicense, setHasDriversLicense] = useState(false);
  const [drivingLessonsDone, setDrivingLessonsDone] = useState(0);
  const [carsOwned, setCarsOwned] = useState<string[]>([]);
  const [activeCar, setActiveCar] = useState<string>("None");
  const [carPetrol, setCarPetrol] = useState(100);
  const [carRadiatorWater, setCarRadiatorWater] = useState(100);
  const [carEngineHealth, setCarEngineHealth] = useState(100);

  // 9. SEPARATED SCHOOLS, MAJORS & BLUEPRINTS
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
      ownerName: "Chief Balogun",
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
      projectName: "Alhaji Musa's Oshodi Eatery Plaza",
      ownerName: "Alhaji Musa",
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

  // 11. PUBLIC CITIZEN DIRECTORY
  const [inspectedCitizen, setInspectedCitizen] = useState<{
    handle: string;
    name: string;
    houseType: string;
    carDriven: string;
    degrees: string;
    debtAmountCn: number;
    netWorthLabel: string;
  } | null>(null);

  const otherCitizensList = [
    {
      handle: "@bola_oshodi",
      name: "Bola Adeyemi",
      houseType: "Single Room (Shared Kitchen & Bath)",
      carDriven: "None (Uses Danfo Bus)",
      degrees: "Uneducated",
      debtAmountCn: 120000,
      netWorthLabel: "🌱 Street Beginner",
    },
    {
      handle: "@chidinma_yaba",
      name: "Chidinma Okafor",
      houseType: "2-Bedroom Flat (En-Suite Kitchen & Bath)",
      carDriven: "Tokunbo Toyota Corolla",
      degrees: "University B.Sc (Nursing) + ICAN",
      debtAmountCn: 0,
      netWorthLabel: "👔 Corporate Oga / Boss",
    },
    {
      handle: "@tunde_lekki",
      name: "Engr. Tunde Balogun",
      houseType: "5-Bed Luxury Duplex",
      carDriven: "Mercedes-AMG G63 G-Wagon",
      degrees: "Harvard University (Ph.D/MBA)",
      debtAmountCn: 380000,
      netWorthLabel: "🏰 Lekki Real Estate Tycoon",
    },
  ];

  // 12. ACTIVE BUSINESSES (EATERIES, KIOSKS, AGENCIES) & AUTOMATED REVIEWS
  const [activeBusinesses, setActiveBusinesses] = useState<{
    name: string;
    type: "Food" | "Agency" | "Arch_Firm";
    area: AreaName;
    maxStaff: number;
    hiredStaff: number;
    maxCustomers: number;
    revenuePerHalfDay: number;
    foodStockRemaining: number;
    collectionsUsedThisCycle: number;
    hasRiceSpecialist: boolean;
    hasSoupSpecialist: boolean;
    hasMaltSpecialist: boolean;
  }[]>([]);

  const [automatedReviews, setAutomatedReviews] = useState<{
    customer: string;
    bizName: string;
    comment: string;
    healthBonus: number;
    pointsBonus: number;
    stars: string;
  }[]>([
    {
      customer: "@kemi_lekki",
      bizName: "Lagos Culinary Guide",
      comment: "Recruit Certified Rice, Soup & Malt specialists in your Eatery to trigger 5-star automated reviews!",
      healthBonus: 45,
      pointsBonus: 25,
      stars: "⭐⭐⭐⭐⭐",
    },
  ]);

  // 13. POLITICS, COURTSHIP & GYM
  const [partyStatus, setPartyStatus] = useState<"None" | "Member_JPC" | "Member_JSTD">("None");
  const [partyDaysAttended, setPartyDaysAttended] = useState<number>(0);
  const [nominationStatus, setNominationStatus] = useState<"None" | "Submitted_Verified">("None");
  const [cityBillboardText, setCityBillboardText] = useState("CITY BILLBOARD — Visit Surulere Party Secretariat to Campaign!");
  const [hasVoted, setHasVoted] = useState(false);

  const [maritalStatus, setMaritalStatus] = useState<"Single" | "Courting" | "Married">("Single");
  const [partnerName, setPartnerName] = useState("None");
  const [partnerRequirement, setPartnerRequirement] = useState("Must own a Smart TV & Cushion Sofa");
  const [datesCompleted, setDatesCompleted] = useState(0);
  const [gymPlan, setGymPlan] = useState<"None" | "1_Hour_Pass" | "Weekly_Plan" | "Monthly_VIP">("None");
  const [gigProofInputs, setGigProofInputs] = useState<Record<string, string>>({});

  const [timers, setTimers] = useState<Record<string, number>>({});
  const startCooldown = (key: string, seconds: number) => {
    setTimers((prev) => ({ ...prev, [key]: seconds }));
  };

  const [activeTab, setActiveTab] = useState<"map" | "profile">("map");
  const [logMessage, setLogMessage] = useState(
    "Welcome to Lagos! You are inside My Home in Oshodi. Click 'Step Back Outside to Street Map' whenever you want to travel to any building!"
  );

  const maxEnergyCap = bedTier === "Bare_Floor" ? 60 : bedTier === "Foam_Mattress" ? 85 : 100;

  const receiveEarnedMoney = (amount: number, sourceLabel: string) => {
    if (hospitalLoanDebt > 0) {
      const deduction = Math.min(hospitalLoanDebt, Math.floor(amount * 0.4));
      const netPay = amount - deduction;
      setHospitalLoanDebt((d) => d - deduction);
      setEarnedBalance((e) => e + netPay);
      setLogMessage(
        `🏥 DEBT GARNISHMENT (${sourceLabel}): Earned +${amount.toLocaleString()} c₦, auto-paid -${deduction.toLocaleString()} c₦ toward your Debt! Net added: +${netPay.toLocaleString()} c₦.`
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

  // CONTEXT-AWARE LOW-STAT ADVISORY BANNER (CHECKS STOVE & KG GAS!)
  const getSmartAdvisoryBanner = () => {
    if (hunger <= 30) {
      if (hasCookingStove && gasKg >= 0.4 && rawFoodServings > 0) {
        return `⚠️ LOW BELLY ALERT (${hunger}%): You have a Gas Stove, ${gasKg}kg Gas, and ${rawFoodServings} Raw Meals at home! Travel to My Home (${shelterArea}) to cook, or enter ${area} Public Eatery!`;
      }
      return `⚠️ LOW BELLY ALERT (${hunger}%): You have ${gasKg}kg Cooking Gas & ${rawFoodServings} Raw Meals at home! Travel 0.7 km to ${area} Public Eatery for hot food, or visit Oshodi Market to buy Gas (kg) & Yam/Rice!`;
    }
    if (energy <= 25) {
      return `⚠️ LOW ENERGY ALERT (${energy}%): You are exhausted! Travel to My Home (${shelterArea}) on the Map to sleep in your Bedroom!`;
    }
    if (health <= 40) {
      return `🚑 LOW HEALTH WARNING (${health}%): Travel to ${HOSPITAL_AREA_RATES[area].name} on the Map before you collapse!`;
    }
    return null;
  };

  // MASTER 1-SECOND ENGINE
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        const next: Record<string, number> = {};
        for (const k in prev) {
          if (prev[k] > 1) next[k] = prev[k] - 1;
        }
        return next;
      });

      // Tick Forced Transit Pop-Up Modal
      setForcedTransitPopup((prev) => {
        if (!prev) return null;
        if (prev.remainingSecs <= 1) {
          setArea(prev.targetArea);
          setCurrentBuildingId(prev.targetBuildingId);
          setClickedCardForTicket("None");
          setExactPosition(`${prev.toIcon} Inside ${prev.toLabel} (${prev.targetArea})`);
          setIsMapZoomedOut(false);
          setLogMessage(`✅ Arrived at ${prev.toLabel} (${prev.distKm} km)! Welcome inside.`);
          return null;
        }
        return { ...prev, remainingSecs: prev.remainingSecs - 1 };
      });

      // Tick Active Construction Sites
      setActiveConstructionSites((sites) =>
        sites.map((s) => ({
          ...s,
          timeRemainingSecs: Math.max(0, s.timeRemainingSecs - 1),
        }))
      );

      // Tick 5-Minute House Maid Automation
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

      // Advance 15-Minute Clock
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
            setDailyGnBoughtToday(0);
            setGameDay((d) => {
              const nd = d + 1;
              if (currentBuildingId === "Party_Secretariat") {
                setPartyDaysAttended((pd) => pd + 1);
              }
              if (nd % 7 === 0) {
                setGameWeek((w) => w + 1);
                setWeeksUntilRentDue((r) => (ownershipMode === "Bought_Owned" ? 999 : Math.max(0, r - 1)));
                setOwnedProperties((props) =>
                  props.map((p) => ({
                    ...p,
                    weeksLeftToCollect: p.isListedWithAgent ? Math.max(0, p.weeksLeftToCollect - 1) : 8,
                  }))
                );
              }
              return nd;
            });
          }
          return nextH;
        });

        // Area-Tiered Hospital Collapse
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
                setExactPosition(`🏥 Admitted Inside ${areaHosp.name} (${area})`);
                setHospitalLoanDebt((debt) => debt + areaHosp.emergencyLoanDebt);
                setDebtHistoryLog((logs) => [
                  `Emergency Admission at ${areaHosp.name} (${area}): +${areaHosp.emergencyLoanDebt.toLocaleString()} c₦ Debt`,
                  ...logs,
                ]);
                setLogMessage(
                  `🚑 COLLAPSED IN ${area.toUpperCase()}! Rushed to ${areaHosp.name}! Restored to 100% + 48h Shield, and +${areaHosp.emergencyLoanDebt.toLocaleString()} c₦ added to your Debt Ledger!`
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
  }, [hasHiredMaid, maidWeeklyFoodLeft, gasKg, hospitalShieldHoursLeft, area, maxEnergyCap, ownershipMode, currentBuildingId]);

  const formatSecs = (s?: number) => {
    if (!s || s <= 0) return "0s";
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}h ${m}m ${sec}s`;
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
  };

  // COMPLETE ARCHITECTURAL BUILDINGS CATALOG (EVERY SINGLE ONE HAS A FULL INTERFACE BELOW!)
  const subMapBuildings: Record<AreaName, MapBuilding[]> = {
    Oshodi: [
      { id: "Vacancy_Stand", roofStyle: "bg-emerald-600 rounded-t-full", icon: "📋", name: "Oshodi Vacancy Notice Stand", sub: "Directions to All Live Jobs", distKm: 0.2 },
      { id: "Public_Eatery", roofStyle: "bg-amber-600 rounded-t-3xl", icon: "🍛", name: "Oshodi Mama Put & Eatery", sub: "6 Standard Hot Meals", distKm: 0.7 },
      { id: "Gas_Kitchen_Shop", roofStyle: "bg-teal-600", icon: "🔥", name: "Oshodi Market & Gas Depot", sub: "Buy Gas in kg & 8 Food Bundles", distKm: 1.2 },
      { id: "Hospital", roofStyle: "bg-rose-600", icon: "🏥", name: "Oshodi General Hospital", sub: "Cash: 25k | Loan Debt: 60k", distKm: 1.5 },
      { id: "Driving_School", roofStyle: "bg-yellow-600", icon: "🪪", name: "FRSC & Driving Academy", sub: "Separate Driving School (75k)", distKm: 2.4 },
      { id: "Mechanic_Shop", roofStyle: "bg-purple-600", icon: "🔧", name: "Oshodi Mechanic Village", sub: "Fix Engine & Radiator Water", distKm: 3.8 },
      { id: "Agent_Office", roofStyle: "bg-cyan-600", icon: "🏘️", name: "Oshodi Estate Agent", sub: "Rent, Buy or Landlord Form", distKm: 2.1 },
      { id: "Gym", roofStyle: "bg-orange-600", icon: "🏋🏾‍♂️", name: "Oshodi Fitness Gym", sub: "1hr / Weekly / Monthly Plans", distKm: 1.9 },
    ],
    Berger: [
      { id: "Vacancy_Stand", roofStyle: "bg-emerald-600 rounded-t-full", icon: "📋", name: "Berger Vacancy Notice Stand", sub: "Directions to All Live Jobs", distKm: 0.2 },
      { id: "Auto_Dealership", roofStyle: "bg-emerald-700", icon: "🚗", name: "Berger Motor Fair (8 Cars)", sub: "Bargain & Buy Vehicles", distKm: 2.6 },
      { id: "Filling_Station", roofStyle: "bg-yellow-600", icon: "⛽", name: "NNPC Mega Filling Station", sub: "Petrol & Radiator Water", distKm: 1.1 },
      { id: "Builder_Yard", roofStyle: "bg-orange-600", icon: "🏗️", name: "Julius Berger Construction & Biz HQ", sub: "Step 3: Build & Manage Eateries", distKm: 3.4 },
      { id: "Furniture_Shop", roofStyle: "bg-indigo-600", icon: "🛏️", name: "Berger Mattress & Sofa Depot", sub: "Foam, King Bed & Sofa", distKm: 1.8 },
      { id: "Hospital", roofStyle: "bg-rose-600", icon: "🏥", name: "Berger Highway Medical Clinic", sub: "Cash: 40k | Loan Debt: 95k", distKm: 1.6 },
      { id: "Public_Eatery", roofStyle: "bg-amber-600 rounded-t-3xl", icon: "🍛", name: "Berger Highway Bukka", sub: "6 Standard Hot Meals", distKm: 0.8 },
      { id: "Agent_Office", roofStyle: "bg-cyan-600", icon: "🏘️", name: "Berger Estate Agent", sub: "Houses & Landlord Form", distKm: 2.0 },
    ],
    Yaba: [
      { id: "Vacancy_Stand", roofStyle: "bg-emerald-600 rounded-t-full", icon: "📋", name: "Yaba Vacancy Notice Stand", sub: "Directions to All Live Jobs", distKm: 0.2 },
      { id: "Yaba_Polytechnic", roofStyle: "bg-indigo-600", icon: "🏫", name: "Yaba Polytechnic Campus", sub: "ND, HND & Poly Lecturer Job", distKm: 1.6 },
      { id: "Unilag_University", roofStyle: "bg-blue-700", icon: "🎓", name: "University of Lagos Senate", sub: "B.Sc, M.Sc, Ph.D & Prof Job", distKm: 2.9 },
      { id: "Architect_Firm", roofStyle: "bg-cyan-600", icon: "📐", name: "Yaba Architectural Studio", sub: "Step 2: Paid Plan Stamping", distKm: 2.2 },
      { id: "Electronics_Shop", roofStyle: "bg-purple-600", icon: "📱", name: "Yaba Tech, Phones & TV Plaza", sub: "Buy Smartphones & 4 TV Tiers", distKm: 1.4 },
      { id: "Corporate_Towers", roofStyle: "bg-teal-700", icon: "🏢", name: "Yaba Tech & Career Hub", sub: "Corporate, Specialist & Social Gigs", distKm: 2.0 },
      { id: "Hospital", roofStyle: "bg-rose-600", icon: "🏥", name: "Yaba Mainland Hospital", sub: "Cash: 55k | Loan Debt: 130k", distKm: 1.8 },
      { id: "Public_Eatery", roofStyle: "bg-amber-600 rounded-t-3xl", icon: "🍛", name: "Yaba Campus Jollof Spot", sub: "6 Standard Hot Meals", distKm: 0.6 },
    ],
    Surulere: [
      { id: "Vacancy_Stand", roofStyle: "bg-emerald-600 rounded-t-full", icon: "📋", name: "Surulere Vacancy Notice Stand", sub: "Directions to All Live Jobs", distKm: 0.2 },
      { id: "Business_Blueprint_School", roofStyle: "bg-emerald-700", icon: "💼", name: "Lagos Business & Blueprint School", sub: "Step 1: Blueprints & ICAN/PMP", distKm: 2.3 },
      { id: "Domestic_Maid_Agency", roofStyle: "bg-rose-600", icon: "👩🏾‍🍳", name: "Domestic Maid Staffing Agency", sub: "Hire Maid (485k) or Work as Maid", distKm: 1.7 },
      { id: "Party_Secretariat", roofStyle: "bg-green-700", icon: "🏛️", name: "JPC Party & Electoral HQ", sub: "3-Day Attendance, Form & Billboards", distKm: 2.8 },
      { id: "Church_Lounge", roofStyle: "bg-pink-600", icon: "🥂", name: "Surulere Mall, Church & Lounge", sub: "Meet Partners & 10 Dates", distKm: 1.5 },
      { id: "Hospital", roofStyle: "bg-red-600", icon: "🏥", name: "Surulere General Hospital", sub: "Cash: 75k | Loan Debt: 180k", distKm: 1.9 },
      { id: "Public_Eatery", roofStyle: "bg-amber-600 rounded-t-3xl", icon: "🍛", name: "Surulere Kilimanjaro Eatery", sub: "6 Standard Hot Meals", distKm: 0.9 },
    ],
    Lekki: [
      { id: "Vacancy_Stand", roofStyle: "bg-emerald-600 rounded-t-full", icon: "📋", name: "Lekki Vacancy Notice Stand", sub: "Directions to All Live Jobs", distKm: 0.2 },
      { id: "Hospital", roofStyle: "bg-rose-600", icon: "🏥", name: "Lekki Lagoon Executive Hospital", sub: "Cash: 160k | Loan Debt: 380k!", distKm: 2.2 },
      { id: "Foreign_Embassy", roofStyle: "bg-indigo-700", icon: "✈️", name: "Foreign Embassy (Harvard/Oxford)", sub: "Visa & Study Abroad Universities", distKm: 3.5 },
      { id: "Lands_Bureau", roofStyle: "bg-amber-600", icon: "📜", name: "Lekki Lands Bureau & C-of-O", sub: "Buy Land & C-of-O", distKm: 2.7 },
      { id: "Corporate_Towers", roofStyle: "bg-cyan-700", icon: "🏢", name: "Victoria Island Executive Towers", sub: "Bank, Oil/Gas & Specialist Jobs", distKm: 3.1 },
      { id: "Agent_Office", roofStyle: "bg-teal-600", icon: "🏰", name: "Lekki Luxury Estate Agent", sub: "Duplexes & Landlord Form", distKm: 1.9 },
      { id: "Filling_Station", roofStyle: "bg-yellow-600", icon: "⛽", name: "Lekki Express Fuel Station", sub: "Petrol & Radiator Water", distKm: 1.2 },
      { id: "Public_Eatery", roofStyle: "bg-amber-600 rounded-t-3xl", icon: "🍛", name: "Lekki Continental Bistro", sub: "6 Standard Hot Meals", distKm: 1.1 },
    ],
  };

  const getStreetTransitTicket = (target: MapBuilding, isGoingHome = false) => {
    const returnMultiplier = isGoingHome ? 1.25 : 1.0;
    const trafficTimeMult = isRushHourTraffic ? 1.5 : 1.0;
    const km = target.distKm;

    return {
      km,
      trekSecs: Math.max(5, Math.round(km * 12)),
      trekEnergy: Math.min(45, Math.max(4, Math.round(km * 6))),
      busCost: Math.round(km * 450 * returnMultiplier),
      busSecs: Math.max(4, Math.round(km * 8 * trafficTimeMult)),
      cabCost: Math.round(km * 1100 * returnMultiplier),
      cabSecs: Math.max(3, Math.round(km * 5 * trafficTimeMult)),
    };
  };

  const triggerForcedTransit = (
    targetBuilding: MapBuilding,
    targetAreaName: AreaName,
    mode: "trek" | "bus" | "cab" | "car",
    isGoingHome = false,
    customDistKm?: number,
    customBusCost?: number,
    customCabCost?: number
  ) => {
    const t = getStreetTransitTicket(targetBuilding, isGoingHome);
    const distKm = customDistKm || t.km;
    const busCost = customBusCost || t.busCost;
    const cabCost = customCabCost || t.cabCost;

    if (mode === "trek") {
      if (energy < t.trekEnergy && distKm > 0.3) {
        return setLogMessage("⚠️ Too exhausted to trek! Take a Korope/Bus or Cab.");
      }
      setEnergy((e) => Math.max(5, e - t.trekEnergy));
      if (hospitalShieldHoursLeft > 0 && distKm > 1.0) {
        setHospitalShieldHoursLeft((sh) => Math.max(0, sh - 4));
      }
    } else if (mode === "bus") {
      if (!spendMoney(busCost)) return;
    } else if (mode === "cab") {
      if (!spendMoney(cabCost)) return;
    } else if (mode === "car") {
      if (carsOwned.length === 0) return setLogMessage("❌ You do not own a car!");
      if (!hasDriversLicense) return setLogMessage("🚓 FRSC BLOCKED: Get your 75k Driver's License at Oshodi Driving Academy first!");
      if (carPetrol < 5 || carRadiatorWater < 5) return setLogMessage("⚠️ Refill Petrol & Radiator Water first!");
      setCarPetrol((p) => Math.max(0, p - 5));
      setCarRadiatorWater((w) => Math.max(0, w - 4));
      setCarEngineHealth((h) => Math.max(10, h - 2));
    }

    const waitSecs =
      customDistKm
        ? mode === "bus"
          ? Math.max(6, Math.round(distKm * 1.5))
          : Math.max(4, Math.round(distKm * 1.0))
        : mode === "trek"
        ? t.trekSecs
        : mode === "bus"
        ? t.busSecs
        : t.cabSecs;

    const modeIcon = mode === "trek" ? "🚶🏾‍♂️" : mode === "bus" ? "🚐" : mode === "cab" ? "🚕" : "🚗";
    const modeName = mode === "trek" ? "Trekking on Foot" : mode === "bus" ? "Danfo / Korope Bus" : mode === "cab" ? "Executive Drop Cab" : `Driving ${activeCar}`;

    setForcedTransitPopup({
      fromLabel: exactPosition.replace("🏠 Inside ", "").replace("🏢 Inside ", ""),
      toLabel: targetBuilding.name,
      toIcon: targetBuilding.icon,
      modeIcon,
      modeName,
      distKm,
      totalSecs: waitSecs,
      remainingSecs: waitSecs,
      targetBuildingId: targetBuilding.id,
      targetArea: targetAreaName,
    });
  };

  if (!isCreated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border-2 border-emerald-500 rounded-2xl p-6 shadow-2xl">
          <div className="inline-block px-3 py-1 bg-emerald-500 text-slate-950 text-xs font-extrabold rounded-full mb-3">
            ✓ AUDITED &amp; COMPLETE — ZERO MISSING INTERIORS
          </div>
          <h1 className="text-2xl font-extrabold mb-2">Begin Your Lagos Life</h1>
          <p className="text-slate-400 text-sm mb-6">
            Start in Oshodi with 50,000 g₦ in a Single Room (shared kitchen &amp; bathroom). Every single building across all 5 Areas now has its complete standalone interface!
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
            Enter My Home in Oshodi (50,000 g₦ Stipend)
          </button>
        </div>
      </div>
    );
  }

  const wallBgMap: Record<string, string> = {
    Unplastered: "bg-stone-800 border-stone-700",
    Cream: "bg-amber-950/80 border-amber-700/60",
    Emerald: "bg-emerald-950/80 border-emerald-700/60",
    RoyalBlue: "bg-blue-950/80 border-blue-700/60",
  };

  const themeWrapperClass =
    timeOfDayPhase === "Daylight"
      ? "bg-sky-100 text-slate-900"
      : timeOfDayPhase === "Afternoon_Sunset"
      ? "bg-amber-100 text-slate-900"
      : "bg-slate-950 text-slate-100";

  const advisoryBanner = getSmartAdvisoryBanner();

  const renderInCardTicketSelector = (b: MapBuilding, isHome = false) => {
    const t = getStreetTransitTicket(b, isHome);
    return (
      <div
        onClick={(e) => e.stopPropagation()}
        className="mt-3 pt-3 border-t border-amber-500/40 bg-slate-900 p-2.5 rounded-xl space-y-2 text-left"
      >
        <div className="text-[10px] font-extrabold text-amber-300">
          🚌 Choose Transport ({t.km} km) {isHome && "• +25% Return Fare"}:
        </div>
        <div className={`grid ${carsOwned.length > 0 ? "grid-cols-2" : "grid-cols-3"} gap-1.5`}>
          <button
            onClick={() => triggerForcedTransit(b, area, "trek", isHome)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-left"
          >
            <div className="font-extrabold text-white text-[10px]">🚶🏾‍♂️ Trek</div>
            <div className="text-[9px] text-emerald-400">₦0 • {t.trekSecs}s</div>
          </button>
          <button
            onClick={() => triggerForcedTransit(b, area, "bus", isHome)}
            className="p-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500 rounded-lg text-left"
          >
            <div className="font-extrabold text-amber-300 text-[10px]">🚐 Bus</div>
            <div className="text-[9px] text-white">{t.busCost.toLocaleString()} g₦ • {t.busSecs}s</div>
          </button>
          <button
            onClick={() => triggerForcedTransit(b, area, "cab", isHome)}
            className="p-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-left"
          >
            <div className="font-extrabold text-white text-[10px]">🚕 Cab</div>
            <div className="text-[9px] text-indigo-200">{t.cabCost.toLocaleString()} g₦ • {t.cabSecs}s</div>
          </button>
          {carsOwned.length > 0 && (
            <button
              onClick={() => triggerForcedTransit(b, area, "car", isHome)}
              className="p-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-left"
            >
              <div className="font-extrabold text-white text-[10px]">🚗 Drive</div>
              <div className="text-[9px] text-emerald-100">{activeCar} • {t.cabSecs}s</div>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen pb-28 transition-colors duration-700 ${themeWrapperClass}`}>
      {/* INESCAPABLE FORCED TRANSIT POP-UP MODAL */}
      {forcedTransitPopup && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-slate-900 border-2 border-amber-400 rounded-3xl p-6 text-white shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-amber-500 text-slate-950 font-extrabold rounded-full text-xs">
                🚦 IN TRANSIT — DO NOT CLOSE
              </span>
              <span className="text-xs font-extrabold text-emerald-400">
                Distance: {forcedTransitPopup.distKm} km • {forcedTransitPopup.modeName}
              </span>
            </div>

            <div className="text-center space-y-1">
              <div className="text-lg font-extrabold text-white">
                Moving to {forcedTransitPopup.toIcon} {forcedTransitPopup.toLabel} ({forcedTransitPopup.targetArea})
              </div>
              <p className="text-xs text-slate-400">
                Departed from: <strong>{forcedTransitPopup.fromLabel}</strong>
              </p>
            </div>

            {(() => {
              const pct = Math.min(
                100,
                Math.round(
                  ((forcedTransitPopup.totalSecs - forcedTransitPopup.remainingSecs) /
                    forcedTransitPopup.totalSecs) *
                    100
                )
              );
              return (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span>📍 Origin</span>
                    <span className="text-amber-400 font-extrabold">
                      ⏳ Arriving in {forcedTransitPopup.remainingSecs}s ({pct}%)
                    </span>
                    <span className="text-emerald-400">🎯 {forcedTransitPopup.toIcon} Destination</span>
                  </div>

                  <div className="relative pt-5 pb-2">
                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div
                      className="absolute -top-2 text-2xl transition-all duration-700"
                      style={{ left: `calc(${Math.min(92, pct)}% - 12px)` }}
                    >
                      {forcedTransitPopup.modeIcon}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

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
                    🛡️ Shield: {hospitalShieldHoursLeft}h
                  </span>
                )}
                <span
                  className={`text-[11px] px-2.5 py-0.5 font-extrabold rounded-full ${
                    hospitalLoanDebt > 0 ? "bg-red-600 text-white animate-pulse" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  🚨 Debt: {hospitalLoanDebt.toLocaleString()} c₦
                </span>
                {phoneOwned !== "None" && (
                  <button
                    onClick={() => setShowPhoneModal(true)}
                    className="px-2 py-0.5 bg-cyan-500 text-slate-950 font-extrabold rounded-full text-[10px] flex items-center gap-1"
                  >
                    <Smartphone className="w-3 h-3" /> Open {phoneOwned.replace("_", " ")}
                  </button>
                )}
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
        {/* PERSISTENT CONTEXT-AWARE LOW-STAT WARNING BANNER */}
        {advisoryBanner && (
          <div className="bg-red-600 text-white px-4 py-2.5 rounded-2xl font-extrabold text-xs shadow-lg animate-pulse">
            {advisoryBanner}
          </div>
        )}

        {/* METERS BAR */}
        <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-3 space-y-2 shadow-md">
          <div className={`grid grid-cols-2 ${carsOwned.length > 0 ? "sm:grid-cols-7" : "sm:grid-cols-4"} gap-2`}>
            <StatBar icon={<Heart className="w-3.5 h-3.5 text-rose-400" />} label="Health" value={`${health}%`} pct={health} color="bg-rose-500" onHelp={() => setActiveGuideTip("❤️ HEALTH: Restored at the Area Hospital (Oshodi 25k/60k Debt vs Lekki 160k/380k Debt).")} />
            <StatBar icon={<Zap className="w-3.5 h-3.5 text-amber-400" />} label={`Energy (Cap ${maxEnergyCap}%)`} value={`${energy}%`} pct={energy} color="bg-amber-500" onHelp={() => setActiveGuideTip("⚡ ENERGY: Travel to My Home on the Map to sleep in your Bedroom!")} />
            <StatBar icon={<Utensils className="w-3.5 h-3.5 text-orange-400" />} label="Belly/Diet" value={`${hunger}%`} pct={hunger} color="bg-orange-500" onHelp={() => setActiveGuideTip("🍛 BELLY/DIET: Cook with 0.4kg Gas in your Kitchen at Home or travel to a Public Eatery.")} />
            <StatBar icon={<Sparkles className="w-3.5 h-3.5 text-cyan-400" />} label="Steeze / Pts" value={`${steeze} • 🌟${citizenPoints}`} pct={Math.min(100, steeze)} color="bg-cyan-500" />
            {carsOwned.length > 0 && (
              <>
                <StatBar icon={<Fuel className="w-3.5 h-3.5 text-emerald-400" />} label="Petrol" value={`${carPetrol}%`} pct={carPetrol} color="bg-emerald-500" />
                <StatBar icon={<Droplets className="w-3.5 h-3.5 text-cyan-400" />} label="Radiator" value={`${carRadiatorWater}%`} pct={carRadiatorWater} color="bg-cyan-500" />
                <StatBar icon={<Wrench className="w-3.5 h-3.5 text-purple-400" />} label="Engine" value={`${carEngineHealth}%`} pct={carEngineHealth} color="bg-purple-500" />
              </>
            )}
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-[11px] text-amber-300 flex justify-between">
            <span>{activeGuideTip}</span>
            {hasHiredMaid && (
              <span className="text-emerald-400 font-bold shrink-0 ml-2">
                👩🏾‍🍳 Maid Auto-Meal: {formatSecs(maidTimerSecs)} (Food: {maidWeeklyFoodLeft})
              </span>
            )}
          </div>
        </div>

        {/* EVENT LOG */}
        <div className="bg-slate-900 text-emerald-300 border border-emerald-700/60 px-4 py-2 rounded-xl text-xs font-bold shadow">
          🔔 {logMessage}
        </div>

        {/* =====================================================================
            TAB 1: 🗺️ TOWN MAP & ALL 18 STANDALONE BUILDING INTERFACES
           ===================================================================== */}
        {activeTab === "map" && (
          <div className="space-y-4 text-xs">
            <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-extrabold text-base text-emerald-400">
                  {currentBuildingId !== "Street_Map"
                    ? `🚪 Standalone Building Interface: ${exactPosition}`
                    : isMapZoomedOut
                    ? "🗺️ Lagos State Satellite Map (5 Areas)"
                    : `🏙️ ${area} Illustrated Street Map (Click Any Building to Travel)`}
                </h2>
                <p className="text-slate-400 text-[11px]">
                  {currentBuildingId !== "Street_Map"
                    ? "You are currently inside this building's standalone interface. Click 'Step Back Outside' to return to the street map!"
                    : "Click any architectural building below to open its transport options inside its card."}
                </p>
              </div>
              <div className="flex gap-2">
                {currentBuildingId !== "Street_Map" && (
                  <button
                    onClick={() => {
                      setCurrentBuildingId("Street_Map");
                      setExactPosition(`🚶🏾‍♂️ Standing on ${area} Street`);
                    }}
                    className="px-4 py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-xl flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" /> 🚪 Step Back Outside to {area} Street Map
                  </button>
                )}
                <button
                  onClick={() => {
                    setCurrentBuildingId("Street_Map");
                    setIsMapZoomedOut(!isMapZoomedOut);
                  }}
                  className="px-4 py-2 bg-amber-500 text-slate-950 font-extrabold rounded-xl flex items-center gap-1.5"
                >
                  {isMapZoomedOut ? <ZoomIn className="w-4 h-4" /> : <ZoomOut className="w-4 h-4" />}
                  {isMapZoomedOut ? `Return to ${area} Street` : "Zoom Out: Switch Lagos Area"}
                </button>
              </div>
            </div>

            {/* VIEW 1: ZOOMED-OUT INTER-AREA MAP */}
            {isMapZoomedOut ? (
              <div className="grid sm:grid-cols-5 gap-3 bg-slate-900 text-white border-2 border-emerald-700 p-4 rounded-2xl">
                {(["Berger", "Oshodi", "Yaba", "Surulere", "Lekki"] as AreaName[]).map((dest) => {
                  const isCurrent = area === dest;
                  const distUnits = Math.abs(AREA_COORDS[area] - AREA_COORDS[dest]) || 1;
                  const distKm = distUnits * 6.5;
                  const busFare = distUnits * 1500;
                  const cabFare = distUnits * 3500;

                  const dummyAreaTarget: MapBuilding = {
                    id: "Street_Map",
                    roofStyle: "bg-emerald-600",
                    icon: "🏙️",
                    name: `${dest} Town Street`,
                    sub: "",
                    distKm,
                  };

                  return (
                    <div key={dest} className={`p-4 rounded-2xl border-2 flex flex-col justify-between space-y-3 ${isCurrent ? "bg-emerald-950/60 border-emerald-400" : "bg-slate-950 border-slate-800"}`}>
                      <div>
                        <div className="text-3xl mb-1">🏙️🌳</div>
                        <div className="font-extrabold text-base text-white">📍 {dest}</div>
                        <div className="text-[10px] text-slate-400">
                          {isCurrent ? "✓ You are in this Area" : `Highway Distance: ${distKm} km`}
                        </div>
                        <div className="text-[10px] text-rose-400 mt-1">
                          Hospital Debt Tier: {HOSPITAL_AREA_RATES[dest].emergencyLoanDebt.toLocaleString()} c₦
                        </div>
                      </div>

                      {isCurrent ? (
                        <button onClick={() => setIsMapZoomedOut(false)} className="w-full py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-xl">
                          Explore {dest}
                        </button>
                      ) : (
                        <div className="space-y-1.5 pt-2 border-t border-slate-800">
                          <button
                            onClick={() => triggerForcedTransit(dummyAreaTarget, dest, "bus", false, distKm, busFare, cabFare)}
                            className="w-full py-1.5 bg-amber-500 text-slate-950 font-extrabold rounded-lg text-[10px]"
                          >
                            🚐 Inter-Area Bus ({busFare.toLocaleString()} g₦)
                          </button>
                          <button
                            onClick={() => triggerForcedTransit(dummyAreaTarget, dest, "cab", false, distKm, busFare, cabFare)}
                            className="w-full py-1.5 bg-indigo-600 text-white font-bold rounded-lg text-[10px]"
                          >
                            🚕 Inter-Area Cab ({cabFare.toLocaleString()} g₦)
                          </button>
                          {carsOwned.length > 0 && (
                            <button
                              onClick={() => triggerForcedTransit(dummyAreaTarget, dest, "car", false, distKm, busFare, cabFare)}
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
            ) : currentBuildingId === "Street_Map" ? (
              /* VIEW 2: ILLUSTRATED ARCHITECTURAL BUILDINGS ON THE STREET MAP */
              <div className="rounded-3xl border-4 border-emerald-800 bg-gradient-to-b from-slate-900 via-emerald-950/30 to-slate-900 text-white p-5 space-y-5 shadow-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {/* 1. MY HOME ARCHITECTURAL HOUSE */}
                  {shelterArea === area && (() => {
                    const homeB: MapBuilding = {
                      id: "My_Home",
                      roofStyle: "bg-emerald-500",
                      icon: "🏠",
                      name: `My Home (${shelterType})`,
                      sub: "Sitting Room, Bedroom, Kitchen & Bath",
                      distKm: 1.4,
                    };
                    const showTicket = clickedCardForTicket === "My_Home";
                    return (
                      <div
                        onClick={() => setClickedCardForTicket(showTicket ? "None" : "My_Home")}
                        className="cursor-pointer bg-slate-950 border-2 border-emerald-500/80 rounded-2xl overflow-hidden shadow-xl hover:scale-[1.01] transition flex flex-col justify-between"
                      >
                        <div className="w-full h-7 bg-emerald-500 flex items-center justify-between px-3 text-[10px] font-extrabold text-slate-950 uppercase">
                          <span>🏡 RESIDENTIAL ROOF</span>
                          <span>1.4 km</span>
                        </div>
                        <div className="p-4 text-center space-y-1.5">
                          <div className="flex justify-center items-center gap-3">
                            <span className="w-5 h-5 bg-amber-300/30 border border-amber-300 rounded-sm" />
                            <span className="text-4xl">🏠</span>
                            <span className="w-5 h-5 bg-amber-300/30 border border-amber-300 rounded-sm" />
                          </div>
                          <div className="font-extrabold text-sm text-white">{homeB.name}</div>
                          <div className="text-[11px] text-slate-400">{homeB.sub}</div>
                          {!showTicket && (
                            <div className="inline-block mt-1 px-3 py-1 bg-emerald-500/20 border border-emerald-400 rounded-lg text-[10px] font-extrabold text-emerald-300">
                              🚪 Click Building to Travel Home
                            </div>
                          )}
                          {showTicket && renderInCardTicketSelector(homeB, true)}
                        </div>
                      </div>
                    );
                  })()}

                  {/* 2. LIVE CONSTRUCTION SITES IN THIS AREA */}
                  {activeConstructionSites
                    .filter((s) => s.area === area)
                    .map((site) => {
                      const siteB: MapBuilding = {
                        id: site.id,
                        roofStyle: "bg-amber-500",
                        icon: "🧱",
                        name: site.projectName,
                        sub: `Bricklayers: ${site.currentBricklayers}/${site.maxBricklayers} • Pay: +${site.payPerShiftCn.toLocaleString()} c₦`,
                        distKm: 1.8,
                      };
                      const showTicket = clickedCardForTicket === site.id;
                      return (
                        <div
                          key={site.id}
                          onClick={() => setClickedCardForTicket(showTicket ? "None" : site.id)}
                          className="cursor-pointer bg-slate-950 border-2 border-amber-500/80 rounded-2xl overflow-hidden shadow-xl hover:scale-[1.01] transition flex flex-col justify-between"
                        >
                          <div className="w-full h-7 bg-amber-500 flex items-center justify-between px-3 text-[10px] font-extrabold text-slate-950 uppercase">
                            <span>🏗️ ACTIVE CONSTRUCTION SITE</span>
                            <span>1.8 km</span>
                          </div>
                          <div className="p-4 text-center space-y-1.5">
                            <div className="text-4xl">🧱🏗️</div>
                            <div className="font-extrabold text-sm text-amber-300">{siteB.name}</div>
                            <div className="text-[11px] text-slate-300">{siteB.sub}</div>
                            {!showTicket && (
                              <div className="inline-block mt-1 px-3 py-1 bg-amber-500/20 border border-amber-400 rounded-lg text-[10px] font-extrabold text-amber-300">
                                🚪 Click Site to Travel &amp; Work
                              </div>
                            )}
                            {showTicket && renderInCardTicketSelector(siteB, false)}
                          </div>
                        </div>
                      );
                    })}

                  {/* 3. ARCHITECTURAL BUILDINGS IN THIS AREA */}
                  {subMapBuildings[area].map((b) => {
                    const showTicket = clickedCardForTicket === b.id;
                    return (
                      <div
                        key={b.id}
                        onClick={() => setClickedCardForTicket(showTicket ? "None" : b.id)}
                        className="cursor-pointer bg-slate-950 border-2 border-slate-700 hover:border-amber-400 rounded-2xl overflow-hidden shadow-xl transition flex flex-col justify-between"
                      >
                        <div className={`w-full h-7 ${b.roofStyle} flex items-center justify-between px-3 text-[10px] font-extrabold text-white uppercase`}>
                          <span>🏢 {area} BUILDING</span>
                          <span>{b.distKm} km</span>
                        </div>
                        <div className="p-4 text-center space-y-1.5">
                          <div className="flex justify-center items-center gap-3">
                            <span className="w-4 h-4 bg-sky-400/20 border border-sky-400/50 rounded-sm" />
                            <span className="text-4xl">{b.icon}</span>
                            <span className="w-4 h-4 bg-sky-400/20 border border-sky-400/50 rounded-sm" />
                          </div>
                          <div className="font-extrabold text-sm text-white">{b.name}</div>
                          <div className="text-[11px] text-slate-400">{b.sub}</div>
                          {!showTicket && (
                            <div className="inline-block mt-1 px-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-[10px] font-bold text-emerald-300">
                              🚪 Click Building ({b.distKm} km)
                            </div>
                          )}
                          {showTicket && renderInCardTicketSelector(b, false)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* ===============================================================
                  VIEW 3: ALL 18 STANDALONE BUILDING INTERFACES (100% COMPLETE!)
                 =============================================================== */
              <div className="bg-slate-900 text-white border-2 border-emerald-500 rounded-3xl p-6 shadow-2xl space-y-5">
                {/* 1. MY HOME (4 ZONES: SITTING ROOM, BEDROOM, KITCHEN & BATHROOM) */}
                {currentBuildingId === "My_Home" && (
                  <div className="space-y-5">
                    <div className={`p-5 rounded-2xl border-2 space-y-4 ${wallBgMap[wallColor]}`}>
                      <div className="flex flex-wrap justify-between items-center gap-2">
                        <div>
                          <h3 className="font-extrabold text-lg text-emerald-300">
                            🏠 Inside My Home: {shelterType} ({shelterArea})
                          </h3>
                          <p className="text-xs text-amber-200">
                            🧱 Wall Paint: <strong>{wallColor}</strong> • Ownership: <strong>{ownershipMode}</strong> • Parking: <strong>{carsOwned.length}/{parkingSlots} Cars</strong>
                          </p>
                        </div>
                        {ownershipMode === "Rented" && (
                          <button
                            onClick={() => {
                              if (spendMoney(rentPer8Weeks)) {
                                setWeeksUntilRentDue(8);
                                setLogMessage("🏠 Paid 8-Week Rent!");
                              }
                            }}
                            className="px-4 py-2 bg-rose-600 text-white font-extrabold rounded-xl"
                          >
                            Pay 8-Week Rent ({rentPer8Weeks.toLocaleString()} g₦ • {weeksUntilRentDue} Wks Left)
                          </button>
                        )}
                      </div>

                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                        <div className="bg-black/60 border border-white/15 rounded-2xl p-4 space-y-2">
                          <div className="font-extrabold text-amber-300 flex items-center gap-1.5">
                            <Armchair className="w-4 h-4" /> 1. Sitting Room
                          </div>
                          <div className="text-[11px] text-slate-300">Seating: <strong>{chairTier.replace("_", " ")}</strong></div>
                          <div className="text-[11px] text-slate-300">Wall TV: <strong>{tvTier}</strong></div>
                          {tvTier !== "None" && (
                            <button
                              onClick={() => {
                                if (!hasLagosFlix) return setLogMessage("⚠️ Subscribe to LagosFlix below first!");
                                setShowTvModal(true);
                                setEnergy((e) => Math.min(maxEnergyCap, e + 15));
                              }}
                              className="w-full py-1.5 bg-rose-600 text-white font-bold rounded-lg flex items-center justify-center gap-1"
                            >
                              <Play className="w-3 h-3" /> Watch LagosFlix
                            </button>
                          )}
                        </div>

                        <div className="bg-black/60 border border-white/15 rounded-2xl p-4 space-y-2">
                          <div className="font-extrabold text-indigo-300 flex items-center gap-1.5">
                            <BedDouble className="w-4 h-4" /> 2. Bedroom Corner
                          </div>
                          <div className="text-[11px] text-slate-300">Bed: <strong>{bedTier.replace("_", " ")}</strong> (Cap: {maxEnergyCap}%)</div>
                          <button
                            onClick={() => {
                              setEnergy(maxEnergyCap);
                              setGameDay((d) => d + 1);
                              setDailyGnBoughtToday(0);
                              setLogMessage(`🛌 Slept in your Bedroom! Energy restored to ${maxEnergyCap}%.`);
                            }}
                            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl"
                          >
                            🛌 Sleep Overnight ({maxEnergyCap}%)
                          </button>
                        </div>

                        <div className="bg-black/60 border border-white/15 rounded-2xl p-4 space-y-2">
                          <div className="font-extrabold text-emerald-300 flex items-center gap-1.5">
                            <Flame className="w-4 h-4" /> 3. {shelterType.includes("Single Room") ? "Shared Kitchen" : "Private Kitchen"}
                          </div>
                          <div className="text-[11px] text-slate-300">
                            Stove: <strong>{hasCookingStove ? "Active" : "None"}</strong> • Gas: <strong>{gasKg} kg</strong> • Food: <strong>{rawFoodServings} Meals</strong>
                          </div>
                          <button
                            onClick={() => {
                              if (!hasCookingStove || gasKg < 0.4 || rawFoodServings < 1) {
                                return setLogMessage("❌ Need Gas Stove, >=0.4kg Gas & 1 Raw Food (Buy at Oshodi Market)!");
                              }
                              setGasKg((g) => Number(Math.max(0, g - 0.4).toFixed(1)));
                              setRawFoodServings((r) => r - 1);
                              setHunger(100);
                              setEnergy(maxEnergyCap);
                              setHealth((h) => Math.min(100, h + 15));
                              setLogMessage("🍳 Cooked a fresh meal in your kitchen (-0.4kg Gas)!");
                            }}
                            className="w-full py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-xl"
                          >
                            🍳 Cook Meal (-0.4kg Gas)
                          </button>
                        </div>

                        <div className="bg-black/60 border border-white/15 rounded-2xl p-4 space-y-2">
                          <div className="font-extrabold text-cyan-300 flex items-center gap-1.5">
                            <Bath className="w-4 h-4" /> 4. {shelterType.includes("Single Room") ? "Shared Bathroom" : "En-Suite Bathroom"}
                          </div>
                          <div className="text-[11px] text-slate-300">Freshen up before corporate work or dates!</div>
                          <button
                            onClick={() => {
                              setSteeze((s) => s + 5);
                              setHealth((h) => Math.min(100, h + 5));
                              setLogMessage("🚿 Took a refreshing bath! +5 Steeze & +5% Health.");
                            }}
                            className="w-full py-2 bg-cyan-600 text-white font-extrabold rounded-xl"
                          >
                            🚿 Take Shower (+5 Steeze)
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                      <div className="space-y-1.5">
                        <div className="font-bold text-slate-400 uppercase">Paint Walls</div>
                        <div className="grid grid-cols-3 gap-1.5">
                          {(["Cream", "Emerald", "RoyalBlue"] as const).map((col) => (
                            <button key={col} onClick={() => { if (spendMoney(25000)) { setWallColor(col); setSteeze((s) => s + 15); }}} className="p-2 bg-slate-900 border border-slate-700 rounded-lg font-bold">{col} (25k)</button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="font-bold text-slate-400 uppercase">Beds</div>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button onClick={() => { if (spendMoney(30000)) { setBedTier("Foam_Mattress"); setEnergy(85); }}} className="p-2 bg-slate-900 border border-slate-700 rounded-lg font-bold">🛏️ Foam (30k)</button>
                          <button onClick={() => { if (spendMoney(95000)) { setBedTier("King_Bed"); setEnergy(100); }}} className="p-2 bg-slate-900 border border-slate-700 rounded-lg font-bold">👑 King Bed (95k)</button>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="font-bold text-slate-400 uppercase">Sofa, TV &amp; LagosFlix</div>
                        <div className="grid grid-cols-3 gap-1.5">
                          <button onClick={() => { if (spendMoney(55000)) setChairTier("Cushion_Sofa"); }} className="p-2 bg-slate-900 border border-slate-700 rounded-lg font-bold">🛋️ Sofa (55k)</button>
                          <button onClick={() => { if (spendMoney(175000)) setTvTier("55-Inch Smart TV"); }} className="p-2 bg-slate-900 border border-slate-700 rounded-lg font-bold">📺 TV (175k)</button>
                          <button onClick={() => { if (spendMoney(12500)) setHasLagosFlix(true); }} className="p-2 bg-rose-950 border border-rose-700 rounded-lg font-bold">🍿 Flix (12.5k)</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. ACTIVE CONSTRUCTION SITES (STRICT WORKER VS OWNER SEPARATION!) */}
                {activeConstructionSites.map((site) => {
                  if (currentBuildingId !== site.id) return null;
                  const isPlayerOwner = site.ownerName.trim().toLowerCase() === username.trim().toLowerCase();
                  return (
                    <div key={site.id} className="space-y-4">
                      <h3 className="font-extrabold text-base text-amber-400">🧱🏗️ Inside Active Construction Site: {site.projectName} ({site.area})</h3>
                      <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
                        <div>Project Owner: <strong>{site.ownerName}</strong> • Time Remaining: <strong>{formatSecs(site.timeRemainingSecs)}</strong></div>
                        <div>Bricklayers Worked: <strong className="text-emerald-400">{site.currentBricklayers} / {site.maxBricklayers} (Minimum {site.minBricklayers} Required)</strong></div>
                      </div>
                      {!isPlayerOwner ? (
                        <button
                          disabled={site.playerWorkedHere || site.currentBricklayers >= site.maxBricklayers}
                          onClick={() => {
                            if (energy < 40) return setLogMessage("⚠️ Need 40% Energy for a full-day Bricklayer shift!");
                            setEnergy((en) => Math.max(5, en - 40));
                            setGameHour((h) => (h + 6) % 24);
                            const up = [...activeConstructionSites];
                            const idx = up.findIndex((x) => x.id === site.id);
                            if (idx > -1) {
                              up[idx].currentBricklayers += 1;
                              up[idx].playerWorkedHere = true;
                              up[idx].timeRemainingSecs = Math.max(0, up[idx].timeRemainingSecs - 1800);
                              setActiveConstructionSites(up);
                            }
                            receiveEarnedMoney(site.payPerShiftCn, `Bricklayer Shift at ${site.projectName}`);
                          }}
                          className="w-full py-3 bg-amber-500 text-slate-950 font-extrabold rounded-xl disabled:opacity-40"
                        >
                          {site.playerWorkedHere ? "✓ You Already Worked Your 1 Shift on This Project" : `🧱 Work Full-Day Bricklayer Shift (+${site.payPerShiftCn.toLocaleString()} c₦)`}
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (spendMoney(150000)) {
                              const up = [...activeConstructionSites];
                              const idx = up.findIndex((x) => x.id === site.id);
                              if (idx > -1) {
                                up[idx].currentBricklayers = up[idx].maxBricklayers;
                                up[idx].timeRemainingSecs = 0;
                                setActiveConstructionSites(up);
                              }
                              setLogMessage("👷🏾‍♂️ Hired NPC Backup Team for your project!");
                            }
                          }}
                          className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-xl"
                        >
                          👑 Owner Option: Recruit Backup NPC Bricklayers (150,000 g₦)
                        </button>
                      )}
                    </div>
                  );
                })}

                {/* 3. VACANCY STAND */}
                {currentBuildingId === "Vacancy_Stand" && (
                  <div className="space-y-3">
                    <h3 className="font-extrabold text-base text-emerald-400">📋 Street Vacancy &amp; Notice Stand (Directions Only)</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {activeConstructionSites.map((s) => (
                        <div key={s.id} className="p-3 bg-slate-950 border border-amber-500/50 rounded-xl space-y-1">
                          <div className="font-bold text-amber-300">🧱 {s.projectName} ({s.area})</div>
                          <div>Pay: +{s.payPerShiftCn.toLocaleString()} c₦ • Slots: {s.currentBricklayers}/{s.maxBricklayers}</div>
                          <div className="text-emerald-400">👉 Step back outside to the Map and travel to {s.area} -&gt; {s.projectName}!</div>
                        </div>
                      ))}
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                        <div className="font-bold text-rose-300">👩🏾‍🍳 Surulere Domestic Maid Staffing Agency ({agencyMaidVacanciesCount} Open)</div>
                        <div className="text-emerald-400">👉 Commute to Surulere and enter the Domestic Maid Agency!</div>
                      </div>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                        <div className="font-bold text-cyan-300">🏥 Hospital Nurse (+160k c₦) &amp; Doctor (+480k c₦)</div>
                        <div className="text-emerald-400">👉 Enter the General Hospital in your Area!</div>
                      </div>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                        <div className="font-bold text-indigo-300">🏢 Corporate, Specialist &amp; Social Gigs</div>
                        <div className="text-emerald-400">👉 Travel to Yaba or Lekki Corporate Towers on the Map!</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. PUBLIC EATERY */}
                {currentBuildingId === "Public_Eatery" && (
                  <div className="space-y-3">
                    <h3 className="font-extrabold text-base text-amber-400">🍛 Inside {area} Public Eatery &amp; Bukka</h3>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {[
                        { name: "🍞 Agege Bread & Beans", cost: 2000, belly: 35, en: 20, hp: 5 },
                        { name: "🍛 Party Jollof & Plantain", cost: 4500, belly: 50, en: 35, hp: 15 },
                        { name: "🍲 Amala & Ewedu", cost: 6000, belly: 65, en: 45, hp: 20 },
                        { name: "🥣 Pounded Yam & Egusi", cost: 8500, belly: 80, en: 55, hp: 25 },
                        { name: "🐟 Catfish Pepper Soup", cost: 11000, belly: 75, en: 60, hp: 35 },
                        { name: "🍗 Mixed Grill & Salad", cost: 18000, belly: 100, en: 85, hp: 50 },
                      ].map((m, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            if (spendMoney(m.cost)) {
                              setHunger((b) => Math.min(100, b + m.belly));
                              setEnergy((e) => Math.min(maxEnergyCap, e + m.en));
                              setHealth((h) => Math.min(100, h + m.hp));
                              setLogMessage(`🍛 Ate ${m.name}!`);
                            }
                          }}
                          className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-left"
                        >
                          <div className="font-bold text-white">{m.name}</div>
                          <div className="text-emerald-400 font-bold">{m.cost.toLocaleString()} g₦ • +{m.belly}% Belly</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. MARKET & KG GAS DEPOT */}
                {currentBuildingId === "Gas_Kitchen_Shop" && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-extrabold text-base text-teal-400">🔥 Inside Oshodi Market &amp; Gas Depot (Gas: {gasKg} kg)</h3>
                      <button onClick={() => { setBargainDiscountPct(15); setLogMessage("🗣️ Bargained 15% discount!"); }} className="px-3 py-1.5 bg-amber-500 text-slate-950 font-extrabold rounded-xl">
                        {bargainDiscountPct > 0 ? `✓ -${bargainDiscountPct}% Bargain Active` : "🗣️ Bargain Price (-15%)"}
                      </button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <button disabled={hasCookingStove} onClick={() => { if (spendMoney(35000, true)) { setHasCookingStove(true); setGasKg(2.0); }}} className="w-full p-2.5 bg-slate-950 border border-orange-600 rounded-xl flex justify-between font-bold">
                          <span>{hasCookingStove ? "✓ Gas Stove Owned" : "🔥 Tabletop Gas Stove Burner"}</span><span className="text-amber-400">35,000 g₦</span>
                        </button>
                        {[
                          { label: "⛽ Refill 1.0 kg Gas", kg: 1.0, cost: 1200 },
                          { label: "⛽ Refill 3.0 kg Gas", kg: 3.0, cost: 3500 },
                          { label: "⛽ Refill 6.0 kg Gas", kg: 6.0, cost: 6800 },
                          { label: "⛽ Refill 12.5 kg Full Cylinder", kg: 12.5, cost: 13500 },
                        ].map((g, i) => (
                          <button key={i} onClick={() => { if (!hasCookingStove) return setLogMessage("❌ Buy Gas Stove first!"); if (spendMoney(g.cost, true)) setGasKg((p) => Number((p + g.kg).toFixed(1))); }} className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between font-bold">
                            <span>{g.label}</span><span className="text-amber-400">{g.cost.toLocaleString()} g₦</span>
                          </button>
                        ))}
                      </div>
                      <div className="space-y-2">
                        {[
                          { name: "🥖 Garri & Beans Pack (3 Meals)", meals: 3, cost: 4500 },
                          { name: "🍠 Pounded Yam & Egusi Pack (7 Meals)", meals: 7, cost: 12000 },
                          { name: "🍚 Ofada Rice & Assorted (10 Meals)", meals: 10, cost: 18000 },
                          { name: "🥩 25kg Jollof Rice & Beef Bag (18 Meals)", meals: 18, cost: 34000 },
                        ].map((f, i) => (
                          <button key={i} onClick={() => { if (spendMoney(f.cost, true)) setRawFoodServings((r) => r + f.meals); }} className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between font-bold">
                            <span>{f.name}</span><span className="text-emerald-400">{f.cost.toLocaleString()} g₦</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. HOSPITAL */}
                {currentBuildingId === "Hospital" && (() => {
                  const hospRate = HOSPITAL_AREA_RATES[area];
                  return (
                    <div className="space-y-4">
                      <h3 className="font-extrabold text-base text-rose-400">🏥 Inside {hospRate.name} ({area})</h3>
                      <div className="p-4 bg-rose-950/40 border border-rose-600 rounded-2xl space-y-1">
                        <div>• Cash Full Treatment: <strong>{hospRate.cashCost.toLocaleString()} g₦</strong> (100% Stats + 48h Shield)</div>
                        <div>• Emergency Credit Debt in {area}: <strong>+{hospRate.emergencyLoanDebt.toLocaleString()} c₦</strong></div>
                        <div className="text-rose-300 font-extrabold pt-1">🚨 Your Current Total Debt: {hospitalLoanDebt.toLocaleString()} c₦</div>
                      </div>
                      <div className="grid sm:grid-cols-3 gap-3">
                        <button onClick={() => { if (spendMoney(hospRate.cashCost)) { setHealth(100); setEnergy(maxEnergyCap); setHunger(100); setHospitalShieldHoursLeft(48); }}} className="py-2.5 bg-emerald-500 text-slate-950 font-extrabold rounded-xl">
                          💊 Pay Cash ({hospRate.cashCost.toLocaleString()} g₦)
                        </button>
                        <button onClick={() => { setHealth(100); setEnergy(maxEnergyCap); setHunger(100); setHospitalShieldHoursLeft(48); setHospitalLoanDebt((d) => d + hospRate.emergencyLoanDebt); }} className="py-2.5 bg-rose-600 text-white font-extrabold rounded-xl">
                          🚑 Treat on Credit (+{hospRate.emergencyLoanDebt.toLocaleString()} Debt)
                        </button>
                        <button disabled={hospitalLoanDebt <= 0} onClick={() => { if (spendMoney(hospitalLoanDebt)) setHospitalLoanDebt(0); }} className="py-2.5 bg-amber-500 text-slate-950 font-extrabold rounded-xl disabled:opacity-40">
                          💳 Pay Off Debt ({hospitalLoanDebt.toLocaleString()})
                        </button>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                        <button onClick={() => { if (!completedDegrees.some((d) => d.includes("Nursing"))) return setLogMessage("❌ Requires Nursing Degree!"); receiveEarnedMoney(160000, `Nurse Shift at ${hospRate.name}`); }} className="py-2.5 bg-cyan-600 text-white font-extrabold rounded-xl">👩🏾‍⚕️ Work as Registered Nurse (+160,000 c₦)</button>
                        <button onClick={() => { if (!completedDegrees.some((d) => d.includes("Medicine"))) return setLogMessage("❌ Requires Medicine MBBS!"); receiveEarnedMoney(480000, `Doctor Shift at ${hospRate.name}`); }} className="py-2.5 bg-indigo-600 text-white font-extrabold rounded-xl">👨🏾‍⚕️ Work as Medical Doctor (+480,000 c₦)</button>
                      </div>
                    </div>
                  );
                })()}

                {/* 7. ACADEMIC SCHOOLS & FOREIGN EMBASSY (WITH LECTURER & PROFESSOR VACANCIES!) */}
                {(currentBuildingId === "Yaba_Polytechnic" || currentBuildingId === "Unilag_University" || currentBuildingId === "Foreign_Embassy") && (
                  <div className="space-y-4">
                    <h3 className="font-extrabold text-base text-indigo-400">🎓 Academic Lecture Hall &amp; Faculty</h3>
                    {enrolledProgram ? (
                      <div className="p-4 bg-indigo-950 border border-indigo-400 rounded-2xl flex justify-between items-center">
                        <div>
                          <div className="font-extrabold text-white">{enrolledProgram.name} ({enrolledProgram.major})</div>
                          <div className="text-amber-300">Lectures: {enrolledProgram.completedClasses}/10 (-{enrolledProgram.energyPerLecture}% En)</div>
                        </div>
                        <button
                          onClick={() => {
                            if (energy < enrolledProgram.energyPerLecture) return setLogMessage(`⚠️ Need ${enrolledProgram.energyPerLecture}% Energy!`);
                            setEnergy((en) => Math.max(5, en - enrolledProgram.energyPerLecture));
                            const nextC = enrolledProgram.completedClasses + 1;
                            if (nextC >= 10) {
                              setCompletedDegrees((d) => [...d, `${enrolledProgram.name} (${enrolledProgram.major})`]);
                              setEnrolledProgram(null);
                              setLogMessage(`🎓 Graduated with ${enrolledProgram.name} (${enrolledProgram.major})!`);
                            } else {
                              setEnrolledProgram({ ...enrolledProgram, completedClasses: nextC });
                            }
                          }}
                          className="px-4 py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-xl"
                        >
                          Attend Lecture #{enrolledProgram.completedClasses + 1}/10
                        </button>
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-3 gap-3">
                        {(currentBuildingId === "Yaba_Polytechnic"
                          ? [
                              { id: "ND_N", name: "Polytechnic ND", major: "Nursing", cost: 240000, en: 40 },
                              { id: "ND_S", name: "Polytechnic ND", major: "Land Surveying", cost: 240000, en: 40 },
                              { id: "HND_T", name: "Polytechnic HND", major: "Computer Tech", cost: 380000, en: 50 },
                            ]
                          : currentBuildingId === "Unilag_University"
                          ? [
                              { id: "BSC_M", name: "University B.Sc", major: "Medicine (MBBS)", cost: 850000, en: 65 },
                              { id: "BSC_N", name: "University B.Sc", major: "Nursing Science", cost: 680000, en: 65 },
                              { id: "MSC_L", name: "Masters (M.Sc)", major: "Management", cost: 1450000, en: 80 },
                              { id: "PHD_L", name: "Doctorate (Ph.D)", major: "Research", cost: 2900000, en: 95 },
                            ]
                          : [
                              { id: "TOR", name: "Univ. of Toronto", major: "M.Sc Engineering", cost: 3200000, en: 80 },
                              { id: "OXF", name: "Oxford University", major: "M.Sc Finance", cost: 4200000, en: 85 },
                              { id: "HARV", name: "Harvard University", major: "Executive Ph.D/MBA", cost: 6500000, en: 95 },
                            ]
                        ).map((d) => (
                          <button
                            key={d.id}
                            onClick={() => {
                              if (spendMoney(d.cost)) setEnrolledProgram({ id: d.id, name: d.name, major: d.major, totalClasses: 10, completedClasses: 0, energyPerLecture: d.en, timerSeconds: 60 });
                            }}
                            className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-left"
                          >
                            <div className="font-bold text-white">{d.name} ({d.major})</div>
                            <div className="text-amber-400 font-bold">{d.cost.toLocaleString()} g₦ • -{d.en}% En</div>
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="grid sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                      <button onClick={() => { if (!completedDegrees.some((d) => d.includes("M.Sc"))) return setLogMessage("❌ Requires M.Sc!"); receiveEarnedMoney(280000, "Campus Lecturer Shift"); }} className="py-2 bg-cyan-600 text-white font-bold rounded-xl">👨🏾‍🏫 Work as Campus Lecturer (Req: M.Sc • +280k c₦)</button>
                      <button onClick={() => { if (!completedDegrees.some((d) => d.includes("Ph.D") || d.includes("Harvard"))) return setLogMessage("❌ Requires Ph.D or Harvard!"); receiveEarnedMoney(650000, "Senior Professor Shift"); }} className="py-2 bg-amber-500 text-slate-950 font-extrabold rounded-xl">🎓 Work as Senior Professor (Req: Ph.D/Harvard • +650k c₦)</button>
                    </div>
                  </div>
                )}

                {/* 8. BUSINESS BLUEPRINT SCHOOL (STEP 1) */}
                {currentBuildingId === "Business_Blueprint_School" && (
                  <div className="space-y-3">
                    <h3 className="font-extrabold text-base text-emerald-400">💼 Lagos Business &amp; Blueprint School (Step 1 Knowledge &amp; Pro Certs)</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        { id: "BP_Food_Kiosk", name: "🏪 Roadside Food Kiosk Blueprint (Step 1)", cost: 550000 },
                        { id: "BP_Small_Eatery", name: "🍲 Small Eatery Blueprint (Step 1)", cost: 1100000 },
                        { id: "BP_Mega_Rest", name: "🏢 Mega Restaurant Blueprint (Step 1)", cost: 2200000 },
                        { id: "Cert_Rice", name: "🍚🍲 Combined Master of Rice, Jollof & Soup Cert", cost: 550000 },
                        { id: "Cert_Surveyor", name: "🧭 Licensed Land Surveyor Blueprint", cost: 850000 },
                        { id: "Cert_Architect", name: "📐 Structural Architect Blueprint", cost: 1500000 },
                        { id: "ICAN", name: "📊 ICAN Chartered Accountant", cost: 950000 },
                        { id: "PMP", name: "📋 PMP Project Management Director", cost: 1100000 },
                      ].map((bp) => (
                        <button
                          key={bp.id}
                          onClick={() => {
                            if (spendMoney(bp.cost)) {
                              setOwnedBlueprints((p) => [...p, bp.id]);
                              setSpecialistCerts((s) => [...s, bp.id]);
                              setProfessionalCerts((pr) => [...pr, bp.id]);
                              setLogMessage(`📘 Certified in ${bp.name}!`);
                            }
                          }}
                          className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between font-bold"
                        >
                          <span>{bp.name}</span>
                          <span className="text-amber-400">{(bp.cost / 1000).toFixed(0)}k g₦</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 9. YABA ARCHITECTURAL STUDIO (STEP 2 PLAN STAMPING & SURVEYOR/ARCHITECT JOBS!) */}
                {currentBuildingId === "Architect_Firm" && (
                  <div className="space-y-4">
                    <h3 className="font-extrabold text-base text-cyan-400">📐 Inside Yaba Architectural &amp; Surveying Studio (Step 2: Stamp Blueprints)</h3>
                    {ownedBlueprints.length === 0 ? (
                      <p className="text-rose-400">❌ Complete Step 1 at Lagos Business &amp; Blueprint School in Surulere first!</p>
                    ) : (
                      <div className="grid sm:grid-cols-2 gap-3">
                        {ownedBlueprints.map((bp) => (
                          <button
                            key={bp}
                            disabled={architectApprovedBps.includes(bp)}
                            onClick={() => {
                              if (spendMoney(350000)) {
                                setArchitectApprovedBps((a) => [...a, bp]);
                                setLogMessage(`📐 Step 2 Complete! Architect stamped ${bp}. Next: Go to Julius Berger HQ in Berger for Step 3!`);
                              }
                            }}
                            className="p-3 bg-slate-950 border border-cyan-500 rounded-xl flex justify-between font-bold disabled:opacity-40"
                          >
                            <span>{architectApprovedBps.includes(bp) ? `✓ Stamped: ${bp}` : `Stamp Plan: ${bp}`}</span>
                            <span className="text-amber-400">350,000 g₦</span>
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="grid sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                      <button onClick={() => { if (!specialistCerts.includes("Cert_Surveyor")) return setLogMessage("❌ Requires Land Surveyor Blueprint!"); receiveEarnedMoney(240000, "Licensed Surveyor Shift"); }} className="py-2 bg-cyan-600 text-white font-bold rounded-xl">🧭 Work as Licensed Surveyor (+240,000 c₦)</button>
                      <button onClick={() => { if (!specialistCerts.includes("Cert_Architect")) return setLogMessage("❌ Requires Structural Architect Blueprint!"); receiveEarnedMoney(420000, "Principal Architect Shift"); }} className="py-2 bg-indigo-600 text-white font-bold rounded-xl">📐 Work as Structural Architect (+420,000 c₦)</button>
                    </div>
                  </div>
                )}

                {/* 10. JULIUS BERGER CONSTRUCTION & EATERY OPERATIONS HQ (STEP 3 + AUTOMATED CUSTOMER REVIEWS!) */}
                {currentBuildingId === "Builder_Yard" && (
                  <div className="space-y-4">
                    <h3 className="font-extrabold text-base text-orange-400">🏗️ Inside Julius Berger Construction &amp; Enterprise Operations HQ (Step 3)</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {architectApprovedBps.map((bp) => (
                        <button
                          key={bp}
                          onClick={() => {
                            if (spendMoney(950000)) {
                              setActiveConstructionSites((prev) => [
                                ...prev,
                                {
                                  id: `site_${Date.now()}`,
                                  projectName: `${username}'s ${bp.replace("BP_", "")}`,
                                  ownerName: username,
                                  area,
                                  type: "Food",
                                  timeRemainingSecs: 7200,
                                  minBricklayers: 2,
                                  maxBricklayers: 5,
                                  currentBricklayers: 0,
                                  playerWorkedHere: false,
                                  payPerShiftCn: 14000,
                                },
                              ]);
                              setActiveBusinesses((prev) => [
                                ...prev,
                                {
                                  name: `${username}'s ${bp.replace("BP_", "")}`,
                                  type: "Food",
                                  area,
                                  maxStaff: 6,
                                  hiredStaff: 2,
                                  maxCustomers: 45,
                                  revenuePerHalfDay: 160000,
                                  foodStockRemaining: 2,
                                  collectionsUsedThisCycle: 0,
                                  hasRiceSpecialist: false,
                                  hasSoupSpecialist: false,
                                  hasMaltSpecialist: false,
                                },
                              ]);
                              setLogMessage(`🏗️ Spawned Live Construction Site & opened ${bp} Operations Desk below!`);
                            }
                          }}
                          className="p-3 bg-orange-500 text-slate-950 font-extrabold rounded-xl flex justify-between"
                        >
                          <span>Construct &amp; Launch {bp}</span>
                          <span>950,000 g₦</span>
                        </button>
                      ))}
                    </div>

                    {/* ACTIVE EATERIES & AUTOMATED CUSTOMER REVIEWS */}
                    {activeBusinesses.map((biz, idx) => (
                      <div key={idx} className="p-4 bg-slate-950 border border-emerald-500 rounded-2xl space-y-2.5">
                        <div className="flex justify-between font-bold">
                          <span>🏪 {biz.name} (Stock: {biz.foodStockRemaining} Batches)</span>
                          <span className="text-emerald-400">Collections: {biz.collectionsUsedThisCycle}/2</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <button disabled={biz.hasRiceSpecialist} onClick={() => { if (spendMoney(60000)) { const up = [...activeBusinesses]; up[idx].hasRiceSpecialist = true; setActiveBusinesses(up); }}} className="p-1.5 bg-slate-900 border border-amber-500 rounded font-bold">{biz.hasRiceSpecialist ? "✓ Rice Chef" : "+ Rice Chef (60k)"}</button>
                          <button disabled={biz.hasSoupSpecialist} onClick={() => { if (spendMoney(60000)) { const up = [...activeBusinesses]; up[idx].hasSoupSpecialist = true; setActiveBusinesses(up); }}} className="p-1.5 bg-slate-900 border border-orange-500 rounded font-bold">{biz.hasSoupSpecialist ? "✓ Soup Chef" : "+ Soup Chef (60k)"}</button>
                          <button disabled={biz.hasMaltSpecialist} onClick={() => { if (spendMoney(50000)) { const up = [...activeBusinesses]; up[idx].hasMaltSpecialist = true; setActiveBusinesses(up); }}} className="p-1.5 bg-slate-900 border border-cyan-500 rounded font-bold">{biz.hasMaltSpecialist ? "✓ Malt Cert" : "+ Malt Cert (50k)"}</button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button onClick={() => { if (spendMoney(40000)) { const up = [...activeBusinesses]; up[idx].foodStockRemaining += 2; up[idx].collectionsUsedThisCycle = 0; setActiveBusinesses(up); }}} className="py-2 bg-amber-500 text-slate-950 font-extrabold rounded-lg">🍲 Restock Food (40k)</button>
                          <button
                            disabled={biz.foodStockRemaining <= 0 || biz.collectionsUsedThisCycle >= 2}
                            onClick={() => {
                              const certs = (biz.hasRiceSpecialist ? 1 : 0) + (biz.hasSoupSpecialist ? 1 : 0) + (biz.hasMaltSpecialist ? 1 : 0);
                              const payout = Math.round(biz.revenuePerHalfDay * (0.6 + certs * 0.35));
                              const up = [...activeBusinesses];
                              up[idx].foodStockRemaining -= 1;
                              up[idx].collectionsUsedThisCycle += 1;
                              setActiveBusinesses(up);
                              setAutomatedReviews((r) => [
                                {
                                  customer: `@foodie_${Math.floor(Math.random() * 900)}`,
                                  bizName: biz.name,
                                  comment: certs === 3 ? "⭐⭐⭐⭐⭐ Best certified Jollof, Soup & chilled Malt in Lagos!" : "⭐⭐⭐ Good meal, hire more certified specialists!",
                                  healthBonus: certs * 15,
                                  pointsBonus: certs * 8,
                                  stars: `${certs}/3 Certified`,
                                },
                                ...r,
                              ]);
                              receiveEarnedMoney(payout, biz.name);
                            }}
                            className="py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-lg disabled:opacity-40"
                          >
                            💰 Collect Revenue ({biz.collectionsUsedThisCycle}/2)
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 11. MECHANIC & FILLING STATION INTERFACES */}
                {(currentBuildingId === "Mechanic_Shop" || currentBuildingId === "Filling_Station") && (
                  <div className="space-y-3">
                    <h3 className="font-extrabold text-base text-purple-400">⛽🔧 Vehicle Fuel, Radiator Water &amp; Engine Service</h3>
                    <div className="grid sm:grid-cols-3 gap-3">
                      <button onClick={() => { if (spendMoney(18000)) { setCarPetrol(100); setLogMessage("⛽ Petrol Tank Filled to 100%!"); }}} className="p-3 bg-emerald-500 text-slate-950 font-extrabold rounded-xl">⛽ Fill Full Petrol Tank (18,000 g₦)</button>
                      <button onClick={() => { if (spendMoney(3000)) { setCarRadiatorWater(100); setLogMessage("💧 Radiator Water Filled to 100%!"); }}} className="p-3 bg-cyan-500 text-slate-950 font-extrabold rounded-xl">💧 Fill Radiator Water (3,000 g₦)</button>
                      <button onClick={() => { if (spendMoney(35000)) { setCarEngineHealth(100); setLogMessage("🔧 Engine Overhauled to 100% Health!"); }}} className="p-3 bg-purple-600 text-white font-extrabold rounded-xl">🔧 Full Engine Overhaul (35,000 g₦)</button>
                    </div>
                  </div>
                )}

                {/* 12. FITNESS GYM INTERFACE */}
                {currentBuildingId === "Gym" && (
                  <div className="space-y-3">
                    <h3 className="font-extrabold text-base text-orange-400">🏋🏾‍♂️ Inside {area} Fitness Gym (Active Plan: {gymPlan})</h3>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {[
                        { id: "1_Hour_Pass", name: "⏱️ 1-Hour Workout Pass", cost: 5000 },
                        { id: "Weekly_Plan", name: "📅 Weekly Gym Membership", cost: 25000 },
                        { id: "Monthly_VIP", name: "👑 Monthly VIP Body & Spa Plan", cost: 80000 },
                      ].map((g) => (
                        <button
                          key={g.id}
                          onClick={() => {
                            if (spendMoney(g.cost)) {
                              setGymPlan(g.id as any);
                              setHealth(100);
                              setWeight((w) => Number(Math.max(54, w - 0.8).toFixed(1)));
                              setSteeze((s) => s + 15);
                              setLogMessage(`🏋🏾‍♂️ Completed workout under ${g.name}! Health 100%, -0.8kg weight, +15 Steeze.`);
                            }
                          }}
                          className="p-3 bg-slate-950 border border-orange-500 rounded-xl text-left"
                        >
                          <div className="font-bold text-white">{g.name}</div>
                          <div className="text-amber-400 font-bold">{g.cost.toLocaleString()} g₦</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 13. FURNITURE & ELECTRONICS SHOPS (BUY SMARTPHONES, TVS, BEDS & SOFAS!) */}
                {(currentBuildingId === "Furniture_Shop" || currentBuildingId === "Electronics_Shop") && (
                  <div className="space-y-3">
                    <h3 className="font-extrabold text-base text-purple-400">📱📺🛏️ Inside Showroom (Phones, 4 TV Tiers, Beds &amp; Sofas)</h3>
                    <div className="grid sm:grid-cols-3 gap-3">
                      <button onClick={() => { if (spendMoney(25000)) { setPhoneOwned("Torchlight_Phone"); setLogMessage("📲 Bought Torchlight Phone!"); }}} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-left">
                        <div className="font-bold text-white">📲 Nokia Torchlight Phone</div>
                        <div className="text-amber-400 font-bold">25,000 g₦</div>
                      </button>
                      <button onClick={() => { if (spendMoney(150000)) { setPhoneOwned("Smartphone"); setLogMessage("📱 Bought Pro Smartphone! Click 'Open Smartphone' in the top bar anytime!"); }}} className="p-3 bg-slate-950 border border-cyan-500 rounded-xl text-left">
                        <div className="font-bold text-cyan-300">📱 Lagos Pro Smartphone</div>
                        <div className="text-amber-400 font-bold">150,000 g₦ (Remote Vacancy App!)</div>
                      </button>
                      <button onClick={() => { if (spendMoney(175000)) { setTvTier("55-Inch 4K Smart TV"); setSteeze((s) => s + 25); }}} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-left">
                        <div className="font-bold text-white">📺 55-Inch 4K Smart TV</div>
                        <div className="text-amber-400 font-bold">175,000 g₦</div>
                      </button>
                      <button onClick={() => { if (spendMoney(30000)) { setBedTier("Foam_Mattress"); setEnergy(85); }}} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-left">
                        <div className="font-bold text-white">🛏️ Mouka Foam Mattress (85% Cap)</div>
                        <div className="text-amber-400 font-bold">30,000 g₦</div>
                      </button>
                      <button onClick={() => { if (spendMoney(95000)) { setBedTier("King_Bed"); setEnergy(100); }}} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-left">
                        <div className="font-bold text-white">👑 Royal King Bed (100% Cap)</div>
                        <div className="text-amber-400 font-bold">95,000 g₦</div>
                      </button>
                      <button onClick={() => { if (spendMoney(55000)) setChairTier("Cushion_Sofa"); }} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-left">
                        <div className="font-bold text-white">🛋️ L-Shaped Cushion Sofa</div>
                        <div className="text-amber-400 font-bold">55,000 g₦</div>
                      </button>
                    </div>
                  </div>
                )}

                {/* 14. PARTY SECRETARIAT & CHURCH/LOUNGE (POLITICS & 10-DATE COURTSHIP!) */}
                {currentBuildingId === "Party_Secretariat" && (
                  <div className="space-y-3">
                    <h3 className="font-extrabold text-base text-emerald-400">🏛️ Inside Party Secretariat &amp; Electoral HQ (Attendance: {partyDaysAttended}/3 Days)</h3>
                    <div className="grid sm:grid-cols-3 gap-3">
                      <button onClick={() => { if (spendMoney(30000)) { setPartyStatus("Member_JPC"); setPartyDaysAttended((d) => Math.min(3, d + 1)); setLogMessage("🟢 Joined JPC & signed Day 1 attendance!"); }}} className="p-3 bg-emerald-600 text-white font-bold rounded-xl">
                        1. Join JPC &amp; Sign Register (30k)
                      </button>
                      <button onClick={() => { if (partyStatus === "None") return setLogMessage("❌ Join Party first!"); setPartyDaysAttended((d) => Math.min(3, d + 1)); }} className="p-3 bg-indigo-600 text-white font-bold rounded-xl">
                        2. Sign Daily Attendance ({partyDaysAttended}/3 Days)
                      </button>
                      <button onClick={() => { if (partyDaysAttended < 3) return setLogMessage("❌ Need 3/3 Days Attendance first!"); if (spendMoney(450000)) setNominationStatus("Submitted_Verified"); }} className="p-3 bg-amber-500 text-slate-950 font-extrabold rounded-xl">
                        3. Buy Nomination Form (450,000 g₦)
                      </button>
                    </div>
                    <button disabled={hasVoted} onClick={() => { setHasVoted(true); receiveEarnedMoney(5000, "Voter Civic Allowance"); }} className="w-full py-2.5 bg-emerald-500 text-slate-950 font-extrabold rounded-xl">
                      {hasVoted ? "✓ Voted in Election" : "🗳️ Cast Voter Ballot (+5,000 c₦)"}
                    </button>
                  </div>
                )}

                {currentBuildingId === "Church_Lounge" && (
                  <div className="space-y-3">
                    <h3 className="font-extrabold text-base text-pink-400">🥂⛪ Inside Surulere Church &amp; Social Lounge (10-Date Courtship)</h3>
                    {maritalStatus === "Single" ? (
                      <div className="grid sm:grid-cols-3 gap-3">
                        {["Chidinma (Lekki)", "Zainab (Yaba)", "Tolu (Surulere)"].map((p) => (
                          <button key={p} onClick={() => { setPartnerName(p); setMaritalStatus("Courting"); setDatesCompleted(1); setLogMessage(`❤️ Started courting ${p} (Date 1/10)!`); }} className="p-3 bg-slate-950 border border-pink-500 rounded-xl font-bold">
                            💬 Start Courting {p} (Date 1/10)
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap justify-between items-center bg-slate-950 p-4 rounded-xl">
                        <span>💑 Partner: <strong>{partnerName}</strong> • Progress: <strong className="text-emerald-400">{datesCompleted}/10 Dates</strong></span>
                        <div className="flex gap-2">
                          <button disabled={datesCompleted >= 10} onClick={() => { if (spendMoney(25000)) setDatesCompleted((d) => d + 1); }} className="px-4 py-2 bg-rose-600 text-white font-bold rounded-xl">🍷 Go on Date #{datesCompleted + 1}/10 (25k)</button>
                          <button disabled={datesCompleted < 10 || maritalStatus === "Married"} onClick={() => { if (spendMoney(150000)) setMaritalStatus("Married"); }} className="px-4 py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-xl">💍 Registry Wedding (150k)</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 15. CORPORATE TOWERS & SOCIAL GIGS */}
                {currentBuildingId === "Corporate_Towers" && (
                  <div className="space-y-4">
                    <h3 className="font-extrabold text-base text-cyan-400">🏢 Inside Corporate Career Towers &amp; Digital Gig Hub</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        { title: "IT Support Analyst (Req: ND)", req: "Polytechnic ND", pay: 85000 },
                        { title: "Chartered Bank Auditor (Req: ICAN)", req: "ICAN", pay: 340000 },
                        { title: "Executive Project Director (Req: PMP)", req: "PMP", pay: 680000 },
                        { title: "Multinational CEO / VP (Req: Harvard/Ph.D)", req: "Harvard", pay: 1350000 },
                      ].map((j, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            const hasQual = completedDegrees.some((d) => d.includes(j.req)) || professionalCerts.includes(j.req);
                            if (!hasQual) return setLogMessage(`❌ Requires ${j.req}!`);
                            receiveEarnedMoney(j.pay, j.title);
                          }}
                          className="p-3 bg-slate-950 border border-cyan-600 rounded-xl flex justify-between font-bold"
                        >
                          <span>{j.title}</span><span className="text-emerald-400">+{j.pay.toLocaleString()} c₦</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 16. LANDS BUREAU */}
                {currentBuildingId === "Lands_Bureau" && (
                  <div className="space-y-3">
                    <h3 className="font-extrabold text-base text-amber-400">📜 Inside Lekki Lands Bureau &amp; C-of-O</h3>
                    <button onClick={() => { if (spendMoney(2500000)) { setRawLandsOwned((r) => [...r, area]); setLogMessage(`📜 Purchased Land & C-of-O in ${area}!`); }}} className="px-4 py-2.5 bg-amber-500 text-slate-950 font-extrabold rounded-xl">
                      Buy Commercial Plot &amp; C-of-O in {area} (2,500,000 g₦)
                    </button>
                  </div>
                )}

                {/* 17. DOMESTIC MAID AGENCY, DRIVING SCHOOL, DEALERSHIP & ESTATE AGENT (WITH LANDLORD FORM!) */}
                {currentBuildingId === "Domestic_Maid_Agency" && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <button onClick={() => { if (spendMoney(485000)) { setHasHiredMaid(true); setMaidWeeklyFoodLeft(14); setAgencyMaidVacanciesCount((c) => c + 1); setLogMessage("👩🏾‍🍳 Hired Live-In Maid via Agency (485k)!"); }}} className="p-4 bg-emerald-500 text-slate-950 font-extrabold rounded-2xl">
                      Homeowner: Hire Live-In Maid (485,000 g₦)
                    </button>
                    <button onClick={() => { if (!specialistCerts.includes("Cert_Rice")) return setLogMessage("❌ Requires Master Culinary Cert!"); receiveEarnedMoney(45000, "Domestic Maid Agency Shift"); }} className="p-4 bg-rose-600 text-white font-extrabold rounded-2xl">
                      Worker: Work Agency Maid Vacancy (+45,000 c₦)
                    </button>
                  </div>
                )}

                {currentBuildingId === "Driving_School" && (
                  <div className="flex flex-wrap gap-3">
                    <button disabled={drivingLessonsDone >= 3} onClick={() => { if (spendMoney(35000)) setDrivingLessonsDone((d) => d + 1); }} className="px-4 py-2.5 bg-amber-500 text-slate-950 font-extrabold rounded-xl">
                      {drivingLessonsDone >= 3 ? "✓ 3/3 Lessons Done" : `Take Driving Lesson (${drivingLessonsDone}/3) • 35,000 g₦`}
                    </button>
                    <button disabled={hasDriversLicense || drivingLessonsDone < 3} onClick={() => { if (spendMoney(75000)) setHasDriversLicense(true); }} className="px-4 py-2.5 bg-emerald-500 text-slate-950 font-extrabold rounded-xl">
                      {hasDriversLicense ? "✓ Licensed Driver" : "Obtain FRSC Driver's License (75,000 g₦)"}
                    </button>
                  </div>
                )}

                {currentBuildingId === "Auto_Dealership" && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-extrabold text-base text-emerald-400">🚗 Inside Berger Motor Fair</h3>
                      <button onClick={() => { setBargainDiscountPct(10); setLogMessage("🗣️ Bargained 10% off!"); }} className="px-3 py-1 bg-amber-500 text-slate-950 font-extrabold rounded-lg">🗣️ Bargain (-10%)</button>
                    </div>
                    <div className="grid sm:grid-cols-4 gap-3">
                      {[
                        { name: "Tokunbo Corolla", cost: 1350000 },
                        { name: "Lexus RX350", cost: 3200000 },
                        { name: "Mercedes G-Wagon", cost: 9500000 },
                        { name: "Lamborghini Urus", cost: 14000000 },
                      ].map((c, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            if (!hasDriversLicense) return setLogMessage("❌ Get your 75k Driver's License at Oshodi Driving Academy first!");
                            if (carsOwned.length >= parkingSlots) return setLogMessage("❌ Rent/Buy a Flat or Duplex with parking first!");
                            if (spendMoney(c.cost, true)) {
                              setCarsOwned((p) => [...p, c.name]);
                              setActiveCar(c.name);
                              setLogMessage(`🏎️ Bought ${c.name}!`);
                            }
                          }}
                          className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-left"
                        >
                          <div className="font-bold text-white">{c.name}</div>
                          <div className="text-emerald-400 font-bold">{(c.cost / 1000000).toFixed(2)}M g₦</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentBuildingId === "Agent_Office" && (
                  <div className="space-y-4">
                    <h3 className="font-extrabold text-base text-cyan-400">🏘️ Inside {area} Estate Agent Office (Rent, Buy, or Pay 50k Landlord Form)</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        { name: `${area} 2-Bedroom Flat (En-Suite Kitchen & Bath)`, rooms: 2, park: 2, rent: 320000, buy: 18000000 },
                        { name: `${area} 5-Bed Luxury Duplex (Private Kitchen & 5 Baths)`, rooms: 5, park: 5, rent: 1600000, buy: 60000000 },
                      ].map((p, i) => (
                        <div key={i} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                          <div className="font-bold text-white">{p.name} (🅿️ {p.park} Parking)</div>
                          <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => { if (spendMoney(p.rent)) { setShelterType(p.name); setShelterArea(area); setParkingSlots(p.park); }}} className="py-1.5 bg-cyan-600 text-white font-bold rounded">Rent ({(p.rent / 1000).toFixed(0)}k)</button>
                            <button onClick={() => { if (spendMoney(p.buy)) { setOwnedProperties((prev) => [...prev, { name: p.name, area, roomsAvailable: p.rooms, parking: p.park, paidAgentForm: false, isListedWithAgent: false, listedPricePerRoom: 250000, weeksLeftToCollect: 8 }]); setLogMessage(`🏰 Bought ${p.name}! Manage it below.`); }}} className="py-1.5 bg-amber-500 text-slate-950 font-extrabold rounded">Buy ({(p.buy / 1000000).toFixed(0)}M)</button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {ownedProperties.map((op, idx) => (
                      <div key={idx} className="p-3 bg-slate-950 border border-indigo-500 rounded-xl space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold">🏰 {op.name} ({op.roomsAvailable} Rooms)</span>
                          <button onClick={() => { setShelterType(op.name); setShelterArea(op.area); setOwnershipMode("Bought_Owned"); setParkingSlots(op.parking); }} className="px-3 py-1 bg-indigo-600 text-white font-bold rounded">🏠 Move In Yourself</button>
                        </div>
                        {!op.paidAgentForm ? (
                          <button onClick={() => { if (spendMoney(50000)) { const up = [...ownedProperties]; up[idx].paidAgentForm = true; setOwnedProperties(up); }}} className="w-full py-1.5 bg-amber-500 text-slate-950 font-extrabold rounded">Step 1: Pay Agent for Landlord Form (50,000 g₦)</button>
                        ) : !op.isListedWithAgent ? (
                          <button onClick={() => { const up = [...ownedProperties]; up[idx].isListedWithAgent = true; up[idx].weeksLeftToCollect = 8; setOwnedProperties(up); }} className="w-full py-1.5 bg-emerald-500 text-slate-950 font-extrabold rounded">Step 2: Submit Form &amp; Start 8-Week Tenant Cycle</button>
                        ) : (
                          <button disabled={op.weeksLeftToCollect > 0} onClick={() => { const net = Math.floor(op.listedPricePerRoom * op.roomsAvailable * 0.9); const up = [...ownedProperties]; up[idx].weeksLeftToCollect = 8; setOwnedProperties(up); receiveEarnedMoney(net, `8-Week Rent from ${op.name}`); }} className="w-full py-1.5 bg-emerald-500 text-slate-950 font-extrabold rounded disabled:opacity-40">
                            {op.weeksLeftToCollect > 0 ? `⏳ Wait ${op.weeksLeftToCollect} Weeks to Collect Rent` : "💰 Collect 8-Week Rent"}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* =====================================================================
            TAB 2: 🔍 INSPECT PLAYERS (HOUSE, CAR & DEBT!) & 10M DAILY CAP BANK
           ===================================================================== */}
        {activeTab === "profile" && (
          <div className="grid md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-amber-400">🏆 My Citizen Profile &amp; Debt Ledger</h2>
              <div className="p-3 bg-rose-950/40 border border-rose-600 rounded-xl space-y-1">
                <div className="font-extrabold text-rose-300">🚨 My Active Debt: {hospitalLoanDebt.toLocaleString()} c₦</div>
                {debtHistoryLog.slice(0, 3).map((d, i) => (
                  <div key={i} className="text-[10px] text-rose-200">• {d}</div>
                ))}
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                <div>🏠 <strong>House Live In:</strong> {shelterType} (Exact GPS Hidden)</div>
                <div>🚗 <strong>Car Driven:</strong> {activeCar === "None" ? "None (Public Transit)" : activeCar}</div>
                <div>🎓 <strong>Degrees:</strong> {completedDegrees.join(", ") || "Uneducated"}</div>
                <div>🏅 <strong>Certifications:</strong> {specialistCerts.join(", ") || "None"}</div>
              </div>
            </div>

            <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-cyan-400 flex items-center gap-1.5">
                <UserSearch className="w-4 h-4" /> Inspect Other Players&apos; Profiles
              </h2>
              <div className="space-y-2">
                {otherCitizensList.map((cit) => (
                  <button
                    key={cit.handle}
                    onClick={() => setInspectedCitizen(cit)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 hover:border-cyan-500 rounded-xl flex justify-between items-center text-left"
                  >
                    <div>
                      <div className="font-bold text-white">{cit.name} ({cit.handle})</div>
                      <div className="text-[10px] text-slate-400">🚗 {cit.carDriven}</div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        cit.debtAmountCn > 0 ? "bg-red-600 text-white" : "bg-emerald-950 text-emerald-300"
                      }`}
                    >
                      {cit.debtAmountCn > 0 ? `🚨 IN DEBT (-${(cit.debtAmountCn / 1000).toFixed(0)}k)` : "✓ Debt-Free"}
                    </span>
                  </button>
                ))}
              </div>

              {inspectedCitizen && (
                <div className="p-3 bg-cyan-950/30 border-2 border-cyan-500 rounded-xl space-y-1.5">
                  <div className="font-extrabold text-cyan-300 text-sm">
                    🔍 Public Dossier: {inspectedCitizen.name} ({inspectedCitizen.handle})
                  </div>
                  <div>🏠 <strong>House Type:</strong> {inspectedCitizen.houseType} <em>(Location Hidden)</em></div>
                  <div>🚗 <strong>Drives:</strong> {inspectedCitizen.carDriven}</div>
                  <div>🎓 <strong>Qualifications:</strong> {inspectedCitizen.degrees}</div>
                  <div className={inspectedCitizen.debtAmountCn > 0 ? "text-rose-400 font-extrabold" : "text-emerald-400 font-bold"}>
                    🚨 <strong>Debt Status:</strong>{" "}
                    {inspectedCitizen.debtAmountCn > 0
                      ? `OWES ${inspectedCitizen.debtAmountCn.toLocaleString()} c₦ HOSPITAL/TRANSIT DEBT!`
                      : "0 c₦ (Clean Record)"}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <h2 className="font-bold text-sm text-emerald-400">🏦 Central Bank (Max 10M g₦ / Day Limit)</h2>
              <div className="p-2.5 bg-slate-950 border border-emerald-800/60 rounded-xl space-y-1">
                <div className="text-[10px] text-slate-400">300M Genesis Reserve: <strong className="text-amber-400">{centralBankReserve.toLocaleString()} g₦</strong></div>
                <div className="text-[10px] text-cyan-300">
                  Daily Buy Limit Used Today: <strong>{dailyGnBoughtToday.toLocaleString()} / 10,000,000 g₦</strong>
                </div>
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
                    if (dailyGnBoughtToday + t.gCash > DAILY_BUY_LIMIT) {
                      return setLogMessage(`🛑 Daily Buy Limit Reached (Max 10,000,000 g₦/day)! Wait until tomorrow.`);
                    }
                    setDailyGnBoughtToday((d) => d + t.gCash);
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

              <div className="pt-2 border-t border-slate-800 space-y-1.5">
                <div className="font-bold text-cyan-300">🔄 Convert Earned c₦ -&gt; g₦ (+25% Bonus)</div>
                <div className="flex gap-1.5">
                  <input type="number" value={convertCnInput} onChange={(e) => setConvertCnInput(e.target.value)} className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white" />
                  <button
                    onClick={() => {
                      const amt = Number(convertCnInput) || 0;
                      if (amt <= 0 || earnedBalance < amt) return setLogMessage("❌ Not enough Earned c₦!");
                      const bonus = Math.round(amt * 1.25);
                      setEarnedBalance((e) => e - amt);
                      setStarterBalance((s) => s + bonus);
                      setLogMessage(`🔄 Converted ${amt.toLocaleString()} c₦ into +${bonus.toLocaleString()} g₦!`);
                    }}
                    className="px-3 py-1 bg-cyan-500 text-slate-950 font-extrabold rounded-lg"
                  >
                    Convert
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* SMARTPHONE REMOTE VACANCY MODAL */}
      {showPhoneModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white border-2 border-cyan-400 rounded-2xl max-w-lg w-full p-5 space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-sm text-cyan-400">📱 Lagos Live Vacancy App (Directions Only)</h3>
              <button onClick={() => setShowPhoneModal(false)} className="px-2.5 py-1 bg-slate-800 rounded-lg">Close Phone</button>
            </div>
            <div className="space-y-2">
              {activeConstructionSites.map((s) => (
                <div key={s.id} className="p-2.5 bg-slate-950 border border-amber-500 rounded-xl">
                  <div className="font-bold text-amber-300">🧱 {s.projectName} ({s.area})</div>
                  <div>Needs Bricklayers ({s.currentBricklayers}/{s.maxBricklayers}) • Pay: +{s.payPerShiftCn.toLocaleString()} c₦</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* LAGOSFLIX YOUTUBE MODAL */}
      {showTvModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-rose-400 text-sm">📺 LagosFlix Smart TV (Sitting Room)</h3>
              <button onClick={() => setShowTvModal(false)} className="text-xs bg-slate-800 px-3 py-1 rounded-lg text-white">Close TV</button>
            </div>
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
              <iframe className="w-full h-full" src="https://www.youtube.com/embed/jfKfPfyJRdk" title="LagosFlix" allowFullScreen />
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 inset-x-0 bg-slate-900/95 backdrop-blur border-t border-slate-800 px-2 py-2 z-40">
        <div className="max-w-md mx-auto grid grid-cols-2 gap-2">
          {([
            { id: "map", label: "🗺️ Town Map & All 18 Building Interfaces", icon: <Map className="w-4 h-4" /> },
            { id: "profile", label: "🔍 Inspect Players, Debt & 10M Bank", icon: <Award className="w-4 h-4" /> },
          ] as const).map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
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