import {
  Boxes,
  ChartNoAxesColumnIncreasing,
  ClipboardList,
  Factory,
  FolderTree,
  Layers3,
  Package,
  PaintBucket,
  Sparkles,
} from 'lucide-react'

export const navigationItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: ChartNoAxesColumnIncreasing,
  },
  {
    label: 'Categories',
    path: '/categories',
    icon: FolderTree,
  },
  {
    label: 'Industries',
    path: '/industries',
    icon: Factory,
  },
  {
    label: 'Box Styles',
    path: '/box-styles',
    icon: Boxes,
  },
  {
    label: 'Materials',
    path: '/materials',
    icon: Layers3,
  },
  {
    label: 'Finishes',
    path: '/finishes',
    icon: Sparkles,
  },
  {
    label: 'Products',
    path: '/products',
    icon: Package,
  },
  {
    label: 'Quotes',
    path: '/quotes',
    icon: ClipboardList,
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
