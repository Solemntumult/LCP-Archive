import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  colorTheme?: 'green' | 'walnut' | 'gold' | 'blue' | 'rose';
  trend?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  colorTheme = 'green',
  trend,
}: StatCardProps) {
  const themeStyles = {
    green: {
      iconBg: 'bg-[#173124]/10 text-[#173124]',
      border: 'border-[#173124]/20',
      valueColor: 'text-[#173124]',
    },
    walnut: {
      iconBg: 'bg-[#7a5739]/10 text-[#7a5739]',
      border: 'border-[#7a5739]/20',
      valueColor: 'text-[#7a5739]',
    },
    gold: {
      iconBg: 'bg-[#c69214]/15 text-[#c69214]',
      border: 'border-[#c69214]/30',
      valueColor: 'text-[#8c6508]',
    },
    blue: {
      iconBg: 'bg-[#2980b9]/10 text-[#2980b9]',
      border: 'border-[#2980b9]/20',
      valueColor: 'text-[#2980b9]',
    },
    rose: {
      iconBg: 'bg-[#c0392b]/10 text-[#c0392b]',
      border: 'border-[#c0392b]/20',
      valueColor: 'text-[#c0392b]',
    },
  };

  const style = themeStyles[colorTheme];

  return (
    <div className={`bg-[#ffffff] p-5 rounded-2xl border ${style.border} vintage-shadow hover:translate-y-[-2px] transition-all`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#727973]">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${style.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className={`font-serif text-3xl font-bold tracking-tight ${style.valueColor}`}>
          {value}
        </span>
        {trend && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#f5ece5] text-[#424844]">
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-[#727973] mt-1.5 line-clamp-1">
          {subtitle}
        </p>
      )}
    </div>
  );
}
