'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner, ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <>
      <style jsx global>{`
        /* Sonner Toast Custom Styles */
        [data-sonner-toast] {
          background: hsl(var(--background) / 0.85) !important;
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
          border: 1px solid hsl(var(--border) / 0.5) !important;
          color: hsl(var(--foreground)) !important;
        }
        
        [data-sonner-toast][data-type="success"] {
          background: hsl(var(--background) / 0.85) !important;
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
          color: hsl(var(--primary)) !important;
          border-left: 3px solid hsl(var(--primary)) !important;
        }
        
        [data-sonner-toast][data-type="success"] [data-title],
        [data-sonner-toast][data-type="success"] [data-description] {
          color: hsl(var(--primary)) !important;
        }
        
        [data-sonner-toast][data-type="error"] {
          background: hsl(var(--background) / 0.85) !important;
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
          color: hsl(var(--destructive)) !important;
          border-left: 3px solid hsl(var(--destructive)) !important;
        }
        
        [data-sonner-toast][data-type="error"] [data-title],
        [data-sonner-toast][data-type="error"] [data-description] {
          color: hsl(var(--destructive)) !important;
        }
        
        [data-sonner-toast][data-type="info"] {
          background: hsl(var(--background) / 0.85) !important;
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
          color: hsl(var(--primary)) !important;
          border-left: 3px solid hsl(var(--primary)) !important;
        }
        
        [data-sonner-toast][data-type="info"] [data-title],
        [data-sonner-toast][data-type="info"] [data-description] {
          color: hsl(var(--primary)) !important;
        }
        
        [data-sonner-toast][data-type="warning"] {
          background: hsl(var(--background) / 0.85) !important;
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
          color: hsl(var(--warning-foreground)) !important;
          border-left: 3px solid hsl(var(--warning)) !important;
        }
        
        [data-sonner-toast][data-type="warning"] [data-title],
        [data-sonner-toast][data-type="warning"] [data-description] {
          color: hsl(var(--warning-foreground)) !important;
        }
        
        [data-sonner-toast] [data-title] {
          color: hsl(var(--foreground)) !important;
          font-weight: 500 !important;
        }
        
        [data-sonner-toast] [data-description] {
          color: hsl(var(--foreground) / 0.7) !important;
        }
      `}</style>
      <Sonner
        theme={theme as ToasterProps['theme']}
        className="toaster group"
        toastOptions={{
          style: {
            background: 'hsl(var(--background) / 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid hsl(var(--border) / 0.5)',
            color: 'hsl(var(--foreground))',
          },
          classNames: {
            toast: 'backdrop-blur-md bg-background/85',
            title: 'text-foreground',
            description: 'text-foreground/70',
            success: 'border-l-[3px] border-l-primary',
            error: 'border-l-[3px] border-l-destructive',
            info: 'border-l-[3px] border-l-primary',
            warning: 'border-l-[3px] border-l-warning',
          },
        }}
        {...props}
      />
    </>
  )
}

export { Toaster }
