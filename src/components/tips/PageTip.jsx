import { useState, useLayoutEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTips } from '../../hooks/useTips'

export default function PageTip({ tipId, text }) {
  const { isDismissed, dismiss } = useTips()
  const [visible, setVisible] = useState(!isDismissed(tipId))
  const [rect, setRect] = useState(null)

  const handleDismiss = useCallback(() => {
    dismiss(tipId)
    setVisible(false)
  }, [dismiss, tipId])

  useLayoutEffect(() => {
    if (!visible) return
    const el = document.querySelector(`[data-tip-anchor="${tipId}"]`)
    if (!el) { setVisible(false); return }
    setRect(el.getBoundingClientRect())

    const timer = setTimeout(handleDismiss, 8000)
    return () => clearTimeout(timer)
  }, [visible, tipId, handleDismiss])

  if (!visible || !rect) return null

  const left = Math.min(
    Math.max(rect.left + rect.width / 2, 130),
    window.innerWidth - 130
  )
  const top = Math.min(rect.bottom + 10, window.innerHeight - 160)

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
          onClick={handleDismiss}
          style={{
            position: 'fixed',
            top,
            left,
            transform: 'translateX(-50%)',
            zIndex: 55,
            maxWidth: 240,
            background: 'rgba(26,26,46,0.97)',
            border: '1px solid rgba(57,255,20,0.35)',
            boxShadow: '0 0 18px rgba(57,255,20,0.2), 0 4px 24px rgba(0,0,0,0.6)',
            borderRadius: 12,
            padding: '10px 14px',
            cursor: 'pointer',
          }}
        >
          {/* Arrow pointing up */}
          <div style={{
            position: 'absolute', top: -7, left: '50%',
            transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '7px solid transparent',
            borderRight: '7px solid transparent',
            borderBottom: '7px solid rgba(57,255,20,0.35)',
          }} />
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
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
    </AnimatePresence>,
    document.body
  )
}
