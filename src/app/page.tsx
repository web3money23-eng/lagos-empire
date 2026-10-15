"use client";

import React, { useState, useEffect } from "react";
import { 
  Heart, Zap, Utensils, Sparkles, Tv, Home, Map,
  Briefcase, GraduationCap, Lock, Building2, 
  Clock, Award, Wrench, Fuel, Droplets, ZoomOut, ZoomIn, 
  Send, Dumbbell, Stethoscope, Vote, MessageSquareQuote,
  Smartphone, ClipboardList, Sun, Sunset, Moon, Navigation, ShieldAlert
} from "lucide-react";

type AreaName = "Oshodi" | "Berger" | "Yaba" | "Surulere" | "Lekki";

const AREA_COORDS: Record<AreaName, number> = {
  Berger: 1,
  Oshodi: 2,
  Yaba: 3,
  Surulere: 4,
  Lekki: 6,
};

interface MapBuilding {
  id: string;
  roofColor: string;
  icon: string;
  name: string;
  sub: string;
  distKm: number; // Real street distance from Area Bus Stop / Home!
}

export default function LagosEmpireUltimateMapEngine() {
  // 1. ONBOARDING
  const [isCreated, setIsCreated] = useState(false);
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [activeTab, setActiveTab] = useState<"map" | "profile">("map");
  const [logMessage, setLogMessage] = useState(
    "Welcome to Lagos Empire! Click any building on the map to see its travel distance and fare."
  );

  // 2. 15-MINUTE CLOCK, DYNAMIC DAY/AFTERNOON-YELLOW/NIGHT THEME & TRAFFIC
  const [gameHour, setGameHour] = useState(8);
  const [gameMinute, setGameMinute] = useState(0);
  const [gameDay, setGameDay] = useState(1);
  const [gameWeek, setGameWeek] = useState(1);
  const [weeksUntilRentDue, setWeeksUntilRentDue] = useState(8);
  const [weather, setWeather] = useState("Sunny 32°C");

  // Time-of-Day Visual Theme & Rush Hour Traffic ("Go-Slow")
  const timeOfDayPhase: "Daylight" | "Afternoon_Sunset" | "Night" =
    gameHour >= 6 && gameHour < 15
      ? "Daylight"
      : gameHour >= 15 && gameHour < 19
      ? "Afternoon_Sunset"
      : "Night";

  const isRushHourTraffic = (gameHour >= 7 && gameHour <= 9) || (gameHour >= 16 && gameHour <= 19);

  // 3. CENTRAL BANK 300M RESERVE & DUAL WALLETS (g₦ vs c₦ "Coming Soon" Accumulation!)
  const [centralBankReserve, setCentralBankReserve] = useState(300000000);
  const [starterBalance, setStarterBalance] = useState(50000); // g₦ (Working Capital)
  const [earnedBalance, setEarnedBalance] = useState(0);       // c₦ (Earned Cashout Naira - Accumulation Phase)
  const [hospitalLoanDebt, setHospitalLoanDebt] = useState(0);
  const [hospitalShieldHoursLeft, setHospitalShieldHoursLeft] = useState(0); // 48h Shield (drains faster if doing heavy labor!)
  const [transferRecipient, setTransferRecipient] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [convertCnInput, setConvertCnInput] = useState("50000");

  // 4. STRICT MAP POSITION, TRANSIT MODAL & FOG-OF-WAR
  const [area, setArea] = useState<AreaName>("Oshodi");
  const [currentBuildingId, setCurrentBuildingId] = useState<string>("My_Home");
  const [exactPosition, setExactPosition] = useState<string>("🏠 Inside My Home (Oshodi)");
  const [isMapZoomedOut, setIsMapZoomedOut] = useState(false);

  // When a player clicks a building on the map, DO NOT teleport them inside! Open Transit Ticket Modal first:
  const [pendingTargetBuilding, setPendingTargetBuilding] = useState<MapBuilding | null>(null);
  const [inTransitLabel, setInTransitLabel] = useState<string>("");

  // Smartphone ownership (if bought at Yaba Tech Plaza, unlocks remote Vacancy Board viewing!)
  const [phoneOwned, setPhoneOwned] = useState<"None" | "Torchlight_Phone" | "Smartphone">("None");
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  // Market Price Bargaining Discount State
  const [bargainDiscountPct, setBargainDiscountPct] = useState(0); // 0%, 10%, or 15% off from bargaining!

  // 5. SURVIVAL STATS & CLASSIC [?] INDICATOR GUIDE
  const [health, setHealth] = useState(90);
  const [energy, setEnergy] = useState(60);
  const [hunger, setHunger] = useState(80);
  const [weight, setWeight] = useState(68.0);
  const [steeze, setSteeze] = useState(5);
  const [citizenPoints, setCitizenPoints] = useState(15);
  const [activeGuideTip, setActiveGuideTip] = useState<string>(
    "💡 MAP RULE: Clicking any building shows its distance (km) & transport fare first. You must travel there before entering!"
  );

  // 6. DOMESTIC STAFFING AGENCY & HOUSE MAID (485K PLACEMENT + 320K/WK UPKEEP + KG GAS)
  const [hasHiredMaid, setHasHiredMaid] = useState(false);
  const [maidWeeklyFoodLeft, setMaidWeeklyFoodLeft] = useState(0); // Servings in weekly bulk basket
  const [maidTimerSecs, setMaidTimerSecs] = useState(300);         // 5-Minute (300s) auto-care cycle
  const [agencyMaidVacanciesCount, setAgencyMaidVacanciesCount] = useState(2); // Listed by the Agency!

  // 7. HOME, KG COOKING GAS, RAW FOOD & LANDLORD STATE
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

  // Cooking Gas in Real Kilograms (kg)!
  const [hasCookingStove, setHasCookingStove] = useState(false);
  const [gasKg, setGasKg] = useState<number>(0.0); // Measured in kg (burns 0.4kg per meal!)
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

  // 8. DRIVING SCHOOL (75K LICENSE) & CARS (HIDDEN UNTIL BOUGHT)
  const [hasDriversLicense, setHasDriversLicense] = useState(false);
  const [drivingLessonsDone, setDrivingLessonsDone] = useState(0);
  const [carsOwned, setCarsOwned] = useState<string[]>([]);
  const [activeCar, setActiveCar] = useState<string>("None");
  const [carPetrol, setCarPetrol] = useState(100);
  const [carRadiatorWater, setCarRadiatorWater] = useState(100);
  const [carEngineHealth, setCarEngineHealth] = useState(100);

  // 9. SEPARATED SCHOOLS, ACADEMIC MAJORS, HARVARD/OXFORD ABROAD & HIGHER-PRICED CERTS
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
  const [abroadVisaStatus, setAbroadVisaStatus] = useState<"None" | "Processing" | "Approved">("None");

  // 10. LIVE CONSTRUCTION SITES (MIN/MAX BRICKLAYERS, 1-SHIFT PER PLAYER & TIME REDUCTION!)
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
    playerWorkedHere: boolean; // Prevents 1 person doing the same site twice!
    payPerShiftCn: number;
    maxStaff: number;
    maxCust: number;
    revPerHalfDay: number;
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
      maxStaff: 0,
      maxCust: 0,
      revPerHalfDay: 0,
    },
  ]);

  // 11. ACTIVE BUSINESSES, POLITICS & COURTSHIP
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
    hasCertifiedSurveyor: boolean;
    hasCertifiedArchitect: boolean;
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
      comment: "Eateries with Certified Rice, Soup & Malt specialists restore +45% Health & earn 5-star payouts!",
      healthBonus: 45,
      pointsBonus: 25,
      stars: "⭐⭐⭐⭐⭐",
    },
  ]);

  const [hustlesDoneToday, setHustlesDoneToday] = useState(0);
  const [partyStatus, setPartyStatus] = useState<"None" | "Member_JPC" | "Member_JSTD">("None");
  const [partyDaysAttended, setPartyDaysAttended] = useState<number>(0);
  const [nominationStatus, setNominationStatus] = useState<"None" | "Submitted_Verified">("None");
  const [maritalStatus, setMaritalStatus] = useState<"Single" | "Courting" | "Married">("Single");
  const [partnerName, setPartnerName] = useState("None");
  const [datesCompleted, setDatesCompleted] = useState(0);
  const [gymPlan, setGymPlan] = useState<"None" | "1_Hour_Pass" | "Weekly_Plan" | "Monthly_VIP">("None");

  // 12. TIMERS ENGINE
  const [timers, setTimers] = useState<Record<string, number>>({});
  const startCooldown = (key: string, seconds: number) => {
    setTimers((prev) => ({ ...prev, [key]: seconds }));
  };

  const maxEnergyCap = bedTier === "Bare_Floor" ? 60 : bedTier === "Foam_Mattress" ? 85 : 100;

  // HELPER: Receive Earned c₦ (Auto-deducts Hospital Loan if active)
  const receiveEarnedMoney = (amount: number, sourceLabel: string) => {
    if (hospitalLoanDebt > 0) {
      const deduction = Math.min(hospitalLoanDebt, Math.floor(amount * 0.4));
      const netPay = amount - deduction;
      setHospitalLoanDebt((d) => d - deduction);
      setEarnedBalance((e) => e + netPay);
      setLogMessage(
        `🏥 ${sourceLabel}: Earned +${amount.toLocaleString()} c₦ (-${deduction.toLocaleString()} c₦ auto-paid toward Hospital Loan).`
      );
    } else {
      setEarnedBalance((e) => e + amount);
      setLogMessage(`💰 ${sourceLabel}: +${amount.toLocaleString()} c₦ added to your Earned Cashout Wallet!`);
    }
  };

  // HELPER: Spend Money (Uses g₦ Starter/Deposit FIRST, then c₦ Earned Balance, applying any Market Bargain Discount!)
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
    if (applyBargain && bargainDiscountPct > 0) {
      setBargainDiscountPct(0); // Reset one-time bargain discount after purchase
    }
    return true;
  };

  // MASTER CLOCK, 5-MIN MAID (CONSUMES 0.4KG GAS & WEEKLY FOOD!), CONSTRUCTION TIMERS & HOSPITAL LOGIC
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Tick active cooldown timers
      setTimers((prev) => {
        const next: Record<string, number> = {};
        for (const k in prev) {
          if (prev[k] > 1) next[k] = prev[k] - 1;
        }
        return next;
      });

      // 2. Tick Active Construction Sites
      setActiveConstructionSites((sites) =>
        sites.map((s) => ({
          ...s,
          timeRemainingSecs: Math.max(0, s.timeRemainingSecs - 1),
        }))
      );

      // 3. Tick 5-Minute (300s) House Maid Automation (Requires Weekly Food Stock & >= 0.4kg Cooking Gas!)
      if (hasHiredMaid) {
        setMaidTimerSecs((prev) => {
          if (prev <= 1) {
            if (maidWeeklyFoodLeft > 0 && gasKg >= 0.4) {
              setMaidWeeklyFoodLeft((f) => f - 1);
              setGasKg((g) => Number(Math.max(0, g - 0.4).toFixed(1)));
              setHealth((h) => Math.max(h, 92));
              setEnergy((e) => Math.max(e, maxEnergyCap));
              setHunger((b) => Math.max(b, 92));
              setLogMessage(
                "👩🏾‍🍳 MAID AUTO-DELIVERY (5m Cycle): Your House Maid cooked with 0.4kg Gas and delivered a fresh meal! Health, Energy & Belly restored!"
              );
            } else {
              setLogMessage(
                "⚠️ MAID ALERT: Madam/Oga, our Weekly Food Basket or Cooking Gas (kg) is empty! Visit Oshodi Market or Domestic Agency to restock!"
              );
            }
            return 300;
          }
          return prev - 1;
        });
      }

      // 4. Advance 15-Minute Clock
      setGameMinute((m) => {
        if (m < 45) return m + 15;
        setGameHour((h) => {
          const nextH = h >= 23 ? 0 : h + 1;
          if (nextH >= 20 || nextH <= 5) setWeather("Warm Night");
          else if (nextH === 14 || nextH === 15) setWeather("Heavy Lagos Rain");
          else if (nextH >= 6 && nextH <= 10) setWeather("Harmattan Haze");
          else setWeather("Sunny 32°C");

          // Tick 48-Hour Hospital Shield Countdown
          setHospitalShieldHoursLeft((sh) => Math.max(0, sh - 1));

          if (h >= 23) {
            setGameDay((d) => {
              const nd = d + 1;
              if (currentBuildingId === "Party_Secretariat") {
                setPartyDaysAttended((pd) => pd + 1);
              }
              if (nd % 7 === 0) {
                setGameWeek((w) => w + 1);
                setWeeksUntilRentDue((r) => {
                  if (ownershipMode === "Bought_Owned") return 999;
                  const nextR = r - 1;
                  if (nextR <= 0) {
                    setShelterType("Evicted — Sleeping Under Bridge");
                    setParkingSlots(0);
                    setCurrentBuildingId("Under_Bridge");
                    setExactPosition(`🚨 Evicted — Under the Bridge (${area})`);
                    setLogMessage("🚨 RENT OVERDUE! Your landlord evicted you to Under the Bridge!");
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
          }
          return nextH;
        });

        // 5. Stat Decay & Hospital Emergency Check
        setHunger((prevHunger) => {
          const decayRate = hospitalShieldHoursLeft > 0 ? 1 : 3;
          const nextHunger = Math.max(0, prevHunger - decayRate);

          if (nextHunger === 0 && hospitalShieldHoursLeft === 0) {
            setHealth((prevHp) => {
              const nextHp = Math.max(0, prevHp - 8);
              if (nextHp <= 15) {
                setHunger(100);
                setEnergy(maxEnergyCap);
                setHospitalShieldHoursLeft(48); // 48-Hour (2-Day) Shield!
                setCurrentBuildingId("Hospital");
                setExactPosition(`🏥 Admitted Inside ${area} General Hospital Ward`);
                setHospitalLoanDebt((debt) => debt + 100000);
                startCooldown("hospital_bed", 60);
                setLogMessage(
                  `🚑 CRITICAL COLLAPSE! Rushed to ${area} Hospital! Health, Energy & Belly restored to 100% + 48h Medical Shield active! You are now inside the Hospital.`
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
  }, [hasHiredMaid, maidWeeklyFoodLeft, gasKg, hospitalShieldHoursLeft, currentBuildingId, area, maxEnergyCap, ownershipMode]);

  const formatSecs = (s?: number) => {
    if (!s || s <= 0) return "0s";
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}h ${m}m ${sec}s`;
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
  };

  // CONTEXT-AWARE LOW-STAT ADVISORY BANNER (CHECKS IF PLAYER ACTUALLY HAS STOVE & KG GAS AT HOME!)
  const getSmartAdvisoryBanner = () => {
    if (hunger <= 30) {
      if (hasCookingStove && gasKg >= 0.4 && rawFoodServings > 0) {
        return `⚠️ LOW BELLY ALERT (${hunger}%): You have a Gas Stove, ${gasKg}kg of Gas, and ${rawFoodServings} Raw Meals at home! Travel to My Home (${shelterArea}) to cook, or travel to ${area} Mama Put Eatery!`;
      }
      return `⚠️ LOW BELLY ALERT (${hunger}%): You have ${gasKg}kg Cooking Gas & ${rawFoodServings} Raw Meals at home! Travel 0.8 km to ${area} Public Eatery for hot food, or visit Oshodi Market to buy Gas (kg) & Yam/Rice!`;
    }
    if (energy <= 25) {
      return `⚠️ LOW ENERGY ALERT (${energy}%): You are exhausted! Click 'My Home' on the Map to commute home and sleep, or eat at an Eatery!`;
    }
    if (health <= 40) {
      return `🚑 LOW HEALTH WARNING (${health}%): Visit ${area} General Hospital on the Map before you collapse!`;
    }
    return null;
  };

  // SUB-MAP BUILDINGS FOR EACH AREA (WITH REAL STREET DISTANCE IN KM & SEPARATED SCHOOLS/AGENCIES!)
  const subMapBuildings: Record<AreaName, MapBuilding[]> = {
    Oshodi: [
      { id: "Vacancy_Stand", roofColor: "bg-emerald-600", icon: "📋", name: "Street Vacancy & Notice Stand", sub: "Directions to All Live Jobs", distKm: 0.2 },
      { id: "Public_Eatery", roofColor: "bg-amber-600", icon: "🍛", name: "Oshodi Mama Put & Eatery", sub: "6 Hot Nigerian Meals", distKm: 0.7 },
      { id: "Gas_Kitchen_Shop", roofColor: "bg-teal-600", icon: "🔥", name: "Oshodi Market & Gas Depot", sub: "Buy Gas in kg & 8 Food Bundles", distKm: 1.2 },
      { id: "Hospital", roofColor: "bg-rose-600", icon: "🏥", name: "Oshodi General Hospital", sub: "100% Restore + Nurse/Doctor Jobs", distKm: 1.5 },
      { id: "Driving_School", roofColor: "bg-yellow-600", icon: "🪪", name: "FRSC & Driving Academy", sub: "Separate Driving School (75k)", distKm: 2.4 },
      { id: "Mechanic_Shop", roofColor: "bg-purple-600", icon: "🔧", name: "Oshodi Mechanic Village", sub: "Fix Engine & Radiator Water", distKm: 3.8 },
      { id: "Agent_Office", roofColor: "bg-cyan-600", icon: "🏘️", name: "Oshodi Estate Agent", sub: "Rent, Buy or Landlord Form", distKm: 2.1 },
      { id: "Gym", roofColor: "bg-orange-600", icon: "🏋🏾‍♂️", name: "Oshodi Fitness Gym", sub: "1hr / Weekly / Monthly Plans", distKm: 1.9 },
    ],
    Berger: [
      { id: "Vacancy_Stand", roofColor: "bg-emerald-600", icon: "📋", name: "Berger Vacancy Notice Stand", sub: "Directions to All Live Jobs", distKm: 0.2 },
      { id: "Auto_Dealership", roofColor: "bg-emerald-700", icon: "🚗", name: "Berger Motor Fair (10 Cars)", sub: "Bargain & Buy Vehicles", distKm: 2.6 },
      { id: "Filling_Station", roofColor: "bg-yellow-600", icon: "⛽", name: "NNPC Mega Filling Station", sub: "Petrol & Radiator Water", distKm: 1.1 },
      { id: "Builder_Yard", roofColor: "bg-orange-600", icon: "🏗️", name: "Julius Berger Construction HQ", sub: "Step 3: Build Plans & Bricklayers", distKm: 3.4 },
      { id: "Furniture_Shop", roofColor: "bg-indigo-600", icon: "🛏️", name: "Berger Mattress & Sofa Depot", sub: "Foam, King Bed & Sofa", distKm: 1.8 },
      { id: "Public_Eatery", roofColor: "bg-amber-600", icon: "🍛", name: "Berger Highway Bukka", sub: "6 Hot Nigerian Meals", distKm: 0.8 },
      { id: "Agent_Office", roofColor: "bg-cyan-600", icon: "🏘️", name: "Berger Estate Agent", sub: "Houses & Landlord Form", distKm: 2.0 },
    ],
    Yaba: [
      { id: "Vacancy_Stand", roofColor: "bg-emerald-600", icon: "📋", name: "Yaba Vacancy Notice Stand", sub: "Directions to All Live Jobs", distKm: 0.2 },
      { id: "Yaba_Polytechnic", roofColor: "bg-indigo-600", icon: "🏫", name: "Yaba Polytechnic Campus", sub: "ND, HND & Poly Lecturer Job", distKm: 1.6 },
      { id: "Unilag_University", roofColor: "bg-blue-700", icon: "🎓", name: "University of Lagos Senate", sub: "B.Sc, M.Sc, Ph.D & Prof Job", distKm: 2.9 },
      { id: "Architect_Firm", roofColor: "bg-cyan-600", icon: "📐", name: "Yaba Architectural Studio", sub: "Step 2: Paid Plan Stamping", distKm: 2.2 },
      { id: "Electronics_Shop", roofColor: "bg-purple-600", icon: "📱", name: "Yaba Tech, Phones & TV Plaza", sub: "Buy Smartphones & 4 TV Tiers", distKm: 1.4 },
      { id: "Public_Eatery", roofColor: "bg-amber-600", icon: "🍛", name: "Yaba Campus Jollof Spot", sub: "6 Hot Nigerian Meals", distKm: 0.6 },
    ],
    Surulere: [
      { id: "Vacancy_Stand", roofColor: "bg-emerald-600", icon: "📋", name: "Surulere Vacancy Stand", sub: "Directions to All Live Jobs", distKm: 0.2 },
      { id: "Business_Blueprint_School", roofColor: "bg-emerald-700", icon: "💼", name: "Lagos Business & Blueprint School", sub: "Separate Blueprint & ICAN/PMP School", distKm: 2.3 },
      { id: "Domestic_Maid_Agency", roofColor: "bg-rose-600", icon: "👩🏾‍🍳", name: "Domestic Maid Staffing Agency", sub: "Hire Maid (485k) or Work as Maid", distKm: 1.7 },
      { id: "Party_Secretariat", roofColor: "bg-green-700", icon: "🏛️", name: "JPC & JSTD Party Secretariat", sub: "Attend 3 Days & Buy Form", distKm: 2.8 },
      { id: "Church_Lounge", roofColor: "bg-pink-600", icon: "🥂", name: "Surulere Mall, Church & Lounge", sub: "Meet Partners & 10 Dates", distKm: 1.5 },
      { id: "Public_Eatery", roofColor: "bg-amber-600", icon: "🍛", name: "Surulere Kilimanjaro Eatery", sub: "6 Hot Nigerian Meals", distKm: 0.9 },
    ],
    Lekki: [
      { id: "Vacancy_Stand", roofColor: "bg-emerald-600", icon: "📋", name: "Lekki Vacancy Notice Stand", sub: "Directions to All Live Jobs", distKm: 0.2 },
      { id: "Foreign_Embassy", roofColor: "bg-indigo-700", icon: "✈️", name: "Foreign Embassy (Harvard/Oxford)", sub: "Visa & Study Abroad Universities", distKm: 3.5 },
      { id: "Lands_Bureau", roofColor: "bg-amber-600", icon: "📜", name: "Lekki Lands Bureau & C-of-O", sub: "Buy Land & C-of-O", distKm: 2.7 },
      { id: "Corporate_Towers", roofColor: "bg-cyan-700", icon: "🏢", name: "Victoria Island Corporate Towers", sub: "8 Executive & Specialist Jobs", distKm: 3.1 },
      { id: "Agent_Office", roofColor: "bg-teal-600", icon: "🏰", name: "Lekki Luxury Estate Agent", sub: "Duplexes & Landlord Form", distKm: 1.9 },
      { id: "Hospital", roofColor: "bg-rose-600", icon: "🏥", name: "Lekki Lagoon Hospital", sub: "100% Restore + Doctor/Nurse Jobs", distKm: 2.2 },
    ],
  };

  // CALCULATE EXACT INTRA-STREET DISTANCE & FARE (RETURN HOME COSTS +25% MORE, RUSH HOUR ADDS +40% TIME!)
  const getStreetTransitTicket = (target: MapBuilding, isGoingHome = false) => {
    const returnMultiplier = isGoingHome ? 1.25 : 1.0; // Return home costs slightly more as requested!
    const trafficTimeMult = isRushHourTraffic ? 1.5 : 1.0;
    const km = target.distKm;

    return {
      km,
      trekSecs: Math.max(8, Math.round(km * 22)),
      trekEnergy: Math.min(45, Math.max(4, Math.round(km * 6))),
      busCost: Math.round(km * 450 * returnMultiplier),
      busSecs: Math.max(6, Math.round(km * 12 * trafficTimeMult)),
      cabCost: Math.round(km * 1100 * returnMultiplier),
      cabSecs: Math.max(4, Math.round(km * 6 * trafficTimeMult)),
    };
  };

  // EXECUTE STREET TRANSIT WITH LIVE COUNTDOWN BEFORE UNLOCKING BUILDING INTERIOR!
  const handleStartStreetTransit = (target: MapBuilding, mode: "trek" | "bus" | "cab" | "car", isGoingHome = false) => {
    const ticket = getStreetTransitTicket(target, isGoingHome);

    if (mode === "trek") {
      if (energy < ticket.trekEnergy && ticket.km > 0.3) {
        return setLogMessage("⚠️ Too exhausted to trek! Take a Bus, Cab, or Emergency Credit Ride.");
      }
      setEnergy((e) => Math.max(5, e - ticket.trekEnergy));
      if (hospitalShieldHoursLeft > 0 && ticket.km > 1.0) {
        setHospitalShieldHoursLeft((sh) => Math.max(0, sh - 4)); // Heavy trekking burns Hospital Shield!
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
    setPendingTargetBuilding(null);
    setInTransitLabel(`🚌 Traveling ${ticket.km} km to ${target.name} via ${mode.toUpperCase()}...`);
    startCooldown("street_transit", waitSecs);

    setTimeout(() => {
      setInTransitLabel("");
      setCurrentBuildingId(target.id);
      setExactPosition(`${target.icon} Inside ${target.name} (${area})`);
      setLogMessage(`✅ Arrived at ${target.name} (${ticket.km} km)! You are now inside the building.`);
    }, waitSecs * 1000);
  };

  const totalNetWorth =
    starterBalance +
    earnedBalance +
    ownedProperties.length * 18000000 +
    carsOwned.length * 2500000 +
    activeBusinesses.length * 1500000;

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

  if (!isCreated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border-2 border-emerald-500 rounded-2xl p-6 shadow-2xl">
          <div className="inline-block px-3 py-1 bg-emerald-500 text-slate-950 text-xs font-extrabold rounded-full mb-3">
            LAGOS EMPIRE — STRICT MAP TRANSIT &amp; LIVE SITES EDITION
          </div>
          <h1 className="text-2xl font-extrabold mb-2">Begin Your Lagos Life</h1>
          <p className="text-slate-400 text-sm mb-6">
            Start in Oshodi with 50,000 g₦. Trek 0.2 km to the Street Vacancy Stand, commute with real distance countdowns, work on live player construction sites, and accumulate c₦!
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

  // DYNAMIC SKY & INTERFACE THEME BASED ON TIME OF DAY (DAYLIGHT WHITE/SKY vs AFTERNOON AMBER/YELLOW vs NIGHT DARK)
  const themeWrapperClass =
    timeOfDayPhase === "Daylight"
      ? "bg-sky-100 text-slate-900"
      : timeOfDayPhase === "Afternoon_Sunset"
      ? "bg-amber-100 text-slate-900"
      : "bg-slate-950 text-slate-100";

  const advisoryText = getSmartAdvisoryBanner();

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
                {/* DYNAMIC TIME OF DAY BADGE */}
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
                  Wk {gameWeek} • Day {gameDay} • {String(gameHour).padStart(2, "0")}:{String(gameMinute).padStart(2, "0")} ({timeOfDayPhase.replace("_", " ")})
                </span>

                {isRushHourTraffic && (
                  <span className="text-[10px] px-2 py-0.5 bg-red-600 text-white font-bold rounded-full">
                    🚦 Go-Slow Traffic (+50% Bus/Cab Time)
                  </span>
                )}
                {hospitalShieldHoursLeft > 0 && (
                  <span className="text-[11px] px-2 py-0.5 bg-emerald-600 text-white font-extrabold rounded-full">
                    🛡️ Hospital Shield: {hospitalShieldHoursLeft}h Left
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-300 flex flex-wrap items-center gap-2 mt-0.5">
                <span className="text-amber-400 font-extrabold">📍 Position: {exactPosition}</span>
                • <span>🔥 Kitchen Gas: <strong>{gasKg} kg</strong></span>
                {phoneOwned !== "None" && (
                  <button
                    onClick={() => setShowPhoneModal(true)}
                    className="px-2 py-0.5 bg-cyan-500 text-slate-950 font-extrabold rounded-full text-[10px] flex items-center gap-1"
                  >
                    <Smartphone className="w-3 h-3" /> Open {phoneOwned.replace("_", " ")}
                  </button>
                )}
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
        {/* PERSISTENT CONTEXT-AWARE LOW-STAT ADVISORY BANNER */}
        {advisoryText && (
          <div className="bg-red-600 text-white px-4 py-2.5 rounded-2xl font-extrabold text-xs flex items-center justify-between shadow-lg animate-pulse">
            <span>{advisoryText}</span>
          </div>
        )}

        {/* LIVE STREET TRANSIT COUNTDOWN BANNER (BLOCKS TELEPORTING!) */}
        {timers.street_transit && (
          <div className="bg-amber-500 text-slate-950 px-4 py-3 rounded-2xl font-extrabold text-sm flex items-center justify-between shadow-xl">
            <span>{inTransitLabel}</span>
            <span className="bg-slate-950 text-amber-400 px-3 py-1 rounded-xl text-xs">
              ⏳ Arriving in {formatSecs(timers.street_transit)}
            </span>
          </div>
        )}

        {/* METERS BAR */}
        <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-3 space-y-2 shadow-md">
          <div className={`grid grid-cols-2 ${carsOwned.length > 0 ? "sm:grid-cols-7" : "sm:grid-cols-4"} gap-2`}>
            <StatBar icon={<Heart className="w-3.5 h-3.5 text-rose-400" />} label="Health" value={`${health}%`} pct={health} color="bg-rose-500" onHelp={() => setActiveGuideTip("❤️ HEALTH: Restored to 100% at Hospital (grants 48h Shield) or by eating at Eateries / cooking with kg Gas at Home.")} />
            <StatBar icon={<Zap className="w-3.5 h-3.5 text-amber-400" />} label={`Energy (Cap ${maxEnergyCap}%)`} value={`${energy}%`} pct={energy} color="bg-amber-500" onHelp={() => setActiveGuideTip("⚡ ENERGY: Drains when trekking, studying, or bricklaying. Travel back to My Home on the Map to sleep!")} />
            <StatBar icon={<Utensils className="w-3.5 h-3.5 text-orange-400" />} label="Belly/Diet" value={`${hunger}%`} pct={hunger} color="bg-orange-500" onHelp={() => setActiveGuideTip("🍛 BELLY/DIET: Cook at Home (uses 0.4kg Gas + 1 Raw Food) or travel to an Area Public Eatery.")} />
            <StatBar icon={<Sparkles className="w-3.5 h-3.5 text-cyan-400" />} label="Steeze / Pts" value={`${steeze} • 🌟${citizenPoints}`} pct={Math.min(100, steeze)} color="bg-cyan-500" onHelp={() => setActiveGuideTip("✨ STEEZE: Helps you bargain 15% discounts at Oshodi Market & Berger Car Dealership!")} />
            {carsOwned.length > 0 && (
              <>
                <StatBar icon={<Fuel className="w-3.5 h-3.5 text-emerald-400" />} label="Petrol" value={`${carPetrol}%`} pct={carPetrol} color="bg-emerald-500" />
                <StatBar icon={<Droplets className="w-3.5 h-3.5 text-cyan-400" />} label="Radiator" value={`${carRadiatorWater}%`} pct={carRadiatorWater} color="bg-cyan-500" />
                <StatBar icon={<Wrench className="w-3.5 h-3.5 text-purple-400" />} label="Engine" value={`${carEngineHealth}%`} pct={carEngineHealth} color="bg-purple-500" />
              </>
            )}
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-[11px] text-amber-300 flex items-center justify-between">
            <span>{activeGuideTip}</span>
            {hasHiredMaid && (
              <span className="text-emerald-400 font-bold shrink-0 ml-2">
                👩🏾‍🍳 Maid Auto-Meal in: {formatSecs(maidTimerSecs)} (Food Left: {maidWeeklyFoodLeft} • Gas: {gasKg}kg)
              </span>
            )}
          </div>
        </div>

        {/* EVENT LOG */}
        <div className="bg-slate-900 text-emerald-300 border border-emerald-700/60 px-4 py-2 rounded-xl text-xs font-bold shadow">
          🔔 {logMessage}
        </div>

        {/* =====================================================================
            CORE TOWN MAP & BUILDING INTERIOR ENGINE (EVERYTHING REVOLVES AROUND THE MAP!)
           ===================================================================== */}
        {activeTab === "map" && (
          <div className="space-y-4 text-xs">
            <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-extrabold text-base text-emerald-400">
                  🗺️ {isMapZoomedOut ? "Lagos State Satellite Map (5 Areas)" : `${area} Illustrated Town Map (Click Any Building to See Distance & Travel)`}
                </h2>
                <p className="text-slate-400 text-[11px]">
                  You cannot see inside a building until you travel to it! Click <strong>📋 Street Vacancy Stand (0.2 km)</strong> for job directions, or click <strong>🏡 My Home</strong> to return home.
                </p>
              </div>
              <button
                onClick={() => { setIsMapZoomedOut(!isMapZoomedOut); setPendingTargetBuilding(null); }}
                className="px-4 py-2 bg-amber-500 text-slate-950 font-extrabold rounded-xl flex items-center gap-1.5"
              >
                {isMapZoomedOut ? <ZoomIn className="w-4 h-4" /> : <ZoomOut className="w-4 h-4" />}
                {isMapZoomedOut ? `Zoom In to ${area} Street` : "Zoom Out: Travel Across 5 Lagos Areas"}
              </button>
            </div>

            {/* DISTANCE & FARE TICKET MODAL WHEN A BUILDING IS CLICKED (NO INSTANT TELEPORT!) */}
            {pendingTargetBuilding && (
              <div className="p-4 bg-slate-900 text-white border-2 border-amber-400 rounded-2xl shadow-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-sm text-amber-400 flex items-center gap-2">
                    <Navigation className="w-4 h-4" /> Travel Ticket Required: {pendingTargetBuilding.icon} {pendingTargetBuilding.name} ({pendingTargetBuilding.distKm} km away)
                  </h3>
                  <button onClick={() => setPendingTargetBuilding(null)} className="text-xs text-slate-400 underline">Cancel</button>
                </div>
                <p className="text-slate-300 text-[11px]">
                  You are currently at <strong>{exactPosition}</strong>. Choose how you want to travel <strong>{pendingTargetBuilding.distKm} km</strong> to unlock and enter <strong>{pendingTargetBuilding.name}</strong> {pendingTargetBuilding.id === "My_Home" && "(Return trip fare +25% applied)"}:
                </p>
                {(() => {
                  const isHome = pendingTargetBuilding.id === "My_Home";
                  const t = getStreetTransitTicket(pendingTargetBuilding, isHome);
                  return (
                    <div className="grid sm:grid-cols-4 gap-2.5">
                      <button
                        onClick={() => handleStartStreetTransit(pendingTargetBuilding, "trek", isHome)}
                        className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-left"
                      >
                        <div className="font-extrabold text-white">🚶🏾‍♂️ Trek ({t.km} km)</div>
                        <div className="text-[10px] text-emerald-400">Cost: ₦0 • Time: {t.trekSecs}s • -{t.trekEnergy}% Energy</div>
                      </button>
                      <button
                        onClick={() => handleStartStreetTransit(pendingTargetBuilding, "bus", isHome)}
                        className="p-2.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500 rounded-xl text-left"
                      >
                        <div className="font-extrabold text-amber-300">🚐 Korope / Bus</div>
                        <div className="text-[10px] text-white">Cost: {t.busCost.toLocaleString()} g₦ • Time: {t.busSecs}s</div>
                      </button>
                      <button
                        onClick={() => handleStartStreetTransit(pendingTargetBuilding, "cab", isHome)}
                        className="p-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-left"
                      >
                        <div className="font-extrabold text-white">🚕 Drop Cab</div>
                        <div className="text-[10px] text-indigo-200">Cost: {t.cabCost.toLocaleString()} g₦ • Time: {t.cabSecs}s</div>
                      </button>
                      {carsOwned.length > 0 && (
                        <button
                          onClick={() => handleStartStreetTransit(pendingTargetBuilding, "car", isHome)}
                          className="p-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-left"
                        >
                          <div className="font-extrabold text-white">🚗 Drive {activeCar}</div>
                          <div className="text-[10px] text-emerald-100">Cost: ₦0 (-4% Petrol) • Time: {t.cabSecs}s</div>
                        </button>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* ZOOMED-OUT INTER-AREA STATE MAP */}
            {isMapZoomedOut ? (
              <div className="grid sm:grid-cols-5 gap-3 bg-slate-900 text-white border-2 border-emerald-700 p-4 rounded-2xl">
                {(["Berger", "Oshodi", "Yaba", "Surulere", "Lekki"] as AreaName[]).map((dest) => {
                  const isCurrent = area === dest;
                  const dist = Math.abs(AREA_COORDS[area] - AREA_COORDS[dest]) || 1;
                  const busFare = dist * 1500;
                  const cabFare = dist * 3500;
                  return (
                    <div key={dest} className={`p-4 rounded-2xl border-2 flex flex-col justify-between space-y-3 ${isCurrent ? "bg-emerald-950/60 border-emerald-400" : "bg-slate-950 border-slate-800"}`}>
                      <div>
                        <div className="text-2xl mb-1">🏙️ 🌳</div>
                        <div className="font-extrabold text-base text-white">📍 {dest}</div>
                        <div className="text-[10px] text-slate-400">{isCurrent ? "Standing in this Area" : `Distance: ~${dist * 6.5} km away`}</div>
                        {shelterArea === dest && <span className="inline-block mt-1 text-[10px] bg-indigo-600 px-2 py-0.5 rounded-full">🏠 My Home Area</span>}
                      </div>
                      {isCurrent ? (
                        <button onClick={() => setIsMapZoomedOut(false)} className="w-full py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-xl">
                          Open {dest} Street
                        </button>
                      ) : (
                        <div className="space-y-1.5 pt-2 border-t border-slate-800">
                          <button
                            onClick={() => {
                              if (!spendMoney(busFare)) return;
                              startCooldown("street_transit", dist * 15);
                              setInTransitLabel(`🚐 Inter-Area Danfo Bus to ${dest}...`);
                              setTimeout(() => {
                                setInTransitLabel("");
                                setArea(dest);
                                setCurrentBuildingId("Street_Bus_Stop");
                                setExactPosition(`🚐 At ${dest} Main Bus Stop`);
                                setIsMapZoomedOut(false);
                              }, dist * 15000);
                            }}
                            className="w-full py-1.5 bg-amber-500 text-slate-950 font-extrabold rounded-lg text-[10px]"
                          >
                            🚐 Bus ({busFare.toLocaleString()} g₦ • {dist * 15}s)
                          </button>
                          <button
                            onClick={() => {
                              if (!spendMoney(cabFare)) return;
                              startCooldown("street_transit", dist * 8);
                              setInTransitLabel(`🚕 Inter-Area Cab to ${dest}...`);
                              setTimeout(() => {
                                setInTransitLabel("");
                                setArea(dest);
                                setCurrentBuildingId("Street_Bus_Stop");
                                setExactPosition(`🚕 At ${dest} Main Bus Stop`);
                                setIsMapZoomedOut(false);
                              }, dist * 8000);
                            }}
                            className="w-full py-1.5 bg-indigo-600 text-white font-bold rounded-lg text-[10px]"
                          >
                            🚕 Cab ({cabFare.toLocaleString()} g₦ • {dist * 8}s)
                          </button>
                          {/* EMERGENCY COMMUNITY CREDIT RIDE IF STRANDED AT 0 CASH */}
                          {starterBalance + earnedBalance < busFare && (
                            <button
                              onClick={() => {
                                setHospitalLoanDebt((d) => d + 2000);
                                setArea(dest);
                                setIsMapZoomedOut(false);
                                setLogMessage(`🚌 Took Emergency BRT Community Credit Ride to ${dest} (+2,000 c₦ transport debt)!`);
                              }}
                              className="w-full py-1 bg-rose-700 text-white font-bold rounded text-[10px]"
                            >
                              🆘 Stranded Credit Bus (+2k Debt)
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* ILLUSTRATED 2D STREET SUB-MAP WITH ROADS, TREES, HOME, VACANCY STAND & LIVE CONSTRUCTION SITES! */
              <div className="rounded-3xl border-4 border-emerald-800 bg-slate-900 text-white p-5 space-y-5 shadow-2xl">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  {/* 1. MY HOME ON THE MAP (IF HOME IS IN THIS AREA) */}
                  {shelterArea === area && (
                    <button
                      onClick={() => {
                        if (currentBuildingId === "My_Home") return;
                        setPendingTargetBuilding({
                          id: "My_Home",
                          roofColor: "bg-emerald-500",
                          icon: "🏠",
                          name: `My Home (${shelterType})`,
                          sub: "Return Home (+25% Return Fare)",
                          distKm: 1.4,
                        });
                      }}
                      className={`bg-slate-950 border-2 ${
                        currentBuildingId === "My_Home" ? "border-emerald-400 ring-2 ring-emerald-400" : "border-slate-700"
                      } rounded-2xl overflow-hidden shadow-xl hover:scale-[1.02] transition flex flex-col`}
                    >
                      <div className="w-full h-5 bg-emerald-500 flex items-center justify-between px-2 text-[9px] font-extrabold text-slate-950">
                        <span>MY RESIDENCE</span>
                        <span>1.4 km</span>
                      </div>
                      <div className="p-3 flex flex-col items-center gap-1">
                        <div className="text-3xl">🏠</div>
                        <div className="font-extrabold text-white text-xs text-center">{shelterType}</div>
                        <div className="text-[10px] text-emerald-400 font-bold">
                          {currentBuildingId === "My_Home" ? "✓ You Are Inside Home" : "Click to Travel Home (1.4 km)"}
                        </div>
                      </div>
                    </button>
                  )}

                  {/* 2. ACTIVE CONSTRUCTION SITES IN THIS AREA (NEEDS BRICKLAYERS!) */}
                  {activeConstructionSites
                    .filter((s) => s.area === area)
                    .map((site) => (
                      <button
                        key={site.id}
                        onClick={() => {
                          if (currentBuildingId === site.id) return;
                          setPendingTargetBuilding({
                            id: site.id,
                            roofColor: "bg-amber-500",
                            icon: "🧱",
                            name: site.projectName,
                            sub: `Bricklayers: ${site.currentBricklayers}/${site.maxBricklayers} (Min ${site.minBricklayers})`,
                            distKm: 1.8,
                          });
                        }}
                        className={`bg-slate-950 border-2 ${
                          currentBuildingId === site.id ? "border-amber-400 ring-2 ring-amber-400" : "border-amber-600/60"
                        } rounded-2xl overflow-hidden shadow-xl hover:scale-[1.02] transition flex flex-col`}
                      >
                        <div className="w-full h-5 bg-amber-500 flex items-center justify-between px-2 text-[9px] font-extrabold text-slate-950">
                          <span>LIVE SITE</span>
                          <span>1.8 km</span>
                        </div>
                        <div className="p-3 flex flex-col items-center gap-1">
                          <div className="text-3xl">🧱🏗️</div>
                          <div className="font-extrabold text-amber-300 text-xs text-center">{site.projectName}</div>
                          <div className="text-[10px] text-white">
                            Workers: {site.currentBricklayers}/{site.maxBricklayers} (Min {site.minBricklayers})
                          </div>
                        </div>
                      </button>
                    ))}

                  {/* 3. AREA BUILDINGS */}
                  {subMapBuildings[area].map((b) => {
                    const isInside = currentBuildingId === b.id;
                    return (
                      <button
                        key={b.id}
                        onClick={() => {
                          if (isInside) return;
                          setPendingTargetBuilding(b);
                        }}
                        className={`bg-slate-950 border-2 ${
                          isInside ? "border-amber-400 ring-2 ring-amber-400/50" : "border-slate-800"
                        } rounded-2xl overflow-hidden shadow-xl hover:scale-[1.02] transition flex flex-col`}
                      >
                        <div className={`w-full h-5 ${b.roofColor} flex items-center justify-between px-2 text-[9px] font-extrabold text-white uppercase`}>
                          <span>🏢 {area}</span>
                          <span>{b.distKm} km</span>
                        </div>
                        <div className="p-3 flex flex-col items-center gap-1">
                          <div className="text-3xl">{b.icon}</div>
                          <div className="font-extrabold text-white text-xs text-center">{b.name}</div>
                          <div className="text-[10px] text-slate-400 text-center">{b.sub}</div>
                          <div className="mt-1 px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-[10px] text-emerald-300 font-bold">
                            {isInside ? "✓ Inside Building" : `🚌 Travel (${b.distKm} km)`}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* ===============================================================
                    STRICT FOG-OF-WAR INTERIOR: ONLY SHOWS THE BUILDING YOU TRAVELED INTO!
                   =============================================================== */}

                {/* INTERIOR 0: MY HOME (COOK WITH KG GAS, SLEEP, PAINT, WATCH TV) */}
                {currentBuildingId === "My_Home" && (
                  <div className={`p-5 rounded-2xl border-2 space-y-4 ${wallBgMap[wallColor]}`}>
                    <div className="flex flex-wrap justify-between items-center gap-2">
                      <div>
                        <h3 className="font-extrabold text-base text-emerald-300">🏠 Inside My Home: {shelterType} ({shelterArea})</h3>
                        <p className="text-slate-300 text-[11px]">
                          Bed: {bedTier} (Max {maxEnergyCap}% En) • Sofa: {chairTier} • TV: {tvTier} • Kitchen Gas: <strong>{gasKg} kg</strong> • Raw Food: <strong>{rawFoodServings} Meals</strong>
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          disabled={!!timers.sleep_cd}
                          onClick={() => {
                            startCooldown("sleep_cd", 60);
                            setEnergy(maxEnergyCap);
                            setGameDay((d) => d + 1);
                            setLogMessage(`🛌 Slept overnight! Energy restored to ${maxEnergyCap}%.`);
                          }}
                          className="px-4 py-2 bg-indigo-600 text-white font-extrabold rounded-xl"
                        >
                          🛌 Sleep Overnight (60s)
                        </button>
                        <button
                          disabled={!!timers.cook_cd}
                          onClick={() => {
                            if (!hasCookingStove) return setLogMessage("❌ You don't own a Gas Stove! Travel 1.2 km to Oshodi Market to buy one.");
                            if (gasKg < 0.4) return setLogMessage(`❌ Your gas cylinder is too low (${gasKg}kg)! Refill kg gas at Oshodi Market.`);
                            if (rawFoodServings < 1) return setLogMessage("❌ No raw food at home! Buy Yam, Rice, or Beans at Oshodi Market.");
                            startCooldown("cook_cd", 60);
                            setGasKg((g) => Number(Math.max(0, g - 0.4).toFixed(1)));
                            setRawFoodServings((r) => r - 1);
                            setHunger(100);
                            setEnergy(maxEnergyCap);
                            setHealth((h) => Math.min(100, h + 15));
                            setLogMessage(`🍳 Cooked a fresh meal at home! Used 0.4kg Gas (${(gasKg - 0.4).toFixed(1)}kg left). Belly 100%, Energy ${maxEnergyCap}%!`);
                          }}
                          className="px-4 py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-xl"
                        >
                          🍳 Cook at Home (-0.4kg Gas &amp; 1 Food)
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* INTERIOR 1: STREET VACANCY & NOTICE STAND (0.2 KM FROM HOME — DIRECTIONS ONLY, NO TELEPORT!) */}
                {currentBuildingId === "Vacancy_Stand" && (
                  <div className="p-4 bg-slate-950 border-2 border-emerald-500 rounded-2xl space-y-3">
                    <h3 className="font-extrabold text-sm text-emerald-400 flex items-center gap-2">
                      <ClipboardList className="w-4 h-4" /> 📋 Street Vacancy &amp; Community Notice Board (Directions Only — Travel on Map to Apply!)
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-2.5 text-[11px]">
                      {activeConstructionSites.map((s) => (
                        <div key={s.id} className="p-3 bg-slate-900 border border-amber-500/50 rounded-xl space-y-1">
                          <div className="font-extrabold text-amber-300">🧱 LIVE BRICKLAYER VACANCY: {s.projectName}</div>
                          <div>Pay: <strong>+{s.payPerShiftCn.toLocaleString()} c₦</strong> • Slots: {s.currentBricklayers}/{s.maxBricklayers} (Min {s.minBricklayers})</div>
                          <div className="text-emerald-400 font-bold">👉 DIRECTIONS: Travel to {s.area} on the Map and click the Live Construction Site (1.8 km)!</div>
                        </div>
                      ))}
                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                        <div className="font-extrabold text-rose-300">👩🏾‍🍳 DOMESTIC MAID VACANCIES ({agencyMaidVacanciesCount} Open Slots)</div>
                        <div>Pay: <strong>+45,000 c₦ / shift</strong> • Req: Culinary/Home Cert</div>
                        <div className="text-emerald-400 font-bold">👉 DIRECTIONS: Commute to Surulere and walk 1.7 km to the Domestic Maid Staffing Agency!</div>
                      </div>
                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                        <div className="font-extrabold text-cyan-300">🏥 HOSPITAL NURSE (160k c₦) &amp; DOCTOR (480k c₦) VACANCIES</div>
                        <div>Req: Nursing Diploma/B.Sc or Medicine MBBS Degree</div>
                        <div className="text-emerald-400 font-bold">👉 DIRECTIONS: Travel to Oshodi or Lekki General Hospital (1.5 km) to clock in!</div>
                      </div>
                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                        <div className="font-extrabold text-indigo-300">🎓 POLYTECHNIC &amp; UNIVERSITY LECTURER VACANCIES (280k–650k c₦)</div>
                        <div>Req: Masters (M.Sc) or Doctorate (Ph.D)</div>
                        <div className="text-emerald-400 font-bold">👉 DIRECTIONS: Commute to Yaba Polytechnic (1.6 km) or UNILAG Senate (2.9 km)!</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* INTERIOR 2: LIVE CONSTRUCTION SITE (WORK AS BRICKLAYER — 1 TIME PER SITE, FULL DAY SHIFT, REDUCES BUILD TIME!) */}
                {activeConstructionSites.map(
                  (site, idx) =>
                    currentBuildingId === site.id && (
                      <div key={site.id} className="p-4 bg-slate-950 border-2 border-amber-500 rounded-2xl space-y-3">
                        <h3 className="font-extrabold text-sm text-amber-400">
                          🧱🏗️ Inside Active Construction Site: {site.projectName} ({site.area})
                        </h3>
                        <p className="text-slate-300">
                          Countdown Remaining: <strong>{formatSecs(site.timeRemainingSecs)}</strong> • Bricklayers Worked:{" "}
                          <strong className="text-emerald-400">
                            {site.currentBricklayers} / {site.maxBricklayers} (Minimum {site.minBricklayers} Required to Finish!)
                          </strong>
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <button
                            disabled={site.playerWorkedHere || site.currentBricklayers >= site.maxBricklayers || !!timers.brick_shift}
                            onClick={() => {
                              if (energy < 40) return setLogMessage("⚠️ Bricklaying is a full-day heavy job requiring at least 40% Energy!");
                              startCooldown("brick_shift", 90);
                              setEnergy((e) => Math.max(5, e - 40));
                              setGameHour((h) => (h + 6) % 24); // Full-day heavy job advances clock 6 hours!
                              if (hospitalShieldHoursLeft > 0) setHospitalShieldHoursLeft((sh) => Math.max(0, sh - 8));

                              const up = [...activeConstructionSites];
                              up[idx].currentBricklayers += 1;
                              up[idx].playerWorkedHere = true; // 1-time per project lock!
                              up[idx].timeRemainingSecs = Math.max(0, up[idx].timeRemainingSecs - 1800); // Speeds up build by 30 mins!
                              setActiveConstructionSites(up);

                              receiveEarnedMoney(site.payPerShiftCn, `Full-Day Bricklayer Shift at ${site.projectName}`);
                            }}
                            className="px-4 py-2.5 bg-amber-500 text-slate-950 font-extrabold rounded-xl disabled:opacity-40"
                          >
                            {site.playerWorkedHere
                              ? "✓ You Already Worked on This Project (1-Time Limit)"
                              : site.currentBricklayers >= site.maxBricklayers
                              ? "🛑 Max Bricklayers Reached"
                              : `🧱 Work Full-Day Bricklayer Shift (+${site.payPerShiftCn.toLocaleString()} c₦ • Speeds Build -30m)`}
                          </button>

                          {/* EMERGENCY NPC SUB-CONTRACTOR FOR THE OWNER IF SERVER IS QUIET */}
                          <button
                            onClick={() => {
                              if (spendMoney(150000)) {
                                const up = [...activeConstructionSites];
                                up[idx].currentBricklayers = Math.min(up[idx].maxBricklayers, up[idx].currentBricklayers + 1);
                                up[idx].timeRemainingSecs = 0;
                                setActiveConstructionSites(up);
                                setLogMessage("👷🏾‍♂️ Hired NPC Backup Bricklayer Team! Minimum worker requirement met & construction finished!");
                              }
                            }}
                            className="px-4 py-2.5 bg-slate-800 border border-slate-600 text-white font-bold rounded-xl"
                          >
                            👷🏾‍♂️ Owner Option: Hire Backup NPC Bricklayer (150,000 g₦)
                          </button>
                        </div>
                      </div>
                    )
                )}

                {/* INTERIOR 3: OSHODI MARKET & KG GAS DEPOT (WITH PRICE BARGAINING & 8 FOOD BUNDLES!) */}
                {currentBuildingId === "Gas_Kitchen_Shop" && (
                  <div className="p-4 bg-slate-950 border-2 border-teal-500 rounded-2xl space-y-4">
                    <div className="flex flex-wrap justify-between items-center gap-2">
                      <h3 className="font-extrabold text-sm text-teal-400">
                        🔥 Inside Oshodi Market &amp; Gas Depot (Kitchen Gas: {gasKg} kg • Raw Food: {rawFoodServings} Meals)
                      </h3>
                      <button
                        disabled={bargainDiscountPct > 0}
                        onClick={() => {
                          const disc = steeze >= 30 ? 15 : 10;
                          setBargainDiscountPct(disc);
                          setLogMessage(`🗣️ You bargained with the Oshodi Market trader! Unlocked a ${disc}% discount on your next market purchase!`);
                        }}
                        className="px-3 py-1.5 bg-amber-500 text-slate-950 font-extrabold rounded-xl"
                      >
                        {bargainDiscountPct > 0 ? `✓ ${bargainDiscountPct}% Bargain Active!` : "🗣️ Bargain / Price It Down (-10% to -15%)"}
                      </button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="font-bold text-orange-400 uppercase">1. Gas Stove &amp; Refill by Kilogram (kg)</div>
                        <button
                          disabled={hasCookingStove}
                          onClick={() => { if (spendMoney(35000, true)) { setHasCookingStove(true); setGasKg(2.0); setLogMessage("🔥 Bought Tabletop Gas Stove (+2.0kg starter gas)!"); }}}
                          className="w-full p-2 bg-slate-900 border border-orange-700 rounded-xl flex justify-between font-bold disabled:opacity-40"
                        >
                          <span>{hasCookingStove ? "✓ Gas Stove Owned" : "🔥 Tabletop Gas Stove Burner"}</span>
                          <span className="text-amber-400">35,000 g₦</span>
                        </button>
                        {[
                          { label: "⛽ Refill 1.0 kg Cooking Gas", kg: 1.0, cost: 1200 },
                          { label: "⛽ Refill 3.0 kg Camp Gas", kg: 3.0, cost: 3500 },
                          { label: "⛽ Refill 6.0 kg Cylinder Gas", kg: 6.0, cost: 6800 },
                          { label: "⛽ Refill 12.5 kg Full Home Cylinder", kg: 12.5, cost: 13500 },
                        ].map((g, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              if (!hasCookingStove) return setLogMessage("❌ Buy the Gas Stove Burner first!");
                              if (spendMoney(g.cost, true)) {
                                setGasKg((prev) => Number((prev + g.kg).toFixed(1)));
                                setLogMessage(`⛽ Refilled +${g.kg}kg Cooking Gas!`);
                              }
                            }}
                            className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl flex justify-between font-bold"
                          >
                            <span>{g.label}</span>
                            <span className="text-amber-400">{g.cost.toLocaleString()} g₦</span>
                          </button>
                        ))}
                      </div>

                      <div className="space-y-1.5">
                        <div className="font-bold text-emerald-400 uppercase">2. Expanded Raw Foodstuff Shelf (8 Bundles)</div>
                        {[
                          { name: "🥖 Garri Ijebu, Sugar & Groundnut Pack (2 Meals)", meals: 2, cost: 3000 },
                          { name: "🍜 Carton of Indomie & Crate of Eggs (4 Meals)", meals: 4, cost: 6500 },
                          { name: "🫘 Oloyin Beans, Plantain & Palm Oil (5 Meals)", meals: 5, cost: 8500 },
                          { name: "🍠 3 Heavy Tubers of Pounded Yam & Egusi (7 Meals)", meals: 7, cost: 12000 },
                          { name: "🍚 Ofada Rice, Locust Beans & Assorted (8 Meals)", meals: 8, cost: 15000 },
                          { name: "🍗 5kg Semovita, Okra & Frozen Turkey (12 Meals)", meals: 12, cost: 22000 },
                          { name: "🥩 25kg Bag of Jollof Rice, Veg Oil & Beef (18 Meals)", meals: 18, cost: 34000 },
                          { name: "👑 50kg Royal Family Provision & Ram Meat Crate (30 Meals)", meals: 30, cost: 55000 },
                        ].map((f, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              if (spendMoney(f.cost, true)) {
                                setRawFoodServings((r) => r + f.meals);
                                setLogMessage(`🌾 Bought ${f.name} (+${f.meals} Home Meals)!`);
                              }
                            }}
                            className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl flex justify-between font-bold"
                          >
                            <span className="truncate pr-2">{f.name}</span>
                            <span className="text-emerald-400 shrink-0">{f.cost.toLocaleString()} g₦</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* INTERIOR 4: PUBLIC EATERY (6 STANDARD MEALS) */}
                {currentBuildingId === "Public_Eatery" && (
                  <div className="p-4 bg-slate-950 border-2 border-amber-500 rounded-2xl space-y-3">
                    <h3 className="font-extrabold text-sm text-amber-400">🍛 Inside {area} Public Eatery (6 Standard Meals)</h3>
                    <div className="grid sm:grid-cols-3 gap-2.5">
                      {[
                        { name: "🍞 Agege Bread & Ewa Agoyin", cost: 2000, belly: 35, en: 20, hp: 5 },
                        { name: "🍛 Party Jollof Rice & Plantain", cost: 4500, belly: 50, en: 35, hp: 15 },
                        { name: "🍲 Amala, Ewedu & Gbegiri + Assorted", cost: 6000, belly: 65, en: 45, hp: 20 },
                        { name: "🥣 Pounded Yam & Egusi Soup", cost: 8500, belly: 80, en: 55, hp: 25 },
                        { name: "🐟 Catfish Pepper Soup & Malt", cost: 11000, belly: 75, en: 60, hp: 35 },
                        { name: "🍗 Executive Mixed Grill & Salad", cost: 18000, belly: 100, en: 85, hp: 50 },
                      ].map((m, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            if (spendMoney(m.cost)) {
                              setHunger((b) => Math.min(100, b + m.belly));
                              setEnergy((e) => Math.min(maxEnergyCap, e + m.en));
                              setHealth((h) => Math.min(100, h + m.hp));
                              setLogMessage(`🍛 Ate ${m.name} at ${area} Eatery!`);
                            }
                          }}
                          className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-left"
                        >
                          <div className="font-bold text-white">{m.name}</div>
                          <div className="text-emerald-400 font-bold">{m.cost.toLocaleString()} g₦ • +{m.belly}% Belly</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* INTERIOR 5: HOSPITAL (TREATMENT + NURSE & DOCTOR VACANCIES!) */}
                {currentBuildingId === "Hospital" && (
                  <div className="p-4 bg-slate-950 border-2 border-rose-500 rounded-2xl space-y-4">
                    <h3 className="font-extrabold text-sm text-rose-400">
                      🏥 Inside {area} General Hospital (Patient Care + Nurse &amp; Doctor Vacancies)
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => {
                          if (spendMoney(25000)) {
                            setHealth(100);
                            setEnergy(maxEnergyCap);
                            setHunger(100);
                            setHospitalShieldHoursLeft(48);
                            setLogMessage("🏥 Discharged with 100% Health, Energy & Belly + 48-Hour Medical Shield!");
                          }
                        }}
                        className="px-4 py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-xl"
                      >
                        💊 Full Cash Treatment (25,000 g₦ to 100% All Stats + 48h Shield)
                      </button>
                    </div>

                    <div className="border-t border-slate-800 pt-3 grid sm:grid-cols-2 gap-3">
                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-center">
                        <div>
                          <div className="font-bold text-white">👩🏾‍⚕️ Registered Nurse Shift</div>
                          <div className="text-[10px] text-cyan-400">Req: ND/B.Sc Nursing • Pays +160,000 c₦</div>
                        </div>
                        <button
                          onClick={() => {
                            if (!completedDegrees.some((d) => d.includes("Nursing"))) return setLogMessage("❌ Requires ND or B.Sc in Nursing!");
                            receiveEarnedMoney(160000, `Registered Nurse Shift at ${area} Hospital`);
                          }}
                          className="px-3 py-1.5 bg-cyan-500 text-slate-950 font-extrabold rounded-lg"
                        >
                          Work Shift
                        </button>
                      </div>
                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-center">
                        <div>
                          <div className="font-bold text-white">👨🏾‍⚕️ Chief Medical Doctor / Surgeon</div>
                          <div className="text-[10px] text-amber-400">Req: B.Sc Medicine (MBBS) • Pays +480,000 c₦</div>
                        </div>
                        <button
                          onClick={() => {
                            if (!completedDegrees.some((d) => d.includes("Medicine"))) return setLogMessage("❌ Requires B.Sc in Medicine & Surgery (MBBS)!");
                            receiveEarnedMoney(480000, `Medical Doctor Surgery Shift at ${area} Hospital`);
                          }}
                          className="px-3 py-1.5 bg-amber-500 text-slate-950 font-extrabold rounded-lg"
                        >
                          Work Shift
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* INTERIOR 6: DOMESTIC MAID STAFFING AGENCY (SURULERE — HIRE MAID AT 485K + 320K/WK OR WORK AS MAID!) */}
                {currentBuildingId === "Domestic_Maid_Agency" && (
                  <div className="p-4 bg-slate-950 border-2 border-rose-500 rounded-2xl space-y-4">
                    <h3 className="font-extrabold text-sm text-rose-400">
                      👩🏾‍🍳 Inside Surulere Domestic Maid Staffing Agency (Homeowners Request Here &amp; Agency Lists Vacancies!)
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* FOR HOMEOWNERS */}
                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                        <div className="font-extrabold text-emerald-400">1. For Homeowners: Request Live-In Certified Maid</div>
                        <p className="text-[11px] text-slate-300">
                          Agency Placement Fee: <strong>485,000 g₦</strong> (25% reduced) • Weekly Salary + Bulk Food Basket: <strong>320,000 g₦ / week</strong> (14 Meals + uses 0.4kg Gas per auto-meal).
                        </p>
                        {!hasHiredMaid ? (
                          <button
                            onClick={() => {
                              if (parkingSlots < 1) return setLogMessage("❌ You must live in at least a Flat or Duplex (with Maid quarters) before the Agency assigns a Maid!");
                              if (spendMoney(485000)) {
                                setHasHiredMaid(true);
                                setMaidWeeklyFoodLeft(14);
                                setAgencyMaidVacanciesCount((c) => c + 1); // Agency lists the job!
                                setLogMessage("👩🏾‍🍳 Hired Certified Maid via Agency (485k) & Agency listed +1 Maid Vacancy on the board!");
                              }
                            }}
                            className="w-full py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-lg"
                          >
                            Pay Agency Placement Fee (485,000 g₦)
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              if (spendMoney(320000)) {
                                setMaidWeeklyFoodLeft((f) => f + 14);
                                setLogMessage("👩🏾‍🍳 Paid 320,000 g₦ Weekly Maid Salary & Bulk Food Basket (+14 Auto-Meals stocked)!");
                              }
                            }}
                            className="w-full py-2 bg-amber-500 text-slate-950 font-extrabold rounded-lg"
                          >
                            Pay Weekly Salary + Weekly Food Basket (320,000 g₦)
                          </button>
                        )}
                      </div>

                      {/* FOR WORKERS APPLYING TO THE AGENCY */}
                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                        <div className="font-extrabold text-amber-400">
                          2. Agency Maid Vacancies ({agencyMaidVacanciesCount} Open Household Placements)
                        </div>
                        <p className="text-[11px] text-slate-300">
                          Requires: <strong>Master Culinary / Home Cert</strong> &amp; <strong>Health &gt;= 75%</strong>.
                        </p>
                        <button
                          disabled={agencyMaidVacanciesCount <= 0 || !!timers.maid_job}
                          onClick={() => {
                            if (!specialistCerts.includes("Cert_Rice")) return setLogMessage("❌ Requires Master Culinary Certificate from Lagos Business School!");
                            if (health < 75) return setLogMessage("❌ Domestic Agency requires 75%+ Health!");
                            startCooldown("maid_job", 75);
                            receiveEarnedMoney(45000, "Certified Domestic Maid Agency Placement Shift");
                          }}
                          className="w-full py-2 bg-rose-600 text-white font-extrabold rounded-lg disabled:opacity-40"
                        >
                          {timers.maid_job ? `⏳ Working (${formatSecs(timers.maid_job)})` : "Apply & Work Agency Maid Shift (+45,000 c₦)"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* INTERIOR 7: SEPARATED SCHOOLS (YABA POLY, UNILAG, BUSINESS BLUEPRINT SCHOOL, DRIVING ACADEMY & HARVARD EMBASSY!) */}
                {(currentBuildingId === "Yaba_Polytechnic" ||
                  currentBuildingId === "Unilag_University" ||
                  currentBuildingId === "Foreign_Embassy") && (
                  <div className="p-4 bg-slate-950 border-2 border-indigo-500 rounded-2xl space-y-4">
                    <h3 className="font-extrabold text-sm text-indigo-400">
                      🎓 Inside{" "}
                      {currentBuildingId === "Yaba_Polytechnic"
                        ? "Yaba Polytechnic Campus (Choose Department + Poly Lecturer Job)"
                        : currentBuildingId === "Unilag_University"
                        ? "University of Lagos Senate (Medicine, Nursing, Architecture + Prof Job)"
                        : "Lekki Foreign Embassy (Harvard, Oxford & Toronto Study Abroad)"}
                    </h3>

                    {enrolledProgram ? (
                      <div className="p-3 bg-indigo-950/60 border border-indigo-400 rounded-xl flex justify-between items-center">
                        <div>
                          <div className="font-extrabold text-white">Studying: {enrolledProgram.name} ({enrolledProgram.major})</div>
                          <div className="text-amber-300">Progress: {enrolledProgram.completedClasses}/10 Lectures (-{enrolledProgram.energyPerLecture}% En)</div>
                        </div>
                        <button
                          disabled={!!timers.lec_cd}
                          onClick={() => {
                            if (energy < enrolledProgram.energyPerLecture) return setLogMessage(`⚠️ Need ${enrolledProgram.energyPerLecture}% Energy!`);
                            startCooldown("lec_cd", enrolledProgram.timerSeconds);
                            setEnergy((e) => Math.max(5, e - enrolledProgram.energyPerLecture));
                            const nextC = enrolledProgram.completedClasses + 1;
                            if (nextC >= 10) {
                              setCompletedDegrees((d) => [...d, `${enrolledProgram.name} (${enrolledProgram.major})`]);
                              setEnrolledProgram(null);
                              setLogMessage(`🎓 Graduated with ${enrolledProgram.name} in ${enrolledProgram.major}!`);
                            } else {
                              setEnrolledProgram({ ...enrolledProgram, completedClasses: nextC });
                            }
                          }}
                          className="px-4 py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-xl"
                        >
                          {timers.lec_cd ? `⏳ Lecture (${formatSecs(timers.lec_cd)})` : `Attend Lecture #${enrolledProgram.completedClasses + 1}/10`}
                        </button>
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-3 gap-2.5">
                        {(currentBuildingId === "Yaba_Polytechnic"
                          ? [
                              { id: "ND_Nurse", name: "Polytechnic ND", major: "Nursing Science", cost: 240000, en: 40, sec: 60, req: null },
                              { id: "ND_Survey", name: "Polytechnic ND", major: "Land Surveying", cost: 240000, en: 40, sec: 60, req: null },
                              { id: "HND_Tech", name: "Polytechnic HND", major: "Computer & Network Tech", cost: 380000, en: 50, sec: 75, req: "Polytechnic ND" },
                            ]
                          : currentBuildingId === "Unilag_University"
                          ? [
                              { id: "BSC_Med", name: "University B.Sc", major: "Medicine & Surgery (MBBS)", cost: 850000, en: 65, sec: 90, req: null },
                              { id: "BSC_Nurse", name: "University B.Sc", major: "Nursing & Midwifery", cost: 680000, en: 65, sec: 90, req: null },
                              { id: "BSC_Acc", name: "University B.Sc", major: "Accounting & Finance", cost: 680000, en: 65, sec: 90, req: null },
                              { id: "MSC_Local", name: "Masters (M.Sc)", major: "Advanced Management", cost: 1450000, en: 80, sec: 100, req: "University B.Sc" },
                              { id: "PHD_Local", name: "Doctorate (Ph.D)", major: "Academic Research", cost: 2900000, en: 95, sec: 120, req: "Masters (M.Sc)" },
                            ]
                          : [
                              { id: "AB_Toronto", name: "Univ. of Toronto (M.Sc)", major: "Global Engineering", cost: 3200000, en: 80, sec: 100, req: "University B.Sc" },
                              { id: "AB_Oxford", name: "Oxford University (M.Sc)", major: "International Finance", cost: 4200000, en: 85, sec: 110, req: "University B.Sc" },
                              { id: "AB_Harvard", name: "Harvard University (Ph.D/MBA)", major: "Executive Leadership", cost: 6500000, en: 95, sec: 120, req: "Masters" },
                            ]
                        ).map((deg) => (
                          <div key={deg.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5">
                            <div className="font-bold text-white">{deg.name}</div>
                            <div className="text-xs text-cyan-300">Major: {deg.major}</div>
                            <div className="text-[10px] text-amber-400">{deg.cost.toLocaleString()} g₦ • -{deg.en}% En/class</div>
                            <button
                              onClick={() => {
                                if (deg.req && !completedDegrees.some((d) => d.includes(deg.req))) {
                                  return setLogMessage(`❌ Prerequisite: Complete ${deg.req} first!`);
                                }
                                if (spendMoney(deg.cost)) {
                                  setEnrolledProgram({ id: deg.id, name: deg.name, major: deg.major, totalClasses: 10, completedClasses: 0, energyPerLecture: deg.en, timerSeconds: deg.sec });
                                }
                              }}
                              className="w-full py-1.5 bg-indigo-600 text-white font-bold rounded-lg"
                            >
                              Enroll (10 Lectures)
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* CAMPUS LECTURER / PROFESSOR VACANCIES */}
                    <div className="border-t border-slate-800 pt-3 flex flex-wrap gap-3">
                      <button
                        onClick={() => {
                          if (!completedDegrees.some((d) => d.includes("M.Sc"))) return setLogMessage("❌ Lecturer Vacancy requires a Masters (M.Sc) degree!");
                          receiveEarnedMoney(280000, "Campus Lecturer Teaching Shift");
                        }}
                        className="px-4 py-2 bg-cyan-600 text-white font-bold rounded-xl"
                      >
                        👨🏾‍🏫 Work as Campus Lecturer (Req: M.Sc • +280,000 c₦)
                      </button>
                      <button
                        onClick={() => {
                          if (!completedDegrees.some((d) => d.includes("Ph.D") || d.includes("Harvard"))) return setLogMessage("❌ Professor Chair requires a Doctorate (Ph.D) or Harvard degree!");
                          receiveEarnedMoney(650000, "Senior University Professor Shift");
                        }}
                        className="px-4 py-2 bg-amber-500 text-slate-950 font-extrabold rounded-xl"
                      >
                        🎓 Work as Senior Professor (Req: Ph.D/Harvard • +650,000 c₦)
                      </button>
                    </div>
                  </div>
                )}

                {/* INTERIOR 8: SEPARATE BUSINESS & BLUEPRINT SCHOOL (SURULERE — HIGHER PRICES + 3-STEP GUIDED FLOW!) */}
                {currentBuildingId === "Business_Blueprint_School" && (
                  <div className="p-4 bg-slate-950 border-2 border-emerald-500 rounded-2xl space-y-4">
                    <h3 className="font-extrabold text-sm text-emerald-400">
                      💼 Inside Lagos Business &amp; Blueprint School (Separate from Academic Schools!)
                    </h3>
                    <div className="p-3 bg-emerald-950/40 border border-emerald-600 rounded-xl text-[11px] text-emerald-200">
                      📘 <strong>HOW BLUEPRINTS WORK (3-STEP KNOWLEDGE &amp; CONSTRUCTION PIPELINE):</strong><br />
                      <strong>Step 1 (Gain Knowledge Here):</strong> Purchase &amp; study the Blueprint below so you understand how to operate the business.<br />
                      <strong>Step 2 (Paid Architectural Design):</strong> Travel to <strong>Yaba Architectural Studio</strong> on the Map and pay them to draw your structural plan.<br />
                      <strong>Step 3 (Paid Construction &amp; Bricklayers):</strong> Travel to <strong>Berger Construction HQ</strong> to spawn your Live Construction Site!
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="font-bold text-amber-400 uppercase">1. Enterprise Operational Blueprints</div>
                        {[
                          { id: "BP_Food_Kiosk", name: "🏪 Roadside Food Kiosk Blueprint (2 Staff)", cost: 550000 },
                          { id: "BP_Small_Eatery", name: "🍲 Small Eatery Blueprint (6 Staff)", cost: 1100000 },
                          { id: "BP_Mega_Rest", name: "🏢 Mega Restaurant Blueprint (15 Staff)", cost: 2200000 },
                          { id: "BP_Arch_Firm", name: "📐 Architectural & Survey Firm Blueprint", cost: 1800000 },
                        ].map((bp) => (
                          <button
                            key={bp.id}
                            disabled={ownedBlueprints.includes(bp.id)}
                            onClick={() => {
                              if (spendMoney(bp.cost)) {
                                setOwnedBlueprints((p) => [...p, bp.id]);
                                setLogMessage(`📘 Step 1 Complete (${bp.name})! Next: Travel to Yaba Architectural Studio on the Map for Step 2.`);
                              }
                            }}
                            className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex justify-between font-bold disabled:opacity-40"
                          >
                            <span>{ownedBlueprints.includes(bp.id) ? `✓ Step 1 Done: ${bp.name}` : bp.name}</span>
                            <span className="text-amber-400">{(bp.cost / 1000).toFixed(0)}k g₦</span>
                          </button>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <div className="font-bold text-cyan-400 uppercase">2. High-Tier Specialist &amp; Chartered Certifications</div>
                        {[
                          { id: "Cert_Rice", name: "🍚🍲 Combined Master of Rice, Jollof, Soup & Culinary Cert", cost: 550000 },
                          { id: "Cert_Surveyor", name: "🧭 Licensed Land Surveyor Blueprint", cost: 850000 },
                          { id: "Cert_Architect", name: "📐 Structural Architect Blueprint", cost: 1500000 },
                          { id: "ICAN", name: "📊 ICAN Chartered Accountant Cert", cost: 950000 },
                          { id: "PMP", name: "📋 PMP Executive Project Director Cert", cost: 1100000 },
                        ].map((sc) => (
                          <button
                            key={sc.id}
                            disabled={specialistCerts.includes(sc.id) || professionalCerts.includes(sc.id)}
                            onClick={() => {
                              if (spendMoney(sc.cost)) {
                                setSpecialistCerts((s) => [...s, sc.id]);
                                setProfessionalCerts((p) => [...p, sc.id]);
                                setLogMessage(`🏅 Earned ${sc.name}!`);
                              }
                            }}
                            className="w-full p-2.5 bg-slate-900 border border-cyan-800 rounded-xl flex justify-between font-bold disabled:opacity-40"
                          >
                            <span className="truncate pr-2">{sc.name}</span>
                            <span className="text-cyan-400 shrink-0">{(sc.cost / 1000).toFixed(0)}k g₦</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* INTERIOR 9: STEP 2 (YABA ARCHITECTURAL STUDIO) & STEP 3 (BERGER CONSTRUCTION YARD) */}
                {currentBuildingId === "Architect_Firm" && (
                  <div className="p-4 bg-slate-950 border-2 border-cyan-500 rounded-2xl space-y-3">
                    <h3 className="font-extrabold text-sm text-cyan-400">
                      📐 Inside Yaba Architectural Studio — STEP 2: Pay Architect to Stamp Your Blueprint Plan
                    </h3>
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
                                setLogMessage(`📐 Step 2 Complete! Architect stamped ${bp}. Next: Travel to Julius Berger Construction HQ in Berger for Step 3!`);
                              }
                            }}
                            className="p-3 bg-slate-900 border border-cyan-600 rounded-xl font-bold flex justify-between disabled:opacity-40"
                          >
                            <span>{architectApprovedBps.includes(bp) ? `✓ Step 2 Stamped: ${bp}` : `Pay Architect Contract for ${bp}`}</span>
                            <span className="text-amber-400">350,000 g₦</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {currentBuildingId === "Builder_Yard" && (
                  <div className="p-4 bg-slate-950 border-2 border-orange-500 rounded-2xl space-y-3">
                    <h3 className="font-extrabold text-sm text-orange-400">
                      🏗️ Inside Julius Berger Construction HQ — STEP 3: Award Construction Contract (Spawns Live Site Needing Bricklayers!)
                    </h3>
                    {architectApprovedBps.length === 0 ? (
                      <p className="text-rose-400">❌ Complete Step 2 at Yaba Architectural Studio first!</p>
                    ) : (
                      <div className="grid sm:grid-cols-2 gap-3">
                        {architectApprovedBps.map((bp) => (
                          <button
                            key={bp}
                            onClick={() => {
                              if (spendMoney(950000)) {
                                const newSiteId = `site_${Date.now()}`;
                                setActiveConstructionSites((prev) => [
                                  ...prev,
                                  {
                                    id: newSiteId,
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
                                    maxStaff: 6,
                                    maxCust: 45,
                                    revPerHalfDay: 140000,
                                  },
                                ]);
                                setLogMessage(`🏗️ Step 3 Started! Spawned Live Construction Site on the ${area} Street Map (Requires Min 2 Bricklayers)!`);
                              }
                            }}
                            className="p-3 bg-orange-500 text-slate-950 font-extrabold rounded-xl flex justify-between"
                          >
                            <span>Award Construction Contract: {bp}</span>
                            <span>950,000 g₦</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* INTERIOR 10: YABA TECH & PHONE PLAZA (BUY TORCHLIGHT PHONE OR SMARTPHONE!) */}
                {currentBuildingId === "Electronics_Shop" && (
                  <div className="p-4 bg-slate-950 border-2 border-purple-500 rounded-2xl space-y-3">
                    <h3 className="font-extrabold text-sm text-purple-400">📱📺 Inside Yaba Tech, Smartphones &amp; TV Plaza</h3>
                    <div className="grid sm:grid-cols-3 gap-3">
                      <button
                        disabled={phoneOwned !== "None"}
                        onClick={() => { if (spendMoney(25000)) { setPhoneOwned("Torchlight_Phone"); setLogMessage("📲 Bought Torchlight Phone!"); }}}
                        className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-left disabled:opacity-40"
                      >
                        <div className="font-bold text-white">📲 Nokia Torchlight Phone</div>
                        <div className="text-amber-400 font-bold">25,000 g₦ (SMS Alerts)</div>
                      </button>
                      <button
                        disabled={phoneOwned === "Smartphone"}
                        onClick={() => { if (spendMoney(150000)) { setPhoneOwned("Smartphone"); setLogMessage("📱 Bought iPhone/Android Smartphone! Click 'Open Smartphone' in the top bar anytime to check live vacancies!"); }}}
                        className="p-3 bg-slate-900 border border-cyan-600 rounded-xl text-left disabled:opacity-40"
                      >
                        <div className="font-bold text-cyan-300">📱 Lagos Pro Smartphone</div>
                        <div className="text-amber-400 font-bold">150,000 g₦ (Remote Vacancy Board!)</div>
                      </button>
                      <button
                        onClick={() => { if (spendMoney(175000)) { setTvTier("55-Inch Smart TV"); setLogMessage("📺 Bought 55-Inch Smart TV!"); }}}
                        className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-left"
                      >
                        <div className="font-bold text-white">📺 55-Inch 4K Smart TV</div>
                        <div className="text-amber-400 font-bold">175,000 g₦ (+25 Steeze)</div>
                      </button>
                    </div>
                  </div>
                )}

                {/* OTHER INTERIORS (DRIVING ACADEMY, DEALERSHIP, AGENT) */}
                {currentBuildingId === "Driving_School" && (
                  <div className="p-4 bg-slate-950 border-2 border-yellow-500 rounded-2xl flex flex-wrap gap-3">
                    <button disabled={drivingLessonsDone >= 3 || !!timers.drv_cd} onClick={() => { if (spendMoney(35000)) { startCooldown("drv_cd", 60); setDrivingLessonsDone((d) => d + 1); }}} className="px-4 py-2 bg-amber-500 text-slate-950 font-extrabold rounded-xl">
                      {timers.drv_cd ? `⏳ Lesson (${formatSecs(timers.drv_cd)})` : drivingLessonsDone >= 3 ? "✓ 3/3 Lessons Done" : `Practical Driving Lesson (${drivingLessonsDone}/3) • 35,000 g₦`}
                    </button>
                    <button disabled={hasDriversLicense || drivingLessonsDone < 3} onClick={() => { if (spendMoney(75000)) { setHasDriversLicense(true); setLogMessage("🪪 Official FRSC Driver's License Issued!"); }}} className="px-4 py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-xl">
                      {hasDriversLicense ? "✓ Licensed Driver" : "Get FRSC Driver's License (75,000 g₦)"}
                    </button>
                  </div>
                )}

                {currentBuildingId === "Auto_Dealership" && (
                  <div className="p-4 bg-slate-950 border-2 border-emerald-500 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-extrabold text-sm text-emerald-400">🚗 Inside Berger Motor Fair (Bargain &amp; Buy Cars)</h3>
                      <button onClick={() => { setBargainDiscountPct(10); setLogMessage("🗣️ Negotiated 10% off at the Car Dealership!"); }} className="px-3 py-1 bg-amber-500 text-slate-950 font-extrabold rounded-lg">🗣️ Bargain (-10%)</button>
                    </div>
                    <div className="grid sm:grid-cols-4 gap-2">
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
                          className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-left"
                        >
                          <div className="font-bold text-white">{c.name}</div>
                          <div className="text-emerald-400 font-bold">{(c.cost / 1000000).toFixed(2)}M g₦</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentBuildingId === "Agent_Office" && (
                  <div className="p-4 bg-slate-950 border-2 border-cyan-500 rounded-2xl space-y-3">
                    <h3 className="font-extrabold text-sm text-cyan-400">🏘️ Inside {area} Estate Agent Office</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        { name: `${area} 2-Bedroom Flat`, park: 2, rooms: 2, rent: 320000, buy: 18000000 },
                        { name: `${area} 5-Bed Luxury Duplex`, park: 5, rooms: 5, rent: 1600000, buy: 60000000 },
                      ].map((p, i) => (
                        <div key={i} className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                          <div className="font-bold text-white">{p.name} (🅿️ {p.park} Parking)</div>
                          <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => { if (spendMoney(p.rent)) { setShelterType(p.name); setShelterArea(area); setParkingSlots(p.park); }}} className="py-1.5 bg-cyan-600 text-white font-bold rounded">Rent ({(p.rent / 1000).toFixed(0)}k)</button>
                            <button onClick={() => { if (spendMoney(p.buy)) { setShelterType(p.name); setShelterArea(area); setOwnershipMode("Bought_Owned"); setParkingSlots(p.park); }}} className="py-1.5 bg-amber-500 text-slate-950 font-extrabold rounded">Buy ({(p.buy / 1000000).toFixed(0)}M)</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* =====================================================================
            TAB 2: 🏆 CENTRAL BANK (c₦ -> g₦ +25% CONVERTER & "COMING SOON" CASHOUT VAULT)
           ===================================================================== */}
        {activeTab === "profile" && (
          <div className="grid md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <h2 className="font-bold text-sm text-amber-400">🏆 {username}&apos;s Citizen Dossier</h2>
              <div className="p-3 bg-slate-950 border border-emerald-600 rounded-xl">
                <div className="text-[10px] text-emerald-300 uppercase">Total Net Worth</div>
                <div className="text-lg font-extrabold">{totalNetWorth.toLocaleString()} g₦/c₦</div>
                <div className="text-amber-400 font-bold">{richLevelTitle}</div>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div>📍 <strong>Position:</strong> {exactPosition}</div>
                <div>🎓 <strong>Degrees:</strong> {completedDegrees.join(", ") || "Uneducated"}</div>
                <div>🏅 <strong>Certifications:</strong> {specialistCerts.join(", ") || "None"}</div>
                <div>📱 <strong>Phone:</strong> {phoneOwned} • 🪪 <strong>License:</strong> {hasDriversLicense ? "Verified" : "None"}</div>
              </div>
            </div>

            {/* CONVERT EARNED c₦ TO g₦ WITH +25% WORKING CAPITAL BONUS! */}
            <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-cyan-400">🔄 Convert Earned c₦ to g₦ (+25% Bonus!)</h2>
              <p className="text-slate-400 text-[11px]">
                Need more working capital for blueprints, maids, or houses? Convert your Earned `c₦` into `g₦` and receive a <strong>+25% Bonus</strong>!
              </p>
              <input
                type="number"
                value={convertCnInput}
                onChange={(e) => setConvertCnInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
              />
              <button
                onClick={() => {
                  const amt = Number(convertCnInput) || 0;
                  if (amt <= 0 || earnedBalance < amt) return setLogMessage("❌ Not enough Earned c₦ to convert!");
                  const bonusGn = Math.round(amt * 1.25);
                  setEarnedBalance((e) => e - amt);
                  setStarterBalance((s) => s + bonusGn);
                  setLogMessage(`🔄 Converted ${amt.toLocaleString()} c₦ into +${bonusGn.toLocaleString()} g₦ (+25% Working Capital Bonus)!`);
                }}
                className="w-full py-2.5 bg-cyan-500 text-slate-950 font-extrabold rounded-xl"
              >
                Convert c₦ -&gt; g₦ (+25% Bonus Capital)
              </button>
            </div>

            {/* CENTRAL BANK BUY-IN & "COMING SOON" c₦ ACCUMULATION VAULT */}
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

              <div className="p-3 bg-emerald-950/40 border border-emerald-600 rounded-xl text-center space-y-1">
                <div className="font-extrabold text-emerald-300">🔒 Real Naira Cashout: COMING SOON</div>
                <div className="text-[10px] text-slate-300">
                  Accumulate your Earned <strong>c₦ ({earnedBalance.toLocaleString()} c₦)</strong> now before the official Central Bank withdrawal window opens!
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* SMARTPHONE REMOTE VACANCY MODAL (DIRECTIONS ONLY!) */}
      {showPhoneModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white border-2 border-cyan-400 rounded-2xl max-w-lg w-full p-5 space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-sm text-cyan-400 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4" /> Lagos Live Vacancy App (Directions Only — Close Phone to Travel!)
              </h3>
              <button onClick={() => setShowPhoneModal(false)} className="px-2.5 py-1 bg-slate-800 rounded-lg">Close Phone</button>
            </div>
            <div className="space-y-2">
              {activeConstructionSites.map((s) => (
                <div key={s.id} className="p-2.5 bg-slate-950 border border-amber-500 rounded-xl">
                  <div className="font-bold text-amber-300">🧱 {s.projectName} ({s.area})</div>
                  <div>Needs Bricklayers ({s.currentBricklayers}/{s.maxBricklayers}) • Pay: +{s.payPerShiftCn.toLocaleString()} c₦</div>
                  <div className="text-emerald-400 font-bold">📍 Close phone &amp; travel to {s.area} on the Map!</div>
                </div>
              ))}
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
                <div className="font-bold text-rose-300">👩🏾‍🍳 Surulere Domestic Maid Staffing Agency ({agencyMaidVacanciesCount} Open)</div>
                <div className="text-emerald-400 font-bold">📍 Close phone &amp; travel to Surulere on the Map!</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STREAMLINED MAP-CENTRIC BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 inset-x-0 bg-slate-900/95 backdrop-blur border-t border-slate-800 px-2 py-2 z-40">
        <div className="max-w-md mx-auto grid grid-cols-2 gap-2">
          {[
            { id: "map", label: "🗺️ Interactive Town Map (All Buildings)", icon: <Map className="w-4 h-4" /> },
            { id: "profile", label: "🏦 Dossier & Central Bank (c₦/g₦)", icon: <Award className="w-4 h-4" /> },
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