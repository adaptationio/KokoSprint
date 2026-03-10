import { motion, AnimatePresence } from 'framer-motion'

export default function NeonCheckbox({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex-shrink-0 flex items-center justify-center"
      style={{ minWidth: 44, minHeight: 44 }}
      aria-checked={checked}
      role="checkbox"
    >
      <AnimatePresence mode="wait" initial={false}>
        {checked ? (
          <motion.div
            key="checked"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={[
              { scale: 1.2, opacity: 1, transition: { duration: 0.12 } },
              { scale: 1, opacity: 1, transition: { duration: 0.1, delay: 0.12 } },
            ]}
            exit={{ scale: 0.6, opacity: 0, transition: { duration: 0.1 } }}
            className="w-6 h-6 rounded-md flex items-center justify-center"
            style={{
              background: '#39FF14',
              boxShadow: '0 0 12px #39FF1488, 0 0 24px #39FF1444',
            }}
          >
            <motion.svg
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.08 }}
              width="14"
              height="11"
              viewBox="0 0 14 11"
              fill="none"
            >
              <motion.path
                d="M1 5L5 9L13 1"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.2, delay: 0.08 }}
              />
            </motion.svg>
          </motion.div>
        ) : (
          <motion.div
            key="unchecked"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { duration: 0.1 } }}
            exit={{ scale: 0.8, opacity: 0, transition: { duration: 0.08 } }}
            className="w-6 h-6 rounded-md border bg-transparent"
            style={{ borderColor: 'rgba(136,136,160,0.3)' }}
          />
        )}
      </AnimatePresence>
    </button>
  )
}
