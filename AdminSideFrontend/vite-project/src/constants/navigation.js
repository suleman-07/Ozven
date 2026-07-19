import {
  ChartNoAxesColumnIncreasing,
  ClipboardList,
  FolderTree,
  Package,
  PaintBucket,
  Settings,
} from 'lucide-react'

export const navigationItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: ChartNoAxesColumnIncreasing,
  },
  {
    label: 'Products',
    path: '/products',
    icon: Package,
  },
  {
    label: 'Categories',
    path: '/categories',
    icon: FolderTree,
  },
  {
    label: 'Quote Requests',
    path: '/quote-requests',
    icon: ClipboardList,
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: Settings,
  },
]

export const quickActions = [
  {
    label: 'Review artwork',
    value: '18',
    accent: 'bg-sky-500',
    icon: PaintBucket,
  },
  {
    label: 'Pending quotes',
    value: '42',
    accent: 'bg-amber-500',
    icon: ClipboardList,
  },
  {
    label: 'Live products',
    value: '256',
    accent: 'bg-emerald-500',
    icon: Package,
  },
]
