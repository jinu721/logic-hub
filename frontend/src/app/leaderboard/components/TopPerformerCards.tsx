import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Trophy, Star, Briefcase, Flame } from "lucide-react";
import { UserIF } from "@/types/user.types";
import { JSX } from "react";

interface Props {
  users: UserIF[];
}

const colorStyles: { [key: number]: { bg: string; iconBg: string; iconColor: string; title: string; icon: JSX.Element } } = {
  0: { bg: "from-yellow-500 to-amber-700", iconBg: "bg-yellow-400", iconColor: "text-yellow-900", title: "WORLD RANK 1", icon: <Star className="mr-2" /> },
  1: { bg: "from-blue-500 to-blue-700", iconBg: "bg-blue-400", iconColor: "text-blue-900", title: "WORLD RANK 2", icon: <Briefcase className="mr-2" /> },
  2: { bg: "from-green-500 to-green-700", iconBg: "bg-green-400", iconColor: "text-green-900", title: "WORLD RANK 3", icon: <Flame className="mr-2" /> },
};

const TopPerformerCards: React.FC<Props> = ({ users }) => {
  const router = useRouter();
  const top3Users = users.slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {top3Users.map((user, index) => {
        const styles = colorStyles[index];
        return (
          <motion.div
            key={user._id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 * (index + 1) }}
            onClick={() => router.push(`/profile/${user.username}`)}
            className={`bg-gradient-to-br ${styles.bg} cursor-pointer rounded-xl p-5 shadow-lg`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className={`text-white text-sm font-medium mb-1`}>
                  {styles.title} 
                </div>
                <div className="text-white text-xl font-bold flex items-center">
                  {styles.icon}
                  {user.username}
                </div>
                <div className="text-white mt-2 text-sm font-medium">
                  {user.stats.totalXpPoints} XP
                </div>
              </div>
              <div className={`w-12 h-12 ${styles.iconBg} rounded-full flex items-center justify-center`}>
                {index === 0 && <Trophy size={24} className={styles.iconColor} />}
                {index === 1 && <Briefcase size={24} className={styles.iconColor} />}
                {index === 2 && <Flame size={24} className={styles.iconColor} />}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default TopPerformerCards;
