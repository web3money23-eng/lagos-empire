"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Heart, Zap, Utensils, Sparkles, Tv, PaintBucket, 
  BedDouble, Armchair, Briefcase, GraduationCap, MapPin, 
  CheckCircle2, Play, Lock, Building2, Car, Vote, Landmark 
} from "lucide-react";

export default function LagosEmpireGame() {
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [isCreated, setIsCreated] = useState(false);
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");

  const [starterBalance, setStarterBalance] = useState(50000);
  const [earnedBalance, setEarnedBalance] = useState(0);
  const [area, setArea] = useState<"Oshodi" | "Berger" | "Yaba" | "Lekki">("Oshodi");
  const [health, setHealth] = useState(85);
  const [energy, setEnergy] = useState(60);
  const [hunger, setHunger] = useState(75);
  const [weight, setWeight] = useState(68.0);
  const [steeze, setSteeze] = useState(5);
  const [citizenPoints, setCitizenPoints] = useState(10);

  const [education, setEducation] = useState("Uneducated");
  const [blueprints, setBlueprints] = useState<string[]>([]);
  const [cvScore, setCvScore] = useState(0);
  const [outfit, setOutfit] = useState("Singlet & Bathroom Slippers");
  const [hasCorporateSuit, setHasCorporateSuit] = useState(false);
  const [maritalStatus, setMaritalStatus] = useState("Single");
  const [currentJob, setCurrentJob] = useState("Unemployed");

  const [shelterType] = useState("Single Room (0 Parking)");
  const [parkingSlots] = useState(0);
  const [wallColor, setWallColor] = useState("Unplastered");
  const [bedTier, setBedTier] = useState("Bare_Floor");
  const [chairTier, setChairTier] = useState("None");
  const [tvTier, setTvTier] = useState("None");
  const [hasLagosFlix, setHasLagosFlix] = useState(false);
  const [showTvModal, setShowTvModal] = useState(false);
  const [carOwned, setCarOwned] = useState("None");

  const [companyName, setCompanyName] = useState("");
  const [hasCompany, setHasCompany] = useState(false);
  const [companyValuation, setCompanyValuation] = useState(0);
  const [farmStatus, setFarmStatus] = useState<"None" | "Growing" | "Ready_To_Harvest" | "Rotten">("None");

  const [party, setParty] = useState("None");
  const [electionStage, setElectionStage] = useState<"Primary_Shuffle" | "Campaign_48h" | "Voting_24h">("Primary_Shuffle");
  const [shuffledFinalists, setShuffledFinalists] = useState<string[]>([
    "Chief Balogun (JPC)", "Engr. Tunde (JPC)", "Madam Kemi (JSTD)"
  ]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [hasPosterLive, setHasPosterLive] = useState(false);

  const [activeTab, setActiveTab] = useState<"room" | "hustle" | "school" | "empire" | "politics" | "lifestyle">("room");
  const [logMessage, setLogMessage] = useState(
    "Connected to Supabase! Your Lagos Empire is live and securely persisting data."
  );

  // Spend Money with Dual Wallet Logic
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

  const handleEat = (mealName: string, cost: number, energyGain: number, weightChange: number, healthChange: number) => {
    if (spendMoney(cost)) {
      setHunger((p) => Math.min(100, p + 35));
      setEnergy((p) => Math.min(100, p + energyGain));
      setWeight((p) => Number((p + weightChange).toFixed(1)));
      setHealth((p) => Math.min(100, Math.max(20, p + healthChange)));
      setLogMessage(`🍲 Ate ${mealName}! Energy +${energyGain}%, Weight change: ${weightChange}kg.`);
    }
  };

  const handleTravel = (targetArea: "Oshodi" | "Berger" | "Yaba" | "Lekki", mode: "trek" | "cab") => {
    if (mode === "trek") {
      if (energy < 25) return setLogMessage("⚠️ Too tired to trek! Take a cab or eat first.");
      setEnergy((p) => Math.max(0, p - 25));
      setWeight((p) => Number(Math.max(50, p - 0.4).toFixed(1)));
      setArea(targetArea);
      setLogMessage(`🚶🏾‍♂️ Trekked to ${targetArea} for FREE! Burned 0.4kg, -25% Energy.`);
    } else {
      if (spendMoney(2500)) {
        setArea(targetArea);
        setLogMessage(`🚕 Took a cab to ${targetArea} (-2,500 g₦). Zero energy lost!`);
      }
    }
  };

  const handlePaintRoom = (colorName: string, cost: number) => {
    if (energy < 35) return setLogMessage("⚠️ Too exhausted to paint! Eat or sleep first.");
    if (spendMoney(cost)) {
      setWallColor(colorName);
      setEnergy((prev) => Math.max(0, prev - 35));
      setSteeze((prev) => prev + 10);
      setLogMessage(`🎨 Painted walls ${colorName}! (-35% Energy, +10 Steeze)`);
    }
  };

  const handleHustleJob = (jobName: string, fullPay: number) => {
    if (energy < 25) return setLogMessage("⚠️ Too tired to work! Rest or eat first.");
    setEnergy((prev) => Math.max(0, prev - 25));
    setHunger((prev) => Math.max(0, prev - 20));
    setCitizenPoints((p) => p + 5);

    if (health < 60) {
      const slashedPay = Math.floor(fullPay * 0.65);
      setEarnedBalance((prev) => prev + slashedPay);
      setLogMessage(`⚠️ Low health accident during ${jobName}! Paid ${slashedPay.toLocaleString()} g₦.`);
    } else {
      setEarnedBalance((prev) => prev + fullPay);
      setLogMessage(`✅ Completed ${jobName}! Earned +${fullPay.toLocaleString()} g₦ into Withdrawable Wallet!`);
    }
  };

  const handleRunPrimaryShuffle = () => {
    setIsShuffling(true);
    setLogMessage("🎲 Shuffling Top 5 Finalists in Party Hall...");
    setTimeout(() => {
      setShuffledFinalists([
        `${username} (${party === "None" ? "JPC" : party})`,
        "Chief Balogun (JPC)",
        "Engr. Tunde (JPC)",
        "Barr. Chidinma (JSTD)",
        "Alhaji Musa (JPC)",
      ]);
      setIsShuffling(false);
      setElectionStage("Campaign_48h");
      setLogMessage("🎉 Top 5 Finalists Shuffled! 48-Hour Campaign Window is now OPEN.");
    }, 1200);
  };

  if (!isCreated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
          <div className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full mb-3">
            LAGOS EMPIRE — SUPABASE PERSISTENCE
          </div>
          <h1 className="text-2xl font-extrabold mb-2">Create Citizen Profile</h1>
          <p className="text-slate-400 text-sm mb-6">
            Enter your name to initialize your cloud profile in Supabase with 50,000 g₦ starting cash.
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
            onClick={async () => {
              if (!username.trim()) return alert("Please enter your name!");
              
              // CREATE ANOMYMOUS AUTH SESSION & PLAYER ROW IN SUPABASE
              const { data: authData, error: authErr } = await supabase.auth.signInAnonymously();
              if (authErr) {
                console.error(authErr);
                // Fallback to local session if anonymous auth is disabled in Supabase dashboard
                setIsCreated(true);
                return;
              }

              const userId = authData.user?.id;
              setSessionUser(authData.user);

              if (userId) {
                await supabase.from("players").upsert({
                  id: userId,
                  username: username.trim(),
                  gender: gender,
                  starter_deposit_balance: 50000,
                  earned_withdrawable_balance: 0,
                });

                await supabase.from("player_apartments").upsert({
                  player_id: userId,
                  shelter_type: "Single_Room",
                  area: "Oshodi",
                });
              }

              setIsCreated(true);
              setLogMessage(`Welcome to Lagos, ${username}! Your profile is now saved securely in Supabase.`);
            }}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl transition text-sm"
          >
            Save Profile & Enter Lagos
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
      {/* TOP HEADER */}
      <header className="bg-slate-900/95 backdrop-blur border-b border-slate-800 sticky top-0 z-30 px-4 py-3">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-xl">
              {gender === "male" ? "👨🏾" : "👩🏾"}
            </div>
            <div>
              <div className="font-bold text-sm flex flex-wrap items-center gap-1.5">
                {username}
                <span className="text-[11px] px-2 py-0.5 bg-slate-800 rounded-full text-amber-400">{education}</span>
                <span className="text-[11px] px-2 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-700 rounded-full">{maritalStatus}</span>
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
              <div className="text-[10px] text-slate-400 uppercase">Starter / Deposit (Game Only)</div>
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
        {/* METERS */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-900 border border-slate-800 rounded-2xl p-3">
          <StatBar icon={<Heart className="w-4 h-4 text-rose-400" />} label="Health" value={`${health}%`} pct={health} color="bg-rose-500" />
          <StatBar icon={<Zap className="w-4 h-4 text-amber-400" />} label="Energy" value={`${energy}%`} pct={energy} color="bg-amber-500" />
          <StatBar icon={<Utensils className="w-4 h-4 text-orange-400" />} label="Belly/Diet" value={`${hunger}%`} pct={hunger} color="bg-orange-500" />
          <StatBar icon={<Sparkles className="w-4 h-4 text-cyan-400" />} label="Steeze" value={`${steeze} pts`} pct={Math.min(100, steeze)} color="bg-cyan-500" />
          <div className="bg-slate-950 rounded-xl p-2 flex flex-col justify-center">
            <span className="text-[10px] text-slate-400 uppercase">Weight • CV • Citizen Pts</span>
            <span className="text-xs font-bold text-white">{weight}kg • CV:{cvScore} • 🌟{citizenPoints}</span>
          </div>
        </div>

        {/* LOG BANNER */}
        <div className="bg-emerald-950/40 border border-emerald-800/60 text-emerald-200 px-4 py-2.5 rounded-xl text-sm font-medium">
          🔔 {logMessage}
        </div>

        {/* TAB 1: 2D ROOM */}
        {activeTab === "room" && (
          <div className="grid md:grid-cols-3 gap-4">
            <div className={`md:col-span-2 rounded-2xl border-2 p-6 relative min-h-[360px] flex flex-col justify-between transition-all ${wallBgMap[wallColor]}`}>
              <div className="flex justify-between items-start gap-2">
                <div className="space-y-1">
                  <span className="bg-black/60 backdrop-blur px-3 py-1 rounded-lg text-xs font-semibold block">
                    🧱 Wall: {wallColor}
                  </span>
                  <span className="bg-black/60 backdrop-blur px-3 py-1 rounded-lg text-xs text-amber-300 block">
                    👔 Outfit: {outfit}
                  </span>
                </div>

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
                          if (!hasLagosFlix) return setLogMessage("⚠️ Subscribe to LagosFlix (12,500 g₦) first!");
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

              <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/10">
                <div className="bg-black/45 rounded-xl p-3.5 flex items-center gap-3">
                  <BedDouble className="w-7 h-7 text-amber-400 shrink-0" />
                  <div>
                    <div className="text-[11px] text-slate-300">Sleeping Spot</div>
                    <div className="font-bold text-xs sm:text-sm">{bedTier.replace("_", " ")}</div>
                  </div>
                </div>
                <div className="bg-black/45 rounded-xl p-3.5 flex items-center gap-3">
                  <Armchair className="w-7 h-7 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-[11px] text-slate-300">Seating</div>
                    <div className="font-bold text-xs sm:text-sm">{chairTier.replace("_", " ")}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap gap-2 justify-between items-center bg-black/30 p-3 rounded-xl">
                <div className="flex flex-wrap gap-1.5">
                  <button onClick={() => handleEat("Agege Bread & Garri", 1500, 15, 0.8, -2)} className="px-2.5 py-1.5 bg-amber-950/90 border border-amber-700 rounded-lg text-xs font-semibold">
                    🍞 Cheap Carbs (1.5k)
                  </button>
                  <button onClick={() => handleEat("Eatery Jollof & Chicken", 6500, 35, -0.2, 10)} className="px-2.5 py-1.5 bg-emerald-950/90 border border-emerald-700 rounded-lg text-xs font-semibold">
                    🍗 Balanced Meal (6.5k)
                  </button>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => handleTravel(area === "Oshodi" ? "Lekki" : "Oshodi", "trek")} className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs">
                    🚶🏾‍♂️ Trek
                  </button>
                  <button onClick={() => handleTravel(area === "Oshodi" ? "Lekki" : "Oshodi", "cab")} className="px-2.5 py-1.5 bg-indigo-950 border border-indigo-700 rounded-lg text-xs">
                    🚕 Cab (2.5k)
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5 text-xs">
              <h2 className="font-bold text-sm">Room & Appliance Upgrades</h2>
              <button
                onClick={() => {
                  const maxCap = bedTier === "Bare_Floor" ? 60 : bedTier === "Foam_Mattress" ? 85 : 100;
                  setEnergy(maxCap);
                  setLogMessage(`🛌 Slept overnight! Energy restored to ${maxCap}%.`);
                }}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-sm text-white"
              >
                🛌 Sleep Overnight
              </button>

              <div className="font-semibold text-slate-400 uppercase pt-1">Paint Walls</div>
              <div className="grid grid-cols-3 gap-1.5">
                <button onClick={() => handlePaintRoom("Cream", 15000)} className="p-2 bg-slate-950 border border-slate-800 rounded-lg">Cream (15k)</button>
                <button onClick={() => handlePaintRoom("Emerald", 20000)} className="p-2 bg-slate-950 border border-slate-800 rounded-lg">Emerald (20k)</button>
                <button onClick={() => handlePaintRoom("RoyalBlue", 25000)} className="p-2 bg-slate-950 border border-slate-800 rounded-lg">Royal (25k)</button>
              </div>

              <button onClick={() => { if (spendMoney(25000)) { setBedTier("Foam_Mattress"); setEnergy(85); setLogMessage("🛏️ Bought Foam Mattress!"); }}} className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between">
                <span>Foam Mattress (85% Cap)</span><span className="text-amber-400 font-bold">25,000 g₦</span>
              </button>
              <button onClick={() => { if (spendMoney(60000)) { setTvTier("Smart TV"); setSteeze((p) => p + 20); setLogMessage("📺 Bought Smart TV!"); }}} className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between">
                <span>Smart TV (+20 Steeze)</span><span className="text-amber-400 font-bold">60,000 g₦</span>
              </button>
              <button onClick={() => { if (spendMoney(12500)) { setHasLagosFlix(true); setLogMessage("🍿 LagosFlix Subscribed!"); }}} className="w-full p-2.5 bg-rose-950/50 border border-rose-800 rounded-xl flex justify-between">
                <span>LagosFlix Monthly Sub</span><span className="text-rose-400 font-bold">12,500 g₦</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: JOBS & GIGS */}
        {activeTab === "hustle" && (
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-amber-400">🧱 Street Hustles</h2>
              <button onClick={() => handleHustleJob("Lekki Bricklaying", 8000)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between">
                <span className="text-xs font-bold">Bricklayer</span><span className="text-xs font-extrabold text-emerald-400">+8,000 g₦</span>
              </button>
              <button onClick={() => handleHustleJob("Owambe Dishwashing", 6500)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between">
                <span className="text-xs font-bold">Catering Server</span><span className="text-xs font-extrabold text-emerald-400">+6,500 g₦</span>
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-cyan-400">🏢 Corporate Portal</h2>
              <div className="text-xs bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                Role: <strong className="text-emerald-400">{currentJob}</strong>
              </div>
              <button
                onClick={() => {
                  if (education === "Uneducated") return setLogMessage("❌ Need an ND/B.Sc degree first!");
                  if (cvScore < 70) return setLogMessage("❌ ATS rejected your DIY CV! Hire Pro Agency.");
                  if (!hasCorporateSuit) return setLogMessage("❌ Dress code violation! Buy Corporate Suit.");
                  setCurrentJob("Bank Executive");
                  setEarnedBalance((p) => p + 45000);
                  setLogMessage("🎉 Bank Executive salary paid: +45,000 g₦!");
                }}
                className="w-full p-3 bg-cyan-950/40 border border-cyan-700 rounded-xl flex justify-between items-center text-xs font-bold"
              >
                <span>Work: Bank Executive</span><span className="text-cyan-300">+45,000 g₦</span>
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-emerald-400">📱 Social Gigs & Escrow</h2>
              {[{ title: "Follow on X", reward: 2500 }, { title: "Test App", reward: 15000 }].map((g, i) => (
                <div key={i} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold">{g.title}</div>
                    <div className="text-[11px] text-emerald-400">+{g.reward.toLocaleString()} g₦</div>
                  </div>
                  <button onClick={() => { setEarnedBalance((p) => p + g.reward); setLogMessage(`✅ +${g.reward} g₦ added!`); }} className="px-2.5 py-1 bg-emerald-600 font-bold rounded-lg text-white">Claim</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SCHOOL & CV */}
        {activeTab === "school" && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
              <h2 className="font-bold text-sm">🎓 Education & Blueprints</h2>
              <button onClick={() => { if (spendMoney(225000)) { setEducation("ND Diploma"); setLogMessage("🎓 Completed ND Diploma!"); }}} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between font-bold">
                <span>Polytechnic ND</span><span className="text-amber-400">225,000 g₦</span>
              </button>
              <button onClick={() => { if (spendMoney(50000)) { setBlueprints((p) => [...p, "Farming"]); setLogMessage("📘 Bought Farming Blueprint!"); }}} className="w-full p-3 bg-indigo-950/40 border border-indigo-700 rounded-xl flex justify-between font-bold">
                <span>Farming Blueprint</span><span className="text-indigo-300">50,000 g₦</span>
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
              <h2 className="font-bold text-sm">📄 CV Builder & Wardrobe</h2>
              <button onClick={() => { if (spendMoney(35000)) { setCvScore(95); setLogMessage("💼 Pro CV Agency Score: 95/100."); }}} className="w-full p-3 bg-emerald-950/40 border border-emerald-700 rounded-xl flex justify-between font-bold">
                <span>Hire Pro CV Agency</span><span className="text-emerald-400">35,000 g₦ (95 Score)</span>
              </button>
              <button onClick={() => { if (spendMoney(45000)) { setOutfit("Corporate Suit"); setHasCorporateSuit(true); setSteeze((p) => p + 30); setLogMessage("👔 Bought Corporate Suit!"); }}} className="w-full p-3 bg-amber-950/40 border border-amber-700 rounded-xl flex justify-between font-bold">
                <span>Buy Corporate Suit</span><span className="text-amber-400">45,000 g₦</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: CAC & ESTATE */}
        {activeTab === "empire" && (
          <div className="grid md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-amber-400">🏛️ CAC Company & 1B Milestone</h2>
              {!hasCompany ? (
                <>
                  <input type="text" placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white" />
                  <button onClick={() => { if (companyName && spendMoney(750000)) { setHasCompany(true); setCompanyValuation(150000000); setLogMessage(`🏢 Registered ${companyName}!`); }}} className="w-full py-2 bg-amber-500 text-slate-950 font-bold rounded-xl">Register CAC (750k g₦)</button>
                </>
              ) : (
                <div className="space-y-2">
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 font-bold">{companyName} — Val: {companyValuation.toLocaleString()} g₦</div>
                  <button onClick={() => { setCompanyValuation((p) => p + 300000000); setEarnedBalance((p) => p + 85000); setLogMessage("📈 Scaled company valuation +300M g₦!"); }} className="w-full py-2 bg-emerald-600 text-white font-bold rounded-xl">Execute Contracts</button>
                </div>
              )}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-emerald-400">🌾 Farming (24h Spoilage)</h2>
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl">Status: <strong className="text-amber-400">{farmStatus}</strong></div>
              <button onClick={() => { if (blueprints.includes("Farming") && spendMoney(120000)) { setFarmStatus("Ready_To_Harvest"); setLogMessage("🌱 Planted Farmland!"); }}} className="w-full py-2 bg-slate-950 border border-emerald-700 rounded-xl font-bold">Plant Crops (120k g₦)</button>
              {farmStatus === "Ready_To_Harvest" && (
                <button onClick={() => { setFarmStatus("None"); setEarnedBalance((p) => p + 260000); setLogMessage("🚜 Harvested & supplied eateries (+260k g₦)!"); }} className="w-full py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl">Harvest (+260k g₦)</button>
              )}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-cyan-400">🏡 Real Estate & Cars</h2>
              <button onClick={() => { if (spendMoney(350000)) { setLogMessage("🏢 Rented 2-Bed Flat!"); }}} className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl flex justify-between font-bold">
                <span>Rent 2-Bed Flat</span><span className="text-amber-400">350,000 g₦</span>
              </button>
              <button onClick={() => { if (spendMoney(1200000)) { setCarOwned("Corolla"); setLogMessage("🚗 Bought Tokunbo Corolla!"); }}} className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl flex justify-between font-bold">
                <span>Buy Corolla</span><span className="text-emerald-400">1.2M g₦</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: POLITICS */}
        {activeTab === "politics" && (
          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-emerald-400">🏛️ JPC Ruling Party Primary</h2>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => { if (spendMoney(15000)) { setParty("JPC"); setEarnedBalance((p) => p + 5000); setLogMessage("🟢 Joined JPC! +5,000 g₦ welfare."); }}} className="p-2.5 bg-slate-950 border border-emerald-700 rounded-xl font-bold">Join JPC (15k)</button>
                <button onClick={handleRunPrimaryShuffle} disabled={isShuffling} className="p-2.5 bg-amber-500 text-slate-950 font-extrabold rounded-xl">Run Shuffle</button>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1">
                <div className="font-bold text-slate-400 uppercase">Top 5 Finalists:</div>
                {shuffledFinalists.map((c, i) => <div key={i} className="py-0.5">{c}</div>)}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-amber-400">🖼️ Campaign & Voting</h2>
              <button onClick={() => { if (spendMoney(50000)) { setHasPosterLive(true); setLogMessage("🎨 Poster live! +10 votes."); }}} className="w-full p-2.5 bg-indigo-950/60 border border-indigo-600 rounded-xl font-bold">Design Agency Poster (50k g₦)</button>
              <button onClick={() => { if (!hasVoted) { setHasVoted(true); setEarnedBalance((p) => p + 5000); setCitizenPoints((p) => p + 20); setLogMessage("🗳️ Voted! +5,000 g₦ & +20 Pts."); }}} className="w-full py-3 bg-emerald-500 text-slate-950 font-extrabold rounded-xl">Cast Vote</button>
            </div>
          </div>
        )}

        {/* TAB 6: BANK & LIFE */}
        {activeTab === "lifestyle" && (
          <div className="grid md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-rose-400">💍 Marriage Registry</h2>
              <button onClick={() => { if (spendMoney(100000)) { setMaritalStatus("Married"); setSteeze((p) => p + 40); setLogMessage("💍 Married! +40 Steeze."); }}} className="w-full py-2.5 bg-rose-600 text-white font-bold rounded-xl">Wedding (100k g₦)</button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-cyan-400">📰 Sunday Lagos Times</h2>
              <button onClick={() => { const d = citizenPoints * 350; setEarnedBalance((p) => p + d); setLogMessage(`📰 Claimed +${d} g₦ Ad Dividend!`); }} className="w-full py-2.5 bg-cyan-600 text-slate-950 font-bold rounded-xl">Claim Ad Share</button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-sm text-emerald-400">🏦 Central Bank Cashout</h2>
              <button onClick={() => { setStarterBalance((p) => p + 1000000); setLogMessage("💳 Simulated Buy-In: +1M g₦ Starter Cash!"); }} className="w-full py-2 bg-amber-500 text-slate-950 font-bold rounded-xl">Buy 1M g₦ (₦10k)</button>
              <button onClick={() => { if (earnedBalance < 5000000) return setLogMessage("🔒 Min withdrawal is 5M g₦."); setEarnedBalance(0); setLogMessage("🏦 Cashout approved!"); }} className="w-full py-2.5 bg-emerald-600 text-white font-bold rounded-xl">Withdraw Earned Cash</button>
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
            { id: "hustle", label: "Jobs", icon: <Briefcase className="w-4 h-4" /> },
            { id: "school", label: "School", icon: <GraduationCap className="w-4 h-4" /> },
            { id: "empire", label: "CAC", icon: <Building2 className="w-4 h-4" /> },
            { id: "politics", label: "Politics", icon: <Vote className="w-4 h-4" /> },
            { id: "lifestyle", label: "Bank", icon: <Landmark className="w-4 h-4" /> },
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
