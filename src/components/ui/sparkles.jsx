import { motion } from "framer-motion";

export default function Sparkles({ className = "" }) {
    return (
        <motion.span
            className={`inline-block ${className}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
        >
            ✨
        </motion.span>
    );
}