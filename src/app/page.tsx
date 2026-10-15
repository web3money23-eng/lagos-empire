"use client";

import React, { useState } from "react";
import { 
  Heart, Zap, Utensils, Sparkles, Tv, PaintBucket, 
  BedDouble, Armchair, Briefcase, GraduationCap, MapPin, 
  CheckCircle2, Play, Lock
} from "lucide-react";

export default function LagosEmpireGame() {
  const [isCreated, setIsCreated] = useState(false);
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");

  const [starterBalance, setStarterBalance] = useState(50000);
  const [earnedBalance, setEarnedBalance] = useState(0);
  const [area] = useState("Oshodi");
  const [health, setHealth] = useState(85);
  const [energy, setEnergy] = useState(60);
  const [hunger, setHunger] = useState(75);
  const [weight] = useState(68.0);
  const [steeze, setSteeze] = useState(5);
  const [education, setEducation] = useState("Uneducated");
  const [cvScore, setCvScore] = useState(0);

  const [shelterType] = useState("Single_Room");
  const [wallColor, setWallColor] = useState("Unplastered");
  const [bedTier, setBedTier] = useState("Bare_Floor");
  const [chairTier, setChairTier] = useState("None");
  const [tvTier, setTvTier] = useState("None");
  const [hasLagosFlix, setHasLagosFlix] = useState(false);
  const [showTvModal, setShowTvModal] = useState(false);

  const [activeTab, setActiveTab] = useState<"room" | "hustle" | "school_cv">("room");
  const [logMessage, setLogMessage] = useState(
    "Welcome to Oshodi! You have 50,000 g₦ survival money and are sleeping on a bare floor. Spend wisely!"
  );

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

  const handlePaintRoom = (colorName: string, cost: number) => {
    if (energy < 35) {
      setLogMessage("⚠️ You are too exhausted to paint! Eat or sleep first.");
      return;
    }
    if (spendMoney(cost)) {
      setWallColor(colorName);
      setEnergy((prev) => Math.max(0, prev - 35));
      setSteeze((prev) => prev + 10);
      setLogMessage(`🎨 You painted your walls ${colorName}! (-35% Energy, +10 Steeze/Respect)`);
    }
  };

  const handleHustleJob = (jobName: string, fullPay: number) => {
    if (energy < 25) {
      setLogMessage("⚠️ Too tired to work! Rest or eat first.");
      return;
    }
    setEnergy((prev) => Math.max(0, prev - 25));
    setHunger((prev) => Math.max(0, prev - 20));

    if (health < 60) {
      const slashedPay = Math.floor(fullPay * 0.65);
      setEarnedBalance((prev) => prev + slashedPay);
      setLogMessage(
        `⚠️ LOW HEALTH ACCIDENT during ${jobName}! You felt dizzy and broke plates/blocks. Paid ${slashedPay.toLocaleString()} g₦ instead of ${fullPay.toLocaleString()} g₦.`
      );
    } else {
      setEarnedBalance((prev) => prev + fullPay);
      setLogMessage(
        `✅ Completed ${jobName} in good health! Earned +${fullPay.toLocaleString()} g₦ into your Withdrawable Wallet!`
      );
    }
  };

  const handleSleep = () => {
    const maxCap = bedTier === "Bare_Floor" ? 60 : bedTier === "Foam_Mattress" ? 85 : 100;
    setEnergy(maxCap);
    if (bedTier === "Bare_Floor") {
      setHealth((prev) => Math.max(30, prev - 5));
      setLogMessage(
        "🛌 Slept on the cold bare floor. Max Energy capped at 60% and your back hurts (-5 Health). Buy a mattress!"
      );
    } else {
      setHealth((prev) => Math.min(100, prev + 10));
      setLogMessage(`🛌 Slept soundly on your ${bedTier.replace("_", " ")}! Energy restored to ${maxCap}%.`);
    }
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
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      <header className="bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-0 z-30 px-4 py-3">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-lg">
              {gender === "male" ? "👨🏾" : "👩🏾"}
            </div>
            <div>
              <div className="font-bold text-sm flex items-center gap-2">
                {username}
                <span className="text-xs px-2 py-0.5 bg-slate-800 rounded-full text-amber-400">
                  {education}
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" /> {area} • {shelterType.replace("_", " ")}
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
                Withdrawable Earnings <Lock className="w-2.5 h-2.5" />
              </div>
              <div className="font-extrabold text-sm text-emerald-400">
                {earnedBalance.toLocaleString()} g₦
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-900 border border-slate-800 rounded-2xl p-3">
          <StatBar icon={<Heart className="w-4 h-4 text-rose-400" />} label="Health" value={`${health}%`} pct={health} color="bg-rose-500" />
          <StatBar icon={<Zap className="w-4 h-4 text-amber-400" />} label="Energy" value={`${energy}%`} pct={energy} color="bg-amber-500" />
          <StatBar icon={<Utensils className="w-4 h-4 text-orange-400" />} label="Belly/Diet" value={`${hunger}%`} pct={hunger} color="bg-orange-500" />
          <StatBar icon={<Sparkles className="w-4 h-4 text-cyan-400" />} label="Steeze/Resp." value={`${steeze} pts`} pct={Math.min(100, steeze)} color="bg-cyan-500" />
          <div className="bg-slate-950 rounded-xl p-2 flex flex-col justify-center">
            <span className="text-[11px] text-slate-400">Body Weight & CV</span>
            <span className="text-xs font-bold text-white">{weight.toFixed(1)} kg • CV: {cvScore}/100</span>
          </div>
        </div>

        <div className="bg-emerald-950/40 border border-emerald-800/60 text-emerald-200 px-4 py-2.5 rounded-xl text-sm font-medium">
          🔔 {logMessage}
        </div>

        {activeTab === "room" && (
          <div className="grid md:grid-cols-3 gap-4">
            <div className={`md:col-span-2 rounded-2xl border-2 p-6 relative min-h-[340px] flex flex-col justify-between transition-all ${wallBgMap[wallColor]}`}>
              <div className="flex justify-between items-start">
                <span className="bg-black/50 backdrop-blur px-3 py-1 rounded-lg text-xs font-semibold">
                  🧱 Wall: {wallColor} {wallColor === "Unplastered" && "(Unpainted Concrete)"}
                </span>

                <div className="flex flex-col items-end">
                  {tvTier === "None" ? (
                    <div className="border border-dashed border-white/20 rounded-xl px-4 py-3 text-xs text-white/40">
                      Empty Wall (Mount a TV)
                    </div>
                  ) : (
                    <div className="bg-slate-950 border-2 border-slate-700 rounded-xl p-3 shadow-xl text-center">
                      <Tv className="w-8 h-8 text-cyan-400 mx-auto mb-1" />
                      <div className="text-xs font-bold">{tvTier.replaceAll("_", " ")}</div>
                      <button
                        onClick={() => {
                          if (!hasLagosFlix) return setLogMessage("⚠️ Subscribe to LagosFlix (12,500 g₦) to stream movies!");
                          setShowTvModal(true);
                          setEnergy((p) => Math.min(100, p + 10));
                        }}
                        className="mt-2 px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 mx-auto"
                      >
                        <Play className="w-3 h-3" /> Watch LagosFlix
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-12 pt-6 border-t border-white/10">
                <div className="bg-black/40 rounded-xl p-4 flex items-center gap-3">
                  <BedDouble className="w-8 h-8 text-amber-400 shrink-0" />
                  <div>
                    <div className="text-xs text-slate-300">Sleeping Spot</div>
                    <div className="font-bold text-sm">
                      {bedTier === "Bare_Floor" ? "🛑 Bare Cold Floor (Max 60% Energy)" : bedTier.replace("_", " ")}
                    </div>
                  </div>
                </div>

                <div className="bg-black/40 rounded-xl p-4 flex items-center gap-3">
                  <Armchair className="w-8 h-8 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-xs text-slate-300">Seating / Hosting</div>
                    <div className="font-bold text-sm">
                      {chairTier === "None" ? "No Chairs (Cannot Host Guests)" : chairTier.replace("_", " ")}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-base">Furnish & Upgrade Room</h2>
              <button
                onClick={handleSleep}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-sm"
              >
                🛌 Sleep Overnight (Restore Energy)
              </button>

              <div className="border-t border-slate-800 pt-3 space-y-2 text-xs">
                <div className="font-semibold text-slate-400 uppercase">1. DIY Paint Walls (-35% Energy)</div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button onClick={() => handlePaintRoom("Cream", 15000)} className="p-2 bg-slate-950 border border-slate-800 rounded-lg hover:border-amber-400">
                    Cream (15k)
                  </button>
                  <button onClick={() => handlePaintRoom("Emerald", 20000)} className="p-2 bg-slate-950 border border-slate-800 rounded-lg hover:border-emerald-400">
                    Emerald (20k)
                  </button>
                  <button onClick={() => handlePaintRoom("RoyalBlue", 25000)} className="p-2 bg-slate-950 border border-slate-800 rounded-lg hover:border-blue-400">
                    Royal (25k)
                  </button>
                </div>

                <div className="font-semibold text-slate-400 uppercase pt-2">2. Buy Bed & Chairs</div>
                <button
                  onClick={() => {
                    if (spendMoney(25000)) {
                      setBedTier("Foam_Mattress");
                      setEnergy(85);
                      setLogMessage("🛏️ Bought a Foam Mattress! Max energy cap raised to 85%.");
                    }
                  }}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between hover:border-emerald-500"
                >
                  <span>Buy Foam Mattress (85% Cap)</span>
                  <span className="font-bold text-amber-400">25,000 g₦</span>
                </button>

                <button
                  onClick={() => {
                    if (spendMoney(18000)) {
                      setChairTier("Plastic_Chair");
                      setSteeze((p) => p + 5);
                      setLogMessage("🪑 Bought Plastic Chairs! You can now host visitors.");
                    }
                  }}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between hover:border-emerald-500"
                >
                  <span>Buy Plastic Chairs (+5 Steeze)</span>
                  <span className="font-bold text-amber-400">18,000 g₦</span>
                </button>

                <div className="font-semibold text-slate-400 uppercase pt-2">3. TV & LagosFlix</div>
                <button
                  onClick={() => {
                    if (spendMoney(60000)) {
                      setTvTier("Smart_55_Inch");
                      setSteeze((p) => p + 15);
                      setLogMessage("📺 Mounted a Smart TV on your wall!");
                    }
                  }}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between hover:border-emerald-500"
                >
                  <span>Buy Smart TV (+15 Steeze)</span>
                  <span className="font-bold text-amber-400">60,000 g₦</span>
                </button>

                <button
                  onClick={() => {
                    if (spendMoney(12500)) {
                      setHasLagosFlix(true);
                      setLogMessage("🍿 Subscribed to LagosFlix! Click 'Watch LagosFlix' on your TV.");
                    }
                  }}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between hover:border-rose-500"
                >
                  <span>Subscribe LagosFlix Monthly</span>
                  <span className="font-bold text-rose-400">12,500 g₦</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "hustle" && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-base flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-amber-400" /> Street Hustle Alert Group
              </h2>
              <p className="text-xs text-slate-400">
                Warning: If your Health drops below 60%, you will break plates or blocks and lose 35% of your pay!
              </p>
              <button
                onClick={() => handleHustleJob("Lekki Site Bricklaying", 8000)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center hover:border-amber-400"
              >
                <div className="text-left">
                  <div className="font-bold text-sm">🧱 Bricklayer Assistant (Lekki Site)</div>
                  <div className="text-xs text-slate-400">Requires 25% Energy • Pays to Withdrawable Wallet</div>
                </div>
                <span className="font-extrabold text-emerald-400">+8,000 g₦</span>
              </button>

              <button
                onClick={() => handleHustleJob("Owambe Party Catering & Dishwashing", 6500)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center hover:border-amber-400"
              >
                <div className="text-left">
                  <div className="font-bold text-sm">🍽️ Owambe Party Catering Server</div>
                  <div className="text-xs text-slate-400">Watch your health or you will break plates!</div>
                </div>
                <span className="font-extrabold text-emerald-400">+6,500 g₦</span>
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Verified Social Gigs & App Testing
              </h2>
              <p className="text-xs text-slate-400">
                Complete real tasks from player-owned Digital Agencies to earn instant withdrawable g₦.
              </p>
              {[
                { title: "Follow JPC Party on X (Twitter)", reward: 2500 },
                { title: "Follow Lagos Dev Board on LinkedIn", reward: 3500 },
                { title: "Test Partner Web App & Submit Feedback", reward: 12000 },
              ].map((gig, i) => (
                <div key={i} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                  <div>
                    <div className="font-bold text-sm">{gig.title}</div>
                    <div className="text-xs text-emerald-400">Escrow Locked • Pays +{gig.reward.toLocaleString()} g₦</div>
                  </div>
                  <button
                    onClick={() => {
                      setEarnedBalance((p) => p + gig.reward);
                      setLogMessage(`🎉 Social Gig Verified! +${gig.reward.toLocaleString()} g₦ added to Withdrawable Wallet.`);
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold rounded-lg"
                  >
                    Do Task
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "school_cv" && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-base">🎓 Polytechnic, University & Business Blueprints</h2>
              <button
                onClick={() => {
                  if (spendMoney(225000)) {
                    setEducation("ND_Diploma");
                    setLogMessage("🎓 Enrolled & Completed Polytechnic ND Diploma! Corporate jobs unlocked.");
                  }
                }}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between"
              >
                <span>Polytechnic ND Diploma (2 Weeks)</span>
                <span className="font-bold text-amber-400">225,000 g₦</span>
              </button>

              <button
                onClick={() => {
                  if (spendMoney(50000)) {
                    setLogMessage("📘 Purchased 24h 'Mastery of Jollof & Fried Rice' Blueprint! You can now open an Eatery.");
                  }
                }}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between"
              >
                <span>📘 Eatery Rice & Grill Blueprint (24h Course)</span>
                <span className="font-bold text-amber-400">50,000 g₦</span>
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="font-bold text-base">📄 DIY CV vs. Professional CV Agency</h2>
              <button
                onClick={() => {
                  setCvScore(20);
                  setLogMessage("📝 Created an unstructured DIY CV for free. Callback score: 20/100.");
                }}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between"
              >
                <span>Write Unstructured DIY CV Yourself</span>
                <span className="text-slate-400 font-bold">FREE (20% Score)</span>
              </button>

              <button
                onClick={() => {
                  if (spendMoney(35000)) {
                    setCvScore(92);
                    setLogMessage("💼 Professional Agency completed your survey and built an Executive CV! Score: 92/100.");
                  }
                }}
                className="w-full p-3 bg-emerald-950/40 border border-emerald-700 rounded-xl flex justify-between"
              >
                <span>Hire Licensed Pro CV Agency (Survey)</span>
                <span className="text-emerald-400 font-bold">35,000 g₦ (92% Score)</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {showTvModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-rose-400 flex items-center gap-2">
                <Tv className="w-5 h-5" /> LagosFlix Smart TV — Featured Movie of the Week
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

      <nav className="fixed bottom-0 inset-x-0 bg-slate-900 border-t border-slate-800 px-4 py-2 z-40">
        <div className="max-w-xl mx-auto grid grid-cols-3 gap-2">
          <button
            onClick={() => setActiveTab("room")}
            className={`py-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 ${
              activeTab === "room" ? "bg-emerald-500 text-slate-950" : "text-slate-400"
            }`}
          >
            <PaintBucket className="w-4 h-4" /> My 2D Room
          </button>
          <button
            onClick={() => setActiveTab("hustle")}
            className={`py-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 ${
              activeTab === "hustle" ? "bg-emerald-500 text-slate-950" : "text-slate-400"
            }`}
          >
            <Briefcase className="w-4 h-4" /> Hustle & Social Gigs
          </button>
          <button
            onClick={() => setActiveTab("school_cv")}
            className={`py-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 ${
              activeTab === "school_cv" ? "bg-emerald-500 text-slate-950" : "text-slate-400"
            }`}
          >
            <GraduationCap className="w-4 h-4" /> School & CV Agency
          </button>
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
