import React, { useState, useMemo } from 'react';
import { CalendarIcon, Users, Search, Minus, Plus, Compass, Car } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { transfers, tours } from '@/data/catalog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function BookingBar({ onBook }) {
  const [selectedServiceId, setSelectedServiceId] = useState('fortaleza');
  const [date, setDate] = useState(() => format(addDays(new Date(), 1), 'yyyy-MM-dd'));
  const [passengers, setPassengers] = useState(2);

  // Lista unificada de opções para o dropdown do BookingBar
  const serviceOptions = useMemo(() => {
    const transferOpts = transfers.map((t) => ({
      id: t.id,
      title: t.title,
      type: 'Transfer',
      category: 'transfer',
      rawItem: t.raw || t,
    }));
    const tourOpts = tours.map((t) => ({
      id: t.id,
      title: t.title,
      type: 'Passeio',
      category: 'tour',
      rawItem: t.raw || t,
    }));
    return [...transferOpts, ...tourOpts];
  }, []);

  const handleSearch = () => {
    const selectedObj = serviceOptions.find((s) => s.id === selectedServiceId) || serviceOptions[0];
    if (onBook && selectedObj) {
      onBook(selectedObj.rawItem, {
        date: date ? new Date(date) : addDays(new Date(), 1),
        passengers,
      });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <div className="backdrop-blur-md bg-white/95 dark:bg-zinc-900/95 border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xl rounded-2xl md:rounded-full p-2.5 sm:p-3 transition-all duration-300">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3 items-center">
          
          {/* 1. Seleção do Serviço / Destino */}
          <div className="md:col-span-4 flex items-center gap-3.5 px-4 py-2.5 border-b md:border-b-0 md:border-r border-zinc-200/80 dark:border-zinc-800/80 h-full">
            <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 shadow-sm">
              <Compass className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-0.5 leading-none">
                Serviço ou Passeio
              </label>
              <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
                <SelectTrigger className="h-6 border-0 p-0 text-xs font-bold text-zinc-900 dark:text-white shadow-none focus:ring-0 bg-transparent cursor-pointer truncate flex items-center">
                  <SelectValue placeholder="Selecione o serviço" />
                </SelectTrigger>
                <SelectContent className="z-[150] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-xl max-h-64">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Transfers Premium
                  </div>
                  {transfers.map((t) => (
                    <SelectItem key={t.id} value={t.id} className="text-xs py-2 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Car className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{t.title}</span>
                      </div>
                    </SelectItem>
                  ))}
                  <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider border-t border-zinc-100 dark:border-zinc-800 mt-1 pt-2">
                    Passeios Exclusivos
                  </div>
                  {tours.map((t) => (
                    <SelectItem key={t.id} value={t.id} className="text-xs py-2 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Compass className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="truncate">{t.title}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 2. Seleção da Data */}
          <div className="md:col-span-3 flex items-center gap-3.5 px-4 py-2.5 border-b md:border-b-0 md:border-r border-zinc-200/80 dark:border-zinc-800/80 h-full">
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 shadow-sm">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <label htmlFor="booking-bar-date" className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-0.5 leading-none">
                Data Prevista
              </label>
              <input
                id="booking-bar-date"
                type="date"
                value={date}
                min={format(new Date(), 'yyyy-MM-dd')}
                onChange={(e) => setDate(e.target.value)}
                className="h-6 w-full border-0 p-0 text-xs font-bold text-zinc-900 dark:text-white bg-transparent focus:outline-none cursor-pointer leading-none"
              />
            </div>
          </div>

          {/* 3. Seleção de Passageiros (PAX) */}
          <div className="md:col-span-3 flex items-center gap-3.5 px-4 py-2.5 h-full">
            <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0 shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-0.5 leading-none">
                Passageiros
              </label>
              <div className="flex items-center gap-2 h-6">
                <button
                  type="button"
                  onClick={() => setPassengers((prev) => Math.max(1, prev - 1))}
                  disabled={passengers <= 1}
                  className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center text-xs font-bold transition-all disabled:opacity-30 cursor-pointer"
                  aria-label="Diminuir passageiros"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-xs font-bold text-zinc-900 dark:text-white min-w-[1.25rem] text-center select-none leading-none">
                  {passengers} {passengers === 1 ? 'Pessoa' : 'Pessoas'}
                </span>
                <button
                  type="button"
                  onClick={() => setPassengers((prev) => prev + 1)}
                  className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center text-xs font-bold transition-all cursor-pointer"
                  aria-label="Aumentar passageiros"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* 4. Botão de Ação Flutuante */}
          <div className="md:col-span-2 flex items-center justify-end">
            <Button
              onClick={handleSearch}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold px-5 h-11 shadow-lg shadow-emerald-600/30 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer text-sm"
            >
              <Search className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span>Cotar</span>
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
