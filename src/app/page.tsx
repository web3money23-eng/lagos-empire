"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Heart, Zap, Utensils, Sparkles, Tv, Home, Map,
  BedDouble, Armchair, Briefcase, GraduationCap, MapPin, 
  Play, Lock, Building2, Car, Vote, Landmark, Clock, 
  Flame, CloudRain, Sun, Moon, Award, MessageCircle, ShoppingBag
} from "lucide-react";

type AreaName = "Oshodi" | "Berger" | "Yaba" | "Surulere" | "Lekki";

// DISTANCE MATRIX FOR REALISTIC BUS & CAB FARES BETWEEN AREAS
const AREA_COORDS: Record<AreaName, number> = {
  Berger: 1,
  Oshodi: 2,
  Yaba: 3,
  Surulere: 4,
  Lekki: 6,
};

export default function LagosEmpireMasterGame() {
  // 1. ONBOARDING
  const [isCreated, setIsCreated] = useState(false);
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");

  // 2. 15-MINUTE LIVE CLOCK, WEATHER & STAT DECAY ENGINE
  const [gameHour, setGameHour] = useState(8);
  const [gameMinute, setGameMinute] = useState(0); // 0, 15, 30, 45
  const [gameDay, setGameDay] = useState(1);
  const [gameWeek, setGameWeek] = useState(1);
  const [weather, setWeather] = useState<"Sunny 32°C" | "Harmattan Haze" | "Heavy Lagos Rain" | "Warm Night">("Sunny 32°C");

  // 3. CENTRAL BANK 300M RESERVE, LOANS & DUAL WALLETS
  const [centralBankReserve, setCentralBankReserve] = useState(300000000);
  const [starterBalance, setStarterBalance] = useState(50000); // Non-withdrawable
  const [earnedBalance, setEarnedBalance] = useState(0);       // Withdrawable (Min 5M)
  const [bankLoanDebt, setBankLoanDebt] = useState(0);

  // 4. LOCATION & CORE SURVIVAL STATS (DECAY OVER TIME!)
  const [area, setArea] = useState<AreaName>("Oshodi");
  const [health, setHealth] = useState(90);
  const [energy, setEnergy] = useState(65);
  const [hunger, setHunger] = useState(80);
  const [weight, setWeight] = useState(68.0);
  const [steeze, setSteeze] = useState(5);
  const [citizenPoints, setCitizenPoints] = useState(15);

  // 5. MULTI-TIMER ENGINE (60s - 120s Minimum Countdowns)
  const [timers, setTimers] = useState<Record<string, number>>({});
  const startCooldown = (key: string, seconds: number) => {
    setTimers((prev) => ({ ...prev, [key]: seconds }));
  };

  // MASTER TICKER: Updates Cooldowns (1s) + 15-Minute Clock & Stat Decay
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Tick all active countdown timers
      setTimers((prev) => {
        const next: Record<string, number> = {};
        for (const k in prev) {
          if (prev[k] > 1) next[k] = prev[k] - 1;
        }
        return next;
      });

      // 2. Advance 15-Minute Game Clock & Decay Belly/Energy/Health
      setGameMinute((m) => {
        if (m < 45) return m + 15;
        // Hour rollover
        setGameHour((h) => {
          const nextH = h >= 23 ? 0 : h + 1;
          // Update Weather based on time of day
          if (nextH >= 20 || nextH <= 5) setWeather("Warm Night");
          else if (nextH === 14 || nextH === 15) setWeather("Heavy Lagos Rain");
          else if (nextH >= 6 && nextH <= 10) setWeather("Harmattan Haze");
          else setWeather("Sunny 32°C");

          if (h >= 23) {
            setGameDay((d) => {
              const nd = d + 1;
              if (nd % 7 === 0) setGameWeek((w) => w + 1);
              return nd;
            });
            setHustlesDoneToday(0);
            setWorkedOfficeToday(false);
          }
          return nextH;
        });

        // AUTOMATIC STAT DECAY EVERY HOUR
        setHunger((prevH) => {
          const nextHunger = Math.max(0, prevH - 4);
          if (nextHunger === 0) {
            setHealth((hp) => Math.max(10, hp - 5)); // Starving damages health!
          }
          return nextHunger;
        });
        setEnergy((prevE) => {
          const nextEnergy = Math.max(0, prevE - 3);
          if (nextEnergy === 0) {
            setHealth((hp) => Math.max(10, hp - 4)); // Exhaustion damages health!
          }
          return nextEnergy;
        });

        return 0;
      });
    }, 2000); // Every 2 real seconds = 15 in-game minutes
    return () => clearInterval(interval);
  }, []);

  const formatSecs = (s?: number) => {
    if (!s || s <= 0) return "0s";
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
  };

  // 6. HOME, COOKING STOVE/GAS & SHOPPING ILLUSTRATION STATES
  const [shelterType, setShelterType] = useState("Unpainted Single Room");
  const [shelterArea, setShelterArea] = useState<AreaName>("Oshodi");
  const [parkingSlots, setParkingSlots] = useState(0);
  const [wallColor, setWallColor] = useState("Unplastered");
  const [bedTier, setBedTier] = useState("Bare_Floor");
  const [chairTier, setChairTier] = useState("None");
  const [tvTier, setTvTier] = useState("None");
  const [hasLagosFlix, setHasLagosFlix] = useState(false);
  const [showTvModal, setShowTvModal] = useState(false);

  // Cooking Equipment
  const [hasCookingStove, setHasCookingStove] = useState(false);
  const [gasLevel, setGasLevel] = useState(0); // % of cooking gas remaining
  const [rawFoodServings, setRawFoodServings] = useState(0);

  // 7. OUTDOOR CITY MAP & CLICKABLE BUILDING MODAL
  const [enteredBuilding, setEnteredBuilding] = useState<
    "None" | "Furniture_Shop" | "Electronics_Shop" | "Gas_Kitchen_Shop" | "Eatery" | "Church_Social" | "Office_Building"
  >("None");

  // 8. EDUCATION, SCHOLARSHIPS, VISA & EXPENSIVE BLUEPRINTS
  const [education, setEducation] = useState("Uneducated");
  const [certificatesList, setCertificatesList] = useState<string[]>([]);
  const [enrolledProgram, setEnrolledProgram] = useState<{
    name: string;
    totalClasses: number;
    completedClasses: number;
  } | null>(null);
  const [hasScholarship, setHasScholarship] = useState(false);
  const [abroadStatus, setAbroadStatus] = useState<"None" | "Visa_Granted" | "Admission_Pending" | "Admitted_30m_Window">("None");
  const [ownedBlueprints, setOwnedBlueprints] = useState<string[]>([]);
  const [cvScore, setCvScore] = useState(0);
  const [outfit, setOutfit] = useState("Singlet & Slippers");
  const [hasCorporateSuit, setHasCorporateSuit] = useState(false);

  // 9. EXPANDED STREET HUSTLES, CORPORATE JOBS & SOCIAL GIGS
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

  // 10. CAC, LAND C-OF-O, COMMERCIAL BUILDINGS & 10 CARS
  const [companyName, setCompanyName] = useState("");
  const [cacStatus, setCacStatus] = useState<"None" | "Processing" | "Approved">("None");
  const [cofoStatus, setCofoStatus] = useState<"None" | "Processing" | "Approved">("None");
  const [ownedBuildings, setOwnedBuildings] = useState<string[]>([]);
  const [carsOwned, setCarsOwned] = useState<string[]>([]);

  // 11. POLITICS & CITY BILLBOARD SLOTS
  const [partyStatus, setPartyStatus] = useState<"None" | "Pending_Approval" | "Member_JPC" | "Member_JSTD">("None");
  const [nominationStatus, setNominationStatus] = useState<"None" | "Form_Purchased" | "Submitted_Verified">("None");
  const [cityBillboardText, setCityBillboardText] = useState("RENT THIS CITY BILLBOARD — Hire a Design Agency in Politics Tab!");
  const [hasVoted, setHasVoted] = useState(false);

  // 12. ORGANIC COURTSHIP (MEET IN BUILDINGS -> CHAT -> 10 DATES AT +10% BOND EACH)
  const [maritalStatus, setMaritalStatus] = useState<"Single" | "Courting" | "Married">("Single");
  const [partnerName, setPartnerName] = useState("None");
  const [relationshipBond, setRelationshipBond] = useState(0); // Starts at 10%, +10% per date (10 dates = 100%)
  const [chatHistory, setChatHistory] = useState<string[]>([]);

  // NAVIGATION TABS
  const [activeTab, setActiveTab] = useState<"home" | "city" | "jobs" | "school" | "empire" | "politics" | "profile">("home");
  const [logMessage, setLogMessage] = useState(
    "Welcome to Lagos! Your 15-minute clock is running. Watch your Belly & Energy decay, step outside to the City Map, and build your life!"
  );

  // SPEND MONEY HELPER
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

  // CALCULATE DISTANCE-BASED FARE BETWEEN CURRENT AREA & DESTINATION
  const getTransportCosts = (dest: AreaName) => {
    const dist = Math.abs(AREA_COORDS[area] - AREA_COORDS[dest]) || 1;
    const rainMultiplier = weather === "Heavy Lagos Rain" ? 1.5 : 1;
    return {
      busCost: Math.round(1200 * dist * rainMultiplier),
      cabCost: Math.round(3000 * dist * rainMultiplier),
      trekEnergy: Math.min(45, 12 * dist),
      trekHealthLoss: Math.min(8, 2 * dist),
      timeSec: 15 * dist,
    };
  };

  if (!isCreated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
          <div className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full mb-3">
            LAGOS EMPIRE — INDOOR & OUTDOOR SIMULATOR
          </div>
          <h1 className="text-2xl font-extrabold mb-2">Start Your Lagos Journey</h1>
          <p className="text-slate-400 text-sm mb-6">
            Start in an unpainted single room in Oshodi with 50,000 g₦. Cook at home or visit eateries, commute across 5 distinct areas, attend lectures, and track every achievement on your profile.
          </p>

          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Citizen Name</label>
          <input
            type="text"
            placeholder="e.g., Ayodeji or Chisom"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white mb-5 focus:outline-none focus:border-emerald-500 text-sm"
          />

          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Gender</label>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {(["male", "female"] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`py-3 rounded-xl font-bold capitalize border transition text-sm ${
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
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl transition text-sm"
          >
            Enter My Home in Oshodi (Claim 50,000 g₦)
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-28">
      {/* TOP HEADER: 15-MIN CLOCK, WEATHER, LOCATION & DUAL WALLETS */}
      <header className="bg-slate-900/95 backdrop-blur border-b border-slate-800 sticky top-0 z-30 px-4 py-2.5">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-xl">
              {gender === "male" ? "👨🏾" : "👩🏾"}
            </div>
            <div>
              <div className="font-bold text-sm flex flex-wrap items-center gap-1.5">
                {username}
                {/* 15-MINUTE RUNNING CLOCK */}
                <span className="text-[11px] px-2 py-0.5 bg-amber-500 text-slate-950 font-extrabold rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Wk {gameWeek} • Day {gameDay} • {String(gameHour).padStart(2, "0")}:{String(gameMinute).padStart(2, "0")}
                </span>
                {/* LIVE WEATHER */}
                <span className="text-[11px] px-2 py-0.5 bg-slate-800 text-cyan-300 rounded-full flex items-center gap-1">
                  {weather.includes("Rain") ? <CloudRain className="w-3 h-3" /> : <Sun className="w-3 h-3" />} {weather}
                </span>
              </div>
              <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2 mt-0.5">
                <span className="text-emerald-400 font-bold">📍 Currently in: {area}</span>
                • 🏠 Home: {shelterType} ({shelterArea}) • 💍 {maritalStatus}
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
                Earned Wallet <Lock className="w-2.5 h-2.5" />
              </div>
              <div className="font-extrabold text-sm text-emerald-400">{earnedBalance.toLocaleString()} g₦</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-4">
        {/* LIVE STATS BAR WITH DECAY WARNING */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-900 border border-slate-800 rounded-2xl p-3">
          <StatBar icon={<Heart className="w-4 h-4 text-rose-400" />} label="Health (Auto-Decay)" value={`${health}%`} pct={health} color="bg-rose-500" />
          <StatBar icon={<Zap className="w-4 h-4 text-amber-400" />} label="Energy (-3%/hr)" value={`${energy}%`} pct={energy} color="bg-amber-500" />
          <StatBar icon={<Utensils className="w-4 h-4 text-orange-400" />} label="Belly (-4%/hr)" value={`${hunger}%`} pct={hunger} color="bg-orange-500" />
          <StatBar icon={<Sparkles className="w-4 h-4 text-cyan-400" />} label="Steeze/Respect" value={`${steeze} pts`} pct={Math.min(100, steeze)} color="bg-cyan-500" />
          <div className="bg-slate-950 rounded-xl p-2 flex flex-col justify-center">
            <span className="text-[10px] text-slate-400 uppercase">Weight • CV • Gas</span>
            <span className="text-xs font-bold text-white">{weight}kg • CV:{cvScore}% • 🔥Gas:{gasLevel}%</span>
          </div>
        </div>

        {/* CITY BILLBOARD BANNER (VISIBLE ACROSS LAGOS!) */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-amber-950/60 border border-amber-500/40 rounded-xl px-4 py-2 flex items-center justify-between text-xs">
          <span className="font-extrabold text-amber-300">📢 {area.toUpperCase()} CITY BILLBOARD:</span>
          <span className="text-white font-semibold truncate ml-2">{cityBillboardText}</span>
        </div>

        {/* EVENT LOG */}
        <div className="bg-emerald-950/40 border border-emerald-800/60 text-emerald-200 px-4 py-2.5 rounded-xl text-sm font-medium">
          🔔 {logMessage}
        </div>

        {/* =====================================================================
            TAB 1: 🏠 MY HOME (INDOOR VIEW + HOME COOKING VS EATERY)
           ===================================================================== */}
        {activeTab === "home" && (
          <div className="grid md:grid-cols-3 gap-4">
            <div className={`md:col-span-2 rounded-2xl border-2 p-6 relative min-h-[380px] flex flex-col justify-between transition-all ${wallBgMap[wallColor]}`}>
              {area !== shelterArea ? (
                <div className="my-auto text-center bg-black/75 p-6 rounded-2xl border border-rose-500/50 space-y-3">
                  <div className="text-3xl">🚌</div>
                  <h3 className="font-extrabold text-lg text-rose-400">You Are Currently Away in {area}!</h3>
                  <p className="text-xs text-slate-300">
                    Your home ({shelterType}) is located in <strong>{shelterArea}</strong>. You must take a Bus, Cab, or Trek back to {shelterArea} in the <strong>Outdoor City Map</strong> tab before you can enter your room or sleep!
                  </p>
                  <button
                    onClick={() => setActiveTab("city")}
                    className="px-4 py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-xl text-xs"
                  >
                    Go to Outdoor City Map to Commute Home
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start gap-2">
                    <div className="space-y-1">
                      <span className="bg-black/60 px-3 py-1 rounded-lg text-xs font-bold text-emerald-300 block">
                        🏠 Inside My Home: {shelterType} ({shelterArea})
                      </span>
                      <span className="bg-black/60 px-3 py-1 rounded-lg text-xs text-amber-300 block">
                        🧱 Wall: {wallColor} • 👔 Wearing: {outfit}
                      </span>
                    </div>

                    {/* ILLUSTRATED TV CORNER */}
                    <div className="bg-slate-950/90 border border-slate-700 rounded-xl p-3 text-center min-w-[130px]">
                      <div className="text-2xl mb-1">{tvTier === "None" ? "📦" : "📺"}</div>
                      <div className="text-[11px] font-bold">{tvTier === "None" ? "No TV (Visit Shop)" : tvTier}</div>
                      {tvTier !== "None" && (
                        <button
                          onClick={() => {
                            if (!hasLagosFlix) return setLogMessage("⚠️ Subscribe to LagosFlix first!");
                            setShowTvModal(true);
                            setEnergy((p) => Math.min(100, p + 15));
                          }}
                          className="mt-1.5 px-2.5 py-1 bg-rose-600 text-white rounded text-[10px] font-bold"
                        >
                          ▶ Watch LagosFlix
                        </button>
                      )}
                    </div>
                  </div>

                  {/* ILLUSTRATED FURNITURE CARDS */}
                  <div className="grid grid-cols-3 gap-3 my-6">
                    <div className="bg-black/50 border border-white/10 rounded-xl p-3 text-center">
                      <div className="text-2xl mb-1">{bedTier === "Bare_Floor" ? "🪵" : bedTier === "Foam_Mattress" ? "🛏️" : "👑"}</div>
                      <div className="text-[10px] text-slate-400">Sleeping Spot</div>
                      <div className="font-bold text-xs">{bedTier.replace("_", " ")}</div>
                    </div>
                    <div className="bg-black/50 border border-white/10 rounded-xl p-3 text-center">
                      <div className="text-2xl mb-1">{chairTier === "None" ? "🚫" : "🛋️"}</div>
                      <div className="text-[10px] text-slate-400">Living Room</div>
                      <div className="font-bold text-xs">{chairTier.replace("_", " ")}</div>
                    </div>
                    <div className="bg-black/50 border border-white/10 rounded-xl p-3 text-center">
                      <div className="text-2xl mb-1">{hasCookingStove ? "🔥" : "🍳"}</div>
                      <div className="text-[10px] text-slate-400">Kitchen Corner</div>
                      <div className="font-bold text-xs">
                        {hasCookingStove ? `Gas Stove (${gasLevel}%)` : "No Stove"}
                      </div>
                    </div>
                  </div>

                  {/* HOME KITCHEN COOKING BAR */}
                  <div className="bg-black/50 p-3 rounded-xl border border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="font-bold text-amber-300">🍲 Home Kitchen: </span>
                      <span>Raw Food Stock: <strong>{rawFoodServings} Meals</strong> • Gas: <strong>{gasLevel}%</strong></span>
                    </div>
                    <button
                      disabled={!!timers.cook_cd}
                      onClick={() => {
                        if (!hasCookingStove) return setLogMessage("❌ You don't own a Gas Stove! Go to 'Outdoor City' -> 'Gas & Kitchen Shop' to buy one.");
                        if (gasLevel < 10) return setLogMessage("❌ Your gas cylinder is empty! Refill it at the Gas Shop.");
                        if (rawFoodServings < 1) return setLogMessage("❌ No raw food in your kitchen! Buy raw foodstuffs at the Market/Shop.");
                        startCooldown("cook_cd", 60);
                        setGasLevel((g) => g - 10);
                        setRawFoodServings((r) => r - 1);
                        setHunger((h) => Math.min(100, h + 45));
                        setEnergy((e) => Math.min(100, e + 35));
                        setHealth((hp) => Math.min(100, hp + 10));
                        setLogMessage("🍳 Cooked fresh home-made Jollof & Beans! (+45% Belly, +35% Energy, +10% Health. 60s kitchen timer).");
                      }}
                      className="px-3 py-1.5 bg-emerald-500 text-slate-950 font-extrabold rounded-lg disabled:opacity-40"
                    >
                      {timers.cook_cd ? `⏳ Cooking (${formatSecs(timers.cook_cd)})` : "🍳 Cook Meal at Home (Uses 1 Raw Food & 10% Gas)"}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* HOME ACTIONS & PAINTING */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
              <h2 className="font-bold text-sm">Home Controls & DIY Painting</h2>
              <button
                disabled={area !== shelterArea || !!timers.sleep_cd}
                onClick={() => {
                  const maxCap = bedTier === "Bare_Floor" ? 60 : bedTier === "Foam_Mattress" ? 85 : 100;
                  startCooldown("sleep_cd", 60);
                  setEnergy(maxCap);
                  setGameDay((d) => d + 1);
                  setHustlesDoneToday(0);
                  setWorkedOfficeToday(false);
                  setLogMessage(`🛌 Slept in your ${shelterArea} home! Energy restored to ${maxCap}%.`);
                }}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-extrabold text-white disabled:opacity-40"
              >
                {area !== shelterArea
                  ? `🔒 Return to ${shelterArea} to Sleep`
                  : timers.sleep_cd
                  ? `⏳ Sleeping (${formatSecs(timers.sleep_cd)})`
                  : "🛌 Sleep Overnight (60s Rest)"}
              </button>

              <div className="font-bold text-slate-400 uppercase pt-2">Paint Room Walls (60s Timer)</div>
              <div className="grid grid-cols-3 gap-1.5">
                {(["Cream", "Emerald", "RoyalBlue"] as const).map((col) => (
                  <button
                    key={col}
                    disabled={wallColor === col || area !== shelterArea}
                    onClick={() => {
                      if (spendMoney(25000)) {
                        startCooldown("paint_cd", 60);
                        setWallColor(col);
                        setSteeze((p) => p + 15);
                        setLogMessage(`🎨 Painted your home walls ${col}!`);
                      }
                    }}
                    className="p-2 bg-slate-950 border border-slate-800 rounded-lg disabled:opacity-40"
                  >
                    {wallColor === col ? `✓ ${col}` : `${col} (25k)`}
                  </button>
                ))}
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="font-bold text-emerald-400">🛍️ Want to Buy Bed, TV, Sofa or Gas Stove?</div>
                <p className="text-slate-400 text-[11px]">
                  Step outside into the <strong>Outdoor City Map</strong> to enter the Furniture Showroom, Electronics Shop, or Gas & Kitchen Market!
                </p>
                <button
                  onClick={() => setActiveTab("city")}
                  className="w-full py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-lg"
                >
                  🗺️ Step Outside to {area} City Map
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 2: 🗺️ OUTDOOR CITY MAP (AREAS, DISTANCE FARES & CLICKABLE BUILDINGS)
           ===================================================================== */}
        {activeTab === "city" && (
          <div className="space-y-4 text-xs">
            {/* DISTANCE-BASED INTER-AREA TRANSPORT TERMINAL */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <h2 className="font-bold text-sm text-emerald-400">
                  🚌 Lagos Inter-Area Transport Terminal (Currently in: {area})
                </h2>
                <span className="text-[11px] text-amber-300">
                  {weather === "Heavy Lagos Rain" ? "🌧️ Rain Surge: Bus & Cab fares +50% higher!" : "☀️ Normal Traffic Rates"}
                </span>
              </div>

              <div className="grid sm:grid-cols-5 gap-2">
                {(["Oshodi", "Berger", "Yaba", "Surulere", "Lekki"] as AreaName[]).map((dest) => {
                  const fares = getTransportCosts(dest);
                  const isHere = area === dest;
                  return (
                    <div
                      key={dest}
                      className={`p-3 rounded-xl border ${
                        isHere ? "bg-emerald-950/40 border-emerald-500" : "bg-slate-950 border-slate-800"
                      } space-y-2`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-sm text-white">📍 {dest}</span>
                        {shelterArea === dest && <span className="text-[10px] bg-indigo-600 px-1.5 py-0.5 rounded">🏠 Home</span>}
                      </div>
                      {isHere ? (
                        <div className="py-2 text-center text-emerald-400 font-bold">✓ You Are Here</div>
                      ) : (
                        <div className="space-y-1">
                          <button
                            disabled={!!timers.commute}
                            onClick={() => {
                              if (energy < fares.trekEnergy) return setLogMessage("⚠️ Too weak to trek that distance!");
                              startCooldown("commute", 60);
                              setEnergy((e) => Math.max(0, e - fares.trekEnergy));
                              setHealth((h) => Math.max(15, h - fares.trekHealthLoss));
                              setWeight((w) => Number(Math.max(50, w - 0.5).toFixed(1)));
                              setArea(dest);
                              setEnteredBuilding("None");
                              setLogMessage(`🚶🏾‍♂️ Trekked from ${area} to ${dest}! (-${fares.trekEnergy}% Energy, -${fares.trekHealthLoss}% Health, 60s timer).`);
                            }}
                            className="w-full py-1 bg-slate-800 hover:bg-slate-700 rounded text-[10px]"
                          >
                            🚶🏾‍♂️ Trek (₦0 • -{fares.trekEnergy}% En)
                          </button>
                          <button
                            disabled={!!timers.commute}
                            onClick={() => {
                              if (!spendMoney(fares.busCost)) return;
                              startCooldown("commute", 45);
                              setEnergy((e) => Math.max(0, e - 5));
                              setArea(dest);
                              setEnteredBuilding("None");
                              setLogMessage(`🚐 Took Danfo Bus to ${dest} (-${fares.busCost.toLocaleString()} g₦, 45s commute).`);
                            }}
                            className="w-full py-1 bg-amber-600/30 border border-amber-600 text-amber-300 rounded text-[10px] font-bold"
                          >
                            🚐 Bus ({fares.busCost.toLocaleString()} g₦)
                          </button>
                          <button
                            disabled={!!timers.commute}
                            onClick={() => {
                              if (!spendMoney(fares.cabCost)) return;
                              startCooldown("commute", 25);
                              setArea(dest);
                              setEnteredBuilding("None");
                              setLogMessage(`🚕 Took Executive Cab to ${dest} (-${fares.cabCost.toLocaleString()} g₦).`);
                            }}
                            className="w-full py-1 bg-indigo-600 text-white rounded text-[10px] font-bold"
                          >
                            🚕 Cab ({fares.cabCost.toLocaleString()} g₦)
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* OUTDOOR 2D STREET BUILDINGS IN CURRENT AREA (CLICK TO ENTER!) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-amber-400">
                🏙️ Outdoor Street View in {area} — Click Any Building to Enter Inside
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                {[
                  { id: "Furniture_Shop", icon: "🛏️", name: "Mattress & Sofa Showroom", sub: "Beds & Chairs" },
                  { id: "Electronics_Shop", icon: "📺", name: "LG/Samsung TV Plaza", sub: "3 TV Tiers" },
                  { id: "Gas_Kitchen_Shop", icon: "🔥", name: "Gas, Stove & Raw Food", sub: "Cook at Home" },
                  { id: "Eatery", icon: "🍗", name: `${area} Bukka & Eatery`, sub: "Hot Meals" },
                  { id: "Church_Social", icon: "⛪", name: "Church & Social Lounge", sub: "Meet Partners" },
                  { id: "Office_Building", icon: "🏢", name: `${area} Corporate Towers`, sub: "Work & Colleagues" },
                ].map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setEnteredBuilding(b.id as any)}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                      enteredBuilding === b.id
                        ? "bg-emerald-950/60 border-emerald-400 scale-[1.02]"
                        : "bg-slate-950 border-slate-800 hover:border-slate-600"
                    }`}
                  >
                    <span className="text-3xl">{b.icon}</span>
                    <span className="font-extrabold text-xs text-white">{b.name}</span>
                    <span className="text-[10px] text-slate-400">{b.sub}</span>
                  </button>
                ))}
              </div>

              {/* INSIDE THE SELECTED BUILDING */}
              {enteredBuilding === "Furniture_Shop" && (
                <div className="p-4 bg-slate-950 border border-amber-500/40 rounded-2xl space-y-3">
                  <h3 className="font-extrabold text-sm text-amber-400">🛏️ Inside {area} Furniture & Mattress Showroom</h3>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {[
                      { icon: "🛏️", name: "Mouka Foam Mattress", tier: "Foam_Mattress", cost: 30000, desc: "Raises sleep cap to 85% Energy" },
                      { icon: "👑", name: "Orthopedic Royal King Bed", tier: "King_Bed", cost: 95000, desc: "Raises sleep cap to 100% + 20 Steeze" },
                      { icon: "🛋️", name: "L-Shaped Cushion Sofa Set", tier: "Cushion_Sofa", cost: 55000, desc: "Required to host visitors & marry" },
                    ].map((item, i) => (
                      <div key={i} className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                        <div className="text-3xl">{item.icon}</div>
                        <div className="font-bold text-white">{item.name}</div>
                        <div className="text-[10px] text-slate-400">{item.desc}</div>
                        <button
                          onClick={() => {
                            if (spendMoney(item.cost)) {
                              if (item.tier === "Cushion_Sofa") setChairTier(item.tier);
                              else setBedTier(item.tier);
                              setSteeze((s) => s + 15);
                              setLogMessage(`🛍️ Purchased ${item.name}! Delivered to your home in ${shelterArea}.`);
                            }
                          }}
                          className="w-full py-1.5 bg-amber-500 text-slate-950 font-extrabold rounded-lg"
                        >
                          Buy ({item.cost.toLocaleString()} g₦)
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {enteredBuilding === "Electronics_Shop" && (
                <div className="p-4 bg-slate-950 border border-cyan-500/40 rounded-2xl space-y-3">
                  <h3 className="font-extrabold text-sm text-cyan-400">📺 Inside {area} Electronics & TV Plaza (Choose TV Type)</h3>
                  <div className="grid sm:grid-cols-4 gap-3">
                    {[
                      { icon: "📦", name: "19-Inch 'Kpalasa' Box TV", cost: 45000, steeze: 5 },
                      { icon: "🖥️", name: "32-Inch LED Flat TV", cost: 85000, steeze: 15 },
                      { icon: "📺", name: "55-Inch 4K Smart TV", cost: 175000, steeze: 30 },
                      { icon: "🎬", name: "85-Inch Curved OLED Cinema", cost: 420000, steeze: 65 },
                    ].map((tv, i) => (
                      <div key={i} className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                        <div className="text-3xl">{tv.icon}</div>
                        <div className="font-bold text-white">{tv.name}</div>
                        <div className="text-[10px] text-cyan-400">+{tv.steeze} Steeze Points</div>
                        <button
                          onClick={() => {
                            if (spendMoney(tv.cost)) {
                              setTvTier(tv.name);
                              setSteeze((s) => s + tv.steeze);
                              setLogMessage(`📺 Bought ${tv.name} and mounted it in your ${shelterArea} home!`);
                            }
                          }}
                          className="w-full py-1.5 bg-cyan-500 text-slate-950 font-extrabold rounded-lg"
                        >
                          Buy ({tv.cost.toLocaleString()} g₦)
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {enteredBuilding === "Gas_Kitchen_Shop" && (
                <div className="p-4 bg-slate-950 border border-orange-500/40 rounded-2xl space-y-3">
                  <h3 className="font-extrabold text-sm text-orange-400">🔥 Inside {area} Cooking Gas, Stove & Raw Foodstuff Market</h3>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                      <div className="text-3xl">🔥</div>
                      <div className="font-bold">Tabletop Gas Burner & Cylinder</div>
                      <div className="text-[10px] text-slate-400">Unlocks cooking inside your home (comes with 50% gas).</div>
                      <button
                        disabled={hasCookingStove}
                        onClick={() => {
                          if (spendMoney(35000)) {
                            setHasCookingStove(true);
                            setGasLevel(50);
                            setLogMessage("🔥 Bought Gas Cylinder & Burner! You can now cook meals at home.");
                          }
                        }}
                        className="w-full py-1.5 bg-orange-500 text-slate-950 font-extrabold rounded-lg disabled:opacity-40"
                      >
                        {hasCookingStove ? "✓ Owned" : "Buy Stove (35,000 g₦)"}
                      </button>
                    </div>

                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                      <div className="text-3xl">⛽</div>
                      <div className="font-bold">Refill 12.5kg Cooking Gas</div>
                      <div className="text-[10px] text-slate-400">Fills your kitchen gas cylinder to 100%.</div>
                      <button
                        onClick={() => {
                          if (!hasCookingStove) return setLogMessage("❌ Buy a Gas Stove & Cylinder first!");
                          if (spendMoney(12000)) {
                            setGasLevel(100);
                            setLogMessage("⛽ Cooking gas refilled to 100%!");
                          }
                        }}
                        className="w-full py-1.5 bg-amber-500 text-slate-950 font-extrabold rounded-lg"
                      >
                        Refill Gas (12,000 g₦)
                      </button>
                    </div>

                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                      <div className="text-3xl">🌾</div>
                      <div className="font-bold">Raw Rice, Beans & Chicken Pack (5 Meals)</div>
                      <div className="text-[10px] text-slate-400">Only 2,000 g₦ per home-cooked meal!</div>
                      <button
                        onClick={() => {
                          if (spendMoney(10000)) {
                            setRawFoodServings((r) => r + 5);
                            setLogMessage("🌾 Bought 5 servings of raw foodstuffs! Cook them inside My Home.");
                          }
                        }}
                        className="w-full py-1.5 bg-emerald-500 text-slate-950 font-extrabold rounded-lg"
                      >
                        Buy 5 Raw Meals (10,000 g₦)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {enteredBuilding === "Eatery" && (
                <div className="p-4 bg-slate-950 border border-emerald-500/40 rounded-2xl space-y-3">
                  <h3 className="font-extrabold text-sm text-emerald-400">🍗 Inside {area} Bukka & Fast-Food Restaurant (60s Eating Timer)</h3>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {[
                      { name: "Roadside Bread & Beans", cost: 2000, en: 20, wt: 0.7, hp: 0 },
                      { name: "Amala, Gbegiri & Assorted Meat", cost: 4500, en: 35, wt: 0.3, hp: 8 },
                      { name: "Grilled Catfish, Plantain & Salad", cost: 8500, en: 50, wt: -0.3, hp: 15 },
                    ].map((m, i) => (
                      <button
                        key={i}
                        disabled={!!timers.eat_cd}
                        onClick={() => {
                          if (spendMoney(m.cost)) {
                            startCooldown("eat_cd", 60);
                            setHunger((h) => Math.min(100, h + 40));
                            setEnergy((e) => Math.min(100, e + m.en));
                            setWeight((w) => Number((w + m.wt).toFixed(1)));
                            setHealth((hp) => Math.min(100, hp + m.hp));
                            setLogMessage(`🍽️ Ate ${m.name} at ${area} Eatery! (60s meal timer active)`);
                          }
                        }}
                        className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-left disabled:opacity-40"
                      >
                        <div className="font-bold text-white">{m.name}</div>
                        <div className="text-emerald-400 font-bold mt-1">{m.cost.toLocaleString()} g₦ • +{m.en}% Energy</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ORGANIC SOCIAL INTERACTION & COURTSHIP INSIDE CHURCH / LOUNGE / OFFICE */}
              {(enteredBuilding === "Church_Social" || enteredBuilding === "Office_Building") && (
                <div className="p-4 bg-slate-950 border border-rose-500/40 rounded-2xl space-y-3">
                  <h3 className="font-extrabold text-sm text-rose-400">
                    💬 People Currently Inside {enteredBuilding === "Church_Social" ? `${area} Church & Social Lounge` : `${area} Corporate Towers`}
                  </h3>
                  <p className="text-slate-400 text-[11px]">
                    Chat with people in this building! Once someone is interested, you begin courting at <strong>10% Bond</strong> and must complete <strong>10 Dates (+10% Bond per date)</strong> to unlock marriage.
                  </p>

                  <div className="grid sm:grid-cols-3 gap-3">
                    {(gender === "male"
                      ? [
                          { name: "Chidinma (Accountant)", loc: "Lekki", vibe: "Loves intellectual & ambitious men" },
                          { name: "Zainab (Architect)", loc: "Yaba", vibe: "Values neat dressing & stability" },
                          { name: "Tolu (Digital Strategist)", loc: "Oshodi", vibe: "Friendly & hardworking" },
                        ]
                      : [
                          { name: "Adewale (Bank Officer)", loc: "Lekki", vibe: "Respectful & career-driven" },
                          { name: "Chinedu (Estate Developer)", loc: "Yaba", vibe: "Ambitious builder" },
                          { name: "Ibrahim (Tech Lead)", loc: "Berger", vibe: "Calm & supportive" },
                        ]
                    ).map((person, i) => (
                      <div key={i} className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                        <div className="font-bold text-white">{person.name}</div>
                        <div className="text-[10px] text-slate-400">{person.vibe}</div>
                        <button
                          onClick={() => {
                            if (energy < 15) return setLogMessage("⚠️ Too tired to hold a conversation!");
                            setEnergy((e) => Math.max(0, e - 10));
                            setChatHistory((prev) => [
                              `You chatted with ${person.name} at ${area}: "Hey! How is work going?" — ${person.name} smiled and exchanged numbers with you!`,
                              ...prev,
                            ]);
                            if (maritalStatus === "Single") {
                              setPartnerName(person.name);
                              setMaritalStatus("Courting");
                              setRelationshipBond(10); // Starts at 10% as requested!
                              setLogMessage(`❤️ ${person.name} liked your conversation! You are now Courting at 10% Bond. Schedule 9 more dates to hit 100%!`);
                            } else {
                              setLogMessage(`💬 Had a great conversation with ${person.name}!`);
                            }
                          }}
                          className="w-full py-1.5 bg-rose-600 text-white font-bold rounded-lg"
                        >
                          💬 Chat & Converse (-10% Energy)
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* ACTIVE COUPLE DATING & CONVERSATION PANEL */}
                  {maritalStatus === "Courting" && (
                    <div className="p-3 bg-rose-950/30 border border-rose-700 rounded-xl space-y-2 mt-3">
                      <div className="flex justify-between font-bold">
                        <span>💑 Courting: {partnerName}</span>
                        <span className="text-emerald-400">Couple Bond: {relationshipBond}% / 100% (+10% per Date)</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          disabled={!!timers.date_cd}
                          onClick={() => {
                            if (health < 60 || energy < 30) {
                              return setLogMessage("❌ You must have at least 60% Health and 30% Energy to go on a date!");
                            }
                            if (!spendMoney(25000)) return;
                            startCooldown("date_cd", 60);
                            setEnergy((e) => Math.max(0, e - 25));
                            const nextBond = Math.min(100, relationshipBond + 10);
                            setRelationshipBond(nextBond);
                            setLogMessage(`🍷 Took ${partnerName} out on a dinner date (-25,000 g₦, -25% Energy)! Couple Bond is now ${nextBond}%!`);
                          }}
                          className="px-4 py-2 bg-rose-500 text-white font-extrabold rounded-lg disabled:opacity-40"
                        >
                          {timers.date_cd
                            ? `⏳ On Date (${formatSecs(timers.date_cd)})`
                            : `🍷 Take ${partnerName} on Date (25,000 g₦ • +10% Bond • 60s)`}
                        </button>

                        <button
                          onClick={() => {
                            if (relationshipBond < 100) return setLogMessage(`❌ You need 100% Bond to marry! Currently at ${relationshipBond}%.`);
                            if (wallColor === "Unplastered" || bedTier === "Bare_Floor" || chairTier === "None") {
                              return setLogMessage("❌ Furnish & paint your home before marriage!");
                            }
                            if (spendMoney(150000)) {
                              setMaritalStatus("Married");
                              setCertificatesList((c) => [...c, `Marriage Certificate (${partnerName})`]);
                              setSteeze((s) => s + 50);
                              setLogMessage(`💍 Married ${partnerName}! Added Marriage Certificate to your Profile!`);
                            }
                          }}
                          className="px-4 py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-lg"
                        >
                          💍 Propose & Marry at Registry (Req: 100% Bond • 150k g₦)
                        </button>
                      </div>
                    </div>
                  )}

                  {chatHistory.length > 0 && (
                    <div className="p-2.5 bg-slate-900 rounded-xl space-y-1 text-[11px] text-slate-300">
                      {chatHistory.slice(0, 3).map((c, i) => <div key={i}>• {c}</div>)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 3: 💼 EXPANDED JOBS (LOCATION-TIED HUSTLES + 7 CORPORATES + GIGS)
           ===================================================================== */}
        {activeTab === "jobs" && (
          <div className="grid md:grid-cols-3 gap-4 text-xs">
            {/* LOCATION-TIED STREET HUSTLES (60s-90s TIMERS) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-sm text-amber-400">🧱 Location-Based Street Jobs</h2>
                <span className="px-2 py-0.5 bg-amber-950 text-amber-300 rounded-full font-bold">{hustlesDoneToday}/3 Today</span>
              </div>
              <p className="text-[11px] text-slate-400">
                You must commute to the exact Area where the job is happening! Minimum 60s–90s cooldown per job.
              </p>
              {[
                { id: "h1", name: "🧱 Duplex Bricklaying Site", loc: "Lekki" as AreaName, pay: 12000, cd: 90 },
                { id: "h2", name: "🍽️ Restaurant Kitchen & Plate Washing", loc: "Yaba" as AreaName, pay: 7500, cd: 60 },
                { id: "h3", name: "📦 Oshodi Market Load Carrier", loc: "Oshodi" as AreaName, pay: 6000, cd: 60 },
                { id: "h4", name: "🧹 Berger Warehouse Offloading", loc: "Berger" as AreaName, pay: 8500, cd: 75 },
                { id: "h5", name: "🎉 Surulere Owambe Event Server", loc: "Surulere" as AreaName, pay: 9000, cd: 75 },
              ].map((h) => {
                const cd = timers[h.id];
                return (
                  <div key={h.id} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                    <div className="flex justify-between font-bold">
                      <span>{h.name}</span>
                      <span className="text-emerald-400">+{h.pay.toLocaleString()} g₦</span>
                    </div>
                    <div className="text-[10px] text-slate-400">📍 Location: {h.loc} • Cooldown: {h.cd}s</div>
                    <button
                      disabled={!!cd || hustlesDoneToday >= 3}
                      onClick={() => {
                        if (area !== h.loc) return setLogMessage(`🚌 You are in ${area}! Take a Bus, Cab, or Trek to ${h.loc} in the Outdoor City tab to do this job!`);
                        if (energy < 30) return setLogMessage("⚠️ Need 30% Energy!");
                        startCooldown(h.id, h.cd);
                        setHustlesDoneToday((p) => p + 1);
                        setEnergy((e) => Math.max(0, e - 30));
                        const actual = health < 60 ? Math.floor(h.pay * 0.65) : h.pay;
                        setEarnedBalance((p) => p + actual);
                        setLogMessage(`✅ Completed ${h.name} in ${h.loc}! Paid +${actual.toLocaleString()} g₦.`);
                      }}
                      className="w-full py-1.5 bg-amber-500 text-slate-950 font-extrabold rounded-lg disabled:opacity-40"
                    >
                      {cd ? `⏳ Cooldown (${formatSecs(cd)})` : area !== h.loc ? `🚌 Commute to ${h.loc} First` : "Work Shift"}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* EXPANDED 7 CORPORATE EMPLOYERS */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <h2 className="font-bold text-sm text-cyan-400">🏢 Corporate Employment (7 Companies)</h2>
              {employedJob ? (
                <div className="p-3 bg-cyan-950/30 border border-cyan-700 rounded-xl space-y-2.5">
                  <div className="font-extrabold text-sm text-white">{employedJob.title}</div>
                  <div className="text-cyan-300">Employer: {employedJob.company} (📍 {employedJob.area})</div>
                  <div className="text-emerald-400 font-bold">Pay: {employedJob.payPer3Days.toLocaleString()} g₦ / 3 Days</div>
                  <div className="bg-slate-950 p-2 rounded-lg">Attendance: <strong>{daysWorkedThisCycle}/3 Days</strong></div>
                  <button
                    disabled={workedOfficeToday || !!timers.office_cd}
                    onClick={() => {
                      if (area !== employedJob.area) return setLogMessage(`🚌 Commute to ${employedJob.area} first!`);
                      startCooldown("office_cd", 60);
                      setWorkedOfficeToday(true);
                      setEnergy((e) => Math.max(0, e - 30));
                      const nextD = daysWorkedThisCycle + 1;
                      if (nextD >= 3) {
                        setDaysWorkedThisCycle(0);
                        setEarnedBalance((p) => p + employedJob.payPer3Days);
                        setLogMessage(`💰 PAYDAY! +${employedJob.payPer3Days.toLocaleString()} g₦ paid by ${employedJob.company}!`);
                      } else {
                        setDaysWorkedThisCycle(nextD);
                        setLogMessage(`🏢 Office shift ${nextD}/3 done at ${employedJob.company}!`);
                      }
                    }}
                    className="w-full py-2.5 bg-cyan-500 text-slate-950 font-extrabold rounded-xl disabled:opacity-40"
                  >
                    {timers.office_cd ? `⏳ Working (${formatSecs(timers.office_cd)})` : workedOfficeToday ? "✓ Worked Today" : `Clock In at ${employedJob.area} Office (60s)`}
                  </button>
                  <button onClick={() => setEmployedJob(null)} className="w-full text-slate-400 underline">Switch Job</button>
                </div>
              ) : (
                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                  {[
                    { title: "Front Desk Officer", company: "Oshodi Microfinance", area: "Oshodi" as AreaName, reqEdu: "Polytechnic ND", reqCv: 25, pay: 55000 },
                    { title: "IT Support Officer", company: "Yaba CcHub Tech", area: "Yaba" as AreaName, reqEdu: "Polytechnic ND", reqCv: 50, pay: 75000 },
                    { title: "Fleet Supervisor", company: "Berger Julius Construction", area: "Berger" as AreaName, reqEdu: "Polytechnic HND", reqCv: 65, pay: 115000 },
                    { title: "Media Account Manager", company: "Surulere AdWorks PLC", area: "Surulere" as AreaName, reqEdu: "Polytechnic HND", reqCv: 75, pay: 140000 },
                    { title: "Commercial Bank Executive", company: "ZenithMarina PLC", area: "Lekki" as AreaName, reqEdu: "University B.Sc", reqCv: 85, pay: 210000 },
                    { title: "Senior Software Architect", company: "PaystackLekki HQ", area: "Lekki" as AreaName, reqEdu: "University B.Sc", reqCv: 90, pay: 280000 },
                    { title: "Multinational Oil Director", company: "Chevron & Shell VI", area: "Lekki" as AreaName, reqEdu: "Masters Abroad (M.Sc)", reqCv: 95, pay: 520000 },
                  ].map((j, i) => (
                    <div key={i} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                      <div>
                        <div className="font-bold text-white">{j.title} — {j.company}</div>
                        <div className="text-[10px] text-slate-400">
                          📍 {j.area} • Req: {j.reqEdu} & CV {j.reqCv}% • {j.pay.toLocaleString()} g₦/3d
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (!certificatesList.includes(j.reqEdu) && !certificatesList.includes("Masters Abroad (M.Sc)")) {
                            return setLogMessage(`❌ Requires ${j.reqEdu} certificate on your Profile!`);
                          }
                          if (cvScore < j.reqCv) return setLogMessage(`❌ Requires CV Score ${j.reqCv}%+!`);
                          setEmployedJob({ title: j.title, company: j.company, area: j.area, payPer3Days: j.pay });
                          setLogMessage(`🎉 Hired at ${j.company} (${j.area})!`);
                        }}
                        className="px-3 py-1 bg-cyan-600 text-white font-bold rounded-lg"
                      >
                        Apply
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SOCIAL GIGS (2-MINUTE TO 5-MINUTE BATCH TIMERS) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-emerald-400">📱 Social Gigs (Timed Batches)</h2>
              {[
                { id: "sg1", title: "Follow JPC Party on X", reward: 2500, cd: 180 },
                { id: "sg2", title: "Follow Lagos Dev on LinkedIn", reward: 4000, cd: 240 },
                { id: "sg3", title: "Test Partner Web App & Review", reward: 12000, cd: 300 },
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
                            setLogMessage(`✅ Verified! +${g.reward.toLocaleString()} g₦ paid.`);
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
            TAB 4: 🎓 SCHOOL, SCHOLARSHIPS, ABROAD VISA/ADMISSION & EXPENSIVE BLUEPRINTS
           ===================================================================== */}
        {activeTab === "school" && (
          <div className="grid md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <h2 className="font-bold text-sm text-amber-400">🎓 Degrees, Scholarships & Study Abroad</h2>

              {/* SCHOLARSHIP BOARD */}
              <div className="p-2.5 bg-emerald-950/30 border border-emerald-700 rounded-xl flex justify-between items-center">
                <div>
                  <div className="font-bold text-emerald-300">🏆 Corporate Tuition Scholarship</div>
                  <div className="text-[10px] text-slate-400">Req: 30+ Citizen Points & 80%+ Health (Slashes Tuition 50%!)</div>
                </div>
                <button
                  disabled={hasScholarship}
                  onClick={() => {
                    if (citizenPoints < 30 || health < 80) return setLogMessage("❌ Scholarship requires 30+ Citizen Points & 80%+ Health!");
                    setHasScholarship(true);
                    setLogMessage("🎉 Awarded a 50% Corporate Tuition Scholarship!");
                  }}
                  className="px-2.5 py-1 bg-emerald-500 text-slate-950 font-extrabold rounded-lg disabled:opacity-40"
                >
                  {hasScholarship ? "✓ Active (-50%)" : "Apply"}
                </button>
              </div>

              {enrolledProgram ? (
                <div className="p-3 bg-indigo-950/50 border border-indigo-500 rounded-xl space-y-2">
                  <div className="font-extrabold text-white">📚 Program: {enrolledProgram.name}</div>
                  <div className="text-amber-300 font-bold">Progress: {enrolledProgram.completedClasses} / {enrolledProgram.totalClasses} Lectures</div>
                  <button
                    disabled={!!timers.lecture_cd}
                    onClick={() => {
                      if (energy < 25) return setLogMessage("⚠️ Need 25% Energy for lecture!");
                      startCooldown("lecture_cd", 60); // 1-Minute Lecture Timer!
                      setEnergy((e) => Math.max(0, e - 25));
                      const nextC = enrolledProgram.completedClasses + 1;
                      if (nextC >= enrolledProgram.totalClasses) {
                        setEducation(enrolledProgram.name);
                        setCertificatesList((c) => [...c, enrolledProgram.name]);
                        setEnrolledProgram(null);
                        setSteeze((s) => s + 35);
                        setLogMessage(`🎓 GRADUATED! ${enrolledProgram.name} added to your Profile Achievements!`);
                      } else {
                        setEnrolledProgram({ ...enrolledProgram, completedClasses: nextC });
                        setLogMessage(`📖 Completed Lecture ${nextC}/${enrolledProgram.totalClasses} (60s cooldown).`);
                      }
                    }}
                    className="w-full py-2.5 bg-emerald-500 text-slate-950 font-extrabold rounded-xl disabled:opacity-40"
                  >
                    {timers.lecture_cd ? `⏳ In Lecture (${formatSecs(timers.lecture_cd)})` : `Attend Lecture #${enrolledProgram.completedClasses + 1} (60s)`}
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {[
                    { name: "Polytechnic ND", cost: 220000, classes: 6, req: null },
                    { name: "Polytechnic HND", cost: 350000, classes: 6, req: "Polytechnic ND" },
                    { name: "University B.Sc", cost: 680000, classes: 10, req: null },
                  ].map((d, i) => {
                    const finalCost = hasScholarship ? d.cost / 2 : d.cost;
                    return (
                      <div key={i} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                        <div>
                          <div className="font-bold text-white">{d.name} ({d.classes} Classes)</div>
                          <div className="text-[10px] text-amber-400">{finalCost.toLocaleString()} g₦ {hasScholarship && "(50% Scholarship)"}</div>
                        </div>
                        <button
                          onClick={() => {
                            if (d.req && !certificatesList.includes(d.req)) return setLogMessage(`❌ Requires ${d.req} first!`);
                            if (spendMoney(finalCost)) {
                              setEnrolledProgram({ name: d.name, totalClasses: d.classes, completedClasses: 0 });
                              setLogMessage(`🎓 Enrolled in ${d.name}!`);
                            }
                          }}
                          className="px-3 py-1.5 bg-indigo-600 text-white font-bold rounded-lg"
                        >
                          Enroll
                        </button>
                      </div>
                    );
                  })}

                  {/* STUDY ABROAD PIPELINE (VISA 250K -> APPLY ADMISSION -> 30M DEADLINE -> PAY 1.8M) */}
                  <div className="p-3 bg-amber-950/30 border border-amber-700 rounded-xl space-y-2">
                    <div className="font-bold text-amber-300">✈️ Study Abroad M.Sc (Visa: 250k • Tuition: 1.8M g₦)</div>
                    {abroadStatus === "None" && (
                      <button
                        onClick={() => {
                          if (!certificatesList.includes("University B.Sc") && !certificatesList.includes("Polytechnic HND")) {
                            return setLogMessage("❌ Requires B.Sc or HND first!");
                          }
                          if (spendMoney(250000)) {
                            startCooldown("visa_cd", 90);
                            setTimeout(() => {
                              setAbroadStatus("Visa_Granted");
                              setLogMessage("🛂 Visa Granted! Now apply for University Admission.");
                            }, 90000);
                          }
                        }}
                        className="w-full py-1.5 bg-amber-500 text-slate-950 font-extrabold rounded-lg"
                      >
                        {timers.visa_cd ? `⏳ Embassy Visa Wait (${formatSecs(timers.visa_cd)})` : "Step 1: Pay Visa Fee (250,000 g₦ • 90s)"}
                      </button>
                    )}
                    {abroadStatus === "Visa_Granted" && (
                      <button
                        onClick={() => {
                          if (spendMoney(50000)) {
                            setAbroadStatus("Admission_Pending");
                            startCooldown("adm_wait", 90);
                            setTimeout(() => {
                              setAbroadStatus("Admitted_30m_Window");
                              startCooldown("adm_deadline", 1800); // 30-Minute Requirement Window!
                              setLogMessage("🎓 Abroad Admission Offer Received! Meet tuition & health requirements within 30 minutes or offer voids!");
                            }, 90000);
                          }
                        }}
                        className="w-full py-1.5 bg-indigo-600 text-white font-bold rounded-lg"
                      >
                        Step 2: Submit Abroad Admission (50k g₦ • 90s Wait)
                      </button>
                    )}
                    {abroadStatus === "Admission_Pending" && (
                      <div className="text-amber-300 font-bold">⏳ Reviewing Admission: {formatSecs(timers.adm_wait)}</div>
                    )}
                    {abroadStatus === "Admitted_30m_Window" && (
                      <div className="space-y-1.5">
                        <div className="text-rose-400 font-bold">⏳ Offer Voids In: {formatSecs(timers.adm_deadline)} (Req: 1.8M g₦ & Health 75%+)</div>
                        <button
                          onClick={() => {
                            if (!timers.adm_deadline) {
                              setAbroadStatus("None");
                              return setLogMessage("❌ Admission offer expired!");
                            }
                            if (health < 75) return setLogMessage("❌ Medical check failed! Health must be 75%+.");
                            if (spendMoney(1800000)) {
                              setEnrolledProgram({ name: "Masters Abroad (M.Sc)", totalClasses: 8, completedClasses: 0 });
                              setAbroadStatus("None");
                              setLogMessage("✈️ Enrolled in Masters Abroad!");
                            }
                          }}
                          className="w-full py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-lg"
                        >
                          Step 3: Pay 1,800,000 g₦ Tuition & Start M.Sc
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* HIGHER-PRICED BUSINESS COURSE BLUEPRINTS (90s STUDY TIMERS) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <h2 className="font-bold text-sm text-emerald-400">📘 Professional Business Blueprints</h2>
              <p className="text-[11px] text-slate-400">
                High-value certifications required to build money-making commercial enterprises (90s study timer).
              </p>
              {[
                { id: "Eatery", name: "🍲 Industrial Catering & Restaurant Blueprint", cost: 180000 },
                { id: "Farming", name: "🌾 Mechanized Commercial Farming Blueprint", cost: 220000 },
                { id: "Digital_Agency", name: "🎨 Media, Billboard & CAC Agency Blueprint", cost: 260000 },
                { id: "Architecture", name: "📐 Structural Architecture & Estate Blueprint", cost: 350000 },
                { id: "Private_School", name: "🏫 Private Polytechnic Accreditation Blueprint", cost: 450000 },
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
                          setCertificatesList((c) => [...c, `${bp.id} Blueprint Cert`]);
                          setLogMessage(`📘 Certified in ${bp.name}! Added to Profile.`);
                        }, 90000);
                      }
                    }}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center disabled:opacity-40"
                  >
                    <span className="font-bold text-left">{cd ? `⏳ Studying (${formatSecs(cd)})` : owned ? `✓ Certified: ${bp.id}` : bp.name}</span>
                    <span className="text-emerald-400 font-bold shrink-0">{bp.cost.toLocaleString()} g₦</span>
                  </button>
                );
              })}
            </div>

            {/* CV AGENCY & WARDROBE */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-cyan-400">📄 CV Agency & Wardrobe</h2>
              <button onClick={() => { setCvScore(25); setLogMessage("📝 Drafted DIY CV (25%)."); }} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between font-bold">
                <span>DIY Unstructured CV</span><span className="text-slate-400">FREE (25%)</span>
              </button>
              <button
                disabled={!!timers.cv_cd}
                onClick={() => {
                  if (spendMoney(55000)) {
                    startCooldown("cv_cd", 60);
                    setTimeout(() => {
                      setCvScore(95);
                      setLogMessage("💼 Executive 95% CV completed!");
                    }, 60000);
                  }
                }}
                className="w-full p-3 bg-emerald-950/40 border border-emerald-700 rounded-xl flex justify-between font-bold"
              >
                <span>{timers.cv_cd ? `⏳ Writing (${formatSecs(timers.cv_cd)})` : "Hire Pro CV Agency (60s)"}</span>
                <span className="text-emerald-400">55,000 g₦ (95%)</span>
              </button>

              <button
                disabled={hasCorporateSuit}
                onClick={() => {
                  if (spendMoney(65000)) {
                    setOutfit("Bespoke Corporate Suit & Shoes");
                    setHasCorporateSuit(true);
                    setSteeze((s) => s + 35);
                    setLogMessage("👔 Bought Bespoke Corporate Suit!");
                  }
                }}
                className="w-full p-3 bg-amber-950/40 border border-amber-700 rounded-xl flex justify-between font-bold disabled:opacity-40"
              >
                <span>{hasCorporateSuit ? "✓ Suit Owned" : "👔 Buy Bespoke Corporate Suit"}</span>
                <span className="text-amber-400">65,000 g₦</span>
              </button>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 5: 🏛️ CAC + LAND C-OF-O (120s WAIT), 2 ESTATES PER AREA & 10 CARS
           ===================================================================== */}
        {activeTab === "empire" && (
          <div className="grid md:grid-cols-3 gap-4 text-xs">
            {/* CAC, LAND C-OF-O (INCREASED PRICE + 90s-120s TIMERS) & BUILDINGS */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <h2 className="font-bold text-sm text-amber-400">🏛️ CAC, Land C-of-O & Buildings</h2>

              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                <div className="font-bold">1. CAC Status: <span className="text-emerald-400">{cacStatus}</span></div>
                {cacStatus === "None" && (
                  <>
                    <input
                      type="text"
                      placeholder="Company Name..."
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white"
                    />
                    <button
                      onClick={() => {
                        if (!companyName.trim()) return setLogMessage("⚠️ Enter Company Name!");
                        if (spendMoney(650000)) {
                          setCacStatus("Processing");
                          startCooldown("cac_cd", 90);
                          setTimeout(() => {
                            setCacStatus("Approved");
                            setCertificatesList((c) => [...c, `CAC Certificate (${companyName})`]);
                            setLogMessage(`✅ CAC Approved for ${companyName}!`);
                          }, 90000);
                        }
                      }}
                      className="w-full py-1.5 bg-amber-500 text-slate-950 font-extrabold rounded"
                    >
                      Register CAC (650,000 g₦ • 90s Wait)
                    </button>
                  </>
                )}
                {cacStatus === "Processing" && <div className="text-amber-400 font-bold">⏳ CAC Approval: {formatSecs(timers.cac_cd)}</div>}
              </div>

              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                <div className="font-bold">2. Commercial Land & C-of-O: <span className="text-emerald-400">{cofoStatus}</span></div>
                {cofoStatus === "None" && (
                  <button
                    onClick={() => {
                      if (spendMoney(1200000)) {
                        setCofoStatus("Processing");
                        startCooldown("cofo_cd", 120); // 2-Minute Minimum Wait!
                        setTimeout(() => {
                          setCofoStatus("Approved");
                          setCertificatesList((c) => [...c, `Land C-of-O (${area})`]);
                          setLogMessage("✅ Commercial Land & C-of-O Signed!");
                        }, 120000);
                      }
                    }}
                    className="w-full py-1.5 bg-indigo-600 text-white font-bold rounded"
                  >
                    Buy Land & C-of-O (1,200,000 g₦ • 120s Wait)
                  </button>
                )}
                {cofoStatus === "Processing" && <div className="text-amber-400 font-bold">⏳ C-of-O Countdown: {formatSecs(timers.cofo_cd)}</div>}
              </div>

              {[
                { id: "Eatery_Biz", name: "🍽️ Commercial Eatery Complex", bp: "Eatery", cost: 1100000, rev: 120000 },
                { id: "Agency_Biz", name: "🎨 Digital & Billboard Agency", bp: "Digital_Agency", cost: 950000, rev: 105000 },
                { id: "School_Biz", name: "🏫 Private Polytechnic Campus", bp: "Private_School", cost: 2400000, rev: 290000 },
                { id: "Farm_Biz", name: "🌾 Mechanized Farmland", bp: "Farming", cost: 800000, rev: 165000 },
              ].map((b) => {
                const owned = ownedBuildings.includes(b.id);
                const cd = timers[`b_${b.id}`];
                return (
                  <div key={b.id} className="p-2 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white">{b.name}</div>
                      <div className="text-[10px] text-amber-400">{b.cost.toLocaleString()} g₦ • Req: {b.bp} BP</div>
                    </div>
                    {owned ? (
                      <button
                        disabled={!!timers[`r_${b.id}`]}
                        onClick={() => {
                          startCooldown(`r_${b.id}`, 90);
                          setEarnedBalance((p) => p + b.rev);
                          setLogMessage(`💰 Collected +${b.rev.toLocaleString()} g₦ from ${b.name}!`);
                        }}
                        className="px-2.5 py-1 bg-emerald-500 text-slate-950 font-extrabold rounded"
                      >
                        {timers[`r_${b.id}`] ? formatSecs(timers[`r_${b.id}`]) : `+${(b.rev / 1000).toFixed(0)}k`}
                      </button>
                    ) : (
                      <button
                        disabled={!!cd}
                        onClick={() => {
                          if (cacStatus !== "Approved" || cofoStatus !== "Approved") return setLogMessage("❌ Need CAC & Land C-of-O first!");
                          if (!ownedBlueprints.includes(b.bp)) return setLogMessage(`❌ Need ${b.bp} Blueprint first!`);
                          if (spendMoney(b.cost)) {
                            startCooldown(`b_${b.id}`, 90);
                            setTimeout(() => {
                              setOwnedBuildings((p) => [...p, b.id]);
                              setCertificatesList((c) => [...c, `Building Deed: ${b.name}`]);
                              setLogMessage(`🏢 Built ${b.name}!`);
                            }, 90000);
                          }
                        }}
                        className="px-2.5 py-1 bg-slate-800 text-white font-bold rounded"
                      >
                        {cd ? formatSecs(cd) : "Build"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 2 RESIDENTIAL PROPERTIES PER AREA (10 TOTAL) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 max-h-[520px] overflow-y-auto">
              <h2 className="font-bold text-sm text-cyan-400">🏡 Real Estate (2 Properties Per Area)</h2>
              {[
                { name: "Oshodi Room & Parlor", area: "Oshodi" as AreaName, park: 1, cost: 140000 },
                { name: "Oshodi 2-Bed Flat", area: "Oshodi" as AreaName, park: 2, cost: 280000 },
                { name: "Berger Self-Contain", area: "Berger" as AreaName, park: 1, cost: 190000 },
                { name: "Berger 3-Bed Highway Flat", area: "Berger" as AreaName, park: 3, cost: 520000 },
                { name: "Yaba Tech Studio Flat", area: "Yaba" as AreaName, park: 2, cost: 380000 },
                { name: "Yaba 3-Bed Terrace", area: "Yaba" as AreaName, park: 3, cost: 820000 },
                { name: "Surulere Family 3-Bed Flat", area: "Surulere" as AreaName, park: 3, cost: 750000 },
                { name: "Surulere 4-Bed Semi-Detached Duplex", area: "Surulere" as AreaName, park: 4, cost: 1650000 },
                { name: "Lekki Phase 1 5-Bed Luxury Duplex", area: "Lekki" as AreaName, park: 5, cost: 2600000 },
                { name: "Lekki Waterfront 7-Bed Mansion Duplex", area: "Lekki" as AreaName, park: 8, cost: 6200000 },
              ].map((h, i) => (
                <div key={i} className="p-2 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white">{h.name}</div>
                    <div className="text-[10px] text-slate-400">📍 {h.area} • 🅿️ {h.park} Parking • {h.cost.toLocaleString()} g₦</div>
                  </div>
                  <button
                    disabled={shelterType === h.name}
                    onClick={() => {
                      if (spendMoney(h.cost)) {
                        setShelterType(h.name);
                        setShelterArea(h.area);
                        setParkingSlots(h.park);
                        setCertificatesList((c) => [...c, `Property: ${h.name} (${h.area})`]);
                        setLogMessage(`🏡 Moved into ${h.name} in ${h.area}!`);
                      }
                    }}
                    className="px-2.5 py-1 bg-cyan-500 text-slate-950 font-extrabold rounded disabled:opacity-40"
                  >
                    {shelterType === h.name ? "✓ Home" : "Acquire"}
                  </button>
                </div>
              ))}
            </div>

            {/* 10 CARS DEALERSHIP */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 max-h-[520px] overflow-y-auto">
              <h2 className="font-bold text-sm text-emerald-400">🚗 Automobile Dealership (10 Cars)</h2>
              <div className="text-[11px] text-amber-300">Parking Used: {carsOwned.length} / {parkingSlots} Slots</div>
              {[
                { name: "Suzuki Every 'Korope' Mini", cost: 750000, st: 10 },
                { name: "Tokunbo Toyota Corolla", cost: 1200000, st: 25 },
                { name: "Honda Accord 'Evil Spirit'", cost: 1800000, st: 35 },
                { name: "Toyota Camry 'Muscle'", cost: 2100000, st: 40 },
                { name: "Lexus RX350 SUV", cost: 2800000, st: 55 },
                { name: "Mercedes-Benz C300", cost: 3900000, st: 70 },
                { name: "Toyota Land Cruiser Prado", cost: 5400000, st: 85 },
                { name: "Range Rover Autobiography", cost: 6800000, st: 105 },
                { name: "Mercedes-AMG G63 G-Wagon", cost: 8200000, st: 130 },
                { name: "Lamborghini Urus Performante", cost: 10500000, st: 170 },
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
                        if (carsOwned.length >= parkingSlots) return setLogMessage("🚓 Need more Parking Slots!");
                        if (spendMoney(c.cost)) {
                          setCarsOwned((p) => [...p, c.name]);
                          setCertificatesList((cert) => [...cert, `Vehicle: ${c.name}`]);
                          setSteeze((s) => s + c.st);
                          setLogMessage(`🏎️ Bought ${c.name}! Added to Profile Achievements.`);
                        }
                      }}
                      className="px-2.5 py-1 bg-emerald-500 text-slate-950 font-extrabold rounded disabled:opacity-40"
                    >
                      {owned ? "✓ Owned" : "Buy"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 6: 🗳️ POLITICS (30K PARTY FEE, 450K NOMINATION FORM & CITY BILLBOARD)
           ===================================================================== */}
        {activeTab === "politics" && (
          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-emerald-400">🏛️ Party Membership (30k) & Nomination (450k)</h2>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div>Step 1: Party Status: <strong className="text-amber-400">{partyStatus}</strong></div>
                {partyStatus === "None" && (
                  <button
                    onClick={() => {
                      if (spendMoney(30000)) {
                        setPartyStatus("Pending_Approval");
                        startCooldown("p_wait", 60);
                        setTimeout(() => {
                          setPartyStatus("Member_JPC");
                          setCertificatesList((c) => [...c, "JPC Official Party Card"]);
                          setLogMessage("✅ JPC Membership Approved!");
                        }, 60000);
                      }
                    }}
                    className="w-full py-2 bg-emerald-600 text-white font-bold rounded-lg"
                  >
                    Join JPC Ruling Party (30,000 g₦ • 60s Approval)
                  </button>
                )}
                {partyStatus === "Pending_Approval" && <div>⏳ Screening: {formatSecs(timers.p_wait)}</div>}
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div>Step 2: Nomination Form (450,000 g₦): <strong className="text-amber-400">{nominationStatus}</strong></div>
                {nominationStatus === "None" && (
                  <button
                    onClick={() => {
                      if (partyStatus !== "Member_JPC") return setLogMessage("❌ Must be an approved Party Member first!");
                      if (spendMoney(450000)) {
                        setNominationStatus("Submitted_Verified");
                        setCertificatesList((c) => [...c, `${area} Chairman Candidate Certificate`]);
                        setLogMessage("📜 Nomination Form Purchased & Verified!");
                      }
                    }}
                    className="w-full py-2 bg-amber-500 text-slate-950 font-extrabold rounded-lg"
                  >
                    Purchase Chairman Nomination Form (450,000 g₦)
                  </button>
                )}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-amber-400">📢 City Billboard Slot (75k) & Voting (5k Reward)</h2>
              <button
                onClick={() => {
                  if (spendMoney(75000)) {
                    setCityBillboardText(`🗳️ VOTE ${username.toUpperCase()} FOR ${area.toUpperCase()} CHAIRMAN (JPC) — Designed by SkyHigh Agency!`);
                    setLogMessage("📢 Your Campaign Banner is now live on the top City Billboard across Lagos!");
                  }
                }}
                className="w-full py-2.5 bg-indigo-600 text-white font-extrabold rounded-xl"
              >
                🎨 Hire Agency & Post on City Billboard Slot (75,000 g₦)
              </button>

              <button
                disabled={hasVoted}
                onClick={() => {
                  setHasVoted(true);
                  setEarnedBalance((p) => p + 5000);
                  setCitizenPoints((p) => p + 20);
                  setLogMessage("🗳️ Cast Ballot! Received +5,000 g₦ Voter Stipend!");
                }}
                className="w-full py-3 bg-emerald-500 text-slate-950 font-extrabold rounded-xl disabled:opacity-40"
              >
                {hasVoted ? "✓ Voted" : "🗳️ Cast Ballot (+5,000 g₦ Voter Reward)"}
              </button>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 7: 🏆 PROFILE ACHIEVEMENTS, MICRO BUY-IN (FROM ₦500), LOANS & P2P
           ===================================================================== */}
        {activeTab === "profile" && (
          <div className="grid md:grid-cols-3 gap-4 text-xs">
            {/* CITIZEN PROFILE & ACHIEVEMENTS LEDGER */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <h2 className="font-bold text-sm text-amber-400 flex items-center gap-1.5">
                <Award className="w-4 h-4" /> {username}'s Achievements & Certificates
              </h2>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div>🎓 Highest Education: <strong>{education}</strong></div>
                <div>💼 CV Score: <strong>{cvScore}%</strong> • Steeze: <strong>{steeze} pts</strong></div>
                <div>🏠 Residence: <strong>{shelterType} ({shelterArea})</strong></div>
                <div>🚗 Cars ({carsOwned.length}): <strong>{carsOwned.join(", ") || "None"}</strong></div>
              </div>
              <div className="font-bold text-slate-400 uppercase">Verified Certificates & Deeds ({certificatesList.length}):</div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {certificatesList.length === 0 ? (
                  <div className="text-slate-500 italic">No certificates earned yet. Complete school, blueprints, or buy properties!</div>
                ) : (
                  certificatesList.map((c, i) => (
                    <div key={i} className="p-2 bg-emerald-950/30 border border-emerald-800 rounded-lg text-emerald-300 font-bold">
                      ✓ {c}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* CENTRAL BANK MICRO BUY-IN TIERS (₦500, ₦1,000, ₦5,000, ₦10,000) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <h2 className="font-bold text-sm text-emerald-400">🏦 Central Bank (Buy-In From ₦500)</h2>
              <div className="p-2.5 bg-slate-950 border border-emerald-800/60 rounded-xl">
                <div className="text-[10px] text-slate-400">300M Genesis Reserve Remaining:</div>
                <div className="font-extrabold text-sm text-amber-400">{centralBankReserve.toLocaleString()} g₦</div>
              </div>

              {[
                { naira: 500, gameCash: 50000 },
                { naira: 1000, gameCash: 100000 },
                { naira: 5000, gameCash: 500000 },
                { naira: 10000, gameCash: 1000000 },
              ].map((tier, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (centralBankReserve < tier.gameCash) return setLogMessage("🛑 Central Bank Sold Out! Use P2P Market.");
                    setCentralBankReserve((r) => r - tier.gameCash);
                    setStarterBalance((p) => p + tier.gameCash);
                    setLogMessage(`💳 Bought ${tier.gameCash.toLocaleString()} g₦ for ₦${tier.naira.toLocaleString()}! Reserve reduced.`);
                  }}
                  className="w-full p-2 bg-slate-950 border border-amber-600/60 hover:border-amber-400 rounded-xl flex justify-between font-bold"
                >
                  <span>Buy {tier.gameCash.toLocaleString()} g₦</span>
                  <span className="text-amber-400">₦{tier.naira.toLocaleString()}</span>
                </button>
              ))}

              <button
                onClick={() => {
                  if (earnedBalance < 5000000) return setLogMessage("🔒 Minimum cashout is 5,000,000 g₦ (₦5,000) from Earned Wallet!");
                  const naira = Math.floor(earnedBalance / 1000);
                  setCentralBankReserve((r) => r + earnedBalance);
                  setEarnedBalance(0);
                  setLogMessage(`🏦 Withdrew ₦${naira.toLocaleString()} to your Bank Account!`);
                }}
                className="w-full py-2.5 bg-emerald-600 text-white font-extrabold rounded-xl"
              >
                💸 Withdraw Earned Cash (Min 5M g₦)
              </button>
            </div>

            {/* BANK LOANS & P2P EXCHANGE */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-cyan-400">💳 Bank Loans & P2P Exchange</h2>
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
                Active Bank Loan Debt: <strong className="text-rose-400">{bankLoanDebt.toLocaleString()} g₦</strong>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    if (bankLoanDebt > 0) return setLogMessage("❌ Repay your existing loan first!");
                    setBankLoanDebt(220000);
                    setStarterBalance((p) => p + 200000);
                    setLogMessage("🏦 Borrowed 200,000 g₦ Bank Loan (Repay 220,000 g₦ with 10% interest)!");
                  }}
                  className="py-2 bg-indigo-600 text-white font-bold rounded-lg"
                >
                  Borrow 200k g₦
                </button>
                <button
                  disabled={bankLoanDebt === 0}
                  onClick={() => {
                    if (spendMoney(bankLoanDebt)) {
                      setBankLoanDebt(0);
                      setCitizenPoints((p) => p + 15);
                      setLogMessage("✅ Repaid Bank Loan in full! Credit score boosted.");
                    }
                  }}
                  className="py-2 bg-emerald-600 text-white font-bold rounded-lg disabled:opacity-40"
                >
                  Repay Loan
                </button>
              </div>

              <div className="border-t border-slate-800 pt-2 space-y-2">
                <div className="font-bold text-amber-300">🤝 P2P Player Currency Market (10% Tax)</div>
                <p className="text-[10px] text-slate-400">
                  Sell excess Earned g₦ to other players or buy when Central Bank closes!
                </p>
                <button
                  onClick={() => {
                    if (earnedBalance < 100000) return setLogMessage("❌ Need at least 100,000 Earned g₦ to list on P2P!");
                    setEarnedBalance((e) => e - 100000);
                    setStarterBalance((s) => s + 110000);
                    setLogMessage("🤝 Sold 100,000 Earned g₦ on P2P Market (10% regulated spread applied)!");
                  }}
                  className="w-full py-2 bg-slate-950 border border-cyan-600 text-cyan-300 font-bold rounded-xl"
                >
                  List 100,000 Earned g₦ on P2P Market
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 7-TAB BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 inset-x-0 bg-slate-900/95 backdrop-blur border-t border-slate-800 px-2 py-2 z-40">
        <div className="max-w-4xl mx-auto grid grid-cols-7 gap-1">
          {[
            { id: "home", label: "My Home", icon: <Home className="w-4 h-4" /> },

<Map className="w-4 h-4" />
{ id: "city", label: "City Map", icon: },
            { id: "jobs", label: "Jobs/Gigs", icon: <Briefcase className="w-4 h-4" /> },
            { id: "school", label: "School/BP", icon: <GraduationCap className="w-4 h-4" /> },
            { id: "empire", label: "CAC/Estate", icon: <Building2 className="w-4 h-4" /> },
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
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="flex items-center gap-1 text-slate-300">{icon} {label}</span>
        <span className="font-bold">{value}</span>
      </div>
      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
