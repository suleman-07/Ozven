import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Boxes,
  ClipboardList,
  Factory,
  FolderTree,
  Layers3,
  Package,
  PackagePlus,
  PaintBucket,
  Plus,
  Quote,
  Sparkles,
  TrendingUp,
  UserRound,
} from 'lucide-react'
import PageTitle from '../../components/common/PageTitle'
import Button from '../../components/ui/Button'
import StatCard from '../../components/ui/StatCard'
import { getDashboardData, getErrorMessage } from '../../services/adminApi'
import { formatDate } from '../../utils/formatters'

const statConfig = [
  {
    key: 'totalProducts',
    label: 'Total Products',
    helper: 'Catalog items',
    icon: Package,
    accent: 'bg-brand-600',
  },
  {
    key: 'totalCategories',
    label: 'Categories',
    helper: 'Catalog groups',
    icon: FolderTree,
    accent: 'bg-emerald-600',
  },
  {
    key: 'totalIndustries',
    label: 'Industries',
    helper: 'Market segments',
    icon: Factory,
    accent: 'bg-sky-600',
  },
  {
    key: 'totalMaterials',
    label: 'Materials',
    helper: 'Packaging stocks',
    icon: Layers3,
    accent: 'bg-violet-600',
  },
  {
    key: 'totalFinishes',
    label: 'Finishes',
    helper: 'Print treatments',
    icon: Sparkles,
    accent: 'bg-amber-600',
  },
  {
    key: 'totalBoxStyles',
    label: 'Box Styles',
    helper: 'Available structures',
    icon: Boxes,
    accent: 'bg-rose-600',
  },
  {
    key: 'totalQuotes',
    label: 'Total Quotes',
    helper: 'Customer requests',
    icon: ClipboardList,
    accent: 'bg-slate-900',
  },
]

const recentActivity = [
  {
    title: 'New quote request received',
    description: 'Sarah Johnson requested pricing for Custom Mailer Box.',
    time: '10 minutes ago',
    icon: Quote,
  },
  {
    title: 'Product added',
    description: 'Chocolate Gift Box was added to the product catalog.',
    time: '2 hours ago',
    icon: PackagePlus,
  },
  {
    title: 'Finish updated',
    description: 'Spot UV finish was marked active for product forms.',
    time: 'Yesterday',
    icon: PaintBucket,
  },
]

const quickActions = [
  {
    label: 'Add Product',
    description: 'Create a new catalog item',
    icon: Plus,
  },
  {
    label: 'Review Quotes',
    description: 'Check pending customer requests',
    icon: ClipboardList,
  },
  {
    label: 'Manage Categories',
    description: 'Organize product taxonomy',
    icon: FolderTree,
  },
  {
    label: 'Update Materials',
    description: 'Maintain stock options',
    icon: Layers3,
  },
]

