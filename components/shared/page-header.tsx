'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  badge?: string
  badgeColor?: string
  title: string
  titleHighlight?: string
  description?: string
  className?: string
  children?: React.ReactNode
}

export function PageHeader({
  badge,
  badgeColor = 'text-galorys-purple',
  title,
  titleHighlight,
  description,
  className,
  children,
}: PageHeaderProps) {
  // Separar título e highlight se fornecido junto
  const renderTitle = () => {
    if (titleHighlight) {
      return (
        <>
          {title}{' '}
          <span className="text-gradient">{titleHighlight}</span>
        </>
      )
    }
    return title
  }

  return (
    <section className={cn('container-galorys mb-16', className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl"
      >
        {badge && (
          <span className={cn(
            'text-sm font-semibold tracking-wider uppercase mb-4 block',
            badgeColor
          )}>
            {badge}
          </span>
        )}
        
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          {renderTitle()}
        </h1>
        
        {description && (
          <p className="text-gray-400 text-lg leading-relaxed">
            {description}
          </p>
        )}

        {children && (
          <div className="mt-6">
            {children}
          </div>
        )}
      </motion.div>
    </section>
  )
}

// Variante com breadcrumb
interface PageHeaderWithBreadcrumbProps extends PageHeaderProps {
  breadcrumbs: Array<{ label: string; href?: string }>
}

export function PageHeaderWithBreadcrumb({
  breadcrumbs,
  ...props
}: PageHeaderWithBreadcrumbProps) {
  return (
    <div>
      {/* Breadcrumb */}
      <div className="container-galorys pt-24 pb-4">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center gap-2">
              {index > 0 && <span>/</span>}
              {crumb.href ? (
                <a href={crumb.href} className="hover:text-white transition-colors">
                  {crumb.label}
                </a>
              ) : (
                <span className="text-gray-400">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>
      
      {/* Header */}
      <PageHeader {...props} className="pt-4" />
    </div>
  )
}
