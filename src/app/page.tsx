"use client";

import React, { useState, useEffect } from "react";
import { 
  Heart, Zap, Utensils, Sparkles, Tv, Home, Map,
  BedDouble, Armchair, Briefcase, GraduationCap, Lock,
  Clock, Award, Wrench, Fuel, Droplets, ZoomOut, ZoomIn,
  Smartphone, ClipboardList, Sun, Sunset, Moon,
  UserSearch, Bath, Flame, Play, ArrowLeft, Truck, FileCheck, AlertCircle, CheckCircle2, HardHat
} from "lucide-react";

type AreaName = "Oshodi" | "Berger" | "Yaba" | "Surulere" | "Lekki";

const AREA_COORDS: Record<AreaName, number> = {
  Berger: 1,
  Oshodi: 2,
  Yaba: 3,
  Surulere: 4,
  Lekki: 6,
};

// AREA STANDARD-OF-LIVING MULTIPLIER (OSHODI CHEAPEST 1.0x -> LEKKI EXPENSIVE 3.0x!)
const AREA_COST_MULTIPLIER: Record<AreaName, number> = {
  Oshodi: 1.0,
  Berger: 1.25,
  Yaba: 1.5,
  Surulere: 1.8,
  Lekki: 3.0,
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

export default function LagosEmpirePerfectedSimulator() {
  // 1. ONBOARDING
  const [isCreated, setIsCreated] = useState(false);
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");

  // 2. 5-MINUTE INTERVAL CLOCK (VERY SLOW & RELAXED ENERGY/DIET DRAIN!)
  const [gameHour, setGameHour] = useState(8);
  const [gameMinute, setGameMinute] = useState(0);
  const [gameDay, setGameDay] = useState(1);
  const [gameWeek, setGameWeek] = useState(1);
  const [weeksUntilRentDue, setWeeksUntilRentDue] = useState(8);
  const [daysUntilRentDue, setDaysUntilRentDue] = useState(56); // 8 Weeks = 56 Days live countdown!
  const [weather, setWeather] = useState("Sunny 32°C");

  const timeOfDayPhase: "Daylight" | "Afternoon_Sunset" | "Night" =
    gameHour >= 6 && gameHour < 15
      ? "Daylight"
      : gameHour >= 15 && gameHour < 19
      ? "Afternoon_Sunset"
      : "Night";

  const isRushHourTraffic = (gameHour >= 7 && gameHour <= 9) || (gameHour >= 16 && gameHour <= 19);

  // 3. INSTANT CENTERED POP-UP MODAL (NO MORE SCROLLING UP TO SEE ERRORS OR ACTIONS!)
  const [popupAlert, setPopupAlert] = useState<{
    type: "error" | "success" | "emergency" | "info";
    title: string;
    message: string;
  } | null>(null);

  const triggerPopup = (type: "error" | "success" | "emergency" | "info", title: string, message: string) => {
    setPopupAlert({ type, title, message });
    setLogMessage(`${title}: ${message}`);
  };

  // 4. UNIVERSAL ACTION COUNTDOWN MODAL (EVERY PURCHASE, BANK BUY, SHOWER, OR ACTION >= 15 SECS!)
  const [activeActionTimer, setActiveActionTimer] = useState<{
    label: string;
    icon: string;
    totalSecs: number;
    remainingSecs: number;
    onComplete: () => void;
  } | null>(null);

  const startTimedAction = (label: string, icon: string, seconds: number, onComplete: () => void) => {
    const min15Secs = Math.max(15, seconds); // Strict rule: Lowest countdown is 15 seconds!
    setActiveActionTimer({
      label,
      icon,
      totalSecs: min15Secs,
      remainingSecs: min15Secs,
      onComplete,
    });
  };

  // 5. CENTRAL BANK (300M RESERVE + 10M DAILY CAP + 15S COUNTDOWN ON BUYING!)
  const [centralBankReserve, setCentralBankReserve] = useState(300000000);
  const [dailyGnBoughtToday, setDailyGnBoughtToday] = useState(0);
  const DAILY_BUY_LIMIT = 10000000;
  const [starterBalance, setStarterBalance] = useState(50000); // g₦
  const [earnedBalance, setEarnedBalance] = useState(0);       // c₦
  const [hospitalLoanDebt, setHospitalLoanDebt] = useState(0);
  const [debtHistoryLog, setDebtHistoryLog] = useState<string[]>([]);
  const [hospitalShieldHoursLeft, setHospitalShieldHoursLeft] = useState(0);
  const [convertCnInput, setConvertCnInput] = useState("50000");

  // 6. STRICT MAP POSITION & LAST-VISITED BUILDING MEMORY (INSTANT RE-ENTRY WITHOUT PAYING FARE AGAIN!)
  const [area, setArea] = useState<AreaName>("Oshodi");
  const [currentBuildingId, setCurrentBuildingId] = useState<string>("My_Home");
  // Remembers which building you are standing directly outside of when you step out!
  const [standingOutsideBuildingId, setStandingOutsideBuildingId] = useState<string>("My_Home");
  const [exactPosition, setExactPosition] = useState<string>("🏠 Inside My Home (Oshodi)");
  const [isMapZoomedOut, setIsMapZoomedOut] = useState(false);
  const [clickedCardForTicket, setClickedCardForTicket] = useState<string>("None");

  // INESCAPABLE FORCED TRANSIT POP-UP (MINIMUM 15 SECONDS!)
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

  // 7. SURVIVAL STATS (SLOW CONSUMPTION!)
  const [health, setHealth] = useState(90);
  const [energy, setEnergy] = useState(60);
  const [hunger, setHunger] = useState(80);
  const [weight, setWeight] = useState(68.0);
  const [steeze, setSteeze] = useState(5);
  const [citizenPoints, setCitizenPoints] = useState(15);
  const [activeGuideTip, setActiveGuideTip] = useState<string>(
    "💡 Every Area has its own School, Maid Agency, Hospital, Market & Eatery! Prices scale by Area (Oshodi 1.0x vs Lekki 3.0x)."
  );

  // 8. DOMESTIC MAID AGENCY & HOUSE MAID
  const [hasHiredMaid, setHasHiredMaid] = useState(false);
  const [maidWeeklyFoodLeft, setMaidWeeklyFoodLeft] = useState(0);
  const [maidTimerSecs, setMaidTimerSecs] = useState(300);
  const [agencyMaidVacanciesCount, setAgencyMaidVacanciesCount] = useState(2);

  // 9. VISUAL 2D HOME + 60-DAY DURABILITY LOCKS + MOVING COMPANY & TENANCY AGREEMENT!
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

  // 60-DAY (2-MONTH) DURABILITY LOCKS SO PLAYERS CANNOT SPAM-BUY PAINT, SOFA, BED, TV OR SHOWER!
  const [durabilityDaysLeft, setDurabilityDaysLeft] = useState<Record<string, number>>({
    Paint_Cream: 0,
    Paint_Emerald: 0,
    Paint_RoyalBlue: 0,
    Bed_Foam: 0,
    Bed_King: 0,
    Sofa_Cushion: 0,
    TV_32: 0,
    TV_55: 0,
    Shower_Cooldown_Hours: 0,
  });

  // ESTATE AGENT TENANCY AGREEMENT MODAL, 4-DAY BUY COUNTDOWN & MOVING TRUCK STATE!
  const [selectedTenancyOffer, setSelectedTenancyOffer] = useState<{
    id: string;
    name: string;
    area: AreaName;
    rooms: number;
    park: number;
    baseRent: number;
    agentFee: number;
    agreementFee: number;
    damagesCaution: number;
    totalPackage: number;
    buyOutrightPrice: number;
  } | null>(null);

  // Tracks rented apartments, locking re-payment, tracking the 4-Day Countdown before Buying unlocks, and Moving Goods!
  const [rentedLeaseRecord, setRentedLeaseRecord] = useState<{
    propertyId: string;
    name: string;
    area: AreaName;
    park: number;
    daysLeftBeforeCanBuy: number; // 4 Days countdown before player can purchase the rented building!
    buyPrice: number;
    goodsMovedToNewHouse: boolean; // Must hire Moving Company to move goods!
  } | null>(null);

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

  // 10. DRIVING LICENSE (75K) & CARS
  const [hasDriversLicense, setHasDriversLicense] = useState(false);
  const [drivingLessonsDone, setDrivingLessonsDone] = useState(0);
  const [carsOwned, setCarsOwned] = useState<string[]>([]);
  const [activeCar, setActiveCar] = useState<string>("None");
  const [carPetrol, setCarPetrol] = useState(100);
  const [carRadiatorWater, setCarRadiatorWater] = useState(100);
  const [carEngineHealth, setCarEngineHealth] = useState(100);

  // 11. SCHOOLS, MAJORS & BLUEPRINTS
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

  // 12. UNDER-CONSTRUCTION FACILITIES (LOCKED UNTIL COMPLETED BY BRICKLAYERS & TIMER!)
  const [activeConstructionSites, setActiveConstructionSites] = useState<{
    id: string;
    projectName: string;
    facilityType: string;
    ownerName: string;
    area: AreaName;
    timeRemainingSecs: number;
    minBricklayers: number;
    maxBricklayers: number;
    currentBricklayers: number;
    playerWorkedHere: boolean;
    payPerShiftCn: number;
    isCompletedAndUnlocked: boolean; // Cannot enter the facility interior until completed!
  }[]>([
    {
      id: "site_oshodi_mall",
      projectName: "Oshodi Ultra-Modern Tech Mall (Under Construction)",
      facilityType: "Commercial Tech Plaza",
      ownerName: "Alhaji Musa",
      area: "Oshodi",
      timeRemainingSecs: 3600,
      minBricklayers: 2,
      maxBricklayers: 5,
      currentBricklayers: 1,
      playerWorkedHere: false,
      payPerShiftCn: 9500,
      isCompletedAndUnlocked: false,
    },
    {
      id: "site_lekki_duplex",
      projectName: "Chief Balogun's Lekki Waterfront Club (Under Construction)",
      facilityType: "VIP Lounge & Estate",
      ownerName: "Chief Balogun",
      area: "Lekki",
      timeRemainingSecs: 5400,
      minBricklayers: 2,
      maxBricklayers: 6,
      currentBricklayers: 1,
      playerWorkedHere: false,
      payPerShiftCn: 14000,
      isCompletedAndUnlocked: false,
    },
  ]);

  // 13. PUBLIC CITIZEN DIRECTORY
  const [inspectedCitizen, setInspectedCitizen] = useState<{
    handle: string;
    name: string;
    houseType: string;
    carDriven: string;
    degrees: string;
    debtAmountCn: number;
  } | null>(null);

  const otherCitizensList = [
    {
      handle: "@bola_oshodi",
      name: "Bola Adeyemi",
      houseType: "Single Room (Shared Kitchen & Bath)",
      carDriven: "None (Uses Danfo Bus)",
      degrees: "Uneducated",
      debtAmountCn: 120000,
    },
    {
      handle: "@chidinma_yaba",
      name: "Chidinma Okafor",
      houseType: "2-Bedroom Flat (En-Suite Kitchen & Bath)",
      carDriven: "Tokunbo Toyota Corolla",
      degrees: "University B.Sc (Nursing) + ICAN",
      debtAmountCn: 0,
    },
    {
      handle: "@tunde_lekki",
      name: "Engr. Tunde Balogun",
      houseType: "5-Bed Luxury Duplex",
      carDriven: "Mercedes-AMG G63 G-Wagon",
      degrees: "Harvard University (Ph.D/MBA)",
      debtAmountCn: 380000,
    },
  ];

  // 14. ACTIVE BUSINESSES, POLITICS, COURTSHIP & GYM
  const [activeBusinesses, setActiveBusinesses] = useState<{
    name: string;
    area: AreaName;
    foodStockRemaining: number;
    collectionsUsedThisCycle: number;
    revenuePerHalfDay: number;
    hasRiceSpecialist: boolean;
    hasSoupSpecialist: boolean;
    hasMaltSpecialist: boolean;
  }[]>([]);

  const [partyStatus, setPartyStatus] = useState<"None" | "Member_JPC">("None");
  const [partyDaysAttended, setPartyDaysAttended] = useState<number>(0);
  const [nominationStatus, setNominationStatus] = useState<"None" | "Submitted_Verified">("None");
  const [hasVoted, setHasVoted] = useState(false);
  const [maritalStatus, setMaritalStatus] = useState<"Single" | "Courting" | "Married">("Single");
  const [partnerName, setPartnerName] = useState("None");
  const [datesCompleted, setDatesCompleted] = useState(0);
  const [gymPlan, setGymPlan] = useState<"None" | "1_Hour_Pass" | "Weekly_Plan" | "Monthly_VIP">("None");

  const [activeTab, setActiveTab] = useState<"map" | "profile">("map");
  const [logMessage, setLogMessage] = useState(
    "Welcome! Game time advances in 5-minute intervals with slow, realistic Diet/Energy drain. Every action & purchase has a 15s+ countdown and instant Pop-Up alerts!"
  );

  const maxEnergyCap = bedTier === "Bare_Floor" ? 60 : bedTier === "Foam_Mattress" ? 85 : 100;
  const areaMult = AREA_COST_MULTIPLIER[area];
  const areaPrice = (base: number) => Math.round(base * areaMult);

  const receiveEarnedMoney = (amount: number, sourceLabel: string) => {
    if (hospitalLoanDebt > 0) {
      const deduction = Math.min(hospitalLoanDebt, Math.floor(amount * 0.4));
      const netPay = amount - deduction;
      setHospitalLoanDebt((d) => d - deduction);
      setEarnedBalance((e) => e + netPay);
      triggerPopup(
        "info",
        "🏥 Debt Garnishment Applied",
        `Earned +${amount.toLocaleString()} c₦ from ${sourceLabel}, auto-paid -${deduction.toLocaleString()} c₦ toward your Debt! Net added: +${netPay.toLocaleString()} c₦.`
      );
    } else {
      setEarnedBalance((e) => e + amount);
      triggerPopup("success", "💰 Payment Received!", `+${amount.toLocaleString()} c₦ added from ${sourceLabel}!`);
    }
  };

  // SPEND MONEY WITH INSTANT CENTERED POP-UP IF INSUFFICIENT FUNDS!
  const spendMoney = (rawCost: number, applyBargain = false): boolean => {
    const cost = applyBargain && bargainDiscountPct > 0 ? Math.round(rawCost * (1 - bargainDiscountPct / 100)) : rawCost;
    const total = starterBalance + earnedBalance;
    if (total < cost) {
      triggerPopup(
        "error",
        "❌ Insufficient Funds!",
        `You need ${cost.toLocaleString()} g₦/c₦ for this transaction, but your combined balance is only ${total.toLocaleString()} g₦/c₦.`
      );
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

  // MASTER ENGINE: 1-SECOND TICK FOR TIMERS + 3-SECOND TICK FOR 5-MINUTE GAME CLOCK (SLOW DIET/ENERGY CONSUMPTION!)
  useEffect(() => {
    let tickCounter = 0;
    const interval = setInterval(() => {
      tickCounter += 1;

      // 1. Tick Universal Action / Purchase Countdown Modal (>= 15s)
      setActiveActionTimer((prev) => {
        if (!prev) return null;
        if (prev.remainingSecs <= 1) {
          prev.onComplete();
          return null;
        }
        return { ...prev, remainingSecs: prev.remainingSecs - 1 };
      });

      // 2. Tick Forced Transit Pop-Up Modal (>= 15s)
      setForcedTransitPopup((prev) => {
        if (!prev) return null;
        if (prev.remainingSecs <= 1) {
          setArea(prev.targetArea);
          setCurrentBuildingId(prev.targetBuildingId);
          setStandingOutsideBuildingId(prev.targetBuildingId);
          setClickedCardForTicket("None");
          setExactPosition(`${prev.toIcon} Inside ${prev.toLabel} (${prev.targetArea})`);
          setIsMapZoomedOut(false);
          return null;
        }
        return { ...prev, remainingSecs: prev.remainingSecs - 1 };
      });

      // 3. Tick Active Construction Sites & Unlock When Completed!
      setActiveConstructionSites((sites) =>
        sites.map((s) => {
          const nextTime = Math.max(0, s.timeRemainingSecs - 1);
          const unlocked = nextTime === 0 && s.currentBricklayers >= s.minBricklayers;
          return { ...s, timeRemainingSecs: nextTime, isCompletedAndUnlocked: unlocked };
        })
      );

      // 4. Tick 5-Minute House Maid Automation
      if (hasHiredMaid) {
        setMaidTimerSecs((prev) => {
          if (prev <= 1) {
            if (maidWeeklyFoodLeft > 0 && gasKg >= 0.4) {
              setMaidWeeklyFoodLeft((f) => f - 1);
              setGasKg((g) => Number(Math.max(0, g - 0.4).toFixed(1)));
              setHealth((h) => Math.max(h, 95));
              setEnergy((e) => Math.max(e, maxEnergyCap));
              setHunger((b) => Math.max(b, 95));
              triggerPopup("success", "👩🏾‍🍳 House Maid Auto-Care", "Your Maid cooked with 0.4kg Gas and restored your Health, Energy & Belly!");
            }
            return 300;
          }
          return prev - 1;
        });
      }

      // 5. Advance Main Game Clock by 5 MINUTES every 3 real seconds (Very Slow & Comfortable!)
      if (tickCounter % 3 === 0) {
        setGameMinute((m) => {
          if (m < 55) return m + 5; // 5-Minute Intervals!
          // Full Hour Reached (Every 36 real seconds):
          setGameHour((h) => {
            const nextH = h >= 23 ? 0 : h + 1;
            if (nextH >= 20 || nextH <= 5) setWeather("Warm Night");
            else if (nextH === 14 || nextH === 15) setWeather("Heavy Lagos Rain");
            else if (nextH >= 6 && nextH <= 10) setWeather("Harmattan Haze");
            else setWeather("Sunny 32°C");

            setHospitalShieldHoursLeft((sh) => Math.max(0, sh - 1));
            setDurabilityDaysLeft((dur) => ({
              ...dur,
              Shower_Cooldown_Hours: Math.max(0, (dur.Shower_Cooldown_Hours || 0) - 1),
            }));

            // VERY SLOW DIET & ENERGY CONSUMPTION: Only drops by -1% every 2 Game Hours!
            if (nextH % 2 === 0 && hospitalShieldHoursLeft === 0) {
              setHunger((prevHunger) => {
                const nextHunger = Math.max(0, prevHunger - 1);
                if (nextHunger === 0) {
                  setHealth((prevHp) => {
                    const nextHp = Math.max(0, prevHp - 5);
                    if (nextHp <= 15) {
                      const areaHosp = HOSPITAL_AREA_RATES[area];
                      setHunger(100);
                      setEnergy(maxEnergyCap);
                      setHospitalShieldHoursLeft(48);
                      setCurrentBuildingId("Hospital");
                      setStandingOutsideBuildingId("Hospital");
                      setExactPosition(`🏥 Admitted Inside ${areaHosp.name} (${area})`);
                      setHospitalLoanDebt((debt) => debt + areaHosp.emergencyLoanDebt);
                      setDebtHistoryLog((logs) => [
                        `Emergency Admission at ${areaHosp.name} (${area}): +${areaHosp.emergencyLoanDebt.toLocaleString()} c₦ Debt`,
                        ...logs,
                      ]);
                      triggerPopup(
                        "emergency",
                        `🚑 EMERGENCY COLLAPSE IN ${area.toUpperCase()}!`,
                        `You were rushed to ${areaHosp.name}! Health, Energy & Belly restored to 100% (+48h Shield). +${areaHosp.emergencyLoanDebt.toLocaleString()} c₦ added to your Debt Ledger!`
                      );
                      return 100;
                    }
                    return nextHp;
                  });
                }
                return nextHunger;
              });
              setEnergy((prevE) => Math.max(10, prevE - 1));
            }

            if (h >= 23) {
              setDailyGnBoughtToday(0);
              setGameDay((d) => {
                const nd = d + 1;
                if (currentBuildingId === "Party_Secretariat") {
                  setPartyDaysAttended((pd) => pd + 1);
                }
                // Tick 60-Day Furniture/Paint Durability & 4-Day Rented Apartment Buy Countdown!
                setDurabilityDaysLeft((dur) => {
                  const nextDur: Record<string, number> = {};
                  for (const k in dur) {
                    nextDur[k] = k === "Shower_Cooldown_Hours" ? dur[k] : Math.max(0, dur[k] - 1);
                  }
                  return nextDur;
                });

                setRentedLeaseRecord((rec) =>
                  rec ? { ...rec, daysLeftBeforeCanBuy: Math.max(0, rec.daysLeftBeforeCanBuy - 1) } : null
                );

                // Tick Live Rent Due Countdown (Days & Weeks)
                if (ownershipMode === "Rented") {
                  setDaysUntilRentDue((remDays) => {
                    const nextRem = Math.max(0, remDays - 1);
                    setWeeksUntilRentDue(Math.ceil(nextRem / 7));
                    if (nextRem === 0) {
                      setShelterType("Evicted — Under the Bridge");
                      setParkingSlots(0);
                      triggerPopup("emergency", "🚨 RENT EVICTION!", "Your 8-week lease expired without renewal! You have been evicted.");
                    }
                    return nextRem;
                  });
                }

                if (nd % 7 === 0) {
                  setGameWeek((w) => w + 1);
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
          return 0;
        });
      }
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

  // EVERY SINGLE AREA NOW HAS ALL ESSENTIAL BUILDINGS (SCHOOL, MAID AGENCY, HOSPITAL, MARKET, EATERY, GYM, AGENT, VACANCY STAND)!
  const getAreaBuildings = (a: AreaName): MapBuilding[] => {
    const mult = AREA_COST_MULTIPLIER[a];
    const hosp = HOSPITAL_AREA_RATES[a];
    return [
      { id: "Vacancy_Stand", roofStyle: "bg-emerald-600 rounded-t-full", icon: "📋", name: `${a} Vacancy Notice Stand`, sub: "Directions to All Live Jobs", distKm: 0.2 },
      { id: "Public_Eatery", roofStyle: "bg-amber-600 rounded-t-3xl", icon: "🍛", name: `${a} Public Eatery (${mult}x Cost)`, sub: `Meals from ${Math.round(2000 * mult).toLocaleString()} g₦`, distKm: 0.7 },
      { id: "Gas_Kitchen_Shop", roofStyle: "bg-teal-600", icon: "🔥", name: `${a} Market & kg Gas Depot`, sub: `Stove, kg Gas & Food (${mult}x)`, distKm: 1.2 },
      { id: "Hospital", roofStyle: "bg-rose-600", icon: "🏥", name: hosp.name, sub: `Cash: ${(hosp.cashCost / 1000).toFixed(0)}k | Debt: ${(hosp.emergencyLoanDebt / 1000).toFixed(0)}k`, distKm: 1.5 },
      { id: "Academic_School", roofStyle: "bg-indigo-600", icon: "🎓", name: `${a} Academic & Degree College`, sub: "ND, HND, B.Sc, M.Sc, Ph.D & Lecturer", distKm: 1.8 },
      { id: "Business_Blueprint_School", roofStyle: "bg-emerald-700", icon: "💼", name: `${a} Business & Blueprint School`, sub: "Step 1 Blueprints, Chefs & ICAN", distKm: 2.1 },
      { id: "Domestic_Maid_Agency", roofStyle: "bg-pink-600", icon: "👩🏾‍🍳", name: `${a} Domestic Maid Agency`, sub: `Hire Maid (${Math.round(485 * mult)}k) or Work`, distKm: 1.6 },
      { id: "Agent_Office", roofStyle: "bg-cyan-600", icon: "🏘️", name: `${a} Estate Agent & Movers`, sub: `Tenancy Form, 4d Buy & Moving Van`, distKm: 2.0 },
      { id: "Gym", roofStyle: "bg-orange-600", icon: "🏋🏾‍♂️", name: `${a} Fitness & Weight Gym`, sub: `Plans from ${Math.round(5000 * mult).toLocaleString()} g₦`, distKm: 1.9 },
      { id: "Furniture_Electronics", roofStyle: "bg-purple-600", icon: "📺", name: `${a} Furniture, TV & Phone Plaza`, sub: "60-Day Durable Beds, Sofa, TV & Phone", distKm: 2.3 },
      { id: "Architect_Builder_HQ", roofStyle: "bg-amber-700", icon: "📐", name: `${a} Architect, Builder & Eatery HQ`, sub: "Stamp Plans, Spawn Sites & Run Biz", distKm: 2.6 },
      { id: "Driving_Auto_Center", roofStyle: "bg-yellow-600", icon: "🚗", name: `${a} Driving School, Cars & Fuel`, sub: "75k License, 8 Cars, Petrol & Engine", distKm: 2.9 },
      { id: "Corporate_Party_Center", roofStyle: "bg-blue-700", icon: "🏛️", name: `${a} Corporate Towers, Politics & Lounge`, sub: "Jobs, 3-Day Party & 10-Date Courtship", distKm: 2.5 },
    ];
  };

  // MINIMUM 15-SECOND TRANSIT COUNTDOWN RULE!
  const getStreetTransitTicket = (target: MapBuilding, isGoingHome = false) => {
    const returnMultiplier = isGoingHome ? 1.25 : 1.0;
    const trafficTimeMult = isRushHourTraffic ? 1.4 : 1.0;
    const km = target.distKm;

    return {
      km,
      trekSecs: Math.max(20, Math.round(km * 14)),
      trekEnergy: Math.min(35, Math.max(4, Math.round(km * 5))),
      busCost: Math.round(km * 450 * areaMult * returnMultiplier),
      busSecs: Math.max(16, Math.round(km * 9 * trafficTimeMult)),
      cabCost: Math.round(km * 1100 * areaMult * returnMultiplier),
      cabSecs: Math.max(15, Math.round(km * 6 * trafficTimeMult)), // Lowest is 15 seconds!
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
        return triggerPopup("error", "⚠️ Too Exhausted to Trek!", "Your Energy is too low to trek this distance. Take a Bus or Cab!");
      }
      setEnergy((e) => Math.max(5, e - t.trekEnergy));
    } else if (mode === "bus") {
      if (!spendMoney(busCost)) return;
    } else if (mode === "cab") {
      if (!spendMoney(cabCost)) return;
    } else if (mode === "car") {
      if (carsOwned.length === 0) return triggerPopup("error", "❌ No Personal Car!", "You do not own a car yet.");
      if (!hasDriversLicense) return triggerPopup("error", "🚓 FRSC License Required!", "Obtain your 75,000 g₦ Driver's License first!");
      if (carPetrol < 5 || carRadiatorWater < 5) return triggerPopup("error", "⛽ Low Fuel/Water!", "Refill Petrol & Radiator Water first!");
      setCarPetrol((p) => Math.max(0, p - 5));
      setCarRadiatorWater((w) => Math.max(0, w - 4));
      setCarEngineHealth((h) => Math.max(10, h - 2));
    }

    const rawSecs =
      customDistKm
        ? mode === "bus"
          ? Math.round(distKm * 1.5)
          : Math.round(distKm * 1.0)
        : mode === "trek"
        ? t.trekSecs
        : mode === "bus"
        ? t.busSecs
        : t.cabSecs;

    const waitSecs = Math.max(15, rawSecs); // Enforce 15-second minimum countdown!
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
            ✓ 100% AUDITED MASTER — ZERO MISSING FEATURES
          </div>
          <h1 className="text-2xl font-extrabold mb-2">Begin Your Lagos Life</h1>
          <p className="text-slate-400 text-sm mb-6">
            5-minute clock intervals with slow Diet/Energy drain, instant Pop-Up alerts, full Tenancy Agreement + Moving Van, 60-day furniture durability locks, and all buildings in every Area!
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

  // Helper to render In-Card Transport OR Instant Re-Entry if player is already standing right outside this building!
  const renderInCardTicketSelector = (b: MapBuilding, isHome = false) => {
    const isStandingRightOutside = standingOutsideBuildingId === b.id;
    const t = getStreetTransitTicket(b, isHome);

    if (isStandingRightOutside) {
      return (
        <div
          onClick={(e) => e.stopPropagation()}
          className="mt-3 pt-3 border-t border-emerald-500/50 bg-emerald-950/50 p-2.5 rounded-xl space-y-2 text-left"
        >
          <div className="text-[10px] font-extrabold text-emerald-300">
            📍 You are standing right outside {b.name}! No Bus or Cab needed:
          </div>
          <button
            onClick={() => {
              setCurrentBuildingId(b.id);
              setClickedCardForTicket("None");
              setExactPosition(`${b.icon} Inside ${b.name} (${area})`);
            }}
            className="w-full py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-lg text-xs"
          >
            🚪 Step Right Back Inside {b.name} (₦0 • Instant)
          </button>
        </div>
      );
    }

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
      {/* =====================================================================
          1. INSTANT CENTERED POP-UP ALERT MODAL (NO SCROLLING UP!)
         ===================================================================== */}
      {popupAlert && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div
            className={`max-w-md w-full rounded-3xl p-6 border-2 shadow-2xl space-y-4 text-white ${
              popupAlert.type === "error" || popupAlert.type === "emergency"
                ? "bg-rose-950 border-rose-500"
                : popupAlert.type === "success"
                ? "bg-emerald-950 border-emerald-400"
                : "bg-slate-900 border-amber-400"
            }`}
          >
            <div className="flex items-center gap-3">
              {popupAlert.type === "error" || popupAlert.type === "emergency" ? (
                <AlertCircle className="w-8 h-8 text-rose-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
              )}
              <h3 className="font-extrabold text-lg">{popupAlert.title}</h3>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">{popupAlert.message}</p>
            <button
              onClick={() => setPopupAlert(null)}
              className="w-full py-3 bg-white text-slate-950 font-extrabold rounded-xl text-sm hover:bg-slate-200"
            >
              OK, Got It
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          2. UNIVERSAL TIMED ACTION / PURCHASE MODAL (MINIMUM 15 SECS COUNTDOWN!)
         ===================================================================== */}
      {activeActionTimer && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border-2 border-emerald-400 rounded-3xl p-6 text-white shadow-2xl space-y-4 text-center">
            <div className="text-4xl animate-bounce">{activeActionTimer.icon}</div>
            <h3 className="font-extrabold text-base text-emerald-300">{activeActionTimer.label}</h3>
            <div className="text-2xl font-extrabold text-amber-400">
              ⏳ {activeActionTimer.remainingSecs}s Remaining
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-emerald-500 transition-all duration-700"
                style={{
                  width: `${
                    ((activeActionTimer.totalSecs - activeActionTimer.remainingSecs) /
                      activeActionTimer.totalSecs) *
                    100
                  }%`,
                }}
              />
            </div>
            <p className="text-xs text-slate-400">Processing action... Please wait until the countdown completes.</p>
          </div>
        </div>
      )}

      {/* =====================================================================
          3. INESCAPABLE FORCED TRANSIT POP-UP MODAL (MINIMUM 15 SECS!)
         ===================================================================== */}
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
                {/* LIVE RENT DUE DATE & COUNTDOWN */}
                <span className="text-[11px] px-2.5 py-0.5 bg-rose-950 text-rose-300 border border-rose-700 rounded-full font-bold">
                  🏠 Rent Due: {ownershipMode === "Bought_Owned" ? "Owned Forever" : `${weeksUntilRentDue} Wks (${daysUntilRentDue} Days Left)`}
                </span>
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
                • <span className="text-cyan-300 font-bold">📊 {area} Cost Index: {areaMult}x</span>
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
            <StatBar icon={<Heart className="w-3.5 h-3.5 text-rose-400" />} label="Health" value={`${health}%`} pct={health} color="bg-rose-500" onHelp={() => triggerPopup("info", "❤️ Health Indicator", "Restored at the Area Hospital, Gym, or by eating quality meals.")} />
            <StatBar icon={<Zap className="w-3.5 h-3.5 text-amber-400" />} label={`Energy (Cap ${maxEnergyCap}%)`} value={`${energy}%`} pct={energy} color="bg-amber-500" onHelp={() => triggerPopup("info", "⚡ Energy Indicator", "Consumes very slowly (-1% every 2 hours). Sleep in your Bedroom to restore!")} />
            <StatBar icon={<Utensils className="w-3.5 h-3.5 text-orange-400" />} label="Belly/Diet" value={`${hunger}%`} pct={hunger} color="bg-orange-500" onHelp={() => triggerPopup("info", "🍛 Belly/Diet Indicator", "Consumes slowly (-1% every 2 hours). Cook with 0.4kg Gas at Home or eat at an Area Eatery.")} />
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

        {/* =====================================================================
            TAB 1: 🗺️ TOWN MAP & ALL STANDALONE BUILDING INTERFACES
           ===================================================================== */}
        {activeTab === "map" && (
          <div className="space-y-4 text-xs">
            <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-extrabold text-base text-emerald-400">
                  {currentBuildingId !== "Street_Map"
                    ? `🚪 Inside Building: ${exactPosition}`
                    : isMapZoomedOut
                    ? "🗺️ Lagos State Master Map (5 Areas — Standard of Living Scales by Area!)"
                    : `🏙️ ${area} Town Street Map (Standing Outside: ${standingOutsideBuildingId.replaceAll("_", " ")})`}
                </h2>
                <p className="text-slate-400 text-[11px]">
                  {currentBuildingId !== "Street_Map"
                    ? "If you step outside to the street, you can re-enter this same building immediately without taking a bus or cab!"
                    : "Click any building to view transport options—or re-enter the building you just stepped out of for free!"}
                </p>
              </div>
              <div className="flex gap-2">
                {currentBuildingId !== "Street_Map" && (
                  <button
                    onClick={() => {
                      setStandingOutsideBuildingId(currentBuildingId);
                      setCurrentBuildingId("Street_Map");
                      setExactPosition(`🚶🏾‍♂️ Standing Outside ${currentBuildingId.replaceAll("_", " ")} (${area})`);
                    }}
                    className="px-4 py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-xl flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" /> 🚪 Step Outside to {area} Street
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
                {(["Oshodi", "Berger", "Yaba", "Surulere", "Lekki"] as AreaName[]).map((dest) => {
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
                        <div className="text-[11px] text-amber-300 font-bold">
                          Cost of Living: {AREA_COST_MULTIPLIER[dest]}x Base
                        </div>
                        <div className="text-[10px] text-rose-400 mt-1">
                          Hospital Debt: {HOSPITAL_AREA_RATES[dest].emergencyLoanDebt.toLocaleString()} c₦
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
                      sub: `Due: ${weeksUntilRentDue} Wks (${daysUntilRentDue}d) • 2D Room View`,
                      distKm: 1.4,
                    };
                    const showTicket = clickedCardForTicket === "My_Home";
                    const isRightOutside = standingOutsideBuildingId === "My_Home";
                    return (
                      <div
                        onClick={() => setClickedCardForTicket(showTicket ? "None" : "My_Home")}
                        className={`cursor-pointer bg-slate-950 border-2 ${
                          isRightOutside ? "border-emerald-400 ring-2 ring-emerald-400/50" : "border-emerald-500/80"
                        } rounded-2xl overflow-hidden shadow-xl transition flex flex-col justify-between`}
                      >
                        <div className="w-full h-7 bg-emerald-500 flex items-center justify-between px-3 text-[10px] font-extrabold text-slate-950 uppercase">
                          <span>🏡 {isRightOutside ? "STANDING OUTSIDE MY HOME" : "MY RESIDENCE"}</span>
                          <span>{isRightOutside ? "0.0 km (Here)" : "1.4 km"}</span>
                        </div>
                        <div className="p-4 text-center space-y-1.5">
                          <div className="text-4xl">🏠</div>
                          <div className="font-extrabold text-sm text-white">{homeB.name}</div>
                          <div className="text-[11px] text-slate-400">{homeB.sub}</div>
                          {!showTicket && (
                            <div className="inline-block mt-1 px-3 py-1 bg-emerald-500/20 border border-emerald-400 rounded-lg text-[10px] font-extrabold text-emerald-300">
                              {isRightOutside ? "🚪 Click to Re-Enter Home (Instant)" : "🚪 Click Building to Travel Home"}
                            </div>
                          )}
                          {showTicket && renderInCardTicketSelector(homeB, true)}
                        </div>
                      </div>
                    );
                  })()}

                  {/* 2. UNDER-CONSTRUCTION FACILITIES (LOCKED UNTIL COMPLETED!) */}
                  {activeConstructionSites
                    .filter((s) => s.area === area)
                    .map((site) => {
                      const siteB: MapBuilding = {
                        id: site.id,
                        roofStyle: "bg-amber-500",
                        icon: "🏗️",
                        name: site.projectName,
                        sub: site.isCompletedAndUnlocked
                          ? `✅ Completed Facility — Open for Entry!`
                          : `🔒 UNDER CONSTRUCTION (${formatSecs(site.timeRemainingSecs)} • Bricklayers: ${site.currentBricklayers}/${site.maxBricklayers})`,
                        distKm: 1.8,
                      };
                      const showTicket = clickedCardForTicket === site.id;
                      const isRightOutside = standingOutsideBuildingId === site.id;
                      return (
                        <div
                          key={site.id}
                          onClick={() => setClickedCardForTicket(showTicket ? "None" : site.id)}
                          className="cursor-pointer bg-slate-950 border-2 border-amber-500 rounded-2xl overflow-hidden shadow-xl transition flex flex-col justify-between"
                        >
                          <div className="w-full h-7 bg-amber-500 flex items-center justify-between px-3 text-[10px] font-extrabold text-slate-950 uppercase">
                            <span>🚧 {site.isCompletedAndUnlocked ? "COMPLETED FACILITY" : "UNDER CONSTRUCTION"}</span>
                            <span>{isRightOutside ? "0.0 km" : "1.8 km"}</span>
                          </div>
                          <div className="p-4 text-center space-y-1.5">
                            <div className="text-4xl">{site.isCompletedAndUnlocked ? "🏢✨" : "🏗️🧱"}</div>
                            <div className="font-extrabold text-sm text-amber-300">{siteB.name}</div>
                            <div className="text-[11px] text-slate-300">{siteB.sub}</div>
                            {!showTicket && (
                              <div className="inline-block mt-1 px-3 py-1 bg-amber-500/20 border border-amber-400 rounded-lg text-[10px] font-extrabold text-amber-300">
                                {isRightOutside ? "🚪 Click to Enter Site (Instant)" : "🚪 Click to Travel to Site"}
                              </div>
                            )}
                            {showTicket && renderInCardTicketSelector(siteB, false)}
                          </div>
                        </div>
                      );
                    })}

                  {/* 3. ALL AREA ESSENTIAL BUILDINGS */}
                  {getAreaBuildings(area).map((b) => {
                    const showTicket = clickedCardForTicket === b.id;
                    const isRightOutside = standingOutsideBuildingId === b.id;
                    return (
                      <div
                        key={b.id}
                        onClick={() => setClickedCardForTicket(showTicket ? "None" : b.id)}
                        className={`cursor-pointer bg-slate-950 border-2 ${
                          isRightOutside ? "border-emerald-400 ring-2 ring-emerald-400/40" : "border-slate-700 hover:border-amber-400"
                        } rounded-2xl overflow-hidden shadow-xl transition flex flex-col justify-between`}
                      >
                        <div className={`w-full h-7 ${b.roofStyle} flex items-center justify-between px-3 text-[10px] font-extrabold text-white uppercase`}>
                          <span>🏢 {isRightOutside ? "STANDING OUTSIDE" : `${area} BUILDING`}</span>
                          <span>{isRightOutside ? "0.0 km (Here)" : `${b.distKm} km`}</span>
                        </div>
                        <div className="p-4 text-center space-y-1.5">
                          <div className="text-4xl">{b.icon}</div>
                          <div className="font-extrabold text-sm text-white">{b.name}</div>
                          <div className="text-[11px] text-slate-400">{b.sub}</div>
                          {!showTicket && (
                            <div className="inline-block mt-1 px-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-[10px] font-bold text-emerald-300">
                              {isRightOutside ? "🚪 Step Back Inside (Instant)" : `🚪 Click Building (${b.distKm} km)`}
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
                  VIEW 3: STANDALONE BUILDING INTERFACES (WITH TIMED ACTIONS & POPUPS!)
                 =============================================================== */
              <div className="bg-slate-900 text-white border-2 border-emerald-500 rounded-3xl p-6 shadow-2xl space-y-5">
                {/* 1. ORIGINAL VISUAL 2D ROOM CANVAS + 4 ZONES & 60-DAY DURABILITY LOCKS! */}
                {currentBuildingId === "My_Home" && (
                  <div className="grid md:grid-cols-3 gap-5">
                    {/* LEFT 2 COLUMNS: ORIGINAL VISUAL 2D ROOM INTERIOR */}
                    <div className={`md:col-span-2 rounded-2xl border-2 p-6 relative min-h-[410px] flex flex-col justify-between transition-all ${wallBgMap[wallColor]}`}>
                      {/* TOP WALL: LEASE COUNTDOWN & MOUNTED TV */}
                      <div className="flex justify-between items-start gap-2">
                        <div className="space-y-1">
                          <span className="bg-black/75 px-3 py-1 rounded-lg font-extrabold text-emerald-300 block">
                            🏠 {shelterType} in {shelterArea} ({ownershipMode})
                          </span>
                          <span className="bg-black/75 px-3 py-1 rounded-lg text-rose-300 font-bold block">
                            📅 Rent Due Countdown: {ownershipMode === "Bought_Owned" ? "Owned Forever" : `${weeksUntilRentDue} Weeks (${daysUntilRentDue} Days Remaining)`}
                          </span>
                          <span className="bg-black/75 px-3 py-1 rounded-lg text-amber-300 block">
                            🧱 Wall Paint: {wallColor} • 🅿️ Parking: {carsOwned.length}/{parkingSlots} Cars
                          </span>
                        </div>

                        {/* VISUAL MOUNTED TV ON WALL */}
                        <div className="bg-slate-950/90 border-2 border-slate-700 rounded-xl p-3 text-center min-w-[140px] shadow-xl">
                          <div className="text-2xl mb-1">{tvTier === "None" ? "📦" : "📺"}</div>
                          <div className="font-bold text-white">{tvTier === "None" ? "No TV Mounted" : tvTier}</div>
                          {tvTier !== "None" && (
                            <button
                              onClick={() => {
                                if (!hasLagosFlix) return triggerPopup("error", "🍿 LagosFlix Required!", "Subscribe to LagosFlix first!");
                                setShowTvModal(true);
                                setEnergy((e) => Math.min(maxEnergyCap, e + 15));
                              }}
                              className="mt-2 px-3 py-1 bg-rose-600 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 mx-auto"
                            >
                              <Play className="w-3 h-3" /> Watch LagosFlix
                            </button>
                          )}
                        </div>
                      </div>

                      {/* MIDDLE FLOOR: VISUAL 2D BEDROOM, SITTING ROOM, KITCHEN & BATHROOM CORNERS */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
                        <div className="bg-black/60 border border-white/15 rounded-xl p-3 text-center">
                          <div className="text-2xl mb-1">{bedTier === "Bare_Floor" ? "🪵" : bedTier === "Foam_Mattress" ? "🛏️" : "👑"}</div>
                          <div className="text-[10px] text-indigo-300 font-bold">1. Bedroom (Cap {maxEnergyCap}%)</div>
                          <div className="font-extrabold text-white mt-0.5">{bedTier.replace("_", " ")}</div>
                        </div>
                        <div className="bg-black/60 border border-white/15 rounded-xl p-3 text-center">
                          <div className="text-2xl mb-1">{chairTier === "None" ? "🚫" : "🛋️"}</div>
                          <div className="text-[10px] text-amber-300 font-bold">2. Sitting Room</div>
                          <div className="font-extrabold text-white mt-0.5">{chairTier.replace("_", " ")}</div>
                        </div>
                        <div className="bg-black/60 border border-white/15 rounded-xl p-3 text-center">
                          <div className="text-2xl mb-1">{hasCookingStove ? "🔥" : "🍳"}</div>
                          <div className="text-[10px] text-emerald-300 font-bold">
                            3. {shelterType.includes("Single Room") ? "Shared Kitchen" : "Private Kitchen"}
                          </div>
                          <div className="font-extrabold text-white mt-0.5">Gas: {gasKg} kg • {rawFoodServings} Meals</div>
                        </div>
                        <div className="bg-black/60 border border-white/15 rounded-xl p-3 text-center">
                          <div className="text-2xl mb-1">🚿</div>
                          <div className="text-[10px] text-cyan-300 font-bold">
                            4. {shelterType.includes("Single Room") ? "Shared Bathroom" : "En-Suite Bath"}
                          </div>
                          <div className="font-extrabold text-white mt-0.5">
                            {durabilityDaysLeft.Shower_Cooldown_Hours > 0 ? `Wait ${durabilityDaysLeft.Shower_Cooldown_Hours}h` : "Ready"}
                          </div>
                        </div>
                      </div>

                      {/* BOTTOM BAR: TIMED SLEEP (20S), TIMED COOKING (20S) & TIMED SHOWER (15S + 12H COOLDOWN!) */}
                      <div className="bg-black/70 p-3 rounded-xl border border-white/15 grid sm:grid-cols-3 gap-2">
                        <button
                          onClick={() => {
                            startTimedAction("🛌 Sleeping Overnight in Bedroom...", "🛌", 20, () => {
                              setEnergy(maxEnergyCap);
                              setGameDay((d) => d + 1);
                              setDailyGnBoughtToday(0);
                              triggerPopup("success", "🛌 Woke Up Refreshed!", `Slept overnight! Energy restored to ${maxEnergyCap}%.`);
                            });
                          }}
                          className="py-2 bg-indigo-600 text-white font-extrabold rounded-xl"
                        >
                          🛌 Sleep (20s Timer)
                        </button>
                        <button
                          onClick={() => {
                            if (!hasCookingStove || gasKg < 0.4 || rawFoodServings < 1) {
                              return triggerPopup("error", "❌ Cannot Cook!", "You need a Gas Stove, at least 0.4kg Cooking Gas, and 1 Raw Food Meal from the Market!");
                            }
                            startTimedAction("🍳 Cooking Fresh Meal on Gas Stove (-0.4kg Gas)...", "🍳", 20, () => {
                              setGasKg((g) => Number(Math.max(0, g - 0.4).toFixed(1)));
                              setRawFoodServings((r) => r - 1);
                              setHunger(100);
                              setEnergy(maxEnergyCap);
                              setHealth((h) => Math.min(100, h + 15));
                              triggerPopup("success", "🍲 Meal Cooked!", "Ate home-cooked food! Belly 100%, Energy full, +15% Health.");
                            });
                          }}
                          className="py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-xl"
                        >
                          🍳 Cook Meal (20s • -0.4kg)
                        </button>
                        <button
                          onClick={() => {
                            if (durabilityDaysLeft.Shower_Cooldown_Hours > 0) {
                              return triggerPopup(
                                "error",
                                "🚿 Already Showered Recently!",
                                `You must wait ${durabilityDaysLeft.Shower_Cooldown_Hours} more in-game hours before taking another Steeze-boosting shower!`
                              );
                            }
                            startTimedAction("🚿 Taking a Fresh Shower in Bathroom...", "🚿", 15, () => {
                              setSteeze((s) => s + 5);
                              setDurabilityDaysLeft((d) => ({ ...d, Shower_Cooldown_Hours: 12 }));
                              triggerPopup("success", "🚿 Fresh & Clean!", "Finished 15s shower! +5 Steeze (Next shower in 12 game hours).");
                            });
                          }}
                          className="py-2 bg-cyan-600 text-white font-extrabold rounded-xl"
                        >
                          🚿 Shower (15s • 12h Lock)
                        </button>
                      </div>
                    </div>

                    {/* RIGHT COLUMN: DIY PAINTING (60-DAY LOCK!) & HOME STATUS */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                      <h4 className="font-extrabold text-sm text-amber-400">🎨 DIY Wall Painting (20s Timer + 60-Day Durability Lock)</h4>
                      <p className="text-[11px] text-slate-400">
                        You cannot paint the same color twice! Once painted, a color lasts for <strong>60 Days (2 Months)</strong>.
                      </p>
                      {(["Cream", "Emerald", "RoyalBlue"] as const).map((col) => {
                        const key = `Paint_${col}`;
                        const daysLocked = durabilityDaysLeft[key] || 0;
                        const isCurrentColor = wallColor === col;
                        return (
                          <button
                            key={col}
                            disabled={isCurrentColor || daysLocked > 0}
                            onClick={() => {
                              const cost = areaPrice(25000);
                              if (!spendMoney(cost)) return;
                              startTimedAction(`🎨 Painting Room Walls ${col}...`, "🎨", 20, () => {
                                setWallColor(col);
                                setSteeze((s) => s + 15);
                                setDurabilityDaysLeft((d) => ({ ...d, [key]: 60 }));
                                triggerPopup("success", `🎨 Painted ${col}!`, `Walls painted ${col} (+15 Steeze)! Locked for 60 Days.`);
                              });
                            }}
                            className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex justify-between font-bold disabled:opacity-40"
                          >
                            <span>{isCurrentColor ? `✓ Active Color: ${col}` : daysLocked > 0 ? `🔒 ${col} (${daysLocked}d left)` : `Paint ${col}`}</span>
                            <span className="text-amber-400">{areaPrice(25000).toLocaleString()} g₦</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. ESTATE AGENT OFFICE (FULL TENANCY AGREEMENT INVOICE + 1-TIME PAY LOCK + 4-DAY BUY COUNTDOWN + MOVING TRUCK!) */}
                {currentBuildingId === "Agent_Office" && (
                  <div className="space-y-5">
                    <h3 className="font-extrabold text-base text-cyan-400">
                      🏘️ Inside {area} Estate Agent &amp; Haulage Movers ({areaMult}x Area Rate)
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        { id: `apt_${area}_2bed`, name: `${area} 2-Bedroom Flat (En-Suite Kitchen & Bath)`, rooms: 2, park: 2, baseRent: areaPrice(300000), buy: areaPrice(16000000) },
                        { id: `apt_${area}_5dup`, name: `${area} 5-Bed Luxury Duplex (Private Kitchen & 5 Baths)`, rooms: 5, park: 5, baseRent: areaPrice(1200000), buy: areaPrice(55000000) },
                      ].map((apt) => {
                        const isAlreadyLeased = rentedLeaseRecord?.propertyId === apt.id;
                        const agentFee = Math.round(apt.baseRent * 0.1);
                        const agreementFee = Math.round(apt.baseRent * 0.05);
                        const damagesCaution = Math.round(apt.baseRent * 0.1);
                        const totalPkg = apt.baseRent + agentFee + agreementFee + damagesCaution;

                        return (
                          <div key={apt.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                            <div className="font-extrabold text-white text-sm">{apt.name}</div>
                            <div className="text-[11px] text-slate-400">
                              🅿️ {apt.park} Parking Slots • Base Rent: {apt.baseRent.toLocaleString()} g₦ / 8 Wks
                            </div>

                            {/* IF NOT LEASED YET: OPEN ITEMIZED TENANCY AGREEMENT FORM */}
                            {!isAlreadyLeased ? (
                              <button
                                onClick={() =>
                                  setSelectedTenancyOffer({
                                    id: apt.id,
                                    name: apt.name,
                                    area,
                                    rooms: apt.rooms,
                                    park: apt.park,
                                    baseRent: apt.baseRent,
                                    agentFee,
                                    agreementFee,
                                    damagesCaution,
                                    totalPackage: totalPkg,
                                    buyOutrightPrice: apt.buy,
                                  })
                                }
                                className="w-full py-2.5 bg-cyan-500 text-slate-950 font-extrabold rounded-xl"
                              >
                                📄 Open Tenancy Agreement &amp; Invoice ({totalPkg.toLocaleString()} g₦ Total)
                              </button>
                            ) : (
                              /* ALREADY RENTED ONCE: LOCKED FROM RE-PAYING RENT! SHOWS MOVING COMPANY & 4-DAY BUY COUNTDOWN! */
                              <div className="p-3 bg-emerald-950/30 border border-emerald-500 rounded-xl space-y-2.5">
                                <div className="font-extrabold text-emerald-300">
                                  ✓ Active 8-Week Lease Signed (Paid Once — Rent Locked!)
                                </div>

                                {!rentedLeaseRecord.goodsMovedToNewHouse ? (
                                  <button
                                    onClick={() => {
                                      const moveCost = areaPrice(35000);
                                      if (!spendMoney(moveCost)) return;
                                      startTimedAction(`🚚 Moving Company Packing & Hauling Your Goods to ${apt.name}...`, "🚚", 25, () => {
                                        setShelterType(apt.name);
                                        setShelterArea(area);
                                        setOwnershipMode("Rented");
                                        setParkingSlots(apt.park);
                                        setWeeksUntilRentDue(8);
                                        setDaysUntilRentDue(56);
                                        setRentedLeaseRecord((r) => (r ? { ...r, goodsMovedToNewHouse: true } : null));
                                        triggerPopup(
                                          "success",
                                          "🚚 Goods Moved to New Apartment!",
                                          `The Moving Van delivered your Bed, Sofa, TV & Stove to ${apt.name}! Your 4-Day Lease-to-Own countdown is active.`
                                        );
                                      });
                                    }}
                                    className="w-full py-2 bg-amber-500 text-slate-950 font-extrabold rounded-lg flex items-center justify-center gap-1.5"
                                  >
                                    <Truck className="w-4 h-4" /> Step 2: Call Moving Company to Move Goods ({areaPrice(35000).toLocaleString()} g₦ • 25s)
                                  </button>
                                ) : (
                                  <div className="text-[11px] text-emerald-400 font-bold">✓ Goods Moved In • Living Here Now</div>
                                )}

                                {/* 4-DAY COUNTDOWN BEFORE PLAYER CAN PURCHASE THE RENTED BUILDING OUTRIGHT */}
                                <button
                                  disabled={rentedLeaseRecord.daysLeftBeforeCanBuy > 0}
                                  onClick={() => {
                                    if (!spendMoney(apt.buy)) return;
                                    startTimedAction(`🏰 Signing Outright Title Deed for ${apt.name}...`, "🏰", 25, () => {
                                      setOwnershipMode("Bought_Owned");
                                      setWeeksUntilRentDue(999);
                                      setDaysUntilRentDue(999);
                                      setOwnedProperties((prev) => [
                                        ...prev,
                                        {
                                          name: apt.name,
                                          area,
                                          roomsAvailable: apt.rooms,
                                          parking: apt.park,
                                          paidAgentForm: false,
                                          isListedWithAgent: false,
                                          listedPricePerRoom: areaPrice(250000),
                                          weeksLeftToCollect: 8,
                                        },
                                      ]);
                                      triggerPopup("success", "🏰 Building Purchased Outright!", `You now own ${apt.name} forever!`);
                                    });
                                  }}
                                  className="w-full py-2 bg-indigo-600 text-white font-extrabold rounded-lg disabled:opacity-40"
                                >
                                  {rentedLeaseRecord.daysLeftBeforeCanBuy > 0
                                    ? `⏳ Wait ${rentedLeaseRecord.daysLeftBeforeCanBuy} More Days Before Purchasing Building`
                                    : `🏰 Purchase Building Outright (${(apt.buy / 1000000).toFixed(1)}M g₦)`}
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* ITEMIZED TENANCY AGREEMENT MODAL */}
                    {selectedTenancyOffer && (
                      <div className="p-5 bg-slate-950 border-2 border-cyan-400 rounded-2xl space-y-3">
                        <h4 className="font-extrabold text-sm text-cyan-300 flex items-center gap-2">
                          <FileCheck className="w-4 h-4" /> Official Lagos Tenancy Agreement &amp; Itemized Invoice: {selectedTenancyOffer.name}
                        </h4>
                        <div className="grid sm:grid-cols-2 gap-2 text-xs bg-slate-900 p-3 rounded-xl">
                          <div>1. Base Rent (8 Weeks / 56 Days): <strong>{selectedTenancyOffer.baseRent.toLocaleString()} g₦</strong></div>
                          <div>2. Estate Agent Fee (10%): <strong>{selectedTenancyOffer.agentFee.toLocaleString()} g₦</strong></div>
                          <div>3. Legal &amp; Agreement Fee (5%): <strong>{selectedTenancyOffer.agreementFee.toLocaleString()} g₦</strong></div>
                          <div>4. Caution / Damages Deposit (10%): <strong>{selectedTenancyOffer.damagesCaution.toLocaleString()} g₦</strong></div>
                        </div>
                        <div className="text-sm font-extrabold text-amber-400">
                          TOTAL PAYABLE ONCE: {selectedTenancyOffer.totalPackage.toLocaleString()} g₦ (Unlocks Moving Van &amp; 4-Day Purchase Timer)
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              if (!spendMoney(selectedTenancyOffer.totalPackage)) return;
                              const offer = selectedTenancyOffer;
                              setSelectedTenancyOffer(null);
                              startTimedAction(`📝 Signing Tenancy Agreement & Collecting Keys for ${offer.name}...`, "🔑", 20, () => {
                                setRentedLeaseRecord({
                                  propertyId: offer.id,
                                  name: offer.name,
                                  area: offer.area,
                                  park: offer.park,
                                  daysLeftBeforeCanBuy: 4, // 4-Day countdown before purchase unlocks!
                                  buyPrice: offer.buyOutrightPrice,
                                  goodsMovedToNewHouse: false,
                                });
                                triggerPopup(
                                  "success",
                                  "🔑 Tenancy Agreement Signed!",
                                  `Paid ${offer.totalPackage.toLocaleString()} g₦ once! Now click 'Call Moving Company' to move your furniture into ${offer.name}!`
                                );
                              });
                            }}
                            className="px-5 py-2.5 bg-emerald-500 text-slate-950 font-extrabold rounded-xl"
                          >
                            ✍️ Pay Total &amp; Sign Agreement (20s Timer)
                          </button>
                          <button onClick={() => setSelectedTenancyOffer(null)} className="px-4 py-2.5 bg-slate-800 text-white rounded-xl">
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. FURNITURE, TV & PHONE PLAZA (20S PURCHASE TIMERS + 60-DAY DURABILITY LOCKS!) */}
                {currentBuildingId === "Furniture_Electronics" && (
                  <div className="space-y-4">
                    <h3 className="font-extrabold text-base text-purple-400">
                      📺🛏️📱 Inside {area} Furniture, TV &amp; Phone Plaza ({areaMult}x Area Rate • 60-Day Durability Locks!)
                    </h3>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {[
                        { key: "Bed_Foam", name: "🛏️ Mouka Foam Mattress (85% Cap)", base: 30000, action: () => { setBedTier("Foam_Mattress"); setEnergy(85); } },
                        { key: "Bed_King", name: "👑 Royal King Bed (100% Cap)", base: 95000, action: () => { setBedTier("King_Bed"); setEnergy(100); setSteeze((s) => s + 25); } },
                        { key: "Sofa_Cushion", name: "🛋️ L-Shaped Cushion Sofa", base: 55000, action: () => { setChairTier("Cushion_Sofa"); setSteeze((s) => s + 15); } },
                        { key: "TV_32", name: "📺 32-Inch LED TV", base: 85000, action: () => { setTvTier("32-Inch LED TV"); } },
                        { key: "TV_55", name: "🎬 55-Inch 4K Smart TV", base: 175000, action: () => { setTvTier("55-Inch Smart TV"); setSteeze((s) => s + 25); } },
                      ].map((item) => {
                        const lockedDays = durabilityDaysLeft[item.key] || 0;
                        const cost = areaPrice(item.base);
                        return (
                          <button
                            key={item.key}
                            disabled={lockedDays > 0}
                            onClick={() => {
                              if (!spendMoney(cost)) return;
                              startTimedAction(`📦 Delivering & Installing ${item.name}...`, "🚚", 20, () => {
                                item.action();
                                setDurabilityDaysLeft((d) => ({ ...d, [item.key]: 60 })); // Locked for 60 Days (2 Months)!
                                triggerPopup("success", "✅ Installed in Your Home!", `${item.name} installed! Durable for 60 Days before replacement is needed.`);
                              });
                            }}
                            className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-left disabled:opacity-40"
                          >
                            <div className="font-bold text-white">{item.name}</div>
                            <div className="text-amber-400 font-bold">
                              {lockedDays > 0 ? `✓ Owned (Renews in ${lockedDays}d)` : `${cost.toLocaleString()} g₦ (20s Timer)`}
                            </div>
                          </button>
                        );
                      })}

                      <button
                        disabled={phoneOwned === "Smartphone"}
                        onClick={() => {
                          const cost = areaPrice(150000);
                          if (!spendMoney(cost)) return;
                          startTimedAction("📱 Activating Lagos Pro Smartphone...", "📱", 15, () => {
                            setPhoneOwned("Smartphone");
                            triggerPopup("success", "📱 Smartphone Activated!", "You can now open the Live Vacancy App from your top bar!");
                          });
                        }}
                        className="p-3 bg-slate-950 border border-cyan-500 rounded-xl text-left disabled:opacity-40"
                      >
                        <div className="font-bold text-cyan-300">📱 Lagos Pro Smartphone</div>
                        <div className="text-amber-400 font-bold">
                          {phoneOwned === "Smartphone" ? "✓ Owned" : `${areaPrice(150000).toLocaleString()} g₦ (15s)`}
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. UNDER-CONSTRUCTION SITES (LOCKED FACILITY UNTIL COMPLETED + WORKER SHIFT!) */}
                {activeConstructionSites.map((site) => {
                  if (currentBuildingId !== site.id) return null;
                  const isPlayerOwner = site.ownerName.trim().toLowerCase() === username.trim().toLowerCase();

                  return (
                    <div key={site.id} className="space-y-4">
                      <div className="p-4 bg-amber-950/40 border-2 border-amber-500 rounded-2xl space-y-2">
                        <div className="flex items-center gap-2 font-extrabold text-base text-amber-300">
                          <HardHat className="w-5 h-5" /> {site.projectName}
                        </div>
                        {!site.isCompletedAndUnlocked ? (
                          <p className="text-xs text-rose-300 font-bold">
                            🔒 FACILITY UNDER CONSTRUCTION — Public Entry Locked Until Timer (`{formatSecs(site.timeRemainingSecs)}`) &amp; Minimum Bricklayers (`{site.currentBricklayers}/{site.minBricklayers}`) Are Completed!
                          </p>
                        ) : (
                          <p className="text-xs text-emerald-300 font-bold">
                            ✅ CONSTRUCTION COMPLETED! The {site.facilityType} is now open to the public!
                          </p>
                        )}
                      </div>

                      {!site.isCompletedAndUnlocked && !isPlayerOwner && (
                        <button
                          disabled={site.playerWorkedHere || site.currentBricklayers >= site.maxBricklayers}
                          onClick={() => {
                            if (energy < 35) return triggerPopup("error", "⚠️ Low Energy!", "Need 35% Energy for a Bricklayer shift!");
                            startTimedAction(`🧱 Laying Blocks & Mixing Concrete at ${site.projectName}...`, "🧱", 25, () => {
                              setEnergy((en) => Math.max(5, en - 35));
                              const up = [...activeConstructionSites];
                              const idx = up.findIndex((x) => x.id === site.id);
                              if (idx > -1) {
                                up[idx].currentBricklayers += 1;
                                up[idx].playerWorkedHere = true;
                                up[idx].timeRemainingSecs = Math.max(0, up[idx].timeRemainingSecs - 1800);
                                if (up[idx].timeRemainingSecs === 0 && up[idx].currentBricklayers >= up[idx].minBricklayers) {
                                  up[idx].isCompletedAndUnlocked = true;
                                }
                                setActiveConstructionSites(up);
                              }
                              receiveEarnedMoney(site.payPerShiftCn, `Bricklayer Shift at ${site.projectName}`);
                            });
                          }}
                          className="w-full py-3 bg-amber-500 text-slate-950 font-extrabold rounded-xl disabled:opacity-40"
                        >
                          {site.playerWorkedHere
                            ? "✓ You Already Worked Your 1 Shift on This Project"
                            : `🧱 Work Bricklayer Shift (+${site.payPerShiftCn.toLocaleString()} c₦ • 25s Timer)`}
                        </button>
                      )}
                    </div>
                  );
                })}

                {/* 5. PUBLIC EATERY (SCALED BY AREA MULTIPLIER + 15S EATING TIMER!) */}
                {currentBuildingId === "Public_Eatery" && (
                  <div className="space-y-3">
                    <h3 className="font-extrabold text-base text-amber-400">
                      🍛 Inside {area} Public Eatery ({areaMult}x Area Standard of Living)
                    </h3>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {[
                        { name: "🍞 Agege Bread & Beans", base: 2000, belly: 35, en: 20, hp: 5 },
                        { name: "🍛 Party Jollof & Plantain", base: 4500, belly: 50, en: 35, hp: 15 },
                        { name: "🍲 Amala & Ewedu", base: 6000, belly: 65, en: 45, hp: 20 },
                        { name: "🥣 Pounded Yam & Egusi", base: 8500, belly: 80, en: 55, hp: 25 },
                        { name: "🐟 Catfish Pepper Soup", base: 11000, belly: 75, en: 60, hp: 35 },
                        { name: "🍗 Mixed Grill & Salad", base: 18000, belly: 100, en: 85, hp: 50 },
                      ].map((m, i) => {
                        const cost = areaPrice(m.base);
                        return (
                          <button
                            key={i}
                            onClick={() => {
                              if (!spendMoney(cost)) return;
                              startTimedAction(`🍛 Eating ${m.name} at ${area} Eatery...`, "🍛", 15, () => {
                                setHunger((b) => Math.min(100, b + m.belly));
                                setEnergy((e) => Math.min(maxEnergyCap, e + m.en));
                                setHealth((h) => Math.min(100, h + m.hp));
                                triggerPopup("success", "🍛 Delicious Meal!", `Finished eating ${m.name}! Belly +${m.belly}%, Energy +${m.en}%.`);
                              });
                            }}
                            className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-left"
                          >
                            <div className="font-bold text-white">{m.name}</div>
                            <div className="text-emerald-400 font-bold">{cost.toLocaleString()} g₦ • +{m.belly}% Belly (15s)</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 6. MARKET & KG GAS DEPOT (SCALED BY AREA + 15S TIMERS!) */}
                {currentBuildingId === "Gas_Kitchen_Shop" && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-extrabold text-base text-teal-400">
                        🔥 Inside {area} Market &amp; Gas Depot ({areaMult}x Area Rate • Gas: {gasKg} kg)
                      </h3>
                      <button
                        onClick={() => {
                          setBargainDiscountPct(15);
                          triggerPopup("success", "🗣️ Market Bargain!", "Negotiated 15% off your next market purchase!");
                        }}
                        className="px-3 py-1.5 bg-amber-500 text-slate-950 font-extrabold rounded-xl"
                      >
                        {bargainDiscountPct > 0 ? `✓ -${bargainDiscountPct}% Off Active` : "🗣️ Bargain Price (-15%)"}
                      </button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <button
                          disabled={hasCookingStove}
                          onClick={() => {
                            if (!spendMoney(areaPrice(35000), true)) return;
                            startTimedAction("🔥 Purchasing Tabletop Gas Stove...", "🔥", 15, () => {
                              setHasCookingStove(true);
                              setGasKg(2.0);
                              triggerPopup("success", "🔥 Stove Purchased!", "Tabletop Gas Stove (+2.0kg starter gas) delivered to your kitchen!");
                            });
                          }}
                          className="w-full p-2.5 bg-slate-950 border border-orange-600 rounded-xl flex justify-between font-bold disabled:opacity-40"
                        >
                          <span>{hasCookingStove ? "✓ Gas Stove Owned" : "🔥 Tabletop Gas Stove Burner"}</span>
                          <span className="text-amber-400">{areaPrice(35000).toLocaleString()} g₦</span>
                        </button>
                        {[
                          { label: "⛽ Refill 3.0 kg Gas", kg: 3.0, base: 3500 },
                          { label: "⛽ Refill 12.5 kg Full Cylinder", kg: 12.5, base: 13500 },
                        ].map((g, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              if (!hasCookingStove) return triggerPopup("error", "❌ No Gas Stove!", "Buy the Tabletop Gas Stove Burner first!");
                              if (!spendMoney(areaPrice(g.base), true)) return;
                              startTimedAction(`⛽ Refilling +${g.kg}kg Cooking Gas...`, "⛽", 15, () => {
                                setGasKg((p) => Number((p + g.kg).toFixed(1)));
                                triggerPopup("success", "⛽ Gas Refilled!", `Added +${g.kg}kg Cooking Gas to your cylinder!`);
                              });
                            }}
                            className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between font-bold"
                          >
                            <span>{g.label}</span>
                            <span className="text-amber-400">{areaPrice(g.base).toLocaleString()} g₦ (15s)</span>
                          </button>
                        ))}
                      </div>
                      <div className="space-y-2">
                        {[
                          { name: "🥖 Garri & Beans Pack (3 Meals)", meals: 3, base: 4500 },
                          { name: "🍠 Pounded Yam & Egusi Pack (7 Meals)", meals: 7, base: 12000 },
                          { name: "🥩 25kg Jollof Rice & Beef Bag (18 Meals)", meals: 18, base: 34000 },
                        ].map((f, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              if (!spendMoney(areaPrice(f.base), true)) return;
                              startTimedAction(`🌾 Buying ${f.name}...`, "🌾", 15, () => {
                                setRawFoodServings((r) => r + f.meals);
                                triggerPopup("success", "🌾 Food Stocked!", `Added +${f.meals} Raw Meals to your home kitchen!`);
                              });
                            }}
                            className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between font-bold"
                          >
                            <span>{f.name}</span>
                            <span className="text-emerald-400">{areaPrice(f.base).toLocaleString()} g₦ (15s)</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. HOSPITAL, ACADEMIC SCHOOL, BUSINESS SCHOOL, MAID AGENCY & OTHER STANDALONE INTERFACES */}
                {currentBuildingId === "Hospital" && (() => {
                  const hospRate = HOSPITAL_AREA_RATES[area];
                  return (
                    <div className="space-y-4">
                      <h3 className="font-extrabold text-base text-rose-400">🏥 Inside {hospRate.name} ({area})</h3>
                      <div className="grid sm:grid-cols-3 gap-3">
                        <button
                          onClick={() => {
                            if (!spendMoney(hospRate.cashCost)) return;
                            startTimedAction(`🏥 Receiving Full Medical Care at ${hospRate.name}...`, "🏥", 20, () => {
                              setHealth(100);
                              setEnergy(maxEnergyCap);
                              setHunger(100);
                              setHospitalShieldHoursLeft(48);
                              triggerPopup("success", "🏥 Fully Treated!", "Health, Energy & Belly restored to 100% + 48h Shield!");
                            });
                          }}
                          className="py-2.5 bg-emerald-500 text-slate-950 font-extrabold rounded-xl"
                        >
                          💊 Pay Cash ({hospRate.cashCost.toLocaleString()} g₦ • 20s)
                        </button>
                        <button
                          onClick={() => {
                            if (!completedDegrees.some((d) => d.includes("Nursing"))) return triggerPopup("error", "❌ Degree Required!", "Requires Nursing Degree!");
                            startTimedAction("👩🏾‍⚕️ Working Registered Nurse Shift...", "👩🏾‍⚕️", 25, () => receiveEarnedMoney(160000, `Nurse Shift at ${hospRate.name}`));
                          }}
                          className="py-2.5 bg-cyan-600 text-white font-extrabold rounded-xl"
                        >
                          👩🏾‍⚕️ Work Nurse Shift (+160k c₦ • 25s)
                        </button>
                        <button
                          onClick={() => {
                            if (!completedDegrees.some((d) => d.includes("Medicine"))) return triggerPopup("error", "❌ Degree Required!", "Requires Medicine MBBS!");
                            startTimedAction("👨🏾‍⚕️ Performing Surgery Shift...", "👨🏾‍⚕️", 30, () => receiveEarnedMoney(480000, `Doctor Shift at ${hospRate.name}`));
                          }}
                          className="py-2.5 bg-indigo-600 text-white font-extrabold rounded-xl"
                        >
                          👨🏾‍⚕️ Work Doctor Shift (+480k c₦ • 30s)
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {currentBuildingId === "Academic_School" && (
                  <div className="space-y-4">
                    <h3 className="font-extrabold text-base text-indigo-400">🎓 Inside {area} Academic &amp; Degree College (ND, HND, B.Sc, M.Sc, Ph.D)</h3>
                    {enrolledProgram ? (
                      <div className="p-4 bg-indigo-950 border border-indigo-400 rounded-2xl flex justify-between items-center">
                        <div>
                          <div className="font-extrabold text-white">{enrolledProgram.name} ({enrolledProgram.major})</div>
                          <div className="text-amber-300">Lectures: {enrolledProgram.completedClasses}/10 (-{enrolledProgram.energyPerLecture}% En)</div>
                        </div>
                        <button
                          onClick={() => {
                            if (energy < enrolledProgram.energyPerLecture) return triggerPopup("error", "⚠️ Low Energy!", `Need ${enrolledProgram.energyPerLecture}% Energy!`);
                            startTimedAction(`📖 Attending Lecture #${enrolledProgram.completedClasses + 1}/10...`, "🎓", 20, () => {
                              setEnergy((en) => Math.max(5, en - enrolledProgram.energyPerLecture));
                              const nextC = enrolledProgram.completedClasses + 1;
                              if (nextC >= 10) {
                                setCompletedDegrees((d) => [...d, `${enrolledProgram.name} (${enrolledProgram.major})`]);
                                setEnrolledProgram(null);
                                triggerPopup("success", "🎓 Graduated!", `Completed 10/10 lectures for ${enrolledProgram.name}!`);
                              } else {
                                setEnrolledProgram({ ...enrolledProgram, completedClasses: nextC });
                              }
                            });
                          }}
                          className="px-4 py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-xl"
                        >
                          Attend Lecture #{enrolledProgram.completedClasses + 1}/10 (20s)
                        </button>
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-3 gap-3">
                        {[
                          { id: "ND_N", name: "Polytechnic ND", major: "Nursing", cost: areaPrice(240000), en: 35 },
                          { id: "BSC_M", name: "University B.Sc", major: "Medicine (MBBS)", cost: areaPrice(850000), en: 50 },
                          { id: "MSC_L", name: "Masters (M.Sc)", major: "Management", cost: areaPrice(1450000), en: 65 },
                          { id: "PHD_L", name: "Doctorate (Ph.D)", major: "Research", cost: areaPrice(2900000), en: 80 },
                        ].map((d) => (
                          <button
                            key={d.id}
                            onClick={() => {
                              if (!spendMoney(d.cost)) return;
                              startTimedAction(`📝 Enrolling in ${d.name} (${d.major})...`, "🎓", 15, () => {
                                setEnrolledProgram({ id: d.id, name: d.name, major: d.major, totalClasses: 10, completedClasses: 0, energyPerLecture: d.en, timerSeconds: 20 });
                              });
                            }}
                            className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-left"
                          >
                            <div className="font-bold text-white">{d.name} ({d.major})</div>
                            <div className="text-amber-400 font-bold">{d.cost.toLocaleString()} g₦ (15s)</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {currentBuildingId === "Business_Blueprint_School" && (
                  <div className="space-y-3">
                    <h3 className="font-extrabold text-base text-emerald-400">💼 Inside {area} Business &amp; Blueprint School</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        { id: "BP_Food_Kiosk", name: "🏪 Roadside Food Kiosk Blueprint", cost: areaPrice(550000) },
                        { id: "BP_Small_Eatery", name: "🍲 Small Eatery Blueprint", cost: areaPrice(1100000) },
                        { id: "Cert_Rice", name: "🍚🍲 Master of Rice, Jollof & Soup Cert", cost: areaPrice(550000) },
                        { id: "ICAN", name: "📊 ICAN Chartered Accountant", cost: areaPrice(950000) },
                      ].map((bp) => (
                        <button
                          key={bp.id}
                          onClick={() => {
                            if (!spendMoney(bp.cost)) return;
                            startTimedAction(`📘 Studying ${bp.name}...`, "📘", 20, () => {
                              setOwnedBlueprints((p) => [...p, bp.id]);
                              setSpecialistCerts((s) => [...s, bp.id]);
                              setProfessionalCerts((pr) => [...pr, bp.id]);
                              triggerPopup("success", "📘 Certified!", `Earned ${bp.name}!`);
                            });
                          }}
                          className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between font-bold"
                        >
                          <span>{bp.name}</span>
                          <span className="text-amber-400">{(bp.cost / 1000).toFixed(0)}k g₦ (20s)</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentBuildingId === "Domestic_Maid_Agency" && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        const fee = areaPrice(485000);
                        if (!spendMoney(fee)) return;
                        startTimedAction("👩🏾‍🍳 Vetting & Assigning Live-In House Maid...", "👩🏾‍🍳", 20, () => {
                          setHasHiredMaid(true);
                          setMaidWeeklyFoodLeft(14);
                          setAgencyMaidVacanciesCount((c) => c + 1);
                          triggerPopup("success", "👩🏾‍🍳 Maid Hired!", "Your House Maid will now auto-cook every 5 minutes!");
                        });
                      }}
                      className="p-4 bg-emerald-500 text-slate-950 font-extrabold rounded-2xl"
                    >
                      Homeowner: Hire Live-In Maid ({areaPrice(485000).toLocaleString()} g₦ • 20s)
                    </button>
                    <button
                      onClick={() => {
                        if (!specialistCerts.includes("Cert_Rice")) return triggerPopup("error", "❌ Cert Required!", "Requires Master Culinary Cert!");
                        startTimedAction("🧹 Working Domestic Maid Household Shift...", "🧹", 25, () => receiveEarnedMoney(45000, "Domestic Maid Shift"));
                      }}
                      className="p-4 bg-rose-600 text-white font-extrabold rounded-2xl"
                    >
                      Worker: Work Agency Maid Vacancy (+45,000 c₦ • 25s)
                    </button>
                  </div>
                )}

                {currentBuildingId === "Gym" && (
                  <div className="grid sm:grid-cols-3 gap-3">
                    {[
                      { id: "1_Hour_Pass", name: "⏱️ 1-Hour Workout Pass", base: 5000 },
                      { id: "Weekly_Plan", name: "📅 Weekly Gym Membership", base: 25000 },
                      { id: "Monthly_VIP", name: "👑 Monthly VIP Body Plan", base: 80000 },
                    ].map((g) => (
                      <button
                        key={g.id}
                        onClick={() => {
                          if (!spendMoney(areaPrice(g.base))) return;
                          startTimedAction(`🏋🏾‍♂️ Completing Gym Workout (${g.name})...`, "🏋🏾‍♂️", 20, () => {
                            setGymPlan(g.id as any);
                            setHealth(100);
                            setSteeze((s) => s + 15);
                            triggerPopup("success", "🏋🏾‍♂️ Workout Complete!", "Health restored to 100% & +15 Steeze!");
                          });
                        }}
                        className="p-3 bg-slate-950 border border-orange-500 rounded-xl text-left"
                      >
                        <div className="font-bold text-white">{g.name}</div>
                        <div className="text-amber-400 font-bold">{areaPrice(g.base).toLocaleString()} g₦ (20s)</div>
                      </button>
                    ))}
                  </div>
                )}

                {currentBuildingId === "Driving_Auto_Center" && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-3">
                      <button
                        disabled={drivingLessonsDone >= 3}
                        onClick={() => {
                          if (!spendMoney(35000)) return;
                          startTimedAction(`🚗 Practical Driving Lesson #${drivingLessonsDone + 1}/3...`, "🚗", 20, () => setDrivingLessonsDone((d) => d + 1));
                        }}
                        className="px-4 py-2 bg-amber-500 text-slate-950 font-extrabold rounded-xl"
                      >
                        {drivingLessonsDone >= 3 ? "✓ 3/3 Lessons Done" : `Driving Lesson (${drivingLessonsDone}/3) • 35k (20s)`}
                      </button>
                      <button
                        disabled={hasDriversLicense || drivingLessonsDone < 3}
                        onClick={() => {
                          if (!spendMoney(75000)) return;
                          startTimedAction("🪪 Processing FRSC Official Driver's License...", "🪪", 20, () => setHasDriversLicense(true));
                        }}
                        className="px-4 py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-xl"
                      >
                        {hasDriversLicense ? "✓ Licensed" : "Obtain FRSC License (75k • 20s)"}
                      </button>
                      <button onClick={() => { if (spendMoney(18000)) startTimedAction("⛽ Refilling Petrol & Water...", "⛽", 15, () => { setCarPetrol(100); setCarRadiatorWater(100); }); }} className="px-4 py-2 bg-cyan-500 text-slate-950 font-extrabold rounded-xl">
                        ⛽ Refill Petrol &amp; Water (18k • 15s)
                      </button>
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
                            if (!hasDriversLicense) return triggerPopup("error", "❌ License Required!", "Get your 75k Driver's License above first!");
                            if (carsOwned.length >= parkingSlots) return triggerPopup("error", "❌ No Parking Slot!", "Rent a Flat or Duplex with parking at the Estate Agent!");
                            if (!spendMoney(c.cost)) return;
                            startTimedAction(`🏎️ Registering & Delivering ${c.name}...`, "🏎️", 20, () => {
                              setCarsOwned((p) => [...p, c.name]);
                              setActiveCar(c.name);
                              triggerPopup("success", "🏎️ Car Purchased!", `You now drive a ${c.name}!`);
                            });
                          }}
                          className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-left"
                        >
                          <div className="font-bold text-white">{c.name}</div>
                          <div className="text-emerald-400 font-bold">{(c.cost / 1000000).toFixed(2)}M g₦ (20s)</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {(currentBuildingId === "Architect_Builder_HQ" || currentBuildingId === "Corporate_Party_Center" || currentBuildingId === "Vacancy_Stand") && (
                  <div className="space-y-3">
                    <h3 className="font-extrabold text-base text-amber-400">🏢 Inside {currentBuildingId.replaceAll("_", " ")} ({area})</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <button
                        onClick={() => {
                          startTimedAction("💼 Working Daily Corporate & Street Shift...", "💼", 25, () => receiveEarnedMoney(Math.round(18000 * areaMult), `${area} Shift`));
                        }}
                        className="p-3 bg-emerald-500 text-slate-950 font-extrabold rounded-xl"
                      >
                        💼 Work Local Shift (+{Math.round(18000 * areaMult).toLocaleString()} c₦ • 25s Timer)
                      </button>
                      <button
                        onClick={() => {
                          if (!spendMoney(25000)) return;
                          startTimedAction("🍷 Enjoying Social Courtship Date...", "🍷", 20, () => {
                            setMaritalStatus("Courting");
                            setDatesCompleted((d) => Math.min(10, d + 1));
                            triggerPopup("success", "❤️ Date Complete!", `Completed Date ${datesCompleted + 1}/10!`);
                          });
                        }}
                        className="p-3 bg-rose-600 text-white font-extrabold rounded-xl"
                      >
                        🍷 Go on Courtship Date ({datesCompleted}/10 • 25k • 20s)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* =====================================================================
            TAB 2: 🔍 INSPECT PLAYERS, DEBT LEDGER & CENTRAL BANK (WITH 15S BUY COUNTDOWN!)
           ===================================================================== */}
        {activeTab === "profile" && (
          <div className="grid md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-amber-400">🏆 My Citizen Dossier &amp; Lease Countdown</h2>
              <div className="p-3 bg-rose-950/40 border border-rose-600 rounded-xl space-y-1">
                <div className="font-extrabold text-rose-300">🚨 Active Debt: {hospitalLoanDebt.toLocaleString()} c₦</div>
                <div className="text-amber-300 font-bold">
                  🏠 Current Home Due: {weeksUntilRentDue} Weeks ({daysUntilRentDue} Days Left)
                </div>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                <div>🏠 <strong>House:</strong> {shelterType} ({shelterArea})</div>
                <div>🚗 <strong>Car Driven:</strong> {activeCar}</div>
                <div>🎓 <strong>Degrees:</strong> {completedDegrees.join(", ") || "Uneducated"}</div>
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
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${cit.debtAmountCn > 0 ? "bg-red-600 text-white" : "bg-emerald-950 text-emerald-300"}`}>
                      {cit.debtAmountCn > 0 ? `🚨 IN DEBT (-${(cit.debtAmountCn / 1000).toFixed(0)}k)` : "✓ Debt-Free"}
                    </span>
                  </button>
                ))}
              </div>
              {inspectedCitizen && (
                <div className="p-3 bg-cyan-950/30 border-2 border-cyan-500 rounded-xl space-y-1">
                  <div className="font-extrabold text-cyan-300">{inspectedCitizen.name} ({inspectedCitizen.handle})</div>
                  <div>🏠 <strong>House:</strong> {inspectedCitizen.houseType} <em>(GPS Hidden)</em></div>
                  <div>🚗 <strong>Car:</strong> {inspectedCitizen.carDriven}</div>
                  <div className="text-rose-400 font-bold">
                    🚨 Debt: {inspectedCitizen.debtAmountCn > 0 ? `Owes ${inspectedCitizen.debtAmountCn.toLocaleString()} c₦` : "0 c₦"}
                  </div>
                </div>
              )}
            </div>

            {/* CENTRAL BANK WITH 15-SECOND COUNTDOWN ON EVERY PURCHASE & 10M DAILY CAP */}
            <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <h2 className="font-bold text-sm text-emerald-400">🏦 Central Bank (15s Verification Timer • Max 10M/Day)</h2>
              <div className="p-2.5 bg-slate-950 border border-emerald-800/60 rounded-xl space-y-1">
                <div className="text-[10px] text-slate-400">Reserve: <strong className="text-amber-400">{centralBankReserve.toLocaleString()} g₦</strong></div>
                <div className="text-[10px] text-cyan-300">Daily Limit Used: <strong>{dailyGnBoughtToday.toLocaleString()} / 10,000,000 g₦</strong></div>
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
                      return triggerPopup("error", "🛑 10M Daily Limit Reached!", "You can only purchase up to 10,000,000 g₦ per in-game day!");
                    }
                    startTimedAction(`🏦 Central Bank Verifying & Disbursing ${t.gCash.toLocaleString()} g₦...`, "🏦", 15, () => {
                      setDailyGnBoughtToday((d) => d + t.gCash);
                      setCentralBankReserve((r) => r - t.gCash);
                      setStarterBalance((s) => s + t.gCash);
                      triggerPopup("success", "💳 Central Bank Credit Approved!", `+${t.gCash.toLocaleString()} g₦ added to your Working Capital!`);
                    });
                  }}
                  className="w-full p-2 bg-slate-950 border border-amber-500/50 rounded-xl flex justify-between font-bold"
                >
                  <span>Buy {t.gCash.toLocaleString()} g₦ (15s Timer)</span>
                  <span className="text-amber-400">₦{t.naira.toLocaleString()}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

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

      <nav className="fixed bottom-0 inset-x-0 bg-slate-900/95 backdrop-blur border-t border-slate-800 px-2 py-2 z-40">
        <div className="max-w-md mx-auto grid grid-cols-2 gap-2">
          {[
            { id: "map", label: "🗺️ Town Map & All Building Interfaces", icon: <Map className="w-4 h-4" /> },
            { id: "profile", label: "🔍 Inspect Players, Debt & 10M Bank", icon: <Award className="w-4 h-4" /> },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
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