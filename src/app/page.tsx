"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Heart, Zap, Utensils, Sparkles, Tv, PaintBucket, 
  BedDouble, Armchair, Briefcase, GraduationCap, MapPin, 
  CheckCircle2, Play, Lock, Building2, Car, Vote, Landmark,
  Clock, Users, MessageSquare, FileCheck, Plane, ShieldAlert
} from "lucide-react";

export default function LagosEmpireFullGame() {
  // 1. ONBOARDING
  const [isCreated, setIsCreated] = useState(false);
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");

  // 2. LIVE RUNNING GAME CLOCK (Hours, Days, Weeks)
  const [gameHour, setGameHour] = useState(8); // Starts 8:00 AM
  const [gameDay, setGameDay] = useState(1);
  const [gameWeek, setGameWeek] = useState(1);

  // 3. CENTRAL BANK 300M RESERVE TRACKER & DUAL WALLETS
  const [centralBankReserve, setCentralBankReserve] = useState(300000000); // 300M Cap visibly reduces!
  const [starterBalance, setStarterBalance] = useState(50000);             // Non-withdrawable
  const [earnedBalance, setEarnedBalance] = useState(0);                   // Withdrawable (Min 5M)

  // 4. CORE PLAYER STATS
  const [area, setArea] = useState<"Oshodi" | "Berger" | "Yaba" | "Surulere" | "Lekki">("Oshodi");
  const [health, setHealth] = useState(85);
  const [energy, setEnergy] = useState(60);
  const [hunger, setHunger] = useState(75);
  const [weight, setWeight] = useState(68.0);
  const [steeze, setSteeze] = useState(5);
  const [citizenPoints, setCitizenPoints] = useState(10);

  // 5. MULTI-TIMER ENGINE (Handles simultaneous cooldowns for School, CAC, Bricklaying, Gigs, etc.)
  const [timers, setTimers] = useState<Record<string, number>>({});

  const startCooldown = (key: string, seconds: number) => {
    setTimers((prev) => ({ ...prev, [key]: seconds }));
  };

  // Master 1-Second Ticker for Game Clock & All Active Countdowns
  useEffect(() => {
    const interval = setInterval(() => {
      // Advance All Active Countdowns
      setTimers((prev) => {
        const next: Record<string, number> = {};
        for (const k in prev) {
          if (prev[k] > 1) next[k] = prev[k] - 1;
        }
        return next;
      });

      // Advance Game Clock (Every 10 real seconds = 1 in-game hour)
      setGameHour((h) => {
        if (h >= 23) {
          setGameDay((d) => {
            const nextDay = d + 1;
            if (nextDay % 7 === 0) setGameWeek((w) => w + 1);
            return nextDay;
          });
          setHustlesDoneToday(0);
          setWorkedOfficeToday(false);
          return 0;
        }
        return h + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatSecs = (s?: number) => {
    if (!s || s <= 0) return "0s";
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
  };

  // 6. DETAILED EDUCATION & STUDY ABROAD STATE (Multi-Lecture Progression!)
  const [education, setEducation] = useState("Uneducated");
  const [enrolledProgram, setEnrolledProgram] = useState<{
    id: string;
    name: string;
    totalClasses: number;
    completedClasses: number;
    deadlineDaysLeft: number;
  } | null>(null);
  const [hasAbroadVisa, setHasAbroadVisa] = useState<"None" | "Processing" | "Approved">("None");
  const [ownedBlueprints, setOwnedBlueprints] = useState<string[]>([]);
  const [cvScore, setCvScore] = useState(0);
  const [outfit, setOutfit] = useState("Singlet & Bathroom Slippers");
  const [hasCorporateSuit, setHasCorporateSuit] = useState(false);

  // 7. HUSTLES, CORPORATE JOBS & SOCIAL GIGS (With Cooldowns!)
  const [hustlesDoneToday, setHustlesDoneToday] = useState(0);
  const [employedJob, setEmployedJob] = useState<{
    title: string;
    company: string;
    area: "Oshodi" | "Berger" | "Yaba" | "Surulere" | "Lekki";
    payPer3Days: number;
  } | null>(null);
  const [daysWorkedThisCycle, setDaysWorkedThisCycle] = useState(0);
  const [workedOfficeToday, setWorkedOfficeToday] = useState(false);
  const [gigProofInputs, setGigProofInputs] = useState<Record<string, string>>({});

  // 8. 2D ROOM, AREA REAL ESTATE & FULL CAR GARAGE
  const [shelterType, setShelterType] = useState("Unpainted Single Room");
  const [shelterArea, setShelterArea] = useState<"Oshodi" | "Berger" | "Yaba" | "Surulere" | "Lekki">("Oshodi");
  const [parkingSlots, setParkingSlots] = useState(0);
  const [wallColor, setWallColor] = useState("Unplastered");
  const [bedTier, setBedTier] = useState("Bare_Floor");
  const [chairTier, setChairTier] = useState("None");
  const [tvTier, setTvTier] = useState("None");
  const [hasLagosFlix, setHasLagosFlix] = useState(false);
  const [showTvModal, setShowTvModal] = useState(false);
  const [carsOwned, setCarsOwned] = useState<string[]>([]);

  // 9. CAC APPROVAL, C-of-O LAND & COMMERCIAL BUILDINGS
  const [companyName, setCompanyName] = useState("");
  const [cacStatus, setCacStatus] = useState<"None" | "Processing" | "Approved">("None");
  const [cofoStatus, setCofoStatus] = useState<"None" | "Processing" | "Approved">("None");
  const [ownedBuildings, setOwnedBuildings] = useState<string[]>([]);
  const [companyValuation, setCompanyValuation] = useState(0);
  const [farmStatus, setFarmStatus] = useState<"None" | "Growing" | "Ready_To_Harvest" | "Rotten">("None");

  // 10. STEP-BY-STEP POLITICS (Join Party -> Approval -> Buy Form -> Submit -> Shuffle -> Vote)
  const [partyStatus, setPartyStatus] = useState<"None" | "Pending_Approval" | "Member_JPC" | "Member_JSTD">("None");
  const [nominationStatus, setNominationStatus] = useState<"None" | "Form_Purchased" | "Submitted_Verified">("None");
  const [shuffledFinalists, setShuffledFinalists] = useState<string[]>([
    "Chief Balogun (JPC)", "Engr. Tunde (JPC)", "Madam Kemi (JSTD)"
  ]);
  const [hasPosterLive, setHasPosterLive] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  // 11. COURTSHIP, COUPLE BOND & CITIZEN SOCIAL FEED
  const [maritalStatus, setMaritalStatus] = useState<"Single" | "Courting" | "Married">("Single");
  const [partnerName, setPartnerName] = useState("None");
  const [relationshipBond, setRelationshipBond] = useState(0); // Must hit 100% to marry!
  const [socialPostInput, setSocialPostInput] = useState("");
  const [socialFeed, setSocialFeed] = useState<{ author: string; text: string; time: string }[]>([
    { author: "@tunde_lekki", text: "Just secured my Land C-of-O in Lekki! Looking for a certified Architect.", time: "2h ago" },
    { author: "@chisom_yaba", text: "Completed my 8/8 ND Polytechnic lectures today! Who is hiring in Yaba?", time: "1h ago" },
  ]);

  const [activeTab, setActiveTab] = useState<"room" | "hustle" | "school" | "empire" | "politics" | "lifestyle">("room");
  const [logMessage, setLogMessage] = useState(
    "Welcome to Lagos! Time is ticking in the top bar. Enroll in classes, respect cooldown timers, and build from scratch."
  );

  // HELPER: Spend Money
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

  if (!isCreated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
          <div className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full mb-3">
            LAGOS EMPIRE — FULL REALISM ENGINE
          </div>
          <h1 className="text-2xl font-extrabold mb-2">Start Your Life From Scratch</h1>
          <p className="text-slate-400 text-sm mb-6">
            Begin uneducated in an unpainted single room in Oshodi with a 50,000 g₦ survival stipend. Attend multi-lecture semesters, wait for CAC & C-of-O approvals, court a partner, and compete for office.
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
            Enter Lagos (Start Week 1, Day 1)
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
      {/* TOP HEADER WITH LIVE RUNNING CLOCK & CENTRAL BANK RESERVE */}
      <header className="bg-slate-900/95 backdrop-blur border-b border-slate-800 sticky top-0 z-30 px-4 py-3">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-xl">
              {gender === "male" ? "👨🏾" : "👩🏾"}
            </div>
            <div>
              <div className="font-bold text-sm flex flex-wrap items-center gap-1.5">
                {username}
                {/* LIVE RUNNING CLOCK */}
                <span className="text-[11px] px-2.5 py-0.5 bg-amber-500 text-slate-950 font-extrabold rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Wk {gameWeek} • Day {gameDay} • {String(gameHour).padStart(2, "0")}:00
                </span>
                <span className="text-[11px] px-2 py-0.5 bg-slate-800 rounded-full text-amber-400">{education}</span>
                <span className="text-[11px] px-2 py-0.5 bg-rose-950 text-rose-300 border border-rose-700 rounded-full">
                  {maritalStatus} {partnerName !== "None" && `with ${partnerName}`}
                </span>
              </div>
              <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2 mt-0.5">
                <span className="text-emerald-400 font-semibold">📍 Currently in: {area}</span>
                • 🏠 Home: {shelterType} ({shelterArea}) • 🅿️ Parking: {carsOwned.length}/{parkingSlots}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
              <div className="text-[10px] text-slate-400 uppercase">Starter/Deposit (Game Only)</div>
              <div className="font-extrabold text-sm text-amber-400">{starterBalance.toLocaleString()} g₦</div>
            </div>
            <div className="bg-slate-950 border border-emerald-900/60 rounded-xl px-3 py-1.5">
              <div className="text-[10px] text-emerald-400 uppercase flex items-center gap-1">
                Withdrawable Wallet <Lock className="w-2.5 h-2.5" />
              </div>
              <div className="font-extrabold text-sm text-emerald-400">{earnedBalance.toLocaleString()} g₦</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-4">
        {/* LIVE STATS BAR */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-900 border border-slate-800 rounded-2xl p-3">
          <StatBar icon={<Heart className="w-4 h-4 text-rose-400" />} label="Health" value={`${health}%`} pct={health} color="bg-rose-500" />
          <StatBar icon={<Zap className="w-4 h-4 text-amber-400" />} label="Energy" value={`${energy}%`} pct={energy} color="bg-amber-500" />
          <StatBar icon={<Utensils className="w-4 h-4 text-orange-400" />} label="Belly/Diet" value={`${hunger}%`} pct={hunger} color="bg-orange-500" />
          <StatBar icon={<Sparkles className="w-4 h-4 text-cyan-400" />} label="Steeze" value={`${steeze} pts`} pct={Math.min(100, steeze)} color="bg-cyan-500" />
          <div className="bg-slate-950 rounded-xl p-2 flex flex-col justify-center">
            <span className="text-[10px] text-slate-400 uppercase">Weight • CV • Blueprints</span>
            <span className="text-xs font-bold text-white">{weight}kg • CV:{cvScore}% • 📘{ownedBlueprints.length}/5</span>
          </div>
        </div>

        {/* EVENT LOG */}
        <div className="bg-emerald-950/40 border border-emerald-800/60 text-emerald-200 px-4 py-2.5 rounded-xl text-sm font-medium">
          🔔 {logMessage}
        </div>

        {/* CITY BUS STOP & COMMUTE BAR (5 AREAS) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-extrabold text-emerald-400 uppercase">
            🚌 Commute Across Lagos {timers.commute ? `(Traveling: ${formatSecs(timers.commute)})` : `(In ${area})`}:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {(["Oshodi", "Berger", "Yaba", "Surulere", "Lekki"] as const).map((dest) => (
              <div key={dest} className="flex items-center gap-1 bg-slate-950 border border-slate-800 px-2 py-1 rounded-xl">
                <span className="font-bold text-white">{dest}:</span>
                <button
                  disabled={!!timers.commute || area === dest}
                  onClick={() => {
                    if (energy < 20) return setLogMessage("⚠️ Too tired to trek!");
                    startCooldown("commute", 10);
                    setLogMessage(`🚶🏾‍♂️ Trekking to ${dest} (10s)...`);
                    setTimeout(() => {
                      setArea(dest);
                      setEnergy((p) => Math.max(0, p - 20));
                      setWeight((p) => Number(Math.max(50, p - 0.4).toFixed(1)));
                      setLogMessage(`🚶🏾‍♂️ Arrived in ${dest} on foot! (-20% Energy, -0.4kg)`);
                    }, 10000);
                  }}
                  className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-[10px] disabled:opacity-40"
                >
                  Trek
                </button>
                <button
                  disabled={!!timers.commute || area === dest}
                  onClick={() => {
                    if (!spendMoney(2500)) return;
                    startCooldown("commute", 4);
                    setLogMessage(`🚕 Taking cab to ${dest} (4s)...`);
                    setTimeout(() => {
                      setArea(dest);
                      setLogMessage(`🚕 Arrived in ${dest} by Cab!`);
                    }, 4000);
                  }}
                  className="px-1.5 py-0.5 bg-indigo-700 text-white rounded text-[10px] disabled:opacity-40"
                >
                  Cab (2.5k)
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* =====================================================================
            TAB 1: 2D ROOM, APPLIANCES & TIMED EATERY COOLDOWN
           ===================================================================== */}
        {activeTab === "room" && (
          <div className="grid md:grid-cols-3 gap-4">
            <div className={`md:col-span-2 rounded-2xl border-2 p-6 relative min-h-[360px] flex flex-col justify-between transition-all ${wallBgMap[wallColor]}`}>
              <div className="flex justify-between items-start gap-2">
                <div className="space-y-1">
                  <span className="bg-black/60 px-3 py-1 rounded-lg text-xs font-semibold block">
                    🏠 {shelterType} in {shelterArea} ({parkingSlots} Parking Slots)
                  </span>
                  <span className="bg-black/60 px-3 py-1 rounded-lg text-xs text-amber-300 block">
                    🧱 Wall: {wallColor} • 👔 Outfit: {outfit}
                  </span>
                </div>

                <div>
                  {tvTier === "None" ? (
                    <div className="border border-dashed border-white/20 rounded-xl px-4 py-3 text-xs text-white/40">
                      No TV Mounted
                    </div>
                  ) : (
                    <div className="bg-slate-950 border-2 border-slate-700 rounded-xl p-3 text-center">
                      <Tv className="w-7 h-7 text-cyan-400 mx-auto mb-1" />
                      <div className="text-xs font-bold">{tvTier}</div>
                      <button
                        onClick={() => {
                          if (!hasLagosFlix) return setLogMessage("⚠️ Subscribe to LagosFlix (12,500 g₦) first!");
                          setShowTvModal(true);
                          setEnergy((p) => Math.min(100, p + 15));
                        }}
                        className="mt-2 px-3 py-1 bg-rose-600 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 mx-auto"
                      >
                        <Play className="w-3 h-3" /> Watch LagosFlix
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/10">
                <div className="bg-black/45 rounded-xl p-3.5 flex items-center gap-3">
                  <BedDouble className="w-7 h-7 text-amber-400 shrink-0" />
                  <div>
                    <div className="text-[11px] text-slate-300">Bed Tier</div>
                    <div className="font-bold text-xs">{bedTier.replace("_", " ")}</div>
                  </div>
                </div>
                <div className="bg-black/45 rounded-xl p-3.5 flex items-center gap-3">
                  <Armchair className="w-7 h-7 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-[11px] text-slate-300">Seating Tier</div>
                    <div className="font-bold text-xs">{chairTier.replace("_", " ")}</div>
                  </div>
                </div>
              </div>

              {/* EATERY MEALS WITH DIGESTION COOLDOWN TIMER */}
              <div className="mt-4 pt-4 border-t border-white/10 bg-black/40 p-3 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-amber-300">🍽️ Eatery & Feeding (Requires Digestion Cooldown):</span>
                  {timers.eat_cooldown && (
                    <span className="bg-rose-600 text-white px-2 py-0.5 rounded font-bold">
                      ⏳ Next Meal In: {formatSecs(timers.eat_cooldown)}
                    </span>
                  )}
                </div>
                <div className="grid sm:grid-cols-3 gap-2">
                  {[
                    { name: "Agege Bread & Garri", cost: 1500, en: 15, wt: 0.8, hp: -2, cd: 20 },
                    { name: "Mama Put Amala & Ewedu", cost: 3500, en: 25, wt: 0.3, hp: 5, cd: 25 },
                    { name: "Eatery Jollof, Fish & Salad", cost: 6500, en: 40, wt: -0.3, hp: 12, cd: 30 },
                  ].map((m, i) => (
                    <button
                      key={i}
                      disabled={!!timers.eat_cooldown}
                      onClick={() => {
                        if (!spendMoney(m.cost)) return;
                        startCooldown("eat_cooldown", m.cd);
                        setHunger((p) => Math.min(100, p + 35));
                        setEnergy((p) => Math.min(100, p + m.en));
                        setWeight((p) => Number((p + m.wt).toFixed(1)));
                        setHealth((p) => Math.min(100, Math.max(20, p + m.hp)));
                        setLogMessage(`🍲 Ate ${m.name}! Digestion cooldown active for ${m.cd}s.`);
                      }}
                      className="p-2 bg-slate-950/90 border border-slate-700 rounded-lg text-xs text-left disabled:opacity-40"
                    >
                      <div className="font-bold">{m.name}</div>
                      <div className="text-[10px] text-emerald-400">{m.cost.toLocaleString()} g₦ • +{m.en}% Energy</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5 text-xs">
              <h2 className="font-bold text-sm">Sleep & Room Upgrades</h2>
              <button
                disabled={!!timers.sleep_cd}
                onClick={() => {
                  const maxCap = bedTier === "Bare_Floor" ? 60 : bedTier === "Foam_Mattress" ? 85 : 100;
                  startCooldown("sleep_cd", 15);
                  setEnergy(maxCap);
                  setGameDay((d) => d + 1);
                  setHustlesDoneToday(0);
                  setWorkedOfficeToday(false);
                  setLogMessage(`🛌 Slept overnight! Energy restored to ${maxCap}%. Advanced to Next Day!`);
                }}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-extrabold text-white disabled:opacity-40"
              >
                {timers.sleep_cd ? `⏳ Sleeping (${formatSecs(timers.sleep_cd)})` : "🛌 Sleep Overnight (Next Day)"}
              </button>

              <div className="font-semibold text-slate-400 uppercase pt-1">DIY Paint Walls</div>
              <div className="grid grid-cols-3 gap-1.5">
                {(["Cream", "Emerald", "RoyalBlue"] as const).map((col) => (
                  <button
                    key={col}
                    disabled={wallColor === col}
                    onClick={() => {
                      if (spendMoney(20000)) {
                        setWallColor(col);
                        setSteeze((p) => p + 10);
                        setLogMessage(`🎨 Painted walls ${col}!`);
                      }
                    }}
                    className="p-2 bg-slate-950 border border-slate-800 rounded-lg disabled:opacity-40"
                  >
                    {wallColor === col ? `✓ ${col}` : `${col} (20k)`}
                  </button>
                ))}
              </div>

              <button
                disabled={bedTier !== "Bare_Floor"}
                onClick={() => { if (spendMoney(25000)) { setBedTier("Foam_Mattress"); setEnergy(85); setLogMessage("🛏️ Bought Foam Mattress!"); }}}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between disabled:opacity-40"
              >
                <span>{bedTier === "Bare_Floor" ? "Buy Foam Mattress (85% Cap)" : `✓ ${bedTier}`}</span>
                <span className="text-amber-400 font-bold">25,000 g₦</span>
              </button>

              <button
                disabled={chairTier !== "None"}
                onClick={() => { if (spendMoney(35000)) { setChairTier("Cushion_Sofa"); setSteeze((p) => p + 10); setLogMessage("🛋️ Bought Cushion Sofa!"); }}}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between disabled:opacity-40"
              >
                <span>{chairTier === "None" ? "Buy Cushion Sofa Set" : "✓ Cushion Sofa"}</span>
                <span className="text-amber-400 font-bold">35,000 g₦</span>
              </button>

              <button
                disabled={tvTier !== "None"}
                onClick={() => { if (spendMoney(60000)) { setTvTier("55-Inch Smart TV"); setSteeze((p) => p + 20); setLogMessage("📺 Bought Smart TV!"); }}}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between disabled:opacity-40"
              >
                <span>{tvTier === "None" ? "Buy 55-Inch Smart TV" : "✓ Smart TV"}</span>
                <span className="text-amber-400 font-bold">60,000 g₦</span>
              </button>

              <button
                disabled={hasLagosFlix}
                onClick={() => { if (spendMoney(12500)) { setHasLagosFlix(true); setLogMessage("🍿 LagosFlix Active!"); }}}
                className="w-full p-2.5 bg-rose-950/50 border border-rose-800 rounded-xl flex justify-between disabled:opacity-40"
              >
                <span>{hasLagosFlix ? "✓ LagosFlix Subscribed" : "Subscribe LagosFlix"}</span>
                <span className="text-rose-400 font-bold">12,500 g₦</span>
              </button>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 2: HUSTLE COOLDOWNS, CORPORATE PAYDAYS & 4-HOUR SOCIAL GIG TIMERS
           ===================================================================== */}
        {activeTab === "hustle" && (
          <div className="grid md:grid-cols-3 gap-4 text-xs">
            {/* BRICKLAYER & CATERING WITH MANDATORY COOLDOWN TIMERS */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-sm text-amber-400">🧱 Street Hustles (Capped)</h2>
                <span className="px-2 py-0.5 bg-amber-950 text-amber-300 rounded-full font-bold">
                  {hustlesDoneToday}/2 Today
                </span>
              </div>
              <p className="text-slate-400">
                Max 2 shifts/day. Each shift triggers a mandatory physical recovery cooldown before you can work again!
              </p>

              {[
                { id: "brick", name: "🧱 Bricklayer (Lekki Site)", pay: 8000, cd: 45 },
                { id: "cater", name: "🍽️ Owambe Catering & Plates", pay: 6500, cd: 40 },
              ].map((h) => {
                const cdLeft = timers[`hustle_${h.id}`];
                return (
                  <div key={h.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex justify-between font-bold">
                      <span>{h.name}</span>
                      <span className="text-emerald-400">+{h.pay.toLocaleString()} g₦</span>
                    </div>
                    <button
                      disabled={!!cdLeft || hustlesDoneToday >= 2}
                      onClick={() => {
                        if (energy < 30) return setLogMessage("⚠️ Need 30% Energy!");
                        startCooldown(`hustle_${h.id}`, h.cd);
                        setHustlesDoneToday((p) => p + 1);
                        setEnergy((p) => Math.max(0, p - 30));
                        const actualPay = health < 60 ? Math.floor(h.pay * 0.65) : h.pay;
                        setEarnedBalance((p) => p + actualPay);
                        setLogMessage(
                          health < 60
                            ? `⚠️ Low health! Broke blocks/plates. Paid ${actualPay.toLocaleString()} g₦. Cooldown: ${h.cd}s.`
                            : `✅ Shift complete! +${actualPay.toLocaleString()} g₦. Cooldown locked for ${h.cd}s.`
                        );
                      }}
                      className="w-full py-2 bg-amber-500 text-slate-950 font-extrabold rounded-lg disabled:opacity-40"
                    >
                      {cdLeft ? `⏳ Cooldown: ${formatSecs(cdLeft)}` : hustlesDoneToday >= 2 ? "🛑 Daily Limit Reached (2/2)" : "Start Shift (-30% Energy)"}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* CORPORATE JOBS (CHOOSE EMPLOYER + DAILY OFFICE CLOCK-IN + 3-DAY PAYROLL) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-cyan-400">🏢 Corporate Employment</h2>
              {employedJob ? (
                <div className="p-3 bg-cyan-950/30 border border-cyan-700 rounded-xl space-y-2.5">
                  <div className="font-extrabold text-sm text-white">{employedJob.title}</div>
                  <div className="text-cyan-300">Company: {employedJob.company} (📍 {employedJob.area})</div>
                  <div className="text-emerald-400 font-bold">Salary: {employedJob.payPer3Days.toLocaleString()} g₦ every 3 Days</div>
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                    Days Worked This Cycle: <strong>{daysWorkedThisCycle} / 3 Days</strong>
                  </div>
                  <button
                    disabled={workedOfficeToday || !!timers.office_shift}
                    onClick={() => {
                      if (area !== employedJob.area) return setLogMessage(`🚇 Commute to ${employedJob.area} first!`);
                      if (energy < 30) return setLogMessage("⚠️ Need 30% Energy!");
                      startCooldown("office_shift", 15);
                      setWorkedOfficeToday(true);
                      setEnergy((p) => Math.max(0, p - 30));
                      const nextD = daysWorkedThisCycle + 1;
                      if (nextD >= 3) {
                        setDaysWorkedThisCycle(0);
                        setEarnedBalance((p) => p + employedJob.payPer3Days);
                        setLogMessage(`💰 3-DAY PAYROLL RELEASED! +${employedJob.payPer3Days.toLocaleString()} g₦ paid!`);
                      } else {
                        setDaysWorkedThisCycle(nextD);
                        setLogMessage(`🏢 Worked day ${nextD}/3 at ${employedJob.company}!`);
                      }
                    }}
                    className="w-full py-2.5 bg-cyan-500 text-slate-950 font-extrabold rounded-xl disabled:opacity-40"
                  >
                    {timers.office_shift
                      ? `⏳ Working in Office (${formatSecs(timers.office_shift)})`
                      : workedOfficeToday
                      ? "✓ Done for Today (Wait for Tomorrow)"
                      : `🏢 Clock In at ${employedJob.area} Office`}
                  </button>
                  <button onClick={() => setEmployedJob(null)} className="w-full py-1 text-slate-400 underline">
                    Resign from Job
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {[
                    { title: "IT Technician", company: "Yaba Tech Hub", area: "Yaba" as const, reqEdu: "Polytechnic ND", reqCv: 25, pay: 50000 },
                    { title: "Operations Officer", company: "Berger Logistics", area: "Berger" as const, reqEdu: "Polytechnic HND", reqCv: 60, pay: 95000 },
                    { title: "Investment Banker", company: "ZenithMarina PLC", area: "Lekki" as const, reqEdu: "University B.Sc", reqCv: 85, pay: 185000 },
                    { title: "Expat Oil Director", company: "TotalEnergies VI", area: "Lekki" as const, reqEdu: "Masters Abroad (M.Sc)", reqCv: 95, pay: 420000 },
                  ].map((j, i) => (
                    <div key={i} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                      <div>
                        <div className="font-bold text-white">{j.title} — {j.company}</div>
                        <div className="text-[10px] text-slate-400">
                          📍 {j.area} • Req: {j.reqEdu} & CV {j.reqCv}% • {j.pay.toLocaleString()} g₦ / 3d
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (education !== j.reqEdu && education !== "Masters Abroad (M.Sc)") {
                            return setLogMessage(`❌ You need ${j.reqEdu} to apply here! (Current: ${education})`);
                          }
                          if (cvScore < j.reqCv) return setLogMessage(`❌ Requires CV Score ${j.reqCv}%+!`);
                          if (j.reqCv >= 85 && !hasCorporateSuit) return setLogMessage("❌ Buy Corporate Suit first!");
                          setEmployedJob({ title: j.title, company: j.company, area: j.area, payPer3Days: j.pay });
                          setLogMessage(`🎉 Hired at ${j.company}! Commute to ${j.area} daily.`);
                        }}
                        className="px-3 py-1.5 bg-cyan-600 text-white font-bold rounded-lg"
                      >
                        Apply
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SOCIAL GIGS WITH 3-TO-5 HOUR BATCH COOLDOWN TIMER */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-emerald-400">📱 Social Gigs (Timed Batches)</h2>
              <p className="text-[11px] text-slate-400">
                Once claimed, each campaign locks for a 3–4 Hour refresh countdown until a new advertiser batch drops!
              </p>
              {[
                { id: "gig1", title: "Follow JPC Official on X", reward: 2500, cooldownSec: 180 },
                { id: "gig2", title: "Follow Lagos Dev on LinkedIn", reward: 4000, cooldownSec: 240 },
                { id: "gig3", title: "Test Partner Web App & Review", reward: 12000, cooldownSec: 300 },
              ].map((g) => {
                const cd = timers[g.id];
                return (
                  <div key={g.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex justify-between font-bold">
                      <span>{g.title}</span>
                      <span className="text-emerald-400">+{g.reward.toLocaleString()} g₦</span>
                    </div>
                    {cd ? (
                      <div className="py-1.5 px-2 bg-amber-950/60 border border-amber-700 text-amber-300 rounded-lg font-bold text-center">
                        ⏳ Next Advertiser Batch In: {formatSecs(cd)}
                      </div>
                    ) : (
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          placeholder="Your @username proof..."
                          value={gigProofInputs[g.id] || ""}
                          onChange={(e) => setGigProofInputs((p) => ({ ...p, [g.id]: e.target.value }))}
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white"
                        />
                        <button
                          onClick={() => {
                            if (!gigProofInputs[g.id]?.trim()) return setLogMessage("⚠️ Enter your @handle proof first!");
                            startCooldown(g.id, g.cooldownSec);
                            setEarnedBalance((p) => p + g.reward);
                            setLogMessage(`✅ Gig Verified! +${g.reward.toLocaleString()} g₦ paid. Locked for next batch (${formatSecs(g.cooldownSec)}).`);
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
            TAB 3: ND -> HND -> B.Sc -> STUDY ABROAD (MULTI-LECTURE & DEADLINES!)
           ===================================================================== */}
        {activeTab === "school" && (
          <div className="grid md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-amber-400">🎓 Multi-Lecture Academic Pipeline</h2>
              <p className="text-[11px] text-slate-400">
                Degrees are NOT instant! Enroll first, then attend every required lecture class before your semester deadline expires.
              </p>

              {/* ACTIVE ENROLLED DEGREE TRACKER */}
              {enrolledProgram ? (
                <div className="p-3 bg-indigo-950/50 border border-indigo-600 rounded-xl space-y-2.5">
                  <div className="font-extrabold text-sm text-white">📚 Studying: {enrolledProgram.name}</div>
                  <div className="text-amber-300 font-bold">
                    Classes Attended: {enrolledProgram.completedClasses} / {enrolledProgram.totalClasses} Lectures
                  </div>
                  <div className="text-[11px] text-rose-300">
                    ⏳ Must complete within: {enrolledProgram.deadlineDaysLeft} In-Game Days
                  </div>
                  <button
                    disabled={!!timers.lecture_cd}
                    onClick={() => {
                      if (energy < 20) return setLogMessage("⚠️ Too tired for class! Eat or sleep.");
                      startCooldown("lecture_cd", 15);
                      setEnergy((p) => Math.max(0, p - 20));
                      const nextCount = enrolledProgram.completedClasses + 1;
                      if (nextCount >= enrolledProgram.totalClasses) {
                        setEducation(enrolledProgram.name);
                        setEnrolledProgram(null);
                        setSteeze((p) => p + 30);
                        setLogMessage(`🎓 GRADUATED! You completed all ${enrolledProgram.totalClasses} lectures and earned your ${enrolledProgram.name}!`);
                      } else {
                        setEnrolledProgram({ ...enrolledProgram, completedClasses: nextCount });
                        setLogMessage(`📖 Lecture ${nextCount}/${enrolledProgram.totalClasses} completed! Next class unlocks after cooldown.`);
                      }
                    }}
                    className="w-full py-2.5 bg-emerald-500 text-slate-950 font-extrabold rounded-xl disabled:opacity-40"
                  >
                    {timers.lecture_cd
                      ? `⏳ In Lecture Hall (${formatSecs(timers.lecture_cd)})`
                      : `Attend Lecture #${enrolledProgram.completedClasses + 1} (-20% Energy)`}
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* 1. POLYTECHNIC ND */}
                  <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <div className="flex justify-between font-bold">
                      <span>1. Polytechnic ND (2 Wks • 6 Lectures)</span>
                      <span className="text-amber-400">180,000 g₦</span>
                    </div>
                    <button
                      onClick={() => {
                        if (spendMoney(180000)) {
                          setEnrolledProgram({ id: "ND", name: "Polytechnic ND", totalClasses: 6, completedClasses: 0, deadlineDaysLeft: 14 });
                          setLogMessage("🎓 Enrolled in Polytechnic ND! Attend 6 lectures within 14 days.");
                        }
                      }}
                      className="w-full py-1.5 bg-indigo-600 text-white font-bold rounded-lg"
                    >
                      Enroll in ND (6 Lectures Required)
                    </button>
                  </div>

                  {/* 2. POLYTECHNIC HND */}
                  <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <div className="flex justify-between font-bold">
                      <span>2. Polytechnic HND (2 Wks • 6 Lectures)</span>
                      <span className="text-amber-400">240,000 g₦</span>
                    </div>
                    <button
                      onClick={() => {
                        if (education !== "Polytechnic ND") return setLogMessage("❌ You must complete Polytechnic ND before enrolling in HND!");
                        if (spendMoney(240000)) {
                          setEnrolledProgram({ id: "HND", name: "Polytechnic HND", totalClasses: 6, completedClasses: 0, deadlineDaysLeft: 14 });
                          setLogMessage("🎓 Enrolled in Polytechnic HND!");
                        }
                      }}
                      className="w-full py-1.5 bg-indigo-600 text-white font-bold rounded-lg"
                    >
                      Enroll in HND (Requires ND First)
                    </button>
                  </div>

                  {/* 3. UNIVERSITY B.Sc */}
                  <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <div className="flex justify-between font-bold">
                      <span>3. University B.Sc (4 Wks • 10 Lectures)</span>
                      <span className="text-amber-400">450,000 g₦</span>
                    </div>
                    <button
                      onClick={() => {
                        if (spendMoney(450000)) {
                          setEnrolledProgram({ id: "BSC", name: "University B.Sc", totalClasses: 10, completedClasses: 0, deadlineDaysLeft: 28 });
                          setLogMessage("🎓 Enrolled in University B.Sc! Complete 10 lectures within 28 days.");
                        }
                      }}
                      className="w-full py-1.5 bg-indigo-600 text-white font-bold rounded-lg"
                    >
                      Enroll in University B.Sc (10 Lectures)
                    </button>
                  </div>

                  {/* 4. STUDY ABROAD M.Sc (Requires Student Visa Countdown!) */}
                  <div className="p-2.5 bg-amber-950/30 border border-amber-700 rounded-xl space-y-1.5">
                    <div className="flex justify-between font-bold text-amber-300">
                      <span>✈️ 4. Study Abroad M.Sc (UK/Canada)</span>
                      <span>1,200,000 g₦</span>
                    </div>
                    {hasAbroadVisa === "None" && (
                      <button
                        onClick={() => {
                          if (education !== "University B.Sc" && education !== "Polytechnic HND") {
                            return setLogMessage("❌ Embassy requires a B.Sc or HND before applying for a Study Abroad Visa!");
                          }
                          if (spendMoney(150000)) {
                            setHasAbroadVisa("Processing");
                            startCooldown("visa_wait", 25);
                            setLogMessage("🛂 Student Visa submitted to Embassy! Processing takes 25s...");
                            setTimeout(() => {
                              setHasAbroadVisa("Approved");
                              setLogMessage("✈️ EMBASSY APPROVED YOUR STUDENT VISA! You can now enroll in Masters Abroad.");
                            }, 25000);
                          }
                        }}
                        className="w-full py-1.5 bg-amber-500 text-slate-950 font-extrabold rounded-lg"
                      >
                        Step 1: Apply for Student Visa (150k g₦)
                      </button>
                    )}
                    {hasAbroadVisa === "Processing" && (
                      <div className="text-center py-1 text-amber-400 font-bold">
                        ⏳ Embassy Visa Processing: {formatSecs(timers.visa_wait)}
                      </div>
                    )}
                    {hasAbroadVisa === "Approved" && (
                      <button
                        onClick={() => {
                          if (spendMoney(1200000)) {
                            setEnrolledProgram({ id: "MSC", name: "Masters Abroad (M.Sc)", totalClasses: 8, completedClasses: 0, deadlineDaysLeft: 21 });
                            setLogMessage("✈️ Flew abroad & enrolled in M.Sc! Complete 8 international seminars.");
                          }
                        }}
                        className="w-full py-1.5 bg-emerald-500 text-slate-950 font-extrabold rounded-lg"
                      >
                        Step 2: Fly Abroad & Start M.Sc (8 Classes)
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 5 BUSINESS BLUEPRINTS WITH STUDY TIMERS */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <h2 className="font-bold text-sm text-emerald-400">📘 24h Business Course Blueprints</h2>
              {[
                { id: "Eatery", name: "🍲 Eatery & Jollof Culinary Blueprint", cost: 50000 },
                { id: "Farming", name: "🌾 Commercial Farming Blueprint", cost: 65000 },
                { id: "Architecture", name: "📐 Architectural & Construction Blueprint", cost: 120000 },
                { id: "Digital_Agency", name: "🎨 Digital & Poster Design Blueprint", cost: 85000 },
                { id: "Private_School", name: "🏫 Private Polytechnic Owner Blueprint", cost: 200000 },
              ].map((bp) => {
                const isOwned = ownedBlueprints.includes(bp.id);
                const cd = timers[`bp_${bp.id}`];
                return (
                  <button
                    key={bp.id}
                    disabled={isOwned || !!cd}
                    onClick={() => {
                      if (spendMoney(bp.cost)) {
                        startCooldown(`bp_${bp.id}`, 15);
                        setLogMessage(`📘 Studying ${bp.name} (15s)...`);
                        setTimeout(() => {
                          setOwnedBlueprints((p) => [...p, bp.id]);
                          setLogMessage(`✅ Certified in ${bp.name}!`);
                        }, 15000);
                      }
                    }}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center disabled:opacity-40"
                  >
                    <span className="font-bold text-left">
                      {cd ? `⏳ Studying (${formatSecs(cd)})` : isOwned ? `✓ Certified: ${bp.id}` : bp.name}
                    </span>
                    <span className="text-emerald-400 font-bold">{bp.cost.toLocaleString()} g₦</span>
                  </button>
                );
              })}
            </div>

            {/* CV AGENCY & WARDROBE */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-cyan-400">📄 CV Agency & Boutique</h2>
              <button onClick={() => { setCvScore(25); setLogMessage("📝 Drafted unstructured DIY CV (25%)."); }} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between font-bold">
                <span>DIY Unstructured CV</span><span className="text-slate-400">FREE (25%)</span>
              </button>
              <button
                disabled={!!timers.cv_wait}
                onClick={() => {
                  if (spendMoney(35000)) {
                    startCooldown("cv_wait", 12);
                    setTimeout(() => {
                      setCvScore(95);
                      setLogMessage("💼 Pro CV Agency delivered your 95% Executive CV!");
                    }, 12000);
                  }
                }}
                className="w-full p-3 bg-emerald-950/40 border border-emerald-700 rounded-xl flex justify-between font-bold"
              >
                <span>{timers.cv_wait ? `⏳ Agency Writing CV (${formatSecs(timers.cv_wait)})` : "Hire Pro CV Agency"}</span>
                <span className="text-emerald-400">35,000 g₦ (95%)</span>
              </button>

              <div className="pt-2 font-bold text-slate-400 uppercase">Wardrobe Boutique</div>
              <button
                disabled={hasCorporateSuit}
                onClick={() => {
                  if (spendMoney(45000)) {
                    setOutfit("Tailored Corporate Suit & Italian Shoes");
                    setHasCorporateSuit(true);
                    setSteeze((p) => p + 35);
                    setLogMessage("👔 Bought Tailored Corporate Suit!");
                  }
                }}
                className="w-full p-3 bg-amber-950/40 border border-amber-700 rounded-xl flex justify-between font-bold disabled:opacity-40"
              >
                <span>{hasCorporateSuit ? "✓ Corporate Suit Owned" : "👔 Tailored Corporate Suit"}</span>
                <span className="text-amber-400">45,000 g₦</span>
              </button>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 4: CAC + C-OF-O COUNTDOWNS, 6 BUILDINGS, 5 AREAS & 7 CARS!
           ===================================================================== */}
        {activeTab === "empire" && (
          <div className="grid md:grid-cols-3 gap-4 text-xs">
            {/* COLUMN 1: CAC, LAND C-OF-O (WITH COUNTDOWN) & COMMERCIAL BUILDINGS */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-amber-400">🏛️ CAC, C-of-O & Commercial Buildings</h2>

              {/* STEP 1: CAC */}
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="font-bold text-white">1. CAC Corporate Certificate: <span className="text-emerald-400">{cacStatus}</span></div>
                {cacStatus === "None" && (
                  <>
                    <input
                      type="text"
                      placeholder="Company Name (e.g. Oreva Holdings)"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                    />
                    <button
                      onClick={() => {
                        if (!companyName.trim()) return setLogMessage("⚠️ Enter Company Name!");
                        if (spendMoney(450000)) {
                          setCacStatus("Processing");
                          startCooldown("cac_wait", 20);
                          setLogMessage("🏛️ CAC Registration submitted! Government approval takes 20s...");
                          setTimeout(() => {
                            setCacStatus("Approved");
                            setCompanyValuation(150000000);
                            setLogMessage(`✅ CAC Certificate Issued for ${companyName}!`);
                          }, 20000);
                        }
                      }}
                      className="w-full py-2 bg-amber-500 text-slate-950 font-extrabold rounded-lg"
                    >
                      Apply for CAC Certificate (450k g₦ • 20s Wait)
                    </button>
                  </>
                )}
                {cacStatus === "Processing" && (
                  <div className="text-amber-400 font-bold">⏳ CAC Approval Countdown: {formatSecs(timers.cac_wait)}</div>
                )}
              </div>

              {/* STEP 2: LAND C-OF-O (CERTIFICATE OF OCCUPANCY) WITH COUNTDOWN */}
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="font-bold text-white">2. Land C-of-O (Cert. of Occupancy): <span className="text-emerald-400">{cofoStatus}</span></div>
                {cofoStatus === "None" && (
                  <button
                    onClick={() => {
                      if (spendMoney(600000)) {
                        setCofoStatus("Processing");
                        startCooldown("cofo_wait", 25);
                        setLogMessage("📜 Land C-of-O application submitted to Lagos Lands Bureau! Countdown: 25s...");
                        setTimeout(() => {
                          setCofoStatus("Approved");
                          setLogMessage("✅ Governor signed your Land C-of-O! You can now build commercial structures.");
                        }, 25000);
                      }
                    }}
                    className="w-full py-2 bg-indigo-600 text-white font-bold rounded-lg"
                  >
                    Purchase Land & C-of-O (600k g₦ • 25s Wait)
                  </button>
                )}
                {cofoStatus === "Processing" && (
                  <div className="text-amber-400 font-bold">⏳ C-of-O Signing Countdown: {formatSecs(timers.cofo_wait)}</div>
                )}
              </div>

              {/* STEP 3: BUILD COMMERCIAL BUILDINGS (Eatery, School, Agency, Parking, Farm) */}
              <div className="font-bold text-slate-400 uppercase pt-1">3. Construct Commercial Buildings (Req: CAC + C-of-O)</div>
              {[
                { id: "Eatery_Branch", name: "🍽️ Fast-Food Eatery Restaurant", bp: "Eatery", cost: 850000, rev: 95000 },
                { id: "Design_Agency", name: "🎨 Digital & Poster Design Agency", bp: "Digital_Agency", cost: 700000, rev: 85000 },
                { id: "Private_Poly", name: "🏫 Private Polytechnic School", bp: "Private_School", cost: 1800000, rev: 220000 },
                { id: "Commercial_Park", name: "🅿️ 10-Slot Commercial Parking Lot", bp: "Architecture", cost: 500000, rev: 55000 },
                { id: "Commercial_Farm", name: "🌾 Mechanized Farmland Estate", bp: "Farming", cost: 450000, rev: 140000 },
              ].map((b) => {
                const built = ownedBuildings.includes(b.id);
                const buildCd = timers[`build_${b.id}`];
                return (
                  <div key={b.id} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                    <div className="flex justify-between font-bold">
                      <span>{b.name}</span>
                      <span className="text-amber-400">{(b.cost / 1000).toFixed(0)}k g₦</span>
                    </div>
                    {built ? (
                      <button
                        disabled={!!timers[`rev_${b.id}`]}
                        onClick={() => {
                          startCooldown(`rev_${b.id}`, 30);
                          setEarnedBalance((p) => p + b.rev);
                          setCompanyValuation((p) => p + 150000000);
                          setLogMessage(`💰 Collected +${b.rev.toLocaleString()} g₦ revenue from ${b.name}!`);
                        }}
                        className="w-full py-1.5 bg-emerald-600 text-white font-bold rounded-lg disabled:opacity-40"
                      >
                        {timers[`rev_${b.id}`] ? `⏳ Next Payout: ${formatSecs(timers[`rev_${b.id}`])}` : `Collect Revenue (+${b.rev.toLocaleString()} g₦)`}
                      </button>
                    ) : (
                      <button
                        disabled={!!buildCd}
                        onClick={() => {
                          if (cacStatus !== "Approved" || cofoStatus !== "Approved") {
                            return setLogMessage("❌ You must secure both CAC Approval and Land C-of-O before constructing buildings!");
                          }
                          if (!ownedBlueprints.includes(b.bp)) {
                            return setLogMessage(`❌ You need the ${b.bp} Blueprint from the School tab first!`);
                          }
                          if (spendMoney(b.cost)) {
                            startCooldown(`build_${b.id}`, 20);
                            setLogMessage(`🏗️ Architects & Builders constructing ${b.name} (20s)...`);
                            setTimeout(() => {
                              setOwnedBuildings((p) => [...p, b.id]);
                              setLogMessage(`🏢 ${b.name} construction complete!`);
                            }, 20000);
                          }
                        }}
                        className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg"
                      >
                        {buildCd ? `🏗️ Building (${formatSecs(buildCd)})` : `Construct (Req: ${b.bp} BP)`}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* COLUMN 2: RESIDENTIAL REAL ESTATE BY AREA (OSHODI, BERGER, YABA, SURULERE, LEKKI) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <h2 className="font-bold text-sm text-cyan-400">🏡 Residential Real Estate (By Area)</h2>
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
                Current Residence: <strong className="text-emerald-400">{shelterType} ({shelterArea})</strong> • Parking: <strong>{parkingSlots} Slots</strong>
              </div>
              {[
                { name: "Self-Contain Studio", area: "Berger" as const, parking: 1, cost: 180000 },
                { name: "2-Bedroom Flat", area: "Yaba" as const, parking: 2, cost: 350000 },
                { name: "3-Bedroom Executive Flat", area: "Surulere" as const, parking: 3, cost: 750000 },
                { name: "5-Bed Luxury Detached Duplex", area: "Lekki" as const, parking: 5, cost: 2200000 },
                { name: "Waterfront Mansion Duplex", area: "Lekki" as const, parking: 8, cost: 5500000 },
              ].map((h, i) => {
                const isCurrent = shelterType === h.name;
                return (
                  <div key={i} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <div className="flex justify-between font-bold text-white">
                      <span>{h.name} (📍 {h.area})</span>
                      <span className="text-amber-400">{h.cost.toLocaleString()} g₦</span>
                    </div>
                    <div className="text-[10px] text-slate-400">Includes {h.parking} Gated Parking Slots • +10% Agent & 5% State Tax</div>
                    <button
                      disabled={isCurrent}
                      onClick={() => {
                        if (spendMoney(h.cost)) {
                          setShelterType(h.name);
                          setShelterArea(h.area);
                          setParkingSlots(h.parking);
                          setSteeze((p) => p + 25);
                          setLogMessage(`🏡 Acquired ${h.name} in ${h.area}! Parking capacity is now ${h.parking} cars.`);
                        }
                      }}
                      className="w-full py-1.5 bg-cyan-600 text-slate-950 font-extrabold rounded-lg disabled:opacity-40"
                    >
                      {isCurrent ? "✓ Current Residence" : `Acquire in ${h.area}`}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* COLUMN 3: FULL 7-CAR AUTOMOBILE DEALERSHIP */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <h2 className="font-bold text-sm text-emerald-400">🚗 Lagos Auto Dealership (7 Models)</h2>
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
                Garage ({carsOwned.length}/{parkingSlots} Slots Used):{" "}
                <strong className="text-amber-400">{carsOwned.length > 0 ? carsOwned.join(", ") : "No Cars Owned"}</strong>
              </div>
              {[
                { name: "Tokunbo Toyota Corolla", cost: 1200000, steeze: 25 },
                { name: "Honda Accord 'Evil Spirit'", cost: 1800000, steeze: 35 },
                { name: "Lexus RX350 SUV", cost: 2600000, steeze: 50 },
                { name: "Mercedes-Benz C300", cost: 3800000, steeze: 65 },
                { name: "Toyota Land Cruiser Prado", cost: 5200000, steeze: 80 },
                { name: "Mercedes-AMG G63 G-Wagon", cost: 7200000, steeze: 110 },
                { name: "Lamborghini Urus Performante", cost: 9500000, steeze: 150 },
              ].map((c, i) => {
                const owned = carsOwned.includes(c.name);
                return (
                  <div key={i} className="p-2 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white">{c.name}</div>
                      <div className="text-[10px] text-emerald-400">{c.cost.toLocaleString()} g₦ • +{c.steeze} Steeze</div>
                    </div>
                    <button
                      disabled={owned}
                      onClick={() => {
                        if (carsOwned.length >= parkingSlots) {
                          return setLogMessage(`🚓 LASTMA PARKING BLOCK! You have ${carsOwned.length}/${parkingSlots} parking slots. Upgrade to a larger Flat or Duplex first!`);
                        }
                        if (spendMoney(c.cost)) {
                          setCarsOwned((p) => [...p, c.name]);
                          setSteeze((p) => p + c.steeze);
                          setLogMessage(`🏎️ Purchased ${c.name}! Parked in slot ${carsOwned.length + 1}/${parkingSlots}.`);
                        }
                      }}
                      className="px-3 py-1.5 bg-emerald-500 text-slate-950 font-extrabold rounded-lg disabled:opacity-40"
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
            TAB 5: STEP-BY-STEP POLITICS (JOIN -> APPROVAL -> BUY FORM -> SUBMIT -> VOTE)
           ===================================================================== */}
        {activeTab === "politics" && (
          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-emerald-400">🏛️ Step-by-Step Party & Nomination Pipeline</h2>
              <p className="text-slate-400">
                Joining a party is separate from buying a Nomination Form! Each step requires official verification timers.
              </p>

              {/* STEP 1: JOIN PARTY & WAIT FOR APPROVAL */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="font-bold">Step 1: Party Membership Status: <span className="text-amber-400">{partyStatus}</span></div>
                {partyStatus === "None" && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        if (spendMoney(15000)) {
                          setPartyStatus("Pending_Approval");
                          startCooldown("party_wait", 15);
                          setLogMessage("🟢 Applied to join JPC Party! Screening takes 15s...");
                          setTimeout(() => {
                            setPartyStatus("Member_JPC");
                            setLogMessage("✅ JPC Party Card Issued! You can now purchase a Nomination Form.");
                          }, 15000);
                        }
                      }}
                      className="py-2 bg-emerald-600 text-white font-bold rounded-lg"
                    >
                      Apply to Join JPC (15k)
                    </button>
                    <button
                      onClick={() => {
                        if (spendMoney(15000)) {
                          setPartyStatus("Pending_Approval");
                          startCooldown("party_wait", 15);
                          setTimeout(() => {
                            setPartyStatus("Member_JSTD");
                            setLogMessage("✅ JSTD Party Card Issued!");
                          }, 15000);
                        }
                      }}
                      className="py-2 bg-indigo-600 text-white font-bold rounded-lg"
                    >
                      Apply to Join JSTD (15k)
                    </button>
                  </div>
                )}
                {partyStatus === "Pending_Approval" && (
                  <div className="text-amber-400 font-bold">⏳ Party Screening Countdown: {formatSecs(timers.party_wait)}</div>
                )}
              </div>

              {/* STEP 2: BUY NOMINATION FORM (SEPARATE FROM JOINING!) */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="font-bold">Step 2: Chairman/President Nomination Form: <span className="text-amber-400">{nominationStatus}</span></div>
                {nominationStatus === "None" && (
                  <button
                    onClick={() => {
                      if (partyStatus !== "Member_JPC" && partyStatus !== "Member_JSTD") {
                        return setLogMessage("❌ You must be an approved Party Member (Step 1) before buying a Nomination Form!");
                      }
                      if (spendMoney(250000)) {
                        setNominationStatus("Form_Purchased");
                        startCooldown("form_deadline", 120);
                        setLogMessage("📜 Nomination Form Collected! Fill & submit it before the 120s deadline expires!");
                      }
                    }}
                    className="w-full py-2 bg-amber-500 text-slate-950 font-extrabold rounded-lg"
                  >
                    Buy Official Nomination Form (250,000 g₦)
                  </button>
                )}
                {nominationStatus === "Form_Purchased" && (
                  <div className="space-y-2">
                    <div className="text-rose-400 font-bold">⏳ Submission Deadline: {formatSecs(timers.form_deadline)} remaining</div>
                    <button
                      onClick={() => {
                        startCooldown("vetting_wait", 15);
                        setTimeout(() => {
                          setNominationStatus("Submitted_Verified");
                          setLogMessage("✅ Nomination Form Vetted & Cleared for the Primary Ballot Shuffle!");
                        }, 15000);
                      }}
                      className="w-full py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-lg"
                    >
                      {timers.vetting_wait ? `⏳ Electoral Vetting (${formatSecs(timers.vetting_wait)})` : "Submit Completed Form for Vetting"}
                    </button>
                  </div>
                )}
              </div>

              {/* STEP 3: LIVE PRIMARY SHUFFLE */}
              <button
                onClick={() => {
                  if (nominationStatus !== "Submitted_Verified") {
                    return setLogMessage("❌ Complete Step 1 (Party Approval) & Step 2 (Submit Nomination Form) to enter the Shuffle!");
                  }
                  setShuffledFinalists([`${username} (${partyStatus})`, "Chief Balogun (JPC)", "Engr. Tunde (JPC)", "Barr. Chidinma (JSTD)", "Alhaji Musa (JPC)"]);
                  setLogMessage("🎲 Live Drum Shuffled! Your name is on the Top 5 Finalist Ballot!");
                }}
                className="w-full py-2.5 bg-indigo-600 text-white font-extrabold rounded-xl"
              >
                🎲 Step 3: Enter Live Top-5 Primary Shuffle
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-amber-400">🖼️ Campaign Poster & Ballot Box</h2>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1">
                <div className="font-bold text-slate-400 uppercase">Cleared Finalists ({area} Chairman):</div>
                {shuffledFinalists.map((c, i) => <div key={i} className="py-0.5">#{i + 1} {c}</div>)}
              </div>

              <button
                disabled={hasPosterLive}
                onClick={() => { if (spendMoney(50000)) { setHasPosterLive(true); setLogMessage("🎨 Poster Published by Design Agency! +10 State Bonus Votes."); }}}
                className="w-full p-2.5 bg-indigo-950/60 border border-indigo-600 rounded-xl font-bold disabled:opacity-40"
              >
                {hasPosterLive ? "✓ Campaign Poster Live (+10 Votes)" : "Hire Design Agency for Campaign Poster (50k g₦)"}
              </button>

              <button
                disabled={hasVoted}
                onClick={() => {
                  setHasVoted(true);
                  setEarnedBalance((p) => p + 5000);
                  setCitizenPoints((p) => p + 20);
                  setLogMessage("🗳️ Vote Cast! +5,000 g₦ Civic Stipend & +20 Citizen Points awarded.");
                }}
                className="w-full py-3 bg-emerald-500 text-slate-950 font-extrabold rounded-xl disabled:opacity-40"
              >
                {hasVoted ? "✓ Voted in Current Cycle" : "🗳️ Cast Ballot (+5,000 g₦ Voter Reward)"}
              </button>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 6: COURTSHIP/COUPLE INTERACTION, SOCIAL FEED & LIVE 300M RESERVE BANK
           ===================================================================== */}
        {activeTab === "lifestyle" && (
          <div className="grid md:grid-cols-3 gap-4 text-xs">
            {/* COLUMN 1: COURTSHIP, COUPLE BONDING & MARRIAGE REGISTRY */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-rose-400">💑 Courtship, Couple Bond & Marriage</h2>
              <p className="text-slate-400">
                You cannot marry while Single! Meet a partner, court them to 100% Relationship Bond, and furnish your home first.
              </p>

              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div>Status: <strong className="text-rose-400">{maritalStatus}</strong></div>
                <div>Partner: <strong className="text-white">{partnerName}</strong></div>
                <div>Couple Bond: <strong className="text-emerald-400">{relationshipBond}% / 100%</strong></div>
              </div>

              {maritalStatus === "Single" && (
                <div className="space-y-1.5">
                  <div className="font-bold text-slate-400">Meet Citizens Looking for Relationship:</div>
                  {(gender === "male" ? ["Chidinma (Yaba)", "Zainab (Lekki)", "Tolu (Surulere)"] : ["Adewale (Lekki)", "Chinedu (Yaba)", "Ibrahim (Berger)"]).map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setPartnerName(p);
                        setMaritalStatus("Courting");
                        setRelationshipBond(25);
                        setLogMessage(`❤️ Started courting ${p}! Go on dates to reach 100% Bond before marriage.`);
                      }}
                      className="w-full p-2 bg-slate-950 border border-slate-800 hover:border-rose-500 rounded-lg flex justify-between"
                    >
                      <span>💬 Ask Out: {p}</span>
                      <span className="text-rose-400 font-bold">Start Courting</span>
                    </button>
                  ))}
                </div>
              )}

              {maritalStatus === "Courting" && (
                <div className="space-y-2">
                  <button
                    disabled={!!timers.date_cd}
                    onClick={() => {
                      if (spendMoney(15000)) {
                        startCooldown("date_cd", 15);
                        setRelationshipBond((b) => Math.min(100, b + 25));
                        setLogMessage(`🍷 Took ${partnerName} on an Eatery Outing! Bond +25%.`);
                      }
                    }}
                    className="w-full py-2 bg-indigo-600 text-white font-bold rounded-lg disabled:opacity-40"
                  >
                    {timers.date_cd ? `⏳ On Date (${formatSecs(timers.date_cd)})` : `🍷 Take ${partnerName} on Date (15k • +25% Bond)`}
                  </button>

                  <button
                    onClick={() => {
                      if (relationshipBond < 100) return setLogMessage(`❌ Bond with ${partnerName} is only ${relationshipBond}%! Reach 100% Bond first.`);
                      if (wallColor === "Unplastered" || bedTier === "Bare_Floor" || chairTier === "None") {
                        return setLogMessage("❌ Partner's family rejected the wedding! Paint your room and buy a Bed & Sofa first.");
                      }
                      if (spendMoney(100000)) {
                        setMaritalStatus("Married");
                        setSteeze((p) => p + 50);
                        setLogMessage(`💍 Married ${partnerName} at the Ikoyi Registry! Dual-income & +50 Respect unlocked!`);
                      }
                    }}
                    className="w-full py-2.5 bg-rose-600 text-white font-extrabold rounded-xl"
                  >
                    💍 Registry Wedding (Req: 100% Bond & Furnished Home)
                  </button>
                </div>
              )}
            </div>

            {/* COLUMN 2: PUBLIC CITIZEN SOCIAL WALL (INTERACT & POST) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-cyan-400">💬 Lagos Citizen Social Feed</h2>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="Post an announcement, job, or flex..."
                  value={socialPostInput}
                  onChange={(e) => setSocialPostInput(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                />
                <button
                  onClick={() => {
                    if (!socialPostInput.trim()) return;
                    setSocialFeed((p) => [{ author: `@${username}`, text: socialPostInput, time: "Just now" }, ...p]);
                    setSocialPostInput("");
                    setCitizenPoints((p) => p + 5);
                    setLogMessage("📢 Posted to the Lagos Citizen Feed! (+5 Citizen Points)");
                  }}
                  className="px-3 py-1.5 bg-cyan-500 text-slate-950 font-extrabold rounded-lg"
                >
                  Post
                </button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {socialFeed.map((post, i) => (
                  <div key={i} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
                    <div className="flex justify-between text-[10px] text-emerald-400 font-bold">
                      <span>{post.author}</span>
                      <span className="text-slate-500">{post.time}</span>
                    </div>
                    <p className="text-slate-200 mt-1">{post.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMN 3: CENTRAL BANK WITH LIVE DECREASING 300M RESERVE */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-emerald-400">🏦 Central Bank (Live 300M Cap)</h2>
              <div className="p-3 bg-slate-950 border border-emerald-800/60 rounded-xl space-y-1.5">
                <div className="text-[10px] text-slate-400 uppercase">Genesis Supply Cap: 300,000,000 g₦</div>
                <div className="font-extrabold text-sm text-amber-400">
                  Available Reserve: {centralBankReserve.toLocaleString()} g₦
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500"
                    style={{ width: `${(centralBankReserve / 300000000) * 100}%` }}
                  />
                </div>
                <div className="text-[10px] text-emerald-400">
                  Bought by Players: {(300000000 - centralBankReserve).toLocaleString()} g₦
                </div>
              </div>

              <button
                onClick={() => {
                  if (centralBankReserve < 1000000) return setLogMessage("🛑 Central Bank 300M Reserve is SOLD OUT! P2P Market only.");
                  setCentralBankReserve((r) => r - 1000000);
                  setStarterBalance((p) => p + 1000000);
                  setLogMessage(`💳 Bought 1,000,000 g₦ (₦10k)! Central Bank Reserve decreased to ${(centralBankReserve - 1000000).toLocaleString()} g₦.`);
                }}
                className="w-full py-2.5 bg-amber-500 text-slate-950 font-extrabold rounded-xl"
              >
                ➕ Buy 1,000,000 g₦ (₦10,000) — Reduces Reserve
              </button>

              <button
                onClick={() => {
                  if (earnedBalance < 5000000) return setLogMessage("🔒 Minimum withdrawal is 5,000,000 g₦ (₦5,000) from your Withdrawable Wallet.");
                  const payout = Math.floor(earnedBalance / 1000);
                  setCentralBankReserve((r) => r + earnedBalance); // Returns to Central Bank pool!
                  setEarnedBalance(0);
                  setLogMessage(`🏦 Withdrew ₦${payout.toLocaleString()} to your Bank! ${earnedBalance.toLocaleString()} g₦ returned to Central Bank Reserve.`);
                }}
                className="w-full py-2.5 bg-emerald-600 text-white font-extrabold rounded-xl"
              >
                💸 Cash Out Earned Balance (Min 5M g₦)
              </button>
            </div>
          </div>
        )}
      </main>

      {showTvModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-rose-400 text-sm">LagosFlix Smart TV</h3>
              <button onClick={() => setShowTvModal(false)} className="text-xs bg-slate-800 px-3 py-1 rounded-lg text-white">Close</button>
            </div>
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
              <iframe className="w-full h-full" src="https://www.youtube.com/embed/jfKfPfyJRdk" title="LagosFlix" allowFullScreen />
            </div>
          </div>
        </div>
      )}

      {/* 6-TAB BOTTOM NAV */}
      <nav className="fixed bottom-0 inset-x-0 bg-slate-900/95 backdrop-blur border-t border-slate-800 px-2 py-2 z-40">
        <div className="max-w-3xl mx-auto grid grid-cols-6 gap-1">
          {[
            { id: "room", label: "2D Room", icon: <PaintBucket className="w-4 h-4" /> },
            { id: "hustle", label: "Jobs/Gigs", icon: <Briefcase className="w-4 h-4" /> },
            { id: "school", label: "School/BP", icon: <GraduationCap className="w-4 h-4" /> },
            { id: "empire", label: "CAC/Cars", icon: <Building2 className="w-4 h-4" /> },
            { id: "politics", label: "Politics", icon: <Vote className="w-4 h-4" /> },
            { id: "lifestyle", label: "Love/Bank", icon: <Landmark className="w-4 h-4" /> },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`py-2 rounded-xl text-[11px] font-bold flex flex-col items-center gap-1 transition ${
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
