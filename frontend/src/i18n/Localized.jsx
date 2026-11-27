
import { useTranslation } from "react-i18next";

export default function SSLocalized({ text }) {
  const { t } = useTranslation();
  return t(text);
}
