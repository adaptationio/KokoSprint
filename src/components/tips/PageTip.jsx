import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTips } from '../../hooks/useTips'

export default function PageTip({ tipId, text }) {
  const { isDismissed, dismiss } = useTips()
  const [visible, setVisible] = useState(!isDismissed(tipId))

  useEffect(() => {
    if (!visible) return
    const timer = setTimeout(() => {
      dismiss(tipId)
      setVisible(false)
    }, 8000)
    return () => clearTimeout(timer)
  }, [visible, tipId, dismiss])

  if (!visible) return null

  function handleDismiss() {
    dismiss(tipId)
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
          onClick={handleDismiss}
          style={{
            maxWidth: 320,
            margin: '0 auto',
            background: 'rgba(26,26,46,0.97)',
            border: '1px solid rgba(57,255,20,0.35)',
            boxShadow: '0 0 18px rgba(57,255,20,0.2), 0 4px 24px rgba(0,0,0,0.6)',
            borderRadius: 12,
            padding: '10px 14px',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <span style={{ fontSize: 16, lineHeight: 1, flexShrink: 0 }}>💡</span>
            <p style={{ fontSize: 13, color: '#F0F0F0', lineHeight: 1.45, margin: 0, flex: 1 }}>
              {text}
            </p>
            <button
              onClick={(e) => { e.stopPropagation(); handleDismiss() }}
              style={{ color: '#8888A0', fontSize: 16, lineHeight: 1, background: 'none',
                       border: 'none', padding: 0, cursor: 'pointer', flexShrink: 0 }}
              aria-label="Dismiss tip"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