function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalIndustries: 0,
    totalMaterials: 0,
    totalFinishes: 0,
    totalBoxStyles: 0,
    totalQuotes: 0,
    latestProducts: [],
    latestQuotes: [],
  })

  const loadDashboard = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const payload = await getDashboardData()

      setDashboardData({
        totalProducts: payload.totalProducts || 0,
        totalCategories: payload.totalCategories || 0,
        totalIndustries: payload.totalIndustries || 0,
        totalMaterials: payload.totalMaterials || 0,
        totalFinishes: payload.totalFinishes || 0,
        totalBoxStyles: payload.totalBoxStyles || 0,
        totalQuotes: payload.totalQuotes || 0,
        latestProducts: Array.isArray(payload.latestProducts) ? payload.latestProducts.map(normalizeProduct) : [],
        latestQuotes: Array.isArray(payload.latestQuotes) ? payload.latestQuotes.map(normalizeQuote) : [],
      })
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load dashboard data right now.'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadDashboard()
    }, 0)

    return () => clearTimeout(timer)
  }, [loadDashboard])

  const dashboardStats = useMemo(
    () =>
      statConfig.map((stat) => ({
        ...stat,
        value: dashboardData[stat.key].toLocaleString(),
      })),
    [dashboardData],
  )

  return (
    <section>
      <PageTitle
        title="Dashboard"
        description="Production-ready admin overview with live metrics, latest records, activity, and quick actions."
        action={
          <Button>
            <TrendingUp size={18} aria-hidden="true" />
            View Report
          </Button>
        }
      />

      {isLoading ? (
        <DashboardSkeleton />
      ) : error ? (
        <DashboardError message={error} onRetry={loadDashboard} />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {dashboardStats.map((stat) => (
              <StatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                helper={stat.helper}
                icon={stat.icon}
                accent={stat.accent}
              />
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
            <DashboardPanel title="Latest Products" description="Recently added catalog items">
              {dashboardData.latestProducts.length ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {dashboardData.latestProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-slate-50/70">
                          <td className="whitespace-nowrap px-4 py-4">
                            <div className="flex items-center gap-3">
                              <span className="flex size-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                                <Package size={19} aria-hidden="true" />
                              </span>
                              <div>
                                <p className="text-sm font-semibold text-slate-950">{product.name}</p>
                                <p className="text-xs text-slate-500">
                                  ID: PRD-{product.id.toString().padStart(3, '0')}
                                </p>
                              </div>
                            </div>
                          </td>
                          <TableCell>{product.category}</TableCell>
                          <td className="whitespace-nowrap px-4 py-4">
                            <StatusBadge status={product.status} />
                          </td>
                          <TableCell>{product.date}</TableCell>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState title="No products yet" description="Latest products will appear here." icon={Package} />
              )}
            </DashboardPanel>

            <DashboardPanel title="Latest Quote Requests" description="Newest customer quote inquiries">
              {dashboardData.latestQuotes.length ? (
                <div className="divide-y divide-slate-100">
                  {dashboardData.latestQuotes.map((quote) => (
                    <div key={quote.id} className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                        <UserRound size={19} aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-950">{quote.name}</p>
                        <p className="mt-1 truncate text-sm text-slate-500">{quote.product}</p>
                      </div>
                      <p className="shrink-0 text-xs font-medium text-slate-500">{quote.date}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="No quote requests" description="New quote requests will appear here." icon={InboxIcon} />
              )}
            </DashboardPanel>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <DashboardPanel title="Recent Activity" description="Operational updates across the admin">
              {recentActivity.length ? (
                <div className="space-y-4">
                  {recentActivity.map((activity) => {
                    const Icon = activity.icon

                    return (
                      <div key={activity.title} className="flex gap-3 rounded-lg bg-slate-50 p-4">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white text-brand-600 ring-1 ring-slate-200">
                          <Icon size={19} aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-950">{activity.title}</p>
                          <p className="mt-1 text-sm leading-5 text-slate-500">{activity.description}</p>
                          <p className="mt-2 text-xs font-medium text-slate-400">{activity.time}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <EmptyState title="No activity yet" description="Recent admin events will appear here." icon={TrendingUp} />
              )}
            </DashboardPanel>

            <DashboardPanel title="Quick Actions" description="Common admin workflows">
              {quickActions.length ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {quickActions.map((action) => {
                    const Icon = action.icon

                    return (
                      <button
                        key={action.label}
                        type="button"
                        className="rounded-lg border border-slate-200 bg-white p-4 text-left transition hover:border-brand-200 hover:bg-brand-50"
                      >
                        <span className="flex size-10 items-center justify-center rounded-lg bg-slate-900 text-white">
                          <Icon size={19} aria-hidden="true" />
                        </span>
                        <p className="mt-4 text-sm font-semibold text-slate-950">{action.label}</p>
                        <p className="mt-1 text-sm leading-5 text-slate-500">{action.description}</p>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <EmptyState title="No quick actions" description="Admin shortcuts will appear here." icon={Plus} />
              )}
            </DashboardPanel>
          </div>
        </div>
      )}
    </section>
  )
}

function DashboardPanel({ title, description, children }) {
  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-950">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <div className="p-5">{children}</div>
    </article>
  )
}

function TableHead({ children }) {
  return (
    <th
      scope="col"
      className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
    >
      {children}
    </th>
  )
}

function TableCell({ children }) {
  return <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">{children}</td>
}

function StatusBadge({ status }) {
  const styles = {
    Active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
    Draft: 'bg-amber-50 text-amber-700 ring-amber-600/10',
    Inactive: 'bg-slate-100 text-slate-600 ring-slate-500/10',
  }

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${styles[status]}`}>
      {status}
    </span>
  )
}

function DashboardError({ message, onRetry }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-5 py-14 text-center shadow-sm">
      <p className="text-sm font-semibold text-slate-950">Unable to load dashboard</p>
      <p className="mt-1 text-sm text-slate-500">{message}</p>
      <Button variant="secondary" className="mt-4" onClick={onRetry}>
        Try again
      </Button>
    </div>
  )
}

function EmptyState({ title, description, icon: Icon }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 px-4 py-10 text-center">
      <span className="mx-auto flex size-12 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        <Icon size={24} aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-base font-semibold text-slate-950">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="w-full">
                <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />
                <div className="mt-3 h-7 w-16 animate-pulse rounded bg-slate-100" />
              </div>
              <div className="size-11 animate-pulse rounded-lg bg-slate-100" />
            </div>
            <div className="mt-4 h-4 w-36 animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
        <SkeletonPanel rows={4} />
        <SkeletonPanel rows={3} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SkeletonPanel rows={3} />
        <SkeletonPanel rows={4} />
      </div>
    </div>
  )
}

function SkeletonPanel({ rows }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="h-5 w-40 animate-pulse rounded bg-slate-100" />
      <div className="mt-2 h-4 w-56 animate-pulse rounded bg-slate-100" />
      <div className="mt-6 space-y-4">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="size-10 animate-pulse rounded-lg bg-slate-100" />
            <div className="flex-1">
              <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
              <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function InboxIcon(props) {
  return <ClipboardList {...props} />
}

function normalizeProduct(product) {
  return {
    id: product.id,
    name: product.name || 'Untitled Product',
    category: product.category?.name || 'Uncategorized',
    status: mapProductStatus(product.status),
    date: formatDate(product.createdAt, 'Not available'),
  }
}

function normalizeQuote(quote) {
  return {
    id: quote.id,
    name: quote.name || 'Unknown Contact',
    product: quote.product?.name || 'General Quote',
    date: formatDate(quote.createdAt, 'Not available'),
  }
}

function mapProductStatus(status) {
  if (status === 'ACTIVE') {
    return 'Active'
  }

  if (status === 'INACTIVE') {
    return 'Inactive'
  }

  return status || 'Active'
}

export default DashboardPage
