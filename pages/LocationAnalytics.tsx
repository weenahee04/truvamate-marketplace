import React from 'react';
import { useGlobal } from '../context/GlobalContext';
import { getLocationHistory, isFromUSA, isFromThailand } from '../services/locationService';
import { MapPin, Globe, Clock, Wifi, RefreshCw, History, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const LocationAnalytics: React.FC = () => {
  const { userLocation, isLoadingLocation, refreshLocation } = useGlobal();
  const locationHistory = getLocationHistory();

  const handleRefresh = async () => {
    await refreshLocation();
  };

  if (isLoadingLocation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20 pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <RefreshCw className="animate-spin mx-auto mb-4 text-brand-navy" size={48} />
            <p className="text-slate-600">กำลังตรวจสอบตำแหน่ง...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20 pb-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-900 mb-2">📍 Location Analytics</h1>
          <p className="text-slate-600">ข้อมูลตำแหน่งที่ตั้งของผู้เข้าใช้งาน</p>
        </div>

        {/* Current Location Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-brand-navy/10 p-3 rounded-xl">
                <MapPin className="text-brand-navy" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">ตำแหน่งปัจจุบัน</h2>
                <p className="text-sm text-slate-500">Current Location</p>
              </div>
            </div>
            <Button onClick={handleRefresh} variant="outline" className="gap-2">
              <RefreshCw size={16} />
              Refresh
            </Button>
          </div>

          {userLocation ? (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Location Details */}
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                  <Globe className="text-brand-gold mt-1" size={20} />
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Country</p>
                    <p className="text-lg font-bold text-slate-900">
                      {userLocation.country} ({userLocation.countryCode})
                    </p>
                    {isFromUSA(userLocation) && (
                      <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        🇺🇸 USA Access
                      </span>
                    )}
                    {isFromThailand(userLocation) && (
                      <span className="inline-block mt-1 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                        🇹🇭 Thailand Access
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                  <MapPin className="text-brand-navy mt-1" size={20} />
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Region / State</p>
                    <p className="text-lg font-bold text-slate-900">{userLocation.regionName}</p>
                    <p className="text-sm text-slate-600">{userLocation.city}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                  <Clock className="text-brand-gold mt-1" size={20} />
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Timezone</p>
                    <p className="text-lg font-bold text-slate-900">{userLocation.timezone}</p>
                  </div>
                </div>
              </div>

              {/* Technical Details */}
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                  <Wifi className="text-brand-navy mt-1" size={20} />
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">ISP Provider</p>
                    <p className="text-lg font-bold text-slate-900">{userLocation.isp}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                  <Globe className="text-brand-gold mt-1" size={20} />
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">IP Address</p>
                    <p className="text-lg font-mono font-bold text-slate-900">{userLocation.ip}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                  <MapPin className="text-brand-navy mt-1" size={20} />
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Coordinates</p>
                    <p className="text-sm font-mono text-slate-900">
                      Lat: {userLocation.lat.toFixed(4)}, Lon: {userLocation.lon.toFixed(4)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                  <Clock className="text-brand-gold mt-1" size={20} />
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Last Updated</p>
                    <p className="text-sm text-slate-900">
                      {new Date(userLocation.timestamp).toLocaleString('th-TH')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <MapPin className="mx-auto mb-4 text-slate-300" size={48} />
              <p className="text-slate-500 mb-4">ไม่สามารถตรวจสอบตำแหน่งได้</p>
              <Button onClick={handleRefresh} className="gap-2">
                <RefreshCw size={16} />
                ลองใหม่อีกครั้ง
              </Button>
            </div>
          )}
        </div>

        {/* Location History */}
        {locationHistory.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-brand-gold/10 p-3 rounded-xl">
                <History className="text-brand-gold" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">ประวัติการเข้าถึง</h2>
                <p className="text-sm text-slate-500">Recent Access History</p>
              </div>
            </div>

            <div className="space-y-3">
              {locationHistory.slice().reverse().map((location, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">
                      {location.countryCode === 'US' ? '🇺🇸' : location.countryCode === 'TH' ? '🇹🇭' : '🌍'}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">
                        {location.city}, {location.regionName}
                      </p>
                      <p className="text-sm text-slate-500">
                        {location.country} • {location.isp}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">
                      {new Date(location.timestamp).toLocaleDateString('th-TH')}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(location.timestamp).toLocaleTimeString('th-TH')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Summary */}
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
            <TrendingUp className="mb-3" size={32} />
            <p className="text-sm opacity-90 mb-1">Total Visits</p>
            <p className="text-3xl font-black">{locationHistory.length}</p>
          </div>

          <div className="bg-gradient-to-br from-brand-navy to-slate-800 rounded-2xl shadow-lg p-6 text-white">
            <Globe className="mb-3" size={32} />
            <p className="text-sm opacity-90 mb-1">Countries</p>
            <p className="text-3xl font-black">
              {new Set(locationHistory.map(l => l.countryCode)).size}
            </p>
          </div>

          <div className="bg-gradient-to-br from-brand-gold to-yellow-600 rounded-2xl shadow-lg p-6 text-white">
            <MapPin className="mb-3" size={32} />
            <p className="text-sm opacity-90 mb-1">Cities</p>
            <p className="text-3xl font-black">
              {new Set(locationHistory.map(l => l.city)).size}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
