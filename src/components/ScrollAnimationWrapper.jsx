import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function ScrollAnimationWrapper({ children, className = "", delay = 0 }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { margin: "-100px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={
                isInView
                    ? { opacity: 1, y: 0, scale: 1 }
                    : { opacity: 0, y: 50, scale: 0.9 }
            }
            transition={{
                duration: 0.6,
                delay: delay,
                ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
