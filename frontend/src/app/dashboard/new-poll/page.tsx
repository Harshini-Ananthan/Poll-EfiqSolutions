"use client";

import React, { useState } from "react";
import { Plus, X, Smartphone, Bell, History, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NewPollPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [cutoffTime, setCutoffTime] = useState("");
  const [options, setOptions] = useState([
    { text: "", type: "General" },
    { text: "", type: "General" },
  ]);
  const [settings, setSettings] = useState({
    pushNotification: true,
    voteEditing: false,
    sendReminder: true,
  });

  React.useEffect(() => {
    const defaultTime = new Date();
    defaultTime.setHours(defaultTime.getHours() + 2);
    const year = defaultTime.getFullYear();
    const month = (defaultTime.getMonth() + 1).toString().padStart(2, '0');
    const day = defaultTime.getDate().toString().padStart(2, '0');
    const hours = defaultTime.getHours().toString().padStart(2, '0');
    const minutes = defaultTime.getMinutes().toString().padStart(2, '0');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCutoffTime(`${year}-${month}-${day}T${hours}:${minutes}`);
  }, []);

  const handleSubmit = async () => {
    if (!question || options.some(o => !o.text) || !cutoffTime) {
      alert("Please fill in all fields including the cutoff time");
      return;
    }

    let finalCutoffTime = undefined;
    if (cutoffTime) {
      finalCutoffTime = new Date(cutoffTime).toISOString();
    }

    setLoading(true);
    try {
      await api.post("/polls", {
        question,
        options: options.map(o => ({ optionText: o.text, type: o.type })),
        sendPushNotification: settings.pushNotification,
        allowVoteEdit: settings.voteEditing,
        sendReminder: settings.sendReminder,
        cutoffTime: finalCutoffTime,
      });
      router.push("/dashboard");
    } catch (err) {
      console.error("Failed to create poll", err);
      alert("Failed to create poll");
    } finally {
      setLoading(false);
    }
  };

  const addOption = () => {
    setOptions([...options, { text: "", type: "General" }]);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, text: string) => {
    const newOptions = [...options];
    newOptions[index].text = text;
    setOptions(newOptions);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <header className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-bold uppercase tracking-wide text-white">Create New Poll</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* FORM SECTION */}
        <section className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-3 uppercase tracking-wider">Poll Question</label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ex: Today lunch menu"
                className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-6 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all font-medium"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-3 uppercase tracking-wider">Cutoff Time</label>
              <input
                type="datetime-local"
                value={cutoffTime}
                onChange={(e) => setCutoffTime(e.target.value)}
                className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-6 py-4 text-white focus:outline-none focus:border-blue-500/50 transition-all font-medium"
                style={{ colorScheme: 'dark' }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-gray-400 text-sm font-medium uppercase tracking-wider">Options</label>
              <button
                onClick={addOption}
                className="text-blue-500 hover:text-blue-400 text-sm font-bold flex items-center gap-1.5 transition-colors"
                type="button"
              >
                <Plus size={16} /> Add Option
              </button>
            </div>

            <div className="space-y-4">
              {options.map((opt, index) => (
                <div key={index} className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                    />
                  </div>
                  <button
                    onClick={() => removeOption(index)}
                    className="p-3 text-gray-500 hover:text-red-500 transition-colors"
                    disabled={options.length <= 1}
                    type="button"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-[#333] space-y-6">
            <label className="block text-gray-400 text-sm font-medium uppercase tracking-wider">Settings</label>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#1e1e1e] rounded-xl border border-[#333]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Send Push Notification</p>
                    <p className="text-xs text-gray-500">Notify users on WhatsApp</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.pushNotification}
                  onChange={(e) => setSettings({ ...settings, pushNotification: e.target.checked })}
                  className="w-5 h-5 accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-[#1e1e1e] rounded-xl border border-[#333]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                    <History size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Allow Vote Editing</p>
                    <p className="text-xs text-gray-500">Users can change their mind</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.voteEditing}
                  onChange={(e) => setSettings({ ...settings, voteEditing: e.target.checked })}
                  className="w-5 h-5 accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-[#1e1e1e] rounded-xl border border-[#333]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                    <Bell size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Send Reminder</p>
                    <p className="text-xs text-gray-500">Remind non-voted users at 11:30</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.sendReminder}
                  onChange={(e) => setSettings({ ...settings, sendReminder: e.target.checked })}
                  className="w-5 h-5 accent-blue-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all mt-4 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Launch Poll Now"}
          </button>
        </section>

        {/* PREVIEW SECTION */}
        <section className="hidden lg:block">
          <div className="sticky top-10 flex flex-col items-center">
            <div className="w-[300px]">
              <label className="block text-gray-400 text-sm font-medium mb-3 uppercase tracking-wider text-left">Live Preview</label>
            </div>
            <div className="bg-[#1e1e1e] border-4 border-[#333] rounded-[3rem] p-6 h-[600px] w-[300px] relative overflow-hidden shadow-2xl">
              {/* Phone Speaker/Camera */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-[#333] rounded-b-2xl"></div>

              <div className="mt-12 text-center">
                <Image 
                  src="/icon.png" 
                  alt="Poll Icon" 
                  width={144}
                  height={144}
                  className="w-36 h-36 mx-auto mb-6 object-contain"
                />
                <h3 className="text-lg font-bold mb-8 px-4 text-balance">
                  {question || "Poll Question Preview"}
                </h3>

                <div className="space-y-3 px-4">
                  {options.map((opt, i) => (
                    <div key={i} className="bg-[#242424] border border-[#333] rounded-xl px-4 py-3 text-sm font-semibold text-left flex items-center justify-between group cursor-default">
                      <span>{opt.text || `Option ${i + 1}`}</span>
                      <div className="w-4 h-4 rounded-full border border-gray-600 group-hover:border-blue-500 transition-colors"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Home Indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gray-600 rounded-full"></div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
