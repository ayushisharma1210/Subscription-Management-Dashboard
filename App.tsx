import { useState } from 'react';
import { KeyMetrics } from './components/key-metrics';
import { SubscriptionList } from './components/subscription-list';
import { AddSubscriptionModal } from './components/add-subscription-modal';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import { Sparkles, Bell } from 'lucide-react';
import { Button } from './components/ui/button';

interface Subscription {
  id: string;
  name: string;
  cost: number;
  billingCycle: 'monthly' | 'yearly';
  nextBilling: string;
  category: string;
  color?: string;
}

// Mock data for demonstration
const initialSubscriptions: Subscription[] = [
  {
    id: '1',
    name: 'Netflix',
    cost: 649,
    billingCycle: 'monthly',
    nextBilling: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    category: 'Entertainment',
    color: '#E50914'
  },
  {
    id: '2',
    name: 'Spotify Premium',
    cost: 119,
    billingCycle: 'monthly',
    nextBilling: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days from now
    category: 'Music',
    color: '#1DB954'
  },
  {
    id: '3',
    name: 'Adobe Creative Cloud',
    cost: 1675,
    billingCycle: 'monthly',
    nextBilling: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(), // 18 days from now
    category: 'Work',
    color: '#FF0000'
  },
  {
    id: '4',
    name: 'Cult.fit',
    cost: 2399,
    billingCycle: 'monthly',
    nextBilling: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    category: 'Fitness',
    color: '#FF6B6B'
  },
  {
    id: '5',
    name: 'Microsoft 365',
    cost: 4200,
    billingCycle: 'yearly',
    nextBilling: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days from now
    category: 'Work',
    color: '#0078D4'
  },
  {
    id: '6',
    name: 'Disney+ Hotstar',
    cost: 1499,
    billingCycle: 'yearly',
    nextBilling: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(), // 120 days from now
    category: 'Entertainment',
    color: '#0F79AF'
  }
];

export default function App() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubscriptions);

  const handleAddSubscription = (newSubscription: Omit<Subscription, 'id'>) => {
    const subscription: Subscription = {
      ...newSubscription,
      id: crypto.randomUUID()
    };
    
    setSubscriptions(prev => [...prev, subscription]);
    toast.success(`${subscription.name} has been added to your subscriptions`, {
      description: `You'll be charged ₹${subscription.cost} ${subscription.billingCycle === 'yearly' ? 'per year' : 'per month'}`
    });
  };

  const handleDeleteSubscription = (id: string) => {
    const subscription = subscriptions.find(sub => sub.id === id);
    setSubscriptions(prev => prev.filter(sub => sub.id !== id));
    
    if (subscription) {
      toast.success(`${subscription.name} has been removed from your subscriptions`);
    }
  };

  // Check for upcoming payments in next 7 days for notification
  const urgentPayments = subscriptions.filter(sub => {
    const nextBilling = new Date(sub.nextBilling);
    const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const now = new Date();
    return nextBilling >= now && nextBilling <= sevenDaysFromNow;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="flex items-center gap-3 text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-200/50 flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                Clarity
              </h1>
              <p className="text-gray-600 text-base sm:text-lg font-medium">
                Welcome back! Here's your subscription overview for{' '}
                <span className="text-gray-900 font-semibold">
                  September 2025
                </span>
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              {urgentPayments.length > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl border border-orange-200 shadow-sm">
                  <Bell className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-semibold text-orange-800">
                    {urgentPayments.length} payment{urgentPayments.length !== 1 ? 's' : ''} due soon
                  </span>
                </div>
              )}
              {/* Desktop Add Button */}
              <div className="hidden sm:block">
                <AddSubscriptionModal onAddSubscription={handleAddSubscription} />
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <KeyMetrics subscriptions={subscriptions} />

        {/* Subscription List */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg shadow-gray-100/50 border border-white/50 p-6 sm:p-8">
          <SubscriptionList 
            subscriptions={subscriptions} 
            onDeleteSubscription={handleDeleteSubscription}
          />
        </div>

        {/* Mobile Add Button - Floating */}
        <div className="sm:hidden fixed bottom-6 right-6 z-50">
          <AddSubscriptionModal onAddSubscription={handleAddSubscription} />
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/50 shadow-sm">
            <p className="text-gray-600 text-base font-medium mb-3">
              Keep track of your subscriptions and take control of your finances with Clarity.
            </p>
            <p className="text-sm text-gray-500">
              💡 <strong className="text-gray-700">Pro tip:</strong> Review your subscriptions monthly to identify services you no longer use.
            </p>
          </div>
        </div>
      </div>
      
      <Toaster />
    </div>
  );
}