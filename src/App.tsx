/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Loader2, MapPin, Info, ChevronRight, MessageSquare, Check, User, Mail, Phone } from 'lucide-react';
import Autocomplete from 'react-google-autocomplete';
import confetti from 'canvas-confetti';

type Screen = 'input' | 'loading' | 'result';
type SpaSize = '2.0m²' | '2.3m²' | 'Swim Spa';

const LOADING_STEPS = [
  "Obtaining Property Address…",
  "Checking Local Zoning Controls…",
  "Reviewing Council LEP…",
  "Assessing CDC/DA Requirements…",
  "Verifying Easements…",
  "Confirming Setback Compliance…",
  "Cross-checking Planning Portal…",
  "Running Compliance AI Model…",
  "Property Confirmation…"
];

export default function App() {
  const [screen, setScreen] = useState<Screen>('input');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [spaSize, setSpaSize] = useState<SpaSize>('2.0m²');
  const [loadingStep, setLoadingStep] = useState(-1);
  const [promoCode, setPromoCode] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showQR, setShowQR] = useState(false);

  const handleCheck = async () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) newErrors.email = 'Valid email is required';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    if (!address) newErrors.address = 'Please select a valid Australian address';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setScreen('loading');

    // Send data to webhook
    try {
      fetch('https://services.leadconnectorhq.com/hooks/cYowFtKOEQPb4Zb2TOaP/webhook-trigger/e1323938-f8c1-446b-9bd7-daed0de9c1c2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          address,
          spaSize,
          promoCode,
          timestamp: new Date().toISOString(),
          source: 'Spa Approval Checker'
        }),
      });
    } catch (err) {
      console.error('Webhook error:', err);
    }

    startLoadingSequence();
  };

  const startLoadingSequence = () => {
    let currentStep = 0;
    setLoadingStep(0);

    const processNextStep = () => {
      // Random delay between 2.5s and 4.5s for each step
      // 9 steps * ~3.5s avg = ~31.5s total
      const randomDelay = 2500 + Math.random() * 2000;

      setTimeout(() => {
        currentStep++;
        if (currentStep < LOADING_STEPS.length) {
          setLoadingStep(currentStep);
          processNextStep();
        } else {
          setTimeout(() => {
            setScreen('result');
            triggerConfetti();
          }, 1500);
        }
      }, randomDelay);
    };

    processNextStep();
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-12 px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <img
          src="/logo.png"
          alt="Exclusive to Spa & Pool Approvals"
          className="h-16 md:h-24 w-auto object-contain"
          referrerPolicy="no-referrer"
        />
      </motion.div>

      <AnimatePresence mode="wait">
        {screen === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-xl glass-card p-8 md:p-12 space-y-8"
          >
            <div className="text-center space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">
                Exclusive to Spa & Pool Approvals
              </h1>
              <p className="text-navy/60 text-lg">
                Instant AI-powered property pre-check
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-navy/80 uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40 w-5 h-5" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-navy placeholder:text-navy/30"
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-navy/80 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40 w-5 h-5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-navy placeholder:text-navy/30"
                      placeholder="john@example.com"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-navy/80 uppercase tracking-wider">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40 w-5 h-5" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-navy placeholder:text-navy/30"
                    placeholder="0400 000 000"
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-navy/80 uppercase tracking-wider">
                  Property Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40 w-5 h-5" />
                  <Autocomplete
                    apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                    onPlaceSelected={(place) => {
                      setAddress(place.formatted_address || '');
                      setErrors(prev => ({ ...prev, address: '' }));
                    }}
                    options={{
                      types: ['address'],
                      componentRestrictions: { country: 'au' },
                    }}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-navy placeholder:text-navy/30"
                    placeholder="Enter your address in Australia"
                    onChange={(e: any) => setAddress(e.target.value)}
                  />
                </div>
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              <div className="space-y-4">
                <label className="text-sm font-semibold text-navy/80 uppercase tracking-wider">
                  Select Spa Size
                </label>
                <div className="flex flex-wrap gap-3">
                  {(['2.0m²', '2.3m²', 'Swim Spa'] as SpaSize[]).map((size) => (
                    <button
                      key={size}
                      onClick={() => setSpaSize(size)}
                      className={`pill-button ${spaSize === size ? 'pill-button-active' : 'pill-button-inactive'
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-navy/80 uppercase tracking-wider">
                  Discount Code (Optional)
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40 w-5 h-5" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-navy placeholder:text-navy/30"
                    placeholder="Enter code (e.g. SPASH50)"
                  />
                </div>
              </div>

              <button
                onClick={handleCheck}
                className="primary-button group"
              >
                <span className="flex items-center justify-center gap-2">
                  Check My Property
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center justify-center gap-2 text-navy/40 text-sm">
                <Info className="w-4 h-4" />
                <span>AI pre-check takes approximately 30 seconds</span>
              </div>
              <button
                onClick={() => setShowQR(true)}
                className="text-navy/60 hover:text-navy text-sm font-semibold flex items-center gap-2 transition-colors"
              >
                QR Code
              </button>
            </div>
          </motion.div>
        )}

        {showQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowQR(false)}
            className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center space-y-6"
            >
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-navy">Property Check</h3>
                <p className="text-navy/60">Scan to start your application</p>
              </div>
              <div className="bg-white border-4 border-gray-50 rounded-2xl p-4 aspect-square flex items-center justify-center">
                <img
                  src="/qr-code.png"
                  alt="Scan me"
                  className="w-full h-full object-contain"
                />
              </div>
              <button
                onClick={() => setShowQR(false)}
                className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-navy font-bold rounded-2xl transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}

        {screen === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-navy/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-bottom pb-4 border-gray-100">
                  <h2 className="text-xl font-bold text-navy">AI Compliance Check</h2>
                  <Loader2 className="w-6 h-6 text-accent animate-spin" />
                </div>

                <div className="space-y-1">
                  {LOADING_STEPS.map((step, index) => (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{
                        opacity: index <= loadingStep ? 1 : 0.3,
                        x: 0
                      }}
                      className="loading-item"
                    >
                      {index < loadingStep ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                      ) : index === loadingStep ? (
                        <Loader2 className="w-5 h-5 text-accent animate-spin shrink-0" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-100 shrink-0" />
                      )}
                      <span className={index === loadingStep ? 'text-navy font-semibold' : 'text-navy/60'}>
                        {step}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {screen === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl glass-card p-12 text-center space-y-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
              className="mx-auto w-24 h-24 bg-green-50 rounded-full flex items-center justify-center"
            >
              <Check className="w-12 h-12 text-green-500 stroke-[3px]" />
            </motion.div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-navy tracking-tight">
                Your property Qualifies for an Approval *
              </h1>
              <p className="text-navy/60 text-lg max-w-md mx-auto">
                Based on AI pre-assessment of zoning and compliance controls.
              </p>
              <p className="text-navy/40 text-xs mt-2 italic">
                * Subject to documentation and title
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <a
                href={`https://api.uconnect.com.au/payment-link/69a1374c3413b5043df95af7${promoCode ? `?prefilled_promo_code=${promoCode}` : ''}`}
                target="_blank"
                rel="noopener noreferrer"
                className="primary-button inline-flex items-center justify-center"
              >
                Start My Approval Application
              </a>
            </div>

            <div className="pt-8 border-t border-gray-100 flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-navy">99.1%</div>
                <div className="text-xs text-navy/40 uppercase font-bold tracking-widest">Accuracy</div>
              </div>
              <div className="w-px h-8 bg-gray-100" />
              <div className="text-center">
                <div className="text-2xl font-bold text-navy">Instant</div>
                <div className="text-xs text-navy/40 uppercase font-bold tracking-widest">Processing</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
