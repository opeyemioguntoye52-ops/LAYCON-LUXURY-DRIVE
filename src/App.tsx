/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import maybachHeroImg from './assets/images/car_maybach_s680_1793755719316.jpg';

// Supabase Configuration Constants
export const SUPABASE_URL = 'https://cqqzgmitspjmojyskvqv.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_qUhiNFojiNJfcw3dXGZQyw_SMnDg2jY';
export const ADMIN_USER_ID = 'd3e8c025-a4f4-45f6-99d7-852bf305a92e';

// Retrieve global Supabase client safely
declare global {
  interface Window {
    supabase?: {
      createClient: (url: string, key: string) => any;
    };
  }
}

export const supabase = (typeof window !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function')
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// Vehicle & Booking Interfaces
export interface Vehicle {
  id: string;
  name: string;
  category: string;
  description: string;
  specs: string;
  image_url: string;
  rate_1hr: number;
  rate_3hr: number;
  rate_6hr: number;
  rate_12hr: number;
  rate_daily: number;
  is_active?: boolean;
}

export interface Booking {
  id: string;
  vehicle_id: string;
  vehicle_name: string;
  customer_name: string;
  customer_phone: string;
  pickup_datetime: string;
  dropoff_datetime: string;
  service_type: string;
  delivery_location: string;
  estimated_total: number;
  status: string;
  notes?: string;
  created_at?: string;
}

// Change from hardcoded array to empty array
export const initialVehicles: Vehicle[] = [];
export const DEFAULT_VEHICLES: Vehicle[] = initialVehicles;


// Supabase fetching & seeding hooks querying 'vehicles' table
export async function fetchVehicles(): Promise<Vehicle[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('vehicles').select('*');
      if (!error && data && data.length > 0) {
        return data as Vehicle[];
      }
    } catch (e) {
      console.warn('Error fetching from vehicles table:', e);
    }
  }
  return DEFAULT_VEHICLES;
}

export async function seedVehicles(): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase.from('vehicles').upsert(DEFAULT_VEHICLES);
      if (!error) {
        console.log('Successfully seeded vehicles table in Supabase');
        return true;
      }
      console.warn('Failed to seed vehicles table:', error.message);
    } catch (e) {
      console.warn('Seed vehicles exception:', e);
    }
  }
  return false;
}

export async function deleteVehicle(vehicleId: string) {
  if (typeof window !== 'undefined' && !window.confirm("Are you sure you want to delete this vehicle?")) return;

  if (supabase) {
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', vehicleId);

    if (error) {
      console.error("Error deleting vehicle:", error.message);
      if (typeof window !== 'undefined') alert("Could not delete vehicle: " + error.message);
    } else {
      if (typeof window !== 'undefined') {
        alert("Vehicle deleted successfully!");
        if (typeof (window as any).loadFleetUI === 'function') (window as any).loadFleetUI();
        if (typeof (window as any).loadAdminAnalytics === 'function') (window as any).loadAdminAnalytics();
      }
    }
  }
}

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(DEFAULT_VEHICLES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetchVehicles().then((data) => {
      if (isMounted) {
        setVehicles(data);
        setLoading(false);
      }
    });

    if (supabase) {
      const channel = supabase
        .channel('public:vehicles')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'vehicles' }, () => {
          fetchVehicles().then((data) => {
            if (isMounted) setVehicles(data);
          });
        })
        .subscribe();

      return () => {
        isMounted = false;
        supabase.removeChannel(channel);
      };
    }
    return () => {
      isMounted = false;
    };
  }, []);

  return { vehicles, loading, refetch: () => fetchVehicles().then(setVehicles) };
}

// Hero Component featuring the Mercedes-Maybach S 680 V12 Executive flagship
export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-stone-800/60 pt-12 pb-20 lg:pt-20 lg:pb-28 bg-stone-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline & Editorial Prose */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-amber-500">
              <span>The Sovereign Collection</span>
              <span aria-hidden="true" className="text-stone-600">·</span>
              <span className="text-stone-400">Hourly to Daily Charters</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Unrivaled Prestige.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-stone-100 via-amber-200 to-amber-500">
                Mercedes-Maybach S 680 V12 Executive Flagship
              </span>
            </h1>

            <p className="text-base sm:text-lg text-stone-400 max-w-xl leading-relaxed">
              Experience bespoke access to our private collection led by the Mercedes-Maybach S 680 V12 Executive flagship. Handcrafted Nappa leather, reclining rear suites, and seamless WhatsApp concierge reservation.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a 
                href="#fleet" 
                className="px-6 py-3.5 text-sm font-semibold tracking-wide text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-amber-500/10"
              >
                <span>Reserve A Vehicle</span>
              </a>
            </div>
          </div>

          {/* Right Column: Hero Visual Frame with Maybach Image */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-stone-800 bg-stone-900 shadow-2xl group h-[380px] sm:h-[460px]">
              <img 
                src={maybachHeroImg} 
                alt="Mercedes-Maybach S 680 V12 Executive" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent"></div>
              
              {/* Bottom Scrim Callout */}
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-stone-950/80 backdrop-blur-md border border-stone-800/80 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold tracking-wider uppercase text-amber-400">Featured Flagship</p>
                  <p className="text-sm font-display font-bold text-white">Mercedes-Maybach S 680 V12 Executive Flagship</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-stone-400">Daily Charter from</p>
                  <p className="text-sm font-mono font-bold text-white tabular-nums">$2,800 <span className="text-[10px] text-stone-500 font-sans">/ 24h</span></p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default function App() {
  const { vehicles } = useVehicles();

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <Hero />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {vehicles.map((v) => (
            <div key={v.id} className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6">
              <h3 className="text-xl font-bold text-white">{v.name}</h3>
              <p className="text-sm text-stone-400 mt-2">{v.description}</p>
              <div className="mt-4 text-amber-400 font-mono font-bold">${v.rate_daily} / Day</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
