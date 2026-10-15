"use client";

import React, { useState } from "react";
import { 
  Heart, Zap, Utensils, Sparkles, Tv, PaintBucket, 
  BedDouble, Armchair, Briefcase, GraduationCap, MapPin, 
  CheckCircle2, Play, Lock, Building2, Car, Sprout, 
  Vote, Newspaper, Shirt, HeartHandshake, Landmark, Trophy, AlertTriangle
} from "lucide-react";

export default function LagosEmpireGame() {
  // 1. ONBOARDING STATE
  const [isCreated, setIsCreated] = useState(false);
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");

  // 2. DUAL WALLETS & CORE STATS
  const [starterBalance, setStarterBalance] = useState(50000); // Non-withdrawable
  const [earnedBalance, setEarnedBalance] = useState(0);       // Withdrawable (Min 5M g₦)
  const [area, setArea] = useState<"Oshodi" | "Berger" | "Yaba" | "Lekki">("Oshodi");
  const [health, setHealth] = useState(85);
  const [energy, setEnergy] = useState(60);
  const [hunger, setHunger] = useState(75);
  const [weight, setWeight] = useState(68.0);
  const [steeze, setSteeze] = useState(5);
  const [citizenPoints, setCitizenPoints] = useState(10);

  // 3. EDUCATION, CV, WARDROBE & MARRIAGE
  const [education, setEducation] = useState("Uneducated");
  const [blueprints, setBlueprints] = useState<string[]>([]);
  const [cvScore, setCvScore] = useState(0);
  const [outfit, setOutfit] = useState("Singlet & Bathroom Slippers");
  const [hasCorporateSuit, setHasCorporateSuit] = useState(false);
  const [maritalStatus, setMaritalStatus] = useState("Single");
  const [currentJob, setCurrentJob] = useState("Unemployed");

  // 4. 2D ROOM, REAL ESTATE & VEHICLES
  const [shelterType, setShelterType] = useState("Single Room (0 Parking)");
  const [parkingSlots, setParkingSlots] = useState(0);
  const [wallColor, setWallColor] = useState("Unplastered");
  const [bedTier, setBedTier] = useState("Bare_Floor");
  const [chairTier, setChairTier] = useState("None");
  const [tvTier, setTvTier] = useState("None");
  const [hasLagosFlix, setHasLagosFlix] = useState(false);
  const [showTvModal, setShowTvModal] = useState(false);
  const [carOwned, setCarOwned] = useState("None");

  // 5. CAC COMPANY & FARMING
  const [companyName, setCompanyName] = useState("");
  const [hasCompany, setHasCompany] = useState(false);
  const [companyValuation, setCompanyValuation] = useState(0);
  const [farmStatus, setFarmStatus] = useState<"None" | "Growing" | "Ready_To_Harvest" | "Rotten">("None");

  // 6. POLITICS & ELECTIONS
  const [party, setParty] = useState("None");
  const [electionStage, setElectionStage] = useState<"Primary_Shuffle" | "Campaign_48h" | "Voting_24h">("Primary_Shuffle");
  const [shuffledFinalists, setShuffledFinalists] = useState<string[]>([
    "Chief Balogun (JPC)", "Engr. Tunde (JPC)", "Madam Kemi (JSTD)"
  ]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [hasPosterLive, setHasPosterLive] = useState(false);

  // NAVIGATION
  const [activeTab, setActiveTab] = useState<"room" | "hustle" | "school" | "empire" | "politics" | "lifestyle">("room");
  const [logMessage, setLogMessage] = useState(
    "Welcome to Oshodi! You have 50,000 g₦ non-withdrawable starter cash and are sleeping on a bare floor."
  );

  // HELPER: Spend from Starter Balance FIRST, then Earned Balance
  const spendMoney = (cost: number): boolean => {
    const total = starterBalance + earnedBalance;
    if (total < cost) {
      setLogMessage(`❌ Insufficient funds! You need ${cost.toLocaleString()} g₦.`);
      return false;
    }
    if (starterBalance >= cost) {
      setStarterBalance((prev) => prev - cost);
    } else {
      const remainder = cost - starterBalance;
      setStarterBalance(0);
      setEarnedBalance((prev) => prev - remainder);
    }
    return true;
  };

  // ACTION: Eat Food (Diet & Weight Mechanic)
  const handleEat = (mealName: string, cost: number, energyGain: number, weightChange: number, healthChange: number) => {
    if (spendMoney(cost)) {
      setHunger((p) => Math.min(100, p + 35));
      setEnergy((p) => Math.min(100, p + energyGain));
      setWeight((p) => Number((p + weightChange).toFixed(1)));
      setHealth((p) => Math.min(100, Math.max(20, p + healthChange)));
      setLogMessage(`🍲 Ate ${mealName}! Energy +${energyGain}%, Weight ${weightChange >= 0 ? `+${weightChange}` : weightChange}kg.`);
    }
  };

  // ACTION: Transport (Trekking vs Cab)
  const handleTravel = (targetArea: "Oshodi" | "Berger" | "Yaba" | "Lekki", mode: "trek" | "cab") => {
    if (mode === "trek") {
      if (energy < 25) return setLogMessage("⚠️ Too tired to trek! Take a cab or eat first.");
      setEnergy((p) => Math.max(0, p - 25));
      setWeight((p) => Number(Math.max(50, p - 0.4).toFixed(1)));
      setArea(targetArea);
      setLogMessage(`🚶🏾‍♂️ Trekked to ${targetArea} for FREE! Burned 0.4kg weight, -25% Energy.`);
    } else {
      if (spendMoney(2500)) {
        setArea(targetArea);
        setLogMessage(`🚕 Took an air-conditioned cab to ${targetArea} (-2,500 g₦). Zero energy lost!`);
      }
    }
  };

  // ACTION: Paint Room
  const handlePaintRoom = (colorName: string, cost: number) => {
    if (energy < 35) return setLogMessage("⚠️ Too exhausted to paint! Eat or sleep first.");
    if (spendMoney(cost)) {
      setWallColor(colorName);
      setEnergy((prev) => Math.max(0, prev - 35));
      setSteeze((prev) => prev + 10);
      setLogMessage(`🎨 Painted your walls ${colorName}! (-35% Energy, +10 Steeze/Respect)`);
    }
  };

  // ACTION: Street Hustle (With Health Penalty)
  const handleHustleJob = (jobName: string, fullPay: number) => {
    if (energy < 25) return setLogMessage("⚠️ Too tired to work! Rest or eat first.");
    setEnergy((prev) => Math.max(0, prev - 25));
    setHunger((prev) => Math.max(0, prev - 20));
    setCitizenPoints((p) => p + 5);

    if (health < 60) {
      const slashedPay = Math.floor(fullPay * 0.65);
      setEarnedBalance((prev) => prev + slashedPay);
      setLogMessage(
        `⚠️ LOW HEALTH ACCIDENT during ${jobName}! You broke plates/blocks. Paid ${slashedPay.toLocaleString()} g₦ instead of ${fullPay.toLocaleString()} g₦.`
      );
    } else {
      setEarnedBalance((prev) => prev + fullPay);
      setLogMessage(`✅ Completed ${jobName}! Earned +${fullPay.toLocaleString()} g₦ into your Withdrawable Wallet!`);
    }
  };

  // ACTION: Live Political Primary Number Shuffle
  const handleRunPrimaryShuffle = () => {
    setIsShuffling(true);
    setLogMessage("🎲 Live Party Hall Shuffle Drum spinning for Candidates #1 to #20...");
    setTimeout(() => {
      const pool = [
        `${username} (${party === "None" ? "JPC" : party})`,
        "Chief Balogun (JPC)",
        "Engr. Tunde (JPC)",
        "Barr. Chidinma (JSTD)",
        "Alhaji Musa (JPC)",
      ];
      setShuffledFinalists(pool);
      setIsShuffling(false);
      setElectionStage("Campaign_48h");
      setLogMessage("🎉 Top 5 Finalists Shuffled! 48-Hour Campaign & Poster Publicity Window is now OPEN (Voting locked for 48h).");
    }, 1500);
  };

  if (!isCreated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
          <div className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full mb-3">
            LAGOS LIFE & EMPIRE SIMULATOR
          </div>
          <h1 className="text-2xl font-extrabold mb-2">Start From Scratch</h1>
          <p className="text-slate-400 text-sm mb-6">
            Begin uneducated in an unpainted single room in Oshodi with a 50,000 g₦ survival stipend. Build your education, career, company, and family.
          </p>

          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Citizen Name
          </label>
          <input
            type="text"
            placeholder="e.g., Adewale or Chisom"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white mb-5 focus:outline-none focus:border-emerald-500"
          />

          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Select Gender
          </label>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {(["male", "female"] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`py-3 rounded-xl font-bold capitalize border transition ${
                  gender === g
                    ? "bg-emerald-600/20 border-emerald-500 text-emerald-300"
                    : "bg-slate-950 border-slate-800 text-slate-400"
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
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl transition"
          >
            Enter Lagos (Claim 50,000 g₦ Stipend)
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
      {/* TOP BAR: DUAL WALLETS & CITIZEN STATUS */}
      <header className="bg-slate-900/95 backdrop-blur border-b border-slate-800 sticky top-0 z-30 px-4 py-3">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-xl">
              {gender === "male" ? "👨🏾" : "👩🏾"}
            </div>
            <div>
              <div className="font-bold text-sm flex flex-wrap items-center gap-1.5">
                {username}
                <span className="text-[11px] px-2 py-0.5 bg-slate-800 rounded-full text-amber-400">
                  {education}
                </span>
                <span className="text-[11px] px-2 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-700 rounded-full">
                  {maritalStatus}
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <MapPin className="w-3 h-3" /> {area}
                </span>
                • {shelterType} • 🚗 {carOwned}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
              <div className="text-[10px] text-slate-400 uppercase">Starter/Deposit (Game Only)</div>
              <div className="font-extrabold text-sm text-amber-400">
                {starterBalance.toLocaleString()} g₦
              </div>
            </div>
            <div className="bg-slate-950 border border-emerald-900/60 rounded-xl px-3 py-1.5">
              <div className="text-[10px] text-emerald-400 uppercase flex items-center gap-1">
                Withdrawable Wallet <Lock className="w-2.5 h-2.5" />
              </div>
              <div className="font-extrabold text-sm text-emerald-400">
                {earnedBalance.toLocaleString()} g₦
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-4">
        {/* LIVE SURVIVAL METERS */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-900 border border-slate-800 rounded-2xl p-3">
          <StatBar icon={<Heart className="w-4 h-4 text-rose-400" />} label="Health" value={`${health}%`} pct={health} color="bg-rose-500" />
          <StatBar icon={<Zap className="w-4 h-4 text-amber-400" />} label="Energy" value={`${energy}%`} pct={energy} color="bg-amber-500" />
          <StatBar icon={<Utensils className="w-4 h-4 text-orange-400" />} label="Belly/Diet" value={`${hunger}%`} pct={hunger} color="bg-orange-500" />
          <StatBar icon={<Sparkles className="w-4 h-4 text-cyan-400" />} label="Steeze/Dress" value={`${steeze} pts`} pct={Math.min(100, steeze)} color="bg-cyan-500" />
          <div className="bg-slate-950 rounded-xl p-2 flex flex-col justify-center">
            <span className="text-[10px] text-slate-400 uppercase">Weight • CV • Citizen Pts</span>
            <span className="text-xs font-bold text-white">{weight}kg • CV:{cvScore} • 🌟{citizenPoints}</span>
          </div>
        </div>

        {/* EVENT LOG BANNER */}
        <div className="bg-emerald-950/40 border border-emerald-800/60 text-emerald-200 px-4 py-2.5 rounded-xl text-sm font-medium">
          🔔 {logMessage}
        </div>

        {/* TAB 1: 2D ROOM, DIET & TRANSPORT */}
        {activeTab === "room" && (
          <div className="grid md:grid-cols-3 gap-4">
            <div className={`md:col-span-2 rounded-2xl border-2 p-6 relative min-h-[360px] flex flex-col justify-between transition-all ${wallBgMap[wallColor]}`}>
              <div className="flex justify-between items-start gap-2">
                <div className="space-y-1">
                  <span className="bg-black/60 backdrop-blur px-3 py-1 rounded-lg text-xs font-semibold block">
                    🧱 Wall: {wallColor} {wallColor === "Unplastered" && "(Unpainted Concrete)"}
                  </span>
                  <span className="bg-black/60 backdrop-blur px-3 py-1 rounded-lg text-xs text-amber-300 block">
                    👔 Wearing: {outfit}
                  </span>
                </div>

                {/* TV ON WALL */}
                <div>
                  {tvTier === "None" ? (
                    <div className="border border-dashed border-white/20 rounded-xl px-4 py-3 text-xs text-white/40">
                      Empty Wall (Mount a TV)
                    </div>
                  ) : (
                    <div className="bg-slate-950 border-2 border-slate-700 rounded-xl p-3 shadow-xl text-center">
                      <Tv className="w-7 h-7 text-cyan-400 mx-auto mb-1" />
                      <div className="text-xs font-bold">{tvTier}</div>
                      <button
                        onClick={() => {
                          if (!hasLagosFlix) return setLogMessage("⚠️ Subscribe to LagosFlix (12,500 g₦) to stream movies!");
                          setShowTvModal(true);
                          setEnergy((p) => Math.min(100, p + 15));
                        }}
                        className="mt-2 px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 mx-auto"
                      >
                        <Play className="w-3 h-3" /> Watch LagosFlix
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* BED & CHAIRS */}
              <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/10">
                <div className="bg-black/45 rounded-xl p-3.5 flex items-center gap-3">
                  <BedDouble className="w-7 h-7 text-amber-400 shrink-0" />
                  <div>
                    <div className="text-[11px] text-slate-300">Sleeping Spot</div>
                    <div className="font-bold text-xs sm:text-sm">
                      {bedTier === "Bare_Floor" ? "🛑 Bare Floor (60% Cap)" : bedTier.replace("_", " ")}
                    </div>
                  </div>
                </div>
                <div className="bg-black/45 rounded-xl p-3.5 flex items-center gap-3">
                  <Armchair className="w-7 h-7 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-[11px] text-slate-300">Seating / Hosting</div>
                    <div className="font-bold text-xs sm:text-sm">
                      {chairTier === "None" ? "No Chairs" : chairTier.replace("_", " ")}
                    </div>
                  </div>
                </div>
              </div>

              {/* DIET & TRANSPORT QUICK BAR */}
              <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap gap-2 justify-between items-center bg-black/30 p-3 rounded-xl">
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleEat("Agege Bread & Garri (Heavy Carbs)", 1500, 15, 0.8, -2)}
                    className="px-2.5 py-1.5 bg-amber-950/90 border border-amber-700 rounded-lg text-xs font-semibold"
                  >
                    🍞 Cheap Carbs (1.5k • +0.8kg)
                  </button>
                  <button
                    onClick={() => handleEat("Eatery Jollof, Chicken & Salad", 6500, 35, -0.2, 10)}
                    className="px-2.5 py-1.5 bg-emerald-950/90 border border-emerald-700 rounded-lg text-xs font-semibold"
                  >
                    🍗 Balanced Meal (6.5k • +10 Health)
                  </button>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleTravel(area === "Oshodi" ? "Lekki" : "Oshodi", "trek")}
                    className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs"
                  >
                    🚶🏾‍♂️ Trek (-0.4kg, ₦0)
                  </button>
                  <button
                    onClick={() => handleTravel(area === "Oshodi" ? "Lekki" : "Oshodi", "cab")}
                    className="px-2.5 py-1.5 bg-indigo-950 border border-indigo-700 rounded-lg text-xs"
                  >
                    🚕 Cab (2,500 g₦)
                  </button>
                </div>
              </div>
            </div>

            {/* UPGRADE PANEL */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5 text-xs">
              <h2 className="font-bold text-sm">Room & Appliance Upgrades</h2>
              <button
                onClick={() => {
                  const maxCap = bedTier === "Bare_Floor" ? 60 : bedTier === "Foam_Mattress" ? 85 : 100;
                  setEnergy(maxCap);
                  setLogMessage(`🛌 Slept overnight! Energy restored to ${maxCap}%.`);
                }}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-sm"
              >
                🛌 Sleep Overnight (Restore Energy)
              </button>

              <div className="font-semibold text-slate-400 uppercase pt-1">DIY Paint Walls (-35% Energy)</div>
              <div className="grid grid-cols-3 gap-1.5">
                <button onClick={() => handlePaintRoom("Cream", 15000)} className="p-2 bg-slate-950 border border-slate-800 rounded-lg">Cream (15k)</button>
                <button onClick={() => handlePaintRoom("Emerald", 20000)} className="p-2 bg-slate-950 border border-slate-800 rounded-lg">Emerald (20k)</button>
                <button onClick={() => handlePaintRoom("RoyalBlue", 25000)} className="p-2 bg-slate-950 border border-slate-800 rounded-lg">Royal (25k)</button>
              </div>

              <button
                onClick={() => {
                  if (spendMoney(25000)) { setBedTier("Foam_Mattress"); setEnergy(85); setLogMessage("🛏️ Bought Foam Mattress (85% Energy Cap)!"); }
                }}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between"
              >
                <span>Foam Mattress (85% Cap)</span><span className="text-amber-400 font-bold">25,000 g₦</span>
              </button>
              <button
                onClick={() => {
                  if (spendMoney(75000)) { setBedTier("King_Bed"); setEnergy(100); setSteeze((p) => p + 15); setLogMessage("👑 Bought Royal King Bed (100% Cap)!"); }
                }}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between"
              >
                <span>Royal King Bed (100% Cap)</span><span className="text-amber-400 font-bold">75,000 g₦</span>
              </button>
              <button
                onClick={() => {
                  if (spendMoney(35000)) { setChairTier("Cushion_Sofa"); setSteeze((p) => p + 10); setLogMessage("🛋️ Bought Cushion Sofa Set!"); }
                }}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between"
              >
                <span>Cushion Sofa Set (Marriage Req)</span><span className="text-amber-400 font-bold">35,000 g₦</span>
              </button>

              <div className="font-semibold text-slate-400 uppercase pt-1">TV Tiers & LagosFlix</div>
              <button
                onClick={() => { if (spendMoney(60000)) { setTvTier("24-Inch Kpalasa TV"); setLogMessage("📺 Mounted 24-Inch TV!"); } }}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl flex justify-between"
              >
                <span>24" Starter TV</span><span className="text-amber-400 font-bold">60,000 g₦</span>
              </button>
              <button
                onClick={() => { if (spendMoney(175000)) { setTvTier("55-Inch 4K Smart TV"); setSteeze((p) => p + 20); setLogMessage("📺 Mounted 55-Inch Smart TV!"); } }}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl flex justify-between"
              >
                <span>55" Smart TV (+20 Steeze)</span><span className="text-amber-400 font-bold">175,000 g₦</span>
              </button>
              <button
                onClick={() => { if (spendMoney(12500)) { setHasLagosFlix(true); setLogMessage("🍿 LagosFlix Active! Click Watch on your TV."); } }}
                className="w-full p-2 bg-rose-950/50 border border-rose-800 rounded-xl flex justify-between"
              >
                <span>Subscribe LagosFlix Monthly</span><span className="text-rose-400 font-bold">12,500 g₦</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: HUSTLE, CORPORATE JOBS & SOCIAL GIGS */}
        {activeTab === "hustle" && (
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-amber-400">🧱 Street Hustle Alert Group</h2>
              <p className="text-xs text-slate-400">Low health (&lt;60%) causes plate/block breakage and slashes pay by 35%!</p>
              <button onClick={() => handleHustleJob("Lekki Bricklaying", 8000)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between">
                <span className="text-xs font-bold">Bricklayer (Lekki Site)</span><span className="text-xs font-extrabold text-emerald-400">+8,000 g₦</span>
              </button>
              <button onClick={() => handleHustleJob("Owambe Party Dishwashing", 6500)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between">
                <span className="text-xs font-bold">Owambe Catering Server</span><span className="text-xs font-extrabold text-emerald-400">+6,500 g₦</span>
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-cyan-400">🏢 Corporate Career Portal</h2>
              <p className="text-xs text-slate-400">Requires Diploma/B.Sc, Pro CV (&gt;70), and Corporate Suit!</p>
              <div className="text-xs bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                Current Role: <strong className="text-emerald-400">{currentJob}</strong>
              </div>
              <button
                onClick={() => {
                  if (education === "Uneducated") return setLogMessage("❌ Rejected! You need at least an ND Diploma.");
                  if (cvScore < 70) return setLogMessage("❌ Rejected by ATS! Your DIY CV is unstructured. Hire a Pro CV Agency!");
                  if (!hasCorporateSuit) return setLogMessage("❌ Dress Code Rejection! You showed up in slippers. Buy a Corporate Suit first!");
                  setCurrentJob("Commercial Bank Executive");
                  setEarnedBalance((p) => p + 45000);
                  setLogMessage("🎉 Hired as Commercial Bank Executive! Paid +45,000 g₦ salary into Withdrawable Wallet!");
                }}
                className="w-full p-3 bg-cyan-950/40 border border-cyan-700 rounded-xl flex justify-between items-center"
              >
                <span className="text-xs font-bold">Apply & Work: Bank Executive</span>
                <span className="text-xs font-extrabold text-cyan-300">+45,000 g₦</span>
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-emerald-400">📱 Verified Social & App Gigs</h2>
              {[
                { title: "Follow JPC Party on X", reward: 2500 },
                { title: "Comment on Brand Instagram", reward: 4000 },
                { title: "Beta Test Partner App (5 mins)", reward: 15000 },
              ].map((g, i) => (
                <div key={i} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                  <div>
                    <div className="text-xs font-bold">{g.title}</div>
                    <div className="text-[11px] text-emerald-400">+{g.reward.toLocaleString()} g₦ (Escrow)</div>
                  </div>
                  <button
                    onClick={() => {
                      setEarnedBalance((p) => p + g.reward);
                      setCitizenPoints((p) => p + 5);
                      setLogMessage(`✅ Social Gig Completed! +${g.reward.toLocaleString()} g₦ added to Withdrawable Wallet.`);
                    }}
                    className="px-2.5 py-1 bg-emerald-600 text-xs font-bold rounded-lg"
                  >
                    Claim
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SCHOOL, BLUEPRINTS & CV AGENCY */}
        {activeTab === "school" && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm">🎓 Academic Degrees & 24h Business Blueprints</h2>
              <button
                onClick={() => { if (spendMoney(225000)) { setEducation("ND Diploma"); setLogMessage("🎓 Completed Polytechnic ND Diploma!"); } }}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between text-xs"
              >
                <span>Polytechnic ND Diploma (2 Weeks)</span><span className="text-amber-400 font-bold">225,000 g₦</span>
              </button>
              <button
                onClick={() => { if (spendMoney(450000)) { setEducation("B.Sc University"); setSteeze((p) => p + 25); setLogMessage("🎓 Graduated University with B.Sc!"); } }}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between text-xs"
              >
                <span>University B.Sc Degree (4 Weeks)</span><span className="text-amber-400 font-bold">450,000 g₦</span>
              </button>
              <button
                onClick={() => {
                  if (spendMoney(50000)) {
                    setBlueprints((p) => [...p, "Rice_Eatery", "Farming"]);
                    setLogMessage("📘 Certified in Culinary Rice & Commercial Farming Blueprints!");
                  }
                }}
                className="w-full p-3 bg-indigo-950/40 border border-indigo-700 rounded-xl flex justify-between text-xs"
              >
                <span>📘 Buy Eatery & Farming Course Blueprint (24h)</span><span className="text-indigo-300 font-bold">50,000 g₦</span>
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm">📄 CV Builder & Wardrobe Dress Code</h2>
              <button
                onClick={() => { setCvScore(20); setLogMessage("📝 Built messy DIY CV. Score: 20/100."); }}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between text-xs"
              >
                <span>Write Unstructured DIY CV</span><span className="text-slate-400 font-bold">FREE (20 Score)</span>
              </button>
              <button
                onClick={() => { if (spendMoney(35000)) { setCvScore(95); setLogMessage("💼 Pro CV Agency Survey Complete! Executive CV Score: 95/100."); } }}
                className="w-full p-3 bg-emerald-950/40 border border-emerald-700 rounded-xl flex justify-between text-xs"
              >
                <span>Hire Professional CV Agency (Structured Survey)</span><span className="text-emerald-400 font-bold">35,000 g₦ (95 Score)</span>
              </button>
              <button
                onClick={() => {
                  if (spendMoney(45000)) {
                    setOutfit("Tailored Corporate Suit & Italian Shoes");
                    setHasCorporateSuit(true);
                    setSteeze((p) => p + 30);
                    setLogMessage("👔 Bought Corporate Suit & Shoes! (+30 Steeze, Unlocks Bank Interviews)");
                  }
                }}
                className="w-full p-3 bg-amber-950/40 border border-amber-700 rounded-xl flex justify-between text-xs"
              >
                <span>👔 Buy Corporate Suit & Shoes (+30 Steeze)</span><span className="text-amber-400 font-bold">45,000 g₦</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: CAC COMPANY, FARMING & REAL ESTATE/CARS */}
        {activeTab === "empire" && (
          <div className="grid md:grid-cols-3 gap-4">
            {/* CAC & 1 BILLION MILESTONE */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-amber-400">🏛️ CAC Corporate & 1B Milestone</h2>
              {!hasCompany ? (
                <>
                  <input
                    type="text"
                    placeholder="Company Name (e.g. Oreva Media)"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs"
                  />
                  <button
                    onClick={() => {
                      if (!companyName) return alert("Enter company name!");
                      if (spendMoney(750000)) {
                        setHasCompany(true);
                        setCompanyValuation(150000000);
                        setLogMessage(`🏢 Registered ${companyName} with CAC & Design Agency Package!`);
                      }
                    }}
                    className="w-full py-2.5 bg-amber-500 text-slate-950 font-extrabold rounded-xl text-xs"
                  >
                    Register CAC + Agency Package (750k g₦)
                  </button>
                </>
              ) : (
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="font-bold text-white">{companyName} (CAC Verified)</div>
                    <div className="text-emerald-400 font-extrabold mt-1">
                      Valuation: {companyValuation.toLocaleString()} / 1,000,000,000 g₦
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const nextVal = companyValuation + 300000000;
                      setCompanyValuation(nextVal);
                      if (nextVal >= 1000000000) {
                        setEarnedBalance((p) => p + 4000000);
                        setLogMessage(`🏆 ${companyName} HIT 1 BILLION g₦ VALUATION! Central Bank paid you +4,000,000 g₦ Founder Grant & unlocked Community Scholarships!`);
                      } else {
                        setEarnedBalance((p) => p + 85000);
                        setLogMessage(`📈 Completed client contracts! Valuation +300M g₦, Profit +85,000 g₦.`);
                      }
                    }}
                    className="w-full py-2.5 bg-emerald-600 font-bold rounded-xl"
                  >
                    Execute Contracts & Scale Toward 1B
                  </button>
                </div>
              )}
            </div>

            {/* 24-HOUR FARMING & SPOILAGE */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-emerald-400">🌾 Commercial Farmland (24h Spoilage)</h2>
              <p className="text-xs text-slate-400">Requires Course Blueprint. Harvest before crops rot!</p>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs">
                Farm Status: <strong className="text-amber-400">{farmStatus}</strong>
              </div>
              <button
                onClick={() => {
                  if (!blueprints.includes("Farming")) return setLogMessage("❌ Buy the Farming Blueprint in the School tab first!");
                  if (spendMoney(120000)) {
                    setFarmStatus("Ready_To_Harvest");
                    setLogMessage("🌱 Planted Rice & Tomatoes! 24h Growth complete — Harvest within 48h before it rots!");
                  }
                }}
                className="w-full py-2 bg-slate-950 border border-emerald-700 rounded-xl text-xs font-bold"
              >
                Plant Farmland Batch (120,000 g₦)
              </button>
              {farmStatus === "Ready_To_Harvest" && (
                <button
                  onClick={() => {
                    setFarmStatus("None");
                    setEarnedBalance((p) => p + 260000);
                    setLogMessage("🚜 Harvested & supplied Eateries before spoilage! Earned +260,000 g₦ into Withdrawable Wallet!");
                  }}
                  className="w-full py-2 bg-emerald-500 text-slate-950 font-extrabold rounded-xl text-xs"
                >
                  Harvest & Supply Eateries (+260,000 g₦)
                </button>
              )}
            </div>

            {/* DUPLEXES, FLATS & CARS (PARKING RULE) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5 text-xs">
              <h2 className="font-bold text-sm text-cyan-400">🏡 Real Estate, Duplexes & Cars</h2>
              <button
                onClick={() => {
                  if (spendMoney(350000)) {
                    setShelterType("2-Bed Flat (1 Parking Slot)");
                    setParkingSlots(1);
                    setLogMessage("🏢 Rented 2-Bedroom Flat via Estate Agent (10% Agent Fee + 5% State Tax paid)!");
                  }
                }}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between"
              >
                <span>Rent 2-Bed Flat (1 Parking)</span><span className="text-amber-400 font-bold">350,000 g₦</span>
              </button>
              <button
                onClick={() => {
                  if (spendMoney(2200000)) {
                    setShelterType("Lekki Luxury Duplex (4 Parking)");
                    setParkingSlots(4);
                    setSteeze((p) => p + 50);
                    setLogMessage("🏰 Acquired Lekki Luxury Duplex with 4 Gated Parking Slots!");
                  }
                }}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between"
              >
                <span>Lekki Luxury Duplex (4 Parking)</span><span className="text-amber-400 font-bold">2.2M g₦</span>
              </button>

              <div className="font-semibold text-slate-400 uppercase pt-1">Buy Vehicles (Requires Parking!)</div>
              <button
                onClick={() => {
                  if (parkingSlots < 1) return setLogMessage("🚓 LASTMA WARNING: You have 0 Parking Slots! Rent a 2-Bed Flat, Duplex, or Parking Slot before buying a car.");
                  if (spendMoney(1200000)) {
                    setCarOwned("Tokunbo Corolla");
                    setSteeze((p) => p + 35);
                    setLogMessage("🚗 Bought a Tokunbo Corolla! Safely parked in your compound.");
                  }
                }}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between"
              >
                <span>Buy Tokunbo Corolla</span><span className="text-emerald-400 font-bold">1.2M g₦</span>
              </button>
              <button
                onClick={() => {
                  if (parkingSlots < 1) return setLogMessage("🚓 LASTMA WARNING: Get an apartment with parking first!");
                  if (spendMoney(7500000)) {
                    setCarOwned("Lamborghini Urus");
                    setSteeze((p) => p + 100);
                    setLogMessage("🏎️ LAMBORGHINI ACQUIRED! Ultimate Lagos Steeze unlocked.");
                  }
                }}
                className="w-full p-2.5 bg-amber-950/40 border border-amber-600 rounded-xl flex justify-between"
              >
                <span>🏎️ Buy Lamborghini Urus</span><span className="text-amber-400 font-extrabold">7.5M g₦</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: POLITICS (LIVE SHUFFLE, 48H CAMPAIGN & VOTING REWARDS) */}
        {activeTab === "politics" && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-sm text-emerald-400">🏛️ JPC Ruling Party & Live Primary Hall</h2>
                <span className="text-[11px] px-2 py-0.5 bg-emerald-950 border border-emerald-700 rounded-full">
                  Stage: {electionStage}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => {
                    if (spendMoney(15000)) {
                      setParty("JPC");
                      setEarnedBalance((p) => p + 5000);
                      setLogMessage("🟢 Joined JPC Ruling Party! Received +5,000 g₦ Party Rice & Welfare drop!");
                    }
                  }}
                  className="p-2.5 bg-slate-950 border border-emerald-700 rounded-xl font-bold"
                >
                  Join JPC Party (15k g₦)
                </button>
                <button
                  onClick={handleRunPrimaryShuffle}
                  disabled={isShuffling}
                  className="p-2.5 bg-amber-500 text-slate-950 font-extrabold rounded-xl"
                >
                  {isShuffling ? "🎲 Shuffling..." : "🎲 Run Live Top-5 Shuffle"}
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1.5">
                <div className="text-xs font-bold text-slate-400 uppercase">Live Shuffled Top 5 Finalists ({area} Chairman):</div>
                {shuffledFinalists.map((cand, idx) => (
                  <div key={idx} className="text-xs flex justify-between py-1 border-b border-slate-900">
                    <span>#{idx + 1} {cand}</span>
                    <span className="text-emerald-400 font-bold">
                      {hasPosterLive && idx === 0 ? "+10 State Bonus Votes" : "Finalist"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-amber-400">🖼️ 48h Campaign Poster Board & 24h Ballot Box</h2>
              <p className="text-xs text-slate-400">
                Finalists get 48 hours to hire a Design Agency and publicize posters before the 24h Voting Room opens!
              </p>

              <button
                onClick={() => {
                  if (spendMoney(50000)) {
                    setHasPosterLive(true);
                    setElectionStage("Voting_24h");
                    setLogMessage("🖼️ Campaign Poster designed by 'SkyHigh Creative Agency' published! You earned +10 Free Electoral Commission Votes. 24h Voting Room is now OPEN!");
                  }
                }}
                className="w-full p-3 bg-indigo-950/60 border border-indigo-600 rounded-xl text-xs font-bold flex justify-between"
              >
                <span>🎨 Hire Design Agency for Campaign Poster (+10 Votes)</span>
                <span className="text-indigo-300">50,000 g₦</span>
              </button>

              {hasPosterLive && (
                <div className="p-3 bg-gradient-to-r from-emerald-950 to-slate-900 border border-emerald-600 rounded-xl text-xs">
                  <div className="font-extrabold text-sm text-white">🗳️ VOTE {username.toUpperCase()} FOR {area.toUpperCase()} CHAIRMAN!</div>
                  <div className="text-emerald-300 text-[11px] mt-0.5">"24/7 NEPA Light, Smooth Roads & Security"</div>
                  <div className="text-[10px] text-amber-400 mt-2 font-semibold">
                    ✨ Designed by: SkyHigh Digital Agency — Click to Hire
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  if (hasVoted) return setLogMessage("✅ You already voted in this election cycle!");
                  setHasVoted(true);
                  setEarnedBalance((p) => p + 5000);
                  setCitizenPoints((p) => p + 20);
                  setLogMessage("🗳️ Vote Cast! You received +5,000 g₦ Civic Voter Allowance, +20 Citizen Points for Sunday Ad-Share, and a 5% Area Tax Rebate!");
                }}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl text-xs"
              >
                🗳️ Cast Ballot (Claim +5,000 g₦ Voter Reward & +20 Citizen Pts)
              </button>
            </div>
          </div>
        )}

        {/* TAB 6: MARRIAGE, LOTTERY, SUNDAY NEWSPAPER & CASHOUT BANK */}
        {activeTab === "lifestyle" && (
          <div className="grid md:grid-cols-3 gap-4">
            {/* MARRIAGE & FAMILY */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-rose-400">💍 Courtship & Marriage Registry</h2>
              <p className="text-xs text-slate-400">
                Requires Painted Room, Mattress/Bed, and Chairs. Grants +25% Social Respect & 50% Rent Split!
              </p>
              <button
                onClick={() => {
                  if (wallColor === "Unplastered" || bedTier === "Bare_Floor" || chairTier === "None") {
                    return setLogMessage("❌ Marriage Proposal Rejected! Paint your walls and buy a bed and chairs first—you cannot bring a spouse to a bare floor!");
                  }
                  if (spendMoney(100000)) {
                    setMaritalStatus("Married (Responsible Citizen)");
                    setSteeze((p) => p + 40);
                    setLogMessage("💍 Congratulations! You are now Married! Rent split 50/50 and +40 Responsible Citizen Respect unlocked.");
                  }
                }}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 font-bold rounded-xl text-xs"
              >
                💍 Registry Wedding (100,000 g₦)
              </button>

              <div className="border-t border-slate-800 pt-3 space-y-2">
                <h3 className="font-bold text-xs text-amber-400">🎰 Game Center & Daily Lotto</h3>
                <button
                  onClick={() => {
                    if (spendMoney(2000)) {
                      const win = Math.random() > 0.5;
                      if (win) {
                        setEarnedBalance((p) => p + 15000);
                        setLogMessage("🎰 JACKPOT! Your Lotto numbers hit! Won +15,000 g₦ into Withdrawable Wallet!");
                      } else {
                        setLogMessage("🎲 Lotto draw missed this time (30% went to State Treasury). Try again!");
                      }
                    }
                  }}
                  className="w-full py-2 bg-slate-950 border border-amber-600 rounded-xl text-xs font-bold"
                >
                  🎟️ Play Daily Lagos Lotto (2,000 g₦)
                </button>
              </div>
            </div>

            {/* SUNDAY LAGOS TIMES & AD REVENUE SHARE */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-cyan-400">📰 Sunday "Lagos Times" & Ad Dividend</h2>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1">
                <div className="font-bold text-white">🗞️ HEADLINES THIS WEEK:</div>
                <p className="text-slate-400">• JPC Primaries heat up across Oshodi & Lekki!</p>
                <p className="text-slate-400">• State Privatization Auctions open in 14 Days.</p>
                <p className="text-emerald-400 font-semibold pt-1">Your Active Citizen Points: 🌟 {citizenPoints} pts</p>
              </div>
              <button
                onClick={() => {
                  const dividend = citizenPoints * 350;
                  setEarnedBalance((p) => p + dividend);
                  setLogMessage(`📰 Claimed Sunday Ad-Revenue Share! +${dividend.toLocaleString()} g₦ paid based on your ${citizenPoints} Citizen Points!`);
                }}
                className="w-full py-2.5 bg-cyan-600 text-slate-950 font-extrabold rounded-xl text-xs"
              >
                💰 Claim Weekly Citizen Ad-Share ({(citizenPoints * 350).toLocaleString()} g₦)
              </button>
            </div>

            {/* CENTRAL BANK BUY-IN & CASHOUT */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-emerald-400">🏦 Central Bank (300M Cap Exchange)</h2>
              <div className="text-[11px] text-slate-400 space-y-1">
                <div>• Buy Rate: <strong>₦10,000 = 1,000,000 g₦</strong> (Game Capital)</div>
                <div>• Cashout Rate: <strong>10,000,000 g₦ = ₦10,000</strong> (Min: 5M g₦)</div>
              </div>
              <button
                onClick={() => {
                  setStarterBalance((p) => p + 1000000);
                  setLogMessage("💳 Simulated ₦10,000 Buy-In: +1,000,000 g₦ added to your Starter/Deposit Balance!");
                }}
                className="w-full py-2 bg-amber-500 text-slate-950 font-extrabold rounded-xl text-xs"
              >
                ➕ Simulate Buy 1,000,000 g₦ (₦10,000)
              </button>
              <button
                onClick={() => {
                  if (earnedBalance < 5000000) {
                    return setLogMessage(`🔒 Minimum withdrawal is 5,000,000 g₦ (₦5,000). You currently have ${earnedBalance.toLocaleString()} g₦ in your Withdrawable Wallet. Note: Starter/Deposit money cannot be withdrawn!`);
                  }
                  const nairaPayout = Math.floor(earnedBalance / 1000);
                  setEarnedBalance(0);
                  setLogMessage(`🏦 CASHOUT APPROVED! ₦${nairaPayout.toLocaleString()} sent to your Nigerian Bank Account!`);
                }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs"
              >
                💸 Withdraw Earned Balance to Bank
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
              <h3 className="font-bold text-rose-400 flex items-center gap-2 text-sm">
                <Tv className="w-5 h-5" /> LagosFlix Smart TV — Featured Creator Movie of the Week
              </h3>
              <button onClick={() => setShowTvModal(false)} className="text-xs bg-slate-800 px-3 py-1 rounded-lg">
                Close TV
              </button>
            </div>
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/jfKfPfyJRdk"
                title="LagosFlix Stream"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* 6-TAB BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 inset-x-0 bg-slate-900/95 backdrop-blur border-t border-slate-800 px-2 py-2 z-40">
        <div className="max-w-3xl mx-auto grid grid-cols-6 gap-1">
          {[
            { id: "room", label: "2D Room", icon: <PaintBucket className="w-4 h-4" /> },
            { id: "hustle", label: "Jobs/Gigs", icon: <Briefcase className="w-4 h-4" /> },
            { id: "school", label: "School/CV", icon: <GraduationCap className="w-4 h-4" /> },
            { id: "empire", label: "CAC/Estate", icon: <Building2 className="w-4 h-4" /> },
            { id: "politics", label: "Politics", icon: <Vote className="w-4 h-4" /> },
            { id: "lifestyle", label: "Bank/Life", icon: <Landmark className="w-4 h-4" /> },
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
