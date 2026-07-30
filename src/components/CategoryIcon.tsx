import {
  Fingerprint, IdCard, MapPin, Landmark, Banknote, Building2, Wallet,
  GraduationCap, Briefcase, HeartPulse, Sprout, Car, Shield, Scale,
  Vote, Users, Zap, LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  fingerprint: Fingerprint,
  id: IdCard,
  pin: MapPin,
  landmark: Landmark,
  cash: Banknote,
  bank: Landmark,
  wallet: Wallet,
  cap: GraduationCap,
  brief: Briefcase,
  heart: HeartPulse,
  leaf: Sprout,
  car: Car,
  shield: Shield,
  scale: Scale,
  vote: Vote,
  building: Building2,
  users: Users,
  bolt: Zap,
};

export default function CategoryIcon({ icon, size = 16 }: { icon: string; size?: number }) {
  const Icon = MAP[icon] || Building2;
  return <Icon size={size} />;
}
