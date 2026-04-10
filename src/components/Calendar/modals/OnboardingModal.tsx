import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Upload, Check, ChevronRight, X, User } from 'lucide-react';
import { UserProfile } from '../../../hooks/useCalendar';
import { cn } from '../../../utils';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
  onComplete: () => void;
  themeColor: string;
}

export function OnboardingModal({
  isOpen, onClose, userProfile, setUserProfile, onComplete, themeColor
}: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stop camera stream on unmount or step change
  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [step]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      setCameraError("Camera access denied. Please use the upload option.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setUserProfile({ ...userProfile, photo: dataUrl });
        setIsCameraActive(false);
        // Stop the stream
        if (video.srcObject) {
          const tracks = (video.srcObject as MediaStream).getTracks();
          tracks.forEach(track => track.stop());
        }
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserProfile({ ...userProfile, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else onComplete();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-on-surface/30 backdrop-blur-2xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="relative w-full max-w-2xl bg-surface/90 backdrop-blur-3xl rounded-[3rem] shadow-2xl overflow-hidden border border-white/20 min-h-[500px] flex flex-col"
          >
            {/* Header / Skip */}
            <div className="p-8 flex justify-between items-center">
              <div className="flex gap-2">
                {[1, 2, 3].map(s => (
                  <div 
                    key={s} 
                    className={cn(
                      "h-1 w-8 rounded-full transition-all duration-500",
                      s <= step ? "" : "bg-outline/10"
                    )}
                    style={s <= step ? { backgroundColor: themeColor } : {}}
                  />
                ))}
              </div>
              <button 
                onClick={onClose}
                className="text-on-surface-variant hover:text-on-surface text-[10px] uppercase tracking-widest font-bold"
              >
                Skip for now
              </button>
            </div>

            <div className="flex-1 px-8 sm:px-16 pb-12 flex flex-col items-center text-center justify-center relative overflow-hidden">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-8 transform rotate-3">
                       <Check size={32} style={{ color: themeColor }} />
                    </div>
                    <h2 className="serif-italic text-4xl sm:text-5xl leading-tight">Welcome to <br/>The Curator</h2>
                    <p className="text-on-surface-variant text-sm sm:text-base max-w-sm mx-auto leading-relaxed">
                      A premium editorial space for your memories, plans, and reflections. Let's personalize your experience.
                    </p>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="w-full space-y-8"
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold opacity-60">Visual Identity</span>
                      <h2 className="serif-italic text-4xl leading-tight">What shall we <br/>call you?</h2>
                    </div>
                    
                    <div className="relative max-w-sm mx-auto">
                      <input
                        autoFocus
                        type="text"
                        value={userProfile.name}
                        onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                        placeholder="Your display name"
                        className="w-full bg-transparent border-none text-center text-2xl sm:text-3xl serif-italic focus:ring-0 p-4 border-b border-outline/20 hover:border-outline/40 transition-all"
                      />
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="w-full space-y-6"
                  >
                    <div className="space-y-2 mb-4">
                      <span className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold opacity-60">Authentication</span>
                      <h2 className="serif-italic text-4xl leading-tight">Add a Curator's <br/>Selfie</h2>
                    </div>

                    <div className="relative group mx-auto w-40 h-40">
                      <div className="w-full h-full rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl bg-outline/5 relative">
                        {isCameraActive ? (
                          <div className="absolute inset-0 bg-black">
                            <video 
                              ref={videoRef} 
                              autoPlay 
                              playsInline 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <button 
                                onClick={capturePhoto}
                                className="w-12 h-12 rounded-full border-4 border-white bg-white/20 backdrop-blur-sm active:scale-90 transition-all"
                              />
                            </div>
                          </div>
                        ) : (
                          <img 
                            src={userProfile.photo} 
                            alt="Profile" 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                          />
                        )}
                      </div>
                      
                      {!isCameraActive && (
                        <div className="absolute -bottom-2 -right-2 flex gap-2">
                          <button 
                            onClick={startCamera}
                            className="p-3 bg-white rounded-2xl shadow-lg border border-black/5 hover:scale-110 active:scale-95 transition-all text-on-surface"
                            aria-label="Take Photo"
                          >
                            <Camera size={18} />
                          </button>
                          <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="p-3 bg-white rounded-2xl shadow-lg border border-black/5 hover:scale-110 active:scale-95 transition-all text-on-surface"
                            aria-label="Upload Photo"
                          >
                            <Upload size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {cameraError && (
                      <p className="text-red-500 text-[10px] uppercase font-bold tracking-widest">{cameraError}</p>
                    )}

                    <p className="text-on-surface-variant text-[11px] uppercase tracking-widest font-bold opacity-40">
                      Supports JPG, PNG or Direct Capture
                    </p>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                    />
                    <canvas ref={canvasRef} className="hidden" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation Footer */}
            <div className="p-8 pb-12 sm:px-16 flex justify-between items-center mt-auto">
               {step > 1 ? (
                 <button 
                   onClick={() => setStep(step - 1)}
                   className="text-on-surface-variant text-[10px] uppercase tracking-[0.2em] font-bold"
                 >
                   Back
                 </button>
               ) : <div />}

               <button
                  onClick={nextStep}
                  style={{ backgroundColor: themeColor, boxShadow: `0 10px 30px -5px ${themeColor}50` }}
                  className="px-10 py-5 rounded-2xl text-[11px] uppercase tracking-[0.3em] font-bold text-white flex items-center gap-3 hover:opacity-90 active:scale-95 transition-all"
                >
                  {step === 3 ? 'Get Started' : 'Next'}
                  <ChevronRight size={14} />
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
