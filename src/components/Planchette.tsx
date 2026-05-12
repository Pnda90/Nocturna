import { motion } from 'framer-motion';

interface PlanchetteProps {
  position: { x: number; y: number };
  isMoving: boolean;
}

export function Planchette({ position, isMoving }: PlanchetteProps) {
  return (
    <motion.div
      className="absolute pointer-events-none z-20"
      animate={{
        x: position.x - 35,
        y: position.y - 45,
        rotate: isMoving ? [0, 1.5, -1.5, 0] : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 15,
        mass: 0.8,
        rotate: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' },
      }}
    >
      <div 
        className={`relative w-[70px] h-[90px] transition-all duration-500 ${
          isMoving ? 'scale-105' : ''
        }`}
      >
        {/* Glow effect when moving */}
        {isMoving && (
          <motion.div
            className="absolute inset-0 -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full" />
            <div className="absolute inset-2 bg-primary/20 blur-lg rounded-full" />
          </motion.div>
        )}
        
        {/* Planchette SVG - Heart/Teardrop shape */}
        <svg 
          viewBox="0 0 70 90" 
          className="w-full h-full drop-shadow-lg"
          aria-hidden="true"
        >
          {/* Main planchette body - wooden teardrop */}
          <defs>
            <linearGradient id="woodGrain" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(25, 30%, 18%)" />
              <stop offset="30%" stopColor="hsl(30, 25%, 15%)" />
              <stop offset="70%" stopColor="hsl(20, 30%, 12%)" />
              <stop offset="100%" stopColor="hsl(25, 25%, 10%)" />
            </linearGradient>
            <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(142, 40%, 50%)" stopOpacity="0.15" />
              <stop offset="50%" stopColor="hsl(142, 40%, 45%)" stopOpacity="0.08" />
              <stop offset="100%" stopColor="hsl(142, 40%, 40%)" stopOpacity="0.12" />
            </linearGradient>
            <filter id="innerShadow">
              <feOffset dx="0" dy="2" />
              <feGaussianBlur stdDeviation="2" result="offset-blur" />
              <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
              <feFlood floodColor="black" floodOpacity="0.5" result="color" />
              <feComposite operator="in" in="color" in2="inverse" result="shadow" />
              <feComposite operator="over" in="shadow" in2="SourceGraphic" />
            </filter>
          </defs>
          
          {/* Outer planchette shape */}
          <path
            d="M35 5 
               C55 5 65 25 65 40
               C65 60 50 80 35 88
               C20 80 5 60 5 40
               C5 25 15 5 35 5Z"
            fill="url(#woodGrain)"
            stroke="hsl(25, 20%, 25%)"
            strokeWidth="1.5"
            filter="url(#innerShadow)"
          />
          
          {/* Inner decorative ring */}
          <ellipse
            cx="35"
            cy="38"
            rx="22"
            ry="22"
            fill="none"
            stroke="hsl(30, 15%, 20%)"
            strokeWidth="2"
          />
          
          {/* Glass viewing window */}
          <ellipse
            cx="35"
            cy="38"
            rx="14"
            ry="14"
            fill="url(#glassGradient)"
            stroke={isMoving ? "hsl(142, 40%, 45%)" : "hsl(30, 10%, 30%)"}
            strokeWidth={isMoving ? "2" : "1.5"}
            className="transition-all duration-300"
          />
          
          {/* Center crosshair */}
          <line
            x1="35"
            y1="30"
            x2="35"
            y2="46"
            stroke={isMoving ? "hsl(142, 40%, 50%)" : "hsl(30, 10%, 40%)"}
            strokeWidth="1"
            className="transition-colors duration-300"
          />
          <line
            x1="27"
            y1="38"
            x2="43"
            y2="38"
            stroke={isMoving ? "hsl(142, 40%, 50%)" : "hsl(30, 10%, 40%)"}
            strokeWidth="1"
            className="transition-colors duration-300"
          />
          
          {/* Center dot */}
          <circle
            cx="35"
            cy="38"
            r="3"
            fill={isMoving ? "hsl(142, 40%, 50%)" : "hsl(30, 10%, 45%)"}
            className="transition-colors duration-300"
          />
          
          {/* Decorative top point */}
          <path
            d="M35 8 L38 15 L32 15 Z"
            fill="hsl(25, 20%, 22%)"
            stroke="hsl(30, 15%, 28%)"
            strokeWidth="0.5"
          />
          
          {/* Leg holes (decorative) */}
          <circle
            cx="18"
            cy="55"
            r="4"
            fill="hsl(0, 0%, 5%)"
            stroke="hsl(25, 15%, 20%)"
            strokeWidth="1"
          />
          <circle
            cx="52"
            cy="55"
            r="4"
            fill="hsl(0, 0%, 5%)"
            stroke="hsl(25, 15%, 20%)"
            strokeWidth="1"
          />
          <circle
            cx="35"
            cy="72"
            r="4"
            fill="hsl(0, 0%, 5%)"
            stroke="hsl(25, 15%, 20%)"
            strokeWidth="1"
          />
          
          {/* Subtle wood grain lines */}
          <path
            d="M15 25 Q25 30 45 25"
            fill="none"
            stroke="hsl(25, 15%, 22%)"
            strokeWidth="0.5"
            opacity="0.5"
          />
          <path
            d="M12 45 Q35 50 58 45"
            fill="none"
            stroke="hsl(25, 15%, 22%)"
            strokeWidth="0.5"
            opacity="0.4"
          />
        </svg>
        
        {/* Pulsing glow when active */}
        {isMoving && (
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary/40"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0.2, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </div>
    </motion.div>
  );
}
