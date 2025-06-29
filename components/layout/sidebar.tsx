"use client";

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { 
  Home, 
  PawPrint, 
  Heart, 
  Dna, 
  Utensils, 
  Package, 
  DollarSign, 
  Calendar,
  BarChart3,
  Settings,
  X,
  Zap,
  Users,
  Bell,
  HelpCircle,
  Leaf,
  FileText,
  QrCode,
  TreePine,
  Activity,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Animals', href: '/animals', icon: PawPrint },
  { name: 'Health', href: '/health', icon: Heart },
  { name: 'Breeding', href: '/breeding', icon: Dna },
  { name: 'Family Tree', href: '/family-tree', icon: TreePine },
  { name: 'Feeding', href: '/feeding', icon: Utensils },
  { name: 'Production', href: '/production', icon: TrendingUp },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Finance', href: '/finance', icon: DollarSign },
  { name: 'Tasks', href: '/tasks', icon: Calendar },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Measurements', href: '/measurements', icon: Activity },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'IoT Sensors', href: '/sensors', icon: Zap },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'QR/RFID', href: '/qr-rfid', icon: QrCode },
];

const secondaryNavigation = [
  { name: 'Staff', href: '/staff', icon: UserCheck },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help & Support', href: '/help', icon: HelpCircle },
];

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function Sidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname();

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-emerald-200 dark:border-emerald-700">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
            AgroInsight
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-8 custom-scrollbar overflow-y-auto">
        <div>
          <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Farm Management
          </h3>
          <div className="mt-3 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/25'
                      : 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 dark:text-gray-300 dark:hover:text-emerald-400 dark:hover:bg-emerald-950/20'
                  )}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-5 w-5 transition-colors',
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                    )}
                  />
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 w-1 h-8 bg-white rounded-r-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            System
          </h3>
          <div className="mt-3 space-y-1">
            {secondaryNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/25'
                      : 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 dark:text-gray-300 dark:hover:text-emerald-400 dark:hover:bg-emerald-950/20'
                  )}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-5 w-5 transition-colors',
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Farm Stats */}
      <div className="px-6 py-4 border-t border-emerald-200 dark:border-emerald-700">
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-lg p-4 border border-emerald-200/50 dark:border-emerald-800/50">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                Farm Performance
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                +12% this month
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <X className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-900 border-r border-emerald-200 dark:border-emerald-700">
                  <SidebarContent />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-emerald-200/50 dark:border-emerald-700/50">
          <SidebarContent />
        </div>
      </div>
    </>
  );
}