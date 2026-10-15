"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { 
  Heart, Zap, Utensils, Sparkles, Tv, Home, Map,
  Briefcase, GraduationCap, Lock, Building2, 
  Clock, Award, Wrench, Fuel, Droplets, ZoomOut, ZoomIn, 
  Send, Dumbbell, Stethoscope, Vote, MessageSquareQuote, Info, HelpCircle, UserCheck
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

export default function LagosEmpireMasterEdition() {
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

  // 3. CENTRAL BANK 300M RESERVE, HOSPITAL LOAN & DUAL WALLETS (100M c₦ = ₦5,000!)
  const [centralBankReserve, setCentralBankReserve] = useState(300000000);
  const [starterBalance, setStarterBalance] = useState(50000); // g₦ (Starter/Deposit)
  const [earnedBalance, setEarnedBalance] = useState(0);       // c₦ (100,000,000 c₦ = ₦5,000!)
  const [hospitalLoanDebt, setHospitalLoanDebt] = useState(0);
  const [hospitalImmunityDaysLeft, setHospitalImmunityDaysLeft] = useState(0); // 2-Day Protection after Hospital!
  const [transferRecipient, setTransferRecipient] = useState("");
  const [transferAmount, setTransferAmount] = useState("");

  // 4. EXACT PLAYER POSITION, AREA & SURVIVAL STATS
  const [area, setArea] = useState<AreaName>("Oshodi");
  // EXACT POSITION TRACKER: Shows whether player is At Home, Inside Hospital, At Market, At Party Secretariat, etc.
  const [exactPosition, setExactPosition] = useState<string>("Inside My Home (Oshodi)");
  const [isAtHome, setIsAtHome] = useState<boolean>(true);
  const [isMapZoomedOut, setIsMapZoomedOut] = useState(false);
  const [enteredBuildingId, setEnteredBuildingId] = useState<string>("None");
  const [activeGuideTip, setActiveGuideTip] = useState<string>(
    "💡 GUIDE: Keep Belly & Energy above 20% so your Critical Bar stays safe! Click [?] on any meter to see how to boost it."
  );

  const [health, setHealth] = useState(90);
  const [energy, setEnergy] = useState(60);
  const [hunger, setHunger] = useState(80);
  const [weight, setWeight] = useState(68.0);
  const [steeze, setSteeze] = useState(5);
  const [citizenPoints, setCitizenPoints] = useState(15);

  // 5. CERTIFIED HOUSE MAID (5-MINUTE AUTOMATION SYSTEM!)
  const [hasHiredMaid, setHasHiredMaid] = useState(false);
  const [maidSatisfaction, setMaidSatisfaction] = useState(100);
  const [maidTimerSecs, setMaidTimerSecs] = useState(300); // 5 minutes (300s) auto-care cycle!

  // 6. GYM ENROLLMENT PLANS
  const [gymPlan, setGymPlan] = useState<"None" | "1_Hour_Pass" | "Weekly_Plan" | "Monthly_VIP">("None");

  // 7. TIMERS ENGINE
  const [timers, setTimers] = useState<Record<string, number>>({});
  const startCooldown = (key: string, seconds: number) => {
    setTimers((prev) => ({ ...prev, [key]: seconds }));
  };

  // HELPER: Receive Earned c₦ (Auto-deducts Hospital Loan only from NEW earnings, never from empty account!)
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

  // MASTER CLOCK, 5-MIN MAID AUTOMATION & FIXED HOSPITAL EMERGENCY LOGIC
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

      // 2. Tick 5-Minute (300s) House Maid Automation!
      if (hasHiredMaid && maidSatisfaction > 20) {
        setMaidTimerSecs((prev) => {
          if (prev <= 1) {
            // Every 5 minutes, Maid delivers food & maintains Health, Energy & Belly automatically!
            setHealth((h) => Math.max(h, 90));
            setEnergy((e) => Math.max(e, 85));
            setHunger((b) => Math.max(b, 90));
            setMaidSatisfaction((s) => Math.max(0, s - 5));
            setLogMessage("👩🏾‍🍳 MAID AUTOMATION (5-Min Cycle): Your House Maid delivered hot food & vitamins to your location! Health, Energy & Belly restored to 90%!");
            return 300;
          }
          return prev - 1;
        });
      }

      // 3. Advance 15-Minute Clock
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
              // Tick 2-Day Hospital Immunity Shield
              setHospitalImmunityDaysLeft((imm) => Math.max(0, imm - 1));

              // Party Presence Rule: Only counts if player is physically inside Party Secretariat!
              if (exactPosition.includes("Party Secretariat")) {
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
                    setIsAtHome(false);
                    setExactPosition(`Under the Bridge (${area})`);
                    setLogMessage("🚨 RENT OVERDUE! You have been evicted to Under the Bridge!");
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

        // 4. FIXED STAT DECAY & HOSPITAL ADMISSION (FULL 100% RESTORE + 2-DAY IMMUNITY + POSITION CHANGE!)
        setHunger((prevHunger) => {
          // If player has 2-day hospital discharge protection, decay is tiny!
          const decayRate = hospitalImmunityDaysLeft > 0 ? 1 : 3;
          const nextHunger = Math.max(0, prevHunger - decayRate);

          if (nextHunger === 0 && hospitalImmunityDaysLeft === 0) {
            setHealth((prevHp) => {
              const nextHp = Math.max(0, prevHp - 8);
              if (nextHp <= 15) {
                // RUSH TO HOSPITAL: FILL ALL 3 BARS TO 100%, MOVE POSITION TO HOSPITAL, GRANT 2-DAY IMMUNITY!
                setHunger(100);
                setEnergy(100);
                setHospitalImmunityDaysLeft(2);
                setIsAtHome(false);
                setEnteredBuildingId("Hospital");
                setExactPosition(`🏥 Inside ${area} General Hospital Ward (Must Commute Home)`);
                setHospitalLoanDebt((debt) => debt + 100000);
                setLogMessage(
                  `🚑 CRITICAL COLLAPSE! Rushed to ${area} Hospital! Health, Energy & Belly restored to 100% + 2-Day Medical Shield active! You are now at the Hospital (take transport to return home).`
                );
                return 100;
              }
              return nextHp;
            });
          }
          return nextHunger;
        });

        setEnergy((prevE) => {
          const decayE = hospitalImmunityDaysLeft > 0 ? 1 : 2;
          return Math.max(10, prevE - decayE);
        });

        return 0;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [hasHiredMaid, maidSatisfaction, hospitalImmunityDaysLeft, exactPosition, area]);

  const formatSecs = (s?: number) => {
    if (!s || s <= 0) return "0s";
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}h ${m}m ${sec}s`;
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
  };

  // 8. HOME, FURNITURE & LANDLORD STATE
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
  const [gasLevel, setGasLevel] = useState(0);
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

  // 9. DRIVING LICENSE (75,000 g₦) & CARS (HIDDEN UNTIL BOUGHT)
  const [hasDriversLicense, setHasDriversLicense] = useState(false);
  const [drivingLessonsDone, setDrivingLessonsDone] = useState(0);
  const [carsOwned, setCarsOwned] = useState<string[]>([]);
  const [activeCar, setActiveCar] = useState<string>("None");
  const [carPetrol, setCarPetrol] = useState(100);
  const [carRadiatorWater, setCarRadiatorWater] = useState(100);
  const [carEngineHealth, setCarEngineHealth] = useState(100);

  // 10. SEPARATED EDUCATION BUILDINGS STATE
  const [schoolBuildingTab, setSchoolBuildingTab] = useState<"poly" | "uni" | "blueprints" | "pro_certs">("poly");
  const [completedDegrees, setCompletedDegrees] = useState<string[]>([]);
  const [professionalCerts, setProfessionalCerts] = useState<string[]>([]);
  const [specialistCerts, setSpecialistCerts] = useState<string[]>([]);
  const [ownedBlueprints, setOwnedBlueprints] = useState<string[]>([]);
  const [architectApprovedBps, setArchitectApprovedBps] = useState<string[]>([]);
  const [enrolledProgram, setEnrolledProgram] = useState<{
    id: string;
    name: string;
    totalClasses: number;
    completedClasses: number;
    energyPerLecture: number;
    timerSeconds: number;
  } | null>(null);
  const [cvScore, setCvScore] = useState(0);
  const [outfit, setOutfit] = useState("Singlet & Bathroom Slippers");
  const [hasCorporateSuit, setHasCorporateSuit] = useState(false);

  // 11. SEPARATED JOB BUILDINGS STATE
  const [jobBuildingTab, setJobBuildingTab] = useState<"street" | "specialist" | "corporate" | "social_gigs">("street");
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

  // 12. KIOSKS, EATERIES & ARCHITECTURAL FIRMS
  const [ownsBillboardAsset, setOwnsBillboardAsset] = useState(false);
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
      customer: "@tunde_oshodi",
      bizName: "Lagos Food Guide",
      comment: "Recruit Certified Rice, Soup & Malt chefs in your Eatery to trigger 5-star health & point reviews!",
      healthBonus: 10,
      pointsBonus: 5,
      stars: "⭐⭐⭐",
    },
  ]);

  // 13. POLITICS (MUST PHYSICALLY BE AT PARTY SECRETARIAT FOR 3 DAYS!) & COURTSHIP
  const [partyStatus, setPartyStatus] = useState<"None" | "Member_JPC" | "Member_JSTD">("None");
  const [partyDaysAttended, setPartyDaysAttended] = useState<number>(0); // Requires 3 Days present at Secretariat!
  const [nominationStatus, setNominationStatus] = useState<"None" | "Submitted_Verified">("None");
  const [hiredAgenciesForPoster, setHiredAgenciesForPoster] = useState<string[]>([]);
  const [cityBillboardText, setCityBillboardText] = useState("BILLBOARD AVAILABLE — Agency & Billboard Owners Only!");
  const [hasVoted, setHasVoted] = useState(false);

  const [maritalStatus, setMaritalStatus] = useState<"Single" | "Courting" | "Married">("Single");
  const [partnerName, setPartnerName] = useState("None");
  const [partnerRequirement, setPartnerRequirement] = useState("Must own a TV & Cushion Sofa");
  const [datesCompleted, setDatesCompleted] = useState(0);
  const [relationshipBond, setRelationshipBond] = useState(0);

  const [activeTab, setActiveTab] = useState<"map" | "home" | "jobs" | "school" | "empire" | "politics" | "profile">("map");
  const [logMessage, setLogMessage] = useState(
    "Welcome! Check your Exact Position in the top bar. Click any [?] button on the meters to see how to maintain your stats, or hire a House Maid for 5-minute automation!"
  );

  const maxEnergyCap = bedTier === "Bare_Floor" ? 60 : bedTier === "Foam_Mattress" ? 85 : 100;

  // CRITICAL CONDITION SCORE (0% = Safe, 100% = Imminent Hospital Collapse!)
  const criticalDangerPct = Math.min(
    100,
    Math.max(0, Math.round((100 - health) * 0.6 + (100 - hunger) * 0.4))
  );

  // ACADEMIC PROGRESS BAR PERCENTAGE FOR DOSSIER
  const academicProgressPct = Math.min(100, completedDegrees.length * 20 + professionalCerts.length * 10);

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

  const spendMoney = (cost: number): boolean => {
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

  // COMMUTE TO ANOTHER AREA OR RETURN BACK TO MY HOME!
  const handleCommuteTo = (dest: AreaName, mode: "trek" | "bus" | "cab" | "car", goingHome = false) => {
    const costs = getTransportCosts(dest);

    if (mode === "trek") {
      if (energy < 15) return setLogMessage("⚠️ Too weak to trek! Take a Bus or Cab.");
      startCooldown("commute", 45);
      setEnergy((e) => Math.max(5, e - costs.trekEnergy));
      setArea(dest);
    } else if (mode === "bus") {
      if (!spendMoney(costs.busCost)) return;
      startCooldown("commute", 30);
      setArea(dest);
    } else if (mode === "cab") {
      if (!spendMoney(costs.cabCost)) return;
      startCooldown("commute", 15);
      setArea(dest);
    } else if (mode === "car") {
      if (!hasDriversLicense) return setLogMessage("🚓 FRSC BLOCKED: Get your Driver's License (75k) at Oshodi Driving School first!");
      if (carPetrol < costs.petrolUsed || carRadiatorWater < costs.waterUsed || carEngineHealth < 30) {
        return setLogMessage("⚠️ Check your Car Petrol, Radiator Water, or Engine Health before driving!");
      }
      startCooldown("commute", 10);
      setCarPetrol((p) => Math.max(0, p - costs.petrolUsed));
      setCarRadiatorWater((w) => Math.max(0, w - costs.waterUsed));
      setCarEngineHealth((h) => Math.max(0, h - costs.wearTear));
      setArea(dest);
    }

    if (goingHome && dest === shelterArea) {
      setIsAtHome(true);
      setEnteredBuildingId("None");
      setExactPosition(`🏠 Inside My Home (${shelterType} in ${shelterArea})`);
      setActiveTab("home");
      setLogMessage(`🏠 Returned safely to your home in ${shelterArea} via ${mode.toUpperCase()}!`);
    } else {
      setIsAtHome(false);
      setEnteredBuildingId("None");
      setIsMapZoomedOut(false);
      setExactPosition(`🚶🏾‍♂️ Standing on ${dest} Main Street (Outside Home)`);
      setLogMessage(`🚌 Arrived at ${dest} Main Street via ${mode.toUpperCase()}!`);
    }
  };

  if (!isCreated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border-2 border-emerald-500 rounded-2xl p-6 shadow-2xl">
          <div className="inline-block px-3 py-1 bg-emerald-500 text-slate-950 text-xs font-extrabold rounded-full mb-3">
            LAGOS EMPIRE — 100M c₦ &amp; MAID AUTOMATION EDITION
          </div>
          <h1 className="text-2xl font-extrabold mb-2">Start From Scratch</h1>
          <p className="text-slate-400 text-sm mb-6">
            Begin in Oshodi with 50,000 g₦. Track your exact building position, eat at public eateries or cook at home, hire a 5-minute automated House Maid, and build your net worth toward the 100,000,000 c₦ (= ₦5,000) cashout!
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

  // SUB-MAP BUILDINGS FOR EACH AREA (NOW INCLUDES PUBLIC EATERY & FULL MARKET!)
  const subMapBuildings: Record<AreaName, { id: string; roofColor: string; icon: string; name: string; sub: string }[]> = {
    Oshodi: [
      { id: "Public_Eatery", roofColor: "bg-amber-600", icon: "🍛", name: "Oshodi Mama Put & Eatery", sub: "Buy 6 Standard Hot Meals" },
      { id: "Gas_Kitchen_Shop", roofColor: "bg-emerald-600", icon: "🔥", name: "Oshodi Market & Gas Depot", sub: "3 Gas Sizes & 4 Food Bundles" },
      { id: "Hospital", roofColor: "bg-rose-600", icon: "🏥", name: "Oshodi General Hospital", sub: "100% Full Restore + 2d Shield" },
      { id: "Gym", roofColor: "bg-orange-600", icon: "🏋🏾‍♂️", name: "Oshodi Fitness Gym", sub: "1hr / Weekly / Monthly Plans" },
      { id: "Driving_School", roofColor: "bg-yellow-600", icon: "🪪", name: "FRSC & Driving School", sub: "3 Lessons + 75k License" },
      { id: "Mechanic_Shop", roofColor: "bg-purple-600", icon: "🔧", name: "Mechanic & Radiator Depot", sub: "Fix Engine & Water" },
      { id: "Agent_Office", roofColor: "bg-cyan-600", icon: "🏘️", name: "Oshodi Estate Agent", sub: "Rent, Buy or Landlord Form" },
      { id: "Church_Lounge", roofColor: "bg-indigo-600", icon: "⛪", name: "Oshodi Church & Park", sub: "Meet People & 10 Dates" },
    ],
    Berger: [
      { id: "Public_Eatery", roofColor: "bg-amber-600", icon: "🍛", name: "Berger Highway Bukka", sub: "Buy 6 Standard Hot Meals" },
      { id: "Auto_Dealership", roofColor: "bg-emerald-600", icon: "🚗", name: "Berger Motor Dealership", sub: "10 Car Models" },
      { id: "Filling_Station", roofColor: "bg-yellow-600", icon: "⛽", name: "NNPC Mega Station", sub: "Petrol & Water" },
      { id: "Builder_Yard", roofColor: "bg-orange-600", icon: "🏗️", name: "Julius Berger Builders", sub: "Construct Blueprints" },
      { id: "Furniture_Shop", roofColor: "bg-indigo-600", icon: "🛏️", name: "Mattress & Sofa Showroom", sub: "Beds & Sofas" },
      { id: "Hospital", roofColor: "bg-rose-600", icon: "🏥", name: "Berger Medical Clinic", sub: "100% Restore + 2d Shield" },
      { id: "Agent_Office", roofColor: "bg-cyan-600", icon: "🏘️", name: "Berger Estate Agent", sub: "Houses & Landlord Form" },
    ],
    Yaba: [
      { id: "Public_Eatery", roofColor: "bg-amber-600", icon: "🍛", name: "Yaba Unilag Jollof Spot", sub: "Buy 6 Standard Hot Meals" },
      { id: "Academic_Campus", roofColor: "bg-indigo-600", icon: "🎓", name: "Yaba Education Street", sub: "Poly, Uni, Blueprints & Certs" },
      { id: "Architect_Firm", roofColor: "bg-cyan-600", icon: "📐", name: "Yaba Architectural Firm", sub: "Stamp Blueprints" },
      { id: "Electronics_Shop", roofColor: "bg-purple-600", icon: "📺", name: "Yaba TV & Tech Plaza", sub: "4 TV Tiers" },
      { id: "Gym", roofColor: "bg-orange-600", icon: "🏋🏾‍♂️", name: "Yaba Fitness Center", sub: "1hr / Weekly / Monthly Plans" },
      { id: "Agent_Office", roofColor: "bg-emerald-600", icon: "🏘️", name: "Yaba Estate Agent", sub: "Flats & Landlord Form" },
    ],
    Surulere: [
      { id: "Public_Eatery", roofColor: "bg-amber-600", icon: "🍛", name: "Surulere Kilimanjaro Eatery", sub: "Buy 6 Standard Hot Meals" },
      { id: "CAC_Office", roofColor: "bg-yellow-600", icon: "🏛️", name: "CAC Corporate Registry", sub: "Register Business" },
      { id: "Church_Lounge", roofColor: "bg-rose-600", icon: "🥂", name: "Surulere Mall & Lounge", sub: "Chat & 10-Date Courtship" },
      { id: "Gym", roofColor: "bg-orange-600", icon: "🏋🏾‍♂️", name: "National Stadium Gym", sub: "1hr / Weekly / Monthly Plans" },
      { id: "Hospital", roofColor: "bg-emerald-600", icon: "🏥", name: "Surulere General Hospital", sub: "100% Restore + 2d Shield" },
      { id: "Agent_Office", roofColor: "bg-cyan-600", icon: "🏘️", name: "Surulere Estate Agent", sub: "Duplexes & Landlord Form" },
    ],
    Lekki: [
      { id: "Public_Eatery", roofColor: "bg-amber-600", icon: "🍛", name: "Lekki Continental Bistro", sub: "Buy 6 Standard Hot Meals" },
      { id: "Lands_Bureau", roofColor: "bg-yellow-600", icon: "📜", name: "Lekki Lands & C-of-O", sub: "Buy Land & C-of-O" },
      { id: "Agent_Office", roofColor: "bg-cyan-600", icon: "🏰", name: "Lekki Luxury Estate Agent", sub: "Duplexes & Landlord Form" },
      { id: "Filling_Station", roofColor: "bg-emerald-600", icon: "⛽", name: "Lekki Express Fuel", sub: "Petrol & Water" },
      { id: "Church_Lounge", roofColor: "bg-rose-600", icon: "⛪", name: "Lekki VIP Lounge & Church", sub: "High-Class Courtship" },
      { id: "Hospital", roofColor: "bg-purple-600", icon: "🏥", name: "Lekki Lagoon Hospital", sub: "100% Restore + 2d Shield" },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-28">
      {/* TOP BAR WITH EXACT PLAYER POSITION TRACKING & 100M c₦ = ₦5,000 */}
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
                {hospitalImmunityDaysLeft > 0 && (
                  <span className="text-[11px] px-2 py-0.5 bg-emerald-600 text-white font-extrabold rounded-full">
                    🛡️ Hospital Shield: {hospitalImmunityDaysLeft}d
                  </span>
                )}
                {hospitalLoanDebt > 0 && (
                  <span className="text-[11px] px-2 py-0.5 bg-red-600 text-white font-extrabold rounded-full">
                    🚑 Hospital Debt: -{hospitalLoanDebt.toLocaleString()} c₦
                  </span>
                )}
              </div>
              {/* EXACT PLAYER POSITION DISPLAY */}
              <div className="text-xs text-slate-300 flex flex-wrap items-center gap-2 mt-0.5">
                <span className="text-amber-400 font-extrabold">📍 Exact Position: {exactPosition}</span>
                • <span className={isAtHome ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                  {isAtHome ? "✓ At Home" : "⚠️ Away From Home (Use Transport to Return)"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
              <div className="text-[10px] text-slate-400 uppercase">Starter / Deposit (g₦)</div>
              <div className="font-extrabold text-sm text-amber-400">{starterBalance.toLocaleString()} g₦</div>
            </div>
            <div className="bg-slate-950 border border-emerald-900/60 rounded-xl px-3 py-1.5">
              <div className="text-[10px] text-emerald-400 uppercase flex items-center gap-1">
                Earned Cashout (100M c₦ = ₦5k) <Lock className="w-2.5 h-2.5" />
              </div>
              <div className="font-extrabold text-sm text-emerald-400">{earnedBalance.toLocaleString()} c₦</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-3">
        {/* RETURN HOME / TRANSPORT BAR (ALWAYS ACTIVE WHEN NOT AT HOME!) */}
        {!isAtHome && (
          <div className="bg-rose-950/40 border-2 border-rose-500/60 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div>
              <span className="font-extrabold text-rose-300">
                🚶🏾‍♂️ You are currently at: {exactPosition} (Your Home is in {shelterArea})
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => handleCommuteTo(shelterArea, "trek", true)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg"
              >
                🚶🏾‍♂️ Trek Home to {shelterArea} (₦0)
              </button>
              <button
                onClick={() => handleCommuteTo(shelterArea, "bus", true)}
                className="px-2.5 py-1 bg-amber-500 text-slate-950 font-extrabold rounded-lg"
              >
                🚐 Bus Home to {shelterArea} ({getTransportCosts(shelterArea).busCost.toLocaleString()} g₦)
              </button>
              <button
                onClick={() => handleCommuteTo(shelterArea, "cab", true)}
                className="px-2.5 py-1 bg-indigo-600 text-white font-extrabold rounded-lg"
              >
                🚕 Cab Home ({getTransportCosts(shelterArea).cabCost.toLocaleString()} g₦)
              </button>
              {carsOwned.length > 0 && (
                <button
                  onClick={() => handleCommuteTo(shelterArea, "car", true)}
                  className="px-2.5 py-1 bg-emerald-500 text-slate-950 font-extrabold rounded-lg"
                >
                  🚗 Drive {activeCar} Home
                </button>
              )}
            </div>
          </div>
        )}

        {/* INTERACTIVE METERS WITH CLASSIC GAME [?] INDICATOR TOOLTIPS + CRITICAL HOSPITAL BAR! */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2">
          <div className={`grid grid-cols-2 ${carsOwned.length > 0 ? "sm:grid-cols-8" : "sm:grid-cols-5"} gap-2`}>
            <StatBar
              icon={<Heart className="w-3.5 h-3.5 text-rose-400" />}
              label="Health"
              value={`${health}%`}
              pct={health}
              color="bg-rose-500"
              onHelp={() =>
                setActiveGuideTip("❤️ HEALTH INDICATOR: Drops if Belly hits 0% or you trek too far. Boost it by: Eating at Eateries, Cooking at Home, Working out at the Gym, visiting the Hospital, or hiring a House Maid!")
              }
            />
            <StatBar
              icon={<Zap className="w-3.5 h-3.5 text-amber-400" />}
              label={`Energy (Cap ${maxEnergyCap}%)`}
              value={`${energy}%`}
              pct={energy}
              color="bg-amber-500"
              onHelp={() =>
                setActiveGuideTip("⚡ ENERGY INDICATOR: Used for Jobs, Lectures & Trekking. Capped at 60% on a Bare Floor, 85% on a Foam Mattress, and 100% on a Royal King Bed! Boost by Sleeping at Home, Eating, or Maid Automation.")
              }
            />
            <StatBar
              icon={<Utensils className="w-3.5 h-3.5 text-orange-400" />}
              label="Belly/Diet"
              value={`${hunger}%`}
              pct={hunger}
              color="bg-orange-500"
              onHelp={() =>
                setActiveGuideTip("🍛 BELLY/DIET INDICATOR: Drops every hour. If it stays at 0%, you starve and collapse! Boost by: Entering any Area Public Eatery, Cooking with your Gas Stove at Home, or hiring a House Maid.")
              }
            />
            <StatBar
              icon={<Sparkles className="w-3.5 h-3.5 text-cyan-400" />}
              label="Steeze/Respect"
              value={`${steeze} pts`}
              pct={Math.min(100, steeze)}
              color="bg-cyan-500"
              onHelp={() =>
                setActiveGuideTip("✨ STEEZE & RESPECT INDICATOR: Determines your social class, marriage appeal, and VIP access. Boost by: Painting your room, buying a TV/Sofa, wearing a Corporate Suit, earning Degrees, or buying Cars!")
              }
            />
            {/* NEW: CRITICAL MEDICAL CONDITION BAR */}
            <StatBar
              icon={<Stethoscope className="w-3.5 h-3.5 text-red-400" />}
              label="Critical Risk"
              value={`${criticalDangerPct}%`}
              pct={criticalDangerPct}
              color={criticalDangerPct > 70 ? "bg-red-600 animate-pulse" : "bg-emerald-500"}
              onHelp={() =>
                setActiveGuideTip("🚑 CRITICAL RISK BAR: If this bar reaches 85%-100% (from low Health/Belly), you will collapse and be rushed to the Hospital! Keep it low by eating regularly or hiring a Maid.")
              }
            />

            {carsOwned.length > 0 && (
              <>
                <StatBar icon={<Fuel className="w-3.5 h-3.5 text-emerald-400" />} label="Petrol" value={`${carPetrol}%`} pct={carPetrol} color="bg-emerald-500" onHelp={() => setActiveGuideTip("⛽ PETROL: Visit any NNPC/Lekki Filling Station on the Map to refill.")} />
                <StatBar icon={<Droplets className="w-3.5 h-3.5 text-cyan-400" />} label="Radiator" value={`${carRadiatorWater}%`} pct={carRadiatorWater} color="bg-cyan-500" onHelp={() => setActiveGuideTip("💧 RADIATOR WATER: Keeps your car engine from overheating. Top up at Mechanic or Filling Station.")} />
                <StatBar icon={<Wrench className="w-3.5 h-3.5 text-purple-400" />} label="Engine" value={`${carEngineHealth}%`} pct={carEngineHealth} color="bg-purple-500" onHelp={() => setActiveGuideTip("🔧 CAR ENGINE HEALTH: Repair at Oshodi Mechanic Village.")} />
              </>
            )}
          </div>

          {/* SHORT CLASSIC GAME INDICATOR EXPLANATION BAR */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-[11px] text-amber-300 flex items-center justify-between">
            <span>{activeGuideTip}</span>
            {hasHiredMaid && (
              <span className="text-emerald-400 font-bold shrink-0 ml-2">
                👩🏾‍🍳 Maid Auto-Feed in: {formatSecs(maidTimerSecs)} (Satisfaction: {maidSatisfaction}%)
              </span>
            )}
          </div>
        </div>

        {/* EVENT LOG */}
        <div className="bg-emerald-950/40 border border-emerald-800/60 text-emerald-200 px-4 py-2 rounded-xl text-sm font-medium">
          🔔 {logMessage}
        </div>

        {/* =====================================================================
            TAB 1: 🗺️ ILLUSTRATED 2D TOWN MAP & SUB-MAP (WITH FULL EATERY, MARKET & GYM PLANS!)
           ===================================================================== */}
        {activeTab === "map" && (
          <div className="space-y-4 text-xs">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-extrabold text-base text-white">
                  🗺️ {isMapZoomedOut ? "Lagos State Overview Map (5 Areas)" : `${area} Illustrated Town Street Map`}
                </h2>
                <p className="text-slate-400 text-[11px]">
                  Click any building below to walk inside! Notice how your <strong>Exact Position</strong> updates when you enter a building.
                </p>
              </div>
              <button
                onClick={() => { setIsMapZoomedOut(!isMapZoomedOut); setEnteredBuildingId("None"); }}
                className="px-4 py-2 bg-amber-500 text-slate-950 font-extrabold rounded-xl flex items-center gap-1.5"
              >
                {isMapZoomedOut ? <ZoomIn className="w-4 h-4" /> : <ZoomOut className="w-4 h-4" />}
                {isMapZoomedOut ? `Enter ${area} Street` : "Zoom Out: View All 5 Lagos Areas"}
              </button>
            </div>

            {isMapZoomedOut ? (
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
                          Open {dest} Street
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
              <div className="rounded-3xl border-4 border-emerald-800/80 bg-gradient-to-b from-emerald-950/70 via-emerald-900/30 to-emerald-950/70 p-5 space-y-5 shadow-2xl">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  {shelterArea === area && (
                    <button
                      onClick={() => {
                        setIsAtHome(true);
                        setExactPosition(`🏠 Inside My Home (${shelterType} in ${shelterArea})`);
                        setActiveTab("home");
                      }}
                      className="bg-slate-900/95 border-2 border-emerald-400 rounded-2xl overflow-hidden shadow-xl hover:scale-[1.02] transition flex flex-col"
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
                      onClick={() => {
                        setEnteredBuildingId(b.id);
                        setIsAtHome(false);
                        setExactPosition(`🏢 Inside ${b.name} (${area})`);
                        setLogMessage(`🚪 Walked inside ${b.name} in ${area}!`);
                      }}
                      className={`bg-slate-900/95 border-2 ${
                        enteredBuildingId === b.id ? "border-amber-400 ring-2 ring-amber-400/50" : "border-slate-700"
                      } rounded-2xl overflow-hidden shadow-xl hover:scale-[1.02] transition flex flex-col`}
                    >
                      <div className={`w-full h-5 ${b.roofColor} flex items-center justify-between px-2 text-[9px] font-extrabold text-white uppercase`}>
                        <span>🏢 {area}</span>
                        <span>■■</span>
                      </div>
                      <div className="p-3 flex flex-col items-center gap-1">
                        <div className="text-3xl">{b.icon}</div>
                        <div className="font-extrabold text-white text-xs text-center">{b.name}</div>
                        <div className="text-[10px] text-slate-400 text-center">{b.sub}</div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* ===============================================================
                    INTERIORS OF CLICKED BUILDINGS ON THE STREET MAP
                   =============================================================== */}

                {/* 1. PUBLIC EATERY & RESTAURANT INTERIOR (6 STANDARD MEALS!) */}
                {enteredBuildingId === "Public_Eatery" && (
                  <div className="p-4 bg-slate-950 border-2 border-amber-500 rounded-2xl space-y-3">
                    <h3 className="font-extrabold text-sm text-amber-400">
                      🍛 Inside {area} Public Eatery &amp; Restaurant (Select a Standard Meal to Boost Belly, Energy &amp; Health)
                    </h3>
                    <div className="grid sm:grid-cols-3 gap-2.5">
                      {[
                        { name: "🍞 Agege Bread & Ewa Agoyin", cost: 2000, belly: 35, en: 20, hp: 5 },
                        { name: "🍛 Party Jollof Rice & Plantain", cost: 4500, belly: 50, en: 35, hp: 15 },
                        { name: "🍲 Amala, Ewedu & Gbegiri + Assorted", cost: 6000, belly: 65, en: 45, hp: 20 },
                        { name: "🥣 Pounded Yam & Egusi Soup + Goat Meat", cost: 8500, belly: 80, en: 55, hp: 25 },
                        { name: "🐟 Catfish Pepper Soup & Chilled Malt", cost: 11000, belly: 75, en: 60, hp: 35 },
                        { name: "🍗 Executive Mixed Grill, Prawns & Salad", cost: 18000, belly: 100, en: 85, hp: 50 },
                      ].map((meal, idx) => (
                        <div key={idx} className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5">
                          <div className="font-bold text-white">{meal.name}</div>
                          <div className="text-[10px] text-emerald-400">
                            +{meal.belly}% Belly • +{meal.en}% Energy • +{meal.hp}% Health
                          </div>
                          <button
                            onClick={() => {
                              if (spendMoney(meal.cost)) {
                                setHunger((b) => Math.min(100, b + meal.belly));
                                setEnergy((e) => Math.min(maxEnergyCap, e + meal.en));
                                setHealth((h) => Math.min(100, h + meal.hp));
                                setLogMessage(`🍛 Ate ${meal.name} at ${area} Eatery! Belly +${meal.belly}%, Energy +${meal.en}%, Health +${meal.hp}%.`);
                              }
                            }}
                            className="w-full py-1.5 bg-amber-500 text-slate-950 font-extrabold rounded-lg"
                          >
                            Buy &amp; Eat ({meal.cost.toLocaleString()} g₦)
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. OSHODI MARKET & GAS DEPOT INTERIOR (DIFFERENT GAS SIZES & RAW FOOD BUNDLES!) */}
                {enteredBuildingId === "Gas_Kitchen_Shop" && (
                  <div className="p-4 bg-slate-950 border-2 border-emerald-500 rounded-2xl space-y-4">
                    <h3 className="font-extrabold text-sm text-emerald-400">
                      🔥 Inside {area} Central Market &amp; Cooking Gas Depot (Stoves, 3 Gas Sizes &amp; 4 Raw Food Bundles)
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* GAS CYLINDERS & STOVES */}
                      <div className="space-y-2">
                        <div className="font-bold text-orange-400 uppercase">1. Stoves &amp; Gas Cylinder Refills</div>
                        <button
                          disabled={hasCookingStove}
                          onClick={() => { if (spendMoney(35000)) { setHasCookingStove(true); setGasLevel(40); setLogMessage("🔥 Bought Tabletop Double Gas Burner!"); }}}
                          className="w-full p-2.5 bg-slate-900 border border-orange-700 rounded-xl flex justify-between font-bold disabled:opacity-40"
                        >
                          <span>{hasCookingStove ? "✓ Owned: Gas Stove Burner" : "🔥 Buy Tabletop Gas Stove Burner"}</span>
                          <span className="text-amber-400">35,000 g₦</span>
                        </button>
                        {[
                          { name: "⛽ 3kg Small Camp Gas Refill (+30% Gas)", addGas: 30, cost: 4500 },
                          { name: "⛽ 12.5kg Standard Home Gas Cylinder (+75% Gas)", addGas: 75, cost: 12000 },
                          { name: "⛽ 50kg Mega Family Gas Cylinder (100% Full)", addGas: 100, cost: 22000 },
                        ].map((g, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              if (!hasCookingStove) return setLogMessage("❌ Buy the Tabletop Gas Stove Burner above first!");
                              if (spendMoney(g.cost)) {
                                setGasLevel((lvl) => Math.min(100, lvl + g.addGas));
                                setLogMessage(`⛽ Purchased ${g.name}!`);
                              }
                            }}
                            className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex justify-between font-bold"
                          >
                            <span>{g.name}</span>
                            <span className="text-amber-400">{g.cost.toLocaleString()} g₦</span>
                          </button>
                        ))}
                      </div>

                      {/* RAW FOODSTUFF BUNDLES */}
                      <div className="space-y-2">
                        <div className="font-bold text-emerald-400 uppercase">2. Raw Foodstuff Market Bundles (Cook at Home)</div>
                        {[
                          { name: "🫘 Bachelor Garri, Beans & Palm Oil Pack (3 Meals)", meals: 3, cost: 5000 },
                          { name: "🍚 Raw Jollof Rice, Turkey & Tomato Crate (6 Meals)", meals: 6, cost: 11000 },
                          { name: "🍠 Tuber of Yam, Plantain & Egg Basket (10 Meals)", meals: 10, cost: 18000 },
                          { name: "🥩 Full Month Family Soup, Rice & Beef Bag (20 Meals)", meals: 20, cost: 32000 },
                        ].map((f, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              if (spendMoney(f.cost)) {
                                setRawFoodServings((r) => r + f.meals);
                                setLogMessage(`🌾 Bought ${f.name}! (+${f.meals} Home Meals added to your kitchen).`);
                              }
                            }}
                            className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex justify-between font-bold"
                          >
                            <span>{f.name}</span>
                            <span className="text-emerald-400">{f.cost.toLocaleString()} g₦</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. FIXED HOSPITAL INTERIOR (FILLS HEALTH, ENERGY & BELLY TO 100% + 2-DAY SHIELD!) */}
                {enteredBuildingId === "Hospital" && (
                  <div className="p-4 bg-slate-950 border-2 border-rose-500 rounded-2xl space-y-3">
                    <h3 className="font-extrabold text-sm text-rose-400">
                      🏥 Inside {area} General Hospital (Restores Health, Energy &amp; Belly to 100% + Grants 2-Day Protection Shield!)
                    </h3>
                    <p className="text-slate-400">
                      When treated here, your <strong>Health (100%)</strong>, <strong>Energy ({maxEnergyCap}%)</strong>, and <strong>Belly (100%)</strong> are completely filled, and you get a <strong>2-Day Medical Immunity Shield</strong> so your bars stay stable for 2 days!
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => {
                          if (spendMoney(25000)) {
                            setHealth(100);
                            setEnergy(maxEnergyCap);
                            setHunger(100);
                            setHospitalImmunityDaysLeft(2);
                            setLogMessage("🏥 Full Hospital Treatment Complete! Health, Energy & Belly restored to 100% + 2-Day Immunity Shield activated!");
                          }
                        }}
                        className="px-4 py-2.5 bg-emerald-500 text-slate-950 font-extrabold rounded-xl"
                      >
                        💊 Pay Cash for Full Discharge (25,000 g₦ -&gt; 100% All Stats + 2-Day Shield)
                      </button>
                      <button
                        onClick={() => {
                          setHealth(100);
                          setEnergy(maxEnergyCap);
                          setHunger(100);
                          setHospitalImmunityDaysLeft(2);
                          setHospitalLoanDebt((d) => d + 60000);
                          setLogMessage("🚑 Treated on Emergency Hospital Credit (+60,000 c₦ Loan)! All stats restored to 100% for 2 days.");
                        }}
                        className="px-4 py-2.5 bg-rose-600 text-white font-extrabold rounded-xl"
                      >
                        🚑 Treat on Emergency Loan (For Starving/Broke Players • 100% Restore + 2-Day Shield)
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. GYM INTERIOR WITH ENROLLMENT PLANS (1-HOUR, WEEKLY, MONTHLY VIP) */}
                {enteredBuildingId === "Gym" && (
                  <div className="p-4 bg-slate-950 border-2 border-orange-500 rounded-2xl space-y-3">
                    <h3 className="font-extrabold text-sm text-orange-400">
                      🏋🏾‍♂️ Inside {area} Fitness &amp; Weight Center (Current Plan: {gymPlan.replaceAll("_", " ")})
                    </h3>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {[
                        { id: "1_Hour_Pass", name: "⏱️ 1-Hour Single Gym Pass", cost: 5000, desc: "Instant 1-time workout session" },
                        { id: "Weekly_Plan", name: "📅 Weekly Gym Membership", cost: 25000, desc: "Unlimited workouts for 7 days" },
                        { id: "Monthly_VIP", name: "👑 Monthly VIP Spa & Gym Plan", cost: 80000, desc: "Unlimited workouts + +25% Health & Steeze" },
                      ].map((pl) => (
                        <div key={pl.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5">
                          <div className="font-bold text-white">{pl.name}</div>
                          <div className="text-[10px] text-slate-400">{pl.desc}</div>
                          <button
                            onClick={() => {
                              if (spendMoney(pl.cost)) {
                                setGymPlan(pl.id as any);
                                setHealth(100);
                                setWeight((w) => Number(Math.max(54, w - 0.8).toFixed(1)));
                                setSteeze((s) => s + 15);
                                setLogMessage(`🏋🏾‍♂️ Enrolled in ${pl.name} & completed workout! Health 100%, -0.8kg weight, +15 Steeze!`);
                              }
                            }}
                            className="w-full py-1.5 bg-orange-500 text-slate-950 font-extrabold rounded-lg"
                          >
                            Enroll ({pl.cost.toLocaleString()} g₦)
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* OTHER MAP INTERIORS */}
                {enteredBuildingId === "Driving_School" && (
                  <div className="p-4 bg-slate-950 border-2 border-amber-500 rounded-2xl flex flex-wrap gap-3">
                    <button disabled={drivingLessonsDone >= 3} onClick={() => { if (spendMoney(25000)) setDrivingLessonsDone((d) => d + 1); }} className="px-4 py-2 bg-amber-500 text-slate-950 font-extrabold rounded-xl">{drivingLessonsDone >= 3 ? "✓ 3/3 Lessons Done" : `Driving Lesson (${drivingLessonsDone}/3) • 25k`}</button>
                    <button disabled={hasDriversLicense || drivingLessonsDone < 3} onClick={() => { if (spendMoney(75000)) { setHasDriversLicense(true); setLogMessage("🪪 FRSC Driver's License Issued!"); }}} className="px-4 py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-xl">{hasDriversLicense ? "✓ Licensed" : "Get FRSC License (75,000 g₦)"}</button>
                  </div>
                )}

                {enteredBuildingId === "Agent_Office" && (
                  <div className="p-4 bg-slate-950 border-2 border-cyan-500 rounded-2xl space-y-3">
                    <h3 className="font-extrabold text-sm text-cyan-400">🏘️ Inside {area} Estate Agent Office</h3>
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
                            <button onClick={() => { if (spendMoney(p.rent)) { setShelterType(p.name); setShelterArea(area); setOwnershipMode("Rented"); setRentPer8Weeks(p.rent); setWeeksUntilRentDue(8); setParkingSlots(p.park); }}} className="py-1.5 bg-cyan-600 text-white font-bold rounded-lg">Rent/8Wks ({(p.rent / 1000).toFixed(0)}k)</button>
                            <button onClick={() => { if (spendMoney(p.buy)) { setOwnedProperties((prev) => [...prev, { name: p.name, area, roomsAvailable: p.rooms, parking: p.park, paidAgentForm: false, isListedWithAgent: false, listedPricePerRoom: 250000, weeksLeftToCollect: 8 }]); setLogMessage(`🏰 Bought ${p.name}!`); }}} className="py-1.5 bg-amber-500 text-slate-950 font-extrabold rounded-lg">Buy ({(p.buy / 1000000).toFixed(1)}M)</button>
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
            TAB 2: 🏠 MY HOME + CERTIFIED HOUSE MAID (5-MINUTE AUTO-MAINTENANCE!)
           ===================================================================== */}
        {activeTab === "home" && (
          <div className="grid md:grid-cols-3 gap-4 text-xs">
            <div className={`md:col-span-2 rounded-2xl border-2 p-6 relative min-h-[380px] flex flex-col justify-between ${wallBgMap[wallColor]}`}>
              {!isAtHome ? (
                <div className="my-auto text-center bg-black/85 p-6 rounded-2xl border border-rose-500 space-y-3">
                  <div className="text-3xl">🚌</div>
                  <h3 className="font-extrabold text-base text-rose-400">You Are Currently Not at Home!</h3>
                  <p className="text-slate-300">Your current position is: <strong>{exactPosition}</strong>. Take a Bus, Cab, or Trek back to your home in <strong>{shelterArea}</strong> above!</p>
                  <button onClick={() => handleCommuteTo(shelterArea, "bus", true)} className="px-4 py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-xl">
                    🚐 Take Bus Back Home to {shelterArea}
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="bg-black/65 px-3 py-1 rounded-lg font-extrabold text-emerald-300 block">🏠 {shelterType} ({shelterArea})</span>
                      <span className="bg-black/65 px-3 py-1 rounded-lg text-amber-300 block">🧱 Wall: {wallColor} • Bed: {bedTier} • Sofa: {chairTier}</span>
                      {hasHiredMaid && (
                        <span className="bg-emerald-950/90 border border-emerald-500 px-3 py-1 rounded-lg text-emerald-300 font-bold block">
                          👩🏾‍🍳 Certified House Maid Active (Auto-Feeds &amp; Maintains Health Every 5m • Next: {formatSecs(maidTimerSecs)})
                        </span>
                      )}
                    </div>
                    <div className="bg-slate-950/90 border border-slate-700 rounded-xl p-3 text-center">
                      <div className="text-2xl">{tvTier === "None" ? "📦" : "📺"}</div>
                      <div className="font-bold">{tvTier}</div>
                      {tvTier !== "None" && (
                        <button onClick={() => { if (hasLagosFlix) setShowTvModal(true); }} className="mt-1 px-2 py-1 bg-rose-600 text-white rounded text-[10px] font-bold">▶ Watch LagosFlix</button>
                      )}
                    </div>
                  </div>

                  <div className="bg-black/60 p-3 rounded-xl flex flex-wrap justify-between items-center gap-2">
                    <span>🍲 Kitchen Stock: <strong>{rawFoodServings} Raw Meals</strong> • 🔥 Gas: <strong>{gasLevel}%</strong></span>
                    <button
                      onClick={() => {
                        if (!hasCookingStove || gasLevel < 10 || rawFoodServings < 1) {
                          return setLogMessage("❌ Visit Oshodi Market on the Map to buy a Gas Stove, Gas Refill & Raw Food Bundles!");
                        }
                        setGasLevel((g) => g - 10);
                        setRawFoodServings((r) => r - 1);
                        setHunger(100);
                        setEnergy(maxEnergyCap);
                        setHealth((h) => Math.min(100, h + 15));
                        setLogMessage("🍳 Cooked a fresh meal at home! Belly 100%, Energy full, +15% Health!");
                      }}
                      className="px-3 py-1.5 bg-emerald-500 text-slate-950 font-extrabold rounded-lg"
                    >
                      🍳 Cook Meal at Home
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* RIGHT PANEL: HIRE CERTIFIED MAID (5-MIN AUTOMATION) & FURNISHING */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <h2 className="font-bold text-sm text-emerald-400">👩🏾‍🍳 5-Minute House Maid Automation &amp; Home</h2>

              {/* HIRE MAID CARD */}
              <div className="p-3 bg-emerald-950/30 border border-emerald-600 rounded-xl space-y-2">
                <div className="font-extrabold text-emerald-300">👩🏾‍🍳 Certified Domestic House Maid</div>
                <p className="text-[11px] text-slate-300">
                  Takes care of your house and delivers food to you <strong>wherever you are in Lagos every 5 minutes</strong>, keeping Health, Energy &amp; Belly at 90%!
                </p>
                {!hasHiredMaid ? (
                  <button
                    onClick={() => {
                      if (spendMoney(150000)) {
                        setHasHiredMaid(true);
                        setMaidSatisfaction(100);
                        setMaidTimerSecs(300);
                        setLogMessage("👩🏾‍🍳 Hired a Certified House Maid! She will automatically maintain your Health, Energy & Belly every 5 minutes wherever you are!");
                      }
                    }}
                    className="w-full py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-lg"
                  >
                    Hire Certified House Maid (150,000 g₦)
                  </button>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span>Maid Satisfaction: <strong>{maidSatisfaction}%</strong></span>
                      <span className="text-amber-300">Next Auto-Care: {formatSecs(maidTimerSecs)}</span>
                    </div>
                    <button
                      onClick={() => {
                        if (spendMoney(25000)) {
                          setMaidSatisfaction(100);
                          setHealth(100);
                          setEnergy(maxEnergyCap);
                          setHunger(100);
                          setLogMessage("👩🏾‍🍳 Paid Maid Salary & Bonus! Maid Satisfaction 100% & immediate meal delivered!");
                        }
                      }}
                      className="w-full py-1.5 bg-amber-500 text-slate-950 font-extrabold rounded-lg"
                    >
                      Pay Maid Allowance &amp; Restock (25,000 g₦)
                    </button>
                  </div>
                )}
              </div>

              <button disabled={!isAtHome} onClick={() => { setEnergy(maxEnergyCap); setGameDay((d) => d + 1); setLogMessage("🛌 Slept overnight!"); }} className="w-full py-2 bg-indigo-600 text-white font-extrabold rounded-xl disabled:opacity-40">🛌 Sleep Overnight ({maxEnergyCap}% Cap)</button>
              <button onClick={() => { if (spendMoney(30000)) { setBedTier("Foam_Mattress"); setEnergy(85); }}} className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl flex justify-between"><span>🛏️ Foam Mattress (85% Cap)</span><span className="text-amber-400">30k</span></button>
              <button onClick={() => { if (spendMoney(95000)) { setBedTier("King_Bed"); setEnergy(100); }}} className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl flex justify-between"><span>👑 King Bed (100% Cap)</span><span className="text-amber-400">95k</span></button>
              <button onClick={() => { if (spendMoney(55000)) setChairTier("Cushion_Sofa"); }} className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl flex justify-between"><span>🛋️ Cushion Sofa</span><span className="text-amber-400">55k</span></button>
              <button onClick={() => { if (spendMoney(175000)) setTvTier("55-Inch Smart TV"); }} className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl flex justify-between"><span>📺 55&quot; Smart TV</span><span className="text-amber-400">175k</span></button>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 3: 💼 STANDALONE JOB BUILDINGS (4 SEPARATE SUB-BUILDINGS!)
           ===================================================================== */}
        {activeTab === "jobs" && (
          <div className="space-y-4 text-xs">
            {/* 4 SEPARATE JOB BUILDING SELECTOR */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: "street", icon: "🧱", name: "1. Street Labor Yard", desc: "6 Daily Manual Jobs" },
                { id: "specialist", icon: "👷🏾‍♂️", name: "2. Certified Specialist Guild", desc: "Surveyors, Architects & Chefs" },
                { id: "corporate", icon: "🏢", name: "3. Corporate Career Towers", desc: "8 Degree-Gated Companies" },
                { id: "social_gigs", icon: "📱", name: "4. Digital Social Gig Hub", desc: "5 Verified Online Tasks" },
              ].map((jb) => (
                <button
                  key={jb.id}
                  onClick={() => {
                    setJobBuildingTab(jb.id as any);
                    setIsAtHome(false);
                    setExactPosition(`🏢 Inside ${jb.name} (${area})`);
                  }}
                  className={`p-3 rounded-2xl border-2 text-left transition ${
                    jobBuildingTab === jb.id ? "bg-amber-500/20 border-amber-400" : "bg-slate-900 border-slate-800"
                  }`}
                >
                  <div className="text-2xl mb-1">{jb.icon}</div>
                  <div className="font-extrabold text-white">{jb.name}</div>
                  <div className="text-[10px] text-slate-400">{jb.desc}</div>
                </button>
              ))}
            </div>

            {/* STANDALONE BUILDING 1: STREET LABOR YARD */}
            {jobBuildingTab === "street" && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
                <h2 className="font-extrabold text-sm text-amber-400">🧱 Inside Street Labor Yard (Must Be in Job&apos;s Area • {hustlesDoneToday}/3 Shifts Today)</h2>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {[
                    { id: "st1", name: "📦 Oshodi Market Load Carrier", loc: "Oshodi" as AreaName, pay: 6500, cd: 60 },
                    { id: "st2", name: "🧹 Oshodi Motor Park Sweeper", loc: "Oshodi" as AreaName, pay: 5500, cd: 60 },
                    { id: "st3", name: "🧱 Berger Cement Bag Offloader", loc: "Berger" as AreaName, pay: 9500, cd: 75 },
                    { id: "st4", name: "🍽️ Yaba Bukka Kitchen & Dishwashing", loc: "Yaba" as AreaName, pay: 8000, cd: 60 },
                    { id: "st5", name: "🎉 Surulere Owambe Party Server", loc: "Surulere" as AreaName, pay: 10500, cd: 75 },
                    { id: "st6", name: "🏗️ Lekki Duplex Site Bricklayer", loc: "Lekki" as AreaName, pay: 15000, cd: 90 },
                  ].map((h) => (
                    <div key={h.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                      <div>
                        <div className="font-bold text-white">{h.name}</div>
                        <div className="text-[10px] text-emerald-400">📍 {h.loc} • +{h.pay.toLocaleString()} c₦ • {h.cd}s Timer</div>
                      </div>
                      <button
                        disabled={!!timers[h.id] || hustlesDoneToday >= 3}
                        onClick={() => {
                          if (area !== h.loc) return setLogMessage(`🚌 Travel to ${h.loc} first!`);
                          startCooldown(h.id, h.cd);
                          setHustlesDoneToday((d) => d + 1);
                          setIsAtHome(false);
                          setExactPosition(`Working ${h.name} in ${h.loc}`);
                          receiveEarnedMoney(h.pay, h.name);
                        }}
                        className="px-3 py-1.5 bg-amber-500 text-slate-950 font-extrabold rounded-lg disabled:opacity-40"
                      >
                        {timers[h.id] ? formatSecs(timers[h.id]) : "Work Shift"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STANDALONE BUILDING 2: CERTIFIED SPECIALIST GUILD */}
            {jobBuildingTab === "specialist" && (
              <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-4 space-y-2.5">
                <h2 className="font-extrabold text-sm text-emerald-400">👷🏾‍♂️ Inside Certified Specialist Guild (Requires Specialist Blueprints)</h2>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {[
                    { title: "Certified Rice & Jollof Head Chef", comp: "Lekki Mega Eatery", loc: "Lekki" as AreaName, req: "Cert_Rice", pay: 95000 },
                    { title: "Certified Soup & Swallow Specialist", comp: "Surulere Bukka PLC", loc: "Surulere" as AreaName, req: "Cert_Soup", pay: 90000 },
                    { title: "Certified Malt & Beverage Mixologist", comp: "Berger Drinks Depot", loc: "Berger" as AreaName, req: "Cert_Malt", pay: 85000 },
                    { title: "Licensed Land Surveyor", comp: "Yaba Survey & Lands", loc: "Yaba" as AreaName, req: "Cert_Surveyor", pay: 240000 },
                    { title: "Principal Structural Architect", comp: "Victoria Island Architects", loc: "Lekki" as AreaName, req: "Cert_Architect", pay: 420000 },
                  ].map((sp, i) => (
                    <div key={i} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                      <div>
                        <div className="font-bold text-white">{sp.title} — {sp.comp}</div>
                        <div className="text-[10px] text-amber-300">📍 {sp.loc} • Req: {sp.req} • +{sp.pay.toLocaleString()} c₦</div>
                      </div>
                      <button
                        onClick={() => {
                          if (!specialistCerts.includes(sp.req)) return setLogMessage(`❌ Requires ${sp.req} from the School Blueprint building!`);
                          if (area !== sp.loc) return setLogMessage(`🚌 Travel to ${sp.loc} first!`);
                          receiveEarnedMoney(sp.pay, sp.title);
                        }}
                        className="px-3 py-1.5 bg-emerald-500 text-slate-950 font-extrabold rounded-lg"
                      >
                        Work
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STANDALONE BUILDING 3: CORPORATE CAREER TOWERS (8 COMPANIES) */}
            {jobBuildingTab === "corporate" && (
              <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-4 space-y-2.5">
                <h2 className="font-extrabold text-sm text-cyan-400">🏢 Inside Corporate Career Towers (8 Distinct Employers)</h2>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {[
                    { title: "Microfinance Loan Clerk", comp: "Oshodi Trust Bank", loc: "Oshodi" as AreaName, deg: "Polytechnic ND", cert: null, pay: 65000 },
                    { title: "IT Helpdesk Analyst", comp: "Yaba CcHub Tech", loc: "Yaba" as AreaName, deg: "Polytechnic ND", cert: null, pay: 90000 },
                    { title: "Fleet Operations Supervisor", comp: "Julius Berger Yard", loc: "Berger" as AreaName, deg: "Polytechnic HND", cert: null, pay: 145000 },
                    { title: "Brand Media Strategist", comp: "Surulere AdWorks", loc: "Surulere" as AreaName, deg: "Polytechnic HND", cert: null, pay: 165000 },
                    { title: "Chartered Bank Auditor", comp: "ZenithMarina Lekki", loc: "Lekki" as AreaName, deg: "University B.Sc", cert: "ICAN", pay: 340000 },
                    { title: "Cloud Network Architect", comp: "Paystack Yaba HQ", loc: "Yaba" as AreaName, deg: "University B.Sc", cert: "CISCO", pay: 460000 },
                    { title: "Executive Project Director", comp: "Berger Infrastructure", loc: "Berger" as AreaName, deg: "Masters (M.Sc)", cert: "PMP", pay: 720000 },
                    { title: "VP Offshore Oil & Gas", comp: "Chevron VI Tower", loc: "Lekki" as AreaName, deg: "Doctorate (Ph.D)", cert: "HSE", pay: 1450000 },
                  ].map((c, i) => (
                    <div key={i} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                      <div>
                        <div className="font-bold text-white">{c.title} — {c.comp}</div>
                        <div className="text-[10px] text-cyan-400">📍 {c.loc} • Req: {c.deg} {c.cert && `+ ${c.cert}`} • +{c.pay.toLocaleString()} c₦</div>
                      </div>
                      <button
                        onClick={() => {
                          if (!completedDegrees.includes(c.deg)) return setLogMessage(`❌ Requires ${c.deg}!`);
                          if (c.cert && !professionalCerts.includes(c.cert)) return setLogMessage(`❌ Requires ${c.cert} Pro Cert!`);
                          if (area !== c.loc) return setLogMessage(`🚌 Travel to ${c.loc} first!`);
                          receiveEarnedMoney(c.pay, `${c.title} at ${c.comp}`);
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

            {/* STANDALONE BUILDING 4: DIGITAL SOCIAL GIG HUB */}
            {jobBuildingTab === "social_gigs" && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
                <h2 className="font-extrabold text-sm text-emerald-400">📱 Inside Digital Social Gig Hub (3m–5m Cooldowns)</h2>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {[
                    { id: "sg1", title: "Follow JPC Official on X", reward: 2500, cd: 180 },
                    { id: "sg2", title: "Follow Lagos Dev Board on LinkedIn", reward: 4000, cd: 240 },
                    { id: "sg3", title: "Comment on Partner Instagram Reel", reward: 3500, cd: 200 },
                    { id: "sg4", title: "Beta Test Partner Web App & Review", reward: 12000, cd: 300 },
                  ].map((g) => (
                    <div key={g.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                      <div className="flex justify-between font-bold"><span>{g.title}</span><span className="text-emerald-400">+{g.reward.toLocaleString()} c₦</span></div>
                      {timers[g.id] ? (
                        <div className="text-amber-400 font-bold text-center">⏳ Next Batch In: {formatSecs(timers[g.id])}</div>
                      ) : (
                        <div className="flex gap-1.5">
                          <input type="text" placeholder="@handle proof..." value={gigProofInputs[g.id] || ""} onChange={(e) => setGigProofInputs((p) => ({ ...p, [g.id]: e.target.value }))} className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white" />
                          <button onClick={() => { if (!gigProofInputs[g.id]) return; startCooldown(g.id, g.cd); receiveEarnedMoney(g.reward, g.title); }} className="px-3 py-1 bg-emerald-600 text-white font-bold rounded">Submit</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =====================================================================
            TAB 4: 🎓 SEPARATED EDUCATION BUILDINGS (4 DISTINCT CAMPUS BUILDINGS!)
           ===================================================================== */}
        {activeTab === "school" && (
          <div className="space-y-4 text-xs">
            {/* 4 STANDALONE EDUCATION BUILDINGS ON THE STREET */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: "poly", icon: "🏫", name: "1. Polytechnic Campus", desc: "ND & HND (10 Classes)" },
                { id: "uni", icon: "🎓", name: "2. University & Ph.D Senate", desc: "B.Sc, M.Sc & Doctorate" },
                { id: "blueprints", icon: "📘", name: "3. Business Blueprint Institute", desc: "Kiosk, Eatery & Firm BPs" },
                { id: "pro_certs", icon: "🏅", name: "4. Professional & Culinary Academy", desc: "ICAN, PMP, Surveyor & Chefs" },
              ].map((sb) => (
                <button
                  key={sb.id}
                  onClick={() => {
                    setSchoolBuildingTab(sb.id as any);
                    setIsAtHome(false);
                    setExactPosition(`🎓 Inside ${sb.name} (Yaba)`);
                  }}
                  className={`p-3 rounded-2xl border-2 text-left transition ${
                    schoolBuildingTab === sb.id ? "bg-indigo-600/30 border-indigo-400" : "bg-slate-900 border-slate-800"
                  }`}
                >
                  <div className="text-2xl mb-1">{sb.icon}</div>
                  <div className="font-extrabold text-white">{sb.name}</div>
                  <div className="text-[10px] text-slate-400">{sb.desc}</div>
                </button>
              ))}
            </div>

            {/* ACTIVE LECTURE BAR IF ENROLLED */}
            {enrolledProgram && (
              <div className="p-4 bg-indigo-950/60 border-2 border-indigo-400 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-extrabold text-sm text-white">📚 Active Program: {enrolledProgram.name}</div>
                  <div className="text-amber-300 font-bold">Progress: {enrolledProgram.completedClasses} / 10 Lectures Completed (-{enrolledProgram.energyPerLecture}% Energy/class)</div>
                </div>
                <button
                  disabled={!!timers.lec_cd}
                  onClick={() => {
                    if (energy < enrolledProgram.energyPerLecture) return setLogMessage(`⚠️ Need ${enrolledProgram.energyPerLecture}% Energy!`);
                    startCooldown("lec_cd", enrolledProgram.timerSeconds);
                    setEnergy((e) => Math.max(0, e - enrolledProgram.energyPerLecture));
                    const nextC = enrolledProgram.completedClasses + 1;
                    if (nextC >= 10) {
                      setCompletedDegrees((d) => [...d, enrolledProgram.name]);
                      setEnrolledProgram(null);
                      setLogMessage(`🎓 GRADUATED! Completed 10/10 lectures for ${enrolledProgram.name}!`);
                    } else {
                      setEnrolledProgram({ ...enrolledProgram, completedClasses: nextC });
                    }
                  }}
                  className="px-4 py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-xl"
                >
                  {timers.lec_cd ? `⏳ Lecture (${formatSecs(timers.lec_cd)})` : `Attend Lecture #${enrolledProgram.completedClasses + 1}/10`}
                </button>
              </div>
            )}

            {/* BUILDING 1: POLYTECHNIC CAMPUS */}
            {schoolBuildingTab === "poly" && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 grid sm:grid-cols-2 gap-3">
                {[
                  { id: "ND", name: "Polytechnic ND", cost: 220000, en: 40, sec: 60, req: null },
                  { id: "HND", name: "Polytechnic HND", cost: 350000, en: 50, sec: 75, req: "Polytechnic ND" },
                ].map((d) => (
                  <div key={d.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <div className="font-bold text-white text-sm">{d.name} (10 Lectures)</div>
                    <div className="text-amber-400 font-bold">{d.cost.toLocaleString()} g₦ • -{d.en}% Energy/class {d.req && `• Req: ${d.req}`}</div>
                    <button
                      disabled={completedDegrees.includes(d.name) || !!enrolledProgram}
                      onClick={() => {
                        if (d.req && !completedDegrees.includes(d.req)) return setLogMessage(`❌ Requires ${d.req} first!`);
                        if (spendMoney(d.cost)) setEnrolledProgram({ id: d.id, name: d.name, totalClasses: 10, completedClasses: 0, energyPerLecture: d.en, timerSeconds: d.sec });
                      }}
                      className="w-full py-2 bg-indigo-600 text-white font-bold rounded-lg disabled:opacity-40"
                    >
                      {completedDegrees.includes(d.name) ? "✓ Graduated" : "Enroll in Program"}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* BUILDING 2: UNIVERSITY & POSTGRADUATE SENATE (B.Sc -> M.Sc -> Ph.D) */}
            {schoolBuildingTab === "uni" && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 grid sm:grid-cols-3 gap-3">
                {[
                  { id: "BSC", name: "University B.Sc", cost: 680000, en: 65, sec: 90, req: null },
                  { id: "MSC", name: "Masters (M.Sc)", cost: 1400000, en: 80, sec: 100, req: "University B.Sc" },
                  { id: "PHD", name: "Doctorate (Ph.D)", cost: 2800000, en: 95, sec: 120, req: "Masters (M.Sc)" },
                ].map((d) => (
                  <div key={d.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <div className="font-bold text-white text-sm">{d.name} (10 Lectures)</div>
                    <div className="text-amber-400 font-bold">{d.cost.toLocaleString()} g₦ • -{d.en}% Energy</div>
                    <div className="text-[10px] text-slate-400">{d.req ? `Prerequisite: ${d.req}` : "Direct University Entry"}</div>
                    <button
                      disabled={completedDegrees.includes(d.name) || !!enrolledProgram}
                      onClick={() => {
                        if (d.req && !completedDegrees.includes(d.req)) return setLogMessage(`❌ Requires ${d.req} first!`);
                        if (spendMoney(d.cost)) setEnrolledProgram({ id: d.id, name: d.name, totalClasses: 10, completedClasses: 0, energyPerLecture: d.en, timerSeconds: d.sec });
                      }}
                      className="w-full py-2 bg-indigo-600 text-white font-bold rounded-lg disabled:opacity-40"
                    >
                      {completedDegrees.includes(d.name) ? "✓ Graduated" : "Enroll in Degree"}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* BUILDING 3: BUSINESS BLUEPRINT INSTITUTE */}
            {schoolBuildingTab === "blueprints" && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 grid sm:grid-cols-2 gap-3">
                {[
                  { id: "BP_Food_Kiosk", name: "🏪 Roadside Food Kiosk Blueprint (2 Staff / 15 Cust)", cost: 400000 },
                  { id: "BP_Small_Eatery", name: "🍲 Small Neighborhood Eatery Blueprint (6 Staff / 45 Cust)", cost: 900000 },
                  { id: "BP_Mega_Rest", name: "🏢 Mega Fast-Food Restaurant Blueprint (15 Staff / 120 Cust)", cost: 1800000 },
                  { id: "BP_Arch_Firm", name: "📐 Architectural & Surveying Firm Blueprint", cost: 1500000 },
                ].map((bp) => (
                  <div key={bp.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white">{bp.name}</div>
                      <div className="text-amber-400 font-bold">{bp.cost.toLocaleString()} g₦</div>
                    </div>
                    <button
                      disabled={ownedBlueprints.includes(bp.id)}
                      onClick={() => { if (spendMoney(bp.cost)) setOwnedBlueprints((p) => [...p, bp.id]); }}
                      className="px-3 py-1.5 bg-emerald-500 text-slate-950 font-extrabold rounded-lg disabled:opacity-40"
                    >
                      {ownedBlueprints.includes(bp.id) ? "✓ Owned" : "Buy BP"}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* BUILDING 4: PROFESSIONAL & SPECIALIST ACADEMY (RICE, SOUP, MALT, SURVEYOR, ARCHITECT, ICAN, PMP) */}
            {schoolBuildingTab === "pro_certs" && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="font-bold text-emerald-400 uppercase">Culinary &amp; Construction Specialist Certs</div>
                  {[
                    { id: "Cert_Rice", name: "🍚 Master Rice & Jollof Certificate", req: null, cost: 180000 },
                    { id: "Cert_Soup", name: "🍲 Traditional Soup & Swallow Certificate", req: null, cost: 180000 },
                    { id: "Cert_Malt", name: "🍺 Malt & Beverage Brewing Certificate", req: null, cost: 150000 },
                    { id: "Cert_Surveyor", name: "🧭 Licensed Land Surveyor Blueprint", req: "Polytechnic ND", cost: 450000 },
                    { id: "Cert_Architect", name: "📐 Certified Structural Architect Blueprint", req: "University B.Sc", cost: 750000 },
                  ].map((sc) => (
                    <button
                      key={sc.id}
                      disabled={specialistCerts.includes(sc.id)}
                      onClick={() => {
                        if (sc.req && !completedDegrees.includes(sc.req)) return setLogMessage(`❌ Requires ${sc.req} first!`);
                        if (spendMoney(sc.cost)) setSpecialistCerts((s) => [...s, sc.id]);
                      }}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between font-bold disabled:opacity-40"
                    >
                      <span>{specialistCerts.includes(sc.id) ? `✓ ${sc.name}` : sc.name}</span>
                      <span className="text-emerald-400">{(sc.cost / 1000).toFixed(0)}k</span>
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="font-bold text-cyan-400 uppercase">Executive Professional Courses</div>
                  {[
                    { id: "ICAN", name: "📊 ICAN Chartered Accountant (Req: B.Sc)", req: "University B.Sc", cost: 350000 },
                    { id: "CISCO", name: "🌐 CISCO Network Architect (Req: ND)", req: "Polytechnic ND", cost: 450000 },
                    { id: "PMP", name: "📋 PMP Project Director (Req: M.Sc)", req: "Masters (M.Sc)", cost: 520000 },
                    { id: "HSE", name: "🦺 Offshore HSE Level 3 (Req: Ph.D)", req: "Doctorate (Ph.D)", cost: 680000 },
                  ].map((pc) => (
                    <button
                      key={pc.id}
                      disabled={professionalCerts.includes(pc.id)}
                      onClick={() => {
                        if (!completedDegrees.includes(pc.req)) return setLogMessage(`❌ Requires ${pc.req} first!`);
                        if (spendMoney(pc.cost)) setProfessionalCerts((p) => [...p, pc.id]);
                      }}
                      className="w-full p-2.5 bg-slate-950 border border-cyan-800 rounded-xl flex justify-between font-bold disabled:opacity-40"
                    >
                      <span>{professionalCerts.includes(pc.id) ? `✓ ${pc.name}` : pc.name}</span>
                      <span className="text-cyan-400">{(pc.cost / 1000).toFixed(0)}k</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =====================================================================
            TAB 5: 🏪 EATERY & ARCHITECTURAL OPERATIONS + AUTOMATED CUSTOMER COMMENTS
           ===================================================================== */}
        {activeTab === "empire" && (
          <div className="space-y-4 text-xs">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
                <h2 className="font-bold text-sm text-amber-400">🏗️ Construct Eatery, Kiosk, or Architectural Firm</h2>
                {[
                  { name: "Roadside Food Kiosk", type: "Food" as const, bp: "BP_Food_Kiosk", cost: 350000, maxStaff: 3, maxCust: 15, rev: 55000 },
                  { name: "Small Neighborhood Eatery", type: "Food" as const, bp: "BP_Small_Eatery", cost: 850000, maxStaff: 6, maxCust: 45, rev: 150000 },
                  { name: "Mega Fast-Food Restaurant", type: "Food" as const, bp: "BP_Mega_Rest", cost: 2200000, maxStaff: 15, maxCust: 120, rev: 450000 },
                  { name: "Architectural & Survey Firm", type: "Arch_Firm" as const, bp: "BP_Arch_Firm", cost: 1800000, maxStaff: 8, maxCust: 30, rev: 380000 },
                ].map((b, i) => (
                  <div key={i} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white">{b.name} (📍 {area})</div>
                      <div className="text-[10px] text-slate-400">Cap: {b.maxCust} Cust • {b.cost.toLocaleString()} g₦</div>
                    </div>
                    <button
                      onClick={() => {
                        if (!ownedBlueprints.includes(b.bp)) return setLogMessage(`❌ Buy ${b.bp} in School -> Blueprints first!`);
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
                              foodStockRemaining: 2,
                              collectionsUsedThisCycle: 0,
                              hasRiceSpecialist: false,
                              hasSoupSpecialist: false,
                              hasMaltSpecialist: false,
                              hasCertifiedSurveyor: false,
                              hasCertifiedArchitect: false,
                            },
                          ]);
                          setLogMessage(`🏪 Opened ${b.name}! Recruit Certified Specialists on the right.`);
                        }
                      }}
                      className="px-3 py-1.5 bg-amber-500 text-slate-950 font-extrabold rounded-lg"
                    >
                      Launch
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-2xl p-4 space-y-3">
                <h2 className="font-bold text-sm text-emerald-400">👩‍🍳📐 Recruit Certified Specialists &amp; Collect</h2>
                {activeBusinesses.map((biz, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex justify-between font-bold">
                      <span>{biz.name} ({biz.area})</span>
                      <span className="text-emerald-400">Stock: {biz.foodStockRemaining} • Collect: {biz.collectionsUsedThisCycle}/2</span>
                    </div>
                    {biz.type === "Food" ? (
                      <div className="grid grid-cols-3 gap-1">
                        <button disabled={biz.hasRiceSpecialist} onClick={() => { if (spendMoney(60000)) { const up = [...activeBusinesses]; up[idx].hasRiceSpecialist = true; setActiveBusinesses(up); }}} className="p-1.5 bg-slate-900 border border-amber-600 rounded text-[10px] font-bold">{biz.hasRiceSpecialist ? "✓ Rice Chef" : "+ Rice Cert (60k)"}</button>
                        <button disabled={biz.hasSoupSpecialist} onClick={() => { if (spendMoney(60000)) { const up = [...activeBusinesses]; up[idx].hasSoupSpecialist = true; setActiveBusinesses(up); }}} className="p-1.5 bg-slate-900 border border-orange-600 rounded text-[10px] font-bold">{biz.hasSoupSpecialist ? "✓ Soup Chef" : "+ Soup Cert (60k)"}</button>
                        <button disabled={biz.hasMaltSpecialist} onClick={() => { if (spendMoney(50000)) { const up = [...activeBusinesses]; up[idx].hasMaltSpecialist = true; setActiveBusinesses(up); }}} className="p-1.5 bg-slate-900 border border-cyan-600 rounded text-[10px] font-bold">{biz.hasMaltSpecialist ? "✓ Malt Cert" : "+ Malt Cert (50k)"}</button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <button disabled={biz.hasCertifiedSurveyor} onClick={() => { if (spendMoney(120000)) { const up = [...activeBusinesses]; up[idx].hasCertifiedSurveyor = true; setActiveBusinesses(up); }}} className="p-1.5 bg-slate-900 border border-cyan-600 rounded text-[10px] font-bold">{biz.hasCertifiedSurveyor ? "✓ Surveyor" : "+ Surveyor (120k)"}</button>
                        <button disabled={biz.hasCertifiedArchitect} onClick={() => { if (spendMoney(180000)) { const up = [...activeBusinesses]; up[idx].hasCertifiedArchitect = true; setActiveBusinesses(up); }}} className="p-1.5 bg-slate-900 border border-indigo-600 rounded text-[10px] font-bold">{biz.hasCertifiedArchitect ? "✓ Architect" : "+ Architect (180k)"}</button>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => { if (spendMoney(40000)) { const up = [...activeBusinesses]; up[idx].foodStockRemaining += 2; up[idx].collectionsUsedThisCycle = 0; setActiveBusinesses(up); }}} className="py-1.5 bg-amber-500 text-slate-950 font-extrabold rounded">🍲 Stock Supplies (40k)</button>
                      <button
                        disabled={biz.foodStockRemaining <= 0 || biz.collectionsUsedThisCycle >= 2}
                        onClick={() => {
                          if (biz.type === "Arch_Firm" && (!biz.hasCertifiedSurveyor || !biz.hasCertifiedArchitect)) {
                            return setLogMessage("❌ Recruit BOTH a Surveyor and Architect first!");
                          }
                          const certCount = (biz.hasRiceSpecialist ? 1 : 0) + (biz.hasSoupSpecialist ? 1 : 0) + (biz.hasMaltSpecialist ? 1 : 0);
                          const payout = Math.round(biz.revenuePerHalfDay * (biz.type === "Food" ? 0.6 + certCount * 0.35 : 1.5));
                          const up = [...activeBusinesses];
                          up[idx].foodStockRemaining -= 1;
                          up[idx].collectionsUsedThisCycle += 1;
                          setActiveBusinesses(up);
                          receiveEarnedMoney(payout, biz.name);
                        }}
                        className="py-1.5 bg-emerald-500 text-slate-950 font-extrabold rounded disabled:opacity-40"
                      >
                        💰 Collect ({biz.collectionsUsedThisCycle}/2)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 6: 🗳️ POLITICS (MUST PHYSICALLY STAND INSIDE SECRETARIAT FOR 3 DAYS!)
           ===================================================================== */}
        {activeTab === "politics" && (
          <div className="grid sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-900 border-2 border-emerald-600/50 rounded-2xl p-4 space-y-3">
              <h2 className="font-extrabold text-sm text-emerald-400">🏛️ 1. Party Secretariat Building</h2>
              <p className="text-slate-400">
                You must click <strong>&quot;Enter Party Secretariat&quot;</strong> and be physically present here when the day rolls over for <strong>3 Days</strong> (`{partyDaysAttended}/3 Days Attended`) to qualify for Nomination!
              </p>
              <button
                onClick={() => {
                  setIsAtHome(false);
                  setExactPosition(`🏛️ Inside ${area} Party Secretariat Building`);
                  setLogMessage(`🏛️ Entered ${area} Party Secretariat! Stay here across day rollovers to count your 3 required attendance days.`);
                }}
                className="w-full py-2 bg-slate-800 border border-emerald-500 text-emerald-300 font-bold rounded-xl"
              >
                🚪 Enter Party Secretariat Building
              </button>
              {partyStatus === "None" && (
                <button onClick={() => { if (spendMoney(30000)) setPartyStatus("Member_JPC"); }} className="w-full py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-xl">
                  Pay JPC Membership Fee (30,000 g₦)
                </button>
              )}
              <button
                onClick={() => {
                  if (!exactPosition.includes("Party Secretariat")) return setLogMessage("❌ Click 'Enter Party Secretariat Building' above first!");
                  setPartyDaysAttended((d) => Math.min(3, d + 1));
                  setLogMessage(`🏛️ Attended Party Ward Session! Attendance: ${Math.min(3, partyDaysAttended + 1)}/3 Days.`);
                }}
                className="w-full py-2 bg-indigo-600 text-white font-bold rounded-xl"
              >
                ✍️ Sign Daily Party Attendance Register ({partyDaysAttended}/3 Days)
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-amber-400">🗳️ 2. Electoral Commission HQ</h2>
              <div>Secretariat Attendance: <strong>{partyDaysAttended} / 3 Days</strong></div>
              <button
                onClick={() => {
                  if (partyStatus === "None" || partyDaysAttended < 3) return setLogMessage("❌ Must be a Party Member AND complete 3/3 Days inside the Party Secretariat first!");
                  if (spendMoney(450000)) setNominationStatus("Submitted_Verified");
                }}
                className="w-full py-2 bg-amber-500 text-slate-950 font-extrabold rounded-xl"
              >
                {nominationStatus === "Submitted_Verified" ? "✓ Cleared Candidate" : "Buy Nomination Form (450,000 g₦)"}
              </button>
              <button disabled={hasVoted} onClick={() => { setHasVoted(true); receiveEarnedMoney(5000, "Voter Allowance"); }} className="w-full py-2 bg-emerald-600 text-white font-bold rounded-xl">Cast Ballot (+5,000 c₦)</button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
              <h2 className="font-bold text-sm text-indigo-400">🎨 3. Multi-Agency Poster Showcase</h2>
              {["SkyHigh Creative Agency (65k)", "Yaba Pixel Studios (50k)", "Lekki Prestige Media (95k)"].map((ag) => (
                <button key={ag} onClick={() => { if (spendMoney(65000)) { setHiredAgenciesForPoster((p) => [...p, ag]); setCityBillboardText(`🗳️ VOTE ${username.toUpperCase()} — Poster by ${ag}`); }}} className="w-full p-2 bg-slate-950 border border-indigo-700 rounded-lg font-bold">Hire {ag}</button>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 7: 🏆 PROFILE DOSSIER (WITH PROGRESS BARS) & 100,000,000 c₦ = ₦5,000 CASHOUT!
           ===================================================================== */}
        {activeTab === "profile" && (
          <div className="grid md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-amber-400">🏆 {username}&apos;s Citizen Dossier &amp; Progress Bars</h2>
              <div className="p-3 bg-gradient-to-br from-emerald-950 to-slate-950 border border-emerald-600 rounded-xl space-y-1">
                <div className="text-[10px] text-emerald-300 uppercase">Total Net Worth</div>
                <div className="text-lg font-extrabold text-white">{totalNetWorth.toLocaleString()} c₦</div>
                <div className="text-xs font-bold text-amber-400">{richLevelTitle}</div>
              </div>

              {/* PROGRESS BARS FOR EDUCATION & CASHOUT */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span>🎓 Academic &amp; Cert Progress</span>
                    <span className="font-bold text-emerald-400">{academicProgressPct}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${academicProgressPct}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span>💸 100M c₦ Cashout Target</span>
                    <span className="font-bold text-amber-400">{Math.min(100, Math.round((earnedBalance / 100000000) * 100))}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: `${Math.min(100, (earnedBalance / 100000000) * 100)}%` }} />
                  </div>
                </div>

                <div className="pt-1 space-y-1 text-[11px]">
                  <div>📍 <strong>Exact Position:</strong> {exactPosition}</div>
                  <div>🎓 <strong>Degrees:</strong> {completedDegrees.join(" -> ") || "Building Progress..."}</div>
                  <div>🍲📐 <strong>Specialist Certs:</strong> {specialistCerts.join(", ") || "None"}</div>
                  <div>🏅 <strong>Pro Courses:</strong> {professionalCerts.join(", ") || "None"}</div>
                  <div>👩🏾‍🍳 <strong>House Maid:</strong> {hasHiredMaid ? `Active (${maidSatisfaction}%)` : "None"}</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-cyan-400">💸 P2P Citizen Transfer</h2>
              <input type="text" placeholder="Recipient @username..." value={transferRecipient} onChange={(e) => setTransferRecipient(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
              <input type="number" placeholder="Amount..." value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
              <button onClick={() => { const amt = Number(transferAmount); if (transferRecipient && amt > 0 && spendMoney(amt)) { setLogMessage(`💸 Sent ${amt.toLocaleString()} to ${transferRecipient}!`); setTransferAmount(""); }}} className="w-full py-2.5 bg-cyan-500 text-slate-950 font-extrabold rounded-xl">Send Transfer</button>
            </div>

            {/* 100,000,000 c₦ = ₦5,000 CENTRAL BANK CASHOUT */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <h2 className="font-bold text-sm text-emerald-400">🏦 Central Bank (100M c₦ = ₦5,000 Cashout)</h2>
              <div className="p-2.5 bg-slate-950 border border-emerald-800/60 rounded-xl">
                <div className="text-[10px] text-slate-400">300M Genesis Reserve Remaining:</div>
                <div className="font-extrabold text-sm text-amber-400">{centralBankReserve.toLocaleString()} g₦</div>
              </div>
              {[
                { naira: 500, gCash: 50000 },
                { naira: 1000, gCash: 100000 },
                { naira: 5000, gCash: 500000 },
                { naira: 10000, gCash: 1000000 },
              ].map((t, i) => (
                <button key={i} onClick={() => { setCentralBankReserve((r) => r - t.gCash); setStarterBalance((s) => s + t.gCash); }} className="w-full p-2 bg-slate-950 border border-amber-500/50 rounded-xl flex justify-between font-bold">
                  <span>Buy {t.gCash.toLocaleString()} g₦</span><span className="text-amber-400">₦{t.naira.toLocaleString()}</span>
                </button>
              ))}
              <button
                onClick={() => {
                  if (earnedBalance < 100000000) {
                    return setLogMessage(`🔒 Minimum cashout is 100,000,000 c₦ (= ₦5,000 real cash)! Current Earned Balance: ${earnedBalance.toLocaleString()} c₦.`);
                  }
                  const nairaPayout = Math.floor((earnedBalance / 100000000) * 5000);
                  setCentralBankReserve((r) => r + earnedBalance);
                  setEarnedBalance(0);
                  setLogMessage(`🏦 CASHOUT APPROVED! ₦${nairaPayout.toLocaleString()} sent to your Nigerian Bank Account!`);
                }}
                className="w-full py-2.5 bg-emerald-600 text-white font-extrabold rounded-xl"
              >
                💸 Withdraw Earned c₦ (100M c₦ = ₦5,000)
              </button>
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
        <div className="max-w-4xl mx-auto grid grid-cols-7 gap-1">
          {[

            { id: "map", label: "Town Map", icon: <Map className="w-4 h-4" /> },
            { id: "home", label: "Home/Maid", icon: <Home className="w-4 h-4" /> },
            { id: "jobs", label: "4 Job Hubs", icon: <Briefcase className="w-4 h-4" /> },
            { id: "school", label: "4 Schools", icon: <GraduationCap className="w-4 h-4" /> },
            { id: "empire", label: "Eatery/Arch", icon: <Building2 className="w-4 h-4" /> },
            { id: "politics", label: "Politics", icon: <Vote className="w-4 h-4" /> },
            { id: "profile", label: "100M Bank", icon: <Award className="w-4 h-4" /> },
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

function StatBar({ icon, label, value, pct, color, onHelp }: any) {
  return (
    <div className="bg-slate-950 rounded-xl p-2 border border-slate-800/80">
      <div className="flex items-center justify-between text-[11px] mb-1">
        <span className="flex items-center gap-1 text-slate-300 truncate">{icon} {label}</span>
        <div className="flex items-center gap-1">
          <span className="font-bold">{value}</span>
          {onHelp && (
            <button
              onClick={onHelp}
              className="w-4 h-4 rounded-full bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-400 text-[10px] font-extrabold flex items-center justify-center"
              title="Click to see what this indicator means and how to boost it"
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