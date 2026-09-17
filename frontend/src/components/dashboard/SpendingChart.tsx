import { Card, CardHeader, CardContent } from '../ui/Card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { MonthlySpendingResponse } from '../../types';
import { formatCurrency } from '../../utils/formatCurrency';
import { useSettings } from '../../context/SettingsContext';

interface SpendingChartProps {
  data: MonthlySpendingResponse[];
}

export function SpendingChart({ data }: SpendingChartProps) {
  const settingsCtx = useSettings();
  const currency = settingsCtx?.currency || 'INR';


  return (
    <Card style={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 'var(--radius-xl)' }}>
      <CardHeader style={{ padding: '1.25rem 1.25rem 0.5rem 1.25rem' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>Spending Overview</h2>
      </CardHeader>
      <CardContent style={{ flexGrow: 1, height: '300px', padding: '0 1.25rem 1.25rem 0' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
              tickFormatter={(value) => `₹${(value / 1000)}k`}
              dx={-10}
            />
            <Tooltip 
              formatter={(value: any) => [formatCurrency(value as number, currency), 'Spent']}
              contentStyle={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}
              itemStyle={{ color: 'var(--color-text-primary)' }}
            />
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke="var(--color-primary)" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorAmount)" 
              activeDot={{ r: 6, fill: 'var(--color-primary)', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
